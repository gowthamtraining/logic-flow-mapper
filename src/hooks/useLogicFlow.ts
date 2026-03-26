import { useState, useMemo, useCallback } from 'react';
import { LogicGraph, NodeId, LogicNode } from '../types';
import { detectCycles } from '../utils/cycleDetection';

const INITIAL_NODE_ID = 'root';

const INITIAL_GRAPH: LogicGraph = {
  [INITIAL_NODE_ID]: {
    id: INITIAL_NODE_ID,
    condition: 'Set initial condition...',
    childrenIds: [],
  },
};

export function useLogicFlow() {
  const [graph, setGraph] = useState<LogicGraph>(INITIAL_GRAPH);

  const cycleInfo = useMemo(() => detectCycles(graph), [graph]);

  const addNode = useCallback((parentId: NodeId) => {
    const newId = `node_${Math.random().toString(36).substring(2, 9)}`;
    const newNode: LogicNode = {
      id: newId,
      condition: 'If condition is true...',
      childrenIds: [],
    };

    setGraph(prev => {
      if (!prev[parentId]) return prev;
      return {
        ...prev,
        [newId]: newNode,
        [parentId]: {
          ...prev[parentId],
          childrenIds: [...prev[parentId].childrenIds, newId],
        },
      };
    });
    return newId;
  }, []);

  const updateNode = useCallback((id: NodeId, updates: Partial<LogicNode>) => {
    setGraph(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: { ...prev[id], ...updates },
      };
    });
  }, []);

  const deleteNode = useCallback((id: NodeId) => {
    if (id === INITIAL_NODE_ID) return;

    setGraph(prev => {
      const newGraph = { ...prev };
      delete newGraph[id];

      // Remove references from all parents
      Object.keys(newGraph).forEach(nodeId => {
        if (newGraph[nodeId].childrenIds.includes(id)) {
          newGraph[nodeId] = {
            ...newGraph[nodeId],
            childrenIds: newGraph[nodeId].childrenIds.filter(cid => cid !== id),
          };
        }
      });

      return newGraph;
    });
  }, []);

  const linkNodes = useCallback((sourceId: NodeId, targetId: NodeId) => {
    if (sourceId === targetId) return;
    
    setGraph(prev => {
      if (!prev[sourceId] || !prev[targetId]) return prev;
      if (prev[sourceId].childrenIds.includes(targetId)) return prev;

      return {
        ...prev,
        [sourceId]: {
          ...prev[sourceId],
          childrenIds: [...prev[sourceId].childrenIds, targetId],
        },
      };
    });
  }, []);

  const unlinkNodes = useCallback((sourceId: NodeId, targetId: NodeId) => {
    setGraph(prev => {
      if (!prev[sourceId]) return prev;
      return {
        ...prev,
        [sourceId]: {
          ...prev[sourceId],
          childrenIds: prev[sourceId].childrenIds.filter(id => id !== targetId),
        },
      };
    });
  }, []);

  return {
    graph,
    cycleInfo,
    addNode,
    updateNode,
    deleteNode,
    linkNodes,
    unlinkNodes,
  };
}
