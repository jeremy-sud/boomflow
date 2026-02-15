#!/usr/bin/env node
/**
 * BOOMFLOW - Generador de Skins Personalizadas
 * 
 * Script interactivo para crear SVGs de badges personalizados.
 * Ejecutar: node scripts/generate-custom-skin.js
 * 
 * @author Sistemas Ursol
 * @license MIT
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ============================================================
// CONFIGURACIÓN DE FORMAS BASE
// ============================================================

const SHAPES = {
  circle: {
    name: 'Círculo',
    description: 'Forma circular clásica',
    template: (colors) => `
  <!-- Forma: Círculo -->
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
    name: 'Hexágono',
    description: 'Forma de gema/cristal',
    template: (colors) => `
  <!-- Forma: Hexágono (Gema) -->
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
    name: 'Escudo',
    description: 'Forma heráldica/académica',
    template: (colors) => `
  <!-- Forma: Escudo Heráldico -->
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
    name: 'Octágono',
    description: 'Forma moderna de 8 lados',
    template: (colors) => `
  <!-- Forma: Octágono -->
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
    name: 'Óvalo',
    description: 'Forma elíptica elegante',
    template: (colors) => `
  <!-- Forma: Óvalo -->
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
    name: 'Diamante',
    description: 'Rombo/diamante rotado',
    template: (colors) => `
  <!-- Forma: Diamante -->
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
// PALETAS DE COLORES PREDEFINIDAS
// ============================================================

const COLOR_PALETTES = {
  ocean: {
    name: '🌊 Océano',
    background: '#0c4a6e',
    border: '#0ea5e9',
    accent: '#7dd3fc',
    text: '#bae6fd',
    icon: '#e0f2fe'
  },
  
  forest: {
    name: '🌲 Bosque',
    background: '#14532d',
    border: '#22c55e',
    accent: '#86efac',
    text: '#bbf7d0',
    icon: '#dcfce7'
  },
  
  sunset: {
    name: '🌅 Atardecer',
    background: '#7c2d12',
    border: '#f97316',
    accent: '#fdba74',
    text: '#fed7aa',
    icon: '#ffedd5'
  },
  
  lavender: {
    name: '💜 Lavanda',
    background: '#581c87',
    border: '#a855f7',
    accent: '#d8b4fe',
    text: '#e9d5ff',
    icon: '#f3e8ff'
  },
  
  midnight: {
    name: '🌙 Medianoche',
    background: '#0f172a',
    border: '#3b82f6',
    accent: '#93c5fd',
    text: '#bfdbfe',
    icon: '#dbeafe'
  },
  
  rose: {
    name: '🌹 Rosa',
    background: '#831843',
    border: '#ec4899',
    accent: '#f9a8d4',
    text: '#fbcfe8',
    icon: '#fce7f3'
  },
  
  gold: {
    name: '🏆 Dorado',
    background: '#451a03',
    border: '#d97706',
    accent: '#fcd34d',
    text: '#fde68a',
    icon: '#fef3c7'
  },
  
  slate: {
    name: '⬜ Slate (Minimalista)',
    background: '#f8fafc',
    border: '#64748b',
    accent: '#94a3b8',
    text: '#475569',
    icon: '#334155'
  },
  
  neon: {
    name: '⚡ Neón',
    background: '#0c0a09',
    border: '#d946ef',
    accent: '#22d3ee',
    text: '#f0abfc',
    icon: '#ffffff'
  },
  
  corporate: {
    name: '💼 Corporativo',
    background: '#1e40af',
    border: '#60a5fa',
    accent: '#93c5fd',
    text: '#dbeafe',
    icon: '#ffffff'
  }
};

// ============================================================
// EFECTOS ESPECIALES
// ============================================================

const EFFECTS = {
  none: {
    name: 'Ninguno',
    defs: '',
    filter: ''
  },
  
  glow: {
    name: 'Resplandor (Glow)',
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
    name: 'Sombra',
    defs: (colors) => `
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/>
    </filter>`,
    filter: 'filter="url(#shadow)"'
  },
  
  gradient: {
    name: 'Gradiente Animado',
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
    name: 'Textura Ruido',
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
// ÍCONOS CENTRALES
// ============================================================

const ICONS = {
  gem: {
    name: '💎 Gema',
    template: (colors, y) => `
  <!-- Ícono: Gema facetada -->
  <g transform="translate(60, ${y})">
    <polygon points="0,-18 14,-6 0,18 -14,-6" fill="${colors.icon}" opacity="0.9"/>
    <polygon points="0,-18 14,-6 0,2 -14,-6" fill="${colors.icon}"/>
    <polygon points="-14,-6 0,2 0,18" fill="${colors.icon}" opacity="0.6"/>
    <polygon points="14,-6 0,2 0,18" fill="${colors.icon}" opacity="0.8"/>
    <line x1="0" y1="-18" x2="0" y2="18" stroke="${colors.accent}" stroke-width="0.5" opacity="0.5"/>
  </g>`
  },
  
  star: {
    name: '⭐ Estrella',
    template: (colors, y) => `
  <!-- Ícono: Estrella de 5 puntas -->
  <polygon points="60,${y-20} 65,${y-5} 80,${y-5} 68,${y+5} 73,${y+20} 60,${y+10} 47,${y+20} 52,${y+5} 40,${y-5} 55,${y-5}" 
           fill="${colors.icon}" 
           stroke="${colors.accent}" 
           stroke-width="1"/>`
  },
  
  badge: {
    name: '🏅 Medalla',
    template: (colors, y) => `
  <!-- Ícono: Medalla circular -->
  <circle cx="60" cy="${y}" r="18" fill="${colors.icon}" stroke="${colors.accent}" stroke-width="2"/>
  <circle cx="60" cy="${y}" r="12" fill="none" stroke="${colors.accent}" stroke-width="1"/>
  <circle cx="60" cy="${y}" r="4" fill="${colors.accent}"/>`
  },
  
  lightning: {
    name: '⚡ Rayo',
    template: (colors, y) => `
  <!-- Ícono: Rayo/Lightning -->
  <polygon points="65,${y-20} 50,${y} 58,${y} 55,${y+20} 70,${y} 62,${y}" 
           fill="${colors.icon}" 
           stroke="${colors.accent}" 
           stroke-width="1"/>`
  },
  
  code: {
    name: '💻 Código',
    template: (colors, y) => `
  <!-- Ícono: Brackets de código -->
  <text x="60" y="${y+8}" font-size="32" fill="${colors.icon}" text-anchor="middle" 
        font-family="monospace" font-weight="bold">&lt;/&gt;</text>`
  },
  
  heart: {
    name: '❤️ Corazón',
    template: (colors, y) => `
  <!-- Ícono: Corazón -->
  <path d="M60,${y+15} C40,${y-5} 40,${y-20} 50,${y-20} C58,${y-20} 60,${y-10} 60,${y-10} C60,${y-10} 62,${y-20} 70,${y-20} C80,${y-20} 80,${y-5} 60,${y+15}Z" 
        fill="${colors.icon}" 
        stroke="${colors.accent}" 
        stroke-width="1"/>`
  },
  
  trophy: {
    name: '🏆 Trofeo',
    template: (colors, y) => `
  <!-- Ícono: Trofeo -->
  <path d="M45,${y-15} L75,${y-15} L72,${y} L68,${y} L68,${y+8} L75,${y+12} L45,${y+12} L52,${y+8} L52,${y} L48,${y} Z" 
        fill="${colors.icon}" 
        stroke="${colors.accent}" 
        stroke-width="1"/>
  <ellipse cx="60" cy="${y-15}" rx="12" ry="4" fill="${colors.accent}" opacity="0.5"/>`
  },
  
  rocket: {
    name: '🚀 Cohete',
    template: (colors, y) => `
  <!-- Ícono: Cohete -->
  <path d="M60,${y-20} C70,${y-10} 70,${y+5} 60,${y+15} C50,${y+5} 50,${y-10} 60,${y-20}Z" 
        fill="${colors.icon}" 
        stroke="${colors.accent}" 
        stroke-width="1"/>
  <polygon points="48,${y+10} 52,${y+5} 52,${y+15} 45,${y+20}" fill="${colors.accent}" opacity="0.8"/>
  <polygon points="72,${y+10} 68,${y+5} 68,${y+15} 75,${y+20}" fill="${colors.accent}" opacity="0.8"/>
  <circle cx="60" cy="${y-5}" r="4" fill="${colors.background}"/>`
  },
  
  none: {
    name: '(Sin ícono)',
    template: () => '  <!-- Sin ícono central -->'
  }
};

// ============================================================
// GENERADOR DE SVG
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
  
  // Override background si el efecto lo requiere
  const effectiveColors = {
    ...colors,
    background: effectConfig.bgOverride || colors.background
  };
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  BOOMFLOW Custom Skin: ${customName || 'Custom'}
  Generado con: generate-custom-skin.js
  Forma: ${shapeConfig.name}
  Paleta: ${colors.name}
  Efecto: ${effectConfig.name}
  Ícono: ${iconConfig.name}
-->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140">
  <defs>
    <!-- Gradiente de fondo -->
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.background}"/>
      <stop offset="100%" style="stop-color:${adjustColor(colors.background, -20)}"/>
    </linearGradient>
    ${effectConfig.defs ? (typeof effectConfig.defs === 'function' ? effectConfig.defs(colors) : effectConfig.defs) : ''}
  </defs>
  
  <!-- Grupo principal ${effectConfig.filter} -->
  <g ${effectConfig.filter}>
${shapeConfig.template(effectiveColors)}
  </g>
  
${iconConfig.template(colors, shapeConfig.iconY)}
  
  <!-- Texto inferior -->
  <text x="60" y="130" font-size="8" fill="${colors.text}" text-anchor="middle" 
        font-family="system-ui, -apple-system, sans-serif" font-weight="600">${customText || 'BADGE'}</text>
</svg>`;

  return svg;
}

/**
 * Ajusta el brillo de un color hex
 */
