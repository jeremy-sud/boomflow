# 📚 BOOMFLOW — Documentación Técnica

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Uso_Exclusivo-Sistemas_Ursol-8B5CF6.svg" alt="Exclusivo"/>
  <img src="https://img.shields.io/badge/version-2.1.0-blue.svg" alt="Version"/>
</p>

> Referencia técnica completa del Sistema de Reconocimiento Profesional BOOMFLOW

---

## 📖 Índice

1. [Conceptos Fundamentales](#conceptos-fundamentales)
2. [Catálogo de Medallas](#catálogo-de-medallas)
3. [Sistema de Auto-Award](#sistema-de-auto-award)
4. [Webhooks en Tiempo Real](#webhooks-en-tiempo-real)
5. [CLI de Administración](#cli-de-administración)
6. [GitHub Action](#github-action)
7. [API Reference](#api-reference)
8. [Modelos de Datos](#modelos-de-datos)
9. [Especificación SVG](#especificación-svg)

---

## Conceptos Fundamentales

### ¿Qué es una Medalla?

Una medalla en BOOMFLOW representa un **logro profesional verificado**. Cada medalla tiene:

```
┌─────────────────────────────────────────────────────────────────┐
│                        ANATOMÍA DE UNA MEDALLA                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐                                                   │
│   │  🥇     │  ◄── Anillo exterior: indica el TIER (bronce,    │
│   │ [Icon]  │      plata, oro)                                  │
│   │         │                                                   │
│   └─────────┘  ◄── Círculo interior: color de CATEGORÍA        │
│                                                                 │
│   Metadatos:                                                    │
│   • id: "code-ninja"                                            │
│   • label: "Code Ninja"                                         │
│   • category: "coding"                                          │
│   • tier: "silver"                                              │
│   • description: "Código limpio, rápido y eficiente"            │
│   • svg: "badge-code-ninja.svg"                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Ciclo de Vida de una Medalla

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  TRIGGER │───►│ EVALUAR  │───►│ OTORGAR  │───►│  SYNC    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     │               │               │               │
     ▼               ▼               ▼               ▼
  - Cron           - Verificar    - Agregar      - Actualizar
  - Webhook          métricas       a user/        README.md
  - Admin CLI      - Validar        *.json
                     permisos
```

---

## Catálogo de Medallas

### Sistema de Tiers

| Tier | Icono | Color Anillo | Significado |
|------|-------|--------------|-------------|
| **Bronze** | 🥉 | `#CD7F32` | Logro inicial, primer hito alcanzado |
| **Silver** | 🥈 | `#C0C0C0` | Competencia demostrada consistentemente |
| **Gold** | 🥇 | `#FFD700` | Maestría, excelencia reconocida |

### Categorías

| Categoría | Emoji | Colores (Gradient) | Cantidad |
|-----------|-------|-------------------|----------|
| **Onboarding** | 🟢 | `#10B981` → `#059669` | 10 |
| **Coding** | 🔵 | `#3B82F6` → `#1D4ED8` | 21 |
| **DevOps** | 🟣 | `#8B5CF6` → `#6D28D9` | 10 |
| **Collaboration** | 🩷 | `#EC4899` → `#DB2777` | 16 |
| **Leadership** | 🟡 | `#F59E0B` → `#D97706` | 10 |
| **Documentation** | 📚 | `#6B7280` → `#4B5563` | 7 |
| **Growth** | 🌱 | `#84CC16` → `#65A30D` | 5 |
| **Milestones** | ❤️ | `#EF4444` → `#DC2626` | 9 |
| **Special** | ⭐ | `#FBBF24` → `#F59E0B` | 1 |

### Referencia Completa por Categoría

#### 🟢 Onboarding (10)

| ID | Label | Tier | Descripción | Auto-Award |
|----|-------|------|-------------|------------|
| `hello-world` | Hello World | 🥉 | Primer día en el equipo | ✅ |
| `first-commit` | First Commit | 🥉 | Primer commit al repositorio | ✅ |
| `first-pr` | First PR | 🥉 | Primer Pull Request aprobado | ✅ |
| `first-review` | First Review | 🥉 | Primera code review realizada | ✅ |
| `week-one` | Week One | 🥉 | Una semana en el equipo | ✅ |
| `month-one` | Month One | 🥈 | Un mes en el equipo | ✅ |
| `quarter-one` | Quarter One | 🥈 | Tres meses en el equipo | ✅ |
| `half-year` | Half Year | 🥈 | Seis meses en el equipo | ✅ |
| `year-one` | Year One | 🥇 | Un año en el equipo | ✅ |
| `veteran` | Veteran | 🥇 | Tres años en el equipo | ✅ |

#### 🔵 Coding (21)

| ID | Label | Tier | Descripción | Auto-Award |
|----|-------|------|-------------|------------|
| `code-ninja` | Code Ninja | 🥈 | 50+ commits limpios | ✅ |
| `bug-hunter` | Bug Hunter | 🥈 | Encuentra bugs antes de producción | ❌ |
| `bug-slayer` | Bug Slayer | 🥇 | 50+ bugs resueltos | ✅ |
| `refactor-master` | Refactor Master | 🥈 | Mejora código legacy de forma segura | ❌ |
| `algorithm-ace` | Algorithm Ace | 🥇 | Algoritmos óptimos para problemas complejos | ❌ |
| `clean-code` | Clean Code | 🥈 | Código legible y mantenible | ❌ |
| `full-stack-hero` | Full Stack Hero | 🥇 | Domina frontend y backend | ❌ |
| `api-master` | API Master | 🥈 | APIs bien diseñadas y documentadas | ❌ |
| `database-wizard` | Database Wizard | 🥈 | Optimización de queries y esquemas | ❌ |
| `security-champion` | Security Champion | 🥇 | Implementa seguridad proactivamente | ❌ |
| `ai-pioneer` | AI Pioneer | 🥇 | Lidera integración de IA/ML | ❌ |
| `performance-guru` | Performance Guru | 🥇 | Optimización de performance | ❌ |
| `test-master` | Test Master | 🥈 | Cobertura de tests ejemplar | ❌ |
| `commit-century` | Commit Century | 🥈 | 100 commits | ✅ |
| `commit-500` | Commit 500 | 🥇 | 500 commits | ✅ |
| `commit-1000` | Commit Thousand | 🥇 | 1000 commits | ✅ |
| `pr-champion` | PR Champion | 🥈 | 50+ PRs mergeadas | ✅ |
| `review-guru` | Review Guru | 🥈 | 100+ code reviews | ✅ |
| `hotfix-hero` | Hotfix Hero | 🥈 | Resuelve emergencias rápidamente | ❌ |
| `mobile-master` | Mobile Master | 🥈 | Experto en desarrollo móvil | ❌ |
| `frontend-wizard` | Frontend Wizard | 🥈 | Maestría en UI/UX técnico | ❌ |

#### 🟣 DevOps (10)

| ID | Label | Tier | Descripción | Auto-Award |
|----|-------|------|-------------|------------|
| `pipeline-pro` | Pipeline Pro | 🥈 | CI/CD pipelines rápidos y confiables | ❌ |
| `docker-captain` | Docker Captain | 🥈 | Containerización eficiente | ❌ |
| `kubernetes-knight` | K8s Knight | 🥇 | Orquestación avanzada | ❌ |
| `cloud-deployer` | Cloud Deployer | 🥇 | Zero-downtime deployments | ❌ |
| `cicd-master` | CI/CD Master | 🥇 | Automatización total del ciclo | ❌ |
| `terraform-titan` | Terraform Titan | 🥇 | Infrastructure as Code | ❌ |
| `incident-commander` | Incident Commander | 🥇 | Manejo de incidentes críticos | ❌ |
| `deploy-master` | Deploy Master | 🥈 | 50+ deployments exitosos | ✅ |
| `sre-specialist` | SRE Specialist | 🥇 | Site Reliability Engineering | ❌ |
| `monitoring-maven` | Monitoring Maven | 🥈 | Observabilidad y alertas | ❌ |

#### 🩷 Collaboration (16)

| ID | Label | Tier | Descripción | Auto-Award |
|----|-------|------|-------------|------------|
| `mentor` | Mentor | 🥉 | Guía a nuevos miembros del equipo | ❌ |
| `mentor-master` | Mentor Master | 🥇 | Ha guiado a 20+ colegas | ❌ |
| `team-spirit` | Team Spirit | 🥈 | Mantiene la moral del equipo | ❌ |
| `code-reviewer` | Code Reviewer | 🥈 | Reviews detalladas y constructivas | ❌ |
| `pair-programmer` | Pair Programmer | 🥈 | Pair programming efectivo | ❌ |
| `team-player` | Team Player | 🥈 | Colaborador excepcional | ❌ |
| `helpful-hero` | Helpful Hero | 🥈 | Siempre disponible para ayudar | ❌ |
| `hackathon-hero` | Hackathon Hero | 🥇 | Destaca en hackathons | ❌ |
| `customer-champion` | Customer Champion | 🥈 | Enfocado en necesidades del cliente | ❌ |
| `bridge-builder` | Bridge Builder | 🥈 | Conecta equipos y departamentos | ❌ |
| `problem-solver` | Problem Solver | 🥈 | Resuelve problemas complejos | ❌ |
| `crisis-averted` | Crisis Averted | 🥇 | Salvó un deployment crítico | ❌ |
| `knowledge-sharer` | Knowledge Sharer | 🥈 | Comparte conocimiento activamente | ❌ |
| `onboarding-guru` | Onboarding Guru | 🥈 | Excelente onboarding de nuevos | ❌ |
| `feedback-champion` | Feedback Champion | 🥈 | Feedback constructivo constante | ❌ |
| `culture-carrier` | Culture Carrier | 🥇 | Embajador de la cultura | ❌ |

#### 🟡 Leadership (10)

| ID | Label | Tier | Descripción | Auto-Award |
|----|-------|------|-------------|------------|
| `tech-lead` | Tech Lead | 🥇 | Lidera decisiones técnicas | ❌ |
| `architect` | Architect | 🥇 | Arquitectura sólida y escalable | ❌ |
| `sprint-hero` | Sprint Hero | 🥈 | Entrega excepcional en sprints | ❌ |
| `visionary` | Visionary | 🥇 | Visión estratégica del producto | ❌ |
| `innovator` | Innovator | 🥇 | Ideas transformadoras implementadas | ❌ |
| `mvp-month` | MVP of Month | 🥇 | Reconocido como MVP del mes | ❌ |
| `decision-maker` | Decision Maker | 🥈 | Toma decisiones efectivas | ❌ |
| `project-lead` | Project Lead | 🥇 | Lidera proyectos exitosamente | ❌ |
| `change-agent` | Change Agent | 🥈 | Impulsa cambios positivos | ❌ |
| `founder` | Founder | 🥇 | Fundador del sistema | ❌ |

#### 📚 Documentation (7)

| ID | Label | Tier | Descripción | Auto-Award |
|----|-------|------|-------------|------------|
| `docs-hero` | Docs Hero | 🥉 | Documentación clara para el equipo | ❌ |
| `docs-contributor` | Docs Contributor | 🥉 | Contribuye a documentación | ✅ |
| `tutorial-creator` | Tutorial Creator | 🥈 | Crea tutoriales útiles | ❌ |
| `open-source-contributor` | Open Source | 🥈 | Contribuciones open source | ❌ |
| `wiki-warrior` | Wiki Warrior | 🥈 | Mantiene la wiki actualizada | ❌ |
| `readme-ranger` | README Ranger | 🥈 | READMEs ejemplares | ❌ |
| `api-designer` | API Designer | 🥈 | APIs bien documentadas | ❌ |

#### 🌱 Growth (5)

| ID | Label | Tier | Descripción | Auto-Award |
|----|-------|------|-------------|------------|
| `fast-learner` | Fast Learner | 🥈 | Aprende rápidamente | ❌ |
| `conference-speaker` | Conference Speaker | 🥇 | Presenta en conferencias | ❌ |
| `lifelong-learner` | Lifelong Learner | 🥈 | Aprendizaje continuo | ❌ |
| `skill-builder` | Skill Builder | 🥈 | Desarrolla nuevas habilidades | ❌ |
| `eco-coder` | Eco Coder | 🥈 | Código eficiente y sostenible | ❌ |

#### ❤️ Milestones (9)

| ID | Label | Tier | Criterio | Auto-Award |
|----|-------|------|----------|------------|
| `kudo-starter` | Kudo Starter | 🥉 | 10 kudos recibidos | ✅ |
| `kudo-collector` | Kudo Collector | 🥈 | 50 kudos recibidos | ✅ |
| `kudo-legend` | Kudo Legend | 🥇 | 100 kudos recibidos | ✅ |
| `badge-collector` | Badge Collector | 🥈 | 10 badges obtenidos | ✅ |
| `badge-legend` | Badge Legend | 🥇 | 20 badges obtenidos | ✅ |
| `streak-master` | Streak Master | 🥈 | 30 días de actividad continua | ✅ |
| `yearly-mvp` | Yearly MVP | 🥇 | MVP del año | ❌ |
| `all-star` | All Star | 🥇 | Badge en cada categoría | ✅ |
| `completionist` | Completionist | 🥇 | 50+ badges | ✅ |

---

## Sistema de Auto-Award

### Descripción

El sistema de Auto-Award verifica automáticamente las métricas de GitHub de los colaboradores registrados y otorga medallas basándose en su actividad.

### Configuración

```yaml
# .github/workflows/auto-award.yml
name: 🏅 BOOMFLOW Auto-Award
on:
  schedule:
    - cron: '0 6 * * *'  # Diario a las 6:00 AM UTC
  workflow_dispatch:
```

### Métricas Verificadas

| Métrica | Fuente | Medallas Relacionadas |
|---------|--------|----------------------|
| **Commits** | GitHub API | first-commit, code-ninja, commit-century, commit-500, commit-1000 |
| **PRs Mergeadas** | GitHub API | first-pr, pr-champion |
| **Code Reviews** | GitHub API | first-review, review-guru |
| **Issues Cerradas** | GitHub API | bug-slayer |
| **Tiempo en Equipo** | `joinedAt` en user.json | week-one, month-one, quarter-one, half-year, year-one, veteran |
| **Deployments** | GitHub Deployments API | deploy-master |

### Reglas de Auto-Award

```javascript
// scripts/auto-award.js - Ejemplos de reglas

const AUTO_AWARD_RULES = [
  {
    badgeId: 'first-commit',
    description: 'Primer commit realizado',
    check: (metrics) => metrics.commits >= 1
  },
  {
    badgeId: 'code-ninja',
    description: '50+ commits limpios',
    check: (metrics) => metrics.commits >= 50
  },
  {
    badgeId: 'year-one',
    description: 'Un año en el equipo',
    check: (metrics, userData) => daysSinceJoined(userData) >= 365
  }
];
```

### Ejecución Manual

```bash
# Ejecutar verificación de auto-award
node scripts/auto-award.js

# Con token de GitHub (necesario para API calls)
GITHUB_TOKEN=ghp_xxx node scripts/auto-award.js
```

---

## Webhooks en Tiempo Real

### Descripción

El sistema de webhooks detecta eventos de GitHub en tiempo real y puede pre-evaluar medallas.

### Eventos Soportados

| Evento GitHub | Trigger | Medallas Potenciales |
|---------------|---------|---------------------|
| `pull_request.closed` + merged | PR mergeada | first-pr, pr-champion |
| `pull_request_review.submitted` | Review completada | first-review, review-guru |
| `issues.closed` | Issue cerrada | bug-slayer |
| `release.published` | Release publicado | deploy-master |
| `push` | Push a main | first-commit |

### Configuración del Workflow

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

### Script de Procesamiento

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

## CLI de Administración

### Comandos Disponibles

```bash
# Otorgar medalla
node scripts/badge-admin.js grant <usuario> <badge-id>

# Ejemplo
node scripts/badge-admin.js grant jeremy-sud architect

# Revocar medalla (solo admins)
node scripts/badge-admin.js revoke <usuario> <badge-id>

# Listar medallas de un usuario
node scripts/badge-admin.js list <usuario>

# Ver estadísticas globales
node scripts/stats.js
```

### Permisos Requeridos

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

### Salida del Script de Stats

```
┌────────────────────────────────────────────────────────────────────────┐
│                    🌸 BOOMFLOW - Panel de Estadísticas                 │
├────────────────────────────────────────────────────────────────────────┤
│  Colaboradores: 2                                                      │
│  Total Medallas Otorgadas: 16                                          │
│  Promedio por Usuario: 8.0                                             │
├────────────────────────────────────────────────────────────────────────┤
│  📊 Usuario        │ Medallas │ Última Actividad                       │
│  ─────────────────────────────────────────────────────────────────────│
│  @jeremy-sud       │    6     │ 2026-02-15 (tech-lead)                 │
│  @ursolcr          │   10     │ 2026-02-15 (sprint-hero)               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## GitHub Action

### Instalación

Agregar a `.github/workflows/boomflow.yml` en tu repositorio de perfil:

```yaml
name: BOOMFLOW Badge Sync

on:
  schedule:
    - cron: "0 0 * * *"  # Diario a medianoche
  workflow_dispatch:      # Trigger manual

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

| Input | Requerido | Default | Descripción |
|-------|-----------|---------|-------------|
| `boomflow_token` | ✅ | - | Personal access token con permisos `repo` |
| `github_username` | ❌ | `github.actor` | Usuario objetivo para sincronizar |
| `org_name` | ❌ | `SistemasUrsol` | Organización |

### Marcadores en README

El action busca y reemplaza el contenido entre estos marcadores:

```markdown
<!-- BOOMFLOW-BADGES-START -->
[Las medallas se insertan aquí automáticamente]
<!-- BOOMFLOW-BADGES-END -->
```

### Sincronización Manual

```bash
# Desde el repo BOOMFLOW
node scripts/sync-profile.js <username> <ruta-readme> [--view=modo]

# Ejemplo
node scripts/sync-profile.js jeremy-sud /home/user/jeremy-sud/README.md
```

---

## Sistema de Vistas Adaptativas

El script de sincronización detecta automáticamente la cantidad de medallas y ajusta la visualización para mantener los perfiles limpios y legibles.

### Modos de Vista

| Vista | Medallas | Descripción |
|-------|----------|-------------|
| **Normal** | 1-12 | Tabla completa con íconos 48px, nombres y tier |
| **Compact** | 13-30 | Íconos 32px en filas de 8, ordenados por tier |
| **Mini** | 31+ | Secciones colapsables `<details>` agrupadas por tier |

### Umbrales

```javascript
const THRESHOLD_COMPACT = 12;  // Más de 12 → vista compacta
const THRESHOLD_MINI = 30;     // Más de 30 → vista mini
```

### Vista Normal (1-12 medallas)

Muestra una tabla detallada ideal para pocos reconocimientos:

```markdown
| Medalla | Nombre | Tier |
|:-------:|--------|:----:|
| <img src="..." width="48"> | Code Ninja | 🥈 Silver |
```

### Vista Compacta (13-30 medallas)

Íconos más pequeños en filas horizontales, ordenados por tier (oro primero):

```markdown
### 🏅 Mis Medallas BOOMFLOW (25)

<img src="..." width="32" title="Gold Master"> <img src="..." width="32"> ...

**Resumen:** 🥇 3 Gold | 🥈 12 Silver | 🥉 10 Bronze
```

### Vista Mini (31+ medallas)

Secciones colapsables para perfiles con muchas medallas:

```markdown
### 🏅 Mis Medallas BOOMFLOW (45)

<details>
<summary>🥇 Gold (5 medallas)</summary>
<img src="..." width="28"> <img src="..." width="28"> ...
</details>

<details>
<summary>🥈 Silver (20 medallas)</summary>
...
</details>
```

### Forzar Vista Específica

Usa el flag `--view` para anular la detección automática:

```bash
# Forzar vista compacta
node scripts/sync-profile.js jeremy-sud README.md --view=compact

# Forzar vista mini (útil para testing)
node scripts/sync-profile.js jeremy-sud README.md --view=mini

# Forzar vista normal
node scripts/sync-profile.js jeremy-sud README.md --view=normal
```

---

## API Reference

### Endpoints (Backend en desarrollo)

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

#### Catálogo de Medallas

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
    "meta": "Nivel 2",
    "description": "Código limpio, rápido y eficiente.",
    "svg": "badge-code-ninja.svg"
  }
]
```

#### Medallas de Usuario

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

## Modelos de Datos

### Badge (Catálogo)

```typescript
interface Badge {
  id: string;           // Identificador único (kebab-case)
  emoji: string;        // Emoji de display
  label: string;        // Nombre legible
  category: Category;   // Categoría
  tier: Tier;           // bronze | silver | gold
  meta: string;         // Label del tier (Nivel 1, 2, 3)
  description: string;  // Descripción completa
  svg: string;          // Nombre del archivo SVG
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
  displayName: string;   // Nombre para mostrar
  role?: string;         // Rol en el equipo
  org: string;           // Organización
  joinedAt: string;      // ISO date de ingreso
  badges: UserBadge[];   // Medallas otorgadas
}

interface UserBadge {
  id: string;            // ID de la medalla
  awardedAt: string;     // ISO date de otorgamiento
  awardedBy: string;     // Username que otorgó o "system"
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

## Especificación SVG

### Dimensiones

| Elemento | Valor |
|----------|-------|
| Canvas | 128x128 px |
| Anillo exterior (tier) | 58px radio |
| Círculo interior (categoría) | 50px radio |
| Icono central | 40x40 px |

### Colores de Tier (Anillo)

```css
/* Bronze */
stroke: #CD7F32;

/* Silver */
stroke: #C0C0C0;

/* Gold */
stroke: #FFD700;
```

### Gradientes de Categoría

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

### Plantilla SVG Base

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

### Medallas no aparecen en el perfil

1. Verificar que los marcadores existan en el README:
   ```markdown
   <!-- BOOMFLOW-BADGES-START -->
   <!-- BOOMFLOW-BADGES-END -->
   ```

2. Verificar que el token tenga permisos `repo`

3. Ejecutar sync manual:
   ```bash
   node scripts/sync-profile.js <username> <readme-path>
   ```

### Auto-Award no otorga medallas

1. Verificar que el usuario esté registrado en `users/*.json`
2. Verificar que `GITHUB_TOKEN` esté configurado
3. Ejecutar manualmente para ver errores:
   ```bash
   GITHUB_TOKEN=ghp_xxx node scripts/auto-award.js
   ```

### Error de permisos al otorgar medallas

Solo usuarios en `config/admins.json` pueden otorgar medallas manualmente.

---

<p align="center">
  <strong>🌸 BOOMFLOW v2.1.0</strong><br/>
  <sub>Documentación Técnica — Sistemas Ursol</sub>
</p>
