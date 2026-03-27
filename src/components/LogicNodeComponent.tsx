import React from 'react';
import { NodeId, LogicNode, CycleResult } from '../types';

interface Props {
  nodeId: NodeId;
  graph: Record<NodeId, LogicNode>;
  cycleInfo: CycleResult;
  onUpdate: (id: NodeId, updates: Partial<LogicNode>) => void;
  onAddChild: (parentId: NodeId) => void;
  onDelete: (id: NodeId) => void;
  onLink: (sourceId: NodeId, targetId: NodeId) => void;
  onUnlink: (sourceId: NodeId, targetId: NodeId) => void;
  isRoot?: boolean;
  path?: NodeId[];
}

export const LogicNodeComponent: React.FC<Props> = ({
  nodeId,
  graph,
  cycleInfo,
  onUpdate,
  onAddChild,
  onDelete,
  onLink,
  onUnlink,
  isRoot = false,
  path = [],
}) => {
  const node = graph[nodeId];
  if (!node) return null;

  const isInCycle = cycleInfo.cycleNodes.has(nodeId);
  const isSelfInPath = path.includes(nodeId);

  if (isSelfInPath) {
    return (
      <div className="ml-8 mt-4 p-3 bg-red-900/40 border-2 border-red-500 rounded-lg text-red-100 flex items-center gap-2 animate-pulse shadow-lg shadow-red-500/20">
        <span className="text-xl">⚠️</span>
        <div className="flex flex-col">
          <span className="font-bold text-xs uppercase tracking-wider">Infinite Loop</span>
          <span className="text-[10px] opacity-80">Circular reference to: {nodeId}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`ml-4 md:ml-8 mt-4 border-l-2 pl-4 md:pl-6 relative transition-colors flex-shrink-0 ${isInCycle ? 'border-red-500' : 'border-blue-500/30'}`}>
      {/* Visual connector dash */}
      <div className={`absolute top-8 left-0 w-6 h-[2px] ${isInCycle ? 'bg-red-500' : 'bg-blue-500/30'}`}></div>

      <div className={`p-4 rounded-xl bg-slate-800/80 backdrop-blur-sm border-2 transition-all duration-500 min-w-[280px] sm:min-w-[320px] ${
        isInCycle 
          ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse-slow' 
          : 'border-slate-700 hover:border-blue-400/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isInCycle ? 'bg-red-500' : 'bg-blue-500'}`}></span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">{nodeId}</span>
          </div>
          {!isRoot && (
            <button 
              onClick={() => onDelete(nodeId)}
              className="text-[10px] uppercase font-bold text-slate-500 hover:text-red-400 transition-colors tracking-widest"
            >
              Remove
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <span className="text-xs italic font-serif">if</span>
            </div>
            <input 
              type="text"
              value={node.condition}
              onChange={(e) => onUpdate(nodeId, { condition: e.target.value })}
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg py-2 pl-8 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-600"
              placeholder="e.g. data.value > 100"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button 
              onClick={() => onAddChild(nodeId)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg transition-all"
            >
              <span>+</span>
              <span>Branch</span>
            </button>
            
            <select 
              className="px-3 bg-slate-800 border border-slate-700 text-[10px] text-slate-200 rounded-lg py-2 focus:outline-none hover:border-blue-500/30 transition-all font-bold uppercase tracking-widest ring-offset-slate-900"
              value=""
              onChange={(e) => {
                if (e.target.value) onLink(nodeId, e.target.value);
              }}
            >
              <option value="">Link</option>
              {Object.keys(graph).filter(id => id !== nodeId && !node.childrenIds.includes(id)).map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>
        </div>

        {node.childrenIds.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-700/30 flex flex-wrap gap-1">
            {node.childrenIds.map(cid => (
              <div key={`link-${cid}`} className="group relative flex items-center bg-slate-900/80 px-2 py-1 rounded text-[9px] text-blue-400 font-mono border border-blue-500/10">
                {cid}
                <button 
                   onClick={() => onUnlink(nodeId, cid)}
                   className="ml-2 text-slate-600 hover:text-red-400 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {node.childrenIds.map(childId => (
          <LogicNodeComponent 
            key={`${nodeId}-${childId}`}
            nodeId={childId}
            graph={graph}
            cycleInfo={cycleInfo}
            onUpdate={onUpdate}
            onAddChild={onAddChild}
            onDelete={onDelete}
            onLink={onLink}
            onUnlink={onUnlink}
            path={[...path, nodeId]}
          />
        ))}
      </div>
    </div>
  );
};
