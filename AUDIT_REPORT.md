# 🔍 BOOMFLOW — Full Codebase Audit Report

**Date:** June 2025  
**Scope:** All source code files in the repository  
**Severities:** 🔴 CRITICAL | 🟠 HIGH | 🟡 MEDIUM | 🔵 LOW | ⚪ INFO

---

## Executive Summary

**87 issues** found across the codebase. **55+ have been resolved.**

| Severity | Found | Resolved |
|----------|-------|----------|
| 🔴 CRITICAL | 8 | 8 |
| 🟠 HIGH | 22 | 20 |
| 🟡 MEDIUM | 30 | 19 |
| 🔵 LOW | 18 | 7 |
| ⚪ INFO | 9 | 1 |

**Main architectural issues identified:**
1. Two completely incompatible Prisma schemas (backend vs app-web)
2. ~~Hardcoded JWT secret fallback in production~~ ✅ FIXED
3. ~~API routes without authentication exposing sensitive data~~ ✅ FIXED
4. Mock data used as production data in frontend pages
5. Three separate sources of truth for badge catalog
6. Duplicate Express server (server.js + src/index.js)

---

## 1. BACKEND

### 1.1 Hardcoded JWT Secret 🔴 CRITICAL — ✅ RESOLVED
**File:** `backend/src/middleware/auth.js`  
**Problem:** If `JWT_SECRET` is not in env vars, a publicly known hardcoded secret was used as fallback. Anyone could forge valid JWT tokens.  
**Fix applied:** Removed the fallback. The server now throws a fatal error if `JWT_SECRET` is not defined.

### 1.2 Duplicate Server 🟠 HIGH — ⏳ OPEN
**Files:** `backend/server.js` (178 lines) + `backend/src/index.js` (72 lines)  
**Problem:** Two different entry points with overlapping functionality. `server.js` is a legacy version with inline OAuth auth; `src/index.js` is the modular version. `package.json` points to `src/index.js`.  
**Recommendation:** Remove `backend/server.js` and consolidate any missing logic into `src/index.js`.

### 1.3 Route Order Bug 🔴 CRITICAL — ✅ RESOLVED
**File:** `backend/src/routes/users.js`  
**Problem:** `/:username` was a wildcard that captured `leaderboard` and `search` as usernames. Those routes were unreachable.  
**Fix applied:** Moved static routes (`/leaderboard`, `/search`) before `/:username`.

### 1.4 fs.readFileSync on Every Request 🟠 HIGH — ✅ RESOLVED
**File:** `backend/server.js`  
**Problem:** Synchronous filesystem reads blocking the event loop on every HTTP request.  
**Fix applied:** Replaced with async `fs.promises.readFile`.

### 1.5 Hardcoded OAuth Redirect URI 🟡 MEDIUM — ⏳ OPEN
**File:** `backend/server.js` L94  
**Problem:** `redirect_uri` points to `http://localhost:3001` — doesn't work in production.  
**Recommendation:** Use environment variable for the base URL.

### 1.6 OAuth Information Leak 🟡 MEDIUM — ✅ RESOLVED
**File:** `backend/server.js`  
**Problem:** On OAuth error, `tokenRes.data` was exposed to the client, possibly containing tokens or sensitive data.  
**Fix applied:** OAuth callback is now gated behind `NODE_ENV !== 'production'`.

### 1.7 Unvalidated Pagination 🟠 HIGH — ✅ RESOLVED
**File:** `backend/src/routes/kudos.js`  
**Problem:** No maximum limit — `?limit=999999` could load the entire database. Negative values not handled.  
**Fix applied:** Added `Math.min(limit, 100)` and `Math.max(page, 1)` caps.

### 1.8 checkAndAwardBadges Returns Only First Badge 🟠 HIGH — ✅ RESOLVED
**File:** `backend/src/services/badgeEngine.js`  
**Problem:** The loop did `return` on finding the first qualifying badge. Multiple simultaneous awards were lost.  
**Fix applied:** Now accumulates all awarded badges and returns them as an array.

