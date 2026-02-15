#!/usr/bin/env node
/**
 * 🏅 BOOMFLOW - CLI de Administración de Medallas
 * ================================================
 * Herramienta exclusiva para administradores de Sistemas Ursol
 * 
 * Uso:
 *   node scripts/grant-badge.js <usuario> <badge-id> [--admin <admin>]
 * 
 * Ejemplos:
 *   node scripts/grant-badge.js jeremy-sud first-commit --admin ursolcr
 *   node scripts/grant-badge.js ursolcr code-ninja --admin jeremy-sud
 */

const fs = require('fs');
const path = require('path');

// Rutas
const ADMINS_PATH = path.join(__dirname, '../config/admins.json');
const USERS_DIR = path.join(__dirname, '../users');
const CATALOG_PATH = path.join(__dirname, '../api-mock.json');

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, ...args) {
  console.log(color, ...args, colors.reset);
}

function loadAdmins() {
  if (!fs.existsSync(ADMINS_PATH)) {
    throw new Error('No se encontró config/admins.json');
  }
  return JSON.parse(fs.readFileSync(ADMINS_PATH, 'utf8'));
}

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error('No se encontró api-mock.json');
  }
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
}

function loadUser(username) {
  const userPath = path.join(USERS_DIR, `${username}.json`);
  if (!fs.existsSync(userPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(userPath, 'utf8'));
}

function saveUser(username, data) {
  const userPath = path.join(USERS_DIR, `${username}.json`);
  fs.writeFileSync(userPath, JSON.stringify(data, null, 2) + '\n');
}

function isAdmin(username) {
  const adminsData = loadAdmins();
  return adminsData.admins.some(a => a.username === username);
}

function getBadgeInfo(badgeId) {
  const catalog = loadCatalog();
  return catalog.find(b => b.id === badgeId);
}

function grantBadge(targetUser, badgeId, adminUser) {
  log(colors.cyan, '🏅 BOOMFLOW - Otorgar Medalla');
  log(colors.cyan, '============================\n');

  // Verificar que el administrador sea válido
  if (!isAdmin(adminUser)) {
    log(colors.red, `❌ Error: "${adminUser}" no es un administrador autorizado.`);
    log(colors.yellow, '\n📋 Administradores autorizados:');
    const adminsData = loadAdmins();
    adminsData.admins.forEach(a => {
      log(colors.yellow, `   - ${a.username} (${a.displayName})`);
    });
    process.exit(1);
  }

  // Verificar que la medalla exista
  const badge = getBadgeInfo(badgeId);
  if (!badge) {
    log(colors.red, `❌ Error: Medalla "${badgeId}" no encontrada en el catálogo.`);
    log(colors.yellow, '\n💡 Usa "node scripts/list-badges.js" para ver medallas disponibles.');
    process.exit(1);
  }

  // Cargar o crear usuario
  let userData = loadUser(targetUser);
  if (!userData) {
    log(colors.yellow, `⚠️  Usuario "${targetUser}" no existe. Creando perfil nuevo...`);
    userData = {
      username: targetUser,
      displayName: targetUser,
      role: 'Colaborador',
      org: 'SistemasUrsol',
      joinedAt: new Date().toISOString().split('T')[0],
      badges: []
    };
  }

  // Verificar si ya tiene la medalla
  const existingBadge = userData.badges.find(b => b.id === badgeId);
  if (existingBadge) {
    log(colors.yellow, `⚠️  "${targetUser}" ya tiene la medalla "${badge.label}".`);
    log(colors.yellow, `   Otorgada el ${existingBadge.awardedAt} por ${existingBadge.awardedBy}`);
    process.exit(0);
  }

  // Otorgar medalla
  const newBadge = {
    id: badgeId,
    awardedAt: new Date().toISOString().split('T')[0],
    awardedBy: adminUser,
    meta: badge.meta || ''
  };

  userData.badges.push(newBadge);
  saveUser(targetUser, userData);

  log(colors.green, '✅ ¡Medalla otorgada exitosamente!\n');
  log(colors.blue, '📋 Detalles:');
  log(colors.reset, `   👤 Usuario:    ${targetUser}`);
  log(colors.reset, `   🏅 Medalla:    ${badge.label} (${badge.tier})`);
  log(colors.reset, `   📅 Fecha:      ${newBadge.awardedAt}`);
  log(colors.reset, `   👑 Otorgada por: ${adminUser}`);
  log(colors.reset, `   📁 Categoría:  ${badge.category}`);
  
  log(colors.magenta, `\n🎉 ${targetUser} ahora tiene ${userData.badges.length} medalla(s).`);
  log(colors.yellow, '\n💡 Recuerda hacer commit y push para sincronizar los cambios.');
}

function revokeBadge(targetUser, badgeId, adminUser) {
  log(colors.cyan, '🏅 BOOMFLOW - Revocar Medalla');
  log(colors.cyan, '============================\n');

  // Verificar administrador
  if (!isAdmin(adminUser)) {
    log(colors.red, `❌ Error: "${adminUser}" no es un administrador autorizado.`);
    process.exit(1);
  }

  // Cargar usuario
  const userData = loadUser(targetUser);
  if (!userData) {
    log(colors.red, `❌ Error: Usuario "${targetUser}" no encontrado.`);
    process.exit(1);
  }

  // Buscar medalla
  const badgeIndex = userData.badges.findIndex(b => b.id === badgeId);
  if (badgeIndex === -1) {
    log(colors.yellow, `⚠️  "${targetUser}" no tiene la medalla "${badgeId}".`);
    process.exit(0);
  }

  const removedBadge = userData.badges[badgeIndex];
  userData.badges.splice(badgeIndex, 1);
  saveUser(targetUser, userData);

  log(colors.green, '✅ Medalla revocada exitosamente.\n');
  log(colors.reset, `   👤 Usuario:    ${targetUser}`);
  log(colors.reset, `   🏅 Medalla:    ${badgeId}`);
  log(colors.reset, `   👑 Revocada por: ${adminUser}`);
  log(colors.reset, `\n   ${targetUser} ahora tiene ${userData.badges.length} medalla(s).`);
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
🏅 BOOMFLOW - CLI de Administración de Medallas
================================================
Herramienta exclusiva para administradores de Sistemas Ursol

USO:
  node scripts/badge-admin.js <comando> [opciones]

COMANDOS:
  grant <usuario> <badge-id> --admin <admin>
    Otorga una medalla a un usuario
    
  revoke <usuario> <badge-id> --admin <admin>
    Revoca una medalla de un usuario
    
  list-admins
    Muestra los administradores autorizados
    
  user <usuario>
    Muestra las medallas de un usuario

EJEMPLOS:
  node scripts/badge-admin.js grant jeremy-sud first-commit --admin ursolcr
  node scripts/badge-admin.js revoke jeremy-sud code-ninja --admin jeremy-sud
  node scripts/badge-admin.js list-admins
  node scripts/badge-admin.js user jeremy-sud
`);
}

function listAdmins() {
  const adminsData = loadAdmins();
  log(colors.cyan, '\n🛡️ Administradores Autorizados de BOOMFLOW');
  log(colors.cyan, '==========================================\n');
  
  adminsData.admins.forEach(admin => {
    log(colors.green, `👑 ${admin.username}`);
    log(colors.reset, `   Nombre:    ${admin.displayName}`);
    log(colors.reset, `   Rol:       ${admin.role}`);
    log(colors.reset, `   Permisos:  ${admin.permissions.join(', ')}`);
    log(colors.reset, `   Desde:     ${admin.addedAt}\n`);
  });
}

function showUser(username) {
  const userData = loadUser(username);
  if (!userData) {
    log(colors.red, `❌ Usuario "${username}" no encontrado.`);
    process.exit(1);
  }
  
  log(colors.cyan, `\n👤 Perfil de ${userData.displayName || username}`);
  log(colors.cyan, '==========================================\n');
  log(colors.reset, `   Username:  ${userData.username}`);
  log(colors.reset, `   Rol:       ${userData.role || 'N/A'}`);
  log(colors.reset, `   Org:       ${userData.org || 'N/A'}`);
  log(colors.reset, `   Desde:     ${userData.joinedAt || 'N/A'}`);
  log(colors.reset, `   Medallas:  ${userData.badges.length}\n`);
  
  if (userData.badges.length > 0) {
    log(colors.yellow, '🏅 Medallas:');
    userData.badges.forEach(badge => {
      const info = getBadgeInfo(badge.id);
      const label = info ? info.label : badge.id;
      log(colors.reset, `   - ${label}`);
      log(colors.reset, `     Otorgada: ${badge.awardedAt} por ${badge.awardedBy}`);
    });
  }
}

// Parsear argumentos
if (args.length === 0 || command === 'help' || command === '--help') {
  showHelp();
  process.exit(0);
}

if (command === 'list-admins') {
  listAdmins();
  process.exit(0);
}

if (command === 'user') {
  const username = args[1];
  if (!username) {
    log(colors.red, '❌ Error: Especifica un usuario.');
    process.exit(1);
  }
  showUser(username);
  process.exit(0);
}

if (command === 'grant' || command === 'revoke') {
  const targetUser = args[1];
  const badgeId = args[2];
  const adminIndex = args.indexOf('--admin');
  const adminUser = adminIndex !== -1 ? args[adminIndex + 1] : null;
  
  if (!targetUser || !badgeId) {
    log(colors.red, '❌ Error: Especifica usuario y badge-id.');
    showHelp();
    process.exit(1);
  }
  
  if (!adminUser) {
    log(colors.red, '❌ Error: Especifica --admin <admin-username>');
    process.exit(1);
  }
  
  if (command === 'grant') {
    grantBadge(targetUser, badgeId, adminUser);
  } else {
    revokeBadge(targetUser, badgeId, adminUser);
  }
  process.exit(0);
}

log(colors.red, `❌ Comando desconocido: ${command}`);
showHelp();
process.exit(1);
