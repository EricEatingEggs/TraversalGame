#pragma once
#include <vector>

struct SolveResult{
    std::vector<int> visitOrder;
    std::vector<int> path; //empty if start->end not found
    bool found;
};