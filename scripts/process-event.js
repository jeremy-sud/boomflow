#!/usr/bin/env node
/**
 * 🎯 BOOMFLOW - Procesador de Eventos de GitHub
 * ==============================================
 * Procesa eventos de GitHub (PRs, Issues, Reviews) y otorga medallas.
 * 
 * Eventos soportados:
 * - pull_request: merged, opened, reviewed
 * - issues: opened, closed
 * - pull_request_review: submitted
 * - push: commits
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Config
const USERS_DIR = path.join(__dirname, '../users');
const CATALOG_PATH = path.join(__dirname, '../api-mock.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

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

// ============================================================================
// REGLAS DE EVENTOS → MEDALLAS
// ============================================================================

const EVENT_RULES = {
  // === PULL REQUESTS ===
  'pull_request.merged': [
    {
      badgeId: 'first-pr',
      description: 'Primer PR mergeado',
      condition: (ctx) => ctx.userStats.prs_merged >= 1
    },
    {
      badgeId: 'code-ninja',
      description: 'Contribución significativa (PR mergeado)',
      condition: (ctx) => ctx.userStats.prs_merged >= 10
    },
    {
      badgeId: 'docs-hero',
      description: 'PR de documentación mergeado',
      condition: (ctx) => {
        const title = (ctx.event.pull_request?.title || '').toLowerCase();
        const labels = ctx.event.pull_request?.labels || [];
        return title.includes('doc') || title.includes('readme') ||
               labels.some(l => l.name?.toLowerCase().includes('doc'));
      }
    },
    {
      badgeId: 'bug-hunter',
      description: 'PR de bugfix mergeado',
      condition: (ctx) => {
        const title = (ctx.event.pull_request?.title || '').toLowerCase();
        const labels = ctx.event.pull_request?.labels || [];
        return title.includes('fix') || title.includes('bug') ||
               labels.some(l => l.name?.toLowerCase().includes('bug') || 
                               l.name?.toLowerCase().includes('fix'));
      }
    },
    {
      badgeId: 'crisis-averted',
      description: 'PR de hotfix crítico mergeado',
      condition: (ctx) => {
        const labels = ctx.event.pull_request?.labels || [];
        return labels.some(l => 
          l.name?.toLowerCase().includes('hotfix') || 
          l.name?.toLowerCase().includes('critical') ||
          l.name?.toLowerCase().includes('urgent')
        );
      }
    },
    {
      badgeId: 'refactor-master',
      description: 'PR de refactoring mergeado',
      condition: (ctx) => {
        const title = (ctx.event.pull_request?.title || '').toLowerCase();
        const labels = ctx.event.pull_request?.labels || [];
        return title.includes('refactor') ||
               labels.some(l => l.name?.toLowerCase().includes('refactor'));
      }
    }
  ],

  // === CODE REVIEWS ===
  'pull_request_review.submitted': [
    {
      badgeId: 'first-review',
      description: 'Primera code review realizada',
      condition: (ctx) => ctx.userStats.reviews >= 1
    },
    {
      badgeId: 'code-reviewer',
      description: 'Code reviewer activo (5+ reviews)',
      condition: (ctx) => ctx.userStats.reviews >= 5
    },
    {
      badgeId: 'mentor',
      description: 'Mentor activo (20+ reviews con comentarios constructivos)',
      condition: (ctx) => ctx.userStats.reviews >= 20
    }
  ],

  // === ISSUES ===
  'issues.opened': [
    {
      badgeId: 'bug-hunter',
      description: 'Issue de bug reportado',
      condition: (ctx) => {
        const labels = ctx.event.issue?.labels || [];
        return labels.some(l => l.name?.toLowerCase().includes('bug'));
      }
    }
  ],

  'issues.closed': [
    {
      badgeId: 'bug-hunter',
      description: 'Issue de bug cerrado',
      condition: (ctx) => {
        const labels = ctx.event.issue?.labels || [];
        return labels.some(l => l.name?.toLowerCase().includes('bug'));
      }
    }
  ],

  // === RELEASE ===
  'release.published': [
    {
      badgeId: 'cicd-master',
      description: 'Release publicado',
      condition: () => true
    }
  ],

  // === PUSH (commits) ===
  'push': [
    {
      badgeId: 'first-commit',
      description: 'Primer commit',
      condition: (ctx) => ctx.userStats.commits >= 1
    },
    {
      badgeId: 'code-ninja',
      description: '50+ commits',
      condition: (ctx) => ctx.userStats.commits >= 50
    }
  ]
};

// ============================================================================
// UTILIDADES
// ============================================================================

function loadUser(username) {
  const userPath = path.join(USERS_DIR, `${username}.json`);
  if (!fs.existsSync(userPath)) return null;
  return JSON.parse(fs.readFileSync(userPath, 'utf8'));
}

function saveUser(username, data) {
  const userPath = path.join(USERS_DIR, `${username}.json`);
  fs.writeFileSync(userPath, JSON.stringify(data, null, 2) + '\n');
}

function hasBadge(userData, badgeId) {
  return userData.badges?.some(b => b.id === badgeId);
}

function badgeExists(badgeId) {
  if (!fs.existsSync(CATALOG_PATH)) return false;
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  return catalog.some(b => b.id === badgeId);
}

function isRegisteredUser(username) {
  return fs.existsSync(path.join(USERS_DIR, `${username}.json`));
}

// ============================================================================
// GITHUB API
// ============================================================================

function githubRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'User-Agent': 'BOOMFLOW-EventProcessor',
        'Accept': 'application/vnd.github.v3+json',
      }
    };

    if (GITHUB_TOKEN) {
      options.headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({});
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function getUserStats(username) {
  const stats = {
    commits: 0,
    prs_merged: 0,
    prs_opened: 0,
    reviews: 0,
    issues_opened: 0,
    issues_closed: 0,
  };

  try {
    // Buscar PRs mergeados del usuario
    const prsSearch = await githubRequest(
      `/search/issues?q=author:${username}+type:pr+is:merged&per_page=1`
    );
    if (prsSearch.total_count !== undefined) {
      stats.prs_merged = prsSearch.total_count;
    }

    // Buscar PRs abiertos
    const prsOpenSearch = await githubRequest(
      `/search/issues?q=author:${username}+type:pr&per_page=1`
    );
    if (prsOpenSearch.total_count !== undefined) {
      stats.prs_opened = prsOpenSearch.total_count;
    }

    // Buscar issues cerrados
    const issuesSearch = await githubRequest(
      `/search/issues?q=author:${username}+type:issue+is:closed&per_page=1`
    );
    if (issuesSearch.total_count !== undefined) {
      stats.issues_closed = issuesSearch.total_count;
    }

    // Buscar commits
    const commitsSearch = await githubRequest(
      `/search/commits?q=author:${username}&per_page=1`
    );
    if (commitsSearch.total_count !== undefined) {
      stats.commits = commitsSearch.total_count;
    }

    // Las reviews son más difíciles de contar via API, usar eventos
    const events = await githubRequest(`/users/${username}/events?per_page=100`);
    if (Array.isArray(events)) {
      stats.reviews = events.filter(e => e.type === 'PullRequestReviewEvent').length;
    }

  } catch (e) {
    log(colors.yellow, `⚠️ Error obteniendo stats: ${e.message}`);
  }

  return stats;
}

// ============================================================================
// PROCESADOR DE EVENTOS
// ============================================================================

async function processEvent(eventType, eventData) {
  log(colors.cyan, '═══════════════════════════════════════════════════════');
  log(colors.cyan, '🎯 BOOMFLOW - Procesador de Eventos');
  log(colors.cyan, '═══════════════════════════════════════════════════════');
  log(colors.reset, `📅 Timestamp: ${new Date().toISOString()}`);
  log(colors.reset, `📝 Evento: ${eventType}`);

  // Determinar el usuario del evento
  let username = null;
  
  if (eventType.startsWith('pull_request')) {
    if (eventType === 'pull_request_review.submitted') {
      username = eventData.review?.user?.login;
    } else {
      username = eventData.pull_request?.user?.login;
    }
  } else if (eventType.startsWith('issues')) {
    username = eventData.issue?.user?.login;
  } else if (eventType === 'push') {
    username = eventData.pusher?.name || eventData.sender?.login;
  } else if (eventType.startsWith('release')) {
    username = eventData.release?.author?.login;
  }

  if (!username) {
    log(colors.yellow, '⚠️ No se pudo determinar el usuario del evento');
    return { badgesAwarded: 0 };
  }

  log(colors.blue, `👤 Usuario: @${username}`);

  // Verificar si el usuario está registrado en BOOMFLOW
  if (!isRegisteredUser(username)) {
    log(colors.yellow, `⚠️ @${username} no está registrado en BOOMFLOW. Ignorando.`);
    return { badgesAwarded: 0, reason: 'user_not_registered' };
  }

  // Cargar datos del usuario
  const userData = loadUser(username);
  log(colors.green, `✅ Usuario encontrado: ${userData.displayName || username}`);

  // Obtener stats actualizadas del usuario
  log(colors.blue, '📊 Obteniendo estadísticas de GitHub...');
  const userStats = await getUserStats(username);
  log(colors.cyan, `   Commits: ${userStats.commits}, PRs: ${userStats.prs_merged}, Reviews: ${userStats.reviews}`);

  // Buscar reglas para este tipo de evento
  const rules = EVENT_RULES[eventType] || [];
  if (rules.length === 0) {
    log(colors.yellow, `⚠️ No hay reglas definidas para el evento: ${eventType}`);
    return { badgesAwarded: 0 };
  }

  log(colors.blue, `🔍 Evaluando ${rules.length} regla(s)...`);

  // Contexto para evaluar condiciones
  const context = {
    event: eventData,
    userStats,
    userData,
    username,
  };

  const newBadges = [];

  for (const rule of rules) {
    // Saltar si ya tiene la medalla
    if (hasBadge(userData, rule.badgeId)) {
      continue;
    }

    // Saltar si la medalla no existe en el catálogo
    if (!badgeExists(rule.badgeId)) {
      continue;
    }

    // Evaluar condición
    try {
      if (rule.condition(context)) {
        log(colors.green, `   🏅 ¡Nueva medalla! ${rule.badgeId} - ${rule.description}`);
        
        newBadges.push({
          id: rule.badgeId,
          awardedAt: new Date().toISOString().split('T')[0],
          awardedBy: 'github-webhook',
          autoAwarded: true,
          reason: rule.description,
          triggeredBy: eventType
        });
      }
    } catch (e) {
      log(colors.yellow, `   ⚠️ Error evaluando ${rule.badgeId}: ${e.message}`);
    }
  }

  // Guardar nuevas medallas
  if (newBadges.length > 0) {
    userData.badges = userData.badges || [];
    userData.badges.push(...newBadges);
    saveUser(username, userData);
    log(colors.magenta, `\n🎉 ${newBadges.length} medalla(s) otorgada(s) a @${username}`);
  } else {
    log(colors.blue, `\nℹ️ No hay nuevas medallas para @${username}`);
  }

  return {
    username,
    badgesAwarded: newBadges.length,
    badges: newBadges.map(b => b.id)
  };
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎯 BOOMFLOW - Procesador de Eventos de GitHub
==============================================

USO:
  node scripts/process-event.js <event-type> [event-file.json]

EVENTOS SOPORTADOS:
  pull_request.merged        - PR fue mergeado
  pull_request.opened        - PR fue abierto
  pull_request_review.submitted  - Review fue enviado
  issues.opened              - Issue fue abierto
  issues.closed              - Issue fue cerrado
  release.published          - Release fue publicado
  push                       - Commits fueron pusheados

EJEMPLOS:
  node scripts/process-event.js pull_request.merged event.json
  
  # Con evento desde stdin (usado por GitHub Actions)
  echo '{"pull_request":{"user":{"login":"jeremy-sud"}}}' | \\
    node scripts/process-event.js pull_request.merged

VARIABLES DE ENTORNO:
  GITHUB_TOKEN / GH_TOKEN    - Token de GitHub para API
  GITHUB_EVENT_PATH          - Ruta al archivo de evento (GitHub Actions)
`);
    process.exit(0);
  }

  const eventType = args[0];
  let eventData = {};

  // Cargar evento desde archivo, variable de entorno, o stdin
  if (args[1]) {
    // Archivo especificado
    eventData = JSON.parse(fs.readFileSync(args[1], 'utf8'));
  } else if (process.env.GITHUB_EVENT_PATH) {
    // GitHub Actions proporciona el evento en este archivo
    eventData = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  } else {
    // Intentar leer de stdin (para testing)
    const stdin = fs.readFileSync(0, 'utf8').trim();
    if (stdin) {
      eventData = JSON.parse(stdin);
    }
  }

  const result = await processEvent(eventType, eventData);
  
  // Output para GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const output = `badges_awarded=${result.badgesAwarded}\nusername=${result.username || ''}\nbadges=${(result.badges || []).join(',')}`;
    fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
  }

  process.exit(result.badgesAwarded > 0 ? 0 : 0);
}

main().catch(e => {
  log(colors.red, `❌ Error: ${e.message}`);
  process.exit(1);
});

module.exports = { processEvent, EVENT_RULES };
