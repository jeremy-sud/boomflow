# 📚 BOOMFLOW — Documentación Técnica

> Referencia técnica completa del Sistema de Reconocimiento Profesional BOOMFLOW

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Uso_Exclusivo-Sistemas_Ursol-8B5CF6.svg" alt="Exclusivo"/>
</p>

---

## ⚠️ Aviso de Uso Exclusivo

**Este sistema es propiedad de Sistemas Ursol y está diseñado exclusivamente para uso interno.**

El código es público bajo licencia MIT para transparencia, pero el sistema de reconocimiento solo puede ser utilizado por:
- ✅ Colaboradores oficiales de Sistemas Ursol
- ✅ Contratistas con acuerdo vigente
- ✅ Asociados y partners autorizados

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Badge System](#badge-system)
- [GitHub Action](#github-action)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [SVG Badge Specification](#svg-badge-specification)
- [Development Guide](#development-guide)
- [Deployment](#deployment)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BOOMFLOW Architecture                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     │
│  │   Frontend   │────▶│   Backend    │────▶│   GitHub     │     │
│  │  (Next.js)   │     │  (Express)   │     │    API       │     │
│  └──────────────┘     └──────────────┘     └──────────────┘     │
│         │                    │                    │              │
│         │                    ▼                    │              │
│         │            ┌──────────────┐             │              │
│         │            │  PostgreSQL  │             │              │
│         │            │   Database   │             │              │
│         │            └──────────────┘             │              │
│         │                                         │              │
│         ▼                                         ▼              │
│  ┌──────────────┐                        ┌──────────────┐       │
│  │  User        │                        │  GitHub      │       │
│  │  Browser     │                        │  Action      │       │
│  └──────────────┘                        └──────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Components

| Component | Technology | Description |
|-----------|------------|-------------|
| **Frontend** | Next.js 14, React 18, TailwindCSS | Web dashboard for badge management |
| **Backend** | Express.js, Node.js 20 | REST API server |
| **Database** | PostgreSQL / JSON files | User and badge data storage |
| **GitHub Action** | Node.js 20 | Automated badge sync to profiles |

---

## Badge System

### Tier System

| Tier | Icon | Points Required | Badge Ring Color |
|------|------|-----------------|------------------|
| **Bronze** | 🥉 | 1-49 | `#CD7F32` |
| **Silver** | 🥈 | 50-199 | `#C0C0C0` |
| **Gold** | 🥇 | 200+ | `#FFD700` |

### Categories

| Category | Color | Hex Codes | Badge Count |
|----------|-------|-----------|-------------|
| 🟢 Onboarding | Green | `#10B981` → `#059669` | 4 |
| 🔵 Coding | Blue | `#3B82F6` → `#1D4ED8` | 6 |
| 🟣 DevOps | Purple | `#8B5CF6` → `#6D28D9` | 4 |
| 🟡 Collaboration | Amber | `#F59E0B` → `#D97706` | 5 |
| 🔴 Leadership | Red | `#EF4444` → `#DC2626` | 4 |
| ⚪ Documentation | Gray | `#6B7280` → `#4B5563` | 3 |

### Complete Badge Reference

#### 🟢 Onboarding

| ID | Label | Tier | Description |
|----|-------|------|-------------|
| `hello-world` | Hello World | Bronze | First day on the team |
| `first-commit` | First Commit | Bronze | First commit to repository |
| `first-pr` | First PR | Bronze | First Pull Request approved |
| `first-review` | First Review | Bronze | First code review completed |

#### 🔵 Coding

| ID | Label | Tier | Description |
|----|-------|------|-------------|
| `code-ninja` | Code Ninja | Silver | Clean, fast, efficient code |
| `bug-hunter` | Bug Hunter | Silver | Catches bugs before production |
| `refactor-master` | Refactor Master | Silver | Improves legacy code safely |
| `clean-code` | Clean Code | Silver | Readable, maintainable code |
| `algorithm-ace` | Algorithm Ace | Gold | Optimal algorithms for complex problems |
| `full-stack` | Full Stack | Gold | Masters frontend and backend |

#### 🟣 DevOps

| ID | Label | Tier | Description |
|----|-------|------|-------------|
| `pipeline-pro` | Pipeline Pro | Silver | Fast, reliable CI/CD pipelines |
| `docker-captain` | Docker Captain | Silver | Efficient containerization |
| `cloud-deployer` | Cloud Deployer | Gold | Zero-downtime deployments |
| `cicd-master` | CI/CD Master | Gold | Total development cycle automation |

#### 🟡 Collaboration

| ID | Label | Tier | Description |
|----|-------|------|-------------|
| `mentor` | Mentor | Bronze | Guides new team members |
| `mentor-master` | Mentor Master | Gold | Has guided 20+ colleagues |
| `team-spirit` | Team Spirit | Silver | Maintains team morale |
| `code-reviewer` | Code Reviewer | Silver | Detailed, constructive reviews |
| `pair-programmer` | Pair Programmer | Silver | Effective pair programming |

#### 🔴 Leadership

| ID | Label | Tier | Description |
|----|-------|------|-------------|
| `crisis-averted` | Crisis Averted | Gold | Saved a critical deployment |
| `sprint-hero` | Sprint Hero | Silver | Exceptional sprint delivery |
| `architect` | Architect | Gold | Solid, scalable architecture |
| `tech-lead` | Tech Lead | Gold | Leads technical decisions |

#### ⚪ Documentation

| ID | Label | Tier | Description |
|----|-------|------|-------------|
| `docs-hero` | Docs Hero | Bronze | Clear documentation for the team |
| `api-designer` | API Designer | Silver | Well-designed, documented APIs |
| `open-source` | Open Source | Silver | Open source contributions |

---

## GitHub Action

### Installation

```yaml
# .github/workflows/boomflow.yml
name: BOOMFLOW Badge Sync

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

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

### Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `boomflow_token` | ✅ | - | Personal access token |
| `github_username` | ❌ | `github.actor` | Target username |
| `org_name` | ❌ | `SistemasUrsol` | Organization name |

### How It Works

1. **Checkout**: The action checks out your profile repository
2. **Fetch Data**: Reads user badge data from `users/{username}.json`
3. **Build HTML**: Generates badge table HTML from templates
4. **Update README**: Replaces content between markers
5. **Commit**: Auto-commits the changes

### Markers

Add these markers to your `README.md`:

```markdown
<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->
```

Everything between these markers will be replaced with your badge table.

---

## API Reference

### Base URL

```
Production: https://api.boomflow.dev
Development: http://localhost:3001
```

### Endpoints

#### Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-15T00:00:00.000Z",
  "version": "1.0.0"
}
```

#### Get Badge Catalog

```http
GET /api/badges/catalog
```

Response:
```json
[
  {
    "id": "code-ninja",
    "emoji": "🥷",
    "label": "Code Ninja",
    "category": "coding",
    "tier": "silver",
    "meta": "Nivel 2",
    "description": "Código limpio, rápido y eficiente.",
    "svg": "badge-code-ninja.svg"
  }
]
```

#### Get User Badges (Authenticated)

```http
GET /api/user/badges
Authorization: Bearer {token}
```

Response:
```json
{
  "username": "jeremy-sud",
  "displayName": "Jeremy Alva",
  "badges": [
    {
      "id": "code-ninja",
      "awardedAt": "2024-02-10",
      "awardedBy": "ursolcr"
    }
  ]
}
```

#### OAuth Flow

```http
GET /auth/github
```
Redirects to GitHub OAuth authorization page.

```http
GET /auth/github/callback?code={code}
```
Handles OAuth callback, creates session.

---

## Data Models

### Badge (Catalog)

```typescript
interface Badge {
  id: string;           // Unique identifier
  emoji: string;        // Display emoji
  label: string;        // Human-readable name
  category: Category;   // Category key
  tier: Tier;           // bronze | silver | gold
  meta: string;         // Tier level label
  description: string;  // Full description
  svg: string;          // SVG filename
}

type Category = 
  | 'onboarding' 
  | 'coding' 
  | 'devops' 
  | 'collaboration' 
  | 'leadership' 
  | 'documentation';

type Tier = 'bronze' | 'silver' | 'gold';
```

### User Data

```typescript
interface UserData {
  username: string;
  displayName: string;
  role?: string;
  org: string;
  joinedAt: string;     // ISO date
  badges: UserBadge[];
}

interface UserBadge {
  id: string;           // Badge ID reference
  awardedAt: string;    // ISO date
  awardedBy: string;    // Username who awarded
}
```

---

## SVG Badge Specification

### Dimensions

- **Canvas**: 128x128 pixels
- **Outer Ring**: 58px radius (tier indicator)
- **Inner Circle**: 50px radius (category background)
- **Icon Area**: ~40px centered

### Structure

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <!-- Gradient for category background -->
    <linearGradient id="bg">...</linearGradient>
    <!-- Gradient for tier ring (bronze/silver/gold) -->
    <linearGradient id="tier">...</linearGradient>
    <!-- Shine effect -->
    <linearGradient id="shine">...</linearGradient>
    <!-- Drop shadow filter -->
    <filter id="shadow">...</filter>
  </defs>
  
  <!-- Tier ring (outer) -->
  <circle cx="64" cy="64" r="58" fill="url(#tier)" filter="url(#shadow)"/>
  
  <!-- Category background (inner) -->
  <circle cx="64" cy="64" r="50" fill="url(#bg)"/>
  
  <!-- Shine effect -->
  <ellipse cx="64" cy="40" rx="35" ry="25" fill="url(#shine)"/>
  
  <!-- Icon (vector graphics) -->
  <g transform="translate(64, 50)">...</g>
  
  <!-- Label text -->
  <text x="64" y="95">BADGE NAME</text>
  
  <!-- Tier indicator -->
  <text x="64" y="108">● BRONZE / ● SILVER / ★ GOLD</text>
</svg>
```

### Tier Colors

```css
/* Bronze */
#D4A574 → #CD7F32 → #8B5A2B

/* Silver */
#E8E8E8 → #C0C0C0 → #A0A0A0

/* Gold */
#FFE55C → #FFD700 → #DAA520
```

---

## Development Guide

### Prerequisites

```bash
node --version  # >= 20.0.0
npm --version   # >= 10.0.0
```

### Setup

```bash
# Clone repository
git clone https://github.com/jeremy-sud/boomflow.git
cd boomflow

# Install dependencies
npm install

# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd app-web && npm run dev
```

### Testing the GitHub Action Locally

```bash
cd github-action
node index.js
```

### Environment Variables

Create `.env` in backend/:

```env
PORT=3001
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
SESSION_SECRET=random_secret_string
```

---

## Deployment

### Backend (Railway/Vercel)

```bash
cd backend
railway up
# or
vercel
```

### Frontend (Vercel)

```bash
cd app-web
vercel
```

### GitHub Action

The action is automatically available at:
```
jeremy-sud/boomflow/github-action@main
```

---

## Troubleshooting

### Badges not appearing

1. Check markers exist in README.md
2. Verify `BOOMFLOW_TOKEN` secret is set
3. Check workflow run logs for errors
4. Ensure user data file exists in `users/{username}.json`

### SVGs not rendering

1. Check raw GitHub URLs are accessible
2. Verify SVG syntax is valid
3. Clear browser cache

### OAuth errors

1. Verify GitHub OAuth app credentials
2. Check callback URL matches configuration
3. Ensure scopes include `repo` permission

---

<p align="center">
  <sub>Documentation version 1.0.0</sub>
  <br/>
  <sub>© 2026 <a href="https://www.ursol.com">Sistemas Ursol</a></sub>
</p>
