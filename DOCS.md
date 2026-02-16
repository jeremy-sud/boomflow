# 📚 BOOMFLOW — Technical Documentation

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Exclusive_Use-Sistemas_Ursol-8B5CF6.svg" alt="Exclusive"/>
  <img src="https://img.shields.io/badge/version-3.0.0-blue.svg" alt="Version"/>
</p>

> Complete technical reference for the BOOMFLOW Professional Recognition System

---

## 📖 Table of Contents

1. [Core Concepts](#core-concepts)
2. [Web Dashboard](#web-dashboard)
3. [API REST Reference](#api-rest-reference)
   - [Kudos](#kudos)
   - [Badges](#badges)
   - [Leaderboard](#leaderboard)
   - [Notifications](#notifications)
   - [GitHub Sync](#github-sync)
4. [Badge Engine](#badge-engine)
5. [Database](#database)
6. [Badge Catalog](#badge-catalog)
7. [Auto-Award System](#auto-award-system)
8. [Real-time Webhooks](#real-time-webhooks)
9. [Administration CLI](#administration-cli)
10. [GitHub Action](#github-action)
11. [Data Models](#data-models)
12. [SVG Specification](#svg-specification)

---

## Core Concepts

### What Is a Badge?

A badge in BOOMFLOW represents a **verified professional achievement**. Each badge has:

```
┌─────────────────────────────────────────────────────────────────┐
│                        ANATOMY OF A BADGE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐                                                   │
│   │  🥇     │  ◄── Outer ring: indicates the TIER (bronze,     │
│   │ [Icon]  │      silver, gold)                                │
│   │         │                                                   │
│   └─────────┘  ◄── Inner circle: CATEGORY color                │
│                                                                 │
│   Metadata:                                                     │
│   • id: "code-ninja"                                            │
│   • label: "Code Ninja"                                         │
│   • category: "coding"                                          │
│   • tier: "silver"                                              │
│   • description: "Clean, fast, and efficient code"              │
│   • svg: "badge-code-ninja.svg"                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Badge Lifecycle

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  TRIGGER │───►│ EVALUATE │───►│  AWARD   │───►│  SYNC    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     │               │               │               │
     ▼               ▼               ▼               ▼
  - Cron           - Verify       - Add to       - Update
  - Webhook          metrics        user/          README.md
  - Admin CLI      - Validate       *.json
                     permissions
```

---

## Web Dashboard

### Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 16.1.6 |
| Runtime | React | 19.2.3 |
| ORM | Prisma | 7.4.0 |
| Auth | NextAuth | 5.0.0-beta |
| CSS | Tailwind CSS | 4.x |
| DB | PostgreSQL | 15+ |

### Project Structure

```
app-web/
├── prisma/
│   ├── schema.prisma      # DB Schema (10 models)
│   └── seed.ts            # Initial data (89 badges)
├── src/
│   ├── app/
│   │   ├── api/           # API Routes
│   │   │   ├── badges/    # CRUD badges
│   │   │   ├── kudos/     # CRUD kudos
│   │   │   └── leaderboard/
│   │   ├── catalog/       # Badge catalog
│   │   ├── feed/          # Activity feed
│   │   ├── leaderboard/   # Rankings
│   │   ├── login/         # Auth with GitHub
│   │   └── profile/       # User profile
│   ├── components/        # UI Components
│   ├── generated/prisma/  # Generated Prisma client
│   └── lib/
│       ├── badge-engine.ts # Automatic badge engine
│       ├── data.ts        # Mock data/constants
│       └── prisma.ts      # Prisma singleton client
├── package.json
└── env.example            # Environment variables
```

### Configuration

```bash
# Required environment variables (.env.local)
DATABASE_URL=postgresql://user:pass@localhost:5432/boomflow
AUTH_SECRET=openssl-rand-base64-32
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000
```

---

## API REST Reference

### Authentication

All APIs that modify data require authentication via NextAuth.
The token is handled automatically through session cookies.

### Kudos

#### `GET /api/kudos`

Retrieves the public kudos feed.

**Query Params:**
- `limit` (int, default: 20) - Number of kudos
- `cursor` (string) - ID for pagination

**Response:**
```json
{
  "kudos": [
    {
      "id": "clxyz...",
      "message": "Excellent work!",
      "from": { "id": "...", "username": "ursolcr", "image": "..." },
      "to": { "id": "...", "username": "jeremy-sud", "image": "..." },
      "category": { "name": "Teamwork", "emoji": "🤝" },
      "createdAt": "2026-02-15T10:00:00Z"
    }
  ],
  "nextCursor": "clxyz..."
}
```

#### `POST /api/kudos`

Creates a new kudo. **Requires authentication.**

**Body:**
```json
{
  "toUsername": "jeremy-sud",
  "message": "Great work on the PR!",
  "categoryId": "clxyz...",
  "isPublic": true
}
```

**Response (201):**
```json
{
  "kudo": { ... },
  "badgesAwarded": {
    "receiver": [{ "id": "...", "name": "Team Spirit", "slug": "team-spirit" }],
    "sender": []
  }
}
```

#### `GET /api/kudos/user/:username`

Kudos for a specific user.

**Query Params:**
- `type` (string: "received" | "sent" | "all", default: "received")

#### `GET /api/kudos/categories`

List of available kudo categories.

### Badges

#### `GET /api/badges`

Full badge catalog.

**Query Params:**
- `category` (string) - Filter by category (e.g.: "COLABORACION")
- `tier` (string) - Filter by tier (e.g.: "GOLD")

**Response:**
```json
{
  "total": 89,
  "badges": [...],
  "grouped": {
    "COLABORACION": [...],
    "CODIGO": [...]
  }
}
```

#### `GET /api/badges/user/:username`

Badges for a user with statistics.

**Response:**
```json
{
  "user": { "id": "...", "username": "jeremy-sud", ... },
  "badges": [...],
  "badgesByCategory": { ... },
  "stats": {
    "total": 6,
    "gold": 0,
    "silver": 2,
    "bronze": 4
  }
}
```

#### `POST /api/badges/award`

Awards a badge manually. **Requires authentication.**

**Body:**
```json
{
  "toUsername": "jeremy-sud",
  "badgeSlug": "code-ninja",
  "reason": "Excellent code quality on project X"
}
```

#### `DELETE /api/badges/award`

Revokes a badge. **Requires authentication.**

**Body:**
```json
{
  "username": "jeremy-sud",
  "badgeSlug": "code-ninja"
}
```

#### `GET /api/badges/progress`

Progress toward unearned badges.

**Query Params:**
- `username` (string) - User to query (default: authenticated user)

**Response:**
```json
{
  "stats": {
    "kudosReceived": 45,
    "kudosSent": 32,
    "codeReviews": 0,
    "pullRequests": 0
  },
  "progress": [
    {
      "badge": { "name": "Team Spirit", "slug": "team-spirit", "tier": "SILVER" },
      "progress": 45,
      "target": 50,
      "percentage": 90
    }
  ],
  "nextBadges": [...]
}
```

#### `POST /api/badges/evaluate`

Evaluates and awards pending automatic badges.

**Body:**
```json
{
  "username": "jeremy-sud"  // Optional
}
```

### Leaderboard

#### `GET /api/leaderboard`

User rankings.

**Query Params:**
- `type` (string: "badges" | "kudos_received" | "kudos_sent", default: "badges")
- `limit` (int, default: 10)

**Response:**
```json
{
  "type": "badges",
  "leaderboard": [
    {
      "rank": 1,
      "user": { "id": "...", "username": "ursolcr", "image": "..." },
      "count": 10
    }
  ]
}
```

### Notifications

#### `GET /api/notifications`

List of notifications for the authenticated user.

**Query Params:**
- `limit` (int, default: 20) - Number of notifications
- `unreadOnly` (boolean, default: false) - Unread only

**Response:**
```json
{
  "notifications": [
    {
      "id": "clxyz...",
      "type": "BADGE_EARNED",
      "title": "🏆 New Badge!",
      "message": "You have earned Code Ninja",
      "data": { "badgeSlug": "code-ninja" },
      "read": false,
      "createdAt": "2026-02-15T10:00:00Z"
    }
  ],
  "unreadCount": 3
}
```

#### `PATCH /api/notifications`

Marks notifications as read.

**Body:**
```json
{
  "notificationIds": ["clxyz...", "clxyz2..."],
  "markAll": false  // If true, marks all as read
}
```

### GitHub Sync

#### `GET /api/github/sync`

Retrieves the user's GitHub statistics.

**Response:**
```json
{
  "stats": {
    "commits": 156,
    "pullRequests": 42,
    "reviews": 89,
    "issues": 23,
    "totalContributions": 310,
    "lastSyncAt": "2026-02-15T10:00:00Z"
  },
  "needsSync": false
}
```

#### `POST /api/github/sync`

Syncs GitHub statistics and evaluates badges.

**Response:**
```json
{
  "success": true,
  "stats": {
    "commits": 156,
    "pullRequests": 42,
    "reviews": 89,
    "issues": 23,
    "totalContributions": 310
  },
  "syncedAt": "2026-02-15T10:00:00Z"
}
```

---

## Badge Engine

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BADGE ENGINE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   EVENT                    EVALUATION              RESULT       │
│   ─────                    ──────────              ──────       │
│                                                                 │
│   Kudo sent ─────────►  evaluateTrigger()  ──────► Badge?      │
│   Kudo received ─────►  KUDOS_RECEIVED     ──────► team-spirit │
│   PR merged ─────────►  PULL_REQUESTS      ──────► first-pr    │
│   Code review ───────►  CODE_REVIEWS       ──────► code-reviewer│
│                                                                 │
│              ┌──────────────────────────────┐                   │
│              │     getUserStats(userId)     │                   │
│              │  ─────────────────────────   │                   │
│              │  kudosReceived: 45           │                   │
│              │  kudosSent: 32               │                   │
│              │  codeReviews: 0              │                   │
│              │  pullRequests: 0             │                   │
│              └──────────────────────────────┘                   │
│                            │                                    │
│                            ▼                                    │
│              checkTrigger(type, value, stats)                   │
│              stats.kudosReceived >= 50 ? → award "team-spirit"  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Supported Triggers

| Trigger | Description | Example Badge |
|---------|-------------|---------------|
| `KUDOS_RECEIVED` | Receive X kudos | Team Spirit (50) |
| `KUDOS_SENT` | Send X kudos | Feedback Friend (20) |
| `CODE_REVIEWS` | Perform X code reviews | Code Reviewer (100) |
| `PULL_REQUESTS` | Create X PRs | First PR (1), Code Ninja (10) |
| `ISSUES_CLOSED` | Close X issues | Bug Hunter (20) |
| `STREAK_DAYS` | X days active | 1 Year (365), 3 Years (1095) |
| `FIRST_ACTION` | First action | Hello World, First Commit |
| `MANUAL` | Manual only | Tech Lead, Architect |
| `GITHUB_COMMIT` | Synced commits | First Commit (1), Code Ninja (50) |
| `GITHUB_PR` | Synced PRs | First PR (1) |
| `GITHUB_REVIEW` | Synced reviews | First Review (1), Code Reviewer (10) |
| `MANUAL_PEER_AWARD` | Awarded by a peer | Resonancia |
| `INVESTMENT` | By investment/donation | Patron Seed, Patron Growth, Patron Bloom |
| `PEER_AWARDS_COUNT` | X peer awards received | Vínculo Fuerte (3), Alma del Equipo (10) |

### Programmatic Usage

```typescript
import { BadgeEngine } from '@/lib/badge-engine'

// Evaluate all automatic badges for a user
const results = await BadgeEngine.evaluateUserBadges(userId)

// Evaluate a specific trigger
const badges = await BadgeEngine.evaluateTrigger(userId, TriggerType.KUDOS_RECEIVED)

// Award badge manually
const result = await BadgeEngine.awardBadge(userId, 'code-ninja', 'admin', 'Reason')

// Get progress toward badges
const progress = await BadgeEngine.getBadgeProgress(userId)

// === NEW: Peer-to-Peer Badges ===

// Award a Resonancia badge to a peer (max 2/year)
const peerResult = await BadgeEngine.awardPeerBadge(
  fromUserId, 
  toUserId, 
  'Thanks for backing me up during the Friday deployment'
)

// Check remaining Resonancia badges this year
const remaining = await BadgeEngine.getRemainingPeerAwards(userId)
// → 2 (if none given yet) | 1 | 0

// === NEW: Patron Badges (Investment) ===

// Award a Patron badge after a donation
const patronResult = await BadgeEngine.awardPatronBadge(
  userId,
  'growth',           // 'seed' | 'growth' | 'bloom'
  'stripe_pay_123',   // Payment reference (optional)
  'reforestation'     // Chosen impact (optional)
)
```

---

## Backend Services

### Notification Service

The notification service allows creating and managing real-time notifications for users.

**Location:** `backend/src/services/notificationService.js`

```javascript
import { 
  NotificationType,
  notifyKudoReceived, 
  notifyBadgeEarned,
  getNotificationsByUser,
  markAsRead,
  countUnread 
} from '../services/notificationService.js'

// Available notification types
NotificationType.KUDO_RECEIVED    // User received a kudo
NotificationType.BADGE_EARNED     // User earned a badge
NotificationType.BADGE_PROGRESS   // Progress toward a badge
NotificationType.INVITE_RECEIVED  // Organization invitation
NotificationType.SYSTEM           // System announcement

// Notify kudo received
await notifyKudoReceived({
  toUserId: 'user123',
  fromUsername: 'jeremy-sud',
  kudoId: 'kudo456',
  message: 'Great work on the PR!',
  category: 'COLLABORATION'
})

// Notify badge earned
await notifyBadgeEarned({
  userId: 'user123',
  badge: { id: 'badge456', name: 'Code Ninja', slug: 'code-ninja', tier: 'GOLD' }
})

// Get notifications for a user
const notifications = await getNotificationsByUser(userId, { 
  limit: 20, 
  unreadOnly: true 
})

// Mark notifications as read
await markAsRead(['notif1', 'notif2'], userId)

// Count unread notifications
const count = await countUnread(userId)
```

### Audit Log Service

The audit log service records important actions for compliance and debugging.

**Location:** `backend/src/services/auditLogService.js`

```javascript
import { 
  AuditAction,
  AuditResource,
  logKudoCreated,
  logBadgeAwarded,
  logGitHubSync,
  getAuditLogs 
} from '../services/auditLogService.js'

// Audited actions
AuditAction.KUDO_CREATED      // Kudo creation
AuditAction.BADGE_AWARDED     // Badge awarding
AuditAction.USER_ROLE_CHANGED // Role changes
AuditAction.GITHUB_SYNC       // GitHub syncs

// Log kudo creation (used internally in routes)
await logKudoCreated({
  userId: req.user.id,
  kudoId: 'kudo123',
  receiverId: 'user456',
  category: 'CODING',
  req  // To extract IP and User-Agent
})

// Log badge awarding
await logBadgeAwarded({
  awarderId: req.user.id,
  userId: 'user456',
  badgeId: 'badge123',
  userBadgeId: 'ub789',
  badgeName: 'Code Ninja',
  reason: 'Excellent code quality',
  req
})

// Query audit logs with filters
const logs = await getAuditLogs({
  userId: 'user123',
  action: AuditAction.BADGE_AWARDED,
  startDate: new Date('2026-01-01'),
  endDate: new Date(),
  limit: 100
})
```

---

## Database

### Schema (Prisma)

```prisma
// Users and Organizations
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  // ... relations with badges, kudos, org, team
}

model Organization {
  id    String @id @default(cuid())
  name  String
  slug  String @unique
  users User[]
  teams Team[]
}

// Kudos System
model Kudo {
  id        String @id @default(cuid())
  message   String
  from      User   @relation("KudosSent")
  to        User   @relation("KudosReceived")
  category  KudoCategory?
}

// Badge System
model Badge {
  id           String        @id @default(cuid())
  slug         String        @unique
  name         String
  category     BadgeCategory
  tier         BadgeTier
  triggerType  TriggerType?
  triggerValue Int?
}

model UserBadge {
  user      User   @relation
  badge     Badge  @relation
  awardedAt DateTime
  awardedBy String?
  reason    String?
}

// Enums
enum BadgeCategory {
  COLABORACION, CODIGO, LIDERAZGO, INNOVACION, 
  CULTURA, ONBOARDING, COMUNICACION, CALIDAD, ESPECIALES,
  COMMUNITY,    // Social / peer-to-peer badges
  PREMIUM       // Investment / patron badges
}

enum BadgeTier { BRONZE, SILVER, GOLD }

enum TriggerType {
  KUDOS_RECEIVED, KUDOS_SENT, CODE_REVIEWS, 
  PULL_REQUESTS, ISSUES_CLOSED, STREAK_DAYS, 
  FIRST_ACTION, MANUAL,
  // GitHub triggers
  GITHUB_COMMIT, GITHUB_PR, GITHUB_REVIEW,
  // Social economy
  MANUAL_PEER_AWARD,  // Awarded by a peer (Resonancia)
  INVESTMENT,         // Awarded by investment/donation (Patron)
  PEER_AWARDS_COUNT   // Number of peer-to-peer badges received
}
```

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Apply schema to the DB
npm run db:push

# Run migrations
npm run db:migrate

# Seed with initial data (97 badges)
npm run db:seed

# Open Prisma Studio (GUI)
npm run db:studio
```

---

## Badge Catalog

### Tier System

| Tier | Icon | Ring Color | Meaning |
|------|------|------------|---------|
| **Bronze** | 🥉 | `#CD7F32` | Initial achievement, first milestone reached |
| **Silver** | 🥈 | `#C0C0C0` | Consistently demonstrated competence |
| **Gold** | 🥇 | `#FFD700` | Mastery, recognized excellence |

### Categories

| Category | Emoji | Colors (Gradient) | Count |
|----------|-------|-------------------|-------|
| **Onboarding** | 🟢 | `#10B981` → `#059669` | 10 |
| **Coding** | 🔵 | `#3B82F6` → `#1D4ED8` | 21 |
| **DevOps** | 🟣 | `#8B5CF6` → `#6D28D9` | 10 |
| **Collaboration** | 🩷 | `#EC4899` → `#DB2777` | 16 |
| **Leadership** | 🟡 | `#F59E0B` → `#D97706` | 10 |
| **Documentation** | 📚 | `#6B7280` → `#4B5563` | 7 |
| **Growth** | 🌱 | `#84CC16` → `#65A30D` | 5 |
| **Milestones** | ❤️ | `#EF4444` → `#DC2626` | 9 |
| **Special** | ⭐ | `#FBBF24` → `#F59E0B` | 1 |
| **Community** | ❤️ | `#F472B6` → `#EC4899` | 4 |
| **Premium** | 💎 | `#A78BFA` → `#7C3AED` | 4 |

> 📖 See [ECONOMY.md](ECONOMY.md) for details on Community (Peer-to-Peer) and Premium (Investment) badges.

### Complete Category Reference

#### 🟢 Onboarding (10)

| ID | Label | Tier | Description | Auto-Award |
|----|-------|------|-------------|------------|
| `hello-world` | Hello World | 🥉 | First day on the team | ✅ |
| `first-commit` | First Commit | 🥉 | First commit to the repository | ✅ |
| `first-pr` | First PR | 🥉 | First approved Pull Request | ✅ |
| `first-review` | First Review | 🥉 | First code review performed | ✅ |
| `week-one` | Week One | 🥉 | One week on the team | ✅ |
| `month-one` | Month One | 🥈 | One month on the team | ✅ |
| `quarter-one` | Quarter One | 🥈 | Three months on the team | ✅ |
| `half-year` | Half Year | 🥈 | Six months on the team | ✅ |
| `year-one` | Year One | 🥇 | One year on the team | ✅ |
| `veteran` | Veteran | 🥇 | Three years on the team | ✅ |

#### 🔵 Coding (21)

| ID | Label | Tier | Description | Auto-Award |
|----|-------|------|-------------|------------|
| `code-ninja` | Code Ninja | 🥈 | 50+ clean commits | ✅ |
| `bug-hunter` | Bug Hunter | 🥈 | Finds bugs before production | ❌ |
| `bug-slayer` | Bug Slayer | 🥇 | 50+ bugs resolved | ✅ |
| `refactor-master` | Refactor Master | 🥈 | Safely improves legacy code | ❌ |
| `algorithm-ace` | Algorithm Ace | 🥇 | Optimal algorithms for complex problems | ❌ |
| `clean-code` | Clean Code | 🥈 | Readable and maintainable code | ❌ |
| `full-stack-hero` | Full Stack Hero | 🥇 | Masters both frontend and backend | ❌ |
| `api-master` | API Master | 🥈 | Well-designed and documented APIs | ❌ |
| `database-wizard` | Database Wizard | 🥈 | Query and schema optimization | ❌ |
| `security-champion` | Security Champion | 🥇 | Proactively implements security | ❌ |
| `ai-pioneer` | AI Pioneer | 🥇 | Leads AI/ML integration | ❌ |
| `performance-guru` | Performance Guru | 🥇 | Performance optimization | ❌ |
| `test-master` | Test Master | 🥈 | Exemplary test coverage | ❌ |
| `commit-century` | Commit Century | 🥈 | 100 commits | ✅ |
| `commit-500` | Commit 500 | 🥇 | 500 commits | ✅ |
| `commit-1000` | Commit Thousand | 🥇 | 1000 commits | ✅ |
| `pr-champion` | PR Champion | 🥈 | 50+ merged PRs | ✅ |
| `review-guru` | Review Guru | 🥈 | 100+ code reviews | ✅ |
| `hotfix-hero` | Hotfix Hero | 🥈 | Resolves emergencies quickly | ❌ |
| `mobile-master` | Mobile Master | 🥈 | Expert in mobile development | ❌ |
| `frontend-wizard` | Frontend Wizard | 🥈 | Mastery in technical UI/UX | ❌ |

#### 🟣 DevOps (10)

| ID | Label | Tier | Description | Auto-Award |
|----|-------|------|-------------|------------|
| `pipeline-pro` | Pipeline Pro | 🥈 | Fast and reliable CI/CD pipelines | ❌ |
| `docker-captain` | Docker Captain | 🥈 | Efficient containerization | ❌ |
| `kubernetes-knight` | K8s Knight | 🥇 | Advanced orchestration | ❌ |
| `cloud-deployer` | Cloud Deployer | 🥇 | Zero-downtime deployments | ❌ |
| `cicd-master` | CI/CD Master | 🥇 | Full cycle automation | ❌ |
| `terraform-titan` | Terraform Titan | 🥇 | Infrastructure as Code | ❌ |
| `incident-commander` | Incident Commander | 🥇 | Critical incident management | ❌ |
| `deploy-master` | Deploy Master | 🥈 | 50+ successful deployments | ✅ |
| `sre-specialist` | SRE Specialist | 🥇 | Site Reliability Engineering | ❌ |
| `monitoring-maven` | Monitoring Maven | 🥈 | Observability and alerting | ❌ |

#### 🩷 Collaboration (16)

| ID | Label | Tier | Description | Auto-Award |
|----|-------|------|-------------|------------|
| `mentor` | Mentor | 🥉 | Guides new team members | ❌ |
| `mentor-master` | Mentor Master | 🥇 | Has mentored 20+ colleagues | ❌ |
| `team-spirit` | Team Spirit | 🥈 | Keeps team morale high | ❌ |
| `code-reviewer` | Code Reviewer | 🥈 | Detailed and constructive reviews | ❌ |
| `pair-programmer` | Pair Programmer | 🥈 | Effective pair programming | ❌ |
| `team-player` | Team Player | 🥈 | Exceptional collaborator | ❌ |
| `helpful-hero` | Helpful Hero | 🥈 | Always available to help | ❌ |
| `hackathon-hero` | Hackathon Hero | 🥇 | Excels in hackathons | ❌ |
| `customer-champion` | Customer Champion | 🥈 | Focused on customer needs | ❌ |
| `bridge-builder` | Bridge Builder | 🥈 | Connects teams and departments | ❌ |
| `problem-solver` | Problem Solver | 🥈 | Solves complex problems | ❌ |
| `crisis-averted` | Crisis Averted | 🥇 | Saved a critical deployment | ❌ |
| `knowledge-sharer` | Knowledge Sharer | 🥈 | Actively shares knowledge | ❌ |
| `onboarding-guru` | Onboarding Guru | 🥈 | Excellent onboarding of newcomers | ❌ |
| `feedback-champion` | Feedback Champion | 🥈 | Consistent constructive feedback | ❌ |
| `culture-carrier` | Culture Carrier | 🥇 | Culture ambassador | ❌ |

#### 🟡 Leadership (10)

| ID | Label | Tier | Description | Auto-Award |
|----|-------|------|-------------|------------|
| `tech-lead` | Tech Lead | 🥇 | Leads technical decisions | ❌ |
| `architect` | Architect | 🥇 | Solid and scalable architecture | ❌ |
| `sprint-hero` | Sprint Hero | 🥈 | Exceptional sprint delivery | ❌ |
| `visionary` | Visionary | 🥇 | Strategic product vision | ❌ |
| `innovator` | Innovator | 🥇 | Transformative ideas implemented | ❌ |
| `mvp-month` | MVP of Month | 🥇 | Recognized as MVP of the month | ❌ |
| `decision-maker` | Decision Maker | 🥈 | Makes effective decisions | ❌ |
| `project-lead` | Project Lead | 🥇 | Successfully leads projects | ❌ |
| `change-agent` | Change Agent | 🥈 | Drives positive change | ❌ |
| `founder` | Founder | 🥇 | System founder | ❌ |

#### 📚 Documentation (7)

| ID | Label | Tier | Description | Auto-Award |
|----|-------|------|-------------|------------|
| `docs-hero` | Docs Hero | 🥉 | Clear documentation for the team | ❌ |
| `docs-contributor` | Docs Contributor | 🥉 | Contributes to documentation | ✅ |
| `tutorial-creator` | Tutorial Creator | 🥈 | Creates useful tutorials | ❌ |
| `open-source-contributor` | Open Source | 🥈 | Open source contributions | ❌ |
| `wiki-warrior` | Wiki Warrior | 🥈 | Keeps the wiki up to date | ❌ |
| `readme-ranger` | README Ranger | 🥈 | Exemplary READMEs | ❌ |
| `api-designer` | API Designer | 🥈 | Well-documented APIs | ❌ |

#### 🌱 Growth (5)

| ID | Label | Tier | Description | Auto-Award |
|----|-------|------|-------------|------------|
| `fast-learner` | Fast Learner | 🥈 | Learns quickly | ❌ |
| `conference-speaker` | Conference Speaker | 🥇 | Presents at conferences | ❌ |
| `lifelong-learner` | Lifelong Learner | 🥈 | Continuous learning | ❌ |
| `skill-builder` | Skill Builder | 🥈 | Develops new skills | ❌ |
| `eco-coder` | Eco Coder | 🥈 | Efficient and sustainable code | ❌ |

#### ❤️ Milestones (9)

| ID | Label | Tier | Criteria | Auto-Award |
|----|-------|------|----------|------------|
| `kudo-starter` | Kudo Starter | 🥉 | 10 kudos received | ✅ |
| `kudo-collector` | Kudo Collector | 🥈 | 50 kudos received | ✅ |
| `kudo-legend` | Kudo Legend | 🥇 | 100 kudos received | ✅ |
| `badge-collector` | Badge Collector | 🥈 | 10 badges earned | ✅ |
| `badge-legend` | Badge Legend | 🥇 | 20 badges earned | ✅ |
| `streak-master` | Streak Master | 🥈 | 30 days of continuous activity | ✅ |
| `yearly-mvp` | Yearly MVP | 🥇 | MVP of the year | ❌ |
| `all-star` | All Star | 🥇 | Badge in every category | ✅ |
| `completionist` | Completionist | 🥇 | 50+ badges | ✅ |

---

## Auto-Award System

### Description

The Auto-Award system automatically verifies the GitHub metrics of registered collaborators and awards badges based on their activity.

### Configuration

```yaml
# .github/workflows/auto-award.yml
name: 🏅 BOOMFLOW Auto-Award
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6:00 AM UTC
  workflow_dispatch:
```

### Verified Metrics

| Metric | Source | Related Badges |
|--------|--------|----------------|
| **Commits** | GitHub API | first-commit, code-ninja, commit-century, commit-500, commit-1000 |
| **Merged PRs** | GitHub API | first-pr, pr-champion |
| **Code Reviews** | GitHub API | first-review, review-guru |
| **Closed Issues** | GitHub API | bug-slayer |
| **Time on Team** | `joinedAt` in user.json | week-one, month-one, quarter-one, half-year, year-one, veteran |
| **Deployments** | GitHub Deployments API | deploy-master |

### Auto-Award Rules

```javascript
// scripts/auto-award.js - Rule examples

const AUTO_AWARD_RULES = [
  {
    badgeId: 'first-commit',
    description: 'First commit made',
    check: (metrics) => metrics.commits >= 1
  },
  {
    badgeId: 'code-ninja',
    description: '50+ clean commits',
    check: (metrics) => metrics.commits >= 50
  },
  {
    badgeId: 'year-one',
    description: 'One year on the team',
    check: (metrics, userData) => daysSinceJoined(userData) >= 365
  }
];
```

### Manual Execution

```bash
# Run auto-award check
node scripts/auto-award.js

# With GitHub token (required for API calls)
GITHUB_TOKEN=ghp_xxx node scripts/auto-award.js
```

---

## Real-time Webhooks

### Description

The webhook system detects GitHub events in real time and can pre-evaluate badges.

### Supported Events

| GitHub Event | Trigger | Potential Badges |
|--------------|---------|------------------|
| `pull_request.closed` + merged | Merged PR | first-pr, pr-champion |
| `pull_request_review.submitted` | Review completed | first-review, review-guru |
| `issues.closed` | Issue closed | bug-slayer |
| `release.published` | Release published | deploy-master |
| `push` | Push to main | first-commit |

### Workflow Configuration

```yaml
# .github/workflows/event-processor.yml
name: 🔔 BOOMFLOW Event Processor
on:
  pull_request:
    types: [closed]
  pull_request_review:
    types: [submitted]
  issues:
    types: [closed]
  release:
    types: [published]
  push:
    branches: [main]
```

### Processing Script

```javascript
// scripts/process-event.js
const EVENT_RULES = {
  'pull_request_merged': {
    badges: ['first-pr', 'pr-champion'],
    condition: (event) => event.pull_request?.merged === true
  },
  'pull_request_review': {
    badges: ['first-review', 'review-guru'],
    condition: (event) => event.review?.state === 'approved'
  }
};
```

---

## Administration CLI

### Available Commands

```bash
# Award badge
node scripts/badge-admin.js grant <user> <badge-id>

# Example
node scripts/badge-admin.js grant jeremy-sud architect

# Revoke badge (admins only)
node scripts/badge-admin.js revoke <user> <badge-id>

# List badges for a user
node scripts/badge-admin.js list <user>

# View global statistics
node scripts/stats.js
```

### Required Permissions

```javascript
// config/admins.json
{
  "admins": [
    {
      "username": "jeremy-sud",
      "permissions": ["grant_badges", "revoke_badges", "manage_users"]
    },
    {
      "username": "ursolcr",
      "permissions": ["grant_badges", "revoke_badges", "manage_users"]
    }
  ]
}
```

### Stats Script Output

```
┌────────────────────────────────────────────────────────────────────────┐
│                    🌸 BOOMFLOW - Statistics Panel                      │
├────────────────────────────────────────────────────────────────────────┤
│  Collaborators: 2                                                      │
│  Total Badges Awarded: 16                                              │
│  Average per User: 8.0                                                 │
├────────────────────────────────────────────────────────────────────────┤
│  📊 User            │ Badges   │ Last Activity                         │
│  ─────────────────────────────────────────────────────────────────────│
│  @jeremy-sud       │    6     │ 2026-02-15 (tech-lead)                 │
│  @ursolcr          │   10     │ 2026-02-15 (sprint-hero)               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## GitHub Action

### Installation

Add to `.github/workflows/boomflow.yml` in your profile repository:

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

### Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `boomflow_token` | ✅ | - | Personal access token with `repo` permissions |
| `github_username` | ❌ | `github.actor` | Target user to sync |
| `org_name` | ❌ | `SistemasUrsol` | Organization |

### README Markers

The action finds and replaces the content between these markers:

```markdown
<!-- BOOMFLOW-BADGES-START -->
[Badges are automatically inserted here]
<!-- BOOMFLOW-BADGES-END -->
```

### Manual Sync

```bash
# From the BOOMFLOW repo
node scripts/sync-profile.js <username> <readme-path> [--view=mode]

# Example
node scripts/sync-profile.js jeremy-sud /home/user/jeremy-sud/README.md
```

---

## Adaptive View System

The sync script automatically detects the number of badges and adjusts the display to keep profiles clean and readable.

### View Modes

| View | Badges | Description |
|------|--------|-------------|
| **Normal** | 1-12 | Full table with 48px icons, names, and tier |
| **Compact** | 13-30 | 32px icons in rows of 8, sorted by tier |
| **Mini** | 31+ | Collapsible `<details>` sections grouped by tier |

### Thresholds

```javascript
const THRESHOLD_COMPACT = 12;  // More than 12 → compact view
const THRESHOLD_MINI = 30;     // More than 30 → mini view
```

### Normal View (1-12 badges)

Displays a detailed table, ideal for few recognitions:

```markdown
| Badge | Name | Tier |
|:-----:|------|:----:|
| <img src="..." width="48"> | Code Ninja | 🥈 Silver |
```

### Compact View (13-30 badges)

Smaller icons in horizontal rows, sorted by tier (gold first):

```markdown
### 🏅 My BOOMFLOW Badges (25)

<img src="..." width="32" title="Gold Master"> <img src="..." width="32"> ...

**Summary:** 🥇 3 Gold | 🥈 12 Silver | 🥉 10 Bronze
```

### Mini View (31+ badges)

Collapsible sections for profiles with many badges:

```markdown
### 🏅 My BOOMFLOW Badges (45)

<details>
<summary>🥇 Gold (5 badges)</summary>
<img src="..." width="28"> <img src="..." width="28"> ...
</details>

<details>
<summary>🥈 Silver (20 badges)</summary>
...
</details>
```

### Force a Specific View

Use the `--view` flag to override automatic detection:

```bash
# Force compact view
node scripts/sync-profile.js jeremy-sud README.md --view=compact

# Force mini view (useful for testing)
node scripts/sync-profile.js jeremy-sud README.md --view=mini

# Force normal view
node scripts/sync-profile.js jeremy-sud README.md --view=normal
```

---

## Skins System

BOOMFLOW allows customizing the appearance of badges with different "skins" or visual styles.

### Available Packs

| Skin | Description | Access |
|------|-------------|--------|
| DEFAULT | Original colorful design | Free |
| CRYSTAL | Faceted gem/crystal style | Free |
| ACADEMIC | Formal shield with laurels | Free |
| MINIMALIST | Clean and simple design | Free |
| VINTAGE | Retro style with ornaments | Free |
| NEON | Cyberpunk with glow effects | Premium |

### Change Skin via API

```http
GET /api/badges/skins
```
**Response:**
```json
{
  "skins": [
    {
      "id": "skin_crystal_v1",
      "name": "Crystal",
      "slug": "crystal",
      "style": "CRYSTAL",
      "isPremium": false,
      "hasAccess": true
    }
  ],
  "hasPremiumAccess": false
}
```

### Create Custom Skins

Use the interactive generator:
```bash
node scripts/generate-custom-skin.js
```

Or in CLI mode:
```bash
node scripts/generate-custom-skin.js \
  --shape hexagon \
  --palette ocean \
  --effect glow \
  --icon gem \
  --text "EPIC" \
  --name "My Skin"
```

**Available options:**
- `--shape`: circle, hexagon, shield, octagon, oval, diamond
- `--palette`: ocean, forest, sunset, lavender, midnight, rose, gold, slate, neon, corporate
- `--effect`: none, glow, shadow, gradient, noise
- `--icon`: gem, star, badge, lightning, code, heart, trophy, rocket, none

For complete skin documentation, see [SKINS.md](SKINS.md).

---

## API Reference

### Endpoints (Backend in development)

#### Health Check

```http
GET /api/health
```

```json
{
  "status": "ok",
  "timestamp": "2026-02-15T00:00:00.000Z",
  "version": "2.1.0"
}
```

#### Badge Catalog

```http
GET /api/badges/catalog
```

```json
[
  {
    "id": "code-ninja",
    "emoji": "🥷",
    "label": "Code Ninja",
    "category": "coding",
    "tier": "silver",
    "meta": "Level 2",
    "description": "Clean, fast, and efficient code.",
    "svg": "badge-code-ninja.svg"
  }
]
```

#### User Badges

```http
GET /api/user/{username}/badges
```

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

---

## Data Models

### Badge (Catalog)

```typescript
interface Badge {
  id: string;           // Unique identifier (kebab-case)
  emoji: string;        // Display emoji
  label: string;        // Human-readable name
  category: Category;   // Category
  tier: Tier;           // bronze | silver | gold
  meta: string;         // Tier label (Level 1, 2, 3)
  description: string;  // Full description
  svg: string;          // SVG file name
}

type Category = 
  | 'onboarding' 
  | 'coding' 
  | 'devops' 
  | 'collaboration' 
  | 'leadership' 
  | 'documentation'
  | 'growth'
  | 'milestones'
  | 'special';

type Tier = 'bronze' | 'silver' | 'gold';
```

### User Data

```typescript
interface UserData {
  username: string;      // GitHub username
  displayName: string;   // Display name
  role?: string;         // Team role
  org: string;           // Organization
  joinedAt: string;      // ISO date of joining
  badges: UserBadge[];   // Awarded badges
}

interface UserBadge {
  id: string;            // Badge ID
  awardedAt: string;     // ISO date of awarding
  awardedBy: string;     // Username who awarded or "system"
}
```

### Admin Config

```typescript
interface AdminConfig {
  admins: Admin[];
  settings: Settings;
  autoAward: AutoAwardConfig;
}

interface Admin {
  username: string;
  displayName: string;
  role: string;
  permissions: Permission[];
  addedAt: string;
  addedBy: string;
}

type Permission = 
  | 'grant_badges' 
  | 'revoke_badges' 
  | 'manage_users' 
  | 'manage_admins';
```

---

## SVG Specification

### Dimensions

| Element | Value |
|---------|-------|
| Canvas | 128x128 px |
| Outer ring (tier) | 58px radius |
| Inner circle (category) | 50px radius |
| Center icon | 40x40 px |

### Tier Colors (Ring)

```css
/* Bronze */
stroke: #CD7F32;

/* Silver */
stroke: #C0C0C0;

/* Gold */
stroke: #FFD700;
```

### Category Gradients

```xml
<!-- Coding (Blue) -->
<linearGradient id="coding-gradient">
  <stop offset="0%" stop-color="#3B82F6"/>
  <stop offset="100%" stop-color="#1D4ED8"/>
</linearGradient>

<!-- Leadership (Yellow) -->
<linearGradient id="leadership-gradient">
  <stop offset="0%" stop-color="#F59E0B"/>
  <stop offset="100%" stop-color="#D97706"/>
</linearGradient>
```

### Base SVG Template

```xml
<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <!-- Tier ring -->
  <circle cx="64" cy="64" r="58" 
          fill="none" 
          stroke="#FFD700" 
          stroke-width="6"/>
  
  <!-- Category background -->
  <circle cx="64" cy="64" r="50" 
          fill="url(#category-gradient)"/>
  
  <!-- Icon (center) -->
  <text x="64" y="72" 
        text-anchor="middle" 
        font-size="40">
    🥷
  </text>
  
  <!-- Label (bottom) -->
  <text x="64" y="120" 
        text-anchor="middle" 
        font-size="10" 
        fill="#374151">
    Code Ninja
  </text>
</svg>
```

---

## Troubleshooting

### Badges not appearing on the profile

1. Verify that the markers exist in the README:
   ```markdown
   <!-- BOOMFLOW-BADGES-START -->
   <!-- BOOMFLOW-BADGES-END -->
   ```

2. Verify that the token has `repo` permissions

3. Run manual sync:
   ```bash
   node scripts/sync-profile.js <username> <readme-path>
   ```

### Auto-Award not awarding badges

1. Verify that the user is registered in `users/*.json`
2. Verify that `GITHUB_TOKEN` is configured
3. Run manually to see errors:
   ```bash
   GITHUB_TOKEN=ghp_xxx node scripts/auto-award.js
   ```

### Permission error when awarding badges

Only users listed in `config/admins.json` can award badges manually.

---

<p align="center">
  <strong>🌸 BOOMFLOW v2.1.0</strong><br/>
  <sub>Technical Documentation — Sistemas Ursol</sub>
</p>
