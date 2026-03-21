
import React from 'react';
import { motion } from 'framer-motion';
import { Variable, Layers } from 'lucide-react';

interface MemoryPanelProps {
  memory: Record<string, any>;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ memory }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {Object.keys(memory).length > 0 ? (
          Object.entries(memory).map(([name, value]) => (
            <motion.div 
              key={name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-black/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-tech-orange/10 text-tech-orange rounded-lg flex items-center justify-center">
                  <Variable size={16} />
                </div>
                <span className="font-mono font-bold text-gray-900">{name}</span>
              </div>
              <span className="font-mono bg-gray-900 text-emerald-400 px-4 py-1.5 rounded-xl text-sm shadow-inner">
                {typeof value === 'string' ? `"${value}"` : value}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-4 opacity-30 py-20">
            <Layers size={48} />
            <p className="text-sm italic">No hay variables en memoria todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
};
