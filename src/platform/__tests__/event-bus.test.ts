import { describe, it, expect, beforeEach } from "vitest"
import { eventBus } from "@/platform/event-bus"
import type { AppEvent } from "@/platform/event-bus"
import type { EnemyId, CardId, WikiId, StorySlug } from "@/platform/schemas/branded"

// Branded type aliases for concise test data
const eId = (s: string) => s as EnemyId
const cId = (s: string) => s as CardId
const wId = (s: string) => s as WikiId
const sSlug = (s: string) => s as StorySlug

describe("EventBus", () => {
  beforeEach(() => {
    eventBus.clear()
  })

  /* ── subscribe/publish ── */
  describe("subscribe/publish", () => {
    it("receives battle:start event", () => {
      let received = false
      let payload: AppEvent | null = null
      eventBus.subscribe("battle:start", (e) => {
        received = true
        payload = e
      })
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(received).toBe(true)
      expect(payload!.type).toBe("battle:start")
    })

    it("receives battle:ability event", () => {
      let received = false
      eventBus.subscribe("battle:ability", () => {
        received = true
      })
      eventBus.publish({ type: "battle:ability", ability: "attack", characterId: cId("c1") })
      expect(received).toBe(true)
    })

    it("receives battle:turn event", () => {
      let received = false
      eventBus.subscribe("battle:turn", () => {
        received = true
      })
      eventBus.publish({ type: "battle:turn", turn: 3 })
      expect(received).toBe(true)
    })

    it("receives battle:victory event", () => {
      let received = false
      eventBus.subscribe("battle:victory", (e) => {
        received = true
        expect(e.enemyId).toBe(eId("void-king"))
        expect(e.turnsUsed).toBe(10)
      })
      eventBus.publish({ type: "battle:victory", enemyId: eId("void-king"), turnsUsed: 10 })
      expect(received).toBe(true)
    })

    it("receives battle:defeat event", () => {
      let received = false
      eventBus.subscribe("battle:defeat", () => {
        received = true
      })
      eventBus.publish({ type: "battle:defeat", enemyId: eId("test"), turnsUsed: 5 })
      expect(received).toBe(true)
    })

    it("receives battle:reset event", () => {
      let received = false
      eventBus.subscribe("battle:reset", () => {
        received = true
      })
      eventBus.publish({ type: "battle:reset" })
      expect(received).toBe(true)
    })

    it("receives deck:card-added event", () => {
      let received = false
      eventBus.subscribe("deck:card-added", (e) => {
        received = true
        expect(e.cardId).toBe(cId("c1"))
      })
      eventBus.publish({ type: "deck:card-added", cardId: cId("c1"), deckSize: 1 })
      expect(received).toBe(true)
    })

    it("receives deck:card-removed event", () => {
      let received = false
      eventBus.subscribe("deck:card-removed", () => {
        received = true
      })
      eventBus.publish({ type: "deck:card-removed", cardId: cId("c1"), deckSize: 4 })
      expect(received).toBe(true)
    })

    it("receives deck:cleared event", () => {
      let received = false
      eventBus.subscribe("deck:cleared", () => {
        received = true
      })
      eventBus.publish({ type: "deck:cleared" })
      expect(received).toBe(true)
    })

    it("receives wiki:entry-viewed event", () => {
      let received = false
      eventBus.subscribe("wiki:entry-viewed", (e) => {
        received = true
        expect(e.entryId).toBe(wId("Diana"))
      })
      eventBus.publish({ type: "wiki:entry-viewed", entryId: wId("Diana") })
      expect(received).toBe(true)
    })

    it("receives story:opened event", () => {
      let received = false
      eventBus.subscribe("story:opened", (e) => {
        received = true
        expect(e.slug).toBe(sSlug("diana-world"))
      })
      eventBus.publish({ type: "story:opened", slug: sSlug("diana-world") })
      expect(received).toBe(true)
    })

    it("receives ui:theme-toggled event", () => {
      let received = false
      eventBus.subscribe("ui:theme-toggled", () => {
        received = true
      })
      eventBus.publish({ type: "ui:theme-toggled" })
      expect(received).toBe(true)
    })
  })

  /* ── Multiple subscribers ── */
  describe("multiple subscribers", () => {
    it("notifies multiple subscribers of same event", () => {
      let count1 = 0
      let count2 = 0
      eventBus.subscribe("battle:start", () => {
        count1++
      })
      eventBus.subscribe("battle:start", () => {
        count2++
      })
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(count1).toBe(1)
      expect(count2).toBe(1)
    })
  })

  /* ── unsubscribe ── */
  describe("unsubscribe", () => {
    it("unsubscribes with returned function", () => {
      let received = 0
      const unsub = eventBus.subscribe("battle:start", () => {
        received++
      })
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(received).toBe(1)
      unsub()
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(received).toBe(1)
    })

    it("does not affect other subscribers", () => {
      let received1 = 0
      let received2 = 0
      const unsub = eventBus.subscribe("battle:start", () => {
        received1++
      })
      eventBus.subscribe("battle:start", () => {
        received2++
      })
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(received1).toBe(1)
      expect(received2).toBe(1)
      unsub()
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(received1).toBe(1)
      expect(received2).toBe(2)
    })
  })

  /* ── subscribeAll ── */
  describe("subscribeAll", () => {
    it("receives all event types", () => {
      const received: string[] = []
      eventBus.subscribeAll((e) => {
        received.push(e.type)
      })
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      eventBus.publish({ type: "deck:card-added", cardId: cId("c1"), deckSize: 1 })
      eventBus.publish({ type: "wiki:entry-viewed", entryId: wId("Diana") })
      expect(received).toEqual(["battle:start", "deck:card-added", "wiki:entry-viewed"])
    })

    it("subscribeAll can be unsubscribed", () => {
      let received = 0
      const unsub = eventBus.subscribeAll(() => {
        received++
      })
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(received).toBe(1)
      unsub()
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(received).toBe(1)
    })
  })

  /* ── clear ── */
  describe("clear", () => {
    it("removes all subscribers", () => {
      let received = 0
      eventBus.subscribe("battle:start", () => {
        received++
      })
      eventBus.subscribeAll(() => {
        received++
      })
      eventBus.clear()
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(received).toBe(0)
    })
  })

  /* ── Event isolation ── */
  describe("event isolation", () => {
    it("does not notify subscribers of different event types", () => {
      let battleReceived = false
      let deckReceived = false
      eventBus.subscribe("battle:start", () => {
        battleReceived = true
      })
      eventBus.subscribe("deck:card-added", () => {
        deckReceived = true
      })
      eventBus.publish({ type: "battle:start", enemyId: eId("test"), deckSize: 5 })
      expect(battleReceived).toBe(true)
      expect(deckReceived).toBe(false)
    })
  })
})
