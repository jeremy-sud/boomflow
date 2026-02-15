#!/usr/bin/env node
/**
 * 🌸 BOOMFLOW - Sincronizador de Perfil con Vistas Adaptativas
 * =============================================================
 * Sincroniza medallas de UN solo usuario a su perfil de GitHub.
 * 
 * SISTEMA DE VISTAS ADAPTATIVAS:
 * - Vista Normal (1-12 medallas): Tabla con iconos grandes 48px
 * - Vista Compacta (13-30 medallas): Iconos 32px, más por fila
 * - Vista Mini (31+ medallas): Iconos 24px agrupados por tier
 * 
 * Uso: node scripts/sync-profile.js <username> <readme-path> [--view=normal|compact|mini]
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const CATALOG_PATH = path.join(__dirname, '../api-mock.json');
const USERS_DIR = path.join(__dirname, '../users');
const REPO_BASE_URL = 'https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets';

// Umbrales para cambio de vista automático
const THRESHOLD_COMPACT = 12;  // Más de 12 → vista compacta
const THRESHOLD_MINI = 30;     // Más de 30 → vista mini

const TIER_ICON = { bronze: '🥉', silver: '🥈', gold: '🥇' };
const TIER_ORDER = { gold: 1, silver: 2, bronze: 3 };

const CATEGORIES = {
  onboarding: { emoji: '🟢', label: 'Onboarding' },
  coding: { emoji: '🔵', label: 'Coding' },
  devops: { emoji: '🟣', label: 'DevOps' },
  collaboration: { emoji: '🩷', label: 'Colaboración' },
  leadership: { emoji: '🟡', label: 'Liderazgo' },
  documentation: { emoji: '📚', label: 'Documentación' },
  growth: { emoji: '🌱', label: 'Crecimiento' },
  milestones: { emoji: '❤️', label: 'Hitos' },
  special: { emoji: '⭐', label: 'Especial' },
};

// ============================================================================
// GENERADORES DE VISTAS
// ============================================================================

/**
 * Vista Normal: Tabla con iconos grandes, nombre y tier
 * Para 1-12 medallas
 */
function generateNormalView(userBadges, grouped, userData) {
  const role = userData.role ? ` — ${userData.role}` : '';
  let section = `\n### 🏅 ${userData.displayName || userData.username}${role}\n`;
  section += `> ${userBadges.length} medallas obtenidas\n\n`;
  section += `<table>\n`;
  
  for (const [catKey, catInfo] of Object.entries(CATEGORIES)) {
    const badges = grouped[catKey];
    if (!badges || badges.length === 0) continue;
    
    section += `<tr><td colspan="6"><strong>${catInfo.emoji} ${catInfo.label}</strong></td></tr>\n`;
    section += `<tr>\n`;
    
    for (const badge of badges) {
      const tierIcon = TIER_ICON[badge.tier] || '';
      const svgUrl = `${REPO_BASE_URL}/${badge.svg}`;
      section += `<td align="center" width="80">\n`;
      section += `  <img src="${svgUrl}" width="48" height="48" alt="${badge.label}"/><br/>\n`;
      section += `  <sub>${tierIcon} <strong>${badge.label}</strong></sub><br/>\n`;
      section += `  <sub>${badge.meta}</sub>\n`;
      section += `</td>\n`;
    }
    
    section += `</tr>\n`;
  }
  
  section += `</table>\n\n`;
  return section;
}

/**
 * Vista Compacta: Iconos más pequeños, sin meta, más por fila
 * Para 13-30 medallas
 */
function generateCompactView(userBadges, grouped, userData) {
  const role = userData.role ? ` — ${userData.role}` : '';
  let section = `\n### 🏅 ${userData.displayName || userData.username}${role}\n`;
  
  // Resumen por tier
  const tierCounts = { gold: 0, silver: 0, bronze: 0 };
  userBadges.forEach(b => tierCounts[b.tier]++);
  section += `> **${userBadges.length} medallas:** `;
  section += `🥇 ${tierCounts.gold} · 🥈 ${tierCounts.silver} · 🥉 ${tierCounts.bronze}\n\n`;
  
  section += `<table>\n`;
  
  for (const [catKey, catInfo] of Object.entries(CATEGORIES)) {
    const badges = grouped[catKey];
    if (!badges || badges.length === 0) continue;
    
    // Ordenar por tier (oro primero)
    badges.sort((a, b) => (TIER_ORDER[a.tier] || 4) - (TIER_ORDER[b.tier] || 4));
    
    section += `<tr><td colspan="8"><sub><strong>${catInfo.emoji} ${catInfo.label}</strong> (${badges.length})</sub></td></tr>\n`;
    
    // Dividir en filas de 8
    for (let i = 0; i < badges.length; i += 8) {
      section += `<tr>\n`;
      const rowBadges = badges.slice(i, i + 8);
      
      for (const badge of rowBadges) {
        const tierIcon = TIER_ICON[badge.tier] || '';
        const svgUrl = `${REPO_BASE_URL}/${badge.svg}`;
        section += `<td align="center" width="60">\n`;
        section += `  <img src="${svgUrl}" width="32" height="32" alt="${badge.label}" title="${badge.label}"/><br/>\n`;
        section += `  <sub>${tierIcon}</sub>\n`;
        section += `</td>\n`;
      }
      
      section += `</tr>\n`;
    }
  }
  
  section += `</table>\n\n`;
  return section;
}

/**
 * Vista Mini: Solo iconos pequeños agrupados por tier
 * Para 31+ medallas
 */
