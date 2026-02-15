# 🚀 Guía de Onboarding — BOOMFLOW

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Documento_Interno-Sistemas_Ursol-8B5CF6.svg" alt="Interno"/>
</p>

> **Guía oficial para integrar nuevos colaboradores al sistema de reconocimiento BOOMFLOW de Sistemas Ursol**

---

## ⚠️ Acceso Restringido

Este documento está destinado a:
- 👤 Líderes de equipo de Sistemas Ursol
- 👤 Personal de Recursos Humanos
- 👤 Administradores del sistema BOOMFLOW

Solo colaboradores oficiales de Sistemas Ursol pueden ser agregados al sistema.

---

## 📋 Resumen del Proceso

Agregar un nuevo miembro al ecosistema Bloomflow toma **menos de 5 minutos** y requiere solo **2 pasos**:

1. Crear el archivo de datos del usuario
2. Agregar los marcadores en su README de perfil de GitHub

---

## Paso 1: Crear el archivo de usuario

Cada miembro tiene un archivo JSON en la carpeta `/users/` del repositorio [boomflow](https://github.com/jeremy-sud/boomflow).

### Formato del archivo

Crear `users/{github_username}.json`:

```json
{
  "username": "nuevo-usuario",
  "displayName": "Nombre Completo",
  "role": "Desarrollador Frontend",
  "org": "SistemasUrsol",
  "joinedAt": "2026-02-15",
  "badges": [
    {
      "id": "hello-world",
      "awardedAt": "2026-02-15",
      "awardedBy": "system"
    }
  ]
}
```

### Campos requeridos

| Campo         | Descripción                   | Ejemplo                           |
| ------------- | ----------------------------- | --------------------------------- |
| `username`    | Nombre de usuario de GitHub   | `"ursolcr"`                       |
| `displayName` | Nombre para mostrar           | `"Eduardo Ureña"`                 |
| `role`        | Rol en el equipo              | `"Co-Fundador & Gerente General"` |
| `org`         | Organización                  | `"SistemasUrsol"`                 |
| `joinedAt`    | Fecha de ingreso (YYYY-MM-DD) | `"2024-01-15"`                    |
| `badges`      | Array de medallas otorgadas   | Ver abajo                         |

### Campos de cada medalla

| Campo       | Descripción                     | Ejemplo                     |
| ----------- | ------------------------------- | --------------------------- |
| `id`        | ID de la medalla (del catálogo) | `"code-ninja"`              |
| `awardedAt` | Fecha de otorgamiento           | `"2024-05-20"`              |
| `awardedBy` | Quién otorgó la medalla         | `"jeremy-sud"` o `"system"` |

---

## Paso 2: Agregar marcadores al README del perfil

El usuario nuevo debe agregar estos marcadores en su `README.md` de perfil de GitHub:

```
<!-- BLOOMFLOW-BADGES-START -->
<!-- BLOOMFLOW-BADGES-END -->
```

> **¿Cómo editar mi perfil README?** Crea un repositorio con el mismo nombre que tu usuario de GitHub (ej: `ursolcr/ursolcr`) y agrega un `README.md`.

---

## Paso 3 (Opcional): Configurar sincronización automática

Agregar este workflow en el repo del perfil en `.github/workflows/bloomflow.yml`:

```yaml
name: Bloomflow Badge Sync
on:
  schedule:
    - cron: "0 0 * * *" # Diario a medianoche
  workflow_dispatch: # Permite ejecución manual

jobs:
  sync-badges:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: jeremy-sud/boomflow@main
        with:
          bloomflow_token: ${{ secrets.BLOOMFLOW_TOKEN }}
          github_username: ${{ github.actor }}
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "🌸 Update Bloomflow badges"
```

---

## 📦 IDs de Medallas Disponibles

### 🟢 Onboarding

`hello-world` · `first-commit` · `first-pr` · `first-review`

### 🔵 Coding

`code-ninja` · `bug-hunter` · `refactor-master` · `algorithm-ace` · `clean-code` · `full-stack`

### 🟣 DevOps

`pipeline-pro` · `docker-captain` · `cloud-deployer` · `cicd-master`

### 🟡 Colaboración

`mentor` · `mentor-master` · `team-spirit` · `code-reviewer` · `pair-programmer`

### 🔴 Liderazgo

`crisis-averted` · `sprint-hero` · `architect` · `tech-lead`

### ⚪ Documentación

`docs-hero` · `api-designer` · `open-source`

---

## ✅ Ejemplo Completo: Agregar a `ursolcr`

### 1. Se creó `users/ursolcr.json`:

```json
{
  "username": "ursolcr",
  "displayName": "Eduardo Ureña",
  "role": "Co-Fundador & Gerente General",
  "org": "SistemasUrsol",
  "joinedAt": "2024-01-15",
  "badges": [
    { "id": "hello-world", "awardedAt": "2024-01-15", "awardedBy": "system" },
    { "id": "first-commit", "awardedAt": "2024-01-22", "awardedBy": "system" },
    { "id": "first-pr", "awardedAt": "2024-02-05", "awardedBy": "system" },
    {
      "id": "first-review",
      "awardedAt": "2024-02-12",
      "awardedBy": "jeremy-sud"
    },
    { "id": "mentor", "awardedAt": "2024-03-01", "awardedBy": "jeremy-sud" },
    {
      "id": "team-spirit",
      "awardedAt": "2024-04-10",
      "awardedBy": "jeremy-sud"
    },
    { "id": "docs-hero", "awardedAt": "2024-05-15", "awardedBy": "jeremy-sud" },
    {
      "id": "sprint-hero",
      "awardedAt": "2024-06-20",
      "awardedBy": "jeremy-sud"
    }
  ]
}
```

### 2. Eduardo agrega los marcadores a su README de perfil (`ursolcr/ursolcr/README.md`):

```markdown
# Hola 👋 Soy Eduardo Ureña

Co-Fundador de Sistemas Ursol — ¡Su Puerto Seguro en Informática!

<!-- BLOOMFLOW-BADGES-START -->
<!-- BLOOMFLOW-BADGES-END -->
```

### 3. Se ejecuta el Action y las medallas aparecen automáticamente ✨

---

## 🔧 Otorgar nuevas medallas

Para otorgar una medalla nueva a un usuario, simplemente agrega un objeto al array `badges` en su archivo JSON:

```json
{ "id": "algorithm-ace", "awardedAt": "2026-02-15", "awardedBy": "jeremy-sud" }
```

Luego ejecuta el Action para sincronizar los cambios al README.

---

## 🏗️ Arquitectura del Sistema de Usuarios

```
BOOMFLOW/
├── api-mock.json          → Catálogo maestro (26 medallas)
├── users/
│   ├── jeremy-sud.json    → 20 medallas (Dev Lead)
│   └── ursolcr.json       → 8 medallas (Nuevo integrante)
├── github-action/
│   └── index.js           → Lee users/*.json + api-mock.json → genera HTML
└── assets/
    └── badge-*.svg        → 26 medallas SVG
```

**Flujo de datos:**

```
users/username.json → index.js → cruza con api-mock.json → genera HTML → inyecta en README.md
```

---

> 🌸 Bloomflow — Verificado por [Sistemas Ursol](https://www.ursol.com)
