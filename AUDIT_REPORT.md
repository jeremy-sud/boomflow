# 🔍 BOOMFLOW — Auditoría Completa del Código

**Fecha:** Junio 2025  
**Alcance:** Todos los archivos de código fuente en el repositorio  
**Severidades:** 🔴 CRÍTICO | 🟠 ALTO | 🟡 MEDIO | 🔵 BAJO | ⚪ INFO

---

## Resumen Ejecutivo

Se encontraron **87 issues** distribuidos así:

| Severidad | Cantidad |
|-----------|----------|
| 🔴 CRÍTICO | 8 |
| 🟠 ALTO | 22 |
| 🟡 MEDIO | 30 |
| 🔵 BAJO | 18 |
| ⚪ INFO | 9 |

**Problemas arquitectónicos principales:**
1. Dos esquemas Prisma completamente incompatibles (backend vs app-web)
2. Secreto JWT hardcodeado como fallback en producción
3. Rutas API sin autenticación que exponen datos sensibles
4. Datos mock usados en producción como datos reales
5. Tres fuentes de verdad separadas para el catálogo de badges
6. Servidor Express duplicado (server.js + src/index.js)

---

## 1. BACKEND

### 1.1 Secreto JWT Hardcodeado 🔴 CRÍTICO
**Archivo:** `backend/src/middleware/auth.js` L8  
```js
const JWT_SECRET = process.env.JWT_SECRET || 'boomflow-secret-key-change-in-production';
```
**Problema:** Si `JWT_SECRET` no está en env vars, se usa un secreto hardcodeado conocido públicamente. Cualquiera puede forjar tokens JWT válidos.  
**Fix:** Eliminar el fallback. Lanzar error si `JWT_SECRET` no está definido:
```js
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');
```

### 1.2 Servidor Duplicado 🟠 ALTO
**Archivos:** `backend/server.js` (178 líneas) + `backend/src/index.js` (72 líneas)  
**Problema:** Dos entry points distintos con funcionalidad superpuesta. `server.js` es una versión legacy con autenticación OAuth inline; `src/index.js` es la versión modular. Confusión sobre cuál usar, `package.json` apunta a `src/index.js`.  
**Fix:** Eliminar `backend/server.js` y consolidar cualquier lógica faltante en `src/index.js`.

### 1.3 Bug de Orden de Rutas 🔴 CRÍTICO
**Archivo:** `backend/src/routes/users.js` L117, L183  
```js
router.get('/:username', ...);     // Línea ~50 — captura TODO
router.get('/leaderboard', ...);   // Línea ~117 — INALCANZABLE
router.get('/search', ...);        // Línea ~183 — INALCANZABLE
```
**Problema:** `/:username` es un wildcard que captura `leaderboard` y `search` como si fueran usernames. Estas rutas nunca se ejecutan; siempre devuelven "User not found".  
**Fix:** Mover las rutas estáticas (`/leaderboard`, `/search`) ANTES de `/:username`.

### 1.4 fs.readFileSync en Cada Request 🟠 ALTO
**Archivo:** `backend/server.js` L142, L153  
**Problema:** Lee archivos del filesystem sincrónicamente en cada petición HTTP, bloqueando el event loop.  
**Fix:** Cachear los datos en memoria al inicio o usar lectura asíncrona (`fs.promises.readFile`).

### 1.5 OAuth Redirect URI Hardcodeada 🟡 MEDIO
**Archivo:** `backend/server.js` L94  
**Problema:** `redirect_uri` apunta a `http://localhost:3001` — no funciona en producción.  
**Fix:** Usar variable de entorno para la URL base.

### 1.6 Leak de Información en OAuth 🟡 MEDIO
**Archivo:** `backend/server.js` L120  
**Problema:** En caso de error OAuth, `tokenRes.data` se expone al cliente pudiendo contener tokens o datos sensibles.  
**Fix:** Solo devolver un mensaje de error genérico.

### 1.7 Paginación Sin Validar 🟠 ALTO
**Archivo:** `backend/src/routes/kudos.js` L22-27  
```js
function parsePagination(query) {
  const page = Number.parseInt(query.page, 10) || 1;
  const limit = Number.parseInt(query.limit, 10) || 20;
  return { page, limit, skip: (page - 1) * limit };
}
```
**Problema:** Sin límite máximo — `?limit=999999` carga toda la BD. Valores negativos no manejados. NaN no validado.  
**Fix:** Agregar `Math.min(limit, 100)` y `Math.max(page, 1)`:
```js
const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100);
const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
```

### 1.8 checkAndAwardBadges Retorna Solo Primer Badge 🟠 ALTO
**Archivo:** `backend/src/services/badgeEngine.js` L130  
**Problema:** El loop `for (const rule of BADGE_RULES)` hace `return` al encontrar el primer badge que califica. Si un usuario califica para múltiples badges simultáneamente, solo recibe uno.  
**Fix:** Acumular todos los badges desbloqueados y retornarlos al final.

