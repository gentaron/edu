export const MODEL_VERSION: number;
export const ANCHOR: number;
export const COUPLING: { hw: number; ha: number; wa: number; g: number; peer: number; sigma: number };
export interface Person { id: string; name: string; nameEn: string; formal: string; formalEn: string; region: string; regionEn: string; role: string; roleEn: string; identity: string; identityEn: string; status: string }
export interface Env { care: number; pressure: number; opportunity: number }
export interface RelationCycle { ids: string[]; links: number[]; product: number }
export interface Convergence { iterations: number; residual: number; converged: boolean }
export interface RelationalGraph {
  edges: { i: number; j: number; weights: number[] }[];
  triangles: { nodes: number[]; links: number[] }[];
  counts: number[];
  normalization: number;
}
export interface State extends Env { h: number; w: number; a: number; assets: number; debt: number; expression: number; triad: number; triadField: number[]; triangleCount: number; cycle: RelationCycle | null; alleles: string }
export interface NowResult { version: number; day: number; states: State[]; convergence: Convergence }
export function computeNow(people: Person[], date?: Date): NowResult;
export function hash(s: string): number;
export function phaseAt(date: Date): { day: number; planet: number; binary: number };
export function environment(region: string, phase: { planet: number; binary: number }, feedback: { health: number; wealth: number; authority: number }): Env;
export function buildRelationalGraph(neighbors: number[][], zones: string[]): RelationalGraph;
export function cubicVertex(x: number[][], graph: RelationalGraph, inspect?: boolean): {
  trace: number; potential: number; gradient: number[][]; diagonal: number[];
  strongest: ({ nodes: number[]; links: number[]; product: number } | null)[];
};
