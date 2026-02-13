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
### 🛠️ Logros en SistemasUrsol

* 🥈 **Mentor de Plata** | *Nivel 2* | "Siempre dispuesto a explicar el código."
* 🔥 **Resolución de Crisis** | *Nivel 5* | "Salvó el despliegue del último Sprint."
* 🤝 **Espíritu de Equipo** | *Nivel 3* | "Mantiene la moral alta en el equipo."
* 🦉 **Sabio del Código** | *Nivel 3* | "Arquitectura sólida y escalable."
* 🚀 **Despliegue Impecable** | *Nivel 1* | "Primer despliegue sin errores en producción."

> Verificado por Bloomflow @ SistemasUrsol
<!-- BLOOMFLOW-BADGES-END -->

## Monetization (Pro Version)

- **B2B SaaS:** Company-specific badges and analytics.
- **Verified Certifications:** Official soft skills validation.
- **Talent Analytics:** Anonymous aggregated data on skill growth.
