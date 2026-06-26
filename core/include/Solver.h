#pragma once
#include <emscripten/val.h>
#include "Result.h"

SolveResult bfs(int height, int width, emscripten::val cells, int start, int end);
SolveResult dfs(int height, int width, emscripten::val cells, int start, int end);