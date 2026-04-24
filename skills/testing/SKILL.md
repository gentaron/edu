---
name: testing
slug: test
version: 1.0.0
description: "Test strategy and workflow for Next.js projects using Vitest, React Testing Library, and Playwright. Use when: writing unit tests, component tests, E2E tests, setting up test coverage, TDD workflow, test strategy, testing."
argument-hint: "Describe what you want to test or ask about testing strategy"
---

# Testing Skill

## When to Use

- Starting a new feature with TDD
- Writing tests for existing untested code
- Setting up Playwright E2E tests for critical flows
- Checking coverage gaps before a release

---

## Testing Pyramid

| Layer | Tool | Share | What to Test |
|-------|------|-------|-------------|
| **Unit** | Vitest | ~70% | Pure functions, utilities, hooks, store logic |
| **Integration** | Vitest + RTL | ~20% | Components with data fetching, form submission, state changes |
| **E2E** | Playwright | ~10% | Critical user paths only (login, card game battle, wiki search) |

---

## Coverage Targets

| Layer | Target | Notes |
|-------|--------|-------|
| Unit | 80%+ lines | Focus on `src/lib/` and utility functions |
| Integration | 60%+ | Key components with user interaction |
| E2E | Critical paths | Not % based — cover flows that if broken = users can't use the app |

---

## Unit Test Patterns (Vitest)

### Pure Function
```ts
import { describe, it, expect } from 'vitest'
import { calculateCardDamage } from '@/lib/card-data'

describe('calculateCardDamage', () => {
  it('applies rarity multiplier', () => {
    expect(calculateCardDamage({ rarity: 'SR', baseAtk: 100 })).toBe(150)
  })
  it('returns 0 for missing baseAtk', () => {
    expect(calculateCardDamage({ rarity: 'C', baseAtk: 0 })).toBe(0)
  })
})
```

### Custom Hook
```ts
import { renderHook, act } from '@testing-library/react'
import { useGameStore } from '@/lib/game-store'

it('deploys card to field', () => {
  const { result } = renderHook(() => useGameStore())
  act(() => result.current.deployCard('card-001'))
  expect(result.current.field).toContain('card-001')
})
```

---

## Component Test Patterns (React Testing Library)

```ts
import { render, screen, fireEvent } from '@testing-library/react'
import { WikiSearch } from '@/components/WikiSearch'

it('filters entries on input', async () => {
  render(<WikiSearch entries={mockEntries} />)
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Diana' } })
  expect(await screen.findByText('Diana Virel')).toBeInTheDocument()
  expect(screen.queryByText('Unrelated Entry')).not.toBeInTheDocument()
})
```

**RTL Rules:**
- Query by role > label > text > testId (in that order)
- Never test implementation details (internal state, component methods)
- Use `findBy*` (async) for elements that appear after data fetching

---

## E2E Test Patterns (Playwright)

```ts
import { test, expect } from '@playwright/test'

test('user can start a card battle', async ({ page }) => {
  await page.goto('/card-game')
  await page.getByRole('button', { name: 'Start Battle' }).click()
  await expect(page.getByTestId('battle-field')).toBeVisible()
  await expect(page.getByText('Turn 1')).toBeVisible()
})
```

**E2E Rules:**
- Only test the critical path — not every edge case
- Use `data-testid` attributes for stable selectors in dynamic UI
- Run E2E against a real dev server (`bun run dev`)
- Keep tests independent — no shared state between tests

---

## TDD Workflow

```
1. RED   — Write a failing test that describes the desired behavior
2. GREEN — Write the minimum code to make the test pass
3. REFACTOR — Clean up code without breaking the test
```

Do not write the implementation before the test. If you can't write a test for it, the design is probably wrong.

---

## Common Traps

| Trap | Problem | Fix |
|------|---------|-----|
| Snapshot tests everywhere | Snapshots break on any UI change, creating noise | Use snapshot only for stable, pure render components |
| Testing implementation details | Tests break on refactor even when behavior is correct | Test what the user sees, not internal state |
| No async handling | Tests pass intermittently | Use `await findBy*` and `waitFor` properly |
| Mocking too much | Tests pass but real code is broken | Mock at the boundary (API, DB), not inside the unit |
| E2E for every case | Slow CI, flaky tests | E2E = critical paths only; edge cases → unit tests |

---

## Scope

This skill ONLY:
- Provides testing strategy, patterns, and workflow guidance
- Helps write and review tests for Vitest, RTL, and Playwright
- Stores testing preferences when explicitly requested in `~/testing/memory.md`

This skill NEVER:
- Runs tests automatically
- Modifies source files outside of tests
- Accesses CI pipelines or test runners directly

---

## External Endpoints

| Endpoint | Data Sent | Purpose |
|----------|-----------|---------|
| None | None | N/A |

---

## Security & Privacy

**Data that stays local:**
- Code and test files you share in the conversation
- Preferences stored in `~/testing/memory.md`

**Data that leaves your machine:**
- None. This skill makes no network requests.
