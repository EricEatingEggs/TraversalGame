import {GridModel, WALL} from "./gridModel";

export const CELL_PX = 10; // 64 cells * 10px = 640px canvas

const COLOR_GRID  = "#0f172a"; // gaps between cells (reads as grid lines)
const COLOR_OPEN  = "#64748b";
const COLOR_WALL  = "#e2e8f0";
const COLOR_START = "#22c55e"; // green
const COLOR_END   = "#ef4444"; // red

export function drawGrid(ctx: CanvasRenderingContext2D, model: GridModel): void{
    ctx.fillStyle = COLOR_GRID;
    ctx.fillRect(0,0,model.width*CELL_PX, model.height*CELL_PX);

    for(let r = 0;r<model.height;r++){
        for(let c = 0;c<model.width;c++){
            const i = model.idx(r,c);

            let COLOR = COLOR_OPEN;
            if(model.cells[i] == WALL){
                COLOR = COLOR_WALL;
            }
            if(i == model.start){
                COLOR = COLOR_START;
            }
            if(i == model.end){
                COLOR = COLOR_END;
            }

            ctx.fillStyle = COLOR;
            ctx.fillRect(c*CELL_PX+1, r*CELL_PX+1, CELL_PX-1, CELL_PX-1); //fill cell with a boarder
        }
    }
}

export function drawCell(ctx: CanvasRenderingContext2D, model: GridModel, index: number, color: string): void{
    const col = index%model.width;
    const row = Math.floor(index/model.width);
    ctx.fillStyle = color;
    ctx.fillRect(col * CELL_PX + 1, row * CELL_PX + 1, CELL_PX - 1, CELL_PX - 1);
}