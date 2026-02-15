<p align="center">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-tech-lead.svg" width="120" height="120" alt="BOOMFLOW"/>
</p>

<h1 align="center">🌸 BOOMFLOW</h1>

<p align="center">
  <strong>Professional Recognition System for Development Teams</strong>
  <br/>
  <em>Donde el talento no se gestiona, se cultiva.</em>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-badge-catalog">Badges</a> •
  <a href="#-api">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
  <img src="https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg" alt="Node"/>
  <img src="https://img.shields.io/badge/verified-Sistemas%20Ursol-purple.svg" alt="Verified"/>
</p>

---

## 🎯 The Problem

**70% of employees feel undervalued.** Soft skills like mentoring, crisis resolution, and team collaboration are invisible in traditional metrics and CVs.

## ✅ The Solution

BOOMFLOW transforms peer recognition into **verified professional assets**. Colleagues send Kudos that evolve into **Dynamic Badges**, automatically synced to your GitHub profile.

---

## ⚡ Quick Start

### 1. Add the workflow to your profile repository

Create `.github/workflows/boomflow.yml` in your `username/username` repo:

```yaml
name: BOOMFLOW Badge Sync

on:
  schedule:
    - cron: "0 0 * * *"  # Daily at midnight
  workflow_dispatch:      # Manual trigger

jobs:
  sync-badges:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: jeremy-sud/boomflow/github-action@main
        with:
          boomflow_token: ${{ secrets.BOOMFLOW_TOKEN }}
          github_username: ${{ github.actor }}
      
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "🏅 Update BOOMFLOW badges"
```

### 2. Add markers to your README.md

```markdown
### 🏅 My Achievements

<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->
```

### 3. Configure your token

See [GUIA_TOKEN.md](GUIA_TOKEN.md) for detailed instructions on creating and configuring your `BOOMFLOW_TOKEN`.

---

## 🏅 Features

