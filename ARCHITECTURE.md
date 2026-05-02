# EDU — 7-Layer TCP/IP Architecture

## Layer Overview

```
┌─────────────────────────────────────────────────────┐
│  L7 Application    Feature Modules (wiki, cards, ...)│
├─────────────────────────────────────────────────────┤
│  L6 Presentation   Stateless UI (shadcn/ui, motion) │
├─────────────────────────────────────────────────────┤
│  L5 Session        FSM (battle, deck, story flows)  │
├─────────────────────────────────────────────────────┤
│  L4 Transport      Event Bus + Zustand (hidden)     │
├─────────────────────────────────────────────────────┤
│  L3 Network        Repository Pattern               │
├─────────────────────────────────────────────────────┤
│  L2 DataLink       Zod Schemas + Validators          │
├─────────────────────────────────────────────────────┤
│  L1 Physical       Raw Data (.data.ts, as const)    │
└─────────────────────────────────────────────────────┘
```

## Dependency Rules

- Each layer Ln depends ONLY on Ln-1 (unidirectional)
- No cross-layer direct access (L7 cannot import from L1 or L2)
- Schema-fixed interfaces between layers
- Pub-sub via L4 event bus for cross-component communication

## MoE (Mixture-of-Experts) AI Processing

Each layer is independently processable by AI:

1. **L1 Physical**: AI can generate/modify raw data entries
2. **L2 DataLink**: AI can create/update schemas and validators
3. **L3 Network**: AI can implement new repositories
4. **L4 Transport**: AI can add new event types and state
5. **L5 Session**: AI can design new FSM flows
6. **L6 Presentation**: AI can create new UI components
7. **L7 Application**: AI can compose features from L3-L6

## Directory Structure

```
src/
├── l1-physical/           # Raw data files
│   ├── wiki/              # Wiki entries (characters, orgs, geography, etc.)
│   ├── cards/             # Game cards and enemies
│   └── civilizations/     # Civilization data and leaders
├── l2-datalink/           # Data validation layer
│   ├── schemas/           # Zod schemas for all data types
│   ├── validators/        # Runtime validation functions
│   └── invariants/        # Cross-data consistency checks
├── l3-network/            # Data access layer
│   └── repositories/      # Repository classes (Wiki, Card, Story, etc.)
├── l4-transport/          # Communication and state
│   ├── event-bus.ts       # Typed pub/sub event system
│   └── state/             # Zustand stores (hidden behind L4 API)
├── l5-session/            # Flow control
│   └── battle-fsm.ts      # Battle finite state machine
├── l6-presentation/       # Stateless UI components
├── l7-application/        # Feature modules
├── _infra/                # Build-time tools
│   └── validate-data.ts   # Data validation script
├── components/            # Shared UI (shadcn/ui primitives, edu components)
├── hooks/                 # Custom React hooks
├── lib/                   # Legacy utilities (being migrated)
├── types/                 # Type definitions (being migrated to L2)
└── app/                   # Next.js App Router pages
```

## Quality Standards

- TypeScript strict mode with `noUncheckedIndexedAccess`
- No `any` types, no `eslint-disable`
- Zod schema validation at build time
- Each layer independently testable
- LCP < 1.5s, 60fps battle, < 100KB per page bundle

## Migration Strategy

### Phase 1 (Complete): L1-L2 Separation

- Raw data moved to `src/l1-physical/`
- Zod schemas created in `src/l2-datalink/`
- Build-time validation in `src/_infra/`

### Phase 2 (Complete): L3-L4 Introduction

- Repository pattern in `src/l3-network/`
- Event bus and hidden Zustand in `src/l4-transport/`

### Phase 3 (Complete): L5-L6 Rebuild

- Battle FSM in `src/l5-session/`
- Presentation component registry in `src/l6-presentation/`

### Phase 4 (In Progress): L7 Integration

- Feature modules in `src/l7-application/`
- App routes gradually adopting L7 APIs

### Phase 5 (Planned): Quality Compliance

- Strict TS/ESLint settings
- 80% test coverage per layer
- Performance benchmarks
