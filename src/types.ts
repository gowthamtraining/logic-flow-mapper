export type NodeId = string;

export interface LogicNode {
  id: NodeId;
  condition: string;
  childrenIds: NodeId[];
}

export type LogicGraph = Record<NodeId, LogicNode>;

export interface CycleResult {
  hasCycle: boolean;
  cycleNodes: Set<NodeId>;
}