| Feature | Description |
|---------|-------------|
| **26 Badges** | Organized in 6 categories |
| **3 Tiers** | 🥉 Bronze → 🥈 Silver → 🥇 Gold |
| **Auto-Sync** | GitHub Action updates your profile automatically |
| **Verified** | All badges verified by [Sistemas Ursol](https://www.ursol.com) |
| **Beautiful SVGs** | Professional vector badges with gradients and effects |

---

## 📦 Badge Catalog

### 🟢 Onboarding (4 badges)

<table>
<tr>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-hello-world.svg" width="80"/><br/>
<sub><b>Hello World</b></sub><br/>
<sub>🥉 Bronze</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-commit.svg" width="80"/><br/>
<sub><b>First Commit</b></sub><br/>
<sub>🥉 Bronze</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-pr.svg" width="80"/><br/>
<sub><b>First PR</b></sub><br/>
<sub>🥉 Bronze</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-review.svg" width="80"/><br/>
<sub><b>First Review</b></sub><br/>
<sub>🥉 Bronze</sub>
</td>
</tr>
</table>

### 🔵 Coding (6 badges)

<table>
<tr>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-ninja.svg" width="80"/><br/>
<sub><b>Code Ninja</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-bug-hunter.svg" width="80"/><br/>
<sub><b>Bug Hunter</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-refactor-master.svg" width="80"/><br/>
<sub><b>Refactor Master</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-clean-code.svg" width="80"/><br/>
<sub><b>Clean Code</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
</tr>
<tr>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-algorithm-ace.svg" width="80"/><br/>
<sub><b>Algorithm Ace</b></sub><br/>
<sub>🥇 Gold</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-full-stack.svg" width="80"/><br/>
<sub><b>Full Stack</b></sub><br/>
<sub>🥇 Gold</sub>
</td>
</tr>
</table>

### 🟣 DevOps (4 badges)

<table>
<tr>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-pipeline-pro.svg" width="80"/><br/>
<sub><b>Pipeline Pro</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docker-captain.svg" width="80"/><br/>
<sub><b>Docker Captain</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-cloud-deployer.svg" width="80"/><br/>
<sub><b>Cloud Deployer</b></sub><br/>
<sub>🥇 Gold</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-cicd-master.svg" width="80"/><br/>
<sub><b>CI/CD Master</b></sub><br/>
<sub>🥇 Gold</sub>
</td>
</tr>
</table>

### 🟡 Collaboration (5 badges)

<table>
<tr>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor.svg" width="80"/><br/>
<sub><b>Mentor</b></sub><br/>
<sub>🥉 Bronze</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-team-spirit.svg" width="80"/><br/>
<sub><b>Team Spirit</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-reviewer.svg" width="80"/><br/>
<sub><b>Code Reviewer</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-pair-programmer.svg" width="80"/><br/>
<sub><b>Pair Programmer</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
</tr>
<tr>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor-master.svg" width="80"/><br/>
<sub><b>Mentor Master</b></sub><br/>
<sub>🥇 Gold</sub>
</td>
</tr>
</table>

### 🔴 Leadership (4 badges)

<table>
<tr>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-sprint-hero.svg" width="80"/><br/>
<sub><b>Sprint Hero</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-crisis-averted.svg" width="80"/><br/>
<sub><b>Crisis Averted</b></sub><br/>
<sub>🥇 Gold</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-architect.svg" width="80"/><br/>
<sub><b>Architect</b></sub><br/>
<sub>🥇 Gold</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-tech-lead.svg" width="80"/><br/>
<sub><b>Tech Lead</b></sub><br/>
<sub>🥇 Gold</sub>
</td>
</tr>
</table>

### ⚪ Documentation (3 badges)

<table>
<tr>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docs-hero.svg" width="80"/><br/>
<sub><b>Docs Hero</b></sub><br/>
<sub>🥉 Bronze</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-api-designer.svg" width="80"/><br/>
<sub><b>API Designer</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
<td align="center" width="120">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-open-source.svg" width="80"/><br/>
<sub><b>Open Source</b></sub><br/>
<sub>🥈 Silver</sub>
</td>
</tr>
</table>

---

## 🏗️ Project Structure

```
BOOMFLOW/
├── app-web/           # Frontend (Next.js + React + TailwindCSS)
├── backend/           # API Server (Express + Node.js)
├── github-action/     # GitHub Action for badge sync
├── assets/            # 26 professional SVG badges
├── users/             # User badge data (JSON)
├── api-mock.json      # Badge catalog
├── DOCS.md            # Technical documentation
├── GUIA_TOKEN.md      # Token setup guide
└── ONBOARDING.md      # Team onboarding guide
```

---

## 🔌 API Reference

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | ❌ | Health check |
| `GET` | `/api/badges/catalog` | ❌ | Full badge catalog |
| `GET` | `/api/user/badges` | ✅ | Authenticated user's badges |
| `GET` | `/auth/github` | ❌ | Start OAuth flow |
| `GET` | `/auth/github/callback` | ❌ | OAuth callback |

### Example: Get Badge Catalog

```bash
curl https://api.boomflow.dev/api/badges/catalog
```

```json
[
  {
    "id": "code-ninja",
    "label": "Code Ninja",
    "category": "coding",
    "tier": "silver",
    "description": "Código limpio, rápido y eficiente.",
    "svg": "badge-code-ninja.svg"
  }
]
```

---

## 🚀 Local Development

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn

### Backend

```bash
cd backend
npm install
npm run dev
# Server running at http://localhost:3001
```

### Frontend

```bash
cd app-web
npm install
npm run dev
# App running at http://localhost:3000
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [Sistemas Ursol](https://www.ursol.com)

---

<p align="center">
  <sub>Built with 💜 by the BOOMFLOW team</sub>
  <br/>
  <sub>Verified by <a href="https://www.ursol.com">Sistemas Ursol</a></sub>
</p>