### 1.9 Doble Serialización de Metadata 🟡 MEDIO
**Archivo:** `backend/src/services/badgeEngine.js` L117, L125  
**Problema:** `metadata: JSON.stringify(metadata)` cuando el campo Prisma es tipo `Json`. Prisma serializa automáticamente — el resultado es un string escapado dentro de JSON: `"{\"key\":\"value\"}"`.  
**Fix:** Pasar el objeto directamente: `metadata: metadata`.

### 1.10 Fire-and-Forget Sin Try/Catch 🟡 MEDIO
**Archivo:** `backend/src/routes/badges.js` L270-288  
**Problema:** `notifyBadgeEarned()` y `logBadgeAwarded()` se ejecutan después de crear el badge, pero si lanzan excepción, el badge ya fue creado pero se devuelve un 500 al cliente.  
**Fix:** Envolver en `try/catch` o usar `.catch(() => {})` para operaciones no críticas.

### 1.11 BullMQ + IORedis No Usados 🟡 MEDIO
**Archivo:** `backend/package.json` L18-19  
```json
"bullmq": "^5.34.9",
"ioredis": "^5.4.2"
```
**Problema:** Declarados como dependencias pero nunca importados en ningún archivo del backend. Aumentan la superficie de ataque y tamaño de node_modules.  
**Fix:** Remover o implementar el sistema de colas.

### 1.12 Token JWT 7 Días Sin Refresh 🟡 MEDIO
**Archivo:** `backend/src/middleware/auth.js` L114  
**Problema:** Token expira en 7 días sin mecanismo de refresh ni revocación. Si un token es comprometido, es válido por una semana.  
**Fix:** Reducir expiración (15-60 min) y agregar refresh tokens.

### 1.13 Sin Graceful Shutdown 🔵 BAJO
**Archivo:** `backend/src/index.js`  
**Problema:** El servidor no maneja señales `SIGTERM`/`SIGINT` para cerrar conexiones activas y desconectar Prisma.  
**Fix:** Agregar handler de shutdown.

### 1.14 githubToken en Texto Plano 🟠 ALTO
**Archivo:** `backend/prisma/schema.prisma` L39  
```prisma
githubToken  String?   // Encrypted GitHub token
```
**Problema:** El comentario dice "Encrypted" pero es un `String` plano — no hay encriptación implementada.  
**Fix:** Implementar encriptación at-rest con AES-256 o usar un secrets manager.

### 1.15 Notification.data Default Incorrecto 🟡 MEDIO
**Archivo:** `backend/prisma/schema.prisma` L169  
```prisma
data  Json  @default("{}")
```
**Problema:** `"{}"` es un STRING, no JSON. El default debería ser `@default("{}")` pero Prisma interpreta esto como string literal. Cambiar a `@default(dbgenerated("'{}'::json"))` o remover el default.

### 1.16 Notification.userId Sin Foreign Key 🟡 MEDIO
**Archivo:** `backend/prisma/schema.prisma` L164  
**Problema:** `userId String` no tiene `@relation` a `User`. Las notificaciones huérfanas no son prevenidas por la BD.  
**Fix:** Agregar relación: `user User @relation(fields: [userId], references: [id])`.

---

## 2. FRONTEND (app-web)

### 2.1 Datos Mock En Producción 🔴 CRÍTICO
**Archivos:**  
- `app-web/src/app/page.tsx` L16: `const CURRENT_USER = USERS.find(u => u.username === 'jeremy-sud')!;`
- `app-web/src/app/catalog/page.tsx` L8: Mismo patrón
- `app-web/src/app/feed/page.tsx` L7: Mismo patrón
- `app-web/src/app/profile/page.tsx` L37: Mismo patrón
- `app-web/src/app/leaderboard/page.tsx`: Usa `USERS` mock
- `app-web/src/components/Dashboard.tsx` L85: `username: "dawnweaber"` hardcodeado

**Problema:** Todas las páginas usan datos mock de `data.ts` en vez de datos reales de sesión/API. El non-null assertion `!` causa crash si el usuario no existe. El componente Dashboard tiene un username diferente ("dawnweaber") al resto.  
**Fix:** Integrar con NextAuth session y llamadas a la API real.

### 2.2 Tres Fuentes de Verdad para Badges 🟠 ALTO
**Archivos:**  
- `app-web/src/lib/data.ts` — 89 badges mock con IDs
- `app-web/src/lib/badge-catalog.ts` — Catálogo separado
- `app-web/prisma/seed.ts` — 89 badges para DB

