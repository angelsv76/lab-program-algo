
import React from 'react';
import { ArrowRight, LogIn, Cpu, LogOut } from 'lucide-react';
import { InstructionType } from '../../types/simulation';

interface EPSModelProps {
  currentType: InstructionType | undefined;
}

export const EPSModel: React.FC<EPSModelProps> = ({ currentType }) => {
  const getStage = (type: InstructionType | undefined) => {
    if (!type) return null;
    if (type === 'READ') return 'ENTRADA';
    if (['CALCULATE', 'IF', 'WHILE', 'FOR', 'START', 'END'].includes(type)) return 'PROCESO';
    if (type === 'PRINT') return 'SALIDA';
    return null;
  };

  const stage = getStage(currentType);

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-oxford-900/50 rounded-2xl border border-white/5">
      <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${stage === 'ENTRADA' ? 'text-tech-blue scale-110' : 'text-slate-600 opacity-40'}`}>
        <div className={`p-3 rounded-xl ${stage === 'ENTRADA' ? 'bg-tech-blue/20 border border-tech-blue/30' : 'bg-white/5'}`}>
          <LogIn size={20} />
        </div>
        <span className="text-[10px] font-black tracking-widest">ENTRADA</span>
      </div>

      <ArrowRight size={16} className="text-slate-700" />

      <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${stage === 'PROCESO' ? 'text-tech-orange scale-110' : 'text-slate-600 opacity-40'}`}>
        <div className={`p-3 rounded-xl ${stage === 'PROCESO' ? 'bg-tech-orange/20 border border-tech-orange/30' : 'bg-white/5'}`}>
          <Cpu size={20} />
        </div>
        <span className="text-[10px] font-black tracking-widest">PROCESO</span>
      </div>

      <ArrowRight size={16} className="text-slate-700" />

      <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${stage === 'SALIDA' ? 'text-emerald-400 scale-110' : 'text-slate-600 opacity-40'}`}>
        <div className={`p-3 rounded-xl ${stage === 'SALIDA' ? 'bg-emerald-400/20 border border-emerald-400/30' : 'bg-white/5'}`}>
          <LogOut size={20} />
        </div>
        <span className="text-[10px] font-black tracking-widest">SALIDA</span>
      </div>
    </div>
  );
};
