const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Constants
const BADGE_START_MARKER = "<!-- BLOOMFLOW-BADGES-START -->";
const BADGE_END_MARKER = "<!-- BLOOMFLOW-BADGES-END -->";
// In a real scenario, this would be the actual API endpoint.
// For MVP, we point to the raw file in the repo we just deployed.
const MOCK_API_URL =
  "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/api-mock.json";

async function run() {
  try {
    // 1. Get Inputs
    const token = core.getInput("bloomflow_token");
    // In a real app, we would use the token to authenticate the request.

    core.info("Fetching Bloomflow data...");

    // 2. Fetch Data
    let data;
    try {
      const response = await axios.get(MOCK_API_URL);
      data = response.data;
      core.info(`Successfully fetched data for user: ${data.username}`);
    } catch (error) {
      // Fallback for local testing if network fails or file not yet raw-accessible (caching delay)
      core.warning(
        `Failed to fetch from URL: ${error.message}. Trying local mock file for testing.`
      );
      try {
        const localMockPath = path.join(__dirname, "../api-mock.json");
        if (fs.existsSync(localMockPath)) {
          data = JSON.parse(fs.readFileSync(localMockPath, "utf8"));
          core.info("Loaded data from local api-mock.json");
        } else {
          throw new Error("Local mock file not found.");
        }
      } catch (localError) {
        throw new Error(
          `Could not load data from URL or local file: ${localError.message}`
        );
      }
    }

    // 3. Generate Markdown
    const badgeMarkdown = generateBadgeMarkdown(data);

    // 4. Update README.md
    updateReadme(badgeMarkdown);
  } catch (error) {
    core.setFailed(error.message);
  }
}

function generateBadgeMarkdown(data) {
  let md = "### 🏆 Bloomflow Achievements\n\n";

  // Top Badge
  if (data.top_badge) {
    md += `<div align="center">\n`;
    md += `  <img src="${data.top_badge.image_url}" width="120" alt="${data.top_badge.name}" />\n`;
    md += `  <h4>${data.top_badge.name}</h4>\n`;
    md += `  <p><em>"${data.top_badge.description}"</em></p>\n`;
    md += `</div>\n\n`;
  }

  // Stats
  md += `**Total Kudos:** ${data.stats.total_kudos} | **Current Streak:** ${data.stats.current_streak} days\n\n`;

  // Badge Grid
  md += `<div align="center">\n`;
  data.badges.forEach((badge) => {
    md += `  <img src="${badge.image_url}" width="60" title="${badge.name} (L${badge.level})" alt="${badge.name}" style="margin: 5px;" />\n`;
  });
  md += `\n</div>\n\n`;

  // Recent Testimony
  if (data.recent_comment) {
    md += `> " ${data.recent_comment.text} "  \n`;
    md += `> — *${data.recent_comment.author}, ${data.recent_comment.date}*\n`;
  }

  return md;
}

function updateReadme(newContent) {
  // We assume the README is in the workspace root
  const readmePath = path.join(
    process.env.GITHUB_WORKSPACE || path.join(__dirname, ".."),
    "README.md"
  );

  if (!fs.existsSync(readmePath)) {
    throw new Error(`README.md not found at path: ${readmePath}`);
  }

  let readmeContent = fs.readFileSync(readmePath, "utf8");

  const startIndex = readmeContent.indexOf(BADGE_START_MARKER);
  const endIndex = readmeContent.indexOf(BADGE_END_MARKER);

  if (startIndex === -1 || endIndex === -1) {
    throw new Error(
      "Markers not found in README.md. Please add <!-- BLOOMFLOW-BADGES-START --> and <!-- BLOOMFLOW-BADGES-END -->."
    );
  }

  const before = readmeContent.substring(
    0,
    startIndex + BADGE_START_MARKER.length
  );
  const after = readmeContent.substring(endIndex);

  const updatedReadme = `${before}\n\n${newContent}\n${after}`;

  fs.writeFileSync(readmePath, updatedReadme);
  core.info("README.md updated successfully!");
}

run();
