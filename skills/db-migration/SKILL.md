---
name: db-migration
slug: dbmig
version: 1.0.0
description: "Database migration workflow using Prisma ORM. Covers daily schema changes and SQLite to PostgreSQL migration. Use when: changing Prisma schema, running migrations, migrating to PostgreSQL, database migration, Prisma migrate, schema change."
argument-hint: "Describe the schema change or migration you need to perform"
---

# Database Migration Skill

## When to Use

- Adding, renaming, or removing columns/tables in `prisma/schema.prisma`
- Switching database provider (SQLite → PostgreSQL)
- Data seeding or backfilling existing rows
- Diagnosing a Prisma migration error

---

## Standard Migration Workflow

```
1. Edit prisma/schema.prisma
       ↓
2. bun run prisma migrate dev --name <description>
   (creates migration file in prisma/migrations/)
       ↓
3. Review generated SQL in the new migration file
   (never skip this — auto-generated SQL can be destructive)
       ↓
4. Commit schema.prisma + migration file together
       ↓
5. In production: bun run prisma migrate deploy
```

---

## SQLite → PostgreSQL Migration Checklist

Work through every item before switching the `provider` in `schema.prisma`.

| Check | SQLite | PostgreSQL | Action |
|-------|--------|-----------|--------|
| Auto-increment | `autoincrement()` | `autoincrement()` ✓ | No change |
| Boolean | Stored as 0/1 | Native `BOOLEAN` | Prisma handles it — verify data |
| JSON fields | Stored as TEXT | Native `JSONB` | Change type in schema: `Json` |
| DateTime | Stored as TEXT | Native `TIMESTAMPTZ` | Verify timezone handling |
| String length | Unlimited | VARCHAR needs limit | Add `@db.VarChar(255)` where needed |
| Case sensitivity | Case-insensitive `LIKE` | Case-sensitive | Update query logic or use `ilike` |
| Connection string | `file:./dev.db` | `postgresql://user:pw@host/db` | Update `DATABASE_URL` in `.env` |
| Transactions | Basic | Full ACID | No code change needed |

---

## Safe Migration Patterns (Zero-Downtime)

Use **Expand-Contract** for changes that affect live traffic:

### Adding a NOT NULL column
```
WRONG: ALTER TABLE ADD COLUMN email TEXT NOT NULL
  → fails if existing rows have no value

CORRECT:
  Step 1 — Add column as nullable:      @nullable, default=""
  Step 2 — Backfill existing rows
  Step 3 — Add NOT NULL constraint in a separate migration
```

### Renaming a column
```
WRONG: rename column directly
  → breaks all queries using old name immediately

CORRECT:
  Step 1 — Add new column
  Step 2 — Dual-write to both columns in app code
  Step 3 — Backfill old → new
  Step 4 — Switch reads to new column
  Step 5 — Remove old column in final migration
```

---

## Dangerous Operations

| Operation | Risk | Safe Procedure |
|-----------|------|---------------|
| Drop column | Data loss | Ensure column is unused in code first; backup before |
| Change column type | Data truncation | Add new column → copy data → drop old column |
| Add NOT NULL | Fails if nulls exist | Backfill nulls first; add constraint last |
| Remove table | Permanent loss | Archive data to backup table first |

---

## Rollback Strategy

Prisma does not support automatic rollback. Manual steps:

```bash
# View migration history
bun run prisma migrate status

# Mark a failed migration as rolled back (does NOT undo SQL)
bun run prisma migrate resolve --rolled-back <migration-name>

# Re-apply after fixing
bun run prisma migrate deploy
```

For destructive migrations: **always take a database snapshot before deploying**.

---

## Data Seeding

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.card.createMany({
    data: cardSeedData,
    skipDuplicates: true,  // idempotent — safe to re-run
  })
}

main().finally(() => prisma.$disconnect())
```

```bash
# Run seed
bun run prisma db seed
```

Add to `package.json`:
```json
"prisma": { "seed": "bun run prisma/seed.ts" }
```

---

## Common Errors & Fixes

| Error Code | Message | Fix |
|-----------|---------|-----|
| `P1001` | Can't reach database server | Check `DATABASE_URL`, firewall, DB service running |
| `P1003` | Database does not exist | Create DB manually or run `prisma migrate dev` |
| `P2002` | Unique constraint failed | Duplicate value on unique field — check data before insert |
| `P2025` | Record not found | `findUnique` returned null — add null check in code |
| `P3006` | Migration failed to apply | Check migration SQL; resolve with `--rolled-back` flag |
| `P3009` | Migrate found failed migrations | Run `prisma migrate resolve` to clear failed state |

---

## Scope

This skill ONLY:
- Guides Prisma migration workflows and schema design decisions
- Provides checklists and patterns for safe schema changes
- Stores migration notes when explicitly requested in `~/dbmig/memory.md`

This skill NEVER:
- Runs migrations automatically
- Connects to or modifies any database directly
- Deletes data without explicit user confirmation

---

## External Endpoints

| Endpoint | Data Sent | Purpose |
|----------|-----------|---------|
| None | None | N/A |

---

## Security & Privacy

**Data that stays local:**
- Schema files and migration SQL you share
- Notes in `~/dbmig/memory.md`

**Data that leaves your machine:**
- None. This skill makes no network requests.
- Never paste `DATABASE_URL` or connection strings into this chat.
