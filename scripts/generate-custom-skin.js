#!/usr/bin/env node
/**
 * BOOMFLOW - Custom Skin Generator
 * 
 * Interactive script to create custom badge SVGs.
 * Run: node scripts/generate-custom-skin.js
 * 
 * @author Sistemas Ursol
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================================
// BASE SHAPE CONFIGURATION
// ============================================================

const SHAPES = {
  circle: {
    name: 'Circle',
    description: 'Classic circular shape',
    template: (colors) => `
  <!-- Shape: Circle -->
  <circle cx="60" cy="65" r="50" 
          fill="${colors.background}" 
          stroke="${colors.border}" 
          stroke-width="3"/>
  <circle cx="60" cy="65" r="42" 
          fill="none" 
          stroke="${colors.accent}" 
          stroke-width="1" 
          opacity="0.5"/>`,
    iconY: 65
  },
  
  hexagon: {
    name: 'Hexagon',
    description: 'Gem/crystal shape',
    template: (colors) => `
  <!-- Shape: Hexagon (Gem) -->
  <polygon points="60,5 105,30 105,100 60,125 15,100 15,30" 
           fill="${colors.background}" 
           stroke="${colors.border}" 
           stroke-width="3"/>
  <polygon points="60,15 95,35 95,95 60,115 25,95 25,35" 
           fill="none" 
           stroke="${colors.accent}" 
           stroke-width="1" 
           opacity="0.4"/>`,
    iconY: 65
  },
  
  shield: {
    name: 'Shield',
    description: 'Heraldic/academic shape',
    template: (colors) => `
  <!-- Shape: Heraldic Shield -->
  <path d="M60 8 L105 28 Q108 70 60 130 Q12 70 15 28 Z" 
        fill="${colors.background}" 
        stroke="${colors.border}" 
        stroke-width="3"/>
  <path d="M60 18 L95 35 Q98 65 60 115 Q22 65 25 35 Z" 
        fill="none" 
        stroke="${colors.accent}" 
        stroke-width="1" 
        opacity="0.4"/>`,
    iconY: 60
  },
  
  octagon: {
    name: 'Octagon',
    description: 'Modern 8-sided shape',
    template: (colors) => `
  <!-- Shape: Octagon -->
  <polygon points="40,10 80,10 100,35 100,95 80,120 40,120 20,95 20,35" 
           fill="${colors.background}" 
           stroke="${colors.border}" 
           stroke-width="3"/>
  <polygon points="45,18 75,18 92,38 92,92 75,112 45,112 28,92 28,38" 
           fill="none" 
           stroke="${colors.accent}" 
           stroke-width="1" 
           opacity="0.4"/>`,
    iconY: 65
  },
  
  oval: {
    name: 'Oval',
    description: 'Elegant elliptical shape',
    template: (colors) => `
  <!-- Shape: Oval -->
  <ellipse cx="60" cy="70" rx="50" ry="58" 
           fill="${colors.background}" 
           stroke="${colors.border}" 
           stroke-width="3"/>
  <ellipse cx="60" cy="70" rx="42" ry="50" 
           fill="none" 
           stroke="${colors.accent}" 
           stroke-width="1" 
           opacity="0.4"/>`,
    iconY: 65
  },
  
  diamond: {
    name: 'Diamond',
    description: 'Rotated rhombus/diamond',
    template: (colors) => `
  <!-- Shape: Diamond -->
  <polygon points="60,5 110,70 60,135 10,70" 
           fill="${colors.background}" 
           stroke="${colors.border}" 
           stroke-width="3"/>
  <polygon points="60,18 100,70 60,122 20,70" 
           fill="none" 
           stroke="${colors.accent}" 
           stroke-width="1" 
           opacity="0.4"/>`,
    iconY: 70
  }
};

// ============================================================
// PREDEFINED COLOR PALETTES
// ============================================================

const COLOR_PALETTES = {
  ocean: {
    name: '🌊 Ocean',
    background: '#0c4a6e',
    border: '#0ea5e9',
    accent: '#7dd3fc',
    text: '#bae6fd',
    icon: '#e0f2fe'
  },
  
  forest: {
    name: '🌲 Forest',
    background: '#14532d',
    border: '#22c55e',
    accent: '#86efac',
    text: '#bbf7d0',
    icon: '#dcfce7'
  },
  
  sunset: {
    name: '🌅 Sunset',
    background: '#7c2d12',
    border: '#f97316',
    accent: '#fdba74',
    text: '#fed7aa',
    icon: '#ffedd5'
  },
  
  lavender: {
    name: '💜 Lavender',
    background: '#581c87',
    border: '#a855f7',
    accent: '#d8b4fe',
    text: '#e9d5ff',
    icon: '#f3e8ff'
  },
  
  midnight: {
    name: '🌙 Midnight',
    background: '#0f172a',
    border: '#3b82f6',
    accent: '#93c5fd',
    text: '#bfdbfe',
    icon: '#dbeafe'
  },
  
  rose: {
    name: '🌹 Rose',
    background: '#831843',
    border: '#ec4899',
    accent: '#f9a8d4',
    text: '#fbcfe8',
    icon: '#fce7f3'
  },
  
  gold: {
    name: '🏆 Gold',
    background: '#451a03',
    border: '#d97706',
    accent: '#fcd34d',
    text: '#fde68a',
    icon: '#fef3c7'
  },
  
  slate: {
    name: '⬜ Slate (Minimalist)',
    background: '#f8fafc',
    border: '#64748b',
    accent: '#94a3b8',
    text: '#475569',
    icon: '#334155'
  },
  
  neon: {
    name: '⚡ Neon',
    background: '#0c0a09',
    border: '#d946ef',
    accent: '#22d3ee',
    text: '#f0abfc',
    icon: '#ffffff'
  },
  
  corporate: {
    name: '💼 Corporate',
    background: '#1e40af',
    border: '#60a5fa',
    accent: '#93c5fd',
    text: '#dbeafe',
    icon: '#ffffff'
  }
};

// ============================================================
// SPECIAL EFFECTS
// ============================================================

const EFFECTS = {
  none: {
    name: 'None',
    defs: '',
    filter: ''
  },
  
  glow: {
    name: 'Glow',
    defs: (colors) => `
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feFlood flood-color="${colors.accent}" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="glow"/>
      <feMerge>
        <feMergeNode in="glow"/>
        <feMergeNode in="glow"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`,
    filter: 'filter="url(#glow)"'
  },
  
  shadow: {
    name: 'Shadow',
    defs: (colors) => `
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
    </filter>`,
    filter: 'filter="url(#shadow)"'
  },
  
  gradient: {
    name: 'Animated Gradient',
    defs: (colors) => `
    <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.background}">
        <animate attributeName="stop-color" values="${colors.background};${colors.border};${colors.background}" dur="4s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:${colors.border}">
        <animate attributeName="stop-color" values="${colors.border};${colors.accent};${colors.border}" dur="4s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>`,
    filter: '',
    bgOverride: 'url(#animatedGradient)'
  },
  
  noise: {
    name: 'Noise Texture',
    defs: () => `
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" result="noise"/>
      <feColorMatrix type="saturate" values="0"/>
      <feBlend in="SourceGraphic" in2="noise" mode="overlay" result="blend"/>
      <feComposite in="blend" in2="SourceGraphic" operator="in"/>
    </filter>`,
    filter: 'filter="url(#noise)"'
  }
};

// ============================================================
// CENTRAL ICONS
// ============================================================

const ICONS = {
  gem: {
    name: '💎 Gem',
    template: (colors, y) => `
  <!-- Icon: Faceted gem -->
  <g transform="translate(60, ${y})">
    <polygon points="0,-18 14,-6 0,18 -14,-6" fill="${colors.icon}" opacity="0.9"/>
    <polygon points="0,-18 14,-6 0,2 -14,-6" fill="${colors.icon}"/>
    <polygon points="-14,-6 0,2 0,18" fill="${colors.icon}" opacity="0.6"/>
    <polygon points="14,-6 0,2 0,18" fill="${colors.icon}" opacity="0.8"/>
    <line x1="0" y1="-18" x2="0" y2="18" stroke="${colors.accent}" stroke-width="0.5" opacity="0.5"/>
  </g>`
  },
  
  star: {
    name: '⭐ Star',
    template: (colors, y) => `
  <!-- Icon: 5-pointed star -->
  <polygon points="60,${y-20} 65,${y-5} 80,${y-5} 68,${y+5} 73,${y+20} 60,${y+10} 47,${y+20} 52,${y+5} 40,${y-5} 55,${y-5}" 
           fill="${colors.icon}" 
           stroke="${colors.accent}" 
           stroke-width="1"/>`
  },
  
  badge: {
    name: '🏅 Badge',
    template: (colors, y) => `
  <!-- Icon: Circular badge -->
  <circle cx="60" cy="${y}" r="18" fill="${colors.icon}" stroke="${colors.accent}" stroke-width="2"/>
  <circle cx="60" cy="${y}" r="12" fill="none" stroke="${colors.accent}" stroke-width="1"/>
  <circle cx="60" cy="${y}" r="4" fill="${colors.accent}"/>`
  },
  
  lightning: {
    name: '⚡ Lightning',
    template: (colors, y) => `
  <!-- Icon: Lightning -->
  <polygon points="65,${y-20} 50,${y} 58,${y} 55,${y+20} 70,${y} 62,${y}" 
           fill="${colors.icon}" 
           stroke="${colors.accent}" 
           stroke-width="1"/>`
  },
  
  code: {
    name: '💻 Code',
    template: (colors, y) => `
  <!-- Icon: Code brackets -->
  <text x="60" y="${y+8}" font-size="32" fill="${colors.icon}" text-anchor="middle" 
        font-family="monospace" font-weight="bold">&lt;/&gt;</text>`
  },
  
  heart: {
    name: '❤️ Heart',
    template: (colors, y) => `
  <!-- Icon: Heart -->
  <path d="M60,${y+15} C40,${y-5} 40,${y-20} 50,${y-20} C58,${y-20} 60,${y-10} 60,${y-10} C60,${y-10} 62,${y-20} 70,${y-20} C80,${y-20} 80,${y-5} 60,${y+15}Z" 
        fill="${colors.icon}" 
        stroke="${colors.accent}" 
        stroke-width="1"/>`
  },
  
  trophy: {
    name: '🏆 Trophy',
    template: (colors, y) => `
  <!-- Icon: Trophy -->
  <path d="M45,${y-15} L75,${y-15} L72,${y} L68,${y} L68,${y+8} L75,${y+12} L45,${y+12} L52,${y+8} L52,${y} L48,${y} Z" 
        fill="${colors.icon}" 
        stroke="${colors.accent}" 
        stroke-width="1"/>
  <ellipse cx="60" cy="${y-15}" rx="12" ry="4" fill="${colors.accent}" opacity="0.5"/>`
  },
  
  rocket: {
    name: '🚀 Rocket',
    template: (colors, y) => `
  <!-- Icon: Rocket -->
  <path d="M60,${y-20} C70,${y-10} 70,${y+5} 60,${y+15} C50,${y+5} 50,${y-10} 60,${y-20}Z" 
        fill="${colors.icon}" 
        stroke="${colors.accent}" 
        stroke-width="1"/>
  <polygon points="48,${y+10} 52,${y+5} 52,${y+15} 45,${y+20}" fill="${colors.accent}" opacity="0.8"/>
  <polygon points="72,${y+10} 68,${y+5} 68,${y+15} 75,${y+20}" fill="${colors.accent}" opacity="0.8"/>
  <circle cx="60" cy="${y-5}" r="4" fill="${colors.background}"/>`
  },
  
  none: {
    name: '(No icon)',
    template: () => '  <!-- No central icon -->'
  }
};

// ============================================================
// SVG GENERATOR
// ============================================================

function generateSVG(config) {
  const {
    shape,
    palette,
    effect,
    icon,
    customText,
    customName
  } = config;
  
  const colors = COLOR_PALETTES[palette];
  const shapeConfig = SHAPES[shape];
  const effectConfig = EFFECTS[effect];
  const iconConfig = ICONS[icon];
  
  // Override background if effect requires it
  const effectiveColors = {
    ...colors,
    background: effectConfig.bgOverride || colors.background
  };
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  BOOMFLOW Custom Skin: ${customName || 'Custom'}
  Generated with: generate-custom-skin.js
  Shape: ${shapeConfig.name}
  Palette: ${colors.name}
  Effect: ${effectConfig.name}
  Icon: ${iconConfig.name}
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140">
  <defs>
    <!-- Background gradient -->
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.background}"/>
      <stop offset="100%" style="stop-color:${adjustColor(colors.background, -20)}"/>
    </linearGradient>
    ${effectConfig.defs ? (typeof effectConfig.defs === 'function' ? effectConfig.defs(colors) : effectConfig.defs) : ''}
  </defs>
  
  <!-- Main group ${effectConfig.filter} -->
  <g ${effectConfig.filter}>
${shapeConfig.template(effectiveColors)}
  </g>
  
${iconConfig.template(colors, shapeConfig.iconY)}
  
  <!-- Bottom text -->
  <text x="60" y="130" font-size="8" fill="${colors.text}" text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" font-weight="600">${customText || 'BADGE'}</text>
</svg>`;

  return svg;
}

/**
 * Adjusts the brightness of a hex color
 */
