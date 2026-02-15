# 🛡️ Sistema de Protección de Medallas BOOMFLOW

> **⚠️ DOCUMENTO INTERNO - Solo para administradores de Sistemas Ursol**

## Descripción General

BOOMFLOW implementa un sistema de protección multinivel para garantizar que **solo administradores autorizados de Sistemas Ursol** puedan otorgar medallas a colaboradores.

Este sistema previene que usuarios no autorizados se auto-asignen medallas o modifiquen los datos de otros usuarios.

---

## 🔐 Capas de Protección

### 1. Lista de Administradores (`config/admins.json`)

Archivo central que define quién puede otorgar medallas:

```json
{
  "admins": [
    {
      "username": "jeremy-sud",
      "permissions": ["grant_badges", "revoke_badges", "manage_users", "manage_admins"]
    },
    {
      "username": "ursolcr",
      "permissions": ["grant_badges", "revoke_badges", "manage_users", "manage_admins"]
    }
  ]
}
```

**Administradores actuales:**
| Usuario | Nombre | Permisos |
|---------|--------|----------|
| `jeremy-sud` | Jeremy Alva | Todos |
| `ursolcr` | Ursol CR | Todos |

### 2. GitHub Actions Workflow

El workflow `.github/workflows/badge-protection.yml` se ejecuta automáticamente en cada Push o PR que modifique:
- `users/**` - Archivos de datos de usuarios
- `config/admins.json` - Lista de administradores

**Validaciones:**
- ✅ Verifica que el autor sea un administrador autorizado
- ✅ Valida la estructura JSON de los archivos modificados
- ✅ Registra un log de auditoría de cambios

**Si falla:**
- ❌ El workflow bloqueará el merge del PR
- ❌ El push será marcado como fallido

### 3. CODEOWNERS

El archivo `.github/CODEOWNERS` requiere aprobación explícita de administradores para:

```
/users/              @jeremy-sud @ursolcr
/config/admins.json  @jeremy-sud @ursolcr
/.github/            @jeremy-sud @ursolcr
```

**Nota:** Para que CODEOWNERS funcione completamente, debes habilitar "Require review from Code Owners" en la configuración de protección de rama del repositorio.

### 4. Trazabilidad (`awardedBy`)

Cada medalla registra quién la otorgó:

```json
{
  "id": "first-commit",
  "awardedAt": "2024-02-01",
  "awardedBy": "jeremy-sud"
}
```

Esto permite:
- Auditar quién otorgó cada medalla
- Verificar que fue un administrador autorizado
- Mantener historial de reconocimientos

### 5. Sistema de Auto-Award 🤖

Para colaboradores registrados (como `jeremy-sud` y `ursolcr`), existe un **sistema automático** que verifica y otorga medallas diariamente.

**Workflow:** `.github/workflows/auto-award.yml`

**Horario:** Todos los días a las 6:00 AM UTC (medianoche Costa Rica)

**Funcionamiento:**
1. El workflow se ejecuta automáticamente según el cron
2. El script `scripts/auto-award.js` analiza métricas de GitHub
3. Verifica commits, PRs, reviews, issues, etc.
4. Otorga medallas automáticamente si se cumplen los criterios
5. Hace commit y push de los cambios

**Medallas Auto-Otorgables:**

| Categoría | Medallas |
|-----------|----------|
| **Onboarding** | hello-world, first-commit, first-pr, first-review, week-one, month-one, year-one |
| **Coding** | code-ninja, bug-hunter, commit-century, commit-500, commit-1000 |
| **Colaboración** | pr-champion, review-guru, team-player, helpful-hero |
| **Documentación** | docs-contributor, docs-hero |
| **Milestones** | streak-7, streak-30, early-bird, night-owl |

**Medallas Solo Manuales:**
- mentor, tech-lead, architect, team-spirit, sprint-hero, innovation-award, founder

**Ejecución Manual:**
```bash
# Ejecutar localmente
node scripts/auto-award.js

# Ejecutar desde GitHub Actions (manual trigger)
# Ve a Actions > "BOOMFLOW Auto-Award (Diario)" > Run workflow
```

