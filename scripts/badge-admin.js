#!/usr/bin/env node
/**
 * 🏅 BOOMFLOW - Badge Administration CLI
 * ================================================
 * Exclusive tool for Sistemas Ursol administrators
 * 
 * Usage:
 *   node scripts/grant-badge.js <user> <badge-id> [--admin <admin>]
 * 
 * Examples:
 *   node scripts/grant-badge.js jeremy-sud first-commit --admin ursolcr
 *   node scripts/grant-badge.js ursolcr code-ninja --admin jeremy-sud
 */

const fs = require('fs');
const path = require('path');

// Paths
const ADMINS_PATH = path.join(__dirname, '../config/admins.json');
const USERS_DIR = path.join(__dirname, '../users');
const CATALOG_PATH = path.join(__dirname, '../api-mock.json');

// Console colors
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
    throw new Error('config/admins.json not found');
  }
  return JSON.parse(fs.readFileSync(ADMINS_PATH, 'utf8'));
}

function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error('api-mock.json not found');
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
  log(colors.cyan, '🏅 BOOMFLOW - Award Badge');
  log(colors.cyan, '============================\n');

  // Verify that the administrator is valid
  if (!isAdmin(adminUser)) {
    log(colors.red, `❌ Error: "${adminUser}" is not an authorized administrator.`);
    log(colors.yellow, '\n📋 Authorized administrators:');
    const adminsData = loadAdmins();
    adminsData.admins.forEach(a => {
      log(colors.yellow, `   - ${a.username} (${a.displayName})`);
    });
    process.exit(1);
  }

  // Verify that the badge exists
  const badge = getBadgeInfo(badgeId);
  if (!badge) {
    log(colors.red, `❌ Error: Badge "${badgeId}" not found in catalog.`);
    log(colors.yellow, '\n💡 Use "node scripts/list-badges.js" to see available badges.');
    process.exit(1);
  }

  // Load or create user
  let userData = loadUser(targetUser);
  if (!userData) {
    log(colors.yellow, `⚠️  User "${targetUser}" doesn't exist. Creating new profile...`);
    userData = {
      username: targetUser,
      displayName: targetUser,
      role: 'Colaborador',
      org: 'SistemasUrsol',
      joinedAt: new Date().toISOString().split('T')[0],
      badges: []
    };
  }

  // Check if user already has the badge
  const existingBadge = userData.badges.find(b => b.id === badgeId);
  if (existingBadge) {
    log(colors.yellow, `⚠️  "${targetUser}" already has the badge "${badge.label}".`);
    log(colors.yellow, `   Awarded on ${existingBadge.awardedAt} by ${existingBadge.awardedBy}`);
    process.exit(0);
  }

  // Award badge
  const newBadge = {
    id: badgeId,
    awardedAt: new Date().toISOString().split('T')[0],
    awardedBy: adminUser,
    meta: badge.meta || ''
  };

  userData.badges.push(newBadge);
  saveUser(targetUser, userData);

  log(colors.green, '✅ Badge awarded successfully!\n');
  log(colors.blue, '📋 Details:');
  log(colors.reset, `   👤 User:       ${targetUser}`);
  log(colors.reset, `   🏅 Badge:      ${badge.label} (${badge.tier})`);
  log(colors.reset, `   📅 Date:       ${newBadge.awardedAt}`);
  log(colors.reset, `   👑 Awarded by: ${adminUser}`);
  log(colors.reset, `   📁 Category:   ${badge.category}`);
  
  log(colors.magenta, `\n🎉 ${targetUser} now has ${userData.badges.length} badge(s).`);
  log(colors.yellow, '\n💡 Remember to commit and push to sync changes.');
}

