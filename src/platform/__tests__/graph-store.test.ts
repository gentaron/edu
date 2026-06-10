import { describe, it, expect, beforeEach } from "vitest";
import { graphStore } from "@/platform/graph-store";
import type { GraphNode, GraphEdge } from "@/platform/graph-store";

describe("graphStore", () => {
  const alice: GraphNode = { id: "alice", label: "Alice", type: "character", properties: { faction: "elyseon" } };
  const bob: GraphNode = { id: "bob", label: "Bob", type: "character", properties: { faction: "granbell" } };
  const corp: GraphNode = { id: "corp", label: "Corp", type: "organization", properties: {} };
  const allyEdge: GraphEdge = { id: "e1", source: "alice", target: "bob", relation: "ally_of", weight: 0.8 };
  const memberEdge: GraphEdge = { id: "e2", source: "alice", target: "corp", relation: "member_of", weight: 0.9 };

  beforeEach(() => {
    graphStore.clear();
  });

  /* ── addNode + getNeighbors ── */
  describe("addNode and getNeighbors", () => {
    it("returns neighbors with their connecting edges", () => {
      graphStore.addNode(alice);
      graphStore.addNode(bob);
      graphStore.addEdge(allyEdge);

      const neighbors = graphStore.getNeighbors("alice");
      expect(neighbors).toHaveLength(1);
      expect(neighbors[0]!.node.id).toBe("bob");
      expect(neighbors[0]!.edge.relation).toBe("ally_of");
    });

    it("returns empty array for node with no edges", () => {
      graphStore.addNode(alice);
      const neighbors = graphStore.getNeighbors("alice");
      expect(neighbors).toHaveLength(0);
    });

    it("returns empty array for nonexistent node", () => {
      const neighbors = graphStore.getNeighbors("nonexistent");
      expect(neighbors).toHaveLength(0);
    });
  });

  /* ── findPath ── */
  describe("findPath", () => {
    it("finds direct path between connected nodes", () => {
      graphStore.addNode(alice);
      graphStore.addNode(bob);
      graphStore.addEdge(allyEdge);

      const path = graphStore.findPath("alice", "bob");
      expect(path).toBeDefined();
      expect(path!.nodes).toEqual(["alice", "bob"]);
      expect(path!.edges).toHaveLength(1);
      expect(path!.totalWeight).toBeCloseTo(0.8);
    });

    it("finds multi-hop path through intermediate node", () => {
      graphStore.addNode(alice);
      graphStore.addNode(bob);
      graphStore.addNode(corp);
      graphStore.addEdge(memberEdge);
      graphStore.addEdge({ id: "e3", source: "corp", target: "bob", relation: "led_by", weight: 0.5 });

      const path = graphStore.findPath("alice", "bob");
      expect(path).toBeDefined();
      expect(path!.nodes).toEqual(["alice", "corp", "bob"]);
      expect(path!.totalWeight).toBeCloseTo(1.4);
    });

    it("returns undefined for disconnected nodes", () => {
      graphStore.addNode(alice);
      graphStore.addNode(bob);

      const path = graphStore.findPath("alice", "bob");
      expect(path).toBeUndefined();
    });

    it("returns trivial path when source equals target", () => {
      graphStore.addNode(alice);
      const path = graphStore.findPath("alice", "alice");
      expect(path).toBeDefined();
      expect(path!.nodes).toEqual(["alice"]);
      expect(path!.edges).toHaveLength(0);
      expect(path!.totalWeight).toBe(0);
    });
  });

  /* ── getNodesByType ── */
  describe("getNodesByType", () => {
    it("returns only nodes of the specified type", () => {
      graphStore.addNode(alice);
      graphStore.addNode(bob);
      graphStore.addNode(corp);

      const characters = graphStore.getNodesByType("character");
      expect(characters).toHaveLength(2);
      expect(characters.every((n) => n.type === "character")).toBe(true);
    });

    it("returns empty array for nonexistent type", () => {
      graphStore.addNode(alice);
      const results = graphStore.getNodesByType("spaceship");
      expect(results).toHaveLength(0);
    });

    it("reflects count and edge metrics", () => {
      graphStore.addNode(alice);
      graphStore.addNode(bob);
      graphStore.addEdge(allyEdge);

      expect(graphStore.nodeCount()).toBe(2);
      expect(graphStore.edgeCount()).toBe(1);
    });
  });
});