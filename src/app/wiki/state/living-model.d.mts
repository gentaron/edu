export interface Person { id: string; name: string; nameEn: string; formal: string; formalEn: string; region: string; regionEn: string; role: string; roleEn: string; identity: string; identityEn: string; status: string }
export interface State { h: number; w: number; a: number; assets: number; debt: number; expression: number; care: number; pressure: number; opportunity: number; alleles: string }
export interface Summary { median: number; topShare: number; negative: number; meanH: number; meanA: number }
export interface Snapshot { day: number; current: State[]; summary: Summary }
export interface Result { day: number; history: (Summary & { day: number })[]; snapshots: Snapshot[]; current: State[]; summary: Summary; ancestry?: number[][]; learned?: number[]; samples?: number }
export function simulate(people: Person[], day: number, scenario?: string, seed?: number): Result;