function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// ============================================================
// COMMAND LINE INTERFACE
// ============================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function printOptions(options, labelKey = 'name') {
  Object.entries(options).forEach(([key, value], index) => {
    const label = typeof value === 'object' ? value[labelKey] : value;
    const desc = value.description ? ` - ${value.description}` : '';
    console.log(`  ${index + 1}. ${key.padEnd(12)} → ${label}${desc}`);
  });
}

function getKeyByIndex(options, index) {
  return Object.keys(options)[index - 1];
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║     🎨 BOOMFLOW - Custom Skin Generator 🎨               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Step 1: Skin name
  const customName = await ask('📝 Name of your skin (e.g.: "My Epic Skin"): ');
  
  // Step 2: Base shape
  console.log('\n🔷 Select BASE SHAPE:');
  printOptions(SHAPES);
  const shapeIndex = parseInt(await ask('\n   Your choice (1-6): '));
  const shape = getKeyByIndex(SHAPES, shapeIndex) || 'circle';
  
  // Step 3: Color palette
  console.log('\n🎨 Select COLOR PALETTE:');
  printOptions(COLOR_PALETTES);
  const paletteIndex = parseInt(await ask('\n   Your choice (1-10): '));
  const palette = getKeyByIndex(COLOR_PALETTES, paletteIndex) || 'midnight';
  
  // Step 4: Special effect
  console.log('\n✨ Select a SPECIAL EFFECT:');
  printOptions(EFFECTS);
  const effectIndex = parseInt(await ask('\n   Your choice (1-5): '));
  const effect = getKeyByIndex(EFFECTS, effectIndex) || 'none';
  
  // Step 5: Central icon
  console.log('\n🏅 Select CENTRAL ICON:');
  printOptions(ICONS);
  const iconIndex = parseInt(await ask('\n   Your choice (1-9): '));
  const icon = getKeyByIndex(ICONS, iconIndex) || 'gem';
  
  // Step 6: Custom text
  const customText = await ask('\n📜 Bottom text (max 10 chars, e.g.: "CUSTOM"): ') || 'BADGE';
  
  // Generate configuration
  const config = {
    shape,
    palette,
    effect,
    icon,
    customText: customText.toUpperCase().substring(0, 10),
    customName
  };
  
  console.log('\n⚙️  Generating SVG with configuration:', JSON.stringify(config, null, 2));
  
  // Generate SVG
  const svg = generateSVG(config);
  
  // Save file
  const fileName = `skin-${customName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-custom.svg`;
  const outputDir = path.join(__dirname, '..', 'assets', 'skins');
  const outputPath = path.join(outputDir, fileName);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, svg, 'utf-8');
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    ✅ SKIN GENERATED                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n   📁 File: ${outputPath}`);
  console.log(`   📋 To use: Copy the file to assets/skins/`);
  console.log(`   🔧 To register: node scripts/badge-admin.js register-skin`);
  console.log('\n   SVG preview saved successfully.\n');
  
  rl.close();
}

// ============================================================
// NON-INTERACTIVE MODE (CLI arguments)
// ============================================================

function printUsage() {
  console.log(`
