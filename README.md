# EDU — Eternal Dominion Universe

Original sci-fi universe + interactive web app. 500+ years of lore, 204 wiki entries, 20 full stories, 64-char PvE card game — all in one Next.js app.

[![CI](https://github.com/gentaron/edu/actions/workflows/ci.yml/badge.svg)](https://github.com/gentaron/edu/actions)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

## Quick Start

```bash
git clone https://github.com/gentaron/edu.git && cd edu
bun install
bun prisma generate && bun prisma db push
bun dev  # → localhost:3000
```

Env: `DATABASE_URL` (PostgreSQL or SQLite), Sentry DSNs (optional).

## Architecture

```
src/
├── app/                     # Next.js App Router
│   ├── wiki/                # Encyclopedia (204 entries, SSG)
│   ├── story/               # Story reader (20 stories, SSG + ISR 1h)
│   ├── card-game/           # PvE deck builder + battle (CSR)
│   ├── characters/          # Character browser
│   ├── civilizations/       # Civilization pages
│   ├── timeline/            # Interactive timeline
│   └── universe/            # Universe overview
├── components/
│   ├── edu/                 # App-specific shared components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── data/                # Data access layer (unified API)
│   ├── stores/              # Zustand stores (battle-store, deck-store)
│   ├── wiki-data/           # Wiki data (split by category)
│   ├── card-data/           # Card data (cards, enemies)
│   ├── civilization-data/   # Civilization data (split by tier)
│   ├── stories.ts           # Story metadata + chapter definitions
│   └── battle-logic.ts      # Battle logic utilities
├── types/                   # Shared type definitions
└── hooks/                   # Custom React hooks
```

**Data sources (single source of truth):**

| Path                             | Content                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------- |
| `src/lib/wiki-data/`             | 204 wiki entries split by category (characters, orgs, geography, tech, history, terms) |
| `src/lib/data/wiki.ts`           | Unified wiki data access API                                                           |
| `src/lib/stories.ts`             | 20 story metadata + 5 chapter definitions                                              |
| `src/lib/card-data/`             | 64 character cards + 10 PvE enemies (split into cards.ts, enemies.ts)                  |
| `src/lib/data/cards.ts`          | Unified card data access API                                                           |
| `src/lib/stores/battle-store.ts` | Zustand battle state machine                                                           |
| `src/lib/stores/deck-store.ts`   | Zustand deck management store                                                          |
| `src/lib/civilization-data/`     | Civilization data split by tier (top, historical, leaders, other)                      |
| `lore/*.txt`                     | Raw story text (JP/EN pairs)                                                           |

Story content is fetched at build time from `gentaron/edutext` (GitHub raw) and cached with ISR.

## Content Pipeline

```
gentaron/edutext (raw .txt)
       ↓  git push
gentaron/edu/lore (mirror)
       ↓  build time fetch
src/app/story/[slug]/page.tsx (SSG + ISR 1h)
```

- JP originals: `filename.txt` → EN translation: `filename_EN.txt`
- EN originals: `filename.txt` → JP translation: `filename_JP.txt`
- Language switching via `getStoryUrlForLang()` / `getStoryTitle()`

## Tech Stack

Next.js 16 (App Router) · TypeScript 5 (strict) · Tailwind CSS v4 · shadcn/ui · Framer Motion · Zustand · TanStack Query · Prisma · PostgreSQL/SQLite · Sentry · Husky + lint-staged

## Commands

```bash
bun dev              # dev server :3000
bun build            # production build
bun test             # Vitest
bun run lint         # ESLint + Prettier
bun run db:push      # Prisma schema → DB
bun run db:seed      # seed card game data
bun run db:seed-pve  # seed PvE enemy data
```

## Card Game System

- **Deck**: Pick 5 from 64 cards (C/R/SR rarity)
- **Battle**: All 5 deployed, turn-based ability selection
- **Enemies**: 10 across 4 tiers (NORMAL → HARD → BOSS → FINAL)
- **State**: Zustand store with localStorage persistence

## Universe Setting

E16 binary star system (M104 Sombrero Galaxy halo). Humanity migrated through 4 galaxy clusters before settling.

Key factions: AURALIS Collective · ZAMLT · Trinity Alliance · Alpha Venom · V7 · Shadow Rebellion · Liminal Forge

Timeline: E1 (founding) → E522+ (present)

## Contributing

**Adding wiki entries:** Edit files under `src/lib/wiki-data/`. Schema:

```ts
{ id: string, name: string, nameEn?: string, category: Category,
  subCategory?: string, description: string, era?: string,
  affiliation?: string, tier?: string, image?: string,
  sourceLinks?: { url: string, label: string }[] }
```

**Adding artwork:** Push PNG to [gentaron/image](https://github.com/gentaron/image), update `image` field in wiki-data.

**Adding stories:** Add JP `.txt` to `gentaron/edutext`, add EN `_EN.txt` translation, register in `src/lib/stories.ts`.

## Related Repos

| Repo                                                    | Purpose                |
| ------------------------------------------------------- | ---------------------- |
| [gentaron/edutext](https://github.com/gentaron/edutext) | Raw story text (JP/EN) |
| [gentaron/image](https://github.com/gentaron/image)     | Character artwork      |
| [gentaron/edunft](https://github.com/gentaron/edunft)   | NFT card metadata      |

## License

Story content & world lore: proprietary. Source code: MIT.