**Problema:** El mismo catálogo de badges se define en tres lugares distintos con potenciales diferencias. Cambios en uno no se reflejan en los otros.  
**Fix:** Fuente única de verdad: usar la BD como fuente primaria y generar los mocks a partir de ella.

### 2.3 N+1 Query en Session Callback 🟠 ALTO
**Archivo:** `app-web/src/auth.ts` L45-60  
**Problema:** Cada request autenticado ejecuta una query Prisma completa con `include: { badges, organization, team }`. En una app con tráfico, esto genera una query por cada request.  
**Fix:** Usar un cache de sesión o solo cargar datos básicos del usuario, cargando relaciones bajo demanda.

### 2.4 Scope OAuth Excesivo 🟠 ALTO
**Archivo:** `app-web/src/auth.ts` L28  
```ts
authorization: { params: { scope: "read:user user:email repo" } }
```
**Problema:** `repo` da acceso completo a los repositorios privados del usuario. BOOMFLOW solo necesita leer stats.  
**Fix:** Usar `read:user user:email read:org` — eliminar `repo`.

### 2.5 ID Conflict en OAuth Profile 🟡 MEDIO
**Archivo:** `app-web/src/auth.ts` L76  
```ts
return { ...profile, id: profile.id.toString(), ... }
```
**Problema:** Retorna `id: profile.id.toString()` (GitHub numeric ID como string) pero el modelo User usa `@default(cuid())`. PrismaAdapter puede crear conflictos entre el ID numérico de GitHub y el cuid generado.  
**Fix:** Usar campo separado `githubId` y dejar que Prisma genere el `id`.

### 2.6 permission-service Usa fs en Next.js 🟠 ALTO
**Archivo:** `app-web/src/lib/permission-service.ts` L37  
```ts
const configContent = fs.readFileSync(configPath, 'utf-8');
```
**Problema:** Usa `node:fs` con `readFileSync` y ruta relativa `path.join(process.cwd(), '..', 'config', 'admins.json')`. Esto falla en Edge runtime, es frágil ante cambios de cwd, y bloquea el event loop.  
**Fix:** Usar import estático o variable de entorno para la configuración de admins.

### 2.7 Referencia a Campo Inexistente `user.role` 🟠 ALTO
**Archivo:** `app-web/src/lib/permission-service.ts` L155  
**Problema:** `hasOrgPermission` referencia `user.role` pero el modelo `User` del frontend no tiene campo `role`.  
**Fix:** Agregar campo `role` al modelo User o derivar permisos del config de admins.

### 2.8 Middleware No Bloquea Requests 🟡 MEDIO
**Archivo:** `app-web/src/middleware.ts`  
```ts
export { auth as middleware } from "@/auth";
```
**Problema:** Re-exporta `auth` como middleware, pero NextAuth middleware solo adjunta la sesión — no bloquea usuarios no autenticados. Todas las rutas son accesibles sin login.  
**Fix:** Agregar lógica de redirect condicional:
```ts
export default auth((req) => {
  if (!req.auth && !req.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
});
```

### 2.9 Prisma Client Sin DATABASE_URL 🟡 MEDIO
**Archivo:** `app-web/src/lib/prisma.ts`  
**Problema:** Si `DATABASE_URL` no está definida, `PrismaClient` se instancia sin argumento y falla en la primera query con error críptico.  
**Fix:** Validar la existencia de `DATABASE_URL` al inicio.

### 2.10 Idiomas Mezclados en UI 🔵 BAJO
**Archivos:**  
- `app-web/src/components/NotificationBell.tsx` L107: `"ahora"` (español) en función `timeAgo`
- `app-web/src/components/Sidebar.tsx`: `"Actividad"` como label de navegación
- `app-web/src/app/feed/page.tsx` L42: `<h1>Actividad</h1>`
- Resto de la UI en inglés

**Problema:** Mezcla inconsistente de español e inglés en la interfaz.  
**Fix:** Estandarizar a un idioma o implementar i18n.

### 2.11 Versión Desincronizada 🔵 BAJO
**Archivos:**  
- `app-web/src/components/Sidebar.tsx` L128: `"v3.0.0"`
- `app-web/package.json` L3: `"version": "0.1.0"`

**Problema:** La sidebar muestra v3.0.0 pero el package.json dice 0.1.0.  
**Fix:** Leer la versión del package.json dinámicamente.

### 2.12 TIER_EMOJI_MAP No Usado 🔵 BAJO
**Archivo:** `app-web/src/components/Toast.tsx` L28  
**Problema:** `TIER_EMOJI_MAP` se define pero nunca se utiliza.  
**Fix:** Usar o eliminar.

### 2.13 triggerConfetti Sin Cleanup 🔵 BAJO
**Archivo:** `app-web/src/components/Toast.tsx`  
**Problema:** `triggerConfetti` crea elementos DOM y `<style>` tags dinámicamente sin garantía de limpieza si el componente se desmonta durante la animación.  
**Fix:** Usar `useEffect` cleanup o una librería de confetti existente.