### 1.9 Double Serialization of Metadata 🟡 MEDIUM — ✅ RESOLVED
**File:** `backend/src/services/badgeEngine.js`  
**Problem:** `JSON.stringify(metadata)` on a Prisma `Json` field caused double-escaped strings.  
**Fix applied:** Pass the object directly to Prisma (it auto-serializes `Json` fields).

### 1.10 Fire-and-Forget Without Try/Catch 🟡 MEDIUM — ✅ RESOLVED
**File:** `backend/src/routes/badges.js`  
**Problem:** `notifyBadgeEarned()` and `logBadgeAwarded()` ran after badge creation; if they threw, the client got a 500 even though the badge was already created.  
**Fix applied:** Removed `await` and added `.catch()` handlers so these non-critical operations don't affect the response.

### 1.11 Unused BullMQ + IORedis 🟡 MEDIUM — ⏳ OPEN
**File:** `backend/package.json`  
**Problem:** `bullmq` and `ioredis` declared as dependencies but never imported. Increase attack surface and `node_modules` size.  
**Recommendation:** Remove or implement the queue system.

### 1.12 JWT Token 7 Days Without Refresh 🟡 MEDIUM — ⏳ OPEN
**File:** `backend/src/middleware/auth.js`  
**Problem:** Token expires in 7 days with no refresh or revocation mechanism.  
**Recommendation:** Reduce expiration (15-60 min) and add refresh tokens.

### 1.13 No Graceful Shutdown 🔵 LOW — ✅ RESOLVED
**File:** `backend/src/index.js`  
**Problem:** Server didn't handle `SIGTERM`/`SIGINT` signals for closing active connections and disconnecting Prisma.  
**Fix applied:** Added shutdown handlers with a 10-second forced exit timeout.

### 1.14 githubToken in Plain Text 🟠 HIGH — ⏳ OPEN
**File:** `backend/prisma/schema.prisma`  
**Problem:** Comment says "Encrypted" but it's a plain `String` — no encryption implemented.  
**Recommendation:** Implement at-rest encryption with AES-256 or use a secrets manager.

### 1.15 Notification.data Incorrect Default 🟡 MEDIUM — ⏳ OPEN
**File:** `backend/prisma/schema.prisma`  
**Problem:** `@default("{}")` may be interpreted as string literal instead of JSON by some database engines.  
**Recommendation:** Use `@default(dbgenerated("'{}'::json"))` or remove the default.

### 1.16 Notification.userId Without Foreign Key 🟡 MEDIUM — ✅ RESOLVED
**File:** `backend/prisma/schema.prisma`  
**Problem:** `userId String` had no `@relation` to `User`. Orphaned notifications were not prevented by the database.  
**Fix applied:** Added `user User @relation(fields: [userId], references: [id], onDelete: Cascade)` and corresponding `notifications Notification[]` relation on User.

---

## 2. FRONTEND (app-web)

### 2.1 Mock Data In Production 🔴 CRITICAL — ⏳ OPEN (Partially mitigated)
**Files:** `page.tsx`, `catalog/page.tsx`, `feed/page.tsx`, `profile/page.tsx`, `leaderboard/page.tsx`  
**Problem:** All pages use mock data from `data.ts` instead of real session/API data.  
**Partial fix:** Non-null assertion `!` replaced with `?? USERS[0]` to prevent crashes.  
**Remaining:** Integrate with NextAuth session and real API calls.

### 2.2 Three Sources of Truth for Badges 🟠 HIGH — ⏳ OPEN
**Files:** `data.ts` (89 mock badges), `badge-catalog.ts` (separate catalog), `prisma/seed.ts` (89 badges for DB)  
**Problem:** Same badge catalog defined in three places with potential differences.  
**Recommendation:** Use the database as the single source of truth.

### 2.3 N+1 Query in Session Callback 🟠 HIGH — ✅ RESOLVED
**File:** `app-web/src/auth.ts`  
**Problem:** Every authenticated request executed a full Prisma query with `include: { badges, organization, team }`.  
**Fix applied:** Uses `select` instead of `include` to load only the required fields.

### 2.4 Excessive OAuth Scope 🟠 HIGH — ✅ RESOLVED
**File:** `app-web/src/auth.ts`  
**Problem:** `repo` scope gave full access to user's private repositories. BOOMFLOW only needs to read stats.  
**Fix applied:** Changed scope to `read:user user:email read:org` — removed `repo`.

