# 🔑 Guía de Configuración: BLOOMFLOW_TOKEN

El `BLOOMFLOW_TOKEN` es esencialmente una **"llave maestra"** temporal. Permite que el proceso automático (GitHub Action) tenga permiso para:

1. Leer los datos de medallas del repositorio central.
2. Modificar el archivo `README.md` de tu perfil.

Aquí tienes los pasos detallados para obtenerla y configurarla:

---

## Paso 1: Generar tu Token en GitHub

1. Haz clic en tu foto de perfil (arriba a la derecha) y ve a **Settings**.
2. En la barra lateral izquierda, baja hasta el final y haz clic en **<> Developer settings**.
3. Selecciona **Personal access tokens** > **Tokens (classic)**.
4. Haz clic en el botón **Generate new token** > **Generate new token (classic)**.
5. Configura lo siguiente:
   - **Note:** Ponle un nombre descriptivo, como `Bloomflow Sync`.
   - **Expiration:** Puedes elegir "No expiration" o 90 días.
   - **Select scopes:** Marca la casilla **`repo`** (esto da permiso para editar tus archivos).
6. Baja al final y dale a **Generate token**.
7. **⚠️ MUY IMPORTANTE:** Copia el código que aparece (empieza por `ghp_...`). **Solo lo verás una vez.** Guárdalo en un lugar seguro momentáneamente.

---

## Paso 2: Agregar el Token a tu Repositorio

Ahora que tienes la "llave" (`ghp_...`), debes dársela a tu repositorio para que pueda usarla:

1. Ve a tu repositorio de perfil: `https://github.com/jeremy-sud/jeremy-sud`.
2. Haz clic en la pestaña **Settings** (en la barra superior del repo).
3. En la barra lateral izquierda, busca la sección **Security** y haz clic en **Secrets and variables** > **Actions**.
4. Haz clic en el botón verde **New repository secret**.
5. Completa los campos:
   - **Name:** Escribe exactamente `BLOOMFLOW_TOKEN`.
   - **Secret:** Pega el código que copiaste en el Paso 1 (`ghp_...`).
6. Haz clic en **Add secret**.

---

## Paso 3: ¡Listo para Ejecutar!

Ahora que el repositorio tiene la llave, puedes volver a la pestaña de **Actions**, seleccionar tu workflow y darle a **Run workflow**.

El sistema usará ese token para identificarse como "tú" y tendrá permiso para escribir las medallas en tu README.

---

> 💡 **Nota de seguridad:** Nunca compartas tu token `ghp_...` con nadie ni lo pegues directamente en el código. Por eso lo guardamos en "Secrets", donde GitHub lo mantiene encriptado y oculto.