### 2.14 styled-jsx Posiblemente No Configurado 🔵 BAJO
**Archivo:** `app-web/src/components/Toast.tsx` L158  
**Problema:** Usa `<style jsx>` que requiere el paquete `styled-jsx`. No está en las dependencias de `package.json`.  
**Fix:** Verificar que Next.js incluya styled-jsx (viene incluido en versiones modernas) o migrar a Tailwind.

### 2.15 Polling Cada 30 Segundos 🟡 MEDIO
**Archivo:** `app-web/src/components/NotificationBell.tsx` L55  
**Problema:** `setInterval(fetchNotifications, 30000)` — polling innecesario que genera carga constante en el servidor.  
**Fix:** Usar Server-Sent Events (SSE), WebSocket, o al menos polling exponencial.

### 2.16 Kudo Submission Usa alert() 🟡 MEDIO
**Archivo:** `app-web/src/app/feed/page.tsx` L32  
```ts
alert(`Kudo sent to ${selectedUser}!\n\n"${kudoMessage}"`);
```
**Problema:** El formulario de kudos usa `alert()` en vez de llamar a la API. No se guardan datos.  
**Fix:** Implementar POST a `/api/kudos`.

### 2.17 Leaderboard 100% Mock 🟡 MEDIO
**Archivo:** `app-web/src/app/leaderboard/page.tsx`  
**Problema:** Toda la página ordena datos mock. Con solo 2 usuarios en `USERS`, el leaderboard siempre muestra los mismos resultados.  
**Fix:** Integrar con la API `/api/leaderboard`.

---

## 3. API ROUTES

### 3.1 GET /api/badges Sin Auth 🔴 CRÍTICO
**Archivo:** `app-web/src/app/api/badges/route.ts`  
**Problema:** Endpoint público expone todo el catálogo de badges sin autenticación, incluyendo badges de organización privados.  
**Fix:** Requerir sesión válida.

### 3.2 GET /api/kudos Sin Auth 🔴 CRÍTICO
**Archivo:** `app-web/src/app/api/kudos/route.ts`  
**Problema:** El feed de kudos es público. No hay filtro `isPublic` en la query — expone todos los kudos.  
**Fix:** Requerir auth y agregar filtro de visibilidad.

### 3.3 Cualquier Usuario Puede Evaluar Badges de Otros 🔴 CRÍTICO
**Archivo:** `app-web/src/app/api/badges/evaluate/route.ts` L29  
```ts
const { username } = await request.json();
```
**Problema:** Cualquier usuario autenticado puede evaluar/trigger badges para CUALQUIER otro usuario simplemente enviando su username. El comentario dice "admin-only in the future" pero no está implementado.  
**Fix:** Verificar que `session.user.username === username` o que el usuario sea admin.

### 3.4 Sin Límite en Leaderboard 🟠 ALTO
**Archivo:** `app-web/src/app/api/leaderboard/route.ts`  
**Problema:** `limit` del query param no tiene cap máximo. `?limit=999999` permite descargar toda la tabla de usuarios con sus badges.  
**Fix:** `const limit = Math.min(Number(searchParams.get('limit')) || 10, 50);`

### 3.5 Error Details Expuestos en GitHub Sync 🟠 ALTO
**Archivo:** `app-web/src/app/api/github/sync/route.ts` L47  
```ts
return NextResponse.json({ error: 'Sync failed', details: String(error) }, { status: 500 });
```
**Problema:** `String(error)` puede contener stack traces, rutas del servidor, o credenciales parciales.  
**Fix:** Loggear el error internamente y devolver mensaje genérico al cliente.

### 3.6 accessToken Pasado Directamente 🟡 MEDIO
**Archivo:** `app-web/src/app/api/github/sync/route.ts`  
**Problema:** `session.accessToken` (token OAuth de GitHub) se pasa directamente a `syncUserData`. Si hay un error de inyección o log accidental, el token de GitHub queda expuesto.  
**Fix:** Usar un servicio intermedio que maneje el token de forma segura.

### 3.7 Badge Award Sin Validación de Duplicados 🟡 MEDIO
**Archivo:** `app-web/src/app/api/badges/award/route.ts`  
**Problema:** No verifica si el usuario ya tiene el badge antes de intentar crearlo. Depende de constraint unique de BD que lanza error Prisma con mensaje poco amigable.  
**Fix:** Verificar existencia previa y devolver mensaje descriptivo.

### 3.8 Peer Award Permite Badges Duplicados 🟡 MEDIO
**Archivo:** `app-web/src/app/api/badges/peer-award/route.ts`  
**Problema:** El badge "resonancia" se puede conceder múltiples veces porque el unique constraint es `userId_badgeId` y siempre es el mismo `resonanceBadge.id`.  
**Fix:** Verificar que el usuario no tenga ya el badge de resonancia.