function revokeBadge(targetUser, badgeId, adminUser) {
  log(colors.cyan, '🏅 BOOMFLOW - Revoke Badge');
  log(colors.cyan, '============================\n');

  // Verify administrator
  if (!isAdmin(adminUser)) {
    log(colors.red, `❌ Error: "${adminUser}" is not an authorized administrator.`);
    process.exit(1);
  }

  // Load user
  const userData = loadUser(targetUser);
  if (!userData) {
    log(colors.red, `❌ Error: User "${targetUser}" not found.`);
    process.exit(1);
  }

  // Find badge
  const badgeIndex = userData.badges.findIndex(b => b.id === badgeId);
  if (badgeIndex === -1) {
    log(colors.yellow, `⚠️  "${targetUser}" doesn't have the badge "${badgeId}".`);
    process.exit(0);
  }

  const removedBadge = userData.badges[badgeIndex];
  userData.badges.splice(badgeIndex, 1);
  saveUser(targetUser, userData);

  log(colors.green, '✅ Badge revoked successfully.\n');
  log(colors.reset, `   👤 User:       ${targetUser}`);
  log(colors.reset, `   🏅 Badge:      ${badgeId}`);
  log(colors.reset, `   👑 Revoked by: ${adminUser}`);
  log(colors.reset, `\n   ${targetUser} now has ${userData.badges.length} badge(s).`);
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
🏅 BOOMFLOW - Badge Administration CLI
================================================
Exclusive tool for Sistemas Ursol administrators

USAGE:
  node scripts/badge-admin.js <command> [options]

COMMANDS:
  grant <user> <badge-id> --admin <admin>
    Awards a badge to a user
    
  revoke <user> <badge-id> --admin <admin>
    Revokes a badge from a user
    
  list-admins
    Shows authorized administrators
    
  user <username>
    Shows a user's badges

EXAMPLES:
  node scripts/badge-admin.js grant jeremy-sud first-commit --admin ursolcr
  node scripts/badge-admin.js revoke jeremy-sud code-ninja --admin jeremy-sud
  node scripts/badge-admin.js list-admins
  node scripts/badge-admin.js user jeremy-sud
`);
}

function listAdmins() {
  const adminsData = loadAdmins();
  log(colors.cyan, '\n🛡️ Authorized BOOMFLOW Administrators');
  log(colors.cyan, '==========================================\n');
  
  adminsData.admins.forEach(admin => {
    log(colors.green, `👑 ${admin.username}`);
    log(colors.reset, `   Name:      ${admin.displayName}`);
    log(colors.reset, `   Role:      ${admin.role}`);
    log(colors.reset, `   Permissions: ${admin.permissions.join(', ')}`);
    log(colors.reset, `   Since:     ${admin.addedAt}\n`);
  });
}

function showUser(username) {
  const userData = loadUser(username);
  if (!userData) {
    log(colors.red, `❌ User "${username}" not found.`);
    process.exit(1);
  }
  
  log(colors.cyan, `\n👤 Profile of ${userData.displayName || username}`);
  log(colors.cyan, '==========================================\n');
  log(colors.reset, `   Username:  ${userData.username}`);
  log(colors.reset, `   Role:      ${userData.role || 'N/A'}`);
  log(colors.reset, `   Org:       ${userData.org || 'N/A'}`);
  log(colors.reset, `   Since:     ${userData.joinedAt || 'N/A'}`);
  log(colors.reset, `   Badges:    ${userData.badges.length}\n`);
  
  if (userData.badges.length > 0) {
    log(colors.yellow, '🏅 Badges:');
    userData.badges.forEach(badge => {
      const info = getBadgeInfo(badge.id);
      const label = info ? info.label : badge.id;
      log(colors.reset, `   - ${label}`);
      log(colors.reset, `     Awarded: ${badge.awardedAt} by ${badge.awardedBy}`);
    });
  }
}

// Parse arguments
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
    log(colors.red, '❌ Error: Specify a user.');
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
    log(colors.red, '❌ Error: Specify user and badge-id.');
    showHelp();
    process.exit(1);
  }
  
  if (!adminUser) {
    log(colors.red, '❌ Error: Specify --admin <admin-username>');
    process.exit(1);
  }
  
  if (command === 'grant') {
    grantBadge(targetUser, badgeId, adminUser);
  } else {
    revokeBadge(targetUser, badgeId, adminUser);
  }
  process.exit(0);
}

log(colors.red, `❌ Unknown command: ${command}`);
showHelp();
process.exit(1);
