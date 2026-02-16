#!/usr/bin/env node
/**
 * 🎯 BOOMFLOW - GitHub Event Processor
 * ==============================================
 * Processes GitHub events (PRs, Issues, Reviews) and awards badges.
 * 
 * Supported events:
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
// EVENT → BADGE RULES
// ============================================================================

const EVENT_RULES = {
  // === PULL REQUESTS ===
  'pull_request.merged': [
    {
      badgeId: 'first-pr',
      description: 'First PR merged',
      condition: (ctx) => ctx.userStats.prs_merged >= 1
    },
    {
      badgeId: 'code-ninja',
      description: 'Significant contribution (merged PR)',
      condition: (ctx) => ctx.userStats.prs_merged >= 10
    },
    {
      badgeId: 'docs-hero',
      description: 'Documentation PR merged',
      condition: (ctx) => {
        const title = (ctx.event.pull_request?.title || '').toLowerCase();
        const labels = ctx.event.pull_request?.labels || [];
        return title.includes('doc') || title.includes('readme') ||
               labels.some(l => l.name?.toLowerCase().includes('doc'));
      }
    },
    {
      badgeId: 'bug-hunter',
      description: 'Bugfix PR merged',
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
      description: 'Critical hotfix PR merged',
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
      description: 'Refactoring PR merged',
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
      description: 'First code review performed',
      condition: (ctx) => ctx.userStats.reviews >= 1
    },
    {
      badgeId: 'code-reviewer',
      description: 'Active code reviewer (5+ reviews)',
      condition: (ctx) => ctx.userStats.reviews >= 5
    },
    {
      badgeId: 'mentor',
      description: 'Active mentor (20+ reviews with constructive feedback)',
      condition: (ctx) => ctx.userStats.reviews >= 20
    }
  ],

  // === ISSUES ===
  'issues.opened': [
    {
      badgeId: 'bug-hunter',
      description: 'Bug issue reported',
      condition: (ctx) => {
        const labels = ctx.event.issue?.labels || [];
        return labels.some(l => l.name?.toLowerCase().includes('bug'));
      }
    }
  ],

  'issues.closed': [
    {
      badgeId: 'bug-hunter',
      description: 'Bug issue closed',
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
      description: 'Release published',
      condition: () => true
    }
  ],

  // === PUSH (commits) ===
  'push': [
    {
      badgeId: 'first-commit',
      description: 'First commit',
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
// UTILITIES
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
    // Find user's merged PRs
    const prsSearch = await githubRequest(
      `/search/issues?q=author:${username}+type:pr+is:merged&per_page=1`
    );
    if (prsSearch.total_count !== undefined) {
      stats.prs_merged = prsSearch.total_count;
    }

    // Find open PRs
    const prsOpenSearch = await githubRequest(
      `/search/issues?q=author:${username}+type:pr&per_page=1`
    );
    if (prsOpenSearch.total_count !== undefined) {
      stats.prs_opened = prsOpenSearch.total_count;
    }

    // Find closed issues
    const issuesSearch = await githubRequest(
      `/search/issues?q=author:${username}+type:issue+is:closed&per_page=1`
    );
    if (issuesSearch.total_count !== undefined) {
      stats.issues_closed = issuesSearch.total_count;
    }

    // Find commits
    const commitsSearch = await githubRequest(
      `/search/commits?q=author:${username}&per_page=1`
    );
    if (commitsSearch.total_count !== undefined) {
      stats.commits = commitsSearch.total_count;
    }

    // Reviews are harder to count via API, use events
    const events = await githubRequest(`/users/${username}/events?per_page=100`);
    if (Array.isArray(events)) {
      stats.reviews = events.filter(e => e.type === 'PullRequestReviewEvent').length;
    }

  } catch (e) {
    log(colors.yellow, `⚠️ Error getting stats: ${e.message}`);
  }

  return stats;
}

// ============================================================================
// EVENT PROCESSOR
// ============================================================================

async function processEvent(eventType, eventData) {
  log(colors.cyan, '═══════════════════════════════════════════════════════');
  log(colors.cyan, '🎯 BOOMFLOW - Event Processor');
  log(colors.cyan, '═══════════════════════════════════════════════════════');
  log(colors.reset, `📅 Timestamp: ${new Date().toISOString()}`);
  log(colors.reset, `📝 Evento: ${eventType}`);

  // Determine the event user
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
    log(colors.yellow, '⚠️ Could not determine the event user');
    return { badgesAwarded: 0 };
  }

  log(colors.blue, `👤 User: @${username}`);

  // Check if user is registered in BOOMFLOW
  if (!isRegisteredUser(username)) {
    log(colors.yellow, `⚠️ @${username} is not registered in BOOMFLOW. Ignoring.`);
    return { badgesAwarded: 0, reason: 'user_not_registered' };
  }

  // Load user data
  const userData = loadUser(username);
  log(colors.green, `✅ User found: ${userData.displayName || username}`);

  // Get updated user stats
  log(colors.blue, '📊 Getting GitHub statistics...');
  const userStats = await getUserStats(username);
  log(colors.cyan, `   Commits: ${userStats.commits}, PRs: ${userStats.prs_merged}, Reviews: ${userStats.reviews}`);

  // Find rules for this event type
  const rules = EVENT_RULES[eventType] || [];
  if (rules.length === 0) {
    log(colors.yellow, `⚠️ No rules defined for event: ${eventType}`);
    return { badgesAwarded: 0 };
  }

  log(colors.blue, `🔍 Evaluating ${rules.length} rule(s)...`);

  // Context for evaluating conditions
  const context = {
    event: eventData,
    userStats,
    userData,
    username,
  };

  const newBadges = [];

  for (const rule of rules) {
    // Skip if already has the badge
    if (hasBadge(userData, rule.badgeId)) {
      continue;
    }

    // Skip if badge doesn't exist in catalog
    if (!badgeExists(rule.badgeId)) {
      continue;
    }

    // Evaluate condition
    try {
      if (rule.condition(context)) {
        log(colors.green, `   🏅 New badge! ${rule.badgeId} - ${rule.description}`);
        
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
      log(colors.yellow, `   ⚠️ Error evaluating ${rule.badgeId}: ${e.message}`);
    }
  }

  // Save new badges
  if (newBadges.length > 0) {
    userData.badges = userData.badges || [];
    userData.badges.push(...newBadges);
    saveUser(username, userData);
    log(colors.magenta, `\n🎉 ${newBadges.length} badge(s) awarded to @${username}`);
  } else {
    log(colors.blue, `\nℹ️ No new badges for @${username}`);
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
🎯 BOOMFLOW - GitHub Event Processor
==============================================

USAGE:
  node scripts/process-event.js <event-type> [event-file.json]

SUPPORTED EVENTS:
  pull_request.merged        - PR was merged
  pull_request.opened        - PR was opened
  pull_request_review.submitted  - Review was submitted
  issues.opened              - Issue was opened
  issues.closed              - Issue was closed
  release.published          - Release was published
  push                       - Commits were pushed

EXAMPLES:
  node scripts/process-event.js pull_request.merged event.json
  
  # With event from stdin (used by GitHub Actions)
  echo '{"pull_request":{"user":{"login":"jeremy-sud"}}}' | \\
    node scripts/process-event.js pull_request.merged

ENVIRONMENT VARIABLES:
  GITHUB_TOKEN / GH_TOKEN    - GitHub token for API
  GITHUB_EVENT_PATH          - Path to event file (GitHub Actions)
`);
    process.exit(0);
  }

  const eventType = args[0];
  let eventData = {};

  // Load event from file, environment variable, or stdin
  if (args[1]) {
    // File specified
    eventData = JSON.parse(fs.readFileSync(args[1], 'utf8'));
  } else if (process.env.GITHUB_EVENT_PATH) {
    // GitHub Actions provides the event in this file
    eventData = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  } else {
    // Try to read from stdin (for testing)
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