function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

// ============================================================
// INTERFAZ DE LÍNEA DE COMANDOS
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
  console.log('║     🎨 BOOMFLOW - Generador de Skins Personalizadas 🎨     ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Paso 1: Nombre de la skin
  const customName = await ask('📝 Nombre de tu skin (ej: "Mi Skin Épica"): ');
  
  // Paso 2: Forma base
  console.log('\n🔷 Selecciona la FORMA BASE:');
  printOptions(SHAPES);
  const shapeIndex = parseInt(await ask('\n   Tu elección (1-6): '));
  const shape = getKeyByIndex(SHAPES, shapeIndex) || 'circle';
  
  // Paso 3: Paleta de colores
  console.log('\n🎨 Selecciona la PALETA DE COLORES:');
  printOptions(COLOR_PALETTES);
  const paletteIndex = parseInt(await ask('\n   Tu elección (1-10): '));
  const palette = getKeyByIndex(COLOR_PALETTES, paletteIndex) || 'midnight';
  
  // Paso 4: Efecto especial
  console.log('\n✨ Selecciona un EFECTO ESPECIAL:');
  printOptions(EFFECTS);
  const effectIndex = parseInt(await ask('\n   Tu elección (1-5): '));
  const effect = getKeyByIndex(EFFECTS, effectIndex) || 'none';
  
  // Paso 5: Ícono central
  console.log('\n🏅 Selecciona el ÍCONO CENTRAL:');
  printOptions(ICONS);
  const iconIndex = parseInt(await ask('\n   Tu elección (1-9): '));
  const icon = getKeyByIndex(ICONS, iconIndex) || 'gem';
  
  // Paso 6: Texto personalizado
  const customText = await ask('\n📜 Texto inferior (máx 10 chars, ej: "CUSTOM"): ') || 'BADGE';
  
  // Generar configuración
  const config = {
    shape,
    palette,
    effect,
    icon,
    customText: customText.toUpperCase().substring(0, 10),
    customName
  };
  
  console.log('\n⚙️  Generando SVG con configuración:', JSON.stringify(config, null, 2));
  
  // Generar SVG
  const svg = generateSVG(config);
  
  // Guardar archivo
  const fileName = `skin-${customName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-custom.svg`;
  const outputDir = path.join(__dirname, '..', 'assets', 'skins');
  const outputPath = path.join(outputDir, fileName);
  
  // Crear directorio si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, svg, 'utf-8');
  
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    ✅ SKIN GENERADA                        ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n   📁 Archivo: ${outputPath}`);
  console.log(`   📋 Para usar: Copia el archivo a assets/skins/`);
  console.log(`   🔧 Para registrar: node scripts/badge-admin.js register-skin`);
  console.log('\n   Vista previa del SVG guardada correctamente.\n');
  
  rl.close();
}

// ============================================================
// MODO NO INTERACTIVO (CLI arguments)
// ============================================================

function printUsage() {
  console.log(`
Uso: node generate-custom-skin.js [opciones]

Modo interactivo (sin argumentos):
  node generate-custom-skin.js

Modo línea de comandos:
  node generate-custom-skin.js --shape hexagon --palette ocean --effect glow --icon gem --text "EPIC" --name "Mi Skin"

Opciones:
  --shape    Forma: ${Object.keys(SHAPES).join(', ')}
  --palette  Paleta: ${Object.keys(COLOR_PALETTES).join(', ')}
  --effect   Efecto: ${Object.keys(EFFECTS).join(', ')}
  --icon     Ícono: ${Object.keys(ICONS).join(', ')}
  --text     Texto inferior (máx 10 caracteres)
  --name     Nombre de la skin
  --output   Ruta de salida (opcional)
  --help     Muestra esta ayuda

Ejemplos:
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
  // Modo CLI
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
  console.log(`✅ Skin generada: ${outputPath}`);
} else {
  // Modo interactivo
  main().catch(console.error);
}
