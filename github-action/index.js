const fs = require("fs");
const core = require("@actions/core");
const path = require("path");

// Configuration
// Action's own data (catalog and users) - relative to action directory
const ACTION_DIR = __dirname;
const CATALOG_PATH = path.join(ACTION_DIR, "../api-mock.json");
const USERS_DIR = path.join(ACTION_DIR, "../users");

// User's workspace (where their README lives) - uses GITHUB_WORKSPACE or cwd
const WORKSPACE_DIR = process.env.GITHUB_WORKSPACE || process.cwd();

const REPO_BASE_URL =
  "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets";

// Read org name from action input, fallback to default
let ORG_NAME = "SistemasUrsol";
let ORG_URL = "https://www.ursol.com";
try {
  const inputOrg = core.getInput("org_name");
  if (inputOrg) ORG_NAME = inputOrg;
} catch {
  // Running locally without action context
}

// Tier icons
const TIER_ICON = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
};

// Category labels
const CATEGORIES = {
  onboarding: { emoji: "🟢", label: "Onboarding" },
  coding: { emoji: "🔵", label: "Coding" },
  devops: { emoji: "🟣", label: "DevOps" },
  collaboration: { emoji: "🟡", label: "Collaboration" },
  leadership: { emoji: "🔴", label: "Leadership" },
  documentation: { emoji: "⚪", label: "Documentation" },
};

/**
 * Load full badge catalog and index by ID
 */
function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Badge catalog not found at ${CATALOG_PATH}`);
  }
  const badges = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const index = {};
  for (const b of badges) {
    index[b.id] = b;
  }
  return { badges, index };
}

/**
 * Load user-specific badge data
 * @param {string} username - GitHub username
 * @returns {object|null} User data or null if not found
 */
function loadUserData(username) {
  const userPath = path.join(USERS_DIR, `${username}.json`);
  if (!fs.existsSync(userPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(userPath, "utf8"));
}

/**
 * Build badge section for a specific user
 * @param {object} userData - User data from users/username.json
 * @param {object} catalogIndex - Badge catalog indexed by ID
 * @returns {string} Markdown/HTML badge section
 */
function buildUserBadgeSection(userData, catalogIndex) {
  // Resolve user's badges with full catalog info
  const userBadges = userData.badges
    .map((ub) => {
      const catalogBadge = catalogIndex[ub.id];
      if (!catalogBadge) return null;
      return { ...catalogBadge, ...ub };
    })
    .filter(Boolean);

  // Group by category
  const grouped = {};
  for (const badge of userBadges) {
    const cat = badge.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(badge);
  }

  // Build section
  const role = userData.role ? ` — ${userData.role}` : "";
  let section = `\n### 🏅 ${
    userData.displayName || userData.username
  }${role}\n`;
  section += `> ${userBadges.length} badges earned\n\n`;
  section += `<table>\n`;

  for (const [catKey, catInfo] of Object.entries(CATEGORIES)) {
    const badges = grouped[catKey];
    if (!badges || badges.length === 0) continue;

    section += `<tr><td colspan="6"><strong>${catInfo.emoji} ${catInfo.label}</strong></td></tr>\n`;
    section += `<tr>\n`;

    for (const badge of badges) {
      const tierIcon = TIER_ICON[badge.tier] || "";
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
 * Build the full badge section for all users or a specific user
 */
function buildBadgeContent(targetUser) {
  const { index } = loadCatalog();

  let content = "\n";

  if (targetUser) {
    // Single user mode
    const userData = loadUserData(targetUser);
    if (!userData) {
      throw new Error(`User data not found for: ${targetUser}`);
    }
    content += buildUserBadgeSection(userData, index);
  } else {
    // All users mode — read all files in users/
    if (fs.existsSync(USERS_DIR)) {
      const userFiles = fs
        .readdirSync(USERS_DIR)
        .filter((f) => f.endsWith(".json"));

      for (const file of userFiles) {
        const userData = JSON.parse(
          fs.readFileSync(path.join(USERS_DIR, file), "utf8")
        );
        content += buildUserBadgeSection(userData, index);
      }
    } else {
      // Fallback: use full catalog (legacy mode)
      const allBadges = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
      const grouped = {};
      for (const badge of allBadges) {
        const cat = badge.category || "other";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(badge);
      }

      content += `### 🏅 Achievements in ${ORG_NAME}\n\n<table>\n`;
      for (const [catKey, catInfo] of Object.entries(CATEGORIES)) {
        const badges = grouped[catKey];
        if (!badges || badges.length === 0) continue;
        content += `<tr><td colspan="6"><strong>${catInfo.emoji} ${catInfo.label}</strong></td></tr>\n<tr>\n`;
        for (const badge of badges) {
          const tierIcon = TIER_ICON[badge.tier] || "";
          const svgUrl = `${REPO_BASE_URL}/${badge.svg}`;
          content += `<td align="center" width="80">\n  <img src="${svgUrl}" width="48" height="48" alt="${badge.label}"/><br/>\n  <sub>${tierIcon} <strong>${badge.label}</strong></sub><br/>\n  <sub>${badge.meta}</sub>\n</td>\n`;
        }
        content += `</tr>\n`;
      }
      content += `</table>\n\n`;
    }
  }

  content += `> 🌸 Verified by [BOOMFLOW](https://github.com/jeremy-sud/boomflow) @ [${ORG_NAME}](${ORG_URL})\n`;

  return content;
}

async function run() {
  try {
    console.log("🌸 BOOMFLOW Badge Sync — Starting...");

    // Check for target user input (optional)
    let targetUser = null;
    try {
      targetUser = core.getInput("github_username") || null;
    } catch {
      // Running locally without action context
    }

    console.log(`👤 Target user: ${targetUser || "(all users)"}`);

    const badgeContent = buildBadgeContent(targetUser);

    // Define markers
    const START_TAG = "<!-- BOOMFLOW-BADGES-START -->";
    const END_TAG = "<!-- BOOMFLOW-BADGES-END -->";

    // Read README.md from user's workspace (not the action's directory)
    const readmePath = path.join(WORKSPACE_DIR, "README.md");
    console.log(`📂 Workspace: ${WORKSPACE_DIR}`);
    console.log(`📄 Looking for README at: ${readmePath}`);

    if (!fs.existsSync(readmePath)) {
      throw new Error(
        `README.md not found at ${readmePath}. Make sure to checkout your repo first with actions/checkout.`
      );
    }

    let currentContent = fs.readFileSync(readmePath, "utf8");

    // Replace content between markers
    const regex = new RegExp(`${START_TAG}[\\s\\S]*?${END_TAG}`, "g");

    if (!regex.test(currentContent)) {
      console.log(
        "⚠️  Markers not found in README. Add <!-- BOOMFLOW-BADGES-START --> and <!-- BOOMFLOW-BADGES-END --> to your README."
      );
      return;
    }

    regex.lastIndex = 0;
    const newContent = `${START_TAG}${badgeContent}${END_TAG}`;
    const updatedReadme = currentContent.replace(regex, newContent);

    fs.writeFileSync(readmePath, updatedReadme);

    const userCount = targetUser
      ? 1
      : fs.existsSync(USERS_DIR)
      ? fs.readdirSync(USERS_DIR).filter((f) => f.endsWith(".json")).length
      : 0;
    console.log(`✅ README.md updated! (${userCount} user(s), badges synced)`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    try {
      core.setFailed(error.message);
    } catch {
      process.exit(1);
    }
  }
}

run();
