#!/bin/bash
source ~/emsdk/emsdk_env.sh > /dev/null 2>&1
cd "$(dirname "$0")"
emcc src/BFS.cpp src/DFS.cpp src/bindings.cpp -lembind -Iinclude \
  -o ../web/src/wasm/solver.js -sMODULARIZE=1 -sEXPORT_ES6=1 -sENVIRONMENT=web