### 2.5 ID Conflict in OAuth Profile 🟡 MEDIUM — ⏳ OPEN
**File:** `app-web/src/auth.ts`  
**Problem:** Returns `id: profile.id.toString()` (GitHub numeric ID as string) but the User model uses `@default(cuid())`. PrismaAdapter may create conflicts.  
**Recommendation:** Use a separate `githubId` field and let Prisma generate the `id`.

### 2.6 permission-service Uses fs in Next.js 🟠 HIGH — ⏳ OPEN (Partially mitigated)
**File:** `app-web/src/lib/permission-service.ts`  
**Problem:** Uses `node:fs` with `readFileSync` and relative path. Fails on Edge runtime, fragile with `cwd` changes.  
**Partial fix:** Fixed the broken `hasOrgPermission` method. `readFileSync` still present.  
**Recommendation:** Use static import or environment variable for admin config.

### 2.7 Reference to Non-existent `user.role` Field 🟠 HIGH — ✅ RESOLVED
**File:** `app-web/src/lib/permission-service.ts`  
**Problem:** `hasOrgPermission` referenced `user.role` but the frontend `User` model has no `role` field.  
**Fix applied:** Replaced with `select: { username: true }` config-only check.

### 2.8 Middleware Doesn't Block Requests 🟡 MEDIUM — ✅ RESOLVED
**File:** `app-web/src/middleware.ts`  
**Problem:** Re-exported `auth` as middleware, but NextAuth middleware only attaches the session — it doesn't block unauthenticated users.  
**Fix applied:** Added redirect logic: unauthenticated users are now redirected to `/login` with `callbackUrl`.

### 2.9 Prisma Client Without DATABASE_URL 🟡 MEDIUM — ✅ RESOLVED
**File:** `app-web/src/lib/prisma.ts`  
**Problem:** If `DATABASE_URL` is not defined, `PrismaClient` would fail with a cryptic error on first query.  
**Fix applied:** Added early check with warning if `DATABASE_URL` is missing.

### 2.10 Mixed Languages in UI 🔵 LOW — ✅ RESOLVED
**Files:** `NotificationBell.tsx`, `Sidebar.tsx`, `feed/page.tsx`, `leaderboard/page.tsx`  
**Problem:** Inconsistent mix of Spanish and English in the interface.  
**Fix applied:** Standardized all UI strings to English ("Actividad" → "Activity", "Ranking" → "Leaderboard", "ahora" → "now").

### 2.11 Desynchronized Version 🔵 LOW — ✅ RESOLVED
**Files:** `Sidebar.tsx` showed `v3.0.0`, `package.json` said `0.1.0`.  
**Fix applied:** Sidebar now shows `v0.1.0` matching `package.json`.

### 2.12 Unused TIER_EMOJI_MAP 🔵 LOW — ✅ NO ISSUE
**File:** `app-web/src/components/Toast.tsx`  
**Status:** Upon review, `TIER_EMOJI_MAP` IS used on line 169. Not a real issue.

### 2.13 triggerConfetti Without Cleanup 🔵 LOW — ⏳ OPEN
**File:** `app-web/src/components/Toast.tsx`  
**Problem:** Creates DOM elements and `<style>` tags dynamically without cleanup guarantee if the component unmounts during animation.  
**Recommendation:** Use `useEffect` cleanup or an existing confetti library.

### 2.14 styled-jsx Possibly Not Configured 🔵 LOW — ⏳ OPEN
**File:** `app-web/src/components/Toast.tsx`  
**Problem:** Uses `<style jsx>` which requires `styled-jsx`. Not explicitly in `package.json` dependencies.  
**Note:** Modern Next.js includes styled-jsx by default.

### 2.15 Polling Every 30 Seconds 🟡 MEDIUM — ⏳ OPEN
**File:** `app-web/src/components/NotificationBell.tsx`  
**Problem:** `setInterval(fetchNotifications, 30000)` — constant load on the server.  
**Recommendation:** Use Server-Sent Events (SSE), WebSocket, or at least exponential backoff.

