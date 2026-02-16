#!/usr/bin/env node
/**
 * 🌸 BOOMFLOW - Profile Synchronizer with Adaptive Views
 * =============================================================
 * Syncs badges for a SINGLE user to their GitHub profile.
 * 
 * ADAPTIVE VIEWS SYSTEM:
 * - Normal View (1-12 badges): Table with large 48px icons
 * - Compact View (13-30 badges): 32px icons, more per row
 * - Mini View (31+ badges): 24px icons grouped by tier
 * 
 * Usage: node scripts/sync-profile.js <username> <readme-path> [--view=normal|compact|mini]
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CATALOG_PATH = path.join(__dirname, '../api-mock.json');
const USERS_DIR = path.join(__dirname, '../users');
const REPO_BASE_URL = 'https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets';

// Thresholds for automatic view change
const THRESHOLD_COMPACT = 12;  // More than 12 → compact view
const THRESHOLD_MINI = 30;     // More than 30 → mini view

const TIER_ICON = { bronze: '🥉', silver: '🥈', gold: '🥇' };
const TIER_ORDER = { gold: 1, silver: 2, bronze: 3 };

const CATEGORIES = {
  onboarding: { emoji: '🟢', label: 'Onboarding' },
  coding: { emoji: '🔵', label: 'Coding' },
  devops: { emoji: '🟣', label: 'DevOps' },
  collaboration: { emoji: '🩷', label: 'Collaboration' },
  leadership: { emoji: '🟡', label: 'Leadership' },
  documentation: { emoji: '📚', label: 'Documentation' },
  growth: { emoji: '🌱', label: 'Growth' },
  milestones: { emoji: '❤️', label: 'Milestones' },
  special: { emoji: '⭐', label: 'Special' },
};

// ============================================================================
// VIEW GENERATORS
// ============================================================================

/**
 * Normal View: Table with large icons, name and tier
 * For 1-12 badges
 */
