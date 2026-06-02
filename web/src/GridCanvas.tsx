import {useEffect, useRef} from "react";
import {GridModel, GRID_W, GRID_H} from "./gridModel";
import {drawGrid, CELL_PX} from "./renderer";

export default function GridCanvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const modelRef = useRef(new GridModel());

    useEffect(() =>{
        const canvas = canvasRef.current;
        if(!canvas){
            return;
        }
        const ctx = canvas.getContext("2d");
        if(!ctx){
            return;
        }
        drawGrid(ctx, modelRef.current);
    }, []);
    return(
        <canvas
            ref = {canvasRef}
            width = {GRID_W*CELL_PX}
            height = {GRID_H*CELL_PX}
            style={{ border: "1px solid #334155" }}
        />
    )
}