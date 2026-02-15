<p align="center">
  <img src="https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets/badge-tech-lead.svg" width="120" height="120" alt="BOOMFLOW"/>
</p>

<h1 align="center">🌸 BOOMFLOW</h1>

<p align="center">
  <strong>Sistema de Reconocimiento Profesional de Sistemas Ursol</strong>
  <br/>
  <em>Donde el talento no se gestiona, se cultiva.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Uso_Exclusivo-Sistemas_Ursol-8B5CF6.svg" alt="Exclusivo"/>
  <img src="https://img.shields.io/badge/version-2.1.0-blue.svg" alt="Version"/>
  <img src="https://img.shields.io/badge/badges-89-gold.svg" alt="Badges"/>
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
└── 🌐 Web App (en desarrollo)
    └── app-web/               # Dashboard Next.js
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
| [CATALOGO.md](CATALOGO.md) | Significado de las 89 medallas | 👤 Todos |
| [DOCS.md](DOCS.md) | Referencia técnica completa | 👨‍💻 Desarrolladores |
| [ARQUITECTURA.md](ARQUITECTURA.md) | Diseño del sistema | 👨‍💻 Desarrolladores |

---

## 🔒 Administración

### Administradores Autorizados

Solo estos usuarios pueden otorgar medallas:

| Usuario | Rol | Permisos |
|---------|-----|----------|
| [@jeremy-sud](https://github.com/jeremy-sud) | Co-Fundador & Dev Lead | Todos |
| [@ursolcr](https://github.com/ursolcr) | Organización Principal | Todos |

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
