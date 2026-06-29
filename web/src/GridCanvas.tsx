import {useEffect, useRef} from "react";
import {GridModel, GRID_W, GRID_H, WALL, OPEN} from "./gridModel";
import {drawGrid, CELL_PX} from "./renderer";
import {animate} from "./animator";
import{solveFromTo} from "./solver";


export default function GridCanvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const modelRef = useRef(new GridModel());
    const ctxRef = useRef<CanvasRenderingContext2D| null>(null);
    const drawRef = useRef(false); //are we mid draw/drag?
    const eraseRef = useRef(false); //are we mid erase?
    const numWallsRef = useRef(0);
    const MAXWALLS = Math.floor(GRID_W*GRID_H*0.1);
    const toggleModeRef = useRef(false);

    useEffect(() =>{
        const canvas = canvasRef.current;
        if(!canvas){
            return;
        }
        const ctx = canvas.getContext("2d");
        if(!ctx){
            return;
        }
        ctxRef.current = ctx;
        drawGrid(ctx, modelRef.current);
    }, []);
    useEffect(()=> {
        async function onKey(e: KeyboardEvent){
            if(e.key === "e"){
                eraseRef.current = !eraseRef.current;
            }
            if(e.key === "t"){
                toggleModeRef.current = !toggleModeRef.current;
            }
            if(e.key === "v"){
                const ctx = ctxRef.current;
                if(!ctx){return;}
                const [player, bot] = await Promise.all([
                    solveFromTo(modelRef.current,"dfs", modelRef.current.start, modelRef.current.end),
                    solveFromTo(modelRef.current,"bfs", modelRef.current.end, modelRef.current.start),
                ]);
                //const result = await solve(modelRef.current, "dfs");
                animate(ctx, modelRef.current,player, bot, modelRef.current.end, modelRef.current.start, toggleModeRef.current);
            }
        }
        window.addEventListener("keydown", onKey);
        return ()=>window.removeEventListener("keydown", onKey);

    },[]);

    function cellIdx(clientX: number, clientY: number): number | null{
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if(!canvas || !ctx){ return null;}
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width/rect.width;
        const scaleY = canvas.height/rect.height;

        const x = (clientX-rect.left)*scaleX;
        const y = (clientY-rect.top)*scaleY;
        const col = Math.floor(x/CELL_PX);
        const row = Math.floor(y/CELL_PX);

        const model = modelRef.current;
        if(!model.inBounds(row, col)){return null;}
        const i = model.idx(row, col);
        if(i == model.start || i==model.end){ return null; }

        return i;
    }

    function applyAt(clientX:number, clientY:number): void{
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        if(!ctx || !canvas){return;}
        const i = cellIdx(clientX, clientY);
        if(i === null){return;}
        
        const model = modelRef.current;
        if(eraseRef.current){
            if(model.cells[i] === WALL){
                numWallsRef.current--;
                model.cells[i] = OPEN;
            }
        } else{
            if(model.cells[i] != WALL && numWallsRef.current<MAXWALLS){
                numWallsRef.current++;
                model.cells[i] = WALL;
            }
        }
        //model.cells[i] = eraseRef.current? OPEN: WALL;
        drawGrid(ctx, model);
    }
    
    return(
        <canvas
            ref = {canvasRef}
            width = {GRID_W*CELL_PX}
            height = {GRID_H*CELL_PX}
            style={{ border: "1px solid #334155", cursor: "crosshair"}}
            onMouseDown={(e) => {drawRef.current = true; applyAt(e.clientX, e.clientY)}}
            onMouseMove={(e) =>{if(drawRef.current) applyAt(e.clientX, e.clientY)}}
            onMouseUp = {()=>{drawRef.current = false;}}
            onMouseLeave = {()=>{drawRef.current = false;}}
        />
    );
}