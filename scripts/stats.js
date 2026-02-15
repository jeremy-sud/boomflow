#!/usr/bin/env node
/**
 * 📊 BOOMFLOW - Estadísticas y Resumen
 * ====================================
 * Muestra un resumen del estado actual de BOOMFLOW
 */

const fs = require('fs');
const path = require('path');

const USERS_DIR = path.join(__dirname, '../users');
const CATALOG_PATH = path.join(__dirname, '../api-mock.json');
const ADMINS_PATH = path.join(__dirname, '../config/admins.json');

// Colores
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

function loadUsers() {
  const users = [];
  if (!fs.existsSync(USERS_DIR)) return users;
  
  const files = fs.readdirSync(USERS_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(USERS_DIR, file), 'utf8'));
    users.push(data);
  }
  return users;
}

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) return [];
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
}

function loadAdmins() {
  if (!fs.existsSync(ADMINS_PATH)) return { admins: [] };
  return JSON.parse(fs.readFileSync(ADMINS_PATH, 'utf8'));
}

function printHeader() {
  console.log('');
  console.log(c.bgMagenta + c.white + c.bold + '                                              ' + c.reset);
  console.log(c.bgMagenta + c.white + c.bold + '      🌸 BOOMFLOW - Panel de Estadísticas     ' + c.reset);
  console.log(c.bgMagenta + c.white + c.bold + '                                              ' + c.reset);
  console.log('');
}

function printSection(title) {
  console.log(c.cyan + c.bold + `═══════════════════════════════════════════════════════`);
  console.log(c.cyan + c.bold + ` ${title}`);
  console.log(c.cyan + c.bold + `═══════════════════════════════════════════════════════` + c.reset);
}

function main() {
  printHeader();
  
  const users = loadUsers();
  const catalog = loadCatalog();
  const admins = loadAdmins();
  
  // === RESUMEN GENERAL ===
  printSection('📊 RESUMEN GENERAL');
  
  const totalBadges = users.reduce((sum, u) => sum + (u.badges?.length || 0), 0);
  const avgBadges = users.length > 0 ? (totalBadges / users.length).toFixed(1) : 0;
  
  console.log(`${c.white}  👥 Colaboradores registrados:  ${c.green}${users.length}${c.reset}`);
  console.log(`${c.white}  🏅 Medallas disponibles:        ${c.yellow}${catalog.length}${c.reset}`);
  console.log(`${c.white}  🎯 Medallas otorgadas (total):  ${c.magenta}${totalBadges}${c.reset}`);
  console.log(`${c.white}  📈 Promedio por colaborador:    ${c.blue}${avgBadges}${c.reset}`);
  console.log(`${c.white}  👑 Administradores:             ${c.cyan}${admins.admins?.length || 0}${c.reset}`);
  console.log('');
  
  // === TOP COLABORADORES ===
  printSection('🏆 TOP COLABORADORES');
  
  const sortedUsers = [...users].sort((a, b) => 
    (b.badges?.length || 0) - (a.badges?.length || 0)
  );
  
  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  
  sortedUsers.slice(0, 5).forEach((user, i) => {
    const medal = medals[i] || '  ';
    const badgeCount = user.badges?.length || 0;
    const bar = '█'.repeat(Math.min(badgeCount, 20));
    const displayName = user.displayName || user.username;
    const role = user.role ? c.dim + ` (${user.role})` + c.reset : '';
    
    console.log(`  ${medal} ${c.white}${displayName.padEnd(20)}${role}`);
    console.log(`     ${c.green}${bar}${c.reset} ${c.bold}${badgeCount}${c.reset} medallas`);
  });
  console.log('');
  
  // === DESGLOSE POR CATEGORÍA ===
  printSection('📁 MEDALLAS POR CATEGORÍA');
  
  const categoryCounts = {};
  for (const user of users) {
    for (const badge of (user.badges || [])) {
      const catalogBadge = catalog.find(b => b.id === badge.id);
      const category = catalogBadge?.category || 'other';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  }
  
  const categoryEmoji = {
    onboarding: '🟢',
    coding: '🔵',
    devops: '🟣',
    collaboration: '🟡',
    leadership: '🔴',
    documentation: '⚪',
    growth: '🟠',
    quality: '🟤',
    milestone: '⭐',
    other: '⬜'
  };
  
  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1]);
  
  for (const [cat, count] of sortedCategories) {
    const emoji = categoryEmoji[cat] || '⬜';
    const bar = '▓'.repeat(Math.min(count, 15));
    console.log(`  ${emoji} ${cat.padEnd(15)} ${c.yellow}${bar}${c.reset} ${count}`);
  }
  console.log('');
  
  // === MEDALLAS RECIENTES ===
  printSection('🕐 ACTIVIDAD RECIENTE');
  
  const allBadges = [];
  for (const user of users) {
    for (const badge of (user.badges || [])) {
      allBadges.push({
        ...badge,
        username: user.username,
        displayName: user.displayName
      });
    }
  }
  
  const recentBadges = allBadges
    .filter(b => b.awardedAt)
    .sort((a, b) => new Date(b.awardedAt) - new Date(a.awardedAt))
    .slice(0, 5);
  
  for (const badge of recentBadges) {
    const catalogBadge = catalog.find(b => b.id === badge.id);
    const emoji = catalogBadge?.emoji || '🏅';
    const label = catalogBadge?.label || badge.id;
    const by = badge.awardedBy === 'auto-award-system' ? '🤖 auto' : 
               badge.awardedBy === 'github-webhook' ? '🎯 webhook' :
               `👤 ${badge.awardedBy}`;
    
    console.log(`  ${emoji} ${c.white}${label}${c.reset} → @${badge.username}`);
    console.log(`     ${c.dim}${badge.awardedAt} | ${by}${c.reset}`);
  }
  console.log('');
  
  // === ADMINISTRADORES ===
  printSection('👑 ADMINISTRADORES');
  
  for (const admin of (admins.admins || [])) {
    console.log(`  👑 ${c.cyan}@${admin.username}${c.reset}`);
    console.log(`     ${c.dim}${admin.displayName} - ${admin.role}${c.reset}`);
  }
  console.log('');
  
  // === FOOTER ===
  console.log(c.dim + '─'.repeat(55) + c.reset);
  console.log(c.dim + `  📅 Generado: ${new Date().toISOString()}` + c.reset);
  console.log(c.dim + `  🌸 BOOMFLOW - Sistemas Ursol` + c.reset);
  console.log('');
}

main();
