#!/usr/bin/env node
/**
 * BOOMFLOW - Selector de Paquetes de Skins
 * 
 * Script para previsualizar y aplicar skins a las medallas de usuarios.
 * Permite cambiar el estilo visual de todas las medallas de forma masiva.
 * 
 * Uso:
 *   node scripts/select-skin-pack.js                    # Modo interactivo
 *   node scripts/select-skin-pack.js --list             # Listar skins disponibles
 *   node scripts/select-skin-pack.js --user jeremy-sud --skin crystal
 *   node scripts/select-skin-pack.js --preview neon     # Preview ASCII de una skin
 * 
 * @author Sistemas Ursol
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================================
// CONFIGURACIÓN
// ============================================================

const USERS_DIR = path.join(__dirname, '..', 'users');
const SKINS_DIR = path.join(__dirname, '..', 'assets', 'skins');

// Definición de paquetes de skins disponibles
const SKIN_PACKS = {
  default: {
    id: 'default',
    name: 'Default',
    emoji: '🎯',
    description: 'Diseño original de BOOMFLOW - Colorido y profesional',
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
    description: 'Estilo gema facetada con reflejos brillantes',
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
    description: 'Escudo formal con laureles y medallón dorado',
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
    description: 'Diseño ultra-limpio con líneas simples',
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
    description: 'Estilo retro con ornamentos clásicos',
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
    description: 'Cyberpunk con efectos de brillo neón',
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
// FUNCIONES PRINCIPALES
// ============================================================

/**
 * Lista todos los usuarios disponibles
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
 * Lee el archivo JSON de un usuario
 */