---

## 🛠️ Herramientas de Administración

### CLI de Administración

```bash
# Ver administradores autorizados
node scripts/badge-admin.js list-admins

# Otorgar medalla
node scripts/badge-admin.js grant <usuario> <badge-id> --admin <tu-usuario>

# Revocar medalla
node scripts/badge-admin.js revoke <usuario> <badge-id> --admin <tu-usuario>

# Ver perfil de usuario
node scripts/badge-admin.js user <usuario>
```

**Ejemplos:**
```bash
# Jeremy otorga medalla a un colaborador
node scripts/badge-admin.js grant nuevo-dev first-commit --admin jeremy-sud

# Ursolcr revoca una medalla
node scripts/badge-admin.js revoke usuario code-ninja --admin ursolcr
```

---

## 📋 Proceso para Otorgar Medallas

### Para Administradores

1. **Evaluar** si el colaborador merece la medalla según los criterios definidos
2. **Ejecutar** el comando de CLI o editar manualmente el archivo JSON
3. **Verificar** que el archivo tenga el campo `awardedBy` con tu usuario
4. **Commit & Push** los cambios al repositorio
5. El workflow validará automáticamente los permisos

### Estructura del archivo de usuario

```json
{
  "username": "colaborador-github",
  "displayName": "Nombre Completo",
  "role": "Desarrollador",
  "org": "SistemasUrsol",
  "joinedAt": "2024-01-15",
  "badges": [
    {
      "id": "badge-id",
      "awardedAt": "2024-02-01",
      "awardedBy": "admin-que-otorgo"
    }
  ]
}
```

---

## ⚠️ Qué NO Hacer

- ❌ **NO** otorgarse medallas a uno mismo (excepto medallas de sistema)
- ❌ **NO** modificar el archivo `config/admins.json` sin autorización
- ❌ **NO** aprobar PRs de usuarios no autorizados que modifiquen medallas
- ❌ **NO** compartir acceso al repositorio con personas fuera de Ursol

---

## 🔧 Configuración del Repositorio (GitHub)

Para máxima protección, configura en GitHub → Settings → Branches:

### Protección de rama `main`:
- [x] Require a pull request before merging
- [x] Require approvals (mínimo 1)
- [x] Require review from Code Owners
- [x] Require status checks to pass before merging
  - [x] `validate-badge-permissions`
- [x] Require branches to be up to date before merging
- [ ] Do not allow bypassing the above settings (opcional para emergencias)

---

## 📞 Agregar Nuevos Administradores

Solo los administradores actuales pueden agregar nuevos administradores.

1. Editar `config/admins.json`
2. Agregar el nuevo administrador con sus permisos
3. Actualizar `.github/CODEOWNERS` si es necesario
4. Crear PR y obtener aprobación de otro administrador

```json
{
  "username": "nuevo-admin",
  "displayName": "Nombre del Admin",
  "role": "Rol en Ursol",
  "permissions": ["grant_badges", "revoke_badges", "manage_users"],
  "addedAt": "2024-XX-XX",
  "addedBy": "admin-existente"
}
```

---

## 📊 Auditoría

Todos los cambios de medallas quedan registrados en:
1. **Git History** - Commits con autor y fecha
2. **GitHub Actions Logs** - Registro de validaciones
3. **Campo `awardedBy`** - En cada medalla

Para auditar:
```bash
# Ver historial de cambios en usuarios
git log --oneline -- users/

# Ver quién modificó un archivo específico
git log -p -- users/colaborador.json
```

---

## 🚨 En Caso de Incidente

Si detectas una medalla otorgada incorrectamente:

1. **Identificar** el usuario y medalla afectada
2. **Revocar** usando el CLI: `node scripts/badge-admin.js revoke ...`
3. **Revisar** el historial de git para identificar cómo ocurrió
4. **Reportar** al equipo de administración
5. **Reforzar** la protección si es necesario

---

*Sistema de protección implementado el 15 de febrero de 2026*
*Mantenido por: @jeremy-sud y @ursolcr*
