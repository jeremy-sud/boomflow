# 🛡️ BOOMFLOW Badge Protection System

> **⚠️ INTERNAL DOCUMENT - Administrators only (Sistemas Ursol)**

## Overview

BOOMFLOW implements a multi-layered protection system to ensure that **only authorized Sistemas Ursol administrators** can award badges to contributors.

This system prevents unauthorized users from self-assigning badges or modifying other users' data.

---

## 🔐 Protection Layers

### 1. Administrator List (`config/admins.json`)

Central file that defines who can award badges:

```json
{
  "admins": [
    {
      "username": "jeremy-sud",
      "permissions": ["grant_badges", "revoke_badges", "manage_users", "manage_admins"]
    },
    {
      "username": "ursolcr",
      "permissions": ["grant_badges", "revoke_badges", "manage_users", "manage_admins"]
    }
  ]
}
```

**Current administrators:**
| Username | Name | Permissions |
|----------|------|-------------|
| `jeremy-sud` | Jeremy Alva | All |
| `ursolcr` | Ursol CR | All |

### 2. GitHub Actions Workflow

The `.github/workflows/badge-protection.yml` workflow runs automatically on every Push or PR that modifies:
- `users/**` - User data files
- `config/admins.json` - Administrator list

**Validations:**
- ✅ Verifies the author is an authorized administrator
- ✅ Validates the JSON structure of modified files
- ✅ Records an audit log of changes

**On failure:**
- ❌ The workflow will block the PR merge
- ❌ The push will be marked as failed

### 3. CODEOWNERS

The `.github/CODEOWNERS` file requires explicit administrator approval for:

```
/users/              @jeremy-sud @ursolcr
/config/admins.json  @jeremy-sud @ursolcr
/.github/            @jeremy-sud @ursolcr
```

**Note:** For CODEOWNERS to work fully, you must enable "Require review from Code Owners" in the repository's branch protection settings.

### 4. Traceability (`awardedBy`)

Each badge records who awarded it:

```json
{
  "id": "first-commit",
  "awardedAt": "2024-02-01",
  "awardedBy": "jeremy-sud"
}
```

This allows:
- Auditing who awarded each badge
- Verifying it was an authorized administrator
- Maintaining a recognition history

### 5. Auto-Award System 🤖

For registered contributors (such as `jeremy-sud` and `ursolcr`), there is an **automated system** that verifies and awards badges daily.

**Workflow:** `.github/workflows/auto-award.yml`

**Schedule:** Every day at 6:00 AM UTC (midnight Costa Rica)

**How it works:**
1. The workflow runs automatically on the cron schedule
2. The `scripts/auto-award.js` script analyzes GitHub metrics
3. It checks commits, PRs, reviews, issues, etc.
4. It awards badges automatically if the criteria are met
5. It commits and pushes the changes

**Auto-Awardable Badges:**

| Category | Badges |
|----------|--------|
| **Onboarding** | hello-world, first-commit, first-pr, first-review, week-one, month-one, year-one |
| **Coding** | code-ninja, bug-hunter, commit-century, commit-500, commit-1000 |
| **Collaboration** | pr-champion, review-guru, team-player, helpful-hero |
| **Documentation** | docs-contributor, docs-hero |
| **Milestones** | streak-7, streak-30, early-bird, night-owl |

**Manual-Only Badges:**
- mentor, tech-lead, architect, team-spirit, sprint-hero, innovation-award, founder

**Manual Execution:**
```bash
# Run locally
node scripts/auto-award.js

# Run from GitHub Actions (manual trigger)
# Go to Actions > "BOOMFLOW Auto-Award (Daily)" > Run workflow
```

### 6. GitHub Webhooks System 🎯

BOOMFLOW detects GitHub events **in real time** and awards badges automatically.

**Workflow:** `.github/workflows/event-processor.yml`

**Detected Events:**

