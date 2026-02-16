# 💎 BOOMFLOW — Recognition Economy

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Exclusive_Use-Sistemas_Ursol-8B5CF6.svg" alt="Exclusive"/>
  <img src="https://img.shields.io/badge/Version-1.0-gold.svg" alt="Version"/>
</p>

> **"At Ursol, value is not only generated through commits — it is generated through connections and mutual support. These badges represent an investment in our community."**

---

## 📖 Table of Contents

1. [System Philosophy](#system-philosophy)
2. [Bond Badges (Peer-to-Peer)](#-bond-badges-peer-to-peer)
3. [Investment Badges (Premium/Patron)](#-investment-badges-premiumpatron)
4. [Benefits by Category](#benefits-by-category)
5. [Protection against "Pay-to-Win"](#-protection-against-pay-to-win)
6. [Technical Implementation](#technical-implementation)

---

## System Philosophy

BOOMFLOW recognizes that talent goes beyond code. An exceptional team is built on **three pillars**:

```
┌─────────────────────────────────────────────────────────────────┐
│                     DIMENSIONS OF VALUE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ⚙️ TECHNICAL         ❤️ SOCIAL            💎 COMMITMENT       │
│   ──────────          ────────             ───────────          │
│   • Code              • Bonds              • Investment         │
│   • DevOps            • Mentorship         • Sponsorship        │
│   • Architecture      • Culture            • Sustainability     │
│                                                                 │
│   Technical           Human                Community            │
│   merit badges        connection badges    support badges       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❤️ Bond Badges (Peer-to-Peer)

### The Concept: "Resonance"

In corporate environments, we prefer to call them **Resonance** or **Bond** badges. These are not badges you "earn" through metrics — they are badges you **transfer** to a colleague.

### Mechanics

```yaml
# Resonance System Rules
allocation:
  badges_per_user_per_year: 2
  type: "camaraderie"
  transferable: true
  
restrictions:
  - no_self_award: true
  - no_reciprocal_immediate: true  # Cannot award someone who awarded you within 30 days
  - requires_message: true          # Must include a reason
```

### Why Does It Work?

| Aspect | Automatic Badge | Bond Badge |
|--------|----------------|------------|
| Origin | Algorithm | Colleague |
| Value | Objective | Emotional |
| Message | "You completed X commits" | "Thanks for sticking with me during Friday's deployment" |
| Impact | Recognition | Human connection |

### Available Badges

| Badge | Description | Trigger |
|-------|-------------|---------|
| 🤝 **Resonance** | A colleague recognizes you for your support | `MANUAL_PEER_AWARD` |
| 💫 **Strong Bond** | Received 3+ Resonance badges | Automatic |
| 🌟 **Team Soul** | Received 10+ Resonance badges | Automatic |

---

## 💎 Investment Badges (Premium/Patron)

### The Concept: Tangible Commitment

When a member invests (even symbolically) in the BOOMFLOW ecosystem, they are making a **public commitment** to the Ursol community.

### Meaningful Benefits

```yaml
# Investment Tier Benefits
patron_tiers:
  - tier: "seed"        # $1-5
    benefits:
      - badge: "patron-seed"
      - recognition_wall: true
      
  - tier: "growth"      # $10-20
    benefits:
      - badge: "patron-growth" 
      - time_off: "1 free afternoon per month"
      - course_access: "1 Udemy/Coursera course"
      
  - tier: "bloom"       # $50+
    benefits:
      - badge: "patron-bloom"
      - project_choice: "Priority in stack selection"
      - impact_certificate: "Donation to a social cause"
```

### Social Impact (Optional)

The funds raised can be allocated to:

| Destination | Description |
|-------------|-------------|
| 🌳 **Reforestation** | Plant trees with the fund |
| 💻 **Education** | Sponsor programming students |
| 🏠 **Community** | Support open source projects |

The badge becomes a **receipt** that "Ursol and I helped."

### Available Badges

| Badge | Investment | Main Benefit |
|-------|-----------|--------------|
| 🌱 **Patron Seed** | $1-5 | Public recognition |
| 🌿 **Patron Growth** | $10-20 | Disconnect time |
| 🌸 **Patron Bloom** | $50+ | Project choice |
| 🌳 **Eco Champion** | Social donation | Impact certificate |

---

## Benefits by Category

### Benefits Matrix

| Category | Badge Type | Tangible Benefit |
|----------|-----------|-----------------|
| 🔵 Coding | Technical merit | Professional recognition |
| 🟣 DevOps | Technical merit | Professional recognition |
| ❤️ Community | Social bond | Human connection |
| 💎 Premium | Investment | Real benefits |

### Disconnect Time

```
┌─────────────────────────────────────────────────────────────────┐
│                  🎫 DISCONNECT PASS                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   This pass grants 1 day off (24 hours) per month              │
│                                                                 │
│   Valid for: Growth and Bloom Patrons                          │
│   Usage: Any Friday of the month                               │
│   Requirement: 48-hour advance notice                          │
│                                                                 │
│   "Rest is part of productivity."                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Protection against "Pay-to-Win"

### The Risk

The main danger of monetizing badges is that **technical merit** badges may be perceived as less valuable than "purchased" ones.

### Solution: Visual and Semantic Separation

```yaml
badge_visual_distinction:
  merit_badges:         # Coding, DevOps, Leadership
    border: "standard"
    category_label: "MERIT"
    
  community_badges:     # Bond, Resonance
    border: "heart_shape"
    category_label: "SOCIAL"
    
  patron_badges:        # Investment
    border: "diamond_sparkle"
    category_label: "PATRON"
    color_scheme: "purple_gradient"
```

### Design Principles

1. **Differentiated Aesthetics**: Investment badges have a special frame (diamond-like shiny border)
2. **Visible Category**: "PATRON" or "SOCIAL" is always shown to distinguish them from technical merit
3. **Non-Competing**: Investment badges **never** appear in the technical skills leaderboard
4. **Full Transparency**: The profile clearly shows the origin of each badge

### What Money Can NOT Buy

| ❌ Never Purchasable | ✅ Obtainable through Investment |
|---------------------|--------------------------------|
| Code Ninja | Patron Seed |
| Bug Slayer | Patron Growth |
| Algorithm Ace | Patron Bloom |
| Tech Lead | Eco Champion |
| Any merit badge | Premium category badges |

---

## Technical Implementation

### New Categories in the Schema

```prisma
enum BadgeCategory {
  // ... existing categories
  COMMUNITY    // ❤️ Social/bond badges
  PREMIUM      // 💎 Investment/patron badges
}
```

### New Triggers

```prisma
enum TriggerType {
  // ... existing triggers
  MANUAL_PEER_AWARD    // Awarded by a colleague (Resonance)
  INVESTMENT           // Awarded through investment/donation
}
```

### API Endpoints

```http
# Award a Resonance badge to a colleague
POST /api/badges/peer-award
{
  "toUserId": "user123",
  "message": "Thanks for your support during the sprint"
}

# Process investment and award a Patron badge
POST /api/badges/patron
{
  "tier": "growth",
  "paymentId": "stripe_123",
  "impactChoice": "reforestation"  // optional
}
```

### Validations

```typescript
// peer-award: maximum 2 per year per user
const peerAwardsThisYear = await getPeerAwardsCount(fromUserId, currentYear)
if (peerAwardsThisYear >= 2) {
  throw new Error('You have used all your Resonance badges for this year')
}

// No self-awarding
if (fromUserId === toUserId) {
  throw new Error('You cannot award a badge to yourself')
}
```

---

## 📊 Category Summary

| Category | Emoji | Type | Origin |
|----------|-------|------|--------|
| 🟢 Onboarding | 🟢 | Merit | Automatic |
| 🔵 Coding | 🔵 | Merit | Automatic/Manual |
| 🟣 DevOps | 🟣 | Merit | Automatic/Manual |
| 🩷 Collaboration | 🩷 | Merit | Manual |
| 🟡 Leadership | 🟡 | Merit | Manual |
| 📚 Documentation | 📚 | Merit | Manual |
| 🌱 Growth | 🌱 | Merit | Manual |
| ❤️ Milestones | ❤️ | Cumulative | Automatic |
| ⭐ Special | ⭐ | Special | Automatic |
| ❤️ **Community** | ❤️ | **Social** | **Peer-to-Peer** |
| 💎 **Premium** | 💎 | **Investment** | **Donation** |

---

<p align="center">
  <strong>🌸 BOOMFLOW Economy — Multidimensional Value</strong><br/>
  <sub>Technical merit is only one dimension of talent — Sistemas Ursol</sub>
</p>
