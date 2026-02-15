<p align="center">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/logo-boomflow.svg" width="120" height="120" alt="BOOMFLOW"/>
</p>

<h1 align="center">🌸 BOOMFLOW</h1>

<p align="center">
  <strong>Sistema de Reconocimiento Profesional de Sistemas Ursol</strong>
  <br/>
  <em>Donde el talento no se gestiona, se cultiva.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Uso_Exclusivo-Sistemas_Ursol-8B5CF6.svg" alt="Exclusivo"/>
  <img src="https://img.shields.io/badge/version-3.0.0-blue.svg" alt="Version"/>
  <img src="https://img.shields.io/badge/badges-97-gold.svg" alt="Badges"/>
  <img src="https://img.shields.io/badge/Next.js-16-black.svg" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Prisma-7-2D3748.svg" alt="Prisma"/>
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"/>
</p>

---

## 📖 Tabla de Contenidos

- [¿Qué es BOOMFLOW?](#-qué-es-boomflow)
- [Inicio Rápido](#-inicio-rápido)
- [Sistema de Medallas](#-sistema-de-medallas)
- [Arquitectura](#️-arquitectura)
- [Documentación](#-documentación)
- [Administración](#-administración)

---

## ⚠️ Aviso Importante

> **BOOMFLOW es de uso exclusivo de [Sistemas Ursol](https://www.ursol.com).**
> 
> El código es público bajo MIT, pero las medallas **solo pueden ser otorgadas a colaboradores oficiales de Sistemas Ursol**.

---

## 🎯 ¿Qué es BOOMFLOW?

BOOMFLOW transforma el reconocimiento profesional en **activos verificables** que se muestran en tu perfil de GitHub.

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│   Tu actividad en GitHub  ──►  BOOMFLOW analiza  ──►  🏅 Medallas │
│                                                                    │
│   • Commits                    • Automáticamente                   │
│   • Pull Requests              • Diariamente a las 6AM             │
│   • Code Reviews               • Sin intervención manual           │
│   • Tiempo en equipo                                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### ¿Por qué BOOMFLOW?

| Problema | Solución BOOMFLOW |
|----------|-------------------|
| Los CVs no muestran soft skills | ✅ Medallas verificables de colaboración, mentoría, liderazgo |
| El reconocimiento se pierde en chats | ✅ Historial permanente y público en tu GitHub |
| No hay forma de validar logros | ✅ Cada medalla tiene fecha, otorgante y trazabilidad |
| El auto-reconocimiento no es válido | ✅ Solo administradores autorizados pueden otorgar |

---

## 🚀 Inicio Rápido

### Para Colaboradores de Ursol (3 pasos)

**Paso 1:** Solicita tu registro en BOOMFLOW a tu líder de equipo.

**Paso 2:** Agrega estos marcadores a tu `README.md` de perfil:

```markdown
<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->
```

**Paso 3:** Las medallas se sincronizan automáticamente. ¡Listo!

> 📖 Guía completa: [ONBOARDING.md](ONBOARDING.md)

---

## 🏅 Sistema de Medallas

### 89 Medallas en 9 Categorías

| Categoría | Qty | Descripción | Ejemplo |
|-----------|-----|-------------|---------|
| 🟢 **Onboarding** | 10 | Integración al equipo | Hello World, First Commit |
| 🔵 **Coding** | 21 | Excelencia técnica | Code Ninja, Bug Slayer |
| 🟣 **DevOps** | 10 | CI/CD y operaciones | K8s Knight, Deploy Master |
| 🩷 **Collaboration** | 16 | Trabajo en equipo | Hackathon Hero, Bridge Builder |
| 🟡 **Leadership** | 10 | Liderazgo técnico | Tech Lead, Architect |
| 📚 **Documentation** | 7 | Conocimiento compartido | Docs Hero, Wiki Warrior |
| 🌱 **Growth** | 5 | Crecimiento profesional | Fast Learner, Conference Speaker |
| ❤️ **Milestones** | 9 | Logros acumulativos | Kudo Legend, Streak Master |
| ⭐ **Special** | 1 | Reconocimientos únicos | Founder |

### Sistema de Niveles

| Nivel | Icono | Significado |
|-------|-------|-------------|
| **Bronce** | 🥉 | Logro inicial alcanzado |
| **Plata** | 🥈 | Competencia demostrada |
| **Oro** | 🥇 | Maestría y excelencia |

### Medallas Automáticas vs Manuales

```
AUTOMÁTICAS (verificadas por GitHub)          MANUALES (otorgadas por admins)
───────────────────────────────────           ──────────────────────────────
✓ first-commit    - 1+ commits               ✓ tech-lead    - Liderazgo técnico
✓ first-pr        - 1+ PR mergeada           ✓ architect    - Diseño de sistemas
✓ code-ninja      - 50+ commits              ✓ mentor       - Guía a compañeros
✓ week-one        - 7 días en equipo         ✓ innovator    - Ideas transformadoras
✓ month-one       - 30 días en equipo        ✓ crisis-averted - Salvó producción
✓ year-one        - 365 días en equipo       ✓ visionary    - Visión estratégica
```

> 📖 Catálogo completo con significados: [CATALOGO.md](CATALOGO.md)

---

## 🏗️ Arquitectura

```
BOOMFLOW/
├── 📦 Datos
│   ├── api-mock.json          # Catálogo de 89 medallas
│   ├── users/                 # Datos de colaboradores
│   │   ├── jeremy-sud.json
│   │   └── ursolcr.json
│   └── config/
│       └── admins.json        # Administradores autorizados
│
├── 🤖 Automatización
│   ├── scripts/
│   │   ├── auto-award.js      # Verificación diaria de métricas
│   │   ├── process-event.js   # Procesador de webhooks en tiempo real
│   │   ├── badge-admin.js     # CLI para administradores
│   │   ├── sync-profile.js    # Sincroniza medallas a perfil
│   │   └── stats.js           # Panel de estadísticas
│   │
│   └── .github/workflows/
│       ├── auto-award.yml     # Cron diario 6:00 AM UTC
│       ├── event-processor.yml # Webhooks (PR, review, issue, release)
│       └── badge-protection.yml # Valida permisos en cada push
│
├── 🎨 Assets
│   └── assets/                # 89 SVGs de medallas
│
├── 🔗 GitHub Action
│   └── github-action/         # Action para sincronizar perfiles
│
└── 🌐 Dashboard Web (MVP Completo)
    └── app-web/               # Next.js 16 + Prisma + NextAuth
        ├── src/app/           # Páginas: Dashboard, Perfil, Catálogo, Feed, Leaderboard
        ├── src/lib/           # Badge Engine, Prisma Client
        ├── src/components/    # UI Components
        └── prisma/            # Schema y Seeds
```

### Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FLUJO BOOMFLOW                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   TRIGGERS                    PROCESO                    RESULTADO      │
│   ────────                    ───────                    ─────────      │
│                                                                         │
│   ⏰ Cron 6AM UTC ──────►  auto-award.js  ──────►  Medallas automáticas │
│                            │ Verifica métricas                          │
│                            │ de GitHub API                              │
│                                                                         │
│   🔔 Webhook PR/Review ──► process-event.js ──►  Detección en tiempo   │
│                            │ real de logros                             │
│                                                                         │
│   👤 Admin CLI ──────────► badge-admin.js ────►  Medallas manuales     │
│                                                                         │
│                                     │                                   │
│                                     ▼                                   │
│                            users/*.json actualizado                     │
│                                     │                                   │
│                                     ▼                                   │
│                            sync-profile.js ────►  README.md actualizado │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

> 📖 Arquitectura detallada: [ARQUITECTURA.md](ARQUITECTURA.md)

---

## 📚 Documentación

| Documento | Descripción | Audiencia |
|-----------|-------------|-----------|
| [ONBOARDING.md](ONBOARDING.md) | Guía para nuevos colaboradores | 👤 Nuevos miembros |
| [GUIA_TOKEN.md](GUIA_TOKEN.md) | Configuración de tokens | 👤 Colaboradores |
| [CATALOGO.md](CATALOGO.md) | Significado de las 97 medallas | 👤 Todos |
| [ECONOMY.md](ECONOMY.md) | Economía: medallas sociales y de inversión | 👤 Todos |
| [SKINS.md](SKINS.md) | Personalización visual de medallas | 🎨 Todos |
| [DOCS.md](DOCS.md) | Referencia técnica completa | 👨‍💻 Desarrolladores |
| [ARQUITECTURA.md](ARQUITECTURA.md) | Diseño del sistema | 👨‍💻 Desarrolladores |

---

## 🌐 Dashboard Web (v3.0)

BOOMFLOW incluye un **Dashboard Web completo** con:

### Stack Tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.1.6 | Framework React con App Router |
| Prisma | 7.4.0 | ORM y migraciones de BD |
| PostgreSQL | 15+ | Base de datos |
| NextAuth | 5 (beta) | Autenticación GitHub OAuth |
| Tailwind CSS | 4 | Estilos con glassmorphism |
| Octokit | Latest | Integración GitHub API |

### Páginas Incluidas

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard principal con stats y actividad |
| `/profile` | Perfil del usuario con badges |
| `/catalog` | Catálogo completo de 97 badges |
| `/feed` | Feed de kudos y formulario |
| `/leaderboard` | Rankings por badges/kudos |
| `/login` | Autenticación con GitHub |

### APIs REST

```
GET/POST  /api/kudos              # Feed y crear kudos
GET       /api/kudos/user/:user   # Kudos de usuario
GET       /api/kudos/categories   # Categorías de kudos
GET       /api/badges             # Catálogo de badges
GET       /api/badges/user/:user  # Badges de usuario
POST/DEL  /api/badges/award       # Otorgar/revocar badge
GET       /api/badges/progress    # Progreso hacia badges
POST      /api/badges/evaluate    # Evaluar badges automáticos
GET       /api/leaderboard        # Rankings
GET/PATCH /api/notifications      # Sistema de notificaciones
GET/POST  /api/github/sync        # Sincronización con GitHub
```

### 🔔 Sistema de Notificaciones (NUEVO)

- **Toast con confetti** cuando ganas un badge
- **NotificationBell** en sidebar con contador de no leídas
- **Tipos**: `KUDO_RECEIVED`, `BADGE_EARNED`, `BADGE_PROGRESS`, `MENTION`, `SYSTEM`
- **Auto-refresh** cada 30 segundos

### 🔗 GitHub Sync (NUEVO)

Sincroniza automáticamente tu actividad de GitHub:
- Commits, PRs, Reviews, Issues
- Evalúa badges basados en tu actividad real
- Sincronización bajo demanda vía API

### Badge Engine

Sistema de **otorgamiento automático** de badges basado en triggers:

| Trigger | Descripción | Ejemplo |
|---------|-------------|--------|
| `KUDOS_RECEIVED` | Recibir X kudos | Team Spirit (50 kudos) |
| `KUDOS_SENT` | Enviar X kudos | Feedback Friend (20 kudos) |
| `CODE_REVIEWS` | Hacer X reviews | Code Reviewer (100 reviews) |
| `PULL_REQUESTS` | Crear X PRs | First PR (1 PR) |
| `STREAK_DAYS` | X días activo | 1 Year (365 días) |
| `GITHUB_COMMIT` | Commits de GitHub | First Commit (1), Code Ninja (50) |
| `GITHUB_PR` | PRs de GitHub | First PR (1) |
| `GITHUB_REVIEW` | Reviews de GitHub | Code Reviewer (10) |

### Instalación del Dashboard

```bash
cd app-web
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar: DATABASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, AUTH_SECRET

# Inicializar BD
npm run db:push
npm run db:seed

# Desarrollo
npm run dev
```

---

## 🔒 Administración

### Administradores Autorizados

Solo estos usuarios pueden otorgar medallas:

| Usuario | Rol | Permisos |
|---------|-----|----------|
| [@jeremy-sud](https://github.com/jeremy-sud) | Co-Fundador & Dev Lead | Todos |
| [@ursolcr](https://github.com/ursolcr) | Fundador | Todos |

### Sistema de Protección

```
┌──────────────────────────────────────────────────────────────────┐
│                    CAPAS DE PROTECCIÓN                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   1. CODEOWNERS ────────► Requiere aprobación de admin          │
│                                                                  │
│   2. badge-protection.yml ► Valida que cambios a users/         │
│                             solo vengan de administradores       │
│                                                                  │
│   3. config/admins.json ──► Lista oficial de administradores    │
│                                                                  │
│   4. Trazabilidad ────────► Cada medalla registra:              │
│                             • awardedAt: fecha                   │
│                             • awardedBy: quién otorgó            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Comandos de Administración

```bash
# Otorgar medalla
node scripts/badge-admin.js grant <usuario> <badge-id>

# Revocar medalla
node scripts/badge-admin.js revoke <usuario> <badge-id>

# Ver estadísticas
node scripts/stats.js

# Sincronizar perfil manualmente
node scripts/sync-profile.js <usuario> <ruta-readme>

# Ejecutar auto-award manual
node scripts/auto-award.js
```

---

## 🏢 Sobre Sistemas Ursol

**Sistemas Ursol** cree que el reconocimiento profesional debe ser:
- ✨ **Verificable** — No solo palabras, datos comprobables
- 📈 **Permanente** — Parte de tu portafolio profesional
- 🤝 **Justo** — Otorgado por pares, no auto-asignado
- 🎯 **Significativo** — Representa logros reales

### Contacto

- 🌐 [www.ursol.com](https://www.ursol.com)
- 💼 [Vacantes](https://www.ursol.com/careers)

---

## 📋 Licencia

MIT — Código público para transparencia y referencia educativa.

**El uso del sistema de reconocimiento está reservado para Sistemas Ursol.**

---

<p align="center">
  <strong>🌸 BOOMFLOW</strong><br/>
  <sub>Reconociendo el talento, una medalla a la vez.</sub>
</p>
