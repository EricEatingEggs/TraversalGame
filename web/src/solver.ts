import type { SolveResult } from "./types";
import type {GridModel} from "./gridModel";

import createModule from "./wasm/solver.js";

let modulePromise: Promise<any> |null = null;
function getModule() {
    if(!modulePromise){ modulePromise = createModule();}
    return modulePromise;
}

function vectToArray(vec: any): number[] {
    const out:number[] = []
    for(let i = 0;i<vec.size();i++){
        out.push(vec.get(i));
    }
    return out;
}

export type Algo = "bfs" | "dfs";
export async function solve(model: GridModel, algo: Algo): Promise<SolveResult> {
    const m = await getModule(); 
    const raw = m[algo](model.height, model.width, model.cells, model.start, model.end);
    const result: SolveResult = {
        visitOrder: vectToArray(raw.visitOrder),
        path: vectToArray(raw.path),
        found: raw.found,
    };
    raw.visitOrder.delete(); //free memory associated
    raw.path.delete();
    return result;
}