function readUserFile(username) {
  const filePath = path.join(USERS_DIR, `${username}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Usuario no encontrado: ${username}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Escribe el archivo JSON de un usuario
 */
function writeUserFile(username, data) {
  const filePath = path.join(USERS_DIR, `${username}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Aplica una skin a todas las medallas de un usuario
 */
function applySkinToUser(username, skinId) {
  const skin = SKIN_PACKS[skinId];
  if (!skin) {
    throw new Error(`Skin no encontrada: ${skinId}`);
  }
  
  const userData = readUserFile(username);
  
  // Agregar preferencia de skin al usuario
  userData.skinPreference = skinId;
  
  // Si el usuario tiene badges, agregar skinPreference a cada uno
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
 * Muestra el preview de una skin
 */
function showSkinPreview(skinId) {
  const skin = SKIN_PACKS[skinId];
  if (!skin) {
    console.log(`❌ Skin no encontrada: ${skinId}`);
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
 * Lista todas las skins disponibles
 */
function listSkins() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           📦 PAQUETES DE SKINS DISPONIBLES                 ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  Object.values(SKIN_PACKS).forEach((skin, index) => {
    const premium = skin.isPremium ? ' ⭐ PREMIUM' : '';
    console.log(`  ${index + 1}. ${skin.emoji} ${skin.name.padEnd(12)}${premium}`);
    console.log(`     └─ ${skin.description}`);
    console.log('');
  });
  
  console.log('─'.repeat(60));
  console.log('💡 Usa --preview <nombre> para ver el preview ASCII de una skin');
  console.log('💡 Usa --user <usuario> --skin <nombre> para aplicar una skin\n');
}

/**
 * Verifica si el archivo de skin template existe
 */
function checkSkinTemplateExists(skinId) {
  const templatePath = path.join(SKINS_DIR, `skin-${skinId}-template.svg`);
  return fs.existsSync(templatePath);
}

// ============================================================
// MODO INTERACTIVO
// ============================================================

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const ask = (q) => new Promise(resolve => rl.question(q, resolve));
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║      🎨 BOOMFLOW - Selector de Paquetes de Skins 🎨        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Mostrar usuarios disponibles
  const users = listUsers();
  if (users.length === 0) {
    console.log('⚠️  No hay usuarios registrados en /users/');
    rl.close();
    return;
  }
  
  console.log('👥 Usuarios disponibles:');
  users.forEach((user, i) => console.log(`   ${i + 1}. ${user}`));
  
  // Seleccionar usuario
  const userIndex = parseInt(await ask('\n📌 Selecciona usuario (número): ')) - 1;
  const username = users[userIndex];
  
  if (!username) {
    console.log('❌ Usuario inválido');
    rl.close();
    return;
  }
  
  // Leer datos del usuario
  const userData = readUserFile(username);
  console.log(`\n✅ Usuario: ${userData.displayName || username}`);
  console.log(`   🏅 Medallas: ${userData.badges?.length || 0}`);
  console.log(`   🎨 Skin actual: ${userData.skinPreference || 'default'}`);
  
  // Mostrar skins disponibles
  console.log('\n📦 Paquetes de skins:');
  Object.values(SKIN_PACKS).forEach((skin, i) => {
    const current = userData.skinPreference === skin.id ? ' ← ACTUAL' : '';
    const premium = skin.isPremium ? ' ⭐' : '';
    console.log(`   ${i + 1}. ${skin.emoji} ${skin.name}${premium}${current}`);
  });
  
  // Seleccionar skin
  const skinIndex = parseInt(await ask('\n🎨 Selecciona skin (número): ')) - 1;
  const skinId = Object.keys(SKIN_PACKS)[skinIndex];
  const skin = SKIN_PACKS[skinId];
  
  if (!skin) {
    console.log('❌ Skin inválida');
    rl.close();
    return;
  }
  
  // Preview
  console.log('\n👀 Preview de la skin seleccionada:');
  showSkinPreview(skinId);
  
  // Confirmar
  const confirm = await ask('¿Aplicar esta skin? (s/n): ');
  
  if (confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'y') {
    const result = applySkinToUser(username, skinId);
    console.log('\n✅ ¡Skin aplicada exitosamente!');
    console.log(`   👤 Usuario: ${result.username}`);
    console.log(`   🎨 Skin: ${result.skinApplied}`);
    console.log(`   🏅 Medallas actualizadas: ${result.badgesUpdated}`);
  } else {
    console.log('\n❌ Operación cancelada');
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
║        BOOMFLOW - Selector de Paquetes de Skins            ║
╚════════════════════════════════════════════════════════════╝

Uso:
  node scripts/select-skin-pack.js [opciones]

Opciones:
  --list, -l              Lista todas las skins disponibles
  --preview, -p <skin>    Muestra el preview de una skin
  --user, -u <username>   Usuario al que aplicar la skin
  --skin, -s <id>         ID de la skin a aplicar
  --all                   Aplicar a todos los usuarios
  --help, -h              Muestra esta ayuda

Ejemplos:
  # Modo interactivo
  node scripts/select-skin-pack.js

  # Listar skins
  node scripts/select-skin-pack.js --list

  # Preview de una skin
  node scripts/select-skin-pack.js --preview neon
  node scripts/select-skin-pack.js --preview crystal

  # Aplicar skin a un usuario
  node scripts/select-skin-pack.js --user jeremy-sud --skin crystal

  # Aplicar skin a todos los usuarios
  node scripts/select-skin-pack.js --skin minimalist --all

Skins disponibles:
  default     - Diseño original (gratis)
  crystal     - Estilo gema facetada (gratis)
  academic    - Escudo formal (gratis)
  minimalist  - Diseño limpio (gratis)
  vintage     - Estilo retro (gratis)
  neon        - Cyberpunk brillante (premium)
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
        console.log('❌ Especifica una skin: --preview <nombre>');
        console.log('   Ejemplo: --preview crystal');
      } else {
        showSkinPreview(options.skinId);
      }
      break;
      
    case 'help':
      printHelp();
      break;
      
    default:
      // Si se especificó usuario y skin, aplicar directamente
      if (options.username && options.skinId) {
        try {
          const result = applySkinToUser(options.username, options.skinId);
          console.log('\n✅ ¡Skin aplicada exitosamente!');
          console.log(`   👤 Usuario: ${result.username}`);
          console.log(`   🎨 Skin: ${result.skinApplied}`);
          console.log(`   🏅 Medallas actualizadas: ${result.badgesUpdated}`);
        } catch (error) {
          console.log(`❌ Error: ${error.message}`);
        }
      }
      // Si se especificó --all y skin, aplicar a todos
      else if (options.applyToAll && options.skinId) {
        const users = listUsers();
        console.log(`\n🔄 Aplicando skin "${options.skinId}" a ${users.length} usuarios...\n`);
        
        for (const username of users) {
          try {
            const result = applySkinToUser(username, options.skinId);
            console.log(`   ✅ ${username}: ${result.badgesUpdated} medallas actualizadas`);
          } catch (error) {
            console.log(`   ❌ ${username}: ${error.message}`);
          }
        }
        
        console.log('\n✅ Proceso completado');
      }
      // Modo interactivo
      else {
        await interactiveMode();
      }
  }
}

main().catch(console.error);