Usage: node generate-custom-skin.js [options]

Interactive mode (no arguments):
  node generate-custom-skin.js

Command line mode:
  node generate-custom-skin.js --shape hexagon --palette ocean --effect glow --icon gem --text "EPIC" --name "My Skin"

Options:
  --shape    Shape: ${Object.keys(SHAPES).join(', ')}
  --palette  Palette: ${Object.keys(COLOR_PALETTES).join(', ')}
  --effect   Effect: ${Object.keys(EFFECTS).join(', ')}
  --icon     Icon: ${Object.keys(ICONS).join(', ')}
  --text     Bottom text (max 10 characters)
  --name     Name of the skin
  --output   Output path (optional)
  --help     Shows this help

Examples:
  node generate-custom-skin.js --shape shield --palette gold --icon trophy
  node generate-custom-skin.js --shape octagon --palette neon --effect glow --icon lightning
`);
}

// Parsear argumentos CLI
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  printUsage();
  process.exit(0);
}

if (args.length > 0 && args[0].startsWith('--')) {
  // CLI mode
  const config = {
    shape: 'circle',
    palette: 'midnight',
    effect: 'none',
    icon: 'gem',
    customText: 'BADGE',
    customName: 'Custom'
  };
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    
    switch (key) {
      case 'shape': config.shape = value; break;
      case 'palette': config.palette = value; break;
      case 'effect': config.effect = value; break;
      case 'icon': config.icon = value; break;
      case 'text': config.customText = value.toUpperCase().substring(0, 10); break;
      case 'name': config.customName = value; break;
    }
  }
  
  const svg = generateSVG(config);
  const fileName = `skin-${config.customName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-custom.svg`;
  const outputPath = path.join(__dirname, '..', 'assets', 'skins', fileName);
  
  fs.writeFileSync(outputPath, svg, 'utf-8');
  console.log(`✅ Skin generated: ${outputPath}`);
} else {
  // Interactive mode
  main().catch(console.error);
}