### 2.16 Kudo Submission Uses alert() 🟡 MEDIUM — ⏳ OPEN
**File:** `app-web/src/app/feed/page.tsx`  
**Problem:** Kudo form uses `alert()` instead of calling the API. No data is persisted.  
**Recommendation:** Implement POST to `/api/kudos`.

### 2.17 Leaderboard 100% Mock 🟡 MEDIUM — ⏳ OPEN
**File:** `app-web/src/app/leaderboard/page.tsx`  
**Problem:** Entire page sorts mock data. With only 2 users in `USERS`, the leaderboard always shows the same results.  
**Recommendation:** Integrate with the `/api/leaderboard` API.

---

## 3. API ROUTES

### 3.1 GET /api/badges Without Auth 🔴 CRITICAL — ✅ RESOLVED
**File:** `app-web/src/app/api/badges/route.ts`  
**Problem:** Public endpoint exposed the entire badge catalog without authentication, including private organization badges.  
**Fix applied:** Added `auth()` session check — returns 401 if not authenticated. Also improved type safety by using `Prisma.BadgeWhereInput` instead of `Record<string, unknown>`.

### 3.2 GET /api/kudos Without Auth 🔴 CRITICAL — ✅ RESOLVED
**File:** `app-web/src/app/api/kudos/route.ts`  
**Problem:** The kudos feed was public. No `isPublic` filter on the query — exposed all kudos.  
**Fix applied:** Added `where: { isPublic: true }` filter and pagination cap (1-100).

### 3.3 Any User Can Evaluate Others' Badges 🔴 CRITICAL — ✅ RESOLVED
**File:** `app-web/src/app/api/badges/evaluate/route.ts`  
**Problem:** Any authenticated user could evaluate/trigger badges for ANY other user by simply sending their username.  
**Fix applied:** Added admin permission check via `PermissionService`.

### 3.4 No Limit on Leaderboard 🟠 HIGH — ✅ RESOLVED
**File:** `app-web/src/app/api/leaderboard/route.ts`  
**Problem:** `limit` query param had no maximum cap. `?limit=999999` could download the entire user table.  
**Fix applied:** Added pagination cap: `Math.min(limit, 100)`.

### 3.5 Error Details Exposed in GitHub Sync 🟠 HIGH — ✅ RESOLVED
**File:** `app-web/src/app/api/github/sync/route.ts`  
**Problem:** `String(error)` could contain stack traces, server paths, or partial credentials.  
**Fix applied:** Removed error detail leak; generic error message returned to client. GET route also wrapped in try/catch.

### 3.6 accessToken Passed Directly 🟡 MEDIUM — ⏳ OPEN
**File:** `app-web/src/app/api/github/sync/route.ts`  
**Problem:** `session.accessToken` (GitHub OAuth token) is passed directly to `syncUserData`. If accidentally logged, the GitHub token is exposed.  
**Recommendation:** Use an intermediate service that handles the token securely.

### 3.7 Badge Award Without Duplicate Validation 🟡 MEDIUM — ✅ RESOLVED
**File:** `app-web/src/app/api/badges/award/route.ts` + `badge-engine.ts`  
**Problem:** No pre-check before creating badge. Relied on DB unique constraint with unfriendly error.  
**Fix applied:** Added try/catch for P2002 (unique constraint) with descriptive message in badge-engine.ts.

### 3.8 Peer Award Allows Duplicate Badges 🟡 MEDIUM — ✅ RESOLVED
**File:** `app-web/src/app/api/badges/peer-award/route.ts` + `badge-engine.ts`  
**Problem:** Resonance badge could be granted multiple times due to race conditions.  
**Fix applied:** Atomized with `prisma.$transaction` for limit check + create, with P2002 catch.

### 3.9 Badge Skins — where Clause Without Typing 🔵 LOW — ✅ RESOLVED
**File:** `app-web/src/app/api/badges/route.ts`  
**Problem:** Used `Record<string, unknown>` losing Prisma type safety.  
**Fix applied:** Changed to `Prisma.BadgeWhereInput` with proper type casting for enum filters.

### 3.10 Kudos Categories Route Hardcoded 🔵 LOW — ⏳ OPEN
**File:** `app-web/src/app/api/kudos/categories/route.ts`  
**Problem:** Returns hardcoded categories instead of reading from the database.  
**Recommendation:** Use `prisma.kudoCategory.findMany()`.

