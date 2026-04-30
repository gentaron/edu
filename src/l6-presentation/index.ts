/* ═══════════════════════════════════════════
   L6 PRESENTATION — Component Registry
   Stateless UI components built on shadcn/ui primitives.
   All components receive data via props; NO direct data fetching.
   ═══════════════════════════════════════════ */

/*
 * L6 Design Principles:
 * 1. All components are stateless (receive data via props)
 * 2. Use shadcn/ui primitives (Badge, Accordion, etc.)
 * 3. Framer Motion for declarative animations only
 * 4. No direct imports from L1, L2, or L3
 * 5. Type-safe props using L2 schema types
 *
 * Existing components in src/components/edu/ and src/components/ui/
 * are gradually being refactored to follow L6 principles.
 */

// Re-export existing shadcn/ui primitives
export { Badge } from "@/components/ui/badge"
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// L6 will contain feature-specific presentational components:
// - WikiEntryCard (stateless wiki entry display)
// - GameCardDisplay (stateless card display)
// - BattleFieldView (stateless battle field)
// - StoryChapterCard (stateless chapter navigation)
// - TimelineEvent (stateless timeline event)
// etc.
//
// These will be added incrementally as existing components are migrated.
