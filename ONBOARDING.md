# 🚀 Guía de Onboarding — BOOMFLOW

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Documento_Interno-Sistemas_Ursol-8B5CF6.svg" alt="Interno"/>
</p>

> **Guía paso a paso para integrar nuevos colaboradores al sistema BOOMFLOW de Sistemas Ursol**

---

## 📖 Índice

1. [¿Quién puede usar BOOMFLOW?](#-quién-puede-usar-boomflow)
2. [Proceso de Registro (5 minutos)](#-proceso-de-registro-5-minutos)
3. [Configurar tu Perfil para Mostrar Medallas](#-configurar-tu-perfil-para-mostrar-medallas)
4. [Tus Primeras Medallas](#-tus-primeras-medallas)
5. [Preguntas Frecuentes](#-preguntas-frecuentes)

---

## 🔒 ¿Quién puede usar BOOMFLOW?

BOOMFLOW está reservado **exclusivamente** para:

| ✅ Permitido | ❌ No Permitido |
|--------------|-----------------|
| Colaboradores oficiales de Sistemas Ursol | Usuarios externos |
| Contratistas con acuerdo vigente | Auto-registro |
| Asociados y partners autorizados | Uso personal fuera de Ursol |

> **¿No eres parte del equipo?** Contacta a [RRHH](mailto:rrhh@ursol.com) o revisa nuestras [vacantes](https://www.ursol.com/careers).

---

## ⚡ Proceso de Registro (5 minutos)

### Requisitos Previos

Antes de empezar, asegúrate de tener:

- [ ] Cuenta de GitHub activa
- [ ] Confirmación de tu líder de equipo o RRHH

### Paso 1: Solicitar Registro

Envía a tu líder de equipo o al admin de BOOMFLOW:

```
Solicitud de Registro BOOMFLOW
──────────────────────────────
GitHub Username: tu-usuario
Nombre Completo: Tu Nombre
Fecha de Ingreso: YYYY-MM-DD
Rol: Tu rol en el equipo
```

### Paso 2: El Admin Crea tu Perfil

Un administrador creará tu archivo en `users/tu-usuario.json`:

```json
{
  "username": "tu-usuario",
  "displayName": "Tu Nombre Completo",
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

> 🎉 **¡Tu primera medalla!** Al crearte el perfil, recibes automáticamente la medalla **Hello World**.

### Paso 3: Verificar tu Registro

Puedes verificar que tu perfil existe visitando:
```
https://github.com/jeremy-sud/boomflow/blob/main/users/tu-usuario.json
```

---

## 🖼️ Configurar tu Perfil para Mostrar Medallas

### ¿Qué es un Perfil README de GitHub?

GitHub permite crear un README especial que aparece en tu perfil público. BOOMFLOW sincroniza tus medallas allí.

```
┌─────────────────────────────────────────────────────────────────┐
│  github.com/tu-usuario                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  # 👋 Hola, soy Tu Nombre                                      │
│                                                                 │
│  Desarrollador en Sistemas Ursol                               │
│                                                                 │
│  ### 🏅 Mis Medallas BOOMFLOW                                  │
│  ┌─────────────────────────────────────────┐                   │
│  │ 🥉 Hello World  │ 🥉 First Commit  │    │ ◄── Tus medallas │
│  │ 🥈 Code Ninja   │ 🥇 Tech Lead     │    │     aparecen aquí │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Paso 1: Crear el Repositorio de Perfil

1. Ve a [github.com/new](https://github.com/new)
2. **Repository name**: Escribe **exactamente tu username** (ej: `tu-usuario`)
3. Marca **Public**
4. Marca **Add a README file**
5. Click **Create repository**

> ℹ️ GitHub detecta automáticamente que es un perfil README cuando el repo tiene el mismo nombre que tu usuario.

### Paso 2: Agregar los Marcadores BOOMFLOW

Edita tu `README.md` y agrega estos marcadores donde quieras que aparezcan tus medallas:

```markdown
## 👋 Hola, soy [Tu Nombre]

Desarrollador en Sistemas Ursol

### 🏅 Mis Logros Profesionales

<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->

---
Más sobre mí...
```

⚠️ **Importante**: Los marcadores deben ser exactamente:
```markdown
<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->
```

### Paso 3: Configurar Sincronización Automática (Opcional)

Para que las medallas se actualicen automáticamente, crea el archivo `.github/workflows/boomflow.yml`:

```yaml
name: 🏅 BOOMFLOW Badge Sync

on:
  schedule:
    - cron: '0 0 * * *'  # Diario a medianoche UTC
  workflow_dispatch:      # Permite ejecución manual

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

### Paso 4: Configurar el Token

Para que el workflow funcione, necesitas un token de GitHub:

1. Ve a **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. Nombre: `BOOMFLOW Sync`
4. Permisos: Marca `repo` (Full control)
5. **Generate token** y copia el código `ghp_...`
6. Ve a tu repo de perfil → **Settings** → **Secrets and variables** → **Actions**
7. **New repository secret**:
   - Name: `BOOMFLOW_TOKEN`
   - Value: (pega el token)

📖 Guía detallada: [GUIA_TOKEN.md](GUIA_TOKEN.md)

### Paso 5: Ejecutar Primera Sincronización

1. Ve a tu repo de perfil
2. Click en **Actions**
3. Selecciona **BOOMFLOW Badge Sync**
4. Click **Run workflow**
5. ¡Espera unos segundos y revisa tu perfil!

---

## 🎖️ Tus Primeras Medallas

### Medallas Automáticas

Estas medallas se otorgan **automáticamente** basándose en tu actividad en GitHub:

| Medalla | Criterio | Cuándo se verifica |
|---------|----------|-------------------|
| 🥉 **Hello World** | Perfil creado en BOOMFLOW | Al registrarte |
| 🥉 **First Commit** | 1+ commit en repos de Ursol | Diariamente 6AM UTC |
| 🥉 **First PR** | 1+ PR mergeada | Diariamente 6AM UTC |
| 🥉 **First Review** | 1+ code review | Diariamente 6AM UTC |
| 🥉 **Week One** | 7 días en el equipo | Diariamente 6AM UTC |
| 🥈 **Month One** | 30 días en el equipo | Diariamente 6AM UTC |
| 🥇 **Year One** | 365 días en el equipo | Diariamente 6AM UTC |

### ¿Cómo conseguir tu primera medalla de código?

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RUTA A TU PRIMERA MEDALLA DE CÓDIGO                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Haz tu primer commit a cualquier repo de SistemasUrsol            │
│      └─► Recibirás 🥉 First Commit                                     │
│                                                                         │
│   2. Crea tu primer Pull Request y que lo aprueben                     │
│      └─► Recibirás 🥉 First PR                                         │
│                                                                         │
│   3. Revisa el código de un compañero y aprueba/comenta                │
│      └─► Recibirás 🥉 First Review                                     │
│                                                                         │
│   4. Continúa contribuyendo: a los 50 commits conseguirás              │
│      └─► 🥈 Code Ninja                                                 │
│                                                                         │
│   5. A los 100 commits:                                                │
│      └─► 🥈 Commit Century                                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Medallas que Requieren Nominación

Estas medallas son otorgadas por administradores cuando demuestras habilidades especiales:

| Medalla | Descripción | ¿Cómo conseguirla? |
|---------|-------------|-------------------|
| 🥇 **Tech Lead** | Liderazgo técnico demostrado | Lidera decisiones técnicas en proyectos |
| 🥇 **Architect** | Diseña arquitecturas sólidas | Propón y diseña sistemas escalables |
| 🥉 **Mentor** | Ayuda a nuevos miembros | Guía activamente a compañeros nuevos |
| 🥈 **Crisis Averted** | Salvó una situación crítica | Resuelve un incidente de producción |
| 🥇 **Innovator** | Ideas transformadoras | Propón e implementa mejoras significativas |

> 💡 **Tip**: Tu líder de equipo puede nominar a cualquier miembro para estas medallas.

---

## ❓ Preguntas Frecuentes

### ¿Cuánto tiempo tarda en aparecer una medalla?

- **Medallas automáticas**: Hasta 24 horas (verificación diaria a las 6AM UTC)
- **Medallas manuales**: Inmediatamente después de que un admin la otorgue
- **Sincronización a perfil**: Depende de tu configuración (manual o diaria)

### ¿Puedo auto-asignarme medallas?

**No.** El sistema está diseñado para que el reconocimiento venga de:
- El sistema automático (métricas de GitHub)
- Administradores autorizados ([@jeremy-sud](https://github.com/jeremy-sud), [@ursolcr](https://github.com/ursolcr))

### ¿Qué pasa si dejo Sistemas Ursol?

Tus medallas permanecen en tu perfil como parte de tu historial profesional. Representan logros reales que conseguiste durante tu tiempo en el equipo.

### ¿Puedo ver las medallas de otros?

Sí, los archivos de usuario son públicos:
```
https://github.com/jeremy-sud/boomflow/tree/main/users
```

### ¿Cómo nomino a alguien para una medalla?

Contacta a un administrador:
- [@jeremy-sud](https://github.com/jeremy-sud)
- [@ursolcr](https://github.com/ursolcr)

O abre un issue en el repo de BOOMFLOW con la nominación.

### Mi medalla no aparece en mi perfil

Verifica:
1. ¿Tienes los marcadores `<!-- BOOMFLOW-BADGES-START -->` en tu README?
2. ¿El workflow se ejecutó correctamente? (revisa la pestaña Actions)
3. ¿Tu token tiene permisos `repo`?

Si todo está bien, ejecuta manualmente: **Actions** → **Run workflow**

---

## 📞 Soporte

¿Problemas o dudas? Contacta a:

- **Slack**: #boomflow-support
- **Email**: [boomflow@ursol.com](mailto:boomflow@ursol.com)
- **GitHub Issues**: [Crear issue](https://github.com/jeremy-sud/boomflow/issues/new)

---

<p align="center">
  <strong>🌸 BOOMFLOW</strong><br/>
  <sub>Bienvenido al equipo — Sistemas Ursol</sub>
</p>
