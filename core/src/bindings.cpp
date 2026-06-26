#include <emscripten/bind.h>
#include "solver.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(sovler_module){
    register_vector<int>("VectorInt");

    value_object<SolveResult>("SovleResult")
        .field("visitOrder", &SolveResult::visitOrder)
        .field("path", &SolveResult::path)
        .field("found", &SolveResult::found);
    function("bfs", &bfs);
    function("dfs", &dfs);
}