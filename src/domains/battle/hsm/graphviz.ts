/* ═══════════════════════════════════════════════════════════════
   L5 SESSION — HSM Graphviz DOT Utilities
   Standalone functions for DOT generation and SVG rendering.
   ═══════════════════════════════════════════════════════════════ */

import type { Hsm } from "./index"

/**
 * Generate a Graphviz DOT string from an Hsm instance.
 * Equivalent to calling `hsm.toDot()` — provided as a standalone
 * utility for consumers that prefer function-style APIs.
 */
export function hsmToDot(hsm: Hsm): string {
  return hsm.toDot()
}

/**
 * Render a DOT string to SVG.
 *
 * In a production environment this would invoke a Graphviz WASM
 * bundle or send the DOT source to a server-side renderer.
 * For now it returns a descriptive placeholder SVG so that the
 * API contract is satisfied and tests can assert on the shape.
 */
export async function dotToSvg(_dot: string): Promise<string> {
  // Placeholder: return a minimal SVG explaining that a real
  // Graphviz runtime is needed for actual rendering.
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="100">`,
    `  <rect width="400" height="100" fill="#f5f5f5" rx="8"/>`,
    `  <text x="200" y="50" text-anchor="middle"`,
    `        font-family="monospace" font-size="14" fill="#666">`,
    `    [Graphviz WASM renderer not configured]`,
    `  </text>`,
    `</svg>`,
  ].join("\n")
}