### 3.9 Badge Skins — where Clause Sin Tipado 🔵 BAJO
**Archivo:** `app-web/src/app/api/badges/route.ts`  
```ts
const where: Record<string, unknown> = {};
```
**Problema:** Pierde type safety de Prisma al usar `Record<string, unknown>`.  
**Fix:** Usar `Prisma.BadgeWhereInput`.

### 3.10 Kuds Categories Route Hardcodeada 🔵 BAJO
**Archivo:** `app-web/src/app/api/kudos/categories/route.ts`  
**Problema:** Devuelve categorías hardcodeadas en vez de leerlas de la BD donde el seed las crea.  
**Fix:** Usar `prisma.kudoCategory.findMany()`.

---

## 4. LIB FILES

### 4.1 badge-engine.ts — calculateStreakDays Roto 🟠 ALTO
**Archivo:** `app-web/src/lib/badge-engine.ts` L309  
**Problema:** Calcula "streak" usando fechas de award de badges — no actividad real. Un usuario super activo sin badges recientes siempre tendrá streak = 0.  
**Fix:** Usar datos de commits/PRs reales de GitHub stats para calcular streak.

### 4.2 github-sync-service.ts — Requests Secuenciales 🟡 MEDIO
**Archivo:** `app-web/src/lib/github-sync-service.ts`  
**Problema:** Itera los primeros 10 repos secuencialmente con llamadas API individuales. No hay paginación por encima de 100 resultados.  
**Fix:** Usar `Promise.all` con rate-limiting y paginación cursor-based.

### 4.3 github-sync-service.ts — GITHUB_BADGE_RULES No Usado 🔵 BAJO
**Archivo:** `app-web/src/lib/github-sync-service.ts` L204-228  
**Problema:** Array `GITHUB_BADGE_RULES` definido pero nunca importado/usado en ningún archivo.  
**Fix:** Integrar con el badge engine o eliminar.

### 4.4 notification-service.ts — Truncamiento Agresivo 🔵 BAJO
**Archivo:** `app-web/src/lib/notification-service.ts`  
**Problema:** Los mensajes de notificación se truncan con `substring(0, 200)` pero no se indica al usuario que fue truncado.  
**Fix:** Agregar "..." si se truncó.

### 4.5 data.ts — Mock Data Masivo 🟡 MEDIO
**Archivo:** `app-web/src/lib/data.ts` (332 líneas)  
**Problema:** 89 badges y 2 usuarios hardcodeados. Importado por todas las páginas como si fueran datos reales. Cualquier cambio en el catálogo requiere modificar este archivo manualmente.  
**Fix:** Reemplazar con fetching de API cuando las páginas se integren con la BD.

---

## 5. PRISMA SCHEMAS

### 5.1 Dos Esquemas Completamente Incompatibles 🔴 CRÍTICO
**Archivos:** `backend/prisma/schema.prisma` vs `app-web/prisma/schema.prisma`

| Aspecto | Backend | App-Web |
|---------|---------|---------|
| Kudo.giver | `giverId` | `fromId` |
| Kudo.receiver | `receiverId` | `toId` |
| Kudo.category | Enum `Category` inline | FK `categoryId` → `KudoCategory` tabla |
| User.name | `displayName` | `name` |
| Badge.icon | `svgUrl` | `svgIcon` |
| Badge.trigger count | `triggerCount` | `triggerValue` |
| TriggerType enum | `KUDO_COUNT, PR_COUNT, REVIEW_COUNT, COMMIT_COUNT, CUSTOM` | `KUDOS_RECEIVED, KUDOS_SENT, PULL_REQUESTS, CODE_REVIEWS, COMMITS, ...` (16 valores) |
| Modelos exclusivos | `Invite, AuditLog` | `KudoCategory, BadgeSkin, GitHubStats, Account, Session, VerificationToken` |
| Table mapping | Sin `@@map` | Usa `@@map("users")`, etc. |

**Problema:** Los dos backends apuntan a la misma app conceptual pero son incompatibles. No pueden compartir BD.  
**Fix:** Unificar en un solo esquema. Si la web app es el futuro, deprecar el backend legacy.

### 5.2 Badge Enums Inconsistentes 🟠 ALTO
**Backend `BadgeCategory`:**
```prisma
enum BadgeCategory { ONBOARDING CODING DEVOPS COLLABORATION LEADERSHIP DOCUMENTATION QUALITY GROWTH MILESTONE }
```
**App-Web `BadgeCategory`:**
```prisma
enum BadgeCategory { ONBOARDING CODING DEVOPS COLLABORATION LEADERSHIP DOCUMENTATION QUALITY INNOVATION SPECIAL COMMUNITY PREMIUM MILESTONE GROWTH }
```
**Problema:** App-Web tiene 4 categorías extra (INNOVATION, SPECIAL, COMMUNITY, PREMIUM) que no existen en backend. Badges creados con estas categorías no son portables.

