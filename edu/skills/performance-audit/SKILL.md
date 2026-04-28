---
name: performance-audit
slug: perf
version: 1.0.0
description: "Performance audit workflow for Next.js (App Router) applications. Use when: improving page load speed, fixing Core Web Vitals, reducing bundle size, optimizing images, Lighthouse score dropped, users reporting slowness, performance audit, perf."
argument-hint: "Describe the performance issue or paste Lighthouse scores"
---

# Performance Audit Skill

## When to Use

- Lighthouse score dropped below targets
- Users reporting slow page loads or janky animations
- Pre-release performance gate check
- Bundle size grew significantly after a feature addition

---

## Core Web Vitals Targets

| Metric | Full Name | Target | Failing |
|--------|-----------|--------|---------|
| **LCP** | Largest Contentful Paint | < 2.5s | > 4.0s |
| **FID** | First Input Delay | < 100ms | > 300ms |
| **CLS** | Cumulative Layout Shift | < 0.1 | > 0.25 |
| **INP** | Interaction to Next Paint | < 200ms | > 500ms |
| **TTFB** | Time to First Byte | < 800ms | > 1800ms |

---

## Audit Workflow

```
1. Lighthouse (Chrome DevTools → Incognito)
       ↓ identify failing metrics
2. @next/bundle-analyzer (ANALYZE=true bun run build)
       ↓ find large chunks
3. Network Tab (throttle to "Slow 4G")
       ↓ find blocking resources and large assets
4. React Profiler (Chrome DevTools → Profiler)
       ↓ find components with long render times
5. Fix highest-impact issues first, then re-run Lighthouse
```

---

## Next.js Specific Checks

| Area | Problem | Fix |
|------|---------|-----|
| **Images** | Raw `<img>` tags, no size specified | Use `next/image` with `width`/`height` or `fill` |
| **Fonts** | `@import` in CSS, external font URL | Use `next/font/google` — zero layout shift |
| **SSG vs SSR** | Dynamic `getServerSideProps` for static content | Switch to SSG or ISR; use `dynamic` import for heavy client components |
| **Bundle size** | Full library import (`import _ from 'lodash'`) | Named imports or tree-shakeable alternatives |
| **Client components** | `'use client'` on layout-level components | Push `'use client'` down to the smallest interactive leaf |
| **Prefetching** | Missing `<Link prefetch>` on key navigation | Next.js auto-prefetches in viewport — verify it's working |

---

## Framer Motion Tips

| Issue | Fix |
|-------|-----|
| Animation causes layout recalc | Use `transform` and `opacity` only — never animate `width`, `height`, `top`, `left` |
| Too many `motion.*` components | Use `AnimatePresence` at the boundary, not inside list items |
| Blocking main thread | Add `layout` prop only where truly needed — it's expensive |
| Mobile jank | Add `will-change: transform` sparingly; test on real device |

---

## Common Issues & Fixes

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| High LCP | Hero image not preloaded | Add `priority` prop to `next/image` above the fold |
| High CLS | Images without dimensions | Always specify `width`/`height` or `fill` on `next/image` |
| Large JS bundle | Unused shadcn/ui components imported | Import only used components; check bundle analyzer |
| Slow API routes | No caching on static data | Add `revalidate` to fetch or use ISR |
| Re-render waterfall | Context value changes on every render | Memoize context value with `useMemo` |
| Framer jank | Complex variants on page load | Use `initial={false}` on `AnimatePresence` to skip entry animation |

---

## Monitoring (Sentry)

Enable performance tracing in `sentry.client.config.ts`:

```ts
Sentry.init({
  tracesSampleRate: 0.1,        // 10% of transactions
  profilesSampleRate: 0.1,      // profiling on sampled transactions
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({ maskAllText: false }),
  ],
})
```

Check Sentry → Performance → Web Vitals dashboard weekly.

---

## Scope

This skill ONLY:
- Guides performance investigation and optimization decisions
- Provides checklists, patterns, and tool commands
- Stores audit results when explicitly requested in `~/perf/memory.md`

This skill NEVER:
- Runs Lighthouse or builds automatically
- Modifies production configuration without user review
- Makes network requests

---

## External Endpoints

| Endpoint | Data Sent | Purpose |
|----------|-----------|---------|
| None | None | N/A |

---

## Security & Privacy

**Data that stays local:**
- Lighthouse reports and bundle analysis output you share
- Notes stored in `~/perf/memory.md`

**Data that leaves your machine:**
- None. This skill makes no network requests.