function generateNormalView(userBadges, grouped, userData) {
  const role = userData.role ? ` — ${userData.role}` : '';
  let section = `\n### 🏅 ${userData.displayName || userData.username}${role}\n`;
  section += `> ${userBadges.length} badges earned\n\n`;
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
 * Compact View: Smaller icons, no meta, more per row
 * For 13-30 badges
 */
function generateCompactView(userBadges, grouped, userData) {
  const role = userData.role ? ` — ${userData.role}` : '';
  let section = `\n### 🏅 ${userData.displayName || userData.username}${role}\n`;
  
  // Summary by tier
  const tierCounts = { gold: 0, silver: 0, bronze: 0 };
  userBadges.forEach(b => tierCounts[b.tier]++);
  section += `> **${userBadges.length} badges:** `;
  section += `🥇 ${tierCounts.gold} · 🥈 ${tierCounts.silver} · 🥉 ${tierCounts.bronze}\n\n`;
  
  section += `<table>\n`;
  
  for (const [catKey, catInfo] of Object.entries(CATEGORIES)) {
    const badges = grouped[catKey];
    if (!badges || badges.length === 0) continue;
    
    // Sort by tier (gold first)
    badges.sort((a, b) => (TIER_ORDER[a.tier] || 4) - (TIER_ORDER[b.tier] || 4));
    
    section += `<tr><td colspan="8"><sub><strong>${catInfo.emoji} ${catInfo.label}</strong> (${badges.length})</sub></td></tr>\n`;
    
    // Split into rows of 8
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
 * Mini View: Small icons only grouped by tier
 * For 31+ badges
 */
function generateMiniView(userBadges, grouped, userData) {
  const role = userData.role ? ` — ${userData.role}` : '';
  let section = `\n### 🏅 ${userData.displayName || userData.username}${role}\n`;
  
  // Group by tier
  const byTier = { gold: [], silver: [], bronze: [] };
  userBadges.forEach(b => {
    if (byTier[b.tier]) byTier[b.tier].push(b);
  });
  
  section += `> **${userBadges.length} badges earned**\n\n`;
  
  // Generate each tier section
  for (const [tier, tierBadges] of Object.entries(byTier)) {
    if (tierBadges.length === 0) continue;
    
    const tierIcon = TIER_ICON[tier];
    const tierLabel = tier === 'gold' ? 'Gold' : tier === 'silver' ? 'Silver' : 'Bronze';
    
    section += `<details>\n`;
    section += `<summary><strong>${tierIcon} ${tierLabel}</strong> (${tierBadges.length} badges)</summary>\n\n`;
    section += `<p>\n`;
    
    for (const badge of tierBadges) {
      const svgUrl = `${REPO_BASE_URL}/${badge.svg}`;
      section += `<img src="${svgUrl}" width="24" height="24" alt="${badge.label}" title="${badge.label}"/> `;
    }
    
    section += `\n</p>\n`;
    section += `</details>\n\n`;
  }
  
  // Also show collapsed category summary
  section += `<details>\n`;
  section += `<summary>📊 View by category</summary>\n\n`;
  
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
// MAIN FUNCTION
// ============================================================================

function syncProfile(username, readmePath, forceView = null) {
  console.log(`🌸 Syncing badges for @${username}...`);
  
  // Load catalog
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const catalogIndex = {};
  for (const b of catalog) catalogIndex[b.id] = b;
  
  // Load specific user
  const userPath = path.join(USERS_DIR, `${username}.json`);
  if (!fs.existsSync(userPath)) {
    console.error(`❌ User ${username} not found`);
    process.exit(1);
  }
  
  const userData = JSON.parse(fs.readFileSync(userPath, 'utf8'));
  
  // Build badges
  const userBadges = userData.badges.map(ub => {
    const cb = catalogIndex[ub.id];
    if (!cb) return null;
    return { ...cb, ...ub };
  }).filter(Boolean);
  
  // Group by category
  const grouped = {};
  for (const badge of userBadges) {
    const cat = badge.category || 'other';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(badge);
  }
  
  // Determine view to use
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
  
  console.log(`📊 ${userBadges.length} badges → View: ${viewMode.toUpperCase()}`);
  
  // Generate HTML section based on view
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
  
  // Add footer
  section += `> 🌸 Verificado por [BOOMFLOW](https://github.com/jeremy-sud/boomflow) @ [SistemasUrsol](https://www.ursol.com)\n`;
  
  // Update README
  if (!fs.existsSync(readmePath)) {
    console.error(`❌ README not found: ${readmePath}`);
    process.exit(1);
  }
  
  let content = fs.readFileSync(readmePath, 'utf8');
  
  const START_TAG = '<!-- BOOMFLOW-BADGES-START -->';
  const END_TAG = '<!-- BOOMFLOW-BADGES-END -->';
  const regex = new RegExp(`${START_TAG}[\\s\\S]*?${END_TAG}`, 'g');
  
  if (!regex.test(content)) {
    console.error('❌ BOOMFLOW markers not found in README');
    process.exit(1);
  }
  
  regex.lastIndex = 0;
  const newContent = `${START_TAG}${section}${END_TAG}`;
  content = content.replace(regex, newContent);
  
  fs.writeFileSync(readmePath, content);
  console.log(`✅ README updated with ${userBadges.length} badges for @${username} (view ${viewMode})`);
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const username = args[0] || 'jeremy-sud';
const readmePath = args[1] || '/home/dawnweaber/Workspace/jeremy-sud/README.md';

// Detect --view=xxx
let forceView = null;
for (const arg of args) {
  if (arg.startsWith('--view=')) {
    forceView = arg.replace('--view=', '');
    if (!['normal', 'compact', 'mini'].includes(forceView)) {
      console.error(`❌ Invalid view: ${forceView}. Use: normal, compact, mini`);
      process.exit(1);
    }
  }
}

syncProfile(username, readmePath, forceView);
