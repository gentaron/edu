import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GameCard } from "@/types"

/* ═══════════════════════════════════════════════════════
   Deck Store
   ═══════════════════════════════════════════════════════ */

interface DeckState {
  deck: GameCard[]
  deckName: string
  addCard: (card: GameCard) => void
  removeCard: (cardId: string) => void
  moveCard: (fromIndex: number, toIndex: number) => void
  clearDeck: () => void
  setDeckName: (name: string) => void
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set) => ({
      deck: [],
      deckName: "マイデッキ",
      addCard: (card) =>
        set((s) => {
          const alreadyExists = s.deck.some((c) => c.id === card.id)
          if (s.deck.length >= 5 || alreadyExists) {return s}
          return { deck: [...s.deck, card] }
        }),
      removeCard: (cardId) =>
        set((s) => ({
          deck: s.deck.filter((c) => c.id !== cardId),
        })),
      moveCard: (fromIndex, toIndex) =>
        set((s) => {
          if (fromIndex < 0 || fromIndex >= s.deck.length) {return s}
          if (toIndex < 0 || toIndex >= s.deck.length) {return s}
          const next = [...s.deck]
          const [moved] = next.splice(fromIndex, 1)
          next.splice(toIndex, 0, moved!)
          return { deck: next }
        }),
      clearDeck: () => set({ deck: [] }),
      setDeckName: (name) => set({ deckName: name }),
    }),
    { name: "edu-deck" }
  )
)
