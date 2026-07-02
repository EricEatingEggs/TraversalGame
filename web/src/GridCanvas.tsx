import {useEffect, useRef, useState} from "react";
import type {Algo} from "./solver";
import {GridModel, GRID_W, GRID_H, WALL, OPEN} from "./gridModel";
import {drawGrid, CELL_PX} from "./renderer";
import {animate} from "./animator";
import{solveFromTo} from "./solver";


export default function GridCanvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const modelRef = useRef(new GridModel());
    const ctxRef = useRef<CanvasRenderingContext2D| null>(null);
    
    const drawRef = useRef(false); //are we mid draw/drag?
    const [eraseOn, setEraseOn] = useState(true);
     const eraseRef = useRef(eraseOn); //are we mid erase?
    const numWallsRef = useRef(0);
    const MAXWALLS = Math.floor(GRID_W*GRID_H*0.1);
    
   
    const [toggleMode, setToggleMode] = useState(false);
    const toggleModeRef = useRef(toggleMode);

    const [playerAlgo, setPlayerAlgo] = useState<Algo>("bfs");
    const [botAlgo, setbotAlgo] = useState<Algo>("dfs");
    const playerAlgoRef = useRef(playerAlgo);
    const botAlgoRef = useRef(botAlgo);


    useEffect(() => { playerAlgoRef.current = playerAlgo; }, [playerAlgo]);
    useEffect(() => { botAlgoRef.current = botAlgo; }, [botAlgo]);
    useEffect(() => { eraseRef.current = eraseOn; }, [eraseOn]);
    useEffect(() => { toggleModeRef.current = toggleMode; }, [toggleMode]);

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
                //eraseRef.current = !eraseRef.current;
                setEraseOn(v=>!v);
            }
            if(e.key === "t"){
                //toggleModeRef.current = !toggleModeRef.current;
                setToggleMode(v=>!v);
            }
            if(e.key === "v"){
                runRace();
                /*
                const ctx = ctxRef.current;
                if(!ctx){return;}
                const [player, bot] = await Promise.all([
                    solveFromTo(modelRef.current,playerAlgoRef.current, modelRef.current.start, modelRef.current.end),
                    solveFromTo(modelRef.current,botAlgoRef.current, modelRef.current.end, modelRef.current.start),
                ]);
                //const result = await solve(modelRef.current, "dfs");
                animate(ctx, modelRef.current,player, bot, modelRef.current.end, modelRef.current.start, toggleModeRef.current);
                */
            }
        }
        window.addEventListener("keydown", onKey);
        return ()=>window.removeEventListener("keydown", onKey);

    },[]);
    async function runRace(){
        const ctx = ctxRef.current;
        if(!ctx) {return;}
        const [player, bot] = await Promise.all([
                    solveFromTo(modelRef.current,playerAlgoRef.current, modelRef.current.start, modelRef.current.end),
                    solveFromTo(modelRef.current,botAlgoRef.current, modelRef.current.end, modelRef.current.start),
        ]);
        animate(ctx, modelRef.current,player, bot, modelRef.current.end, modelRef.current.start, toggleModeRef.current);

    }
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap:16}}>
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
            <div style={{ display:"flex", gap:20, alignItems:"center"}}>
                <label style={{color: "#e2e8f0"}}>
                    Player: {" "}
                    <select value={playerAlgo} onChange={(e) =>setPlayerAlgo(e.target.value as Algo)}>
                        <option value= "bfs">BFS</option>
                        <option value = "dfs">DFS</option>
                    </select>
                </label>
                <label style={{color:"#e2e8f0"}}>
                    Bot:{" "}
                    <select value={botAlgo} onChange={(e)=> setbotAlgo(e.target.value as Algo)}>
                        <option value = "bfs">BFS</option>
                        <option value = "dfs">DFS</option>
                    </select>
                </label>
                <button
                    onClick={() => setEraseOn((v) => !v)}
                    style={{ background: eraseOn ? "#22c55e" : "#334155", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
                >
                  'e' toggle erase  
                </button>

                <button
                    onClick={() => setToggleMode((e) => !e)}
                    style = {{background: toggleMode ? "#22c55e" : "#334155",color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
                >
                    't' toggle mode
                </button>
                <button
                    onClick={runRace}
                    style={{ background: "#3b82f6", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
                    >
                    'v' run
                </button>
            </div>

        </div>
        
    );
}