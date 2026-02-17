#!/usr/bin/env node
/**
 * BOOMFLOW - Skin Pack Selector
 * 
 * Script to preview and apply skins to user badges.
 * Allows changing the visual style of all badges in bulk.
 * 
 * Usage:
 *   node scripts/select-skin-pack.js                    # Interactive mode
 *   node scripts/select-skin-pack.js --list             # List available skins
 *   node scripts/select-skin-pack.js --user jeremy-sud --skin crystal
 *   node scripts/select-skin-pack.js --preview neon     # ASCII preview of a skin
 * 
 * @author Sistemas Ursol
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================================
// CONFIGURATION
// ============================================================

const USERS_DIR = path.join(__dirname, '..', 'users');
const SKINS_DIR = path.join(__dirname, '..', 'assets', 'skins');

// Definition of available skin packs
const SKIN_PACKS = {
  default: {
    id: 'default',
    name: 'Default',
    emoji: '🎯',
    description: 'BOOMFLOW original design - Colorful and professional',
    preview: `
    ╭──────────────╮
    │   ◉◉◉◉◉◉◉    │
    │  ◉ ░░░░░ ◉   │
    │ ◉  ▓▓▓▓▓  ◉  │
    │ ◉  ▓ ★ ▓  ◉  │
    │ ◉  ▓▓▓▓▓  ◉  │
    │  ◉ ░░░░░ ◉   │
    │   ◉◉◉◉◉◉◉    │
    │   DEFAULT    │
    ╰──────────────╯`,
    colors: ['#3b82f6', '#60a5fa', '#93c5fd'],
    isPremium: false
  },
  
  crystal: {
    id: 'crystal',
    name: 'Crystal',
    emoji: '💎',
    description: 'Faceted gem style with bright reflections',
    preview: `
        ╱╲
       ╱░░╲
      ╱░██░╲
     ╱░████░╲
    ╱░░████░░╲
    ╲░░████░░╱
     ╲░████░╱
      ╲░██░╱
       ╲░░╱
        ╲╱
     CRYSTAL`,
    colors: ['#0ea5e9', '#38bdf8', '#7dd3fc'],
    isPremium: false
  },
  
  academic: {
    id: 'academic',
    name: 'Academic',
    emoji: '🎓',
    description: 'Formal shield with laurels and golden medallion',
    preview: `
       ╭─────╮
      ╱│░░░░░│╲
     🌿│ ╭─╮ │🌿
      ╲│ │★│ │╱
       │ ╰─╯ │
       │░░░░░│
       ╰──┬──╯
      ACADEMIC`,
    colors: ['#d4af37', '#f0d77a', '#5a7c47'],
    isPremium: false
  },
  
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    emoji: '◻️',
    description: 'Ultra-clean design with simple lines',
    preview: `
    ╭────────────╮
    │            │
    │    ╭──╮    │
    │    │  │    │
    │    ╰──╯    │
    │            │
    │  MINIMAL   │
    ╰────────────╯`,
    colors: ['#f8fafc', '#e2e8f0', '#64748b'],
    isPremium: false
  },
  
  vintage: {
    id: 'vintage',
    name: 'Vintage',
    emoji: '🏛️',
    description: 'Retro style with classic ornaments',
    preview: `
    ╭~~~~~~~~~~~~~╮
    │  ┌───────┐  │
    │ ╱│ ▒▒▒▒▒ │╲ │
    │ ║│   ☆   │║ │
    │ ╲│ ▒▒▒▒▒ │╱ │
    │  └───────┘  │
    │   VINTAGE   │
    ╰~~~~~~~~~~~~~╯`,
    colors: ['#ca8a04', '#a16207', '#854d0e'],
    isPremium: false
  },
  
  neon: {
    id: 'neon',
    name: 'Neon',
    emoji: '⚡',
    description: 'Cyberpunk with neon glow effects',
    preview: `
    ┏━━━━━━━━━━━━┓
    ┃ ╔════════╗ ┃
    ┃ ║ ▓▓▓▓▓▓ ║ ┃
    ┃ ║ ▓ ◈◈ ▓ ║ ┃
    ┃ ║ ▓▓▓▓▓▓ ║ ┃
    ┃ ╚════════╝ ┃
    ┃   N E O N  ┃
    ┗━━━━━━━━━━━━┛`,
    colors: ['#d946ef', '#22d3ee', '#f472b6'],
    isPremium: true
  }
};

// ============================================================
// MAIN FUNCTIONS
// ============================================================

/**
 * Lists all available users
 */
