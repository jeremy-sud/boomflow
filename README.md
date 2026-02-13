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
    &lt;!-- BLOOMFLOW-BADGES-START --&gt;
    &lt;!-- BLOOMFLOW-BADGES-END --&gt;
    ```
3.  Configure with your `BLOOMFLOW_TOKEN`.

<!-- BLOOMFLOW-BADGES-START -->

### 🏆 Bloomflow Achievements

<div align="center">
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-mentor.svg" width="120" alt="Master Mentor" />
  <h4>Master Mentor</h4>
  <p><em>"Awarded for guiding 20+ colleagues to success"</em></p>
</div>

**Total Kudos:** 45 | **Current Streak:** 12 days

<div align="center">
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-helper.svg" width="60" title="Ayudante (L1)" alt="Ayudante" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-resilience.svg" width="60" title="Resiliencia (L2)" alt="Resiliencia" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-first-pr.svg" width="60" title="First PR (L1)" alt="First PR" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-bug-scout.svg" width="60" title="Bug Scout (L1)" alt="Bug Scout" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-hello-world.svg" width="60" title="Hello World (L1)" alt="Hello World" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-code-ninja.svg" width="60" title="Code Ninja (L2)" alt="Code Ninja" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-reviewer.svg" width="60" title="Reviewer (L2)" alt="Reviewer" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-docs-hero.svg" width="60" title="Docs Hero (L2)" alt="Docs Hero" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-architect.svg" width="60" title="Architect (L3)" alt="Architect" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-crisis-averted.svg" width="60" title="Crisis Averted (L3)" alt="Crisis Averted" style="margin: 5px;" />
  <img src="https://raw.githubusercontent.com/dawnweaber/BOOMFLOW/main/assets/badge-mentor-master.svg" width="60" title="Mentor Master (L3)" alt="Mentor Master" style="margin: 5px;" />

</div>

> " Siempre explica los PRs con mucha paciencia. "  
> — *johndoe, 2023-10-27*

<!-- BLOOMFLOW-BADGES-END -->

## Monetization (Pro Version)

- **B2B SaaS:** Company-specific badges and analytics.
- **Verified Certifications:** Official soft skills validation.
- **Talent Analytics:** Anonymous aggregated data on skill growth.
