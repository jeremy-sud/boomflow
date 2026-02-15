# 🗺️ BOOMFLOW Roadmap

> De MVP a Plataforma Enterprise de Reconocimiento Profesional

---

## 📋 Tabla de Contenidos

- [Visión del Producto](#visión-del-producto)
- [Arquitectura](#arquitectura)
- [Fases de Desarrollo](#fases-de-desarrollo)
- [Modelo de Datos](#modelo-de-datos)
- [API Design](#api-design)
- [Integraciones](#integraciones)
- [Monetización](#monetización)
- [Timeline](#timeline)

---

## 🎯 Visión del Producto

### El Problema
- **70% de empleados** se sienten infravalorados en su trabajo
- El trabajo "soft" (mentoría, colaboración, resolución de crisis) es **invisible** en CVs
- Los sistemas de evaluación tradicionales son **anuales y subjetivos**
- No hay forma de **verificar** habilidades blandas

### La Solución
BOOMFLOW transforma el reconocimiento entre pares en **activos profesionales verificables**:

```
Kudos (reconocimientos) → Acumulación → Badges (medallas) → GitHub Profile
```

### Propuesta de Valor

| Para Empleados | Para Empresas | Para RRHH |
|----------------|---------------|-----------|
| Portfolio de soft skills verificado | Cultura de reconocimiento | Data de engagement en tiempo real |
| Motivación y gamificación | Retención de talento | Identificar top performers |
| CV diferenciado | Employer branding | Predicción de rotación |

---

## 🏗️ Arquitectura

### Arquitectura Actual (v1.0)

```
┌─────────────────────────────────────────────────────────────┐
│                    BOOMFLOW v1.0 (Actual)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐     ┌──────────────┐                     │
│  │  JSON Files  │────▶│GitHub Action │────▶ GitHub Profile │
│  │  (users/)    │     │  (sync)      │                     │
│  └──────────────┘     └──────────────┘                     │
│                                                             │
│  ┌──────────────┐     ┌──────────────┐                     │
│  │  SVG Assets  │     │  Express API │ (básico)            │
│  │  (26 badges) │     │  (backend/)  │                     │
│  └──────────────┘     └──────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Arquitectura Target (v2.0)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BOOMFLOW v2.0 Platform                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   Web App   │    │  Slack Bot  │    │ Discord Bot │                 │
│  │  (Next.js)  │    │             │    │             │                 │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                 │
│         │                  │                  │                         │
│         └──────────────────┼──────────────────┘                         │
│                            ▼                                            │
│                   ┌─────────────────┐                                   │
│                   │    API Layer    │                                   │
│                   │  (tRPC/GraphQL) │                                   │
│                   └────────┬────────┘                                   │
│                            │                                            │
│         ┌──────────────────┼──────────────────┐                         │
│         ▼                  ▼                  ▼                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   Kudos     │    │   Badges    │    │   Users     │                 │
│  │   Service   │    │   Engine    │    │   Service   │                 │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                 │
│         │                  │                  │                         │
│         └──────────────────┼──────────────────┘                         │
│                            ▼                                            │
│                   ┌─────────────────┐                                   │
│                   │   PostgreSQL    │                                   │
│                   │   + Prisma ORM  │                                   │
│                   └─────────────────┘                                   │
│                            │                                            │
│         ┌──────────────────┼──────────────────┐                         │
│         ▼                  ▼                  ▼                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   Redis     │    │   BullMQ    │    │  Analytics  │                 │
│  │   (cache)   │    │   (queues)  │    │  (PostHog)  │                 │
│  └─────────────┘    └─────────────┘    └─────────────┘                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 📅 Fases de Desarrollo

### Fase 1: Core Platform (MVP) — 4-6 semanas

**Objetivo:** Sistema funcional de kudos → badges → GitHub sync

#### 1.1 Base de Datos
- [ ] Setup PostgreSQL + Prisma
- [ ] Schema: users, organizations, teams, kudos, badges, user_badges
- [ ] Migraciones y seeds

#### 1.2 API de Kudos
- [ ] `POST /api/kudos` — Enviar un kudo
- [ ] `GET /api/kudos/received` — Kudos recibidos
- [ ] `GET /api/kudos/given` — Kudos enviados
- [ ] `GET /api/kudos/feed` — Feed de la organización

#### 1.3 Badge Engine
- [ ] Triggers automáticos (X kudos → badge)
- [ ] Validación de reglas de badges
- [ ] Notificaciones de nuevo badge

#### 1.4 Autenticación
- [ ] OAuth con GitHub
- [ ] Sesiones con NextAuth.js
- [ ] Roles básicos (admin, member)

#### 1.5 Dashboard Web
- [ ] Página de perfil con badges
- [ ] Formulario para enviar kudos
- [ ] Feed de actividad
- [ ] Configuración de cuenta

### Fase 2: Organizacional — 4 semanas

**Objetivo:** Multi-tenancy y features de equipo

#### 2.1 Organizations & Teams
- [ ] CRUD de organizaciones
- [ ] Invitaciones por email/link
- [ ] Equipos dentro de organización
- [ ] Badges privados por organización

#### 2.2 Admin Dashboard
- [ ] Gestión de miembros
- [ ] Crear badges personalizados
- [ ] Configurar reglas de acumulación
- [ ] Reportes básicos

#### 2.3 Leaderboards
- [ ] Rankings por equipo
- [ ] Rankings por categoría de badge
- [ ] Histórico mensual/trimestral

### Fase 3: Integraciones — 3 semanas

**Objetivo:** Kudos desde donde trabaja el equipo

#### 3.1 Slack Integration
- [ ] App de Slack
- [ ] Comando `/kudo @user mensaje`
- [ ] Notificaciones en canal
- [ ] Bot para badges nuevos

#### 3.2 Discord Integration (Opcional)
- [ ] Bot de Discord
- [ ] Comando similar a Slack

#### 3.3 GitHub Integration Mejorada ✅
- [x] Webhook: PR merged → badge "First PR"
- [x] Webhook: Issue closed → badges
- [x] Webhook: Code Review → badges
- [x] Webhook: Release published → badges
- [x] Auto-detect contributions via API

> **✅ IMPLEMENTADO** - Ver `.github/workflows/event-processor.yml` y `scripts/process-event.js`

### Fase 4: Analytics & AI — 4 semanas

**Objetivo:** Insights para RRHH

#### 4.1 Dashboard Analytics
- [ ] Engagement score por equipo
- [ ] Tendencias de reconocimiento
- [ ] Mapas de colaboración
- [ ] Alertas de bajo engagement

#### 4.2 AI Features
- [ ] Análisis de sentimiento en kudos
- [ ] Sugerencias de kudos ("Hace tiempo que no reconoces a X")
- [ ] Predicción de rotación (bajo engagement = riesgo)

#### 4.3 Exportación
- [ ] Reportes PDF/Excel
- [ ] Integración con HRIS (BambooHR, Workday)

### Fase 5: Enterprise — Ongoing

**Objetivo:** Features para grandes empresas

- [ ] SSO/SAML
- [ ] API dedicada con rate limits
- [ ] SLA y soporte premium
- [ ] On-premise deployment option
- [ ] Auditoría y compliance

---

## 📊 Modelo de Datos

### Schema Principal

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  displayName   String?
  avatarUrl     String?
  githubId      String?   @unique
  role          Role      @default(MEMBER)
  
  // Relations
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  teamId         String?
  team           Team?     @relation(fields: [teamId], references: [id])
  
  kudosGiven     Kudo[]    @relation("KudosGiven")
  kudosReceived  Kudo[]    @relation("KudosReceived")
  badges         UserBadge[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  logoUrl     String?
  plan        Plan     @default(FREE)
  
  users       User[]
  teams       Team[]
  badges      Badge[]  // Custom badges
  
  createdAt   DateTime @default(now())
}

model Team {
  id             String       @id @default(cuid())
  name           String
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  members        User[]
  
  createdAt      DateTime     @default(now())
}

model Kudo {
  id          String   @id @default(cuid())
  message     String
  category    Category
  isPublic    Boolean  @default(true)
  
  giverId     String
  giver       User     @relation("KudosGiven", fields: [giverId], references: [id])
  receiverId  String
  receiver    User     @relation("KudosReceived", fields: [receiverId], references: [id])
  
  createdAt   DateTime @default(now())
}

model Badge {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String
  category    Category
  tier        Tier
  svgUrl      String
  
  // Trigger rules
  triggerType    TriggerType
  triggerCount   Int         @default(1)  // e.g., 5 kudos needed
  triggerCategory Category?  // optional: only count kudos of this category
  
  // Custom badge for org
  organizationId String?
  organization   Organization? @relation(fields: [organizationId], references: [id])
  isGlobal       Boolean      @default(true)
  
  userBadges     UserBadge[]
  
  createdAt      DateTime     @default(now())
}

model UserBadge {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  badgeId   String
  badge     Badge    @relation(fields: [badgeId], references: [id])
  
  awardedAt DateTime @default(now())
  awardedBy String?  // user id or "system"
  
  @@unique([userId, badgeId])
}

// Enums
enum Role {
  ADMIN
  MANAGER
  MEMBER
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}

enum Category {
  ONBOARDING
  CODING
  DEVOPS
  COLLABORATION
  LEADERSHIP
  DOCUMENTATION
}

enum Tier {
  BRONZE
  SILVER
  GOLD
}

enum TriggerType {
  KUDO_COUNT      // Accumulate X kudos
  KUDO_CATEGORY   // Accumulate X kudos in category
  MANUAL          // Awarded manually by admin
  SYSTEM          // Auto-awarded (first commit, etc.)
}
```

---

## 🔌 API Design

### Endpoints Principales

#### Kudos

```
POST   /api/kudos                 # Enviar kudo
GET    /api/kudos/feed            # Feed de la org
GET    /api/kudos/received        # Mis kudos recibidos
GET    /api/kudos/given           # Kudos que he dado
GET    /api/kudos/stats           # Estadísticas
```

#### Badges

```
GET    /api/badges/catalog        # Catálogo completo
GET    /api/badges/my             # Mis badges
GET    /api/badges/:id            # Detalle de badge
POST   /api/badges                # Crear badge (admin)
```

#### Users

```
GET    /api/users/me              # Mi perfil
GET    /api/users/:username       # Perfil público
PATCH  /api/users/me              # Actualizar perfil
GET    /api/users/leaderboard     # Rankings
```

#### Organizations

```
POST   /api/orgs                  # Crear organización
GET    /api/orgs/:slug            # Detalle
POST   /api/orgs/:slug/invite     # Invitar miembro
GET    /api/orgs/:slug/members    # Listar miembros
```

### Ejemplo: Enviar Kudo

```typescript
// POST /api/kudos
{
  "receiverUsername": "maria",
  "message": "Excelente trabajo en el refactor del módulo de auth!",
  "category": "CODING",
  "isPublic": true
}

// Response 201
{
  "id": "clx1234...",
  "giver": { "username": "jeremy-sud", "displayName": "Jeremy Alva" },
  "receiver": { "username": "maria", "displayName": "María García" },
  "message": "Excelente trabajo en el refactor del módulo de auth!",
  "category": "CODING",
  "createdAt": "2026-02-15T10:30:00Z",
  "badgeUnlocked": {
    "slug": "code-ninja",
    "name": "Code Ninja",
    "message": "¡María desbloqueó el badge Code Ninja!"
  }
}
```

---

## 🔗 Integraciones

### Slack App

```
/kudo @maria Gracias por ayudarme con el bug de producción! #collaboration
```

### GitHub Webhooks

| Evento | Acción |
|--------|--------|
| `pull_request.merged` | +1 punto coding, check badge "First PR" |
| `pull_request_review.submitted` | +1 punto collaboration |
| `issues.closed` | +1 punto si assignee |

### Zapier/Make

Triggers disponibles:
- Nuevo kudo recibido
- Nuevo badge desbloqueado
- Milestone alcanzado

---

## 💰 Monetización

### Planes

| Feature | Free | Pro ($5/user/mo) | Enterprise |
|---------|------|------------------|------------|
| Usuarios | 10 | 100 | Ilimitado |
| Kudos/mes | 50 | Ilimitado | Ilimitado |
| Badges globales | ✅ | ✅ | ✅ |
| Badges custom | ❌ | ✅ | ✅ |
| GitHub Sync | ✅ | ✅ | ✅ |
| Slack/Discord | ❌ | ✅ | ✅ |
| Analytics | Básico | Avanzado | Premium |
| SSO/SAML | ❌ | ❌ | ✅ |
| API dedicada | ❌ | ❌ | ✅ |
| Soporte | Community | Email | Dedicado |

---

## 📅 Timeline Estimado

```
2026 Q1 (Feb-Mar)
├── Semana 1-2: Database + Auth
├── Semana 3-4: API Kudos + Badge Engine
├── Semana 5-6: Dashboard Web MVP
└── Semana 7-8: Testing + Polish

2026 Q2 (Abr-Jun)
├── Mes 1: Organizations + Teams
├── Mes 2: Slack Integration
└── Mes 3: Analytics Dashboard

2026 Q3 (Jul-Sep)
├── AI Features
├── Enterprise Features
└── Public Launch
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TailwindCSS, shadcn/ui |
| Backend | Node.js 20, tRPC |
| Database | PostgreSQL, Prisma ORM |
| Auth | NextAuth.js |
| Queue | BullMQ + Redis |
| Hosting | Vercel (frontend), Railway (backend) |
| Analytics | PostHog |
| AI | OpenAI API |

---

## 📁 Estructura de Proyecto Target

```
BOOMFLOW/
├── apps/
│   ├── web/                 # Next.js app
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── api/                 # Backend API (si se separa)
├── packages/
│   ├── database/            # Prisma schema + client
│   ├── ui/                  # Shared components
│   └── config/              # Shared config
├── services/
│   ├── badge-engine/        # Badge logic
│   └── notifications/       # Email, Slack, etc.
├── github-action/           # (existente)
├── assets/                  # (existente) SVG badges
├── docs/
│   ├── ROADMAP.md          # Este archivo
│   └── API.md              # API documentation
└── docker-compose.yml       # Local dev
```

---

<p align="center">
  <sub>Last updated: February 2026</sub>
  <br/>
  <sub>Maintained by <a href="https://github.com/jeremy-sud">@jeremy-sud</a></sub>
</p>
