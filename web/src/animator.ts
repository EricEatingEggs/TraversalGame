import type { SolveResult } from "./types";
import type { GridModel } from "./gridModel";
import { drawGrid, drawCell } from "./renderer";

const BOTH = "#22c55e"; 
const PLAYER_VISITED = "#ffee00fa";
const BOT_VISITED = "#24fbf0ff";
const PLAYER_PATH = "#fbbf24";    
const BOT_PATH = "#3b82f6";
const PER_FRAME = 5;      // cells revealed per frame (animation speed)


export function animate(ctx: CanvasRenderingContext2D, model: GridModel, player: SolveResult, bot: SolveResult, playerTarget: number, botTarget:number, shortestPath: boolean): void {
  drawGrid(ctx, model); // clear any previous run back to the base grid

  //const { visitOrder, path } = result;
  let bi = 0; //position in array bot
  let pi = 0; //position in array player
  let over = false;
  let playerDone = false;
  let botDone = false;
  let current_idx = 0;
  let path:number[];
  let color:string;

  const playerSeen = new Set<number>();
  const botSeen = new Set<number>();

  function reached(order: number[], count:number, target:number): boolean{
    for(let i = 0;i<count;i++){
      if(order[i] == target){
        return true;
      }
    }
    return false;
  }
   function drawPathStep(){
    const pathEnd = Math.min(current_idx+PER_FRAME, path.length);
    while(current_idx<pathEnd){
      const c = path[current_idx];
      if (c !== model.start && c !== model.end) drawCell(ctx, model, c, color);
      current_idx++;
    }
    if(current_idx<path.length) requestAnimationFrame(drawPathStep);
  }
  function step(){
    if(over) return;
    //player's batch
    const player_end = Math.min(pi+ PER_FRAME, player.visitOrder.length);
    while(pi<player_end){
      const curr = player.visitOrder[pi];
      if(curr!== model.start && curr!==model.end){
        if(botSeen.has(curr)){
          drawCell(ctx, model, curr, BOTH);
        }
        else{
          drawCell(ctx, model, curr, PLAYER_VISITED);
        }
        playerSeen.add(curr);
      }
      pi++;
    }
    //bot's batch
    const bot_end = Math.min(bi+ PER_FRAME, bot.visitOrder.length);
    while(bi<bot_end){
      const curr = bot.visitOrder[bi];
      if(curr!== model.start && curr!==model.end){
        if(playerSeen.has(curr)){
          drawCell(ctx, model, curr, BOTH);
        }
        else{
          drawCell(ctx, model, curr, BOT_VISITED);
        }
        botSeen.add(curr);
      }
      bi++;
    }



    if(shortestPath){
      if(!playerDone && (reached(player.visitOrder, pi, playerTarget) ||pi >= player.visitOrder.length)){
        playerDone = true;
      }
      if(!botDone && (reached(bot.visitOrder, bi, botTarget) ||bi >= bot.visitOrder.length)){
        botDone = true;
      }
      if(playerDone && botDone){
        over = true;
        let playerLen: number;
        let botLen: number;
        
        if(player.found){
          playerLen = player.path.length;
        } else{
          playerLen = Infinity;
        }
        if(bot.found){
          botLen = bot.path.length;
        } else{
          botLen = Infinity;
        }

        if(playerLen != Infinity && botLen !=Infinity){
          if(playerLen<botLen){
            path = player.path;
            color = PLAYER_PATH;
          } else if (botLen<playerLen){
            path = bot.path;
            color = BOT_PATH;
          } else{
            return; //freeze on tie
          }
          requestAnimationFrame(drawPathStep);
          return; //freeze
        }

      }
    }
    else{
      const playerWon = reached(player.visitOrder, pi, playerTarget);
    const botWon = reached(bot.visitOrder, bi, botTarget);

    if(playerWon || botWon){
        over = true;
        if(playerWon && botWon){
          return;
        }
        else if(playerWon){
          path = player.path;
          color = PLAYER_PATH;
        } else{
          path = bot.path;
          color = BOT_PATH;
        }
        requestAnimationFrame(drawPathStep);
        return; //freeze
      }
    }
    if(pi < player.visitOrder.length || bi < bot.visitOrder.length){
      requestAnimationFrame(step);
    }
  }
   requestAnimationFrame(step);
}