| Event | Trigger | Possible Badges |
|-------|---------|-----------------|
| `pull_request.merged` | PR merged | first-pr, pr-champion, hotfix-hero, docs-contributor |
| `pull_request_review.submitted` | Code review submitted | first-review, team-player, review-guru, code-guardian |
| `issues.opened` | Issue created | bug-reporter, feature-requester |
| `issues.closed` | Issue closed | bug-slayer, issue-closer |
| `release.published` | Release published | release-master |
| `push` | Commits pushed | code-ninja, commit-century, commit-500 |

**Flow:**
```
GitHub Event → Workflow triggers → Process event → Evaluate rules → Award badges → Commit & Push
```

**Script:** `scripts/process-event.js`

```bash
# Manual usage for testing
echo '{"pull_request":{"user":{"login":"jeremy-sud"},"merged":true}}' | \
  node scripts/process-event.js pull_request.merged
```

---

## 🛠️ Administration Tools

### Administration CLI

```bash
# List authorized administrators
node scripts/badge-admin.js list-admins

# Award a badge
node scripts/badge-admin.js grant <user> <badge-id> --admin <your-username>

# Revoke a badge
node scripts/badge-admin.js revoke <user> <badge-id> --admin <your-username>

# View user profile
node scripts/badge-admin.js user <user>
```

**Examples:**
```bash
# Jeremy awards a badge to a contributor
node scripts/badge-admin.js grant new-dev first-commit --admin jeremy-sud

# Ursolcr revokes a badge
node scripts/badge-admin.js revoke user code-ninja --admin ursolcr
```

---

## 📋 Badge Awarding Process

### For Administrators

1. **Evaluate** whether the contributor deserves the badge according to the defined criteria
2. **Execute** the CLI command or manually edit the JSON file
3. **Verify** that the file contains the `awardedBy` field with your username
4. **Commit & Push** the changes to the repository
5. The workflow will automatically validate permissions

### User file structure

```json
{
  "username": "github-contributor",
  "displayName": "Full Name",
  "role": "Developer",
  "org": "SistemasUrsol",
  "joinedAt": "2024-01-15",
  "badges": [
    {
      "id": "badge-id",
      "awardedAt": "2024-02-01",
      "awardedBy": "awarding-admin"
    }
  ]
}
```

---

## ⚠️ What NOT to Do

- ❌ **DO NOT** award badges to yourself (except system badges)
- ❌ **DO NOT** modify the `config/admins.json` file without authorization
- ❌ **DO NOT** approve PRs from unauthorized users that modify badges
- ❌ **DO NOT** share repository access with people outside of Ursol

---

## 🔧 Repository Configuration (GitHub)

For maximum protection, configure in GitHub → Settings → Branches:

### Branch protection for `main`:
- [x] Require a pull request before merging
- [x] Require approvals (minimum 1)
- [x] Require review from Code Owners
- [x] Require status checks to pass before merging
  - [x] `validate-badge-permissions`
- [x] Require branches to be up to date before merging
- [ ] Do not allow bypassing the above settings (optional for emergencies)

---

## 📞 Adding New Administrators

Only current administrators can add new administrators.

1. Edit `config/admins.json`
2. Add the new administrator with their permissions
3. Update `.github/CODEOWNERS` if necessary
4. Create a PR and obtain approval from another administrator

```json
{
  "username": "new-admin",
  "displayName": "Admin Name",
  "role": "Role at Ursol",
  "permissions": ["grant_badges", "revoke_badges", "manage_users"],
  "addedAt": "2024-XX-XX",
  "addedBy": "existing-admin"
}
```

---

## 📊 Auditing

All badge changes are recorded in:
1. **Git History** - Commits with author and date
2. **GitHub Actions Logs** - Validation records
3. **`awardedBy` field** - In each badge

To audit:
```bash
# View change history for users
git log --oneline -- users/

# View who modified a specific file
git log -p -- users/contributor.json
```

---

## 🚨 In Case of Incident

If you detect an incorrectly awarded badge:

1. **Identify** the affected user and badge
2. **Revoke** using the CLI: `node scripts/badge-admin.js revoke ...`
3. **Review** the git history to determine how it happened
4. **Report** to the administration team
5. **Strengthen** protections if necessary

---

*Protection system implemented on February 15, 2026*
*Maintained by: @jeremy-sud and @ursolcr*
