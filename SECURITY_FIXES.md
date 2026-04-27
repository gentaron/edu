# Security Fixes — Applied 2026-04-22

## 1. .env file leaked in git history (CRITICAL)

- **Vulnerability:** `.env` was committed in 2 historical commits (`Initial commit` and a subsequent session commit), exposing `DATABASE_URL` with a local filesystem path.
- **Fix:** Removed `.env` from entire git history using `git filter-repo --path .env --invert-paths`. Verified with `git log --all --full-history -- .env` returning empty.
- **Prevention:** `.gitignore` already contains `.env*` pattern. No actual values in `.env.example` (all placeholders).

## 2. Sentry DSN hardcoded (NONE)

- **Status:** Already secure. Both `sentry.client.config.ts` and `sentry.server.config.ts` use `process.env.NEXT_PUBLIC_SENTRY_DSN`. No hardcoded DSN found.

## 3. NextAuth secret hardcoded (NONE)

- **Status:** Already secure. `NEXTAUTH_SECRET` is read from environment variables via standard NextAuth configuration. Grep for hardcoded secrets, tokens, passwords, API keys, and GitHub PATs in `src/` returned zero matches.

## 4. WebSocket endpoint unprotected (HIGH)

- **Vulnerability:** `examples/websocket/server.ts` had no authentication, wide-open CORS (`origin: "*"`), and no rate limiting.
- **Fix:**
  - Added session validation middleware: rejects connections without auth token in production. Dev mode allows unauthenticated connections with a warning.
  - Added per-IP rate limiting: 10 connections per second window. Excess connections are rejected with "Rate limit exceeded".
  - Replaced CORS `origin: "*"` with `process.env.WS_ALLOWED_ORIGIN` (defaults to `http://localhost:3000`).
  - Added placeholder for NextAuth JWT verification (commented, ready to enable when session integration is implemented).

## 5. SQL injection in API routes (NONE)

- **Status:** All API routes under `src/app/api/` use Prisma's type-safe query builder (`findMany`, `create`). No raw SQL queries (`$queryRaw` / `$executeRaw`) were found. No SQL injection risk.

---

## Additional Notes

- `git filter-repo` rewrote all 60 commits. Force-push is required (`git push --force`).
- The `examples/` directory is excluded from TypeScript compilation via `tsconfig.json`.
