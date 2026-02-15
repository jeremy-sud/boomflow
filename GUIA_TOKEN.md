# 🔑 Guía de Configuración: BOOMFLOW_TOKEN

<p align="center">
  <img src="https://img.shields.io/badge/🔒_Solo_para-Colaboradores_Ursol-8B5CF6.svg" alt="Solo Ursol"/>
</p>

> **Guía paso a paso para configurar tu token de sincronización de medallas BOOMFLOW**

---

## 📖 Índice

1. [¿Qué es el BOOMFLOW_TOKEN?](#-qué-es-el-boomflow_token)
2. [Paso 1: Generar el Token](#paso-1-generar-el-token-en-github)
3. [Paso 2: Guardar el Token](#paso-2-guardar-el-token-como-secret)
4. [Paso 3: Verificar la Configuración](#paso-3-verificar-la-configuración)
5. [Solución de Problemas](#-solución-de-problemas)

---

## 🔐 ¿Qué es el BOOMFLOW_TOKEN?

El `BOOMFLOW_TOKEN` es un **Personal Access Token (PAT)** de GitHub que permite al workflow de BOOMFLOW:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       FUNCIÓN DEL TOKEN                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   GitHub Action                                                         │
│        │                                                                │
│        │ usa BOOMFLOW_TOKEN para:                                       │
│        │                                                                │
│        ├──► 📖 Leer datos de medallas del repo BOOMFLOW                │
│        │                                                                │
│        └──► ✏️ Escribir en tu README.md de perfil                      │
│                                                                         │
│   Sin el token, el workflow no tiene permisos para modificar tu repo.  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Requisitos Previos

Antes de continuar, verifica:

- [ ] ✅ Eres colaborador oficial de Sistemas Ursol
- [ ] ✅ Tu perfil está registrado en BOOMFLOW (`users/tu-usuario.json` existe)
- [ ] ✅ Tienes un repositorio de perfil (`username/username` en GitHub)

---

## Paso 1: Generar el Token en GitHub

### 1.1 Ir a Configuración de Desarrollador

1. Haz clic en tu **foto de perfil** (esquina superior derecha)
2. Click en **Settings**

![Settings](https://docs.github.com/assets/images/help/settings/userbar-account-settings.png)

3. En el menú lateral izquierdo, baja hasta el final
4. Click en **Developer settings**

### 1.2 Crear Personal Access Token

1. Click en **Personal access tokens**
2. Click en **Tokens (classic)**
3. Click en **Generate new token** → **Generate new token (classic)**

### 1.3 Configurar el Token

Completa los campos:

| Campo | Valor Recomendado |
|-------|-------------------|
| **Note** | `BOOMFLOW Badge Sync` |
| **Expiration** | `90 days` o `No expiration` |
| **Scopes** | ✅ `repo` (Full control of private repositories) |

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚠️  IMPORTANTE: Solo necesitas marcar "repo"                          │
│                                                                         │
│  ☑️ repo                                                                │
│     ├── ☑️ repo:status                                                  │
│     ├── ☑️ repo_deployment                                              │
│     ├── ☑️ public_repo                                                  │
│     ├── ☑️ repo:invite                                                  │
│     └── ☑️ security_events                                              │
│                                                                         │
│  ☐ workflow (NO necesario)                                              │
│  ☐ admin:org (NO necesario)                                             │
│  ☐ gist (NO necesario)                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.4 Generar y Copiar

1. Baja al final y click en **Generate token**
2. **⚠️ COPIA EL TOKEN AHORA** — Solo lo verás una vez

```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     └── Tu token empieza con "ghp_"
```

> 🔒 **Guarda el token temporalmente** en un lugar seguro (notepad, password manager). Lo necesitarás en el siguiente paso.

---

## Paso 2: Guardar el Token como Secret

### 2.1 Ir a tu Repositorio de Perfil

Navega a: `https://github.com/TU-USUARIO/TU-USUARIO`

Por ejemplo: `https://github.com/jeremy-sud/jeremy-sud`

### 2.2 Abrir Configuración del Repositorio

1. Click en la pestaña **Settings** (del repositorio, no de tu cuenta)
2. En el menú lateral, busca **Security**
3. Click en **Secrets and variables**
4. Click en **Actions**

### 2.3 Crear el Secret

1. Click en el botón verde **New repository secret**
2. Completa:

| Campo | Valor |
|-------|-------|
| **Name** | `BOOMFLOW_TOKEN` (exactamente así, mayúsculas) |
| **Secret** | Pega tu token `ghp_xxxxx...` |

3. Click en **Add secret**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✅ Secret creado correctamente                                         │
│                                                                         │
│  Repository secrets                                                     │
│  ├── BOOMFLOW_TOKEN    Updated just now       🗑️                       │
│                                                                         │
│  El token está ahora encriptado y seguro.                              │
│  GitHub nunca muestra el valor del secret.                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Paso 3: Verificar la Configuración

### 3.1 Verificar que el Workflow Existe

Tu repositorio debe tener el archivo `.github/workflows/boomflow.yml`:

```yaml
name: 🏅 BOOMFLOW Badge Sync

on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

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

### 3.2 Ejecutar el Workflow Manualmente

1. Ve a tu repositorio de perfil
2. Click en la pestaña **Actions**
3. En el menú lateral, selecciona **BOOMFLOW Badge Sync**
4. Click en **Run workflow** (botón desplegable a la derecha)
5. Click en **Run workflow** (botón verde)

### 3.3 Verificar el Resultado

Espera unos segundos y:

1. El workflow debe aparecer con ✅ (check verde)
2. Visita tu perfil: `https://github.com/TU-USUARIO`
3. Deberías ver tus medallas entre los marcadores

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✅ Éxito: Tu perfil debería verse así                                  │
│                                                                         │
│  ### 🏅 Mis Logros Profesionales                                       │
│                                                                         │
│  <!-- BOOMFLOW-BADGES-START -->                                        │
│  ┌─────────────────────────────────────────────────────────┐           │
│  │ 🥉 Hello World │ 🥉 First Commit │ 🥈 Code Ninja │     │           │
│  └─────────────────────────────────────────────────────────┘           │
│  <!-- BOOMFLOW-BADGES-END -->                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Solución de Problemas

### Error: "Resource not accessible by integration"

**Causa**: El token no tiene permisos suficientes.

**Solución**: 
1. Genera un nuevo token con scope `repo` completo
2. Actualiza el secret en tu repositorio

### Error: "BOOMFLOW_TOKEN secret not found"

**Causa**: El nombre del secret es incorrecto.

**Solución**:
1. Ve a **Settings** → **Secrets** → **Actions**
2. Verifica que el nombre sea exactamente `BOOMFLOW_TOKEN` (mayúsculas)

### El Workflow Pasa pero las Medallas no Aparecen

**Causa probable**: Faltan los marcadores en tu README.

**Solución**: Asegúrate de tener exactamente:
```markdown
<!-- BOOMFLOW-BADGES-START -->
<!-- BOOMFLOW-BADGES-END -->
```

### Token Expirado

**Síntoma**: El workflow funcionaba antes pero ahora falla.

**Solución**:
1. Genera un nuevo token (Paso 1)
2. Ve a **Settings** → **Secrets** → **Actions**
3. Click en **Update** junto a `BOOMFLOW_TOKEN`
4. Pega el nuevo token

### No Tengo Perfil Registrado en BOOMFLOW

**Síntoma**: El workflow dice que no encuentra tu usuario.

**Solución**: Contacta a tu líder de equipo para que te registren:
```
https://github.com/jeremy-sud/boomflow/blob/main/users/
```

---

## 🔒 Seguridad del Token

### ✅ Buenas Prácticas

| Hacer | No Hacer |
|-------|----------|
| Guardar en GitHub Secrets | Poner en el código directamente |
| Usar tokens con expiración | Compartir tu token con otros |
| Rotar tokens periódicamente | Subir tokens a repos públicos |

### ¿Qué pasa si alguien obtiene mi token?

1. **Revoca inmediatamente** el token comprometido:
   - Settings → Developer settings → Personal access tokens
   - Click en **Delete** junto al token
   
2. **Genera uno nuevo** y actualiza tu secret

3. **Revisa** el historial de tu repositorio por cambios sospechosos

---

## ❓ Preguntas Frecuentes

### ¿Puedo usar un Fine-grained token en lugar de Classic?

Sí, pero asegúrate de que tenga permisos de **Read and Write** en:
- Contents
- Metadata

### ¿El token da acceso a todos mis repos?

Sí, con scope `repo` el token puede acceder a todos tus repos (públicos y privados). Por eso es importante:
- No compartirlo
- Guardarlo solo en GitHub Secrets
- Revocarlo si sospechas que está comprometido

### ¿Cada cuánto debo renovar el token?

Recomendamos:
- **90 días** para balance entre seguridad y conveniencia
- **No expiration** solo si confías en las prácticas de seguridad

### ¿Puedo usar el mismo token en múltiples repos?

Sí, pero no es recomendable. Es mejor tener un token dedicado por propósito.

---

## 📞 Soporte

¿Problemas con la configuración? Contacta a:

- **Slack**: #boomflow-support
- **Email**: [boomflow@ursol.com](mailto:boomflow@ursol.com)
- **Admin**: [@jeremy-sud](https://github.com/jeremy-sud)

---

<p align="center">
  <strong>🌸 BOOMFLOW</strong><br/>
  <sub>Guía de Token — Sistemas Ursol</sub>
</p>
