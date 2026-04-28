# Worklog

## 2025-01-XX — Fix wiki hash-based links to path-based links

### Summary
Converted all `/wiki#X` hash-based links to `/wiki/X` path-based links across the entire `src/app/` directory to match the wiki's path-based routing (`/wiki/[id]/page.tsx`).

### Changes Made

#### 1. Bulk replacement (`sed` — all `.tsx` files under `src/app/`, excluding `wiki/` and `card-game/`)
- Replaced every occurrence of `/wiki#` → `/wiki/` across **14 files**:
  - `src/app/auralis/page.tsx` (12 occurrences)
  - `src/app/iris/page.tsx` (10 occurrences)
  - `src/app/liminal/page.tsx` (4 occurrences)
  - `src/app/timeline/page.tsx` (1 occurrence — dynamic template)
  - `src/app/story/page.tsx` (1 occurrence — dynamic template)
  - `src/app/mina/page.tsx` (4 occurrences)
  - `src/app/factions/page.tsx` (1 occurrence)
  - `src/app/universe/page.tsx` (22 occurrences)
  - `src/app/civilizations/page.tsx` (5 occurrences)
  - `src/app/civilizations/fallujah/page.tsx` (5 occurrences)
  - `src/app/civilizations/elyseon/page.tsx` (3 occurrences)
  - `src/app/civilizations/tyeria/page.tsx` (5 occurrences)
  - `src/app/civilizations/granbell/page.tsx` (8 occurrences)
  - `src/app/civilizations/dioclenis/page.tsx` (7 occurrences)

#### 2. Special case fixes in `src/app/universe/page.tsx`
- Line 203: `/wiki/Valoria連合圏` → `/wiki/Valoria` (wiki entry id is just "Valoria")
- Line 286: `/wiki/ビブリオ国際大学` → `/wiki/ロレンツィオ国際大学` (wiki entry id is "ロレンツィオ国際大学"; display text left as "ビブリオ国際大学")

#### 3. Dynamic link verification
- `src/app/timeline/page.tsx` line 75: Confirmed `/wiki/${encodeURIComponent(ev.loc)}` ✓
- `src/app/story/page.tsx` line 110: Confirmed `/wiki/${entry}` ✓

#### 4. wikiHref prop verification
- All 16 `wikiHref` props across the codebase now correctly use `/wiki/` path format ✓

### Verification
- Final grep for `/wiki#` across `src/app/`: **0 matches** ✓
