import type { SolveResult } from "./types";
import type { GridModel } from "./gridModel";
import { drawGrid, drawCell } from "./renderer";

const VISITED = "#3b82f6"; // blue flood
const PATH = "#fbbf24";    // amber path
const PER_FRAME = 10;      // cells revealed per frame (animation speed)

export function animate(ctx: CanvasRenderingContext2D, model: GridModel, result: SolveResult): void {
  drawGrid(ctx, model); // clear any previous run back to the base grid

  const { visitOrder, path } = result;
  let vi = 0; //position in array
  let pi = 0; //position in array

  function floodStep() {
    const end = Math.min(vi + PER_FRAME, visitOrder.length);
    for (; vi < end; vi++) {
      const i = visitOrder[vi];
      if (i !== model.start && i !== model.end) drawCell(ctx, model, i, VISITED);
    }
    if (vi < visitOrder.length) requestAnimationFrame(floodStep);
    else requestAnimationFrame(pathStep); // flood done -> trace the path
  }

  function pathStep() {
    const end = Math.min(pi + PER_FRAME, path.length);
    for (; pi < end; pi++) {
      const i = path[pi];
      if (i !== model.start && i !== model.end) drawCell(ctx, model, i, PATH);
    }
    if (pi < path.length) requestAnimationFrame(pathStep);
  }

  requestAnimationFrame(floodStep);
}