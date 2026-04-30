/* ═══════════════════════════════════════════
   L4 TRANSPORT — Deck State
   Zustand store for deck management with persistence.
   Hidden behind L4 API.
   ═══════════════════════════════════════════ */

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GameCard } from "@/types"
import { eventBus } from "@/platform/event-bus"

export interface DeckSnapshot {
  deck: readonly GameCard[]
  deckName: string
}

interface DeckState extends DeckSnapshot {
  addCard: (card: GameCard) => void
  removeCard: (cardId: string) => void
  moveCard: (fromIndex: number, toIndex: number) => void
  clearDeck: () => void
  setDeckName: (name: string) => void
  getSnapshot: () => DeckSnapshot
  isCardInDeck: (cardId: string) => boolean
  canAddCard: () => boolean
}

const MAX_DECK_SIZE = 5

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      deck: [],
      deckName: "マイデッキ",

      addCard: (card) =>
        set((s) => {
          if (s.deck.some((c) => c.id === card.id) || s.deck.length >= MAX_DECK_SIZE) return s
          eventBus.publish({
            type: "deck:card-added",
            cardId: card.id,
            deckSize: s.deck.length + 1,
          })
          return { deck: [...s.deck, card] }
        }),

      removeCard: (cardId) =>
        set((s) => {
          eventBus.publish({
            type: "deck:card-removed",
            cardId,
            deckSize: s.deck.length - 1,
          })
          return { deck: s.deck.filter((c) => c.id !== cardId) }
        }),

      moveCard: (fromIndex, toIndex) =>
        set((s) => {
          if (fromIndex < 0 || fromIndex >= s.deck.length) return s
          if (toIndex < 0 || toIndex >= s.deck.length) return s
          const next = [...s.deck]
          const [moved] = next.splice(fromIndex, 1)
          next.splice(toIndex, 0, moved!)
          eventBus.publish({
            type: "deck:reordered",
            deckSize: next.length,
          })
          return { deck: next }
        }),

      clearDeck: () => {
        eventBus.publish({ type: "deck:cleared" })
        set({ deck: [] })
      },

      setDeckName: (name) => set({ deckName: name }),

      getSnapshot: () => {
        const s = get()
        return { deck: s.deck, deckName: s.deckName }
      },

      isCardInDeck: (cardId) => get().deck.some((c) => c.id === cardId),

      canAddCard: () => get().deck.length < MAX_DECK_SIZE,
    }),
    { name: "edu-deck" }
  )
)
