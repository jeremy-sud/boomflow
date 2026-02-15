const fs = require("fs");
const path = require("path");

// Reuse the logic from the action
const CATALOG_PATH = "/home/dawnweaber/Workspace/BOOMFLOW/api-mock.json";
const USERS_DIR = "/home/dawnweaber/Workspace/BOOMFLOW/users";
const REPO_BASE_URL =
  "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets";
const TARGET_README =
  "/home/dawnweaber/Workspace/BOOMFLOW/.profile-test/README.md";

const TIER_ICON = { bronze: "🥉", silver: "🥈", gold: "🥇" };
const CATEGORIES = {
  onboarding: { emoji: "🟢", label: "Onboarding" },
  coding: { emoji: "🔵", label: "Coding" },
  devops: { emoji: "🟣", label: "DevOps" },
  collaboration: { emoji: "🟡", label: "Colaboración" },
  leadership: { emoji: "🔴", label: "Liderazgo" },
  documentation: { emoji: "⚪", label: "Documentación" },
};

function loadCatalog() {
  const badges = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
  const index = {};
  for (const b of badges) index[b.id] = b;
  return { index };
}

function buildUserBadgeSection(username) {
  const userData = JSON.parse(
    fs.readFileSync(path.join(USERS_DIR, `${username}.json`), "utf8")
  );
  const { index } = loadCatalog();

  const userBadges = userData.badges
    .map((ub) => ({ ...index[ub.id], ...ub }))
    .filter((b) => b.id);
  const grouped = {};
  for (const b of userBadges) {
    if (!grouped[b.category]) grouped[b.category] = [];
    grouped[b.category].push(b);
  }

  let section = `\n### 🏅 Logros en Bloomflow (${userBadges.length})\n\n<table>\n`;
  for (const [catKey, catInfo] of Object.entries(CATEGORIES)) {
    const badges = grouped[catKey];
    if (!badges || badges.length === 0) continue;
    section += `<tr><td colspan="6"><strong>${catInfo.emoji} ${catInfo.label}</strong></td></tr>\n<tr>\n`;
    for (const b of badges) {
      section += `<td align="center" width="80">\n  <img src="${REPO_BASE_URL}/${
        b.svg
      }" width="48" height="48" alt="${b.label}"/><br/>\n  <sub>${
        TIER_ICON[b.tier]
      } <strong>${b.label}</strong></sub><br/>\n  <sub>${
        b.meta
      }</sub>\n</td>\n`;
    }
    section += `</tr>\n`;
  }
  section += `</table>\n\n> 🌸 Verificado por [Bloomflow](https://github.com/jeremy-sud/boomflow) @ [SistemasUrsol](https://www.ursol.com)\n`;
  return section;
}

const content = buildUserBadgeSection("jeremy-sud");
const readme = fs.readFileSync(TARGET_README, "utf8");
const START = "<!-- BLOOMFLOW-BADGES-START -->";
const END = "<!-- BLOOMFLOW-BADGES-END -->";
const regex = new RegExp(`${START}[\\s\\S]*?${END}`, "g");
const updated = readme.replace(regex, `${START}${content}${END}`);
fs.writeFileSync(TARGET_README, updated);
console.log("✅ Profile simulation complete!");
