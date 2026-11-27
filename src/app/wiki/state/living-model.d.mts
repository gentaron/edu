export const MODEL_VERSION: number;
export const MOBILITY: number[];
export interface Person { id: string; name: string; nameEn: string; formal: string; formalEn: string; region: string; regionEn: string; role: string; roleEn: string; identity: string; identityEn: string; status: string }
export interface State { h: number; w: number; a: number; assets: number; debt: number; expression: number; care: number; pressure: number; opportunity: number; alleles: string }
export interface Summary { median: number; topShare: number; negative: number; meanH: number; meanA: number }
export interface Snapshot { day: number; current: State[]; summary: Summary }
export interface Genetics { gst: number; heterozygosity: number; ld: number }
export interface Ledger { wage: number; expense: number; returns: number; upside: number; downside: number; exchange: number; debtService: number; vertex: number; clip: number; change: number; closure: number }
export interface Current { from: number; to: number; net: number }
export interface Nonequilibrium { irreversibility: { rate: number; currents: Current[] }; tau: number | null; rho: number | null; stationary: number[]; stationaryGap: number }
export interface Result { version?: number; day: number; history: (Summary & Partial<Observables> & { day: number; predictionLoss?: number; dissipation?: number })[]; snapshots: Snapshot[]; current: State[]; summary: Summary; ancestry?: number[][]; genetics?: Genetics[]; learned?: number[]; samples?: number; diagnostics?: Observables; transition?: { residual: number | null; samples: number }; bootstrap?: { connected3: [number, number] }; ledger?: Ledger; nonequilibrium?: Nonequilibrium }
export function simulate(people: Person[], day: number, scenario?: string, seed?: number): Result;

export interface CouplingEffects { wealthToHealth: number; authorityToHealth: number; healthToWealth: number; authorityToWealth: number; healthToAuthority: number; wealthToAuthority: number }
export function couplingEffects(s: State): CouplingEffects;

export interface Observables { connected3:number; entropy:number; entropyMM:number; totalCorrelation:number; klFine:number; klCoarse:number; informationLoss:number; counts:number[]; gini:number; hill:number|null; hillSE:number|null }
export function observables(states:State[]):Observables;
export function vertex(h:number,w:number,a:number):{cubic:number;potential:number;dh:number;dw:number;da:number;dampH:number;dampW:number;dampA:number;gradient:number[];dissipation:number};
export function transitionResidual(one:number[][],two:number[][]):{residual:number|null;samples:number};
export function logitStep(p:number,mu:number,sigma:number,z:number):number;
export function hillEstimator(values:number[]):{alpha:number|null;se:number|null;k:number};
export function gini(values:number[]):number;
export function irreversibility(one:number[][]):{rate:number;currents:Current[]};
export function relaxation(one:number[][]):{tau:number|null;rho:number|null;stationary:number[]};
