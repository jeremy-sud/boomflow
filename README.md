# Bloomflow: The Organizational Health Platform

Bloomflow transforms invisible recognition into public professional assets. It allows colleagues to send verified acknowledgments (Kudos) that evolve into Dynamic Badges, synced automatically to your GitHub profile.

## The Concept

**Problem:** 70% of employees feel undervalued. "Soft" work (mentoring, crisis resolution) is invisible in CVs and code metrics.
**Solution:** A platform where peer recognition becomes a verified professional asset.

## Features

- **Purposeful Kudos:** Recognition for Resilience, Mentorship, Debugging, Clarity.
- **The Vault:** Evolutionary badges. "Helper" -> "Mentor" -> "Community Legend".
- **GitHub Integration:** A GitHub Action that writes your achievements directly to your README.md.

## Repository Structure

- `/app-web`: The platform (React/Node).
- `/github-action`: The Action code (JavaScript/TypeScript).
- `/assets`: Badge designs (Dynamic SVGs).

## Installation (GitHub Action)

1.  Add the `bloomflow-badge-sync` action to your workflow.
2.  Add a placeholder in your `README.md`:
    ```markdown
    <!-- BLOOMFLOW-BADGES-START -->
    <!-- BLOOMFLOW-BADGES-END -->
    ```
3.  Configure with your `BLOOMFLOW_TOKEN`.

## Monetization (Pro Version)

- **B2B SaaS:** Company-specific badges and analytics.
- **Verified Certifications:** Official soft skills validation.
- **Talent Analytics:** Anonymous aggregated data on skill growth.
