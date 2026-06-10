/**
 * Graph store for character/entity relationships
 * Provides graph query capabilities over wiki entity relations.
 * In production, this would use Apache AGE or pgGraph on PostgreSQL.
 * Current implementation uses an in-memory adjacency list.
 */

export interface GraphNode {
  id: string;
  label: string;
  type: string; // "character", "organization", "civilization", etc.
  properties: Record<string, string>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string; // "ally_of", "enemy_of", "member_of", "founded_by", etc.
  weight: number; // relation strength 0-1
}

export interface GraphPath {
  nodes: string[];
  edges: GraphEdge[];
  totalWeight: number;
}

class InMemoryGraphStore {
  private nodes = new Map<string, GraphNode>();
  private adjacency = new Map<string, GraphEdge[]>();

  addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
    if (!this.adjacency.has(node.id)) {
      this.adjacency.set(node.id, []);
    }
  }

  addEdge(edge: GraphEdge): void {
    const sourceEdges = this.adjacency.get(edge.source);
    if (sourceEdges) {
      sourceEdges.push(edge);
    }
  }

  getNeighbors(nodeId: string): Array<{ node: GraphNode; edge: GraphEdge }> {
    const edges = this.adjacency.get(nodeId) ?? [];
    const results: Array<{ node: GraphNode; edge: GraphEdge }> = [];
    for (const edge of edges) {
      const node = this.nodes.get(edge.target);
      if (node) {
        results.push({ node, edge });
      }
    }
    return results;
  }

  /** Find shortest path between two nodes (BFS) */
  findPath(source: string, target: string, maxDepth = 5): GraphPath | undefined {
    if (source === target) {
      return { nodes: [source], edges: [], totalWeight: 0 };
    }

    const visited = new Set<string>([source]);
    const queue: Array<{ nodeId: string; path: GraphPath }> = [
      { nodeId: source, path: { nodes: [source], edges: [], totalWeight: 0 } },
    ];

    let depth = 0;
    while (queue.length > 0 && depth < maxDepth) {
      const levelSize = queue.length;
      for (let i = 0; i < levelSize; i++) {
        const current = queue.shift();
        if (!current) {
          break;
        }

        const neighbors = this.getNeighbors(current.nodeId);
        for (const { node, edge } of neighbors) {
          if (visited.has(node.id)) {
            continue;
          }
          visited.add(node.id);

          const newPath: GraphPath = {
            nodes: [...current.path.nodes, node.id],
            edges: [...current.path.edges, edge],
            totalWeight: current.path.totalWeight + edge.weight,
          };

          if (node.id === target) {
            return newPath;
          }
          queue.push({ nodeId: node.id, path: newPath });
        }
      }
      depth++;
    }

    return undefined;
  }

  /** Get all nodes of a specific type */
  getNodesByType(type: string): GraphNode[] {
    const results: GraphNode[] = [];
    for (const node of this.nodes.values()) {
      if (node.type === type) {
        results.push(node);
      }
    }
    return results;
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  nodeCount(): number {
    return this.nodes.size;
  }

  edgeCount(): number {
    let count = 0;
    for (const edges of this.adjacency.values()) {
      count += edges.length;
    }
    return count;
  }

  /** Clear all nodes and edges (useful for testing) */
  clear(): void {
    this.nodes.clear();
    this.adjacency.clear();
  }
}

/** Singleton graph store instance */
export const graphStore = new InMemoryGraphStore();