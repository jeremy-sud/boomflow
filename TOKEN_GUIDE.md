# 🔑 Configuration Guide: BOOMFLOW_TOKEN

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Ursol-Collaborators_Only-8B5CF6.svg" alt="Ursol Collaborators Only"/>
</p>

> **Step-by-step guide to configure your BOOMFLOW badge sync token**

---

## 📖 Table of Contents

1. [What is the BOOMFLOW_TOKEN?](#-what-is-the-boomflow_token)
2. [Step 1: Generate the Token](#step-1-generate-the-token-on-github)
3. [Step 2: Save the Token as a Secret](#step-2-save-the-token-as-a-secret)
4. [Step 3: Verify the Configuration](#step-3-verify-the-configuration)
5. [Troubleshooting](#-troubleshooting)

---

## 🔐 What is the BOOMFLOW_TOKEN?

The `BOOMFLOW_TOKEN` is a GitHub **Personal Access Token (PAT)** that allows the BOOMFLOW workflow to:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TOKEN FUNCTION                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   GitHub Action                                                         │
│        │                                                                │
│        │ uses BOOMFLOW_TOKEN to:                                        │
│        │                                                                │
│        ├──► 📖 Read badge data from the BOOMFLOW repo                  │
│        │                                                                │
│        └──► ✏️ Write to your profile README.md                         │
│                                                                         │
│   Without the token, the workflow lacks permission to modify your repo.│
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Prerequisites

Before proceeding, verify:

- [ ] ✅ You are an official Ursol Systems collaborator
- [ ] ✅ Your profile is registered in BOOMFLOW (`users/your-username.json` exists)
- [ ] ✅ You have a profile repository (`username/username` on GitHub)

---

## Step 1: Generate the Token on GitHub

### 1.1 Go to Developer Settings

1. Click on your **profile picture** (top right corner)
2. Click on **Settings**

![Settings](https://docs.github.com/assets/images/help/settings/userbar-account-settings.png)

3. In the left sidebar, scroll down to the bottom
4. Click on **Developer settings**

### 1.2 Create a Personal Access Token

1. Click on **Personal access tokens**
2. Click on **Tokens (classic)**
3. Click on **Generate new token** → **Generate new token (classic)**

### 1.3 Configure the Token

Fill in the fields:

| Field | Recommended Value |
|-------|-------------------|
| **Note** | `BOOMFLOW Badge Sync` |
| **Expiration** | `90 days` or `No expiration` |
| **Scopes** | ✅ `repo` (Full control of private repositories) |

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚠️  IMPORTANT: You only need to check "repo"                          │
│                                                                         │
│  ☑️ repo                                                                │
│     ├── ☑️ repo:status                                                  │
│     ├── ☑️ repo_deployment                                              │
│     ├── ☑️ public_repo                                                  │
│     ├── ☑️ repo:invite                                                  │
│     └── ☑️ security_events                                              │
│                                                                         │
│  ☐ workflow (NOT required)                                              │
│  ☐ admin:org (NOT required)                                             │
│  ☐ gist (NOT required)                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.4 Generate and Copy

1. Scroll to the bottom and click **Generate token**
2. **⚠️ COPY THE TOKEN NOW** — You will only see it once

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     └── Your token starts with "ghp_"
```

> 🔒 **Save the token temporarily** in a secure location (notepad, password manager). You will need it in the next step.

---

## Step 2: Save the Token as a Secret

### 2.1 Go to Your Profile Repository

Navigate to: `https://github.com/YOUR-USERNAME/YOUR-USERNAME`

For example: `https://github.com/jeremy-sud/jeremy-sud`

### 2.2 Open Repository Settings

1. Click on the **Settings** tab (of the repository, not your account)
2. In the sidebar, look for **Security**
3. Click on **Secrets and variables**
4. Click on **Actions**

### 2.3 Create the Secret

1. Click the green **New repository secret** button
2. Fill in:

| Field | Value |
|-------|-------|
| **Name** | `BOOMFLOW_TOKEN` (exactly as shown, uppercase) |
| **Secret** | Paste your token `ghp_xxxxx...` |

3. Click **Add secret**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✅ Secret created successfully                                         │
│                                                                         │
│  Repository secrets                                                     │
│  ├── BOOMFLOW_TOKEN    Updated just now       🗑️                       │
│                                                                         │
│  The token is now encrypted and secure.                                │
│  GitHub never displays the secret value.                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Step 3: Verify the Configuration

### 3.1 Verify the Workflow Exists

Your repository must contain the file `.github/workflows/boomflow.yml`:

```yaml
name: 🏅 BOOMFLOW Badge Sync

on:
  schedule:
    - cron: '0 0 * * *'
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

### 3.2 Run the Workflow Manually

1. Go to your profile repository
2. Click on the **Actions** tab
3. In the sidebar, select **BOOMFLOW Badge Sync**
4. Click **Run workflow** (dropdown button on the right)
5. Click **Run workflow** (green button)

### 3.3 Verify the Result

Wait a few seconds, then:

1. The workflow should appear with ✅ (green check)
2. Visit your profile: `https://github.com/YOUR-USERNAME`
3. You should see your badges between the markers

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✅ Success: Your profile should look like this                         │
│                                                                         │
│  ### 🏅 My Professional Achievements                                   │
│                                                                         │
│  <!-- BOOMFLOW-BADGES-START -->                                        │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ 🥉 Hello World │ 🥉 First Commit │ 🥈 Code Ninja │     │           │
│  └─────────────────────────────────────────────────────────┘           │
│  <!-- BOOMFLOW-BADGES-END -->                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Error: "Resource not accessible by integration"

**Cause**: The token does not have sufficient permissions.

**Solution**: 
1. Generate a new token with the full `repo` scope
2. Update the secret in your repository

### Error: "BOOMFLOW_TOKEN secret not found"

**Cause**: The secret name is incorrect.

**Solution**:
1. Go to **Settings** → **Secrets** → **Actions**
2. Verify the name is exactly `BOOMFLOW_TOKEN` (uppercase)

### The Workflow Passes but Badges Don't Appear

**Likely cause**: The markers are missing from your README.

**Solution**: Make sure you have exactly:
```markdown
<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->
```

### Expired Token

**Symptom**: The workflow used to work but now fails.

**Solution**:
1. Generate a new token (Step 1)
2. Go to **Settings** → **Secrets** → **Actions**
3. Click **Update** next to `BOOMFLOW_TOKEN`
4. Paste the new token

### Profile Not Registered in BOOMFLOW

**Symptom**: The workflow says it cannot find your user.

**Solution**: Contact your team lead to get registered:
```
https://github.com/jeremy-sud/boomflow/blob/main/users/
```

---

## 🔒 Token Security

### ✅ Best Practices

| Do | Don't |
|----|-------|
| Store in GitHub Secrets | Put directly in source code |
| Use tokens with expiration | Share your token with others |
| Rotate tokens periodically | Push tokens to public repos |

### What happens if someone obtains my token?

1. **Immediately revoke** the compromised token:
   - Settings → Developer settings → Personal access tokens
   - Click **Delete** next to the token
   
2. **Generate a new one** and update your secret

3. **Review** your repository history for suspicious changes

---

## ❓ FAQ

### Can I use a Fine-grained token instead of Classic?

Yes, but make sure it has **Read and Write** permissions for:
- Contents
- Metadata

### Does the token grant access to all my repos?

Yes, with the `repo` scope the token can access all your repos (public and private). That is why it is important to:
- Never share it
- Store it only in GitHub Secrets
- Revoke it if you suspect it has been compromised

### How often should I renew the token?

We recommend:
- **90 days** for a balance between security and convenience
- **No expiration** only if you trust your security practices

### Can I use the same token across multiple repos?

Yes, but it is not recommended. It is better to have a dedicated token per purpose.

---

## 📞 Support

Having trouble with the setup? Contact:

- **Slack**: #boomflow-support
- **Email**: [boomflow@ursol.com](mailto:boomflow@ursol.com)
- **Admin**: [@jeremy-sud](https://github.com/jeremy-sud)

---

<p align="center">
  <strong>🌸 BOOMFLOW</strong><br/>
  <sub>Token Guide — Ursol Systems</sub>
</p>
