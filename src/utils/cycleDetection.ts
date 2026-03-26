import { LogicGraph, NodeId, CycleResult } from "../types";

export function detectCycles(graph: LogicGraph): CycleResult {
  const ids = Object.keys(graph);
  const indexMap: Record<NodeId, number> = {};
  const lowLink: Record<NodeId, number> = {};
  const onStack: Record<NodeId, boolean> = {};
  const stack: NodeId[] = [];
  let index = 0;
  const cycleNodes = new Set<NodeId>();

  function strongConnect(nodeId: NodeId) {
    indexMap[nodeId] = index;
    lowLink[nodeId] = index;
    index++;
    stack.push(nodeId);
    onStack[nodeId] = true;

    const node = graph[nodeId];
    if (node) {
      for (const childId of node.childrenIds) {
        if (indexMap[childId] === undefined) {
          // Successor has not yet been visited; recurse on it
          strongConnect(childId);
          lowLink[nodeId] = Math.min(lowLink[nodeId], lowLink[childId]);
        } else if (onStack[childId]) {
          // Successor is in current SCC
          lowLink[nodeId] = Math.min(lowLink[nodeId], indexMap[childId]);
        }
      }
    }

    // If nodeId is a root node, pop the stack and generate an SCC
    if (lowLink[nodeId] === indexMap[nodeId]) {
      const component: NodeId[] = [];
      let w: NodeId;
      do {
        w = stack.pop()!;
        onStack[w] = false;
        component.push(w);
      } while (w !== nodeId);

      // If component has more than one node, or it's a single node with a self-loop
      if (component.length > 1) {
        component.forEach(id => cycleNodes.add(id));
      } else if (component.length === 1) {
        const singleNode = graph[component[0]];
        if (singleNode && singleNode.childrenIds.includes(component[0])) {
          cycleNodes.add(component[0]);
        }
      }
    }
  }

  for (const id of ids) {
    if (indexMap[id] === undefined) {
      strongConnect(id);
    }
  }

  return {
    hasCycle: cycleNodes.size > 0,
    cycleNodes,
  };
}