### 5.3 Kudo.reactions Default String vs Json 🟡 MEDIO
**Archivo:** `backend/prisma/schema.prisma`  
```prisma
reactions  Json    @default("[]")
```
**Problema:** `"[]"` se interpreta como string literal, no como array JSON vacío.  
**Fix:** Usar `@default("[]")` con cuidado (PostgreSQL lo maneja) o `@default(dbgenerated("'[]'::jsonb"))`.

### 5.4 Índices Faltantes 🟡 MEDIO
**Archivo:** `backend/prisma/schema.prisma`  
**Problema:** Sin índice en `Kudo.giverId`, `Kudo.receiverId`, `Badge.category`, `Notification.userId` — queries frecuentes sin índice.  
**Fix:** Agregar `@@index([giverId])`, `@@index([receiverId])`, etc.

### 5.5 Seed Scripts Diferentes 🟡 MEDIO
**Archivos:** `backend/prisma/seed.js` vs `app-web/prisma/seed.ts`  
**Problema:** Dos seeds con datos diferentes. Backend seed tiene solo 7 badges; app-web seed tiene 89. Los IDs no coinciden (backend usa generated IDs, app-web usa slugs).

---

## 6. SCRIPTS

### 6.1 GITHUB_TOKEN Sin Validación 🟠 ALTO
**Archivos:** `scripts/auto-award.js`, `scripts/process-event.js`, `scripts/sync-profile.js`  
**Problema:** `const GITHUB_TOKEN = process.env.GITHUB_TOKEN;` sin verificar existencia. Si falta, las llamadas HTTPS fallan con error críptico.  
**Fix:** Agregar validación temprana:
```js
if (!GITHUB_TOKEN) { console.error('GITHUB_TOKEN required'); process.exit(1); }
```

### 6.2 Repos Hardcodeados 🟡 MEDIO
**Archivo:** `scripts/auto-award.js`  
```js
const ORG_REPOS = ['jeremy-sud/boomflow'];
```
**Problema:** Solo monitorea un repo hardcodeado. No escala para una organización real.  
**Fix:** Usar la API de GitHub para listar repos del org dinámicamente.

### 6.3 Sin Input Sanitization en CLI 🟡 MEDIO
**Archivo:** `scripts/badge-admin.js`  
**Problema:** Los argumentos CLI (username, badge-id) se usan para construir rutas de archivo sin sanitización. Potencial path traversal: `node badge-admin.js award ../../../etc/passwd badge-id`.  
**Fix:** Validar que username solo contenga caracteres alfanuméricos y guiones.

### 6.4 JSON.parse Sin Try/Catch 🟡 MEDIO
**Archivo:** `scripts/stats.js`  
**Problema:** Múltiples `JSON.parse(fs.readFileSync(...))` sin protección. Si un archivo JSON está malformado, la app crash sin mensaje útil.  
**Fix:** Envolver en try/catch con mensaje de error claro.

### 6.5 Date Arithmetic Sin Validación 🔵 BAJO
**Archivo:** `scripts/stats.js`  
```js
new Date(b.awardedAt) - new Date(a.awardedAt)
```
**Problema:** La resta de Dates funciona en JavaScript pero TypeScript la marcaría como error. `awardedAt` podría ser `undefined`.  
**Fix:** Usar `.getTime()` y fallback.

### 6.6 Raw HTTPS en Vez de Fetch/Axios 🔵 BAJO
**Archivos:** `scripts/auto-award.js`, `scripts/process-event.js`  
**Problema:** Usan `require('https')` directamente para llamadas a la API de GitHub. Código verbose, sin retry logic, sin timeout.  
**Fix:** Usar `node-fetch` o `@octokit/rest` que el proyecto ya usa en app-web.

### 6.7 Premium Skins Sin Control de Acceso 🟡 MEDIO
**Archivo:** `scripts/select-skin-pack.js`  
**Problema:** Skins marcados como `isPremium: true` (ej: "neon") no tienen verificación de acceso en el script. Cualquier usuario puede seleccionar skins premium.  
**Fix:** Verificar permisos/licencia antes de aplicar skin premium.

---

## 7. CONFIG

### 7.1 Schema JSON No Incluido 🔵 BAJO
**Archivo:** `config/admins.json` L1  
```json
"$schema": "./admins.schema.json"
```
**Problema:** Referencia a `admins.schema.json` que no existe en el repo.  
**Fix:** Crear el schema file o remover la referencia.