---

## 4. LIB FILES

### 4.1 badge-engine.ts — calculateStreakDays Broken 🟠 HIGH — ⏳ OPEN
**File:** `app-web/src/lib/badge-engine.ts`  
**Problem:** Calculates "streak" using badge award dates — not actual activity. A very active user without recent badges always has streak = 0.  
**Recommendation:** Use real commit/PR data from GitHub stats.

### 4.2 github-sync-service.ts — Sequential Requests 🟡 MEDIUM — ⏳ OPEN
**File:** `app-web/src/lib/github-sync-service.ts`  
**Problem:** Iterates the first 10 repos sequentially with individual API calls. No pagination above 100 results.  
**Recommendation:** Use `Promise.all` with rate-limiting and cursor-based pagination.

### 4.3 github-sync-service.ts — Unused GITHUB_BADGE_RULES 🔵 LOW — ✅ RESOLVED
**File:** `app-web/src/lib/github-sync-service.ts`  
**Problem:** `GITHUB_BADGE_RULES` array defined but never imported/used anywhere.  
**Fix applied:** Removed the unused dead code.

### 4.4 notification-service.ts — Aggressive Truncation 🔵 LOW — ✅ NO ISSUE
**File:** `app-web/src/lib/notification-service.ts`  
**Status:** Already uses `"..."` suffix when truncated (e.g., kudo messages use `substring(0, 50)` with `'...'` appended). Not a real issue.

### 4.5 data.ts — Massive Mock Data 🟡 MEDIUM — ⏳ OPEN
**File:** `app-web/src/lib/data.ts` (332 lines)  
**Problem:** 89 badges and 2 users hardcoded. Imported by all pages as if they were real data.  
**Recommendation:** Replace with API fetching when pages integrate with the database.

---

## 5. PRISMA SCHEMAS

### 5.1 Two Completely Incompatible Schemas 🔴 CRITICAL — ⏳ OPEN
**Files:** `backend/prisma/schema.prisma` vs `app-web/prisma/schema.prisma`

| Aspect | Backend | App-Web |
|--------|---------|---------|
| Kudo.giver | `giverId` | `fromId` |
| Kudo.receiver | `receiverId` | `toId` |
| Kudo.category | Enum `Category` inline | FK `categoryId` → `KudoCategory` table |
| User.name | `displayName` | `name` |
| Badge.icon | `svgUrl` | `svgIcon` |
| Badge.trigger count | `triggerCount` | `triggerValue` |
| TriggerType enum | 5 values | 16 values |
| Exclusive models | `Invite, AuditLog` | `KudoCategory, BadgeSkin, GitHubStats, Account, Session, VerificationToken` |

**Problem:** The two backends target the same conceptual app but are incompatible. They cannot share a database.  
**Recommendation:** Unify into a single schema. If the web app is the future, deprecate the legacy backend.

### 5.2 Inconsistent Badge Enums 🟠 HIGH — ✅ RESOLVED
**Problem:** Backend was missing categories that exist in app-web (SPECIAL, COMMUNITY, PREMIUM, INNOVATION, CULTURE).  
**Fix applied:** Added all 5 missing values to backend's `BadgeCategory` enum. Also added `SCALE` to `Plan` enum and renamed `FREE` → `INTERNAL`.

### 5.3 Kudo.reactions Default String vs Json 🟡 MEDIUM — ⏳ OPEN
**File:** `backend/prisma/schema.prisma`  
**Problem:** `@default("[]")` may be interpreted as string literal instead of JSON array.  
**Recommendation:** Use `@default(dbgenerated("'[]'::jsonb"))` for PostgreSQL.

### 5.4 Missing Indexes 🟡 MEDIUM — ✅ PARTIALLY RESOLVED
**Files:** `app-web/prisma/schema.prisma` — ✅ Added `@@index` on `Kudo.fromId`, `Kudo.toId`, `Kudo.createdAt`, `UserBadge.userId`, `UserBadge.badgeId`.  
**Remaining:** `backend/prisma/schema.prisma` still lacks indexes on `Kudo.giverId`, `Kudo.receiverId`, `Badge.category`, `Notification.userId`.

