const fs = require("fs");
const core = require("@actions/core");
const path = require("path");

// Mock API URL (in a real scenario, this would be an input)
// For this MVP, we are reading the local mock file to simulate the API response
const MOCK_API_PATH = path.join(__dirname, "../api-mock.json");

async function run() {
  try {
    console.log("Fetching Bloomflow data...");

    // Simulate API call by reading the mock file
    // In production: const response = await fetch('https://api.bloomflow.com/user/badges');
    if (!fs.existsSync(MOCK_API_PATH)) {
      throw new Error(`Mock API file not found at ${MOCK_API_PATH}`);
    }

    const rawData = fs.readFileSync(MOCK_API_PATH, "utf8");
    const badgesFromApi = JSON.parse(rawData);

    console.log(`Successfully fetched ${badgesFromApi.length} badges.`);

    // 1. Create the text based on ID API emojis
    const badgeSection = badgesFromApi
      .map((b) => {
        // Format: * 🥈 **Mentor** | *Nivel 2* | "Siempre dispuesto a explicar."
        return `* ${b.emoji} **${b.label}** | *${b.meta}* | "${b.description}"`;
      })
      .join("\n");

    // Add a header and footer for the section
    const newContentSection = `\n### 🛠️ Logros en SistemasUrsol\n\n${badgeSection}\n\n> Verificado por Bloomflow @ SistemasUrsol\n`;

    // 2. Define where our writing zone starts and ends
    const START_TAG = "<!-- BLOOMFLOW-BADGES-START -->";
    const END_TAG = "<!-- BLOOMFLOW-BADGES-END -->";

    // Read the README.md
    const readmePath = path.join(__dirname, "../README.md");
    if (!fs.existsSync(readmePath)) {
      throw new Error(`README.md not found at ${readmePath}`);
    }

    let currentContent = fs.readFileSync(readmePath, "utf8");

    // 3. Use Regex to replace whatever is between the tags
    // We use [\s\S]* to match across newlines
    const regex = new RegExp(`${START_TAG}[\\s\\S]*?${END_TAG}`, "g");

    // Check if tags exist
    if (!regex.test(currentContent)) {
      console.log(
        "Start/End tags not found in README.md. Please add <!-- BLOOMFLOW-BADGES-START --> and <!-- BLOOMFLOW-BADGES-END --> to your README."
      );
      return;
    }

    const newContent = `${START_TAG}${newContentSection}${END_TAG}`;

    const updatedReadme = currentContent.replace(regex, newContent);

    fs.writeFileSync(readmePath, updatedReadme);
    console.log("README.md updated successfully!");
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
