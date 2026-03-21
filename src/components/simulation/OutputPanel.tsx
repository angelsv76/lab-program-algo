
import React from 'react';
import { Terminal } from 'lucide-react';

interface OutputPanelProps {
  output: string[];
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ output }) => {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 font-mono text-sm overflow-y-auto space-y-1">
        {output.length > 0 ? (
          output.map((line, i) => (
            <div key={i} className={`flex gap-2 ${line.startsWith('   ') ? 'text-tech-orange italic' : 'text-gray-800 font-bold'}`}>
              {!line.startsWith('   ') && <span className="text-gray-300">{'>'}</span>}
              <span>{line}</span>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 py-10">
            <Terminal size={48} />
            <p className="text-sm">Esperando ejecución del algoritmo...</p>
          </div>
        )}
      </div>
    </div>
  );
};