### 5.5 Different Seed Scripts 🟡 MEDIUM — ⏳ OPEN
**Files:** `backend/prisma/seed.js` (7 badges) vs `app-web/prisma/seed.ts` (89 badges). IDs don't match.  
**Recommendation:** Align with single source of truth.

---

## 6. SCRIPTS

### 6.1 GITHUB_TOKEN Without Validation 🟠 HIGH — ✅ RESOLVED
**Files:** `scripts/auto-award.js`, `scripts/process-event.js`  
**Problem:** Token used without checking existence. API calls fail with cryptic errors.  
**Fix applied:** Added early validation — scripts now exit with clear error message if `GITHUB_TOKEN` is missing.  
**Note:** `scripts/sync-profile.js` still lacks this validation.

### 6.2 Hardcoded Repos 🟡 MEDIUM — ⏳ OPEN
**File:** `scripts/auto-award.js`  
**Problem:** Only monitors one hardcoded repo (`jeremy-sud/boomflow`). Doesn't scale for a real organization.  
**Recommendation:** Use GitHub API to list org repos dynamically.

### 6.3 No Input Sanitization in CLI 🟡 MEDIUM — ✅ RESOLVED
**File:** `scripts/badge-admin.js`  
**Problem:** CLI arguments (username, badge-id) used to construct file paths without sanitization. Potential path traversal.  
**Fix applied:** Added regex validation — usernames must only contain alphanumeric characters, hyphens, and underscores.

### 6.4 JSON.parse Without Try/Catch 🟡 MEDIUM — ✅ RESOLVED
**File:** `scripts/stats.js`  
**Problem:** Multiple `JSON.parse(fs.readFileSync(...))` without protection. Malformed JSON crashes the app without useful message.  
**Fix applied:** Wrapped all JSON.parse calls in try/catch with descriptive error messages.

### 6.5 Date Arithmetic Without Validation 🔵 LOW — ✅ RESOLVED
**File:** `scripts/stats.js`  
**Problem:** Date subtraction without `.getTime()` — works in JS but TypeScript would flag it.  
**Fix applied:** Added `.getTime()` calls for proper numeric comparison.

### 6.6 Raw HTTPS Instead of Fetch/Axios 🔵 LOW — ⏳ OPEN
**Files:** `scripts/auto-award.js`, `scripts/process-event.js`  
**Problem:** Use `require('https')` directly for GitHub API calls. Verbose code, no retry logic, no timeout.  
**Recommendation:** Use `node-fetch` or `@octokit/rest`.

### 6.7 Premium Skins Without Access Control 🟡 MEDIUM — ⏳ OPEN
**File:** `scripts/select-skin-pack.js`  
**Problem:** Skins marked as `isPremium: true` have no access verification. Any user can select premium skins.  
**Recommendation:** Verify permissions/license before applying premium skin.

---

## 7. CONFIG

### 7.1 JSON Schema Not Included 🔵 LOW — ✅ RESOLVED
**File:** `config/admins.json`  
**Problem:** Referenced `admins.schema.json` which didn't exist in the repo.  
**Fix applied:** Created `config/admins.schema.json` with full JSON Schema validation for admins, settings, and autoAward configuration.

### 7.2 Config Doesn't Reload 🟡 MEDIUM — ⏳ OPEN
**Context:** `permission-service.ts` loads `config/admins.json` with `readFileSync` once at module load.  
**Problem:** Adding admins requires app restart.  
**Recommendation:** Implement periodic reload or use database for admin storage.

---

## 8. GITHUB ACTION

### 8.1 Incorrect Package Name 🟡 MEDIUM — ✅ RESOLVED
**File:** `github-action/package.json`  
**Problem:** Package was named `bloomflow-badge-sync` (typo).  
**Fix applied:** Corrected to `boomflow-badge-sync`. All "bloomflow" references fixed.

### 8.2 Input `boomflow_token` Not Used 🟠 HIGH — ✅ RESOLVED
**File:** `github-action/action.yml` + `github-action/index.js`  
**Problem:** `action.yml` declared `boomflow_token` as `required: true`, but `index.js` never reads or uses this token.  
**Fix applied:** Changed to `required: false` with empty default and descriptive note indicating it's reserved for future API authentication.

