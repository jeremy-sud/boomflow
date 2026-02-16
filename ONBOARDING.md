# 🚀 Onboarding Guide — BOOMFLOW

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Internal_Document-Sistemas_Ursol-8B5CF6.svg" alt="Internal"/>
</p>

> **Step-by-step guide for integrating new collaborators into the BOOMFLOW system at Sistemas Ursol**

---

## 📖 Table of Contents

1. [Who can use BOOMFLOW?](#-who-can-use-boomflow)
2. [Registration Process (5 minutes)](#-registration-process-5-minutes)
3. [Set Up Your Profile to Display Badges](#-set-up-your-profile-to-display-badges)
4. [Your First Badges](#-your-first-badges)
5. [FAQ](#-faq)

---

## 🔒 Who can use BOOMFLOW?

BOOMFLOW is reserved **exclusively** for:

| ✅ Allowed | ❌ Not Allowed |
|------------|----------------|
| Official Sistemas Ursol collaborators | External users |
| Contractors with an active agreement | Self-registration |
| Authorized associates and partners | Personal use outside Ursol |

> **Not part of the team?** Contact [HR](mailto:rrhh@ursol.com) or check our [job openings](https://www.ursol.com/careers).

---

## ⚡ Registration Process (5 minutes)

### Prerequisites

Before you begin, make sure you have:

- [ ] An active GitHub account
- [ ] Confirmation from your team lead or HR

### Step 1: Request Registration

Send the following to your team lead or the BOOMFLOW admin:

```
BOOMFLOW Registration Request
──────────────────────────────
GitHub Username: your-username
Full Name: Your Name
Start Date: YYYY-MM-DD
Role: Your role on the team
```

### Step 2: The Admin Creates Your Profile

An administrator will create your file at `users/your-username.json`:

```json
{
  "username": "your-username",
  "displayName": "Your Full Name",
  "role": "Frontend Developer",
  "org": "SistemasUrsol",
  "joinedAt": "2026-02-15",
  "badges": [
    {
      "id": "hello-world",
      "awardedAt": "2026-02-15",
      "awardedBy": "system"
    }
  ]
}
```

> 🎉 **Your first badge!** When your profile is created, you automatically receive the **Hello World** badge.

### Step 3: Verify Your Registration

You can verify that your profile exists by visiting:
```
https://github.com/jeremy-sud/boomflow/blob/main/users/your-username.json
```

---

## 🖼️ Set Up Your Profile to Display Badges

### What is a GitHub Profile README?

GitHub allows you to create a special README that appears on your public profile. BOOMFLOW syncs your badges there.

```
┌─────────────────────────────────────────────────────────────────┐
│  github.com/your-username                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  # 👋 Hi, I'm Your Name                                        │
│                                                                 │
│  Developer at Sistemas Ursol                                    │
│                                                                 │
│  ### 🏅 My BOOMFLOW Badges                                     │
│  ┌─────────────────────────────────────────┐                   │
│  │ 🥉 Hello World  │ 🥉 First Commit  │    │ ◄── Your badges  │
│  │ 🥈 Code Ninja   │ 🥇 Tech Lead     │    │     appear here   │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Step 1: Create the Profile Repository

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: Type **exactly your username** (e.g., `your-username`)
3. Check **Public**
4. Check **Add a README file**
5. Click **Create repository**

> ℹ️ GitHub automatically detects it as a profile README when the repo has the same name as your user.

### Step 2: Add the BOOMFLOW Markers

Edit your `README.md` and add these markers where you want your badges to appear:

```markdown
## 👋 Hi, I'm [Your Name]

Developer at Sistemas Ursol

### 🏅 My Professional Achievements

<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->

---
More about me...
```

⚠️ **Important**: The markers must be exactly:
```markdown
<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->
```

### Step 3: Set Up Automatic Sync (Optional)

To have your badges update automatically, create the file `.github/workflows/boomflow.yml`:

```yaml
name: 🏅 BOOMFLOW Badge Sync

on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:      # Allows manual execution

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

### Step 4: Configure the Token

For the workflow to work, you need a GitHub token:

1. Go to **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. Name: `BOOMFLOW Sync`
4. Permissions: Check `repo` (Full control)
5. **Generate token** and copy the `ghp_...` code
6. Go to your profile repo → **Settings** → **Secrets and variables** → **Actions**
7. **New repository secret**:
   - Name: `BOOMFLOW_TOKEN`
   - Value: (paste the token)

📖 Detailed guide: [TOKEN_GUIDE.md](TOKEN_GUIDE.md)

### Step 5: Run the First Sync

1. Go to your profile repo
2. Click on **Actions**
3. Select **BOOMFLOW Badge Sync**
4. Click **Run workflow**
5. Wait a few seconds and check your profile!

---

## 🎖️ Your First Badges

### Automatic Badges

These badges are awarded **automatically** based on your GitHub activity:

| Badge | Criteria | When verified |
|-------|----------|---------------|
| 🥉 **Hello World** | Profile created in BOOMFLOW | Upon registration |
| 🥉 **First Commit** | 1+ commit in Ursol repos | Daily at 6AM UTC |
| 🥉 **First PR** | 1+ merged PR | Daily at 6AM UTC |
| 🥉 **First Review** | 1+ code review | Daily at 6AM UTC |
| 🥉 **Week One** | 7 days on the team | Daily at 6AM UTC |
| 🥈 **Month One** | 30 days on the team | Daily at 6AM UTC |
| 🥇 **Year One** | 365 days on the team | Daily at 6AM UTC |

### How to earn your first coding badge?

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PATH TO YOUR FIRST CODING BADGE                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Make your first commit to any SistemasUrsol repo                  │
│      └─► You will receive 🥉 First Commit                              │
│                                                                         │
│   2. Create your first Pull Request and get it approved                │
│      └─► You will receive 🥉 First PR                                  │
│                                                                         │
│   3. Review a teammate's code and approve/comment                      │
│      └─► You will receive 🥉 First Review                              │
│                                                                         │
│   4. Keep contributing: at 50 commits you will earn                     │
│      └─► 🥈 Code Ninja                                                 │
│                                                                         │
│   5. At 100 commits:                                                   │
│      └─► 🥈 Commit Century                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Badges Requiring Nomination

These badges are awarded by administrators when you demonstrate special skills:

| Badge | Description | How to earn it? |
|-------|-------------|-----------------|
| 🥇 **Tech Lead** | Demonstrated technical leadership | Lead technical decisions in projects |
| 🥇 **Architect** | Designs solid architectures | Propose and design scalable systems |
| 🥉 **Mentor** | Helps new members | Actively guide new teammates |
| 🥈 **Crisis Averted** | Saved a critical situation | Resolve a production incident |
| 🥇 **Innovator** | Transformative ideas | Propose and implement significant improvements |

> 💡 **Tip**: Your team lead can nominate any member for these badges.

---

## ❓ FAQ

### How long does it take for a badge to appear?

- **Automatic badges**: Up to 24 hours (daily verification at 6AM UTC)
- **Manual badges**: Immediately after an admin awards it
- **Profile sync**: Depends on your configuration (manual or daily)

### Can I self-assign badges?

**No.** The system is designed so that recognition comes from:
- The automatic system (GitHub metrics)
- Authorized administrators ([@jeremy-sud](https://github.com/jeremy-sud), [@ursolcr](https://github.com/ursolcr))

### What happens if I leave Sistemas Ursol?

Your badges remain on your profile as part of your professional history. They represent real achievements you earned during your time on the team.

### Can I see other people's badges?

Yes, user files are public:
```
https://github.com/jeremy-sud/boomflow/tree/main/users
```

### How do I nominate someone for a badge?

Contact an administrator:
- [@jeremy-sud](https://github.com/jeremy-sud)
- [@ursolcr](https://github.com/ursolcr)

Or open an issue in the BOOMFLOW repo with the nomination.

### My badge doesn't appear on my profile

Check the following:
1. Do you have the `<!-- BOOMFLOW-BADGES-START -->` markers in your README?
2. Did the workflow run successfully? (check the Actions tab)
3. Does your token have `repo` permissions?

If everything looks correct, run it manually: **Actions** → **Run workflow**

---

## 📞 Support

Having issues or questions? Contact us:

- **Slack**: #boomflow-support
- **Email**: [boomflow@ursol.com](mailto:boomflow@ursol.com)
- **GitHub Issues**: [Create issue](https://github.com/jeremy-sud/boomflow/issues/new)

---

<p align="center">
  <strong>🌸 BOOMFLOW</strong><br/>
  <sub>Welcome to the team — Sistemas Ursol</sub>
</p>