function generateMiniView(userBadges, grouped, userData) {
  const role = userData.role ? ` — ${userData.role}` : '';
  let section = `\n### 🏅 ${userData.displayName || userData.username}${role}\n`;
  
  // Agrupar por tier
  const byTier = { gold: [], silver: [], bronze: [] };
  userBadges.forEach(b => {
    if (byTier[b.tier]) byTier[b.tier].push(b);
  });
  
  section += `> **${userBadges.length} medallas obtenidas**\n\n`;
  
  // Generar cada sección de tier
  for (const [tier, tierBadges] of Object.entries(byTier)) {
    if (tierBadges.length === 0) continue;
    
    const tierIcon = TIER_ICON[tier];
    const tierLabel = tier === 'gold' ? 'Oro' : tier === 'silver' ? 'Plata' : 'Bronce';
    
    section += `<details>\n`;
    section += `<summary><strong>${tierIcon} ${tierLabel}</strong> (${tierBadges.length} medallas)</summary>\n\n`;
    section += `<p>\n`;
    
    for (const badge of tierBadges) {
      const svgUrl = `${REPO_BASE_URL}/${badge.svg}`;
      section += `<img src="${svgUrl}" width="24" height="24" alt="${badge.label}" title="${badge.label}"/> `;
    }
    
    section += `\n</p>\n`;
    section += `</details>\n\n`;
  }
  
  // También mostrar resumen por categoría colapsado
  section += `<details>\n`;
  section += `<summary>📊 Ver por categoría</summary>\n\n`;
  
  for (const [catKey, catInfo] of Object.entries(CATEGORIES)) {
    const badges = grouped[catKey];
    if (!badges || badges.length === 0) continue;
    
    section += `**${catInfo.emoji} ${catInfo.label}** (${badges.length}): `;
    section += badges.map(b => `${TIER_ICON[b.tier]}`).join(' ');
    section += `\n\n`;
  }
  
  section += `</details>\n\n`;
  
  return section;
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

function syncProfile(username, readmePath, forceView = null) {
  console.log(`🌸 Sincronizando medallas de @${username}...`);
  
  // Cargar catálogo
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const catalogIndex = {};
  for (const b of catalog) catalogIndex[b.id] = b;
  
  // Cargar usuario específico
  const userPath = path.join(USERS_DIR, `${username}.json`);
  if (!fs.existsSync(userPath)) {
    console.error(`❌ Usuario ${username} no encontrado`);
    process.exit(1);
  }
  
  const userData = JSON.parse(fs.readFileSync(userPath, 'utf8'));
  
  // Construir badges
  const userBadges = userData.badges.map(ub => {
    const cb = catalogIndex[ub.id];
    if (!cb) return null;
    return { ...cb, ...ub };
  }).filter(Boolean);
  
  // Agrupar por categoría
  const grouped = {};
  for (const badge of userBadges) {
    const cat = badge.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(badge);
  }
  
  // Determinar vista a usar
  let viewMode;
  if (forceView) {
    viewMode = forceView;
  } else if (userBadges.length <= THRESHOLD_COMPACT) {
    viewMode = 'normal';
  } else if (userBadges.length <= THRESHOLD_MINI) {
    viewMode = 'compact';
  } else {
    viewMode = 'mini';
  }
  
  console.log(`📊 ${userBadges.length} medallas → Vista: ${viewMode.toUpperCase()}`);
  
  // Generar sección HTML según la vista
  let section;
  switch (viewMode) {
    case 'compact':
      section = generateCompactView(userBadges, grouped, userData);
      break;
    case 'mini':
      section = generateMiniView(userBadges, grouped, userData);
      break;
    default:
      section = generateNormalView(userBadges, grouped, userData);
  }
  
  // Agregar footer
  section += `> 🌸 Verificado por [BOOMFLOW](https://github.com/jeremy-sud/boomflow) @ [SistemasUrsol](https://www.ursol.com)\n`;
  
  // Actualizar README
  if (!fs.existsSync(readmePath)) {
    console.error(`❌ README no encontrado: ${readmePath}`);
    process.exit(1);
  }
  
  let content = fs.readFileSync(readmePath, 'utf8');
  
  const START_TAG = '<!-- BOOMFLOW-BADGES-START -->';
  const END_TAG = '<!-- BOOMFLOW-BADGES-END -->';
  const regex = new RegExp(`${START_TAG}[\\s\\S]*?${END_TAG}`, 'g');
  
  if (!regex.test(content)) {
    console.error('❌ Marcadores BOOMFLOW no encontrados en el README');
    process.exit(1);
  }
  
  regex.lastIndex = 0;
  const newContent = `${START_TAG}${section}${END_TAG}`;
  content = content.replace(regex, newContent);
  
  fs.writeFileSync(readmePath, content);
  console.log(`✅ README actualizado con ${userBadges.length} medallas de @${username} (vista ${viewMode})`);
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const username = args[0] || 'jeremy-sud';
const readmePath = args[1] || '/home/dawnweaber/Workspace/jeremy-sud/README.md';

// Detectar --view=xxx
let forceView = null;
for (const arg of args) {
  if (arg.startsWith('--view=')) {
    forceView = arg.replace('--view=', '');
    if (!['normal', 'compact', 'mini'].includes(forceView)) {
      console.error(`❌ Vista inválida: ${forceView}. Usa: normal, compact, mini`);
      process.exit(1);
    }
  }
}

syncProfile(username, readmePath, forceView);
