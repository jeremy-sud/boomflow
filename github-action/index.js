const fs = require("fs");
const core = require("@actions/core");
const path = require("path");


// Configuration
const CATALOG_PATH = path.join(__dirname, "../api-mock.json");
const USERS_DIR = path.join(__dirname, "../users");
const REPO_BASE_URL =
  "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets";
const ORG_NAME = "SistemasUrsol";
const ORG_URL = "https://www.ursol.com";


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
  collaboration: { emoji: "🟡", label: "Colaboración" },
  leadership: { emoji: "🔴", label: "Liderazgo" },
  documentation: { emoji: "⚪", label: "Documentación" },
};


/**
 * Load full badge catalog and index by ID
 */
function loadCatalog() {
  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`Badge catalog not found at ${CATALOG_PATH}`);
  }