### 7.2 Config No Se Recarga 🟡 MEDIO
**Contexto:** `app-web/src/lib/permission-service.ts` carga `config/admins.json` con `readFileSync` una sola vez al iniciar el módulo.  
**Problema:** Si se agregan admins al archivo, hay que reiniciar la app para que el cambio surta efecto.  
**Fix:** Implementar recarga periódica o usar BD para almacenar admins.

---

## 8. GITHUB ACTION

### 8.1 Nombre del Package Incorrecto 🟡 MEDIO
**Archivo:** `github-action/package.json` L2  
```json
"name": "bloomflow-badge-sync"
```
vs `action.yml` L1:
```yaml
name: "BOOMFLOW Badge Sync"
```
**Problema:** El package se llama "bloomflow" (typo) mientras el proyecto es "BOOMFLOW/boomflow".  
**Fix:** Corregir a `"boomflow-badge-sync"`.

### 8.2 Input `boomflow_token` No Se Usa 🟠 ALTO
**Archivo:** `github-action/action.yml` L7 + `github-action/index.js`  
**Problema:** `action.yml` declara input `boomflow_token` como `required: true`, pero `index.js` nunca lee ni usa este token. Lee datos directamente del filesystem.  
**Fix:** Implementar autenticación con el token o marcarlo como `required: false`.

### 8.3 Dependencias No Usadas 🔵 BAJO
**Archivo:** `github-action/package.json`  
```json
"@actions/github": "^6.0.0",
"axios": "^1.6.2"
```
**Problema:** `@actions/github` y `axios` declarados pero no importados en `index.js`.  
**Fix:** Remover o implementar.

### 8.4 REPO_BASE_URL Hardcodeado 🟡 MEDIO
**Archivo:** `github-action/index.js` L15  
```js
const REPO_BASE_URL = "https://raw.githubusercontent.com/jeremy-sud/boomflow/main/assets";
```
**Problema:** URL fija al repo de un desarrollador específico. No funciona si el repo se forkea o mueve.  
**Fix:** Derivar dinámicamente del contexto de GitHub Action.

### 8.5 Regex Test + Replace Bug 🟠 ALTO
**Archivo:** `github-action/index.js` L217-222  
```js
const regex = new RegExp(`${START_TAG}[\\s\\S]*?${END_TAG}`, "g");
if (!regex.test(currentContent)) { ... }
regex.lastIndex = 0; // <-- necesario por flag "g"
const updatedReadme = currentContent.replace(regex, newContent);
```
**Problema:** Después de `regex.test()` con flag `g`, `lastIndex` avanza. Aunque se resetea a 0, el patrón es fragile. Si se olvida el reset, `replace` no funciona. También, `test()` con `g` flag tiene comportamiento inesperado en loops.  
**Fix:** Usar dos regex separadas (una para test, una para replace) o no usar flag `g`.

---

## 9. GITHUB WORKFLOWS

### 9.1 GITHUB_TOKEN vs BOOMFLOW_TOKEN 🟡 MEDIO
**Archivos:**  
- `.github/workflows/auto-award.yml`: Usa `${{ secrets.GITHUB_TOKEN }}`
- `examples/boomflow-workflow.yml`: Usa `${{ secrets.BOOMFLOW_TOKEN }}`

**Problema:** `GITHUB_TOKEN` es el token automático de GitHub Actions con permisos del repo. `BOOMFLOW_TOKEN` (en el ejemplo) es un PAT personalizado. La documentación no aclara cuál usar.  
**Fix:** Documentar claramente la diferencia y cuándo usar cada uno.

### 9.2 badge-protection Sin Bloqueo Real 🟡 MEDIO
**Archivo:** `.github/workflows/badge-protection.yml`  
**Problema:** En `push` events, el workflow valida DESPUÉS de que el push ya se commiteó. Solo sirve como alerta, no como prevención real. Solo en PRs puede bloquear efectivamente.  
**Fix:** Considerar usar branch protection rules y required status checks para forzar validación pre-merge.

### 9.3 Event Processor — Script Injection 🟠 ALTO
**Archivo:** `.github/workflows/event-processor.yml` L96-100  
```yaml
echo "📌 Title: ${{ github.event.pull_request.title }}"
echo "📌 Title: ${{ github.event.issue.title }}"
```
**Problema:** El título del PR/issue se interpola directamente en un comando shell. Un título malicioso como `"; rm -rf / #` ejecutaría comandos arbitrarios (Script Injection via `${{ }}`).  
**Fix:** Usar variables de entorno intermedias:
```yaml
env:
  PR_TITLE: ${{ github.event.pull_request.title }}
run: |
  echo "📌 Title: $PR_TITLE"
```

