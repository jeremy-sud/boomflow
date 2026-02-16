# 🗺️ BOOMFLOW Roadmap

> From MVP to Enterprise Professional Recognition Platform

---

## 📋 Table of Contents

- [Product Vision](#product-vision)
- [Architecture](#architecture)
- [Development Phases](#development-phases)
- [Data Model](#data-model)
- [API Design](#api-design)
- [Integrations](#integrations)
- [Monetization](#monetization)
- [Timeline](#timeline)

---

## 🎯 Product Vision

### The Problem
- **70% of employees** feel undervalued at work
- "Soft" work (mentoring, collaboration, crisis resolution) is **invisible** on résumés
- Traditional evaluation systems are **annual and subjective**
- There is no way to **verify** soft skills

### The Solution
BOOMFLOW transforms peer recognition into **verifiable professional assets**:

```
Kudos (recognition) → Accumulation → Badges → GitHub Profile
```

### Value Proposition

| For Employees | For Companies | For HR |
|----------------|---------------|--------|
| Verified soft skills portfolio | Recognition culture | Real-time engagement data |
| Motivation and gamification | Talent retention | Identify top performers |
| Differentiated résumé | Employer branding | Turnover prediction |

---

## 🏗️ Architecture

### Current Architecture (v1.0)

```
┌─────────────────────────────────────────────────────────────┐
│                    BOOMFLOW v1.0 (Current)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐                     │
│  │  JSON Files  │────▶│GitHub Action │────▶ GitHub Profile │
│  │  (users/)    │     │  (sync)      │                     │
│  └──────────────┘     └──────────────┘                     │
│                                                             │
│  ┌──────────────┐     ┌──────────────┐                     │
│  │  SVG Assets  │     │  Express API │ (basic)             │
│  │  (26 badges) │     │  (backend/)  │                     │
│  └──────────────┘     └──────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Target Architecture (v2.0)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BOOMFLOW v2.0 Platform                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   Web App   │    │  Slack Bot  │    │ Discord Bot │                 │
│  │  (Next.js)  │    │             │    │             │                 │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                 │
│         │                  │                  │                         │
│         └──────────────────┼──────────────────┘                         │
│                            ▼                                            │
│                   ┌─────────────────┐                                   │
│                   │    API Layer    │                                   │
│                   │  (tRPC/GraphQL) │                                   │
│                   └────────┬────────┘                                   │
│                            │                                            │
│         ┌──────────────────┼──────────────────┐                         │
│         ▼                  ▼                  ▼                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   Kudos     │    │   Badges    │    │   Users     │                 │
│  │   Service   │    │   Engine    │    │   Service   │                 │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                 │
│         │                  │                  │                         │
│         └──────────────────┼──────────────────┘                         │
│                            ▼                                            │
│                   ┌─────────────────┐                                   │
│                   │   PostgreSQL    │                                   │
│                   │   + Prisma ORM  │                                   │
│                   └─────────────────┘                                   │
│                            │                                            │
│         ┌──────────────────┼──────────────────┐                         │
│         ▼                  ▼                  ▼                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   Redis     │    │   BullMQ    │    │  Analytics  │                 │
│  │   (cache)   │    │   (queues)  │    │  (PostHog)  │                 │
│  └─────────────┘    └─────────────┘    └─────────────┘                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📅 Development Phases

### Phase 1: Core Platform (MVP) — 4–6 weeks

**Goal:** Functional kudos → badges → GitHub sync system

#### 1.1 Database
- [ ] Setup PostgreSQL + Prisma
- [ ] Schema: users, organizations, teams, kudos, badges, user_badges
- [ ] Migrations and seeds

#### 1.2 Kudos API
- [ ] `POST /api/kudos` — Send a kudo
- [ ] `GET /api/kudos/received` — Received kudos
- [ ] `GET /api/kudos/given` — Given kudos
- [ ] `GET /api/kudos/feed` — Organization feed

#### 1.3 Badge Engine
- [ ] Automatic triggers (X kudos → badge)
- [ ] Badge rule validation
- [ ] New badge notifications

#### 1.4 Authentication
- [ ] OAuth with GitHub
- [ ] Sessions with NextAuth.js
- [ ] Basic roles (admin, member)

#### 1.5 Web Dashboard
- [ ] Profile page with badges
- [ ] Form to send kudos
- [ ] Activity feed
- [ ] Account settings

### Phase 2: Organizational — 4 weeks

**Goal:** Multi-tenancy and team features

#### 2.1 Organizations & Teams
- [ ] Organization CRUD
- [ ] Invitations via email/link
- [ ] Teams within an organization
- [ ] Private badges per organization

#### 2.2 Admin Dashboard
- [ ] Member management
- [ ] Create custom badges
- [ ] Configure accumulation rules
- [ ] Basic reports

#### 2.3 Leaderboards
- [ ] Rankings by team
- [ ] Rankings by badge category
- [ ] Monthly/quarterly history

### Phase 3: Integrations — 3 weeks

**Goal:** Kudos from wherever the team works

#### 3.1 Slack Integration
- [ ] Slack App
- [ ] `/kudo @user message` command
- [ ] Channel notifications
- [ ] Bot for new badges

#### 3.2 Discord Integration (Optional)
- [ ] Discord Bot
- [ ] Command similar to Slack

#### 3.3 Enhanced GitHub Integration ✅
- [x] Webhook: PR merged → "First PR" badge
- [x] Webhook: Issue closed → badges
- [x] Webhook: Code Review → badges
- [x] Webhook: Release published → badges
- [x] Auto-detect contributions via API

> **✅ IMPLEMENTED** — See `.github/workflows/event-processor.yml` and `scripts/process-event.js`

### Phase 4: Analytics & AI — 4 weeks

**Goal:** Insights for HR

#### 4.1 Analytics Dashboard
- [ ] Engagement score per team
- [ ] Recognition trends
- [ ] Collaboration maps
- [ ] Low-engagement alerts

#### 4.2 AI Features
- [ ] Sentiment analysis on kudos
- [ ] Kudo suggestions ("It's been a while since you recognized X")
- [ ] Turnover prediction (low engagement = risk)

#### 4.3 Export
- [ ] PDF/Excel reports
- [ ] HRIS integration (BambooHR, Workday)

### Phase 5: Enterprise — Ongoing

**Goal:** Features for large companies

- [ ] SSO/SAML
- [ ] Dedicated API with rate limits
- [ ] SLA and premium support
- [ ] On-premise deployment option
- [ ] Audit and compliance

---

## 📊 Data Model

### Main Schema

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  displayName   String?
  avatarUrl     String?
  githubId      String?   @unique
  role          Role      @default(MEMBER)
  
  // Relations
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  teamId         String?
  team           Team?     @relation(fields: [teamId], references: [id])
  
  kudosGiven     Kudo[]    @relation("KudosGiven")
  kudosReceived  Kudo[]    @relation("KudosReceived")
  badges         UserBadge[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  logoUrl     String?
  plan        Plan     @default(INTERNAL)
  
  users       User[]
  teams       Team[]
  badges      Badge[]  // Custom badges
  
  createdAt   DateTime @default(now())
}

model Team {
  id             String       @id @default(cuid())
  name           String
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  members        User[]
  
  createdAt      DateTime     @default(now())
}

model Kudo {
  id          String   @id @default(cuid())
  message     String
  category    Category
  isPublic    Boolean  @default(true)
  
  giverId     String
  giver       User     @relation("KudosGiven", fields: [giverId], references: [id])
  receiverId  String
  receiver    User     @relation("KudosReceived", fields: [receiverId], references: [id])
  
  createdAt   DateTime @default(now())
}

model Badge {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String
  category    Category
  tier        Tier
  svgUrl      String
  
  // Trigger rules
  triggerType    TriggerType
  triggerCount   Int         @default(1)  // e.g., 5 kudos needed
  triggerCategory Category?  // optional: only count kudos of this category
  
  // Custom badge for org
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  isGlobal       Boolean      @default(true)
  
  userBadges     UserBadge[]
  
  createdAt      DateTime     @default(now())
}

model UserBadge {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  badgeId   String
  badge     Badge    @relation(fields: [badgeId], references: [id])
  
  awardedAt DateTime @default(now())
  awardedBy String?  // user id or "system"
  
  @@unique([userId, badgeId])
}

// Enums
enum Role {
  ADMIN
  MANAGER
  MEMBER
}

enum Plan {
  INTERNAL  // Boomflow Open — Sistemas Ursol & community (not a commercial plan)
  PRO
  SCALE
  ENTERPRISE
}

enum Category {
  ONBOARDING
  CODING
  DEVOPS
  COLLABORATION
  LEADERSHIP
  DOCUMENTATION
}

enum Tier {
  BRONZE
  SILVER
  GOLD
}

enum TriggerType {
  KUDO_COUNT      // Accumulate X kudos
  KUDO_CATEGORY   // Accumulate X kudos in category
  MANUAL          // Awarded manually by admin
  SYSTEM          // Auto-awarded (first commit, etc.)
}
```

---

## 🔌 API Design

### Main Endpoints

#### Kudos

```
POST   /api/kudos                 # Send a kudo
GET    /api/kudos/feed            # Organization feed
GET    /api/kudos/received        # My received kudos
GET    /api/kudos/given           # Kudos I have given
GET    /api/kudos/stats           # Statistics
```

#### Badges

```
GET    /api/badges/catalog        # Full catalog
GET    /api/badges/my             # My badges
GET    /api/badges/:id            # Badge details
POST   /api/badges                # Create badge (admin)
```

#### Users

```
GET    /api/users/me              # My profile
GET    /api/users/:username       # Public profile
PATCH  /api/users/me              # Update profile
GET    /api/users/leaderboard     # Rankings
```

#### Organizations

```
POST   /api/orgs                  # Create organization
GET    /api/orgs/:slug            # Details
POST   /api/orgs/:slug/invite     # Invite member
GET    /api/orgs/:slug/members    # List members
```

### Example: Send a Kudo

```typescript
// POST /api/kudos
{
  "receiverUsername": "maria",
  "message": "Excellent work on the auth module refactor!",
  "category": "CODING",
  "isPublic": true
}

// Response 201
{
  "id": "clx1234...",
  "giver": { "username": "jeremy-sud", "displayName": "Jeremy Alva" },
  "receiver": { "username": "maria", "displayName": "María García" },
  "message": "Excellent work on the auth module refactor!",
  "category": "CODING",
  "createdAt": "2026-02-15T10:30:00Z",
  "badgeUnlocked": {
    "slug": "code-ninja",
    "name": "Code Ninja",
    "message": "María unlocked the Code Ninja badge!"
  }
}
```

---

## 🔗 Integrations

### Slack App

```
/kudo @maria Thanks for helping me with that production bug! #collaboration
```

### GitHub Webhooks

| Event | Action |
|-------|--------|
| `pull_request.merged` | +1 coding point, check "First PR" badge |
| `pull_request_review.submitted` | +1 collaboration point |
| `issues.closed` | +1 point if assignee |

### Zapier/Make

Available triggers:
- New kudo received
- New badge unlocked
- Milestone reached

---

## 💰 Monetization

### Plans

> **Note:** Boomflow Open is the free open-source core used by Sistemas Ursol and the community — it is not a commercial plan. The plans below are for companies.

| Feature | Pro ($149/mo) | Scale ($499/mo) | Enterprise ($1,499/mo) |
|---------|---------------|-----------------|------------------------|
| Monthly Active Collaborators | Up to 50 MAC | Up to 200 MAC | 500+ MAC |
| Kudos/month | Unlimited | Unlimited | Unlimited |
| Global badges | ✅ | ✅ | ✅ |
| Custom badges | ✅ | ✅ | ✅ |
| GitHub Sync | ✅ | ✅ | ✅ |
| Slack/Discord | ✅ | ✅ | ✅ |
| Analytics | Advanced | Advanced | Premium |
| SSO/SAML | ❌ | ✅ | ✅ |
| Dedicated API | ❌ | ✅ | ✅ |
| Support | Email | Priority | Dedicated |

---

## 📅 Estimated Timeline

```
2026 Q1 (Feb–Mar)
├── Week 1–2: Database + Auth
├── Week 3–4: Kudos API + Badge Engine
├── Week 5–6: Web Dashboard MVP
└── Week 7–8: Testing + Polish

2026 Q2 (Apr–Jun)
├── Month 1: Organizations + Teams
├── Month 2: Slack Integration
└── Month 3: Analytics Dashboard

2026 Q3 (Jul–Sep)
├── AI Features
├── Enterprise Features
└── Public Launch
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TailwindCSS, shadcn/ui |
| Backend | Node.js 20, tRPC |
| Database | PostgreSQL, Prisma ORM |
| Auth | NextAuth.js |
| Queue | BullMQ + Redis |
| Hosting | Vercel (frontend), Railway (backend) |
| Analytics | PostHog |
| AI | OpenAI API |

---

## 📁 Target Project Structure

```
BOOMFLOW/
├── apps/
│   ├── web/                 # Next.js app
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── api/                 # Backend API (if separated)
├── packages/
│   ├── database/            # Prisma schema + client
│   ├── ui/                  # Shared components
│   └── config/              # Shared config
├── services/
│   ├── badge-engine/        # Badge logic
│   └── notifications/       # Email, Slack, etc.
├── github-action/           # (existing)
├── assets/                  # (existing) SVG badges
├── docs/
│   ├── ROADMAP.md          # This file
│   └── API.md              # API documentation
└── docker-compose.yml       # Local dev
```

---

<p align="center">
  <sub>Last updated: February 2026</sub>
  <br/>
  <sub>Maintained by <a href="https://github.com/jeremy-sud">@jeremy-sud</a></sub>
</p>
