import { describe, it, expect, beforeEach, vi } from "vitest"
import { useDeckStore } from "@/domains/cards/cards.store"
import { eventBus } from "@/platform/event-bus"
import type { GameCard } from "@/types"
import type { CardId } from "@/platform/schemas/branded"

// Mock the event bus to avoid side effects in tests
vi.mock("@/platform/event-bus", () => ({
  eventBus: {
    publish: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
    subscribeAll: vi.fn(() => vi.fn()),
    clear: vi.fn(),
  },
}))

const makeCard = (id: string, overrides?: Partial<GameCard>): GameCard => ({
  id: id as CardId,
  name: `Card ${id}`,
  imageUrl: `/card-${id}.png`,
  flavorText: `Flavor for ${id}`,
  rarity: "R",
  affiliation: "Test",
  attack: 10,
  defense: 5,
  effect: "Heal",
  effectType: "HEAL" as const,
  effectValue: 3,
  ultimate: 20,
  ultimateName: "Ultimate",
  ...overrides,
})

describe("useDeckStore", () => {
  beforeEach(() => {
    // Reset store state between tests
    useDeckStore.setState({
      deck: [],
      deckName: "マイデッキ",
    })
    // Clear mock call history
    vi.clearAllMocks()
  })

  /* ── Initial State ── */
  describe("initial state", () => {
    it("starts with empty deck", () => {
      const { deck } = useDeckStore.getState()
      expect(deck).toHaveLength(0)
    })

    it("starts with default deck name", () => {
      const { deckName } = useDeckStore.getState()
      expect(deckName).toBe("マイデッキ")
    })
  })

  /* ── addCard ── */
  describe("addCard", () => {
    it("adds a card to the deck", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      expect(useDeckStore.getState().deck).toHaveLength(1)
      expect(useDeckStore.getState().deck[0]!.id).toBe("card-1")
    })

    it("adds multiple cards up to max size", () => {
      for (let i = 1; i <= 5; i++) {
        useDeckStore.getState().addCard(makeCard(`card-${i}`))
      }
      expect(useDeckStore.getState().deck).toHaveLength(5)
    })

    it("does not add beyond max deck size (5)", () => {
      for (let i = 1; i <= 6; i++) {
        useDeckStore.getState().addCard(makeCard(`card-${i}`))
      }
      expect(useDeckStore.getState().deck).toHaveLength(5)
    })

    it("does not add duplicate cards", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      useDeckStore.getState().addCard(makeCard("card-1"))
      expect(useDeckStore.getState().deck).toHaveLength(1)
    })

    it("publishes deck:card-added event", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: "deck:card-added", cardId: "card-1" })
      )
    })
  })

  /* ── removeCard ── */
  describe("removeCard", () => {
    it("removes a card from the deck", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      useDeckStore.getState().addCard(makeCard("card-2"))
      useDeckStore.getState().removeCard("card-1" as CardId)
      expect(useDeckStore.getState().deck).toHaveLength(1)
      expect(useDeckStore.getState().deck[0]!.id).toBe("card-2")
    })

    it("handles removing non-existent card gracefully", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      useDeckStore.getState().removeCard("nonexistent" as CardId)
      expect(useDeckStore.getState().deck).toHaveLength(1)
    })

    it("handles removing from empty deck gracefully", () => {
      useDeckStore.getState().removeCard("card-1" as CardId)
      expect(useDeckStore.getState().deck).toHaveLength(0)
    })

    it("publishes deck:card-removed event", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      useDeckStore.getState().removeCard("card-1" as CardId)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: "deck:card-removed", cardId: "card-1" })
      )
    })
  })

  /* ── moveCard ── */
  describe("moveCard", () => {
    it("moves a card within the deck", () => {
      const card1 = makeCard("card-1")
      const card2 = makeCard("card-2")
      useDeckStore.getState().addCard(card1)
      useDeckStore.getState().addCard(card2)
      useDeckStore.getState().moveCard(0, 1)
      expect(useDeckStore.getState().deck[0]!.id).toBe("card-2")
      expect(useDeckStore.getState().deck[1]!.id).toBe("card-1")
    })

    it("handles moving card to same index (no-op)", () => {
      const card1 = makeCard("card-1")
      useDeckStore.getState().addCard(card1)
      useDeckStore.getState().moveCard(0, 0)
      expect(useDeckStore.getState().deck[0]!.id).toBe("card-1")
    })

    it("ignores invalid fromIndex (out of bounds)", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      const stateBefore = useDeckStore.getState()
      useDeckStore.getState().moveCard(5, 0)
      expect(useDeckStore.getState().deck).toEqual(stateBefore.deck)
    })

    it("ignores invalid toIndex (out of bounds)", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      const stateBefore = useDeckStore.getState()
      useDeckStore.getState().moveCard(0, 5)
      expect(useDeckStore.getState().deck).toEqual(stateBefore.deck)
    })

    it("ignores negative fromIndex", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      const stateBefore = useDeckStore.getState()
      useDeckStore.getState().moveCard(-1, 0)
      expect(useDeckStore.getState().deck).toEqual(stateBefore.deck)
    })

    it("ignores negative toIndex", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      const stateBefore = useDeckStore.getState()
      useDeckStore.getState().moveCard(0, -1)
      expect(useDeckStore.getState().deck).toEqual(stateBefore.deck)
    })

    it("publishes deck:reordered event", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      useDeckStore.getState().addCard(makeCard("card-2"))
      useDeckStore.getState().moveCard(0, 1)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({ type: "deck:reordered" })
      )
    })
  })

  /* ── clearDeck ── */
  describe("clearDeck", () => {
    it("clears the entire deck", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      useDeckStore.getState().addCard(makeCard("card-2"))
      useDeckStore.getState().clearDeck()
      expect(useDeckStore.getState().deck).toHaveLength(0)
    })

    it("handles clearing empty deck gracefully", () => {
      useDeckStore.getState().clearDeck()
      expect(useDeckStore.getState().deck).toHaveLength(0)
    })

    it("publishes deck:cleared event", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      useDeckStore.getState().clearDeck()
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(eventBus.publish).toHaveBeenCalledWith({ type: "deck:cleared" })
    })
  })

  /* ── setDeckName ── */
  describe("setDeckName", () => {
    it("sets the deck name", () => {
      useDeckStore.getState().setDeckName("My Custom Deck")
      expect(useDeckStore.getState().deckName).toBe("My Custom Deck")
    })

    it("allows empty deck name", () => {
      useDeckStore.getState().setDeckName("")
      expect(useDeckStore.getState().deckName).toBe("")
    })
  })

  /* ── getSnapshot ── */
  describe("getSnapshot", () => {
    it("returns current state as snapshot", () => {
      const card = makeCard("card-1")
      useDeckStore.getState().addCard(card)
      useDeckStore.getState().setDeckName("Test Deck")
      const snapshot = useDeckStore.getState().getSnapshot()
      expect(snapshot.deck).toHaveLength(1)
      expect(snapshot.deckName).toBe("Test Deck")
    })

    it("snapshot is independent of store changes", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      const snapshot = useDeckStore.getState().getSnapshot()
      useDeckStore.getState().addCard(makeCard("card-2"))
      expect(snapshot.deck).toHaveLength(1)
      expect(useDeckStore.getState().deck).toHaveLength(2)
    })
  })

  /* ── isCardInDeck ── */
  describe("isCardInDeck", () => {
    it("returns true for card in deck", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      expect(useDeckStore.getState().isCardInDeck("card-1" as CardId)).toBe(true)
    })

    it("returns false for card not in deck", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      expect(useDeckStore.getState().isCardInDeck("card-2" as CardId)).toBe(false)
    })

    it("returns false for empty deck", () => {
      expect(useDeckStore.getState().isCardInDeck("card-1" as CardId)).toBe(false)
    })
  })

  /* ── canAddCard ── */
  describe("canAddCard", () => {
    it("returns true when deck is not full", () => {
      useDeckStore.getState().addCard(makeCard("card-1"))
      expect(useDeckStore.getState().canAddCard()).toBe(true)
    })

    it("returns false when deck is full", () => {
      for (let i = 1; i <= 5; i++) {
        useDeckStore.getState().addCard(makeCard(`card-${i}`))
      }
      expect(useDeckStore.getState().canAddCard()).toBe(false)
    })

    it("returns true when deck is empty", () => {
      expect(useDeckStore.getState().canAddCard()).toBe(true)
    })

    it("transitions from true to false as deck fills", () => {
      expect(useDeckStore.getState().canAddCard()).toBe(true)
      for (let i = 1; i <= 4; i++) {
        useDeckStore.getState().addCard(makeCard(`card-${i}`))
        expect(useDeckStore.getState().canAddCard()).toBe(true)
      }
      useDeckStore.getState().addCard(makeCard("card-5"))
      expect(useDeckStore.getState().canAddCard()).toBe(false)
    })
  })
})
