# 💼 BOOMFLOW — Business Model

<p align="center">
  <img src="https://img.shields.io/badge/Category-Collaborative_Performance_Infrastructure-8B5CF6.svg" alt="CPI"/>
  <img src="https://img.shields.io/badge/Model-Open_Core_+_SaaS-blue.svg" alt="Model"/>
  <img src="https://img.shields.io/badge/Target-7_Figure_ARR-gold.svg" alt="Target"/>
</p>

> **Boomflow is not a gamification tool.**
> **Boomflow is collaborative performance infrastructure.**
> The first platform that turns collaboration signals into actionable organizational metrics.

---

## 📖 Table of Contents

1. [Category Definition](#1-category-definition)
2. [Open vs Pro Architecture](#2-open-vs-pro-architecture)
3. [Active User Technical Control](#3-active-user-technical-control)
4. [Pricing Structure/ PLANS](#4-pricing-structure)
5. [Value Ladder](#5-value-ladder)
6. [90-Day ROI Demonstration](#6-90-day-roi-demonstration)
7. [Strategic Implementation Model](#7-strategic-implementation-model)
8. [3-Year Financial Projection](#8-3-year-financial-projection)
9. [Strategic Risks & Mitigation](#9-strategic-risks--mitigation)
10. [Commercial Narrative](#10-commercial-narrative)

---

## 1. Category Definition

### Collaborative Performance Infrastructure (CPI)

Boomflow creates a new category. It does not compete with:

| Existing Tool | What It Does | What It Does NOT Do |
|--------------|-------------|---------------------|
| Bonusly, Kudos, Workvivo | Surface-level gamification | Does not generate structural behavioral metrics |
| 15Five, Lattice, Culture Amp | Surveys + OKRs | Does not capture real-time collaboration |
| GitHub Insights | Code metrics | Does not measure human dynamics or soft skills |
| Jira, Linear | Task tracking | Does not link effort to verifiable recognition |

**Collaborative Performance Infrastructure** is the layer connecting what people do (commits, reviews, mentoring, support) with what organizations need to measure (real collaboration, emerging leadership, attrition risk).

### Positioning

```
"Boomflow is to collaborative performance
 what GitHub is to code:
 the infrastructure where it's recorded, measured, and demonstrated."
```

### Why CPI and Not "Gamification"?

| Gamification | CPI (Boomflow) |
|-------------|-----------------|
| Points and stars | Organizational behavior signals |
| Temporary extrinsic motivation | Permanent metrics infrastructure |
| Install and forget | Integrates into existing workflows |
| Users perceive it as a game | Users perceive it as their professional portfolio |
| Sells to HR department | Sells to CTO, VP Engineering, and CEO |

---

## 2. Open vs Pro Architecture

### Guiding Principle

> What builds community is open.
> What generates business intelligence is Pro.
> What transforms organizations is Strategic.

### 2.1 Boomflow Open (GitHub — MIT)

Lives in the public repository. It is the lab, the showcase, and the philosophical foundation.

> **Note:** Boomflow Open is **not a commercial plan**. It is the open-source core used internally by Sistemas Ursol and available to the community. The commercial plans for companies (Pro, Scale, Enterprise) are built on top of this core.

**Includes:**

| Component | Current Location | Purpose |
|-----------|------------------|---------|
| Badge Engine Core | `scripts/auto-award.js`, `app-web/src/lib/badge-engine.ts` | Automatic badge evaluation engine |
| 89+ Badge Catalog | `api-mock.json`, `CATALOG.md` | Complete badge definitions |
| GitHub Action | `github-action/` | Direct repository integration |
| Event Processor | `scripts/process-event.js` | GitHub event processing |
| Skins System | `assets/skins/`, `scripts/generate-custom-skin.js` | 5 free visual styles |
| Peer-to-Peer Awards | `app-web/src/app/api/badges/peer-award/` | Peer recognition system |
| Profile Sync | `scripts/sync-profile.js` | GitHub profile synchronization |
| Base Prisma Schema | `app-web/prisma/schema.prisma` | Complete data model |
| Full Documentation | `*.md` | Architecture, economy, onboarding |

**What Open achieves:**
- Public proof the system works (Sistemas Ursol as a live case)
- Community of contributors improving the core
- Organic acquisition pipeline (devs discover it → use it → bring it to their companies)
- Technical credibility for enterprise buyers

### 2.2 Boomflow Pro (Multi-tenant SaaS)

The commercial product. Not a "fork" of Open — it's an additional layer on top of the same core.

**Pro-exclusive features:**

| Feature | Commercial Justification |
|---------|------------------------|
| **Multi-tenancy with isolation** | Each company gets its own space, separate data, custom branding |
| **Enterprise SSO/SAML** | Non-negotiable requirement for companies with 50+ people |
| **Advanced Analytics Dashboard** | Collaboration maps, engagement scoring, trends |
| **Predictive Alerts** | "3 people on team X haven't received recognition in 45 days" |
| **Exportable Reports** | PDF/Excel for board reviews and leadership committees |
| **Custom Badges per Company** | Create company-specific badges aligned with values |
| **Slack/Discord/Teams Integrations** | `/kudo @user` command from where teams already work |
| **Dedicated API with Rate Limits** | Integration with HRIS (BambooHR, Workday, SAP SuccessFactors) |
| **Premium NEON Skin** | Exclusive for Pro customers |
| **Audit & Compliance Logs** | `backend/src/services/auditLogService.js` — required in regulated sectors |
| **Multi-role Admin Panel** | Org admin → Team manager → Member |

### 2.3 Technical Separation Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      OPEN CORE + SaaS ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BOOMFLOW OPEN (GitHub, MIT)           BOOMFLOW PRO (SaaS, Proprietary)     │
│  ─────────────────────────────         ─────────────────────────────────    │
│                                                                             │
│  ┌──────────────────────────┐          ┌──────────────────────────────┐    │
│  │  Badge Engine Core       │ ◄────── │  Analytics Engine            │    │
│  │  • Automatic evaluation  │  SAME   │  • Engagement scoring        │    │
│  │  • GitHub triggers       │  BASE   │  • Attrition prediction      │    │
│  │  • Peer awards           │         │  • Collaboration maps        │    │
│  │  • 89+ badge catalog     │         │  • Smart alerts              │    │
│  └──────────────────────────┘         └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────┐          ┌──────────────────────────────┐    │
│  │  GitHub Integration      │          │  Enterprise Integration      │    │
│  │  • Webhooks              │          │  • SSO/SAML                  │    │
│  │  • Actions               │          │  • Slack/Discord/Teams       │    │
│  │  • Profile sync          │          │  • HRIS connectors           │    │
│  └──────────────────────────┘          │  • Dedicated API             │    │
│                                        └──────────────────────────────┘    │
│  ┌──────────────────────────┐                                              │
│  │  Base Web App            │          ┌──────────────────────────────┐    │
│  │  • Personal dashboard    │          │  Multi-tenant Platform       │    │
│  │  • Activity feed         │          │  • Data isolation            │    │
│  │  • Basic leaderboard     │          │  • Per-company branding      │    │
│  │  • Public profile        │          │  • User controls             │    │
│  └──────────────────────────┘          │  • Granular roles            │    │
│                                        └──────────────────────────────┘    │
│                                                                             │
│  ┌──────────────────────────┐          ┌──────────────────────────────┐    │
│  │  Full Documentation      │          │  Support & SLA               │    │
│  │  • Architecture          │          │  • Dedicated onboarding      │    │
│  │  • Usage guides          │          │  • 99.9% SLA                 │    │
│  │  • Contributing          │          │  • Priority support          │    │
│  └──────────────────────────┘          └──────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Golden Rule for the Open/Pro Boundary

Before deciding whether a feature is Open or Pro, apply this filter:

```yaml
decision_tree:
  question_1: "Does this feature benefit an individual developer?"
    yes: "OPEN — builds community and adoption"
    no: "Next question"
  
  question_2: "Does this feature require data from multiple people to be useful?"
    yes: "PRO — it's organizational intelligence"
    no: "Next question"
  
  question_3: "Does this feature solve a compliance or governance problem?"
    yes: "PRO — companies pay for compliance"
    no: "OPEN — when in doubt, keep it open"
```

---

## 3. Active User Technical Control

### 3.1 Control Model: Monthly Active Collaborators (MAC)

We don't charge "per registered employee" or "per seat." We charge by **Monthly Active Collaborators** — users who generated or received at least one collaboration signal in the last 30 days.

**Why MAC and not seats?**

| Model | Problem |
|-------|---------|
| Per seat (Slack, Jira) | Forces payment for inactive users → creates purchase friction |
| Per employee (Lattice) | Client feels they're paying for people who don't use the system |
| **Per MAC (Boomflow)** | Only charges for real usage → lower barrier to entry, higher adoption |

### 3.2 Technical Implementation

```typescript
// MAC count — runs as a daily cron job
interface MACCounter {
  organizationId: string
  period: '30d'
  
  // A user qualifies as MAC if in the last 30 days they:
  signals: [
    'kudo_sent',           // Sent a recognition
    'kudo_received',       // Received a recognition
    'badge_earned',        // Earned a badge
    'peer_award_given',    // Gave a peer award
    'peer_award_received', // Received a peer award
    'login',               // Logged into the platform
    'github_event',        // Had a GitHub event processed
  ]
}

// Prisma query to count MAC
const macCount = await prisma.user.count({
  where: {
    organizationId: orgId,
    OR: [
      { kudosSent:     { some: { createdAt: { gte: thirtyDaysAgo } } } },
      { kudosReceived: { some: { createdAt: { gte: thirtyDaysAgo } } } },
      { badges:        { some: { awardedAt: { gte: thirtyDaysAgo } } } },
      { sessions:      { some: { expires:   { gte: now } } } },
    ]
  }
})
```

### 3.3 Frictionless Enforcement

```yaml
mac_enforcement:
  soft_limit:
    behavior: "Allows exceeding limit by up to 15%"
    notification: "Banner in admin dashboard: 'Using 57 of 50 MAC'"
    grace_period: "14 days before any restriction"
    
  hard_limit:
    behavior: "No one is blocked. New users enter read-only mode"
    read_only_can:
      - view_their_badges
      - view_feed
      - view_leaderboard
    read_only_cannot:
      - send_kudos
      - give_peer_awards
    message: "Your organization has reached its active collaborator limit.
              Contact your admin to upgrade your plan."
    
  upgrade_trigger:
    behavior: "Automatic notification to org admin"
    message: "Your team is growing 🌸 — 57 people actively collaborated
              this month on a 50-MAC plan. Ready to upgrade?"
    cta: "View plan options"
```

**Why this model is legally clean:**
- Never denies access to existing data
- Never deletes badges or history
- Only limits the ability to generate new interactions
- Existing users can always view their portfolio
- Enforcement is gradual (notification → soft limit → read-only for new users)

---

## 4. Pricing Structure

### 4.1 Pricing Philosophy

> **More accessible than Lattice/15Five ($4-14/user/mo) yet more profitable because:**
> - Charges by MAC, not by seat (less resistance)
> - Fixed flat pricing per tier (simplicity)
> - Real value lives in strategic implementation (80%+ margin)

### 4.2 Plans

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BOOMFLOW PRICING                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐                 │
│  │  � PRO       │   │  🌸 SCALE     │   │  🏢 ENTERPRISE│                 │
│  │               │   │               │   │               │                 │
│  │  $149/mo      │   │  $499/mo      │   │  $1,499/mo    │                 │
│  │  up to 50 MAC │   │  up to 200 MAC│   │  500+ MAC     │                 │
│  │               │   │               │   │               │                 │
│  │  Open Core +  │   │  All Pro +    │   │  All Scale +  │                 │
│  │  Multi-tenant │   │  SSO/SAML     │   │  On-premise   │                 │
│  │  Analytics    │   │  Dedicated API│   │  Dedicated    │                 │
│  │  Slack bot    │   │  HRIS connect │   │  support      │                 │
│  │  Custom badge │   │  Attrition    │   │  Custom       │                 │
│  │  Reports      │   │  prediction   │   │  integrations │                 │
│  │  Email support│   │  99.9% SLA    │   │  Training     │                 │
│  │  NEON skin    │   │  Priority     │   │  included     │                 │
│  │               │   │  support      │   │               │                 │
│  │               │   │  Audit logs   │   │               │                 │
│  └───────────────┘   └───────────────┘   └───────────────┘                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

> **Note:** Boomflow Open is the free open-source core used by Sistemas Ursol and the community.
> It includes the badge engine, GitHub sync, full catalog, and peer awards (single org, GitHub-only).
> It is **not a commercial plan**. Companies wanting to use Boomflow should choose Pro or above.

### 4.3 Detailed Feature Breakdown by Plan

> **Note:** Boomflow Open is not a commercial plan — it is the open-source core used by Sistemas Ursol and the community. The plans below are for companies that want to use Boomflow with their teams.

| Feature | Pro | Scale | Enterprise |
|---------|-----|-------|------------|
| Badge engine core | ✅ | ✅ | ✅ |
| 89+ badge catalog | ✅ | ✅ | ✅ |
| GitHub integration | ✅ | ✅ | ✅ |
| Peer-to-peer awards | ✅ | ✅ | ✅ |
| GitHub profile sync | ✅ | ✅ | ✅ |
| 5 free skins | ✅ | ✅ | ✅ |
| Activity feed | ✅ | ✅ | ✅ |
| Basic leaderboard | ✅ | ✅ | ✅ |
| **Multi-tenant** | ✅ | ✅ | ✅ |
| **Analytics dashboard** | ✅ | ✅ | ✅ |
| **Custom badges** | ✅ | ✅ | ✅ |
| **Slack/Discord bot** | ✅ | ✅ | ✅ |
| **Exportable reports** | ✅ | ✅ | ✅ |
| **Premium NEON skin** | ✅ | ✅ | ✅ |
| **Email support** | ✅ | ✅ | ✅ |
| **SSO/SAML** | — | ✅ | ✅ |
| **Dedicated API** | — | ✅ | ✅ |
| **HRIS connectors** | — | ✅ | ✅ |
| **Attrition prediction** | — | ✅ | ✅ |
| **Collaboration maps** | — | ✅ | ✅ |
| **99.9% SLA** | — | ✅ | ✅ |
| **Audit & compliance** | — | ✅ | ✅ |
| **On-premise option** | — | — | ✅ |
| **Dedicated support** | — | — | ✅ |
| **Custom integrations** | — | — | ✅ |
| **Training included** | — | — | ✅ |

### 4.4 Why Fixed Flat Pricing?

```yaml
fixed_pricing_advantages:
  for_the_client:
    - "Predictable budget — $149/mo or $499/mo, always"
    - "Does not penalize organic growth (grow up to tier limit freely)"
    - "No need for exact headcount tracking"
    - "Simple purchase decision (4 options, no calculator)"
  
  for_boomflow:
    - "Higher average ticket than pure per-user pricing"
    - "Natural upsell when tier limit is exceeded"
    - "Fewer disputes about exact user counts"
    - "Clean billing, no monthly adjustments"
```

---

## 5. Value Ladder

### How a Small Company Evolves into a Premium Client

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BOOMFLOW VALUE LADDER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STAGE 5: ENTERPRISE + STRATEGIC IMPLEMENTATION                             │
│  ████████████████████████████████████████████████  $1,499/mo + impl.        │
│  │ Enterprise plan + Strategic Implementation                               │
│  │ Organizational diagnostics + Leader training                             │
│  │ Measurable cultural transformation                                       │
│  │                                                                          │
│  STAGE 4: SCALE                                                             │
│  ████████████████████████████████████  $499/mo                              │
│  │ SSO, API, predictive analytics                                           │
│  │ Company relies on Boomflow for talent decisions                          │
│  │                                                                          │
│  STAGE 3: PRO (mature)                                                      │
│  ██████████████████████████  $149/mo                                        │
│  │ Multiple teams, custom badges, Slack integration                         │
│  │ Manager sees report value → requests more                                │
│  │                                                                          │
│  STAGE 2: PRO (entry)                                                       │
│  ██████████████████  $149/mo                                                │
│  │ A team of 15-50 people tries Pro                                         │
│  │ Internal champion demonstrates value to leadership                       │
│  │                                                                          │
│  STAGE 1: DISCOVERY (Boomflow Open)                                         │
│  ██████████  Free (open-source, not a commercial plan)                      │
│  │ A developer discovers Boomflow on GitHub                                 │
│  │ Uses it at Sistemas Ursol or explores the open-source project            │
│  │ Thinks: "this should exist at my company"                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Ladder Ascension Triggers

| From → To | Trigger | Boomflow Action |
|-----------|---------|----------------|
| Discovery → Pro | Developer brings Boomflow to their company | Landing page: "Bring Boomflow to your team" + 30-day trial |
| Pro → Scale | Needs SSO or requests API access | Sales assist: personalized analytics demo |
| Scale → Enterprise | 500+ people or regulated sector | Consultative call, custom proposal |
| Any → Strategic | Wants cultural transformation | Free 45-min diagnostic → proposal |

### Ladder Health Metrics

```yaml
north_star_metrics:
  stage_1_discovery:
    - github_stars: "target 500 in year 1"
    - forks: "target 50 in year 1"
    - external_contributors: "target 10 in year 1"
    
  stage_2_pro_entry:
    - monthly_trial_starts: "target 20 by month 6"
    - trial_to_paid_conversion: "target 15%"
    - time_to_value: "<7 days to first automatic badge"
    
  stage_3_pro_mature:
    - expansion_rate: "30% of Pro clients upgrade to Scale within 6 months"
    - net_revenue_retention: ">110%"
    
  stage_4_scale:
    - enterprise_pipeline: "5 active opportunities in year 2"
    
  stage_5_strategic:
    - implementation_revenue: "20% of total revenue"
    - client_retention_post_implementation: ">90% at 12 months"
```

---

## 6. 90-Day ROI Demonstration

### 6.1 ROI Framework: "Collaboration Health Score"

Boomflow generates a **Collaboration Health Score (CHS)** per team and organization, based on real system data.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COLLABORATION HEALTH SCORE (CHS)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Dimension              Weight  Data Source                                 │
│  ─────────────────────  ──────  ────────────────────────────                │
│  Recognition            25%     Kudos sent + received / MAC / week          │
│  Frequency                                                                  │
│                                                                             │
│  Recognition            25%     Gini coefficient of kudos received          │
│  Distribution                   (0 = perfect equity)                        │
│                                                                             │
│  Integration            20%     Average days from joining to                │
│  Velocity                       first badge for new members                 │
│                                                                             │
│  Collaboration          15%     % of badges awarded cross-team              │
│  Breadth                        vs. intra-team                              │
│                                                                             │
│  Operational            15%     MAC / total registered users                │
│  Engagement                     (% active adoption)                         │
│                                                                             │
│  CHS = Σ (dimension × weight) → Scale 0–100                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 90-Day Protocol

```yaml
protocol_90_days:
  
  week_0:
    name: "Baseline"
    actions:
      - Deploy Boomflow Pro to the organization
      - Integrate with GitHub/Slack
      - Register users via SSO or invitation
      - Capture initial CHS (starting point)
    deliverable: "Baseline Report — Collaboration Health Score day 0"
    
  weeks_1_to_4:
    name: "Organic Adoption"
    actions:
      - Automatic badges begin awarding (commits, PRs, reviews)
      - Enable peer awards (2 per person per year)
      - Activity feed visible across the organization
      - First monthly leaderboard
    key_metrics:
      - "% of users who received at least 1 badge"
      - "% of users who sent at least 1 kudo"
      - "Average days to first badge"
    
  weeks_5_to_8:
    name: "Early Signals"
    actions:
      - Recognition distribution analysis
      - Identify "collaboration hubs" (most recognized people cross-team)
      - Detect low-engagement teams
      - Interim report to leadership
    deliverable: "Interim Report — Early CHS signals"
    
  weeks_9_to_12:
    name: "Value Demonstration"
    actions:
      - Compare CHS day 0 vs. day 90
      - Correlate with client internal metrics (if available):
        - Employee engagement surveys
        - Period attrition rate
        - Delivery velocity
      - Executive presentation of results
    deliverable: "Final Report — Boomflow ROI in 90 days"
```

### 6.3 Quantifiable ROI Narrative

| Client Metric | How Boomflow Impacts It | Conservative Quantification |
|--------------|------------------------|-----------------------------|
| **Voluntary attrition** | Teams with CHS >70 show 40% less attrition (internal benchmark) | Preventing 1 departure in 90 days on a 50-person team saves $15,000–25,000 in hiring costs |
| **Onboarding time** | New members with 3+ badges in 30 days integrate 2x faster | 2-week ramp reduction = ~$3,000 recovered productivity per hire |
| **Talent visibility** | HR identifies emerging leaders without relying on annual reviews | Data-driven promotion decisions, not politics |
| **Measurable engagement** | Dashboard replaces quarterly climate surveys | Saves $5,000–15,000/year in survey tools |

### 6.4 Closing Statement

> "In 90 days, Boomflow shows you who collaborates, who leads, and who needs attention — without surveys, without forms, without friction. Just from what your team already does every day."

---

## 7. Strategic Implementation Model

### 7.1 Why This Is Not Traditional Consulting

| Traditional Consulting | Boomflow Strategic Implementation |
|------------------------|-----------------------------------|
| Diagnostic → PowerPoint → "good luck" | Diagnostic → System configuration → Automatic metrics |
| Consultant leaves and value disappears | System keeps running and generating data |
| Charges by the hour (incentive to stretch) | Charges by outcome (fixed package) |
| Depends on consultant charisma | Depends on installed infrastructure |
| Deliverable: 80-page document | Deliverable: configured platform + live dashboard |

### 7.2 Implementation Packages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BOOMFLOW STRATEGIC IMPLEMENTATION                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────┐                                        │
│  │  🌱 SEED                        │                                        │
│  │  $3,500 (one-time)             │                                        │
│  │                                 │                                        │
│  │  • Organizational diagnostic    │                                        │
│  │    (2 sessions × 90 min)       │                                        │
│  │  • Boomflow Pro setup for      │                                        │
│  │    the organization            │                                        │
│  │  • Design of 10 custom badges  │                                        │
│  │    aligned with company values │                                        │
│  │  • Training for 3 admins       │                                        │
│  │  • CHS Baseline Report         │                                        │
│  │  • 30 days of post-go support  │                                        │
│  │                                 │                                        │
│  │  Duration: 2–3 weeks            │                                        │
│  │  Ideal for: 20–80 people        │                                        │
│  └─────────────────────────────────┘                                        │
│                                                                             │
│  ┌─────────────────────────────────┐                                        │
│  │  🌿 GROWTH                      │                                        │
│  │  $8,000 (one-time)             │                                        │
│  │                                 │                                        │
│  │  Everything in Seed +           │                                        │
│  │  • Deep diagnostic              │                                        │
│  │    (1:1 interviews with        │                                        │
│  │    team leads)                  │                                        │
│  │  • Collaborative leadership     │                                        │
│  │    workshop (4h, up to         │                                        │
│  │    15 leaders)                  │                                        │
│  │  • Design of 25 custom badges  │                                        │
│  │  • Slack/Teams integration     │                                        │
│  │  • 90-day protocol with        │                                        │
│  │    3 checkpoints               │                                        │
│  │  • Final ROI report            │                                        │
│  │  • 90 days of post-go support  │                                        │
│  │                                 │                                        │
│  │  Duration: 4–6 weeks            │                                        │
│  │  Ideal for: 50–200 people       │                                        │
│  └─────────────────────────────────┘                                        │
│                                                                             │
│  ┌─────────────────────────────────┐                                        │
│  │  🌸 BLOOM                       │                                        │
│  │  $18,000 (one-time)            │                                        │
│  │                                 │                                        │
│  │  Everything in Growth +         │                                        │
│  │  • Performance review process   │                                        │
│  │    redesign using Boomflow data│                                        │
│  │  • Internal "Culture Champions" │                                        │
│  │    training                    │                                        │
│  │  • HRIS integration            │                                        │
│  │  • Custom executive dashboard  │                                        │
│  │  • 2 additional workshops      │                                        │
│  │    (3 total)                   │                                        │
│  │  • Quarterly follow-up for     │                                        │
│  │    1 year (4 sessions)         │                                        │
│  │  • Early access to new         │                                        │
│  │    features                    │                                        │
│  │                                 │                                        │
│  │  Duration: 6–8 weeks            │                                        │
│  │  Ideal for: 150–500+ people     │                                        │
│  └─────────────────────────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Deliverable Structure

Every implementation produces permanent artifacts, not static documents:

| Deliverable | Format | Lifespan |
|------------|--------|----------|
| Configured Boomflow Pro | Live platform | Permanent |
| Company custom badges | SVG + system configuration | Permanent |
| CHS baseline | Real-time dashboard | Self-updating |
| Recognition playbook | Document + rule configuration | Permanent reference |
| Recorded training | Video accessible for future admins | Permanent |
| 90-day reports | Dashboard + executive PDF | Historical data |

### 7.4 Implementation Margins

```yaml
unit_economics_implementation:
  seed:
    price: 3500
    hours_cost: 20  # actual work hours
    internal_hourly_rate: 75
    total_cost: 1500
    gross_margin: "57%"
    
  growth:
    price: 8000
    hours_cost: 40
    internal_hourly_rate: 75
    total_cost: 3000
    gross_margin: "62%"
    
  bloom:
    price: 18000
    hours_cost: 80
    internal_hourly_rate: 75
    total_cost: 6000
    gross_margin: "67%"
```

---

## 8. 3-Year Financial Projection

### 8.1 Assumptions (Conservative Scenario)

```yaml
assumptions:
  year_1:
    - "Pro launch in Q2 2026"
    - "Focus on LATAM tech companies (accessible market, less competition)"
    - "1 person selling (founder), no sales team"
    - "Infrastructure: Vercel + Railway, low cost"
    - "No external investment"
    
  year_2:
    - "First sales/customer success hire"
    - "Expansion to US market"
    - "First 3 Scale clients"
    
  year_3:
    - "Team of 5 people"
    - "Product-market fit validated"
    - "Active enterprise pipeline"
    - "Potential seed round to scale"
```

### 8.2 Monthly Recurring Revenue (MRR) Projection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MRR PROJECTION — CONSERVATIVE SCENARIO                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MRR ($)                                                                    │
│  100K ┤                                                          ████      │
│       │                                                     ████████      │
│   80K ┤                                                ████████████      │
│       │                                           ████████████████      │
│   60K ┤                                      ████████████████████      │
│       │                                 ████████████████████████      │
│   40K ┤                            ████████████████████████████      │
│       │                       ████████████████████████████████      │
│   20K ┤                  ████████████████████████████████████      │
│       │             ▓▓▓▓▓▓▓▓████████████████████████████████      │
│   10K ┤        ▒▒▒▒▒▒▒▒▒▒▒▒████████████████████████████████      │
│       │   ░░░░░▒▒▒▒▒▒▒▒▒▒▒▒████████████████████████████████      │
│    0K ┼───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴────      │
│       Q2  Q3  Q4  Q1  Q2  Q3  Q4  Q1  Q2  Q3  Q4                 │
│       ── Year 1 ──  ─────── Year 2 ──────  ────── Year 3 ────    │
│                                                                             │
│   ░ = Pro ($149/mo)                                                         │
│   ▒ = Scale ($499/mo)                                                       │
│   ▓ = Enterprise ($1,499/mo, 500+ MAC)                                      │
│   █ = Mix all tiers                                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Year-by-Year Breakdown

#### Year 1 (2026) — Validation

| Source | Q2 | Q3 | Q4 | Year 1 Total |
|--------|----|----|----|----|
| **Pro Clients** | 3 | 10 | 18 | — |
| Pro MRR | $447 | $1,490 | $2,682 | — |
| **Scale Clients** | 0 | 1 | 3 | — |
| Scale MRR | $0 | $499 | $1,497 | — |
| **MRR Total** | **$447** | **$1,989** | **$4,179** | — |
| **Implementation revenue** | $3,500 | $7,000 | $11,500 | $22,000 |
| **ARR estimated (end of Q4)** | | | | **~$50,000** |
| **Total year 1 revenue** | | | | **~$50,000 + $22,000 = $72,000** |

#### Year 2 (2027) — Growth

| Metric | Q1 | Q2 | Q3 | Q4 | Year 2 Total |
|--------|----|----|----|----|------------|
| Total SaaS clients | 28 | 42 | 58 | 72 | — |
| MRR | $6,200 | $11,000 | $17,800 | $25,500 | — |
| Quarterly impl. revenue | $12,000 | $16,000 | $24,000 | $24,000 | $76,000 |
| **ARR estimated (end of year)** | | | | | **~$306,000** |
| **Total year 2 revenue** | | | | | **~$232,000 + $76,000 = $308,000** |

#### Year 3 (2028) — Scale

| Metric | Q1 | Q2 | Q3 | Q4 | Year 3 Total |
|--------|----|----|----|----|------------|
| Total SaaS clients | 90 | 115 | 145 | 175 | — |
| MRR | $35,000 | $50,000 | $68,000 | $90,000 | — |
| Quarterly impl. revenue | $30,000 | $36,000 | $45,000 | $54,000 | $165,000 |
| **ARR estimated (end of year)** | | | | | **~$1,080,000** |
| **Total year 3 revenue** | | | | | **~$800,000 + $165,000 = $965,000** |

### 8.4 Cost Structure by Year

| Item | Year 1 | Year 2 | Year 3 |
|------|--------|--------|--------|
| Infrastructure (Vercel, Railway, DB) | $3,600 | $9,600 | $24,000 |
| Tools (PostHog, Resend, etc.) | $1,200 | $3,600 | $7,200 |
| Salaries/contractors | $0* | $60,000 | $180,000 |
| Marketing/content | $2,400 | $12,000 | $36,000 |
| Legal/accounting | $2,000 | $5,000 | $8,000 |
| **Total cost** | **$9,200** | **$90,200** | **$255,200** |
| **Total revenue** | **$72,000** | **$308,000** | **$965,000** |
| **Net result** | **$62,800** | **$217,800** | **$709,800** |

> *Year 1: founder operates without formal salary, reinvests everything into product.

### 8.5 Path to 7 Figures

```yaml
path_to_seven_figures:
  target: "$1,000,000 ARR"
  achievable_by: "Q4 2028 – Q1 2029"
  
  composition_at_target:
    saas_mrr: "$80,000–90,000/mo"
    saas_arr: "$960,000–1,080,000/yr"
    implementation: "$120,000–165,000/yr"
    total: "$1,080,000–1,245,000/yr"
  
  clients_needed:
    pro_50mac: "~80 clients × $149 = $11,920/mo"
    scale_200mac: "~40 clients × $499 = $19,960/mo"
    enterprise_500plus_mac: "~10 clients × $1,499 = $14,990/mo"
    total_mrr: "~$46,870/mo (core tiers, mix shifts over time)"
    total_clients: "~130 clients"
    
  realism_benchmark: |
    130 clients in 3 years = ~3.6 new clients/month on average.
    With a 15% trial-to-paid conversion rate,
    that's ~24 trials/month, i.e., <1 trial/day.
    Achievable with content + community + referral.
```

---

## 9. Strategic Risks & Mitigation

### 9.1 Risk Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            RISK MATRIX                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  IMPACT                                                                     │
│  HIGH   │ ⚠️ Single founder    │ 🔴 GitHub changes  │ 🔴 Well-funded      │
│         │ dependency           │ its API/pricing    │ competitor copies   │
│         │                      │                    │ the model           │
│         │                      │                    │                     │
│  MEDIUM │ ⚠️ Early client      │ ⚠️ Employee data   │ ⚠️ Open source      │
│         │ churn                │ regulation         │ fork viability     │
│         │                      │ (GDPR, CCPA)       │                     │
│         │                      │                    │                     │
│  LOW    │ 🟢 "Gamification"   │ 🟢 HR-tech market  │ 🟢 Pricing          │
│         │ perception           │ saturation         │ difficulty          │
│         │                      │                    │                     │
│         └──────────────────────┴────────────────────┴─────────────────────  │
│           LOW                    MEDIUM               HIGH                  │
│                              LIKELIHOOD                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Detailed Analysis & Mitigation

#### 🔴 R1: GitHub Dependency

```yaml
risk: "Boomflow Open lives 100% on GitHub. If GitHub changes APIs,
       Actions pricing, or Webhooks, the core is affected."
       
likelihood: "Medium"
impact: "High"

mitigation:
  short_term:
    - "Badge engine core does NOT depend on GitHub API to function"
    - "GitHub is one signal source, not the only one — Slack, own API, 
       and manual input also feed the system"
    - "Data lives in PostgreSQL (Pro), not on GitHub"
    
  medium_term:
    - "Abstract the integration layer: GitHubProvider, GitLabProvider, etc."
    - "GitLab and Bitbucket support as Scale/Enterprise feature"
    - "Generic webhook: any external system can send events"
    
  long_term:
    - "Boomflow Open on GitHub is marketing and community"
    - "Boomflow Pro is independent — works without GitHub if needed"
    - "The real dependency is on Git, not GitHub"
```

#### 🔴 R2: Well-Funded Competitor Copies the Model

```yaml
risk: "A company with $10M+ funding builds a 'Boomflow killer'
       with more engineers and marketing budget."

likelihood: "High (if Boomflow shows traction)"
impact: "High"

mitigation:
  moat_1_open_source_community:
    - "The open core generates loyalty and contributions a closed SaaS cannot replicate"
    - "Fork fear: they can copy the SaaS, but not the community"
    
  moat_2_data_network_effects:
    - "The more collaboration data an org accumulates, the more valuable the metrics"
    - "Migrating from Boomflow = losing CHS history, badges, trends"
    - "High switching cost after 6 months of use"
    
  moat_3_implementation_expertise:
    - "Strategic implementation service is NOT copyable with code"
    - "Requires knowledge of organizational dynamics + the system"
    - "Competitors sell software; Boomflow sells transformation"
    
  moat_4_category_creation:
    - "First to define 'Collaborative Performance Infrastructure' controls the narrative"
    - "Aggressive content marketing: be THE reference for CPI"
    - "If a competitor enters, they validate the category (good for the leader)"
```

#### ⚠️ R3: Single Founder Dependency

```yaml
risk: "Operations depend on one person for product, sales, 
       implementation, and development."

likelihood: "High in year 1"
impact: "High"

mitigation:
  year_1:
    - "Automate everything possible (deployment, self-serve onboarding, docs)"
    - "The Open product runs without human intervention"
    - "Seed implementations are templatizable (80% repeatable)"
    
  year_2:
    - "First hire: Customer Success who also handles pre-sales"
    - "Document implementation playbooks"
    - "Record reusable trainings"
    
  year_3:
    - "Team of 4–5 people with clear roles"
    - "Founder focuses on product + strategy + large accounts"
```

#### ⚠️ R4: Early Client Churn

```yaml
risk: "First Pro clients don't see enough value and cancel 
       before 6 months."

likelihood: "Medium"
impact: "High (destroys the growth narrative)"

mitigation:
  preventive:
    - "30-day trial with guided onboarding (not pure self-serve)"
    - "Time to first badge < 24 hours (automatic configuration)"
    - "Internal champion identified before closing the sale"
    - "Check-in at 14, 30, and 60 days"
    
  reactive:
    - "Mandatory exit survey in cancellation flow"
    - "Downgrade offer (don't cancel, lower the plan)"
    - "Usage analysis: if MAC < 30% of plan, proactive outreach"
    
  structural:
    - "CHS becomes part of client's internal reports"
    - "Badges on GitHub profiles = public visibility = soft lock-in"
    - "Accumulated data = growing switching cost"
```

#### ⚠️ R5: Viable Open Source Fork

```yaml
risk: "Someone takes the MIT-licensed Boomflow Open code and creates 
       a hosted SaaS competitor."

likelihood: "Low–Medium"
impact: "Medium"

mitigation:
  by_design:
    - "Open code is the engine, not the full platform"
    - "Multi-tenancy, analytics, SSO, integrations are NOT in Open"
    - "Building a competitive SaaS requires ~60% of code from scratch"
    
  by_strategy:
    - "Iteration speed: Boomflow will always be 6+ months ahead"
    - "Brand and community: 'Boomflow' = CPI, not the fork"
    - "Strategic implementation: impossible to fork"
    
  by_precedent:
    - "GitLab, Supabase, PostHog use the same model successfully"
    - "No fork of these tools has captured significant market share"
    - "A fork validates the product, it doesn't destroy it"
```

#### 🟢 R6: "Gamification" Perception

```yaml
risk: "Market perceives Boomflow as 'another Bonusly' and dismisses it."

likelihood: "Medium"
impact: "Low (solved with positioning)"

mitigation:
  narrative:
    - "NEVER use the word 'gamification' in marketing"
    - "Framing: 'Collaborative performance infrastructure'"
    - "Sell to the CTO/VP Engineering, not HR"
    - "The product generates METRICS, not POINTS"
    
  social_proof:
    - "Case studies with real CHS data"
    - "Testimonials from engineering managers, not HR"
    - "Technical content: articles about CPI as a category"
```

---

## 10. Commercial Narrative

### 10.1 Elevator Pitch (30 seconds)

> "Boomflow is collaborative performance infrastructure.
> It automatically captures how your team collaborates — who mentors,
> who leads, who needs attention — and turns it into actionable metrics.
> No surveys, no forms, no friction. Just from what your team
> already does every day on GitHub, Slack, and in their daily work."

### 10.2 Pitch Deck Structure (10 slides)

```yaml
slide_1_hook:
  title: "Do you know who really collaborates on your team?"
  subtitle: "Not who makes the most commits. Who makes the team better."

slide_2_problem:
  title: "The $400B Problem"
  points:
    - "70% of employees feel undervalued"
    - "90% of real collaboration is invisible to management"
    - "Climate surveys capture opinion, not behavior"
    - "Voluntary attrition costs 1.5–2x annual salary"

slide_3_solution:
  title: "Collaborative Performance Infrastructure"
  subtitle: "The missing layer between what people do and what the organization needs to know"

slide_4_product:
  title: "How It Works"
  demo: "GitHub events → Badge engine → CHS dashboard → Talent decisions"

slide_5_traction:
  title: "Already Working"
  points:
    - "Sistemas Ursol: live production case"
    - "89 badges, 9 categories, automatic engine"
    - "Open-source core with active community (Sistemas Ursol as live case)"

slide_6_business_model:
  title: "Open Core + SaaS + Strategic Implementation"
  subtitle: "Open-source core powers community. Pro/Scale/Enterprise power revenue. Strategic powers transformation."

slide_7_market:
  title: "Market: $12.6B in Employee Experience Software (2025)"
  subtitle: "Boomflow targets tech companies with 20–500 people"

slide_8_financials:
  title: "Path to $1M ARR in 36 Months"
  points:
    - "130 clients, ~$47K+ MRR"
    - "Unit economics: LTV/CAC >5x"
    - "SaaS gross margin: 85%+"

slide_9_team:
  title: "Team"
  subtitle: "Builder who operates the system in real production"

slide_10_ask:
  title: "Boomflow is the infrastructure organizations don't know they need — until they see it work."
```

### 10.3 Brand Vocabulary

| ❌ NEVER Say | ✅ ALWAYS Say |
|-------------|--------------|
| Gamification | Collaborative performance infrastructure |
| Points | Collaboration signals |
| Medals/stars | Verifiable professional badges |
| HR tool | Engineer-first platform |
| Engagement platform | Performance infrastructure |
| Social recognition | Professional portfolio |
| HR dashboard | Collaboration Health Score |

### 10.4 Priority Acquisition Channels

```yaml
year_1_channels:
  1_github_community:
    cost: "$0"
    action: "Optimized README, CONTRIBUTING.md, GitHub Discussions"
    funnel: "Star → Fork → Open user → 'bring this to your company' → Pro trial"
    target: "500 stars, 50 forks"
    
  2_content_marketing:
    cost: "$200/mo (tools)"
    action: "Blog posts about CPI, founder's LinkedIn, Dev.to, Medium"
    frequency: "2 posts/week"
    topics:
      - "Why your code reviews are the best culture indicator"
      - "How to measure collaboration without surveys"
      - "The developer portfolio of the future includes soft skills"
      
  3_dev_communities:
    cost: "$0"
    action: "Presence in LATAM + US tech communities (meetups, Discord, Slack)"
    funnel: "Talk/demo → 'this is open source' → GitHub → Trial"
    target: "4 talks in year 1"
    
  4_referral:
    cost: "1 month free per successful referral"
    action: "Simple referral program post-month 6"
    target: "20% of new clients from referral in year 2"
```

---

## Appendix A: Key Metrics Glossary

| Metric | Definition | Year 1 Target |
|--------|-----------|---------------|
| **MAC** | Monthly Active Collaborators — users with ≥1 signal in 30 days | Per-client tracking |
| **CHS** | Collaboration Health Score — composite index 0–100 | Baseline + >15pt improvement in 90 days |
| **MRR** | Monthly Recurring Revenue | $4,179 by end of year 1 |
| **ARR** | Annual Recurring Revenue | $50,000 by end of year 1 |
| **NRR** | Net Revenue Retention | >110% from year 2 |
| **TTV** | Time to Value — days to first automatic badge | <24 hours |
| **Trial→Paid** | Trial to paid conversion rate | 15% |
| **LTV** | Average Lifetime Value per client | $4,200 (year 2) |
| **CAC** | Customer Acquisition Cost | <$500 (content-led) |
| **LTV/CAC** | Acquisition efficiency ratio | >8x |

---

## Appendix B: Codebase Alignment

| Model Element | Exists in Code | Status |
|--------------|----------------|--------|
| Badge Engine | `app-web/src/lib/badge-engine.ts` | ✅ Production |
| Multi-tenancy (Organizations) | `app-web/prisma/schema.prisma` — model Organization | ✅ Schema ready |
| Plans (PRO, SCALE, ENTERPRISE) | ROADMAP.md — enum Plan | ⚠️ Roadmap only |
| Peer Awards | `app-web/src/app/api/badges/peer-award/` | ✅ API implemented |
| GitHub Integration | `github-action/`, `scripts/process-event.js` | ✅ Production |
| Audit Logs | `backend/src/services/auditLogService.js` | ✅ Service created |
| Permission Service | `app-web/src/lib/permission-service.ts` | ✅ Implemented |
| Notification Service | `app-web/src/lib/notification-service.ts` | ✅ Implemented |
| Skins System | `assets/skins/`, BadgeSkin model in schema | ✅ Production |
| Analytics Endpoints | `app-web/src/app/api/leaderboard/` | ⚠️ Basic |
| SSO/SAML | — | ❌ Pending (Scale) |
| Slack/Discord Integration | — | ❌ Pending (Pro) |
| HRIS Connectors | — | ❌ Pending (Scale) |
| CHS Calculation | — | ❌ Pending (Pro) |
| MAC Enforcement | — | ❌ Pending (Pro) |

---

<p align="center">
  <strong>🌸 BOOMFLOW — Collaborative Performance Infrastructure</strong><br/>
  <sub>Talent isn't managed, it's cultivated. And now, it's measured.</sub><br/><br/>
  <sub>Living document — Last updated: February 2026</sub>
</p>
