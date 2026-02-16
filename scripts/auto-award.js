#!/usr/bin/env node
/**
 * 🏅 BOOMFLOW - Auto-Award System
 * ====================================
 * Automatically verifies GitHub metrics of registered collaborators
 * and awards badges based on their activity.
 * 
 * This script runs daily via GitHub Actions.
 * 
 * Verified metrics:
 * - Total commits
 * - Pull Requests (opened, merged)
 * - Code Reviews performed
 * - Issues (reported, closed)
 * - Time on team (anniversaries)
 * - Documentation contributions
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const USERS_DIR = path.join(__dirname, '../users');
const CATALOG_PATH = path.join(__dirname, '../api-mock.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN or GH_TOKEN environment variable is required');
  process.exit(1);
}
const ORG_REPOS = (process.env.BOOMFLOW_REPOS || 'jeremy-sud/boomflow').split(',').map(r => r.trim()); // Repositories to monitor (env: BOOMFLOW_REPOS=owner/repo1,owner/repo2)

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

// ============================================================================
// AUTO-AWARD RULES
// ============================================================================
// Each rule defines:
// - badgeId: ID of the badge to award
// - check: Function that receives metrics and returns true if met
// - description: Description for logs
// ============================================================================

const AUTO_AWARD_RULES = [
  // === ONBOARDING ===
  {
    badgeId: 'hello-world',
    description: 'Profile created in BOOMFLOW',
    check: (metrics, userData) => {
      // Awarded when profile is created (if it has joinedAt)
      return userData.joinedAt && !hasBadge(userData, 'hello-world');
    }
  },
  {
    badgeId: 'first-commit',
    description: 'First commit made',
    check: (metrics) => metrics.commits >= 1
  },
  {
    badgeId: 'first-pr',
    description: 'First PR merged',
    check: (metrics) => metrics.prs_merged >= 1
  },
  {
    badgeId: 'first-review',
    description: 'First code review performed',
    check: (metrics) => metrics.reviews >= 1
  },
  {
    badgeId: 'week-one',
    description: 'One week on the team',
    check: (metrics, userData) => {
      const days = daysSinceJoined(userData);
      return days >= 7;
    }
  },
  {
    badgeId: 'month-one',
    description: 'One month on the team',
    check: (metrics, userData) => {
      const days = daysSinceJoined(userData);
      return days >= 30;
    }
  },
  {
    badgeId: 'year-one',
    description: 'One year on the team',
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
    description: '10+ bug issues closed',
    check: (metrics) => metrics.bugs_closed >= 10
  },
  {
    badgeId: 'refactor-master',
    description: '20+ refactor PRs',
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
    description: '25+ PRs merged',
    check: (metrics) => metrics.prs_merged >= 25
  },
  {
    badgeId: 'review-guru',
    description: '50+ code reviews',
    check: (metrics) => metrics.reviews >= 50
  },
  {
    badgeId: 'team-player',
    description: '10+ PRs reviewed',
    check: (metrics) => metrics.reviews >= 10
  },
  {
    badgeId: 'helpful-hero',
    description: '20+ comments on others\' PRs',
    check: (metrics) => metrics.pr_comments >= 20
  },

  // === DOCUMENTATION ===
  {
    badgeId: 'docs-contributor',
    description: '5+ documentation commits',
    check: (metrics) => metrics.docs_commits >= 5
  },
  {
    badgeId: 'docs-hero',
    description: '20+ documentation commits',
    check: (metrics) => metrics.docs_commits >= 20
  },

  // === MILESTONES ===
  {
    badgeId: 'streak-7',
    description: '7 consecutive days of commits',
    check: (metrics) => metrics.longest_streak >= 7
  },
  {
    badgeId: 'streak-30',
    description: '30 consecutive days of commits',
    check: (metrics) => metrics.longest_streak >= 30
  },
  {
    badgeId: 'early-bird',
    description: '10+ commits before 8am',
    check: (metrics) => metrics.early_commits >= 10
  },
  {
    badgeId: 'night-owl',
    description: '10+ commits after 10pm',
    check: (metrics) => metrics.late_commits >= 10
  },
];

// ============================================================================
// UTILITIES
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
      log(colors.yellow, `⚠️ Error reading ${file}: ${e.message}`);
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
  log(colors.blue, `📊 Getting GitHub metrics for @${username}...`);
  
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
    // Get user events
    const events = await githubRequest(`/users/${username}/events?per_page=100`);
    
    if (Array.isArray(events)) {
      for (const event of events) {
        switch (event.type) {
          case 'PushEvent':
            const commits = event.payload.commits || [];
            metrics.commits += commits.length;
            
            // Analyze commits for docs
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
              // Check if it's a bug
              const labels = event.payload.issue?.labels || [];
              if (labels.some(l => l.name?.toLowerCase().includes('bug'))) {
                metrics.bugs_closed++;
              }
            }
            break;
        }
      }
    }

    // Get additional profile statistics
    const user = await githubRequest(`/users/${username}`);
    if (user && user.public_repos !== undefined) {
      log(colors.cyan, `   📈 Public repos: ${user.public_repos}`);
    }

    // Try to get contributions (limited without auth)
    const searchCommits = await githubRequest(
      `/search/commits?q=author:${username}&per_page=1`
    );
    if (searchCommits && searchCommits.total_count) {
      metrics.commits = Math.max(metrics.commits, searchCommits.total_count);
    }

  } catch (error) {
    log(colors.yellow, `⚠️ Error getting metrics: ${error.message}`);
  }

  log(colors.green, `   ✅ Commits: ${metrics.commits}, PRs: ${metrics.prs_merged}, Reviews: ${metrics.reviews}`);
  
  return metrics;
}

// ============================================================================
// AUTO-AWARD ENGINE
// ============================================================================

async function processUser(userData) {
  log(colors.cyan, `\n👤 Processing: ${userData.displayName || userData.username}`);
  
  const metrics = await fetchUserMetrics(userData.username);
  const newBadges = [];
  
  for (const rule of AUTO_AWARD_RULES) {
    // Skip if already has the badge
    if (hasBadge(userData, rule.badgeId)) {
      continue;
    }
    
    // Skip if badge doesn't exist in catalog
    if (!badgeExists(rule.badgeId)) {
      continue;
    }
    
    // Check if rule is met
    try {
      if (rule.check(metrics, userData)) {
        log(colors.green, `   🏅 New badge! ${rule.badgeId} - ${rule.description}`);
        
        newBadges.push({
          id: rule.badgeId,
          awardedAt: new Date().toISOString().split('T')[0],
          awardedBy: 'auto-award-system',
          autoAwarded: true,
          reason: rule.description
        });
      }
    } catch (e) {
      log(colors.yellow, `   ⚠️ Error evaluating ${rule.badgeId}: ${e.message}`);
    }
  }
  
  if (newBadges.length > 0) {
    userData.badges = userData.badges || [];
    userData.badges.push(...newBadges);
    saveUser(userData);
    log(colors.magenta, `   🎉 ${newBadges.length} new badge(s) awarded`);
  } else {
    log(colors.blue, `   ℹ️ No new badges to award`);
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
  log(colors.reset, `👥 Registered users: ${users.length}`);
  
  if (users.length === 0) {
    log(colors.yellow, '\n⚠️ No registered users in /users/');
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
      
      // Wait a bit between users to avoid exceeding rate limits
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (error) {
      log(colors.red, `❌ Error processing ${user.username}: ${error.message}`);
      summary.errors++;
    }
  }
  
  // Final summary
  log(colors.cyan, '\n═══════════════════════════════════════════════════════');
  log(colors.cyan, '📊 SUMMARY');
  log(colors.cyan, '═══════════════════════════════════════════════════════');
  log(colors.reset, `✅ Users processed: ${summary.processed}`);
  log(colors.green, `🏅 Badges awarded: ${summary.badgesAwarded}`);
  log(colors.red, `❌ Errors: ${summary.errors}`);
  
  if (summary.details.length > 0) {
    log(colors.yellow, '\n📋 Badge award details:');
    for (const detail of summary.details) {
      log(colors.reset, `   @${detail.user}: ${detail.badges.join(', ')}`);
    }
  }
  
  // Write summary for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const output = `badges_awarded=${summary.badgesAwarded}\nusers_processed=${summary.processed}`;
    fs.appendFileSync(process.env.GITHUB_OUTPUT, output);
  }
  
  return summary;
}

// ============================================================================
// EXECUTION
// ============================================================================

if (require.main === module) {
  runAutoAward()
    .then(summary => {
      if (summary.badgesAwarded > 0) {
        log(colors.green, '\n✅ Auto-award completed. Remember to commit and push changes.');
      }
      process.exit(0);
    })
    .catch(error => {
      log(colors.red, `\n❌ Fatal error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runAutoAward, AUTO_AWARD_RULES };
