# EDU — Eternal Dominion Universe

> An original science fiction universe set in the **E16 Binary Star System**, located in the halo of the M104 (Sombrero) Galaxy — humanity's new home, far from Earth.

[![Live Site](https://img.shields.io/badge/Live%20Site-edu--super.netlify.app-blue?style=flat-square)](https://edu-super.netlify.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

---

## What is EDU?

**Eternal Dominion Universe** is an original worldbuilding project spanning over 500 years of in-universe history (E1 to present). It follows the rise and fall of civilizations, legendary warriors, political factions, and extraordinary individuals across the E16 star system.

The story begins with humanity's great migration from Earth — across Andromeda, Leo, Sextans, and Triangulum — finally settling in the E16 binary star system. What follows is centuries of war, culture, technology, and survival.

---

## Characters

| Character | Role |
|---|---|
| ![Diana](https://raw.githubusercontent.com/gentaron/image/main/Diana.png) **Diana** | The first Wonder Woman. Legendary figure of E260–280, cultural beacon of the AURALIS era. |
| ![Iris](https://raw.githubusercontent.com/gentaron/image/main/Iris.png) **Iris** | Hero of Vermillion. Leader of Trinity Alliance. Protagonist of a 4-episode story arc. |
| ![Layla Virel Nova](https://raw.githubusercontent.com/gentaron/image/main/LaylaVirelNova.png) **Layla Virel Nova** | Elite warrior, cryogenically preserved E325–E522. Battle records across two eras. |
| ![Celia Dominix](https://raw.githubusercontent.com/gentaron/image/main/CeliaDminix.png) **Celia Dominix** | Paired with Alpha Cain. Central to the E318–E370 political upheaval. |
| ![Fiona](https://raw.githubusercontent.com/gentaron/image/main/Fiona.png) **Fiona** | Member of the AURALIS second generation collective. |
| ![Mina Eureka Ernst](https://raw.githubusercontent.com/gentaron/image/main/MinaEurekaErnst.png) **Mina Eureka Ernst** | Founder of Liminal Forge. AURALIS second generation. |
| ![Kate Claudia](https://raw.githubusercontent.com/gentaron/image/main/KateClaudia.png) **Kate Claudia** | Core member of AURALIS first generation (E290). |
| ![Kate Patton](https://raw.githubusercontent.com/gentaron/image/main/KatePatton.png) **Kate Patton** | AURALIS member. |
| ![Lillie Steiner](https://raw.githubusercontent.com/gentaron/image/main/LillieSteiner.png) **Lillie Steiner** | Alongside Kate Claudia in the AURALIS founding era. |
| ![Lillie Ardent](https://raw.githubusercontent.com/gentaron/image/main/LillieArdent.png) **Lillie Ardent** | AURALIS second generation. |
| ![Ninny Offenbach](https://raw.githubusercontent.com/gentaron/image/main/NinnyOffenbach.png) **Ninny Offenbach** | AURALIS second generation. |

---

## What's Inside

### 🌐 World Encyclopedia (`/wiki`)
Over **204 entries** covering every character, organization, technology, geography, and historical event in the EDU universe. Searchable and filterable by category.

### 📖 Story Archive (`/story`)
**20 original stories** set across the universe's timeline — from Diana's legendary rise to Iris's four-episode arc, Layla's battle records, and more.

| Story | Era |
|---|---|
| Diana's World | E260–E280 |
| Iris's Story — Ep 1–4 | E480– |
| Layla Virel Nova's Story | E325–E400 / E522– |
| Kate Claudia & Lillie Steiner's Story | E270–E400 |
| Alpha Cain & Celia Dominix's Story | E318–E370 |
| AURALIS Spinoff | E522– |
| Jun & Slime Woman's Story | E340– |
| + 13 more… | |

### 🃏 Card Game (`/card-game`)
A PvE deck-building card game set in the EDU universe. Build a 20-card deck from wiki-sourced cards, choose an enemy (10 varieties from Normal to Final Boss), and battle.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Animation | Framer Motion |
| State Management | Zustand + TanStack Query |
| Database | Prisma + SQLite |
| Auth | NextAuth |
| Package Manager | Bun |
| Reverse Proxy | Caddy |
| Hosting | Netlify |

---

## Running Locally

**Prerequisites:** [Bun](https://bun.sh) installed.

```bash
git clone https://github.com/gentaron/edu.git
cd edu
bun install
cp .env.example .env   # fill in DATABASE_URL etc.
bun prisma generate
bun prisma db push
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database commands

```bash
bun run db:push       # sync schema to DB
bun run db:generate   # regenerate Prisma client
bun run db:migrate    # run migrations
bun run db:reset      # reset DB
```

### Build for production

```bash
bun run build
bun run start
```

---

## Project Structure

```
edu/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Home — world overview & timeline
│   │   ├── wiki/             # Encyclopedia (204 entries)
│   │   ├── story/[slug]/     # Story reader
│   │   └── card-game/        # PvE card game
│   ├── components/ui/        # shadcn/ui components
│   ├── lib/
│   │   ├── wiki-data.ts      # All 204 wiki entries
│   │   ├── stories.ts        # Story metadata & URLs
│   │   └── db.ts             # Prisma client
│   └── hooks/
├── lore/                     # Raw story text files (.txt)
├── public/                   # Character images
├── prisma/schema.prisma      # Database schema
└── .zscripts/                # Dev/build/deploy scripts
```

---

## Universe Overview

```
E16 Binary Star System (M104 Galaxy Halo)
│
├── Ea16 — K2-type main star (1.2 solar masses)
├── Eb16 — M3-type companion star (0.4 solar masses)
│
└── Symphony of Stars — Main habitable planet
    ├── Gigapolis (West Continent)  ← primary civilization hub
    ├── Crescent Region             ← Vermillion, Blue Rose, Krossevia
    └── Eros-7 (outer planet)       ← matriarchal frontier society
```

**Key factions:** AURALIS Collective · ZAMLT · Trinity Alliance · Alpha Venom · Liminal Forge · V7 (Vital Seven)

**Timeline span:** E1 (founding) → E522+ (present day)

---

## NFT Card System (In Development)

Cards are sourced from wiki entries and are being prepared for minting as NFTs on the **Base blockchain** via Zora Protocol.

- Metadata repository: [gentaron/edunft](https://github.com/gentaron/edunft)
- Images hosted on IPFS via Pinata
- Free-to-collect mint (collectors pay Base gas only)

---

## Image Credits

Character images are hosted at [gentaron/image](https://github.com/gentaron/image).  
Currently **11 characters** have artwork. Contributions welcome — see the [image filename reference](https://github.com/gentaron/edu#characters) for naming conventions.

---

## License

All original story content, character designs, and world lore are the intellectual property of the EDU project authors. The web application code is open source.
