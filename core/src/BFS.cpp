#include <emscripten/bind.h>  // for the JS binding 
#include <vector>             
#include <queue>              
#include <cstdint>        
#include <unordered_map>    
#include "Result.h"          
#include <algorithm>
#include <emscripten/val.h>   // emscripten::val + the array converter

const uint8_t WALL = 1;
SolveResult bfs(int height, int width,  emscripten::val cellsVal, int start, int end){
    //64x64 size;
    SolveResult result;
    std::vector<uint8_t> cells = emscripten::convertJSArrayToNumberVector<uint8_t>(cellsVal);
    std::unordered_map<int,int> map; //child, parent
    std::queue<int> q;
    int curr = start;
    bool found = false;



    q.push(start);
    map.insert(std::make_pair(start, -1));
    result.visitOrder.push_back(start);

    while(!q.empty()){
        int curr_idx = q.front();
        q.pop();
        //index above is curr-64, up
        if(curr_idx == end){
            curr = curr_idx;
            found = true;
            break;
        }
        
        //right
        if((curr_idx)%width!=width-1 && map.find(curr_idx+1) == map.end()  && cells[curr_idx+1] != WALL){
            q.push(curr_idx+1);
            map.insert(std::make_pair(curr_idx+1, curr_idx));
            result.visitOrder.push_back(curr_idx+1);
        }
         //down
        if(curr_idx+width<width*height && map.find(curr_idx+width) == map.end()  && cells[curr_idx+width] != WALL){
            q.push(curr_idx+width);
            map.insert(std::make_pair(curr_idx+width, curr_idx));
            result.visitOrder.push_back(curr_idx+width);
        }
        //left
        if((curr_idx)%width!=0 && map.find(curr_idx-1) == map.end()  && cells[curr_idx-1] != WALL){
            q.push(curr_idx-1);
            map.insert(std::make_pair(curr_idx-1, curr_idx));
            result.visitOrder.push_back(curr_idx-1);
        }
        //up
        if(curr_idx-height>=0 && map.find(curr_idx-height) == map.end() && cells[curr_idx-height] != WALL){  
            q.push(curr_idx-height);
            map.insert(std::make_pair(curr_idx-height, curr_idx));
            result.visitOrder.push_back(curr_idx-height);
        }
    }
    result.found = found;
    if(found){
        while(curr!=-1){
            result.path.push_back(curr);
            curr = map[curr];
        }
    }
    std::reverse(result.path.begin(), result.path.end());
    return result;
}