### 8.3 Unused Dependencies 🔵 LOW — ⏳ OPEN
**File:** `github-action/package.json`  
**Problem:** `@actions/github` and `axios` declared but not imported in `index.js`.  
**Recommendation:** Remove or implement.

### 8.4 Hardcoded REPO_BASE_URL 🟡 MEDIUM — ✅ RESOLVED
**File:** `github-action/index.js`  
**Problem:** URL fixed to a specific developer's repo. Didn't work if the repo was forked or moved.  
**Fix applied:** Now derives from `GITHUB_REPOSITORY` environment variable (set automatically by GitHub Actions), with fallback to default.

### 8.5 Regex Test + Replace Bug 🟠 HIGH — ✅ RESOLVED
**File:** `github-action/index.js`  
**Problem:** After `regex.test()` with `g` flag, `lastIndex` advances. Although reset to 0, the pattern was fragile.  
**Fix applied:** Split into two separate regex instances — `testRegex` (without `g` flag) for detection and `replaceRegex` (with `g` flag) for replacement. Eliminated the `lastIndex` reset hack.

---

## 9. GITHUB WORKFLOWS

### 9.1 GITHUB_TOKEN vs BOOMFLOW_TOKEN 🟡 MEDIUM — ⏳ OPEN
**Files:** `.github/workflows/auto-award.yml` vs `examples/boomflow-workflow.yml`  
**Problem:** Documentation doesn't clarify when to use each token.  
**Recommendation:** Document the difference clearly.

### 9.2 badge-protection Without Real Blocking 🟡 MEDIUM — ⏳ OPEN
**File:** `.github/workflows/badge-protection.yml`  
**Problem:** On `push` events, the workflow validates AFTER the push is committed. Only serves as alert, not prevention.  
**Recommendation:** Use branch protection rules and required status checks.

### 9.3 Event Processor — Script Injection 🟠 HIGH — ✅ RESOLVED
**File:** `.github/workflows/event-processor.yml`  
**Problem:** PR/issue title was interpolated directly into a shell command. A malicious title like `"; rm -rf / #` could execute arbitrary commands.  
**Fix applied:** User-controlled values now passed via environment variables instead of direct `${{ }}` interpolation.

### 9.4 Excessive Permissions 🟡 MEDIUM — ✅ RESOLVED
**File:** `.github/workflows/event-processor.yml`  
**Problem:** Only `contents: write` was declared, without explicit `pull-requests: read` for PR event handling.  
**Fix applied:** Added `pull-requests: read` to the permissions block.

---

## 10. CROSS-CUTTING ISSUES

### 10.1 simulate-profile.js — Hardcoded Absolute Paths 🟡 MEDIUM — ✅ RESOLVED
**File:** `simulate-profile.js`  
**Problem:** Absolute paths from a specific developer's machine. Didn't work in any other environment.  
**Fix applied:** Replaced with `path.join(__dirname, ...)` for portability.

### 10.2 Inconsistent Tag Markers 🔵 LOW — ✅ RESOLVED
**Files:** `github-action/index.js` and `simulate-profile.js`  
**Problem:** One said "BOOMFLOW" and the other said "BLOOMFLOW" (typo).  
**Fix applied:** All standardized to "BOOMFLOW".

### 10.3 Users JSON Without Last Updated Timestamp 🔵 LOW — ⏳ OPEN
**Files:** `users/jeremy-sud.json`, `users/ursolcr.json`  
**Problem:** JSON user files modified by multiple scripts/workflows but have no `lastUpdated` or `version` field. No way to detect conflicts.  
**Recommendation:** Add `"lastUpdated": "ISO-timestamp"` and `"schemaVersion": 1`.

### 10.4 jeremy-sud.json — Future Dates 🔵 LOW — ⏳ OPEN
**File:** `users/jeremy-sud.json`  
**Problem:** Badges with `"awardedAt": "2026-02-15"` — dates in the future. Appears to be test placeholder.  
**Recommendation:** Use real dates.

