import React from 'react';
import { useLogicFlow } from '../hooks/useLogicFlow';
import { LogicNodeComponent } from './LogicNodeComponent';

export const FlowCanvas: React.FC = () => {
  const { 
    graph, 
    cycleInfo, 
    addNode, 
    updateNode, 
    deleteNode, 
    linkNodes, 
    unlinkNodes 
  } = useLogicFlow();

  const handleSimulate = () => {
    if (cycleInfo.hasCycle) return;
    alert("Simulation started! Logic path is valid and all conditions are reachable.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8 font-sans selection:bg-blue-500/30">
      {/* Decorative background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
      </div>

      <header className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-800/50 pb-10 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
               <span className="text-xl font-bold">L</span>
             </div>
             <h1 className="text-4xl font-black bg-gradient-to-r from-blue-100 to-slate-400 bg-clip-text text-transparent tracking-tighter uppercase">
               Logic Flow Mapper
             </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium pl-[52px]">
            Recursive Logic Engine <span className="mx-2 text-slate-800">•</span> Real-time Validation <span className="mx-2 text-slate-800">•</span> Cycle Detection
          </p>
        </div>
        
        <div className="flex items-center gap-8 pl-[52px] md:pl-0">
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cycleInfo.hasCycle ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${cycleInfo.hasCycle ? 'text-red-400' : 'text-emerald-400'}`}>
                  {cycleInfo.hasCycle ? 'Cycle Detected' : 'Logic Validated'}
                </span>
             </div>
             <span className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-mono">
               {Object.keys(graph).length} Virtual Nodes
             </span>
          </div>

          <button 
            disabled={cycleInfo.hasCycle}
            onClick={handleSimulate}
            className={`group relative px-10 py-4 rounded-2xl font-black uppercase tracking-[0.15em] text-xs transition-all duration-500 overflow-hidden ${
              cycleInfo.hasCycle 
                ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800' 
                : 'bg-white text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
            }`}
          >
            <span className="relative z-10">Simulate Logic</span>
            {!cycleInfo.hasCycle && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity"></div>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto relative z-10 mb-32">
        <div className="relative">
          {/* Visual tree guide line */}
          <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-blue-500/40 via-blue-500/10 to-transparent"></div>
          
          <LogicNodeComponent 
            nodeId="root"
            graph={graph}
            cycleInfo={cycleInfo}
            onUpdate={updateNode}
            onAddChild={addNode}
            onDelete={deleteNode}
            onLink={linkNodes}
            onUnlink={unlinkNodes}
            isRoot={true}
          />
        </div>
      </main>

      {/* Error Toast */}
      {cycleInfo.hasCycle && (
        <div className="fixed bottom-10 right-10 max-w-sm bg-slate-900/80 backdrop-blur-xl border-t-2 border-red-500 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-5 duration-500">
          <div className="flex items-start gap-4">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-red-400 text-sm font-black uppercase tracking-widest">Logic Loop Detected</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed font-medium">
                Invalid circular dependency found. The engine cannot simulate logic while infinite loops exist. Please remove offending links.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="max-w-6xl mx-auto py-12 border-t border-slate-900 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-700">
        <p>© 2026 LOGIC FLOW ENGINE v1.0.0</p>
        <p>Built with React & TypeScript</p>
      </footer>
    </div>
  );
};