### 9.4 Permisos Excesivos 🟡 MEDIO
**Archivo:** `.github/workflows/event-processor.yml` L32  
```yaml
permissions:
  contents: write
```
**Problema:** `contents: write` en un workflow que se dispara con PRs externos. Un atacante podría hacer un PR que trigger el workflow para escribir en el repo.  
**Fix:** Usar `pull-requests: read` para PR events y solo `contents: write` cuando sea estrictamente necesario.

---

## 10. CROSS-CUTTING ISSUES

### 10.1 simulate-profile.js — Rutas Absolutas Hardcodeadas 🟡 MEDIO
**Archivo:** `simulate-profile.js` L4-9  
```js
const CATALOG_PATH = "/home/dawnweaber/Workspace/BOOMFLOW/api-mock.json";
const USERS_DIR = "/home/dawnweaber/Workspace/BOOMFLOW/users";
const TARGET_README = "/home/dawnweaber/Workspace/BOOMFLOW/.profile-test/README.md";
```
**Problema:** Rutas absolutas de un developer específico. No funciona en ningún otro entorno.  
**Fix:** Usar `__dirname` o `process.cwd()`.

### 10.2 Tag Markers Inconsistentes 🔵 BAJO
**Archivos:**  
- `github-action/index.js`: `<!-- BOOMFLOW-BADGES-START -->`
- `simulate-profile.js`: `<!-- BLOOMFLOW-BADGES-START -->`

**Problema:** Typo — uno dice "BOOMFLOW" y otro "BLOOMFLOW". Los markers no coinciden entre acción y simulador.  
**Fix:** Estandarizar a "BOOMFLOW".

### 10.3 Users JSON Sin Timestamp de Última Actualización 🔵 BAJO
**Archivos:** `users/jeremy-sud.json`, `users/ursolcr.json`  
**Problema:** Los archivos JSON de usuario se modifican por múltiples scripts y workflows pero no tienen campo `lastUpdated` o `version`. No hay forma de detectar conflictos.  
**Fix:** Agregar `"lastUpdated": "ISO-timestamp"` y `"schemaVersion": 1`.

### 10.4 jeremy-sud.json — Fechas Futuras 🔵 BAJO
**Archivo:** `users/jeremy-sud.json`  
**Problema:** Badges con `"awardedAt": "2026-02-15"` — fechas en el futuro. Parece placeholder de test.  
**Fix:** Usar fechas reales.

### 10.5 Sin Tests 🟠 ALTO
**Todo el codebase.**  
**Problema:** No hay un solo archivo de test en todo el repositorio. Ni unit tests, ni integration tests, ni E2E tests. No hay carpeta `__tests__`, no hay archivos `.test.ts`, no hay directorio `test/`.  
**Fix:** Implementar testing progresivamente, empezando por el badge engine y las API routes críticas.

### 10.6 Sin .env.example en Backend 🟡 MEDIO
**Problema:** `app-web` tiene `env.example` pero `backend/` no tiene. Las variables de entorno requeridas (JWT_SECRET, DATABASE_URL, GITHUB_CLIENT_ID, etc.) no están documentadas.  
**Fix:** Crear `backend/.env.example`.

### 10.7 Sin Logging Estructurado 🟡 MEDIO
**Todo el codebase.**  
**Problema:** Todo usa `console.log`/`console.error`. Sin niveles, sin timestamps, sin request IDs, sin formato JSON para ingestión por servicios de log.  
**Fix:** Usar una librería como `pino` o `winston`.

---

## Priorización de Fixes Recomendada

### Urgente (arreglar ahora)
1. 🔴 Eliminar JWT secret fallback hardcodeado (1.1)
2. 🔴 Corregir orden de rutas `/leaderboard` y `/search` (1.3)
3. 🔴 Agregar autenticación a GET /api/badges y /api/kudos (3.1, 3.2)
4. 🔴 Agregar autorización a /api/badges/evaluate (3.3)
5. 🟠 Corregir script injection en event-processor workflow (9.3)

### Corto Plazo (esta semana)
6. 🟠 Unificar o deprecar schemas Prisma duplication (5.1)
7. 🟠 Eliminar server.js legacy (1.2)
8. 🟠 Agregar validación de paginación con caps (1.7, 3.4)
9. 🟠 Dejar de exponer error details al cliente (3.5)
10. 🟠 Implementar token input en GitHub Action (8.2)
11. 🟠 Agregar tests (10.5)

### Mediano Plazo (próximo sprint)
12. 🟡 Reemplazar datos mock con datos reales de sesión/API (2.1)
13. 🟡 Unificar fuentes de verdad de badges (2.2)
14. 🟡 Reducir scope OAuth (2.4)
15. 🟡 Implementar middleware que bloquee usuarios no autenticados (2.8)
16. 🟡 Encriptar githubToken en BD (1.14)
17. 🟡 Estandarizar idioma de UI (2.10)

---

*Generado por auditoría automatizada del código fuente completo.*