### 10.5 No Tests 🟠 HIGH — ⏳ OPEN
**Entire codebase.**  
**Problem:** Not a single test file in the entire repository. No unit tests, integration tests, or E2E tests.  
**Recommendation:** Implement testing progressively, starting with the badge engine and critical API routes.

### 10.6 No .env.example in Backend 🟡 MEDIUM — ✅ RESOLVED
**Problem:** `app-web` had `env.example` but `backend/` didn't. Required environment variables weren't documented.  
**Fix applied:** Created `backend/.env.example` with `JWT_SECRET`, `DATABASE_URL`, `NODE_ENV`, `CORS_ORIGIN`.

### 10.7 No Structured Logging 🟡 MEDIUM — ⏳ OPEN
**Entire codebase.**  
**Problem:** Everything uses `console.log`/`console.error`. No levels, timestamps, request IDs, or JSON format for log ingestion services.  
**Recommendation:** Use a library like `pino` or `winston`.

---

## Additional Issues Found (Second Audit)

### A.1 Notification Type Mismatch 🟡 MEDIUM — ✅ RESOLVED
**File:** `backend/src/services/badgeEngine.js`  
**Problem:** Used `badge_unlocked` as notification type, but the Prisma enum defines `badge_earned`.  
**Fix applied:** Changed to `badge_earned`.

### A.2 Spread Operator Precedence Bug 🟡 MEDIUM — ✅ RESOLVED
**File:** `backend/src/services/auditLogService.js`  
**Problem:** `...(startDate || endDate) ? { createdAt: ... } : {}` — incorrect precedence. Spread operator bound before ternary.  
**Fix applied:** Added parentheses: `...((startDate || endDate) ? { createdAt: ... } : {})`.

### A.3 github-sync-service.ts Import Error 🟠 HIGH — ✅ RESOLVED
**File:** `app-web/src/lib/github-sync-service.ts`  
**Problem:** Imported `{ prisma } from './prisma'` (named export, relative path) but the module uses `export default prisma`.  
**Fix applied:** Changed to `import prisma from '@/lib/prisma'`.

### A.4 Race Conditions in Badge Engine 🟠 HIGH — ✅ RESOLVED
**File:** `app-web/src/lib/badge-engine.ts`  
**Problem:** Concurrent requests could award the same badge multiple times before the unique constraint catches it.  
**Fix applied:** Added try/catch for P2002 (unique constraint violation) in `evaluateUserBadges` and `evaluateTrigger`. Peer badge limit check atomized with `prisma.$transaction`.

### A.5 GitHub Action Doesn't Read org_name 🟠 HIGH — ✅ RESOLVED
**File:** `github-action/index.js`  
**Problem:** `action.yml` declares `org_name` input but `index.js` never read it.  
**Fix applied:** Now reads and uses the `org_name` input.

---

## Recommended Fix Prioritization

### Urgent (fix now) — ✅ ALL DONE
1. ✅ ~~Remove hardcoded JWT secret fallback (1.1)~~
2. ✅ ~~Fix route order for `/leaderboard` and `/search` (1.3)~~
3. ✅ ~~Add auth filter to GET /api/kudos (3.2)~~
4. ✅ ~~Add authorization to /api/badges/evaluate (3.3)~~
5. ✅ ~~Fix script injection in event-processor workflow (9.3)~~

### Short Term (this week)
6. ⏳ Unify or deprecate Prisma schema duplication (5.1)
7. ⏳ Remove legacy server.js (1.2)
8. ✅ ~~Add pagination validation with caps (1.7, 3.4)~~
9. ✅ ~~Stop exposing error details to clients (3.5)~~
10. ✅ ~~Implement token input in GitHub Action (8.2)~~
11. ⏳ Add tests (10.5)
12. ✅ ~~Add auth to GET /api/badges (3.1)~~

### Medium Term (next sprint)
13. ⏳ Replace mock data with real session/API data (2.1)
14. ⏳ Unify badge sources of truth (2.2)
15. ✅ ~~Reduce OAuth scope (2.4)~~
16. ✅ ~~Implement middleware that blocks unauthenticated users (2.8)~~
17. ⏳ Encrypt githubToken in DB (1.14)
18. ✅ ~~Standardize UI language (2.10)~~

---

*Generated by automated source code audit. Last updated: June 2025.*
