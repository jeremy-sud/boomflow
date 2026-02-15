# 🌸 Bloomflow — Sistemas Ursol

> **Donde el talento no se gestiona, se cultiva.**

Bloomflow transforma el reconocimiento invisible en activos profesionales públicos. Permite a colegas enviar reconocimientos verificados (Kudos) que evolucionan en **Medallas Dinámicas**, sincronizadas automáticamente a tu perfil de GitHub.

## 🎯 El Problema

El 70% de los empleados se sienten infravalorados. El trabajo "soft" (mentoría, resolución de crisis) es invisible en CVs y métricas de código.

## ✅ La Solución

Una plataforma donde el reconocimiento entre pares se convierte en un activo profesional verificado.

## 🏅 Características

- **26 Medallas** organizadas en 6 categorías (Onboarding, Coding, DevOps, Colaboración, Liderazgo, Documentación)
- **3 Tiers** de progresión: 🥉 Bronce → 🥈 Plata → 🥇 Oro
- **GitHub Action** que escribe tus logros directo en tu README.md
- **Verificado** por [Sistemas Ursol](https://www.ursol.com)

## 📁 Estructura

| Directorio       | Descripción                             |
| ---------------- | --------------------------------------- |
| `/app-web`       | Plataforma web (Next.js + React)        |
| `/backend`       | API server (Express + Node.js)          |
| `/github-action` | GitHub Action para sincronizar medallas |
| `/assets`        | 26 medallas SVG dinámicas               |
| `/users`         | Datos de medallas por usuario           |

## 🚀 Instalación (GitHub Action)

1. Agrega el action `bloomflow-badge-sync` a tu workflow:

```yaml
- uses: jeremy-sud/boomflow@main
  with:
    bloomflow_token: ${{ secrets.BLOOMFLOW_TOKEN }}
```

2. Agrega los marcadores en tu `README.md`:

   ```
   <!-- BLOOMFLOW-BADGES-START -->
   ```

### 🏅 Jeremy Alva — Co-Fundador & Dev Lead

> 20 medallas obtenidas

<table>
<tr><td colspan="6"><strong>🟢 Onboarding</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-hello-world.svg" width="48" height="48" alt="Hello World"/><br/>
  <sub>🥉 <strong>Hello World</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-commit.svg" width="48" height="48" alt="First Commit"/><br/>
  <sub>🥉 <strong>First Commit</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-pr.svg" width="48" height="48" alt="First PR"/><br/>
  <sub>🥉 <strong>First PR</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-review.svg" width="48" height="48" alt="First Review"/><br/>
  <sub>🥉 <strong>First Review</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🔵 Coding</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-ninja.svg" width="48" height="48" alt="Code Ninja"/><br/>
  <sub>🥈 <strong>Code Ninja</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-bug-hunter.svg" width="48" height="48" alt="Bug Hunter"/><br/>
  <sub>🥈 <strong>Bug Hunter</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-clean-code.svg" width="48" height="48" alt="Clean Code"/><br/>
  <sub>🥈 <strong>Clean Code</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-full-stack.svg" width="48" height="48" alt="Full Stack"/><br/>
  <sub>🥇 <strong>Full Stack</strong></sub><br/>
  <sub>Nivel 3</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🟣 DevOps</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-pipeline-pro.svg" width="48" height="48" alt="Pipeline Pro"/><br/>
  <sub>🥈 <strong>Pipeline Pro</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docker-captain.svg" width="48" height="48" alt="Docker Captain"/><br/>
  <sub>🥈 <strong>Docker Captain</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🟡 Colaboración</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor.svg" width="48" height="48" alt="Mentor"/><br/>
  <sub>🥉 <strong>Mentor</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor-master.svg" width="48" height="48" alt="Mentor Master"/><br/>
  <sub>🥇 <strong>Mentor Master</strong></sub><br/>
  <sub>Nivel 3</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-team-spirit.svg" width="48" height="48" alt="Team Spirit"/><br/>
  <sub>🥈 <strong>Team Spirit</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-reviewer.svg" width="48" height="48" alt="Code Reviewer"/><br/>
  <sub>🥈 <strong>Code Reviewer</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🔴 Liderazgo</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-crisis-averted.svg" width="48" height="48" alt="Crisis Averted"/><br/>
  <sub>🥇 <strong>Crisis Averted</strong></sub><br/>
  <sub>Nivel 3</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-architect.svg" width="48" height="48" alt="Architect"/><br/>
  <sub>🥇 <strong>Architect</strong></sub><br/>
  <sub>Nivel 3</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-tech-lead.svg" width="48" height="48" alt="Tech Lead"/><br/>
  <sub>🥇 <strong>Tech Lead</strong></sub><br/>
  <sub>Nivel 3</sub>
</td>
</tr>
<tr><td colspan="6"><strong>⚪ Documentación</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docs-hero.svg" width="48" height="48" alt="Docs Hero"/><br/>
  <sub>🥉 <strong>Docs Hero</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-api-designer.svg" width="48" height="48" alt="API Designer"/><br/>
  <sub>🥈 <strong>API Designer</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-open-source.svg" width="48" height="48" alt="Open Source"/><br/>
  <sub>🥈 <strong>Open Source</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
</tr>
</table>

### 🏅 Eduardo Ureña — Co-Fundador & Gerente General

> 8 medallas obtenidas

<table>
<tr><td colspan="6"><strong>🟢 Onboarding</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-hello-world.svg" width="48" height="48" alt="Hello World"/><br/>
  <sub>🥉 <strong>Hello World</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-commit.svg" width="48" height="48" alt="First Commit"/><br/>
  <sub>🥉 <strong>First Commit</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-pr.svg" width="48" height="48" alt="First PR"/><br/>
  <sub>🥉 <strong>First PR</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-review.svg" width="48" height="48" alt="First Review"/><br/>
  <sub>🥉 <strong>First Review</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🟡 Colaboración</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor.svg" width="48" height="48" alt="Mentor"/><br/>
  <sub>🥉 <strong>Mentor</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-team-spirit.svg" width="48" height="48" alt="Team Spirit"/><br/>
  <sub>🥈 <strong>Team Spirit</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🔴 Liderazgo</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-sprint-hero.svg" width="48" height="48" alt="Sprint Hero"/><br/>
  <sub>🥈 <strong>Sprint Hero</strong></sub><br/>
  <sub>Nivel 2</sub>
</td>
</tr>
<tr><td colspan="6"><strong>⚪ Documentación</strong></td></tr>
<tr>
<td align="center" width="80">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docs-hero.svg" width="48" height="48" alt="Docs Hero"/><br/>
  <sub>🥉 <strong>Docs Hero</strong></sub><br/>
  <sub>Nivel 1</sub>
</td>
</tr>
</table>

> 🌸 Verificado por [Bloomflow](https://github.com/jeremy-sud/boomflow) @ [SistemasUrsol](https://www.ursol.com)

<!-- BLOOMFLOW-BADGES-END -->

```

3. ¡Hecho! Las medallas se sincronizarán automáticamente.

<!-- BLOOMFLOW-BADGES-START -->

### 🏅 Jeremy Alva — Co-Fundador & Dev Lead
> 20 medallas obtenidas

<table>
<tr><td colspan="6"><strong>🟢 Onboarding</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-hello-world.svg" width="48" height="48" alt="Hello World"/><br/>
<sub>🥉 <strong>Hello World</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-commit.svg" width="48" height="48" alt="First Commit"/><br/>
<sub>🥉 <strong>First Commit</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-pr.svg" width="48" height="48" alt="First PR"/><br/>
<sub>🥉 <strong>First PR</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-review.svg" width="48" height="48" alt="First Review"/><br/>
<sub>🥉 <strong>First Review</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🔵 Coding</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-ninja.svg" width="48" height="48" alt="Code Ninja"/><br/>
<sub>🥈 <strong>Code Ninja</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-bug-hunter.svg" width="48" height="48" alt="Bug Hunter"/><br/>
<sub>🥈 <strong>Bug Hunter</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-clean-code.svg" width="48" height="48" alt="Clean Code"/><br/>
<sub>🥈 <strong>Clean Code</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-full-stack.svg" width="48" height="48" alt="Full Stack"/><br/>
<sub>🥇 <strong>Full Stack</strong></sub><br/>
<sub>Nivel 3</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🟣 DevOps</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-pipeline-pro.svg" width="48" height="48" alt="Pipeline Pro"/><br/>
<sub>🥈 <strong>Pipeline Pro</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docker-captain.svg" width="48" height="48" alt="Docker Captain"/><br/>
<sub>🥈 <strong>Docker Captain</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🟡 Colaboración</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor.svg" width="48" height="48" alt="Mentor"/><br/>
<sub>🥉 <strong>Mentor</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor-master.svg" width="48" height="48" alt="Mentor Master"/><br/>
<sub>🥇 <strong>Mentor Master</strong></sub><br/>
<sub>Nivel 3</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-team-spirit.svg" width="48" height="48" alt="Team Spirit"/><br/>
<sub>🥈 <strong>Team Spirit</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-code-reviewer.svg" width="48" height="48" alt="Code Reviewer"/><br/>
<sub>🥈 <strong>Code Reviewer</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🔴 Liderazgo</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-crisis-averted.svg" width="48" height="48" alt="Crisis Averted"/><br/>
<sub>🥇 <strong>Crisis Averted</strong></sub><br/>
<sub>Nivel 3</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-architect.svg" width="48" height="48" alt="Architect"/><br/>
<sub>🥇 <strong>Architect</strong></sub><br/>
<sub>Nivel 3</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-tech-lead.svg" width="48" height="48" alt="Tech Lead"/><br/>
<sub>🥇 <strong>Tech Lead</strong></sub><br/>
<sub>Nivel 3</sub>
</td>
</tr>
<tr><td colspan="6"><strong>⚪ Documentación</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docs-hero.svg" width="48" height="48" alt="Docs Hero"/><br/>
<sub>🥉 <strong>Docs Hero</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-api-designer.svg" width="48" height="48" alt="API Designer"/><br/>
<sub>🥈 <strong>API Designer</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-open-source.svg" width="48" height="48" alt="Open Source"/><br/>
<sub>🥈 <strong>Open Source</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
</tr>
</table>


### 🏅 Eduardo Ureña — Co-Fundador & Gerente General
> 8 medallas obtenidas

<table>
<tr><td colspan="6"><strong>🟢 Onboarding</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-hello-world.svg" width="48" height="48" alt="Hello World"/><br/>
<sub>🥉 <strong>Hello World</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-commit.svg" width="48" height="48" alt="First Commit"/><br/>
<sub>🥉 <strong>First Commit</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-pr.svg" width="48" height="48" alt="First PR"/><br/>
<sub>🥉 <strong>First PR</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-first-review.svg" width="48" height="48" alt="First Review"/><br/>
<sub>🥉 <strong>First Review</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🟡 Colaboración</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-mentor.svg" width="48" height="48" alt="Mentor"/><br/>
<sub>🥉 <strong>Mentor</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-team-spirit.svg" width="48" height="48" alt="Team Spirit"/><br/>
<sub>🥈 <strong>Team Spirit</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
</tr>
<tr><td colspan="6"><strong>🔴 Liderazgo</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-sprint-hero.svg" width="48" height="48" alt="Sprint Hero"/><br/>
<sub>🥈 <strong>Sprint Hero</strong></sub><br/>
<sub>Nivel 2</sub>
</td>
</tr>
<tr><td colspan="6"><strong>⚪ Documentación</strong></td></tr>
<tr>
<td align="center" width="80">
<img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-docs-hero.svg" width="48" height="48" alt="Docs Hero"/><br/>
<sub>🥉 <strong>Docs Hero</strong></sub><br/>
<sub>Nivel 1</sub>
</td>
</tr>
</table>

> 🌸 Verificado por [Bloomflow](https://github.com/jeremy-sud/boomflow) @ [SistemasUrsol](https://www.ursol.com)
<!-- BLOOMFLOW-BADGES-END -->

## 💰 Monetización (Versión Pro)

- **B2B SaaS:** Medallas personalizadas por empresa y analytics
- **Certificaciones Verificadas:** Validación oficial de soft skills
- **Talent Analytics:** Datos anónimos agregados sobre crecimiento de habilidades

---

> 🌸 Desarrollado para [Sistemas Ursol](https://www.ursol.com) — ¡Su Puerto Seguro en Informática!
```