function listUsers() {
  if (!fs.existsSync(USERS_DIR)) {
    return [];
  }
  
  return fs.readdirSync(USERS_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
}

/**
 * Reads a user's JSON file
 */
function readUserFile(username) {
  const filePath = path.join(USERS_DIR, `${username}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`User not found: ${username}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Writes a user's JSON file
 */
function writeUserFile(username, data) {
  const filePath = path.join(USERS_DIR, `${username}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Applies a skin to all of a user's badges
 */
function applySkinToUser(username, skinId) {
  const skin = SKIN_PACKS[skinId];
  if (!skin) {
    throw new Error(`Skin not found: ${skinId}`);
  }
  
  // Premium skin access control (currently disabled — all skins available)
  // When/if commercial plans are introduced, this would gate access.
  if (skin.isPremium) {
    // For now, log a notice but allow access
    console.log(`ℹ️  Skin "${skin.name}" is marked as premium but all skins are currently available.`);
    // Future: uncomment to enforce plan-based access
    // const userData = readUserFile(username);
    // const userPlan = (userData.plan || 'INTERNAL').toUpperCase();
    // const allowedPlans = ['PRO', 'SCALE', 'ENTERPRISE'];
    // if (!allowedPlans.includes(userPlan)) {
    //   throw new Error(`Skin "${skin.name}" requires a Pro, Scale, or Enterprise plan. Current plan: ${userPlan}`);
    // }
  }
  
  const userData = readUserFile(username);
  
  // Add skin preference to user
  userData.skinPreference = skinId;
  
  // If user has badges, add skinPreference to each one
  if (userData.badges && Array.isArray(userData.badges)) {
    userData.badges = userData.badges.map(badge => ({
      ...badge,
      skinPreference: skinId
    }));
  }
  
  writeUserFile(username, userData);
  
  return {
    username,
    skinApplied: skin.name,
    badgesUpdated: userData.badges?.length || 0
  };
}

/**
 * Shows the preview of a skin
 */
function showSkinPreview(skinId) {
  const skin = SKIN_PACKS[skinId];
  if (!skin) {
    console.log(`❌ Skin not found: ${skinId}`);
    return;
  }
  
  console.log('\n' + '═'.repeat(50));
  console.log(`${skin.emoji} ${skin.name.toUpperCase()} ${skin.isPremium ? '(PREMIUM ⭐)' : ''}`);
  console.log('═'.repeat(50));
  console.log(`📝 ${skin.description}`);
  console.log(`🎨 Colores: ${skin.colors.join(' → ')}`);
  console.log('\nPreview ASCII:');
  console.log(skin.preview);
  console.log('═'.repeat(50) + '\n');
}

/**
 * Lists all available skins
 */
function listSkins() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           📦 AVAILABLE SKIN PACKS                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  Object.values(SKIN_PACKS).forEach((skin, index) => {
    const premium = skin.isPremium ? ' ⭐ PREMIUM' : '';
    console.log(`  ${index + 1}. ${skin.emoji} ${skin.name.padEnd(12)}${premium}`);
    console.log(`     └─ ${skin.description}`);
    console.log('');
  });
  
  console.log('─'.repeat(60));
  console.log('💡 Use --preview <name> to see the ASCII preview of a skin');
  console.log('💡 Use --user <username> --skin <name> to apply a skin\n');
}

/**
 * Checks if the skin template file exists
 */
function checkSkinTemplateExists(skinId) {
  const templatePath = path.join(SKINS_DIR, `skin-${skinId}-template.svg`);
  return fs.existsSync(templatePath);
}

// ============================================================
// INTERACTIVE MODE
// ============================================================

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║      🎨 BOOMFLOW - Skin Pack Selector 🎨                  ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Show available users
  const users = listUsers();
  if (users.length === 0) {
    console.log('⚠️  No registered users in /users/');
    rl.close();
    return;
  }
  
  console.log('👥 Available users:');
  users.forEach((user, i) => console.log(`   ${i + 1}. ${user}`));
  
  // Select user
  const userIndex = parseInt(await ask('\n📌 Select user (number): ')) - 1;
  const username = users[userIndex];
  
  if (!username) {
    console.log('❌ Invalid user');
    rl.close();
    return;
  }
  
  // Read user data
  const userData = readUserFile(username);
  console.log(`\n✅ User: ${userData.displayName || username}`);
  console.log(`   🏅 Badges: ${userData.badges?.length || 0}`);
  console.log(`   🎨 Current skin: ${userData.skinPreference || 'default'}`);
  
  // Show available skins
  console.log('\n📦 Skin packs:');
  Object.values(SKIN_PACKS).forEach((skin, i) => {
    const current = userData.skinPreference === skin.id ? ' ← CURRENT' : '';
    const premium = skin.isPremium ? ' ⭐' : '';
    console.log(`   ${i + 1}. ${skin.emoji} ${skin.name}${premium}${current}`);
  });
  
  // Select skin
  const skinIndex = parseInt(await ask('\n🎨 Select skin (number): ')) - 1;
  const skinId = Object.keys(SKIN_PACKS)[skinIndex];
  const skin = SKIN_PACKS[skinId];
  
  if (!skin) {
    console.log('❌ Invalid skin');
    rl.close();
    return;
  }
  
  // Preview
  console.log('\n👀 Preview of selected skin:');
  showSkinPreview(skinId);
  
  // Confirm
  const confirm = await ask('Apply this skin? (y/n): ');
  
  if (confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'y') {
    const result = applySkinToUser(username, skinId);
    console.log('\n✅ Skin applied successfully!');
    console.log(`   👤 User: ${result.username}`);
    console.log(`   🎨 Skin: ${result.skinApplied}`);
    console.log(`   🏅 Badges updated: ${result.badgesUpdated}`);
  } else {
    console.log('\n❌ Operation cancelled');
  }
  
  rl.close();
}

// ============================================================
// CLI PARSER
// ============================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--list' || arg === '-l') {
      options.action = 'list';
    } else if (arg === '--preview' || arg === '-p') {
      options.action = 'preview';
      options.skinId = args[++i];
    } else if (arg === '--user' || arg === '-u') {
      options.username = args[++i];
    } else if (arg === '--skin' || arg === '-s') {
      options.skinId = args[++i];
    } else if (arg === '--all') {
      options.applyToAll = true;
    } else if (arg === '--help' || arg === '-h') {
      options.action = 'help';
    }
  }
  
  return options;
}

function printHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║        BOOMFLOW - Skin Pack Selector                      ║
╚════════════════════════════════════════════════════════════╝

Usage:
  node scripts/select-skin-pack.js [options]

Options:
  --list, -l              Lists all available skins
  --preview, -p <skin>    Shows the preview of a skin
  --user, -u <username>   User to apply skin to
  --skin, -s <id>         ID of skin to apply
  --all                   Apply to all users
  --help, -h              Shows this help

Examples:
  # Interactive mode
  node scripts/select-skin-pack.js

  # List skins
  node scripts/select-skin-pack.js --list

  # Preview of a skin
  node scripts/select-skin-pack.js --preview neon
  node scripts/select-skin-pack.js --preview crystal

  # Apply skin to a user
  node scripts/select-skin-pack.js --user jeremy-sud --skin crystal

  # Apply skin to all users
  node scripts/select-skin-pack.js --skin minimalist --all

Available skins:
  default     - Original design (free)
  crystal     - Faceted gem style (free)
  academic    - Formal shield (free)
  minimalist  - Clean design (free)
  vintage     - Retro style (free)
  neon        - Bright cyberpunk (premium)
`);
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  const options = parseArgs();
  
  switch (options.action) {
    case 'list':
      listSkins();
      break;
      
    case 'preview':
      if (!options.skinId) {
        console.log('❌ Specify a skin: --preview <name>');
        console.log('   Example: --preview crystal');
      } else {
        showSkinPreview(options.skinId);
      }
      break;
      
    case 'help':
      printHelp();
      break;
      
    default:
      // If user and skin are specified, apply directly
      if (options.username && options.skinId) {
        try {
          const result = applySkinToUser(options.username, options.skinId);
          console.log('\n✅ Skin applied successfully!');
          console.log(`   👤 User: ${result.username}`);
          console.log(`   🎨 Skin: ${result.skinApplied}`);
          console.log(`   🏅 Badges updated: ${result.badgesUpdated}`);
        } catch (error) {
          console.log(`❌ Error: ${error.message}`);
        }
      }
      // If --all and skin are specified, apply to all
      else if (options.applyToAll && options.skinId) {
        const users = listUsers();
        console.log(`\n🔄 Applying skin "${options.skinId}" to ${users.length} users...\n`);
        
        for (const username of users) {
          try {
            const result = applySkinToUser(username, options.skinId);
            console.log(`   ✅ ${username}: ${result.badgesUpdated} badges updated`);
          } catch (error) {
            console.log(`   ❌ ${username}: ${error.message}`);
          }
        }
        
        console.log('\n✅ Process completed');
      }
      // Modo interactivo
      else {
        await interactiveMode();
      }
  }
}

main().catch(console.error);
