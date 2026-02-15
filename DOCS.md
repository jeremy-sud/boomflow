# 📚 Bloomflow — Documentación Completa

> Plataforma de reconocimiento profesional para [Sistemas Ursol](https://www.ursol.com)

---

## 🏗️ Arquitectura del Proyecto

```
BOOMFLOW/
├── app-web/          → Frontend (Next.js + React + TailwindCSS)
├── backend/          → API Server (Express + Node.js)
├── github-action/    → GitHub Action (Node.js)
├── assets/           → 26 medallas SVG
├── users/            → Datos de medallas por usuario
├── api-mock.json     → Catálogo maestro de medallas
├── README.md         → README con medallas inyectadas
├── DOCS.md           → Documentación técnica
└── ONBOARDING.md     → Guía de integración de nuevos miembros
```

---

## 🏅 Catálogo de Medallas (26 total)

### 🟢 Onboarding (4 medallas)

| Medalla         | Tier      | Descripción                   |
| --------------- | --------- | ----------------------------- |
| 👋 Hello World  | 🥉 Bronce | Primer día en el equipo       |
| ✅ First Commit | 🥉 Bronce | Primer commit al repositorio  |
| 🔀 First PR     | 🥉 Bronce | Primer Pull Request aprobado  |
| 🔍 First Review | 🥉 Bronce | Primera code review realizada |

### 🔵 Coding (6 medallas)

| Medalla            | Tier     | Descripción                                 |
| ------------------ | -------- | ------------------------------------------- |
| 🥷 Code Ninja      | 🥈 Plata | Código limpio, rápido y eficiente           |
| 🐛 Bug Hunter      | 🥈 Plata | Detecta bugs antes de producción            |
| ♻️ Refactor Master | 🥈 Plata | Mejora código legado sin romper nada        |
| 🧮 Algorithm Ace   | 🥇 Oro   | Algoritmos óptimos para problemas complejos |
| ✨ Clean Code      | 🥈 Plata | Código legible y mantenible                 |
| 🏗️ Full Stack      | 🥇 Oro   | Domina frontend y backend                   |

### 🟣 DevOps (4 medallas)

| Medalla           | Tier     | Descripción                          |
| ----------------- | -------- | ------------------------------------ |
| ⚡ Pipeline Pro   | 🥈 Plata | Pipelines CI/CD rápidos y confiables |
| 🐳 Docker Captain | 🥈 Plata | Containerización eficiente           |
| ☁️ Cloud Deployer | 🥇 Oro   | Despliegues sin downtime             |
| 🔄 CI/CD Master   | 🥇 Oro   | Automatización total del ciclo       |

### 🟡 Colaboración (5 medallas)

| Medalla            | Tier      | Descripción                        |
| ------------------ | --------- | ---------------------------------- |
| 🎓 Mentor          | 🥉 Bronce | Guía a compañeros nuevos           |
| 🏆 Mentor Master   | 🥇 Oro    | Ha guiado a 20+ colegas            |
| 🤝 Team Spirit     | 🥈 Plata  | Mantiene la moral del equipo       |
| 👁️ Code Reviewer   | 🥈 Plata  | Reviews detallados y constructivos |
| 👥 Pair Programmer | 🥈 Plata  | Programación en pareja efectiva    |

### 🔴 Liderazgo (4 medallas)

| Medalla           | Tier     | Descripción                        |
| ----------------- | -------- | ---------------------------------- |
| 🔥 Crisis Averted | 🥇 Oro   | Salvó el deploy en momento crítico |
| 🚀 Sprint Hero    | 🥈 Plata | Entrega excepcional en sprint      |
| 🏛️ Architect      | 🥇 Oro   | Arquitectura sólida y escalable    |
| 👑 Tech Lead      | 🥇 Oro   | Lidera decisiones técnicas         |

### ⚪ Documentación (3 medallas)

| Medalla         | Tier      | Descripción                            |
| --------------- | --------- | -------------------------------------- |
| 📖 Docs Hero    | 🥉 Bronce | Documentación clara para el equipo     |
| 🔌 API Designer | 🥈 Plata  | APIs bien diseñadas y documentadas     |
| 🌐 Open Source  | 🥈 Plata  | Contribuciones a proyectos open source |

---

## 🔌 API Endpoints

| Método | Endpoint                | Auth | Descripción                      |
| ------ | ----------------------- | ---- | -------------------------------- |
| `GET`  | `/api/health`           | ❌   | Health check del servidor        |
| `GET`  | `/api/badges/catalog`   | ❌   | Catálogo completo de medallas    |
| `GET`  | `/api/user/badges`      | ✅   | Medallas del usuario autenticado |
| `GET`  | `/auth/github`          | ❌   | Inicio de flujo OAuth            |
| `GET`  | `/auth/github/callback` | ❌   | Callback de OAuth                |
| `GET`  | `/assets/:file`         | ❌   | Servir archivos SVG              |

### Ejemplo: Catálogo de medallas

```bash
curl http://localhost:3001/api/badges/catalog
```

Respuesta:

```json
{
  "org": "SistemasUrsol",
  "totalBadges": 26,
  "categories": { ... },
  "badges": [ ... ]
}
```

---

## 🚀 GitHub Action — Integración con Perfiles

### Instalación Rápida

1. **Agrega los marcadores** en tu `README.md` de perfil de GitHub:

```markdown
<!-- BLOOMFLOW-BADGES-START -->
<!-- BLOOMFLOW-BADGES-END -->
```

2. **Crea un workflow** en `.github/workflows/bloomflow.yml`:

```yaml
name: Bloomflow Badge Sync
on:
  schedule:
    - cron: "0 0 * * *" # Diario
  workflow_dispatch:

jobs:
  sync-badges:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jeremy-sud/boomflow@main
        with:
          bloomflow_token: ${{ secrets.BLOOMFLOW_TOKEN }}
          github_username: ${{ github.actor }}
          org_name: SistemasUrsol
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "🌸 Update Bloomflow badges"
```

3. **Agrega tu token** en Settings → Secrets → `BLOOMFLOW_TOKEN`

### Compatibilidad con Perfiles GitHub

Las medallas se renderizan como **tablas HTML con imágenes SVG**, lo que garantiza:

- ✅ Renderizado correcto en perfiles de GitHub
- ✅ SVGs se muestran como imágenes (usando `<img>` tags)
- ✅ Layout responsivo en diferentes tamaños de pantalla
- ✅ Sin dependencias externas (todos los SVGs son del mismo repo)
- ✅ Compatible con GitHub Dark Mode y Light Mode

---

## 🛠️ Desarrollo Local

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configurar variables
npm start             # → http://localhost:3001
```

### Frontend

```bash
cd app-web
npm install
npm run dev           # → http://localhost:3000
```

### GitHub Action (test local)

```bash
cd github-action
npm install
node index.js         # Actualiza README.md
```

---

## 🔐 Variables de Entorno

| Variable               | Descripción                   | Default         |
| ---------------------- | ----------------------------- | --------------- |
| `PORT`                 | Puerto del API server         | `3001`          |
| `REQUIRED_ORG`         | Organización GitHub requerida | `SistemasUrsol` |
| `GITHUB_CLIENT_ID`     | Client ID de OAuth            | —               |
| `GITHUB_CLIENT_SECRET` | Client Secret de OAuth        | —               |

---

> 🌸 Bloomflow — Verificado por [Sistemas Ursol](https://www.ursol.com) — ¡Su Puerto Seguro en Informática!
