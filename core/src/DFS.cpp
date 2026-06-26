#include <emscripten/bind.h>  // for the JS binding 
#include <vector>             
#include <stack>              
#include <cstdint>        
#include <unordered_map>    
#include "Result.h"          
#include <algorithm>
#include <emscripten/val.h>   // emscripten::val + the array converter


const uint8_t WALL = 1;
SolveResult dfs(int height,int width, emscripten::val cellsVal,  int start, int end){
    SolveResult result;
    std::vector<uint8_t> cells = emscripten::convertJSArrayToNumberVector<uint8_t>(cellsVal);
    std::unordered_map<int,int> map; //child, parent
    std::stack<int> s;
    bool found = false;
    int curr = start;

    s.push(start);
    map.insert(std::make_pair(start, -1));
    while(!s.empty()){
        int curr_idx = s.top();
        s.pop();
        result.visitOrder.push_back(curr_idx);

        if(curr_idx == end){
            found = true;
            curr = curr_idx;
            break;
        }
        //right
        if(curr_idx%width!=width-1 && cells[curr_idx+1]!=WALL && map.find(curr_idx+1) == map.end()){
            s.push(curr_idx+1);
            map.insert(std::make_pair(curr_idx+1, curr_idx));
        }
        //down
        if(curr_idx+width<width*height && cells[curr_idx+width]!=WALL && map.find(curr_idx+width) == map.end()){
            s.push(curr_idx+width);
            map.insert(std::make_pair(curr_idx+width, curr_idx));
        }
        //left
        if(curr_idx%width>0 && cells[curr_idx-1]!=WALL && map.find(curr_idx-1) == map.end()){
            s.push(curr_idx-1);
            map.insert(std::make_pair(curr_idx-1, curr_idx));
        }
        //up
        if(curr_idx-width>=0 && cells[curr_idx-width]!=WALL && map.find(curr_idx-width) == map.end()){
            s.push(curr_idx-width);
            map.insert(std::make_pair(curr_idx-width, curr_idx));
        }
    }
    result.found = found;
    if(found){
        while(curr != -1){
            result.path.push_back(curr);
            curr = map[curr];
        }
        std::reverse(result.path.begin(), result.path.end());
    }
    return result;
}

