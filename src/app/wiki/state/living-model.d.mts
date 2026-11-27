export interface Person { id: string; name: string; nameEn: string; formal: string; formalEn: string; region: string; regionEn: string; role: string; roleEn: string; identity: string; identityEn: string; status: string }
export interface State { h: number; w: number; a: number; assets: number; debt: number; expression: number; care: number; pressure: number; opportunity: number; alleles: string }
export interface Summary { median: number; topShare: number; negative: number; meanH: number; meanA: number }
export interface Snapshot { day: number; current: State[]; summary: Summary }
export interface Result { day: number; history: (Summary & Partial<Observables> & { day: number; predictionLoss?: number })[]; snapshots: Snapshot[]; current: State[]; summary: Summary; ancestry?: number[][]; learned?: number[]; samples?: number; diagnostics?: Observables; transition?: { residual: number | null; samples: number } }
export function simulate(people: Person[], day: number, scenario?: string, seed?: number): Result;

export interface CouplingEffects { wealthToHealth: number; authorityToHealth: number; healthToWealth: number; authorityToWealth: number; healthToAuthority: number; wealthToAuthority: number }
export function couplingEffects(s: State): CouplingEffects;

export interface Observables { connected3:number; entropy:number; totalCorrelation:number; klFine:number; klCoarse:number; informationLoss:number; counts:number[] }
export function observables(states:State[]):Observables;
export function vertex(h:number,w:number,a:number):{cubic:number;potential:number;dh:number;dw:number;da:number;dampH:number;dampW:number;dampA:number};
export function transitionResidual(one:number[][],two:number[][]):{residual:number|null;samples:number};
