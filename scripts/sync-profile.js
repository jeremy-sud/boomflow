#!/usr/bin/env node
/**
 * Sincroniza medallas de UN solo usuario a su perfil
 * Uso: node scripts/sync-profile.js <username> <readme-path>
 */

const fs = require('fs');
const path = require('path');

const CATALOG_PATH = path.join(__dirname, '../api-mock.json');
const USERS_DIR = path.join(__dirname, '../users');
const REPO_BASE_URL = 'https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets';

const TIER_ICON = { bronze: '🥉', silver: '🥈', gold: '🥇' };
const CATEGORIES = {
  onboarding: { emoji: '🟢', label: 'Onboarding' },
  coding: { emoji: '🔵', label: 'Coding' },
  devops: { emoji: '🟣', label: 'DevOps' },
  collaboration: { emoji: '🟡', label: 'Colaboración' },
  leadership: { emoji: '🔴', label: 'Liderazgo' },
  documentation: { emoji: '⚪', label: 'Documentación' },
};

function syncProfile(username, readmePath) {
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
  
  // Construir sección HTML
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
  console.log(`✅ README actualizado con ${userBadges.length} medallas de @${username}`);
}

// CLI
const args = process.argv.slice(2);
const username = args[0] || 'jeremy-sud';
const readmePath = args[1] || '/home/dawnweaber/Workspace/jeremy-sud/README.md';

syncProfile(username, readmePath);
