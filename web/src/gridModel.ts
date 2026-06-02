export const GRID_W = 64;
export const GRID_H = 64;
export const OPEN = 0;
export const WALL = 1;

export class GridModel{
    readonly width = GRID_W;
    readonly height = GRID_H;
    //
    readonly cells = new Uint8Array(GRID_W * GRID_H);
    start = 0;
    end = (GRID_W*GRID_H)-1;

    idx(row:number, col:number) : number{
        return (row*this.width) +col;
    }

    inBounds(row: number, col:number): boolean{
        return row>=0 && row<this.height && col>=0 && col<this.width;
    }
}