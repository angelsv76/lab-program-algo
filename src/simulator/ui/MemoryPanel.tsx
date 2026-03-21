
import React from 'react';
import { Database, Hash, Type } from 'lucide-react';

interface MemoryPanelProps {
  memory: Record<string, any>;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ memory }) => {
  const entries = Object.entries(memory);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 bg-slate-50">
        <Database size={16} className="text-indigo-500" />
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Panel de Memoria</span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
            <Database size={32} className="mb-2 opacity-20" />
            <p className="text-sm italic">No hay variables en memoria.</p>
            <p className="text-xs mt-1">Las variables aparecerán aquí cuando el algoritmo las cree.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-4 py-2 font-semibold">Variable</th>
                <th className="px-4 py-2 font-semibold">Tipo</th>
                <th className="px-4 py-2 font-semibold text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map(([key, value]) => {
                const type = typeof value === 'number' ? 'Número' : 'Texto';
                return (
                  <tr key={key} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-4 py-3 text-sm font-bold text-slate-700 font-mono">{key}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        {type === 'Número' ? <Hash size={10} /> : <Type size={10} />}
                        {type}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-right text-indigo-600 font-bold">
                      {value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
