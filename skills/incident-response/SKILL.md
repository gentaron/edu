---
name: incident-response
slug: incident
version: 1.0.0
description: "Production incident response runbook for Next.js + PostgreSQL + WebSocket applications. Use when: service is down, errors spiking, security breach suspected, users can't log in, battle game broken, incident, outage, production issue."
argument-hint: "Describe the symptoms you're seeing in production"
---

# Incident Response Skill

## When to Use

- Production errors spiking in Sentry
- Service returning 5xx or not responding
- WebSocket connections dropping en masse
- Suspected security breach or unauthorized access
- Database connection exhaustion

---

## Severity Levels

| Level | Label | Definition | Response Time |
|-------|-------|-----------|--------------|
| **P0** | Critical | Full service down, data loss risk, security breach | Immediate |
| **P1** | High | Core feature broken (card game, login, wiki) | < 30 min |
| **P2** | Medium | Degraded experience, partial feature failure | < 2 hours |
| **P3** | Low | Minor bug, cosmetic issue, single-user report | Next sprint |

---

## Response Workflow

```
DETECT
  Sentry alert / user report / monitoring alert
       ↓
TRIAGE (5 min)
  Confirm the issue is real → assign severity → notify if P0/P1
       ↓
MITIGATE (15 min)
  Stop the bleeding — rollback, feature flag, rate limit, take offline
       ↓
INVESTIGATE
  Find root cause using logs, Sentry, DB queries
       ↓
FIX
  Deploy fix or permanent mitigation
       ↓
POST-MORTEM (within 48h for P0/P1)
  Document timeline, root cause, prevention
```

---

## Immediate Actions (First 5 Minutes)

- [ ] Check Sentry — error rate, affected users, first occurrence
- [ ] Check Netlify — latest deployment status, recent deploy time
- [ ] Check application logs for stack traces
- [ ] Determine: *Did this start after a deploy?* → rollback candidate
- [ ] Determine: *Is the database reachable?* → run `prisma db ping` equivalent
- [ ] Determine: *Are WebSocket connections failing?* → check mini-service logs

---

## Common Incident Patterns

| Symptom | Likely Cause | Mitigation | Fix |
|---------|-------------|-----------|-----|
| All pages 500 | Failed deploy / TS runtime error | Rollback to last good deploy | Fix error, redeploy |
| Login broken | NEXTAUTH_SECRET missing or rotated | Restore secret in Netlify env | Redeploy with correct secret |
| DB connection errors | Connection pool exhausted | Restart DB connection pool | Add `connection_limit` to DATABASE_URL |
| WebSocket drops | Mini-service crashed | Restart mini-service process | Fix crash, add auto-restart |
| Slow page loads | DB query timeout | Check slow query log | Add index or optimize query |
| 429 Too Many Requests | Rate limiter too aggressive | Temporarily raise rate limit | Tune limit values |
| Card game state corrupt | Zustand localStorage mismatch | Clear localStorage in browser | Version the store schema |
| Images not loading | External image repo moved | Update `next.config` image domains | Fix source URLs |

---

## Rollback Procedure

### Netlify (fastest — 30 seconds)
```
1. Go to Netlify → Site → Deploys
2. Find last successful deploy
3. Click "Publish deploy"
4. Verify site is back up
```

### Database Migration Rollback
```bash
# Check current migration state
bun run prisma migrate status

# If latest migration caused issues — mark as rolled back
bun run prisma migrate resolve --rolled-back <migration-name>

# Restore from snapshot (if data was corrupted)
# → restore from your pre-deploy backup
```

---

## Security Incident Checklist

Triggered by: suspicious traffic, data breach report, unauthorized access.

- [ ] Preserve evidence — copy logs before rotating or clearing
- [ ] Identify the attack vector (compromised secret, SQL injection, session hijack)
- [ ] Revoke compromised credentials immediately (rotate `NEXTAUTH_SECRET`, DB password)
- [ ] Enable emergency rate limiting (lower `RATE_LIMIT_MAX` in env and redeploy)
- [ ] Block offending IPs at Caddy level if DDoS
- [ ] Audit recent DB writes for unauthorized changes
- [ ] Notify affected users if PII was accessed
- [ ] File a report in `SECURITY_FIXES.md` with timeline and resolution

---

## Post-Mortem Template

```markdown
## Incident: <title>
**Date:** YYYY-MM-DD  
**Severity:** P0 / P1 / P2  
**Duration:** X hours Y minutes  
**Impact:** N users affected, feature X unavailable  

### Timeline
| Time (JST) | Event |
|-----------|-------|
| HH:MM | Issue first detected |
| HH:MM | Severity assessed as PX |
| HH:MM | Mitigation applied |
| HH:MM | Service restored |
| HH:MM | Root cause confirmed |

### Root Cause
[Single clear sentence stating what went wrong]

### Contributing Factors
- Factor 1
- Factor 2

### Resolution
[What was done to fix it]

### Prevention
- [ ] Action item 1 (owner, deadline)
- [ ] Action item 2 (owner, deadline)
```

---

## Scope

This skill ONLY:
- Guides incident triage, response, and post-mortem writing
- Provides checklists, patterns, and runbook steps
- Stores incident history when explicitly requested in `~/incident/memory.md`

This skill NEVER:
- Executes rollbacks or commands automatically
- Accesses production systems directly
- Shares incident details with external services

---

## External Endpoints

| Endpoint | Data Sent | Purpose |
|----------|-----------|---------|
| None | None | N/A |

---

## Security & Privacy

**Data that stays local:**
- Log snippets and error details you share in conversation
- Incident notes in `~/incident/memory.md`

**Data that leaves your machine:**
- None. This skill makes no network requests.
- Treat log data as sensitive — avoid sharing PII from logs in this chat.
