---
name: devops
slug: devops
version: 1.0.0
description: "CI/CD pipeline management for Next.js projects using GitHub Actions, Netlify, and Caddy reverse proxy. Use when: creating workflows, debugging deployments, configuring Netlify, managing secrets, setting up CI, devops, deploy, pipeline, CI/CD."
argument-hint: "Describe the pipeline task or deployment issue"
---

# DevOps Skill

## When to Use

- Creating or editing GitHub Actions workflows
- Debugging a failed Netlify build
- Configuring Caddy reverse proxy for a new service
- Managing secrets, environment variables, or branch deploy rules

---

## CI Pipeline Structure

| Stage | Tool | Trigger | Failure Stops Pipeline |
|-------|------|---------|----------------------|
| **Lint** | `bun run lint` | Every push | Yes |
| **Type Check** | `bun run tsc --noEmit` | Every push | Yes |
| **Unit Tests** | `bun run test` | Every push | Yes |
| **Build** | `bun run build` | PR + main | Yes |
| **Deploy Preview** | Netlify | PR opened/updated | No (warning only) |
| **Deploy Production** | Netlify | Push to main | Yes |

---

## GitHub Actions Patterns

### Bun + Cache
```yaml
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: latest

- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: ~/.bun/install/cache
    key: ${{ runner.os }}-bun-${{ hashFiles('bun.lockb') }}

- run: bun install --frozen-lockfile
```

### Next.js Build Cache
```yaml
- name: Cache Next.js build
  uses: actions/cache@v4
  with:
    path: .next/cache
    key: ${{ runner.os }}-nextjs-${{ hashFiles('bun.lockb') }}-${{ hashFiles('**/*.ts','**/*.tsx') }}
```

### Parallel Jobs
```yaml
jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps: [checkout, setup-bun, install, lint, typecheck]
  test:
    runs-on: ubuntu-latest
    steps: [checkout, setup-bun, install, test]
  build:
    needs: [lint-and-typecheck, test]   # waits for both
    runs-on: ubuntu-latest
    steps: [checkout, setup-bun, install, build]
```

### Secrets Usage
```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```
Never hardcode secrets. Store in **GitHub → Settings → Secrets and variables → Actions**.

---

## Netlify Configuration (`netlify.toml`)

```toml
[build]
  command = "bun run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  BUN_VERSION = "latest"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  environment = { NODE_ENV = "production" }
```

**Common Netlify Build Failures:**

| Error | Cause | Fix |
|-------|-------|-----|
| `bun: not found` | Bun not installed on build image | Add `BUN_VERSION = "latest"` to `[build.environment]` |
| `Module not found` | Missing dependency | Run `bun install` locally, commit `bun.lockb` |
| `Type error` | TS error only caught on build | Run `bun run tsc --noEmit` locally before pushing |
| `Function too large` | Serverless function > 50 MB | Move large assets to CDN; split API routes |
| Out of memory | Large build | Add `NODE_OPTIONS=--max-old-space-size=4096` to build env |

---

## Caddy Configuration

```caddy
# Caddyfile
example.com {
    reverse_proxy localhost:3000

    # Route WebSocket traffic to mini-service
    handle /ws* {
        reverse_proxy localhost:3003
    }

    # Health check endpoint
    handle /health {
        respond "OK" 200
    }

    encode gzip
    log
}
```

**Notes:**
- Caddy auto-provisions HTTPS via Let's Encrypt — no manual cert setup
- Reload config: `caddy reload --config /etc/caddy/Caddyfile`
- Test config: `caddy validate --config /etc/caddy/Caddyfile`

---

## Branch Strategy

| Branch | Deploys To | Auto-Deploy | Protection |
|--------|-----------|------------|-----------|
| `main` | Production | On push | Require PR + CI pass |
| `develop` | Staging | On push | Require CI pass |
| `feature/*` | Preview URL | On PR open | None |
| `claude/*` | Preview URL | On PR open | None |

---

## Monitoring Checklist (Weekly)

- [ ] Sentry error rate < 0.1% of sessions
- [ ] Build time < 3 minutes (check Netlify deploy log)
- [ ] No secrets exposed in build logs
- [ ] GitHub Actions minutes usage within quota
- [ ] Netlify bandwidth within plan limits

---

## Scope

This skill ONLY:
- Guides CI/CD pipeline design and debugging
- Provides configuration templates and checklists
- Stores pipeline notes when explicitly requested in `~/devops/memory.md`

This skill NEVER:
- Triggers deployments or workflow runs directly
- Modifies secrets or environment variables in external systems
- Makes network requests

---

## External Endpoints

| Endpoint | Data Sent | Purpose |
|----------|-----------|---------|
| None | None | N/A |

---

## Security & Privacy

**Data that stays local:**
- Workflow files and config you share in conversation
- Notes in `~/devops/memory.md`

**Data that leaves your machine:**
- None. This skill makes no network requests.
- Never paste secret values or tokens into this chat.
