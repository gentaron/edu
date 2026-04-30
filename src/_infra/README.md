# EDU Infrastructure

## Data Validation

Run build-time validation to check all L1 data against L2 schemas:

```bash
npx tsx src/_infra/validate-data.ts
```

This validates:

- Wiki entries (characters, organizations, geography, technology, terms, history)
- Game cards and enemies
- Civilizations and leaders
- Stories and chapters
- Timeline data
- Technology entries
- Faction trees
- Cross-data referential integrity
