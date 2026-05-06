---
name: code-review
slug: review
version: 1.0.0
description: "Structured PR and self-review workflow for TypeScript/Next.js projects. Use when: reviewing a pull request, doing a self-review before merging, auditing code quality, checking for security issues, code review, PR review, diff review."
argument-hint: "Paste the diff, PR URL, or describe what you want reviewed"
---

# Code Review Skill

## When to Use

- Reviewing a teammate's pull request before approval
- Self-reviewing your own changes before opening a PR
- Auditing a file or module for quality issues
- Checking security posture of new code

---

## Review Checklist

Work through every category. Flag issues with the severity level defined below.

| Category | What to Check |
|----------|--------------|
| **Correctness** | Logic errors, off-by-one errors, unhandled edge cases, null/undefined paths |
| **Type Safety** | TypeScript strict mode compliance, no `any`, proper generics, return types explicit |
| **Security** | XSS (dangerouslySetInnerHTML), SQL injection (raw queries), auth checks on API routes, secrets in code |
| **Performance** | N+1 queries, missing `useMemo`/`useCallback`, unnecessary re-renders, large bundle imports |
| **Readability** | Clear naming, functions under 40 lines, no deep nesting (max 3 levels) |
| **Tests** | New logic has unit tests, happy path + at least one error path covered |
| **Breaking Changes** | API contract changes, DB schema changes without migration, removed exports |
| **Accessibility** | Interactive elements have ARIA labels, images have alt text, keyboard navigable |

---

## Severity Levels

| Level | Label | Meaning |
|-------|-------|---------|
| 🔴 | **Blocker** | Must be fixed before merge — correctness bug, security hole, data loss risk |
| 🟡 | **Suggestion** | Should be fixed — code smell, missing test, readability issue |
| ⚪ | **Nitpick** | Optional improvement — style preference, minor naming |

---

## Workflow

```
Receive PR/diff
    ↓
Read the full diff top-to-bottom (no shortcuts)
    ↓
Run checklist category by category
    ↓
Write comments with severity label
    ↓
Summarize: Approve / Request Changes / Comment
```

---

## Comment Templates

### Blocker
```
🔴 **Blocker**: This API route has no authentication check. Any unauthenticated user
can call `/api/admin/delete`. Add `getServerSession()` guard before the handler.
```

### Suggestion
```
🟡 **Suggestion**: `getUsersWithPosts()` makes N+1 queries — one per user to fetch posts.
Use `include: { posts: true }` in the Prisma query to batch this into a single call.
```

### Nitpick
```
⚪ **Nitpick**: `data` is a very generic name here. `filteredWikiEntries` would make
the intent clearer at a glance.
```

---

## Scope

This skill ONLY:
- Guides review of code diffs and pull requests
- Provides checklists, templates, and severity judgments
- Stores reviewer preferences when explicitly requested in `~/review/memory.md`

This skill NEVER:
- Automatically merges or approves pull requests
- Modifies source files directly
- Accesses external systems (GitHub API, CI pipelines)
- Takes autonomous action without user awareness

---

## Core Rules

1. **Read everything** — Never skim. A bug on line 200 matters as much as line 1.
2. **Separate concerns** — Security blockers get called out first, nitpicks last.
3. **Be specific** — Reference exact line numbers or function names in comments.
4. **Explain the why** — State *why* something is a problem, not just that it is.
5. **Acknowledge good work** — Note clean patterns or clever solutions when you see them.

---

## Self-Modification

This skill NEVER modifies its own SKILL.md.
User preferences stored only in `~/review/memory.md` after explicit request.

---

## External Endpoints

| Endpoint | Data Sent | Purpose |
|----------|-----------|---------|
| None | None | N/A |

---

## Security & Privacy

**Data that stays local:**
- Code diffs and PR content you share in the conversation
- Reviewer preferences stored in `~/review/memory.md`

**Data that leaves your machine:**
- None. This skill makes no network requests.
