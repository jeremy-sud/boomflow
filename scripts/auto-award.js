#!/usr/bin/env node
/**
 * 🏅 BOOMFLOW - Sistema de Auto-Award
 * ====================================
 * Verifica automáticamente las métricas de GitHub de los colaboradores
 * registrados y otorga medallas basándose en su actividad.
 * 
 * Este script corre diariamente via GitHub Actions.
 * 
 * Métricas verificadas:
 * - Commits totales
 * - Pull Requests (abiertas, mergeadas)
 * - Code Reviews realizadas
 * - Issues (reportadas, cerradas)
 * - Tiempo en el equipo (aniversarios)
 * - Contribuciones a documentación
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuración
const USERS_DIR = path.join(__dirname, '../users');
const CATALOG_PATH = path.join(__dirname, '../api-mock.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
const ORG_REPOS = ['jeremy-sud/boomflow']; // Repositorios a monitorear

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
// REGLAS DE AUTO-AWARD
// ============================================================================
// Cada regla define:
// - badgeId: ID de la medalla a otorgar
// - check: Función que recibe métricas y retorna true si se cumple
// - description: Descripción para logs
// ============================================================================

const AUTO_AWARD_RULES = [
  // === ONBOARDING ===
  {
    badgeId: 'hello-world',
    description: 'Perfil creado en BOOMFLOW',
    check: (metrics, userData) => {
      // Se otorga al crear el perfil (si tiene joinedAt)
      return userData.joinedAt && !hasBadge(userData, 'hello-world');
    }
  },
  {
    badgeId: 'first-commit',
    description: 'Primer commit realizado',
    check: (metrics) => metrics.commits >= 1
  },
  {
    badgeId: 'first-pr',
    description: 'Primer PR mergeado',
    check: (metrics) => metrics.prs_merged >= 1
  },
  {
    badgeId: 'first-review',
    description: 'Primera code review realizada',
    check: (metrics) => metrics.reviews >= 1
  },
  {
    badgeId: 'week-one',
    description: 'Una semana en el equipo',
    check: (metrics, userData) => {
      const days = daysSinceJoined(userData);
      return days >= 7;
    }
  },
  {
    badgeId: 'month-one',
    description: 'Un mes en el equipo',
    check: (metrics, userData) => {
      const days = daysSinceJoined(userData);
      return days >= 30;
    }
  },
  {
    badgeId: 'year-one',
    description: 'Un año en el equipo',
    check: (metrics, userData) => {
      const days = daysSinceJoined(userData);
      return days >= 365;
    }
  },

  // === CODING ===
  {
    badgeId: 'code-ninja',
    description: '50+ commits',
    check: (metrics) => metrics.commits >= 50
  },
  {
    badgeId: 'bug-hunter',
    description: '10+ issues de bugs cerradas',
    check: (metrics) => metrics.bugs_closed >= 10
  },
  {
    badgeId: 'refactor-master',
    description: '20+ PRs de refactor',
    check: (metrics) => metrics.refactor_prs >= 20
  },
  {
    badgeId: 'commit-century',
    description: '100+ commits',
    check: (metrics) => metrics.commits >= 100
  },
  {
    badgeId: 'commit-500',
    description: '500+ commits',
    check: (metrics) => metrics.commits >= 500
  },
  {
    badgeId: 'commit-1000',
    description: '1000+ commits',
    check: (metrics) => metrics.commits >= 1000
  },

  // === COLLABORATION ===
  {
    badgeId: 'pr-champion',
    description: '25+ PRs mergeadas',
    check: (metrics) => metrics.prs_merged >= 25
  },
  {
    badgeId: 'review-guru',
    description: '50+ code reviews',
    check: (metrics) => metrics.reviews >= 50
  },
  {
    badgeId: 'team-player',
    description: '10+ PRs revisadas',
    check: (metrics) => metrics.reviews >= 10
  },
  {
    badgeId: 'helpful-hero',
    description: '20+ comentarios en PRs de otros',
    check: (metrics) => metrics.pr_comments >= 20
  },

  // === DOCUMENTATION ===
  {
    badgeId: 'docs-contributor',
    description: '5+ commits a documentación',
    check: (metrics) => metrics.docs_commits >= 5
  },
  {
    badgeId: 'docs-hero',
    description: '20+ commits a documentación',
    check: (metrics) => metrics.docs_commits >= 20
  },

  // === MILESTONES ===
  {
    badgeId: 'streak-7',
    description: '7 días consecutivos de commits',
    check: (metrics) => metrics.longest_streak >= 7
  },
  {
    badgeId: 'streak-30',
    description: '30 días consecutivos de commits',
    check: (metrics) => metrics.longest_streak >= 30
  },
  {
    badgeId: 'early-bird',
    description: '10+ commits antes de las 8am',
    check: (metrics) => metrics.early_commits >= 10
  },
  {
    badgeId: 'night-owl',
    description: '10+ commits después de las 10pm',
    check: (metrics) => metrics.late_commits >= 10
  },
];

// ============================================================================
// UTILIDADES
// ============================================================================

function hasBadge(userData, badgeId) {
  return userData.badges && userData.badges.some(b => b.id === badgeId);
}

function daysSinceJoined(userData) {
  if (!userData.joinedAt) return 0;
  const joined = new Date(userData.joinedAt);
  const now = new Date();
  return Math.floor((now - joined) / (1000 * 60 * 60 * 24));
}

function loadUsers() {
  const users = [];
  if (!fs.existsSync(USERS_DIR)) return users;
  
  const files = fs.readdirSync(USERS_DIR).filter(f => f.endsWith('.json'));
  for (const file of files) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(USERS_DIR, file), 'utf8'));
      users.push(data);
    } catch (e) {
      log(colors.yellow, `⚠️ Error leyendo ${file}: ${e.message}`);
    }
  }
  return users;
}

function saveUser(userData) {
  const filePath = path.join(USERS_DIR, `${userData.username}.json`);
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2) + '\n');
}

function loadCatalog() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
}

function badgeExists(badgeId) {
  const catalog = loadCatalog();
  return catalog.some(b => b.id === badgeId);
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
        'User-Agent': 'BOOMFLOW-AutoAward',
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
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function fetchUserMetrics(username) {
  log(colors.blue, `📊 Obteniendo métricas de GitHub para @${username}...`);
  
  const metrics = {
    commits: 0,
    prs_opened: 0,
    prs_merged: 0,
    reviews: 0,
    pr_comments: 0,
    issues_opened: 0,
    issues_closed: 0,
    bugs_closed: 0,
    refactor_prs: 0,
    docs_commits: 0,
    longest_streak: 0,
    early_commits: 0,
    late_commits: 0,
  };

  try {
    // Obtener eventos del usuario
    const events = await githubRequest(`/users/${username}/events?per_page=100`);
    
    if (Array.isArray(events)) {
      for (const event of events) {
        switch (event.type) {
          case 'PushEvent':
            const commits = event.payload.commits || [];
            metrics.commits += commits.length;
            
            // Analizar commits para docs
            for (const commit of commits) {
              const msg = (commit.message || '').toLowerCase();
              if (msg.includes('doc') || msg.includes('readme') || msg.includes('docs:')) {
                metrics.docs_commits++;
              }
              if (msg.includes('refactor') || msg.includes('refact')) {
                metrics.refactor_prs++;
              }
            }
            break;
            
          case 'PullRequestEvent':
            if (event.payload.action === 'opened') {
              metrics.prs_opened++;
            }
            if (event.payload.pull_request?.merged) {
              metrics.prs_merged++;
            }
            break;
            
          case 'PullRequestReviewEvent':
            metrics.reviews++;
            break;
            
          case 'PullRequestReviewCommentEvent':
            metrics.pr_comments++;
            break;
            
          case 'IssuesEvent':
            if (event.payload.action === 'opened') {
              metrics.issues_opened++;
            }
            if (event.payload.action === 'closed') {
              metrics.issues_closed++;
              // Verificar si es bug
              const labels = event.payload.issue?.labels || [];
              if (labels.some(l => l.name?.toLowerCase().includes('bug'))) {
                metrics.bugs_closed++;
              }
            }
            break;
        }
      }
    }

    // Obtener estadísticas adicionales del perfil
    const user = await githubRequest(`/users/${username}`);
    if (user && user.public_repos !== undefined) {
      log(colors.cyan, `   📈 Repos públicos: ${user.public_repos}`);
    }

    // Intentar obtener contribuciones (limitado sin auth)
    const searchCommits = await githubRequest(
      `/search/commits?q=author:${username}&per_page=1`
    );
    if (searchCommits && searchCommits.total_count) {
      metrics.commits = Math.max(metrics.commits, searchCommits.total_count);
    }

  } catch (error) {
    log(colors.yellow, `⚠️ Error obteniendo métricas: ${error.message}`);
  }

  log(colors.green, `   ✅ Commits: ${metrics.commits}, PRs: ${metrics.prs_merged}, Reviews: ${metrics.reviews}`);
  
  return metrics;
}

// ============================================================================
// MOTOR DE AUTO-AWARD
// ============================================================================

async function processUser(userData) {
  log(colors.cyan, `\n👤 Procesando: ${userData.displayName || userData.username}`);
  
  const metrics = await fetchUserMetrics(userData.username);
  const newBadges = [];
  
  for (const rule of AUTO_AWARD_RULES) {
    // Saltar si ya tiene la medalla
    if (hasBadge(userData, rule.badgeId)) {
      continue;
    }
    
    // Saltar si la medalla no existe en el catálogo
    if (!badgeExists(rule.badgeId)) {
      continue;
    }
    
    // Verificar si cumple la regla
    try {
      if (rule.check(metrics, userData)) {
        log(colors.green, `   🏅 ¡Nueva medalla! ${rule.badgeId} - ${rule.description}`);
        
        newBadges.push({
          id: rule.badgeId,
          awardedAt: new Date().toISOString().split('T')[0],
          awardedBy: 'auto-award-system',
          autoAwarded: true,
          reason: rule.description
        });
      }
    } catch (e) {
      log(colors.yellow, `   ⚠️ Error evaluando ${rule.badgeId}: ${e.message}`);
    }
  }
  
  if (newBadges.length > 0) {
    userData.badges = userData.badges || [];
    userData.badges.push(...newBadges);
    saveUser(userData);
    log(colors.magenta, `   🎉 ${newBadges.length} nueva(s) medalla(s) otorgada(s)`);
  } else {
    log(colors.blue, `   ℹ️ No hay nuevas medallas para otorgar`);
  }
  
  return newBadges;
}

async function runAutoAward() {
  log(colors.cyan, '═══════════════════════════════════════════════════════');
  log(colors.cyan, '🏅 BOOMFLOW - Sistema de Auto-Award');
  log(colors.cyan, '═══════════════════════════════════════════════════════');
  log(colors.reset, `📅 Fecha: ${new Date().toISOString()}`);
  log(colors.reset, `🔑 Token: ${GITHUB_TOKEN ? 'Configurado ✓' : 'No configurado (limitado)'}`);
  
  const users = loadUsers();
  log(colors.reset, `👥 Usuarios registrados: ${users.length}`);
  
  if (users.length === 0) {
    log(colors.yellow, '\n⚠️ No hay usuarios registrados en /users/');
    return;
  }
  
  const summary = {
    processed: 0,
    badgesAwarded: 0,
    errors: 0,
    details: []
  };
  
  for (const user of users) {
    try {
      const newBadges = await processUser(user);
      summary.processed++;
      summary.badgesAwarded += newBadges.length;
      
      if (newBadges.length > 0) {
        summary.details.push({
          user: user.username,
          badges: newBadges.map(b => b.id)
        });
      }
      
      // Esperar un poco entre usuarios para no exceder rate limits
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (error) {
      log(colors.red, `❌ Error procesando ${user.username}: ${error.message}`);
      summary.errors++;
    }
  }
  
  // Resumen final
  log(colors.cyan, '\n═══════════════════════════════════════════════════════');
  log(colors.cyan, '📊 RESUMEN');
  log(colors.cyan, '═══════════════════════════════════════════════════════');
  log(colors.reset, `✅ Usuarios procesados: ${summary.processed}`);
  log(colors.green, `🏅 Medallas otorgadas: ${summary.badgesAwarded}`);
  log(colors.red, `❌ Errores: ${summary.errors}`);
  
  if (summary.details.length > 0) {
    log(colors.yellow, '\n📋 Detalle de medallas otorgadas:');
    for (const detail of summary.details) {
      log(colors.reset, `   @${detail.user}: ${detail.badges.join(', ')}`);
    }
  }
  
  // Escribir resumen para GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const output = `badges_awarded=${summary.badgesAwarded}\nusers_processed=${summary.processed}`;
    fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
  }
  
  return summary;
}

// ============================================================================
// EJECUCIÓN
// ============================================================================

if (require.main === module) {
  runAutoAward()
    .then(summary => {
      if (summary.badgesAwarded > 0) {
        log(colors.green, '\n✅ Auto-award completado. Recuerda hacer commit y push de los cambios.');
      }
      process.exit(0);
    })
    .catch(error => {
      log(colors.red, `\n❌ Error fatal: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runAutoAward, AUTO_AWARD_RULES };
