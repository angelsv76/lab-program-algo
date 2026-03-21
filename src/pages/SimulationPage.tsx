
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulator } from '../simulator/hooks/useSimulator';
import { ConsolePanel } from '../simulator/ui/ConsolePanel';
import { MemoryPanel } from '../simulator/ui/MemoryPanel';
import { Play, StepForward, RotateCcw, Code2, Info, ArrowLeft } from 'lucide-react';

const DEFAULT_CODE = `Inicio
Leer("Digite el valor de A:", A)
Leer("Digite el valor de B:", B)
Calcular(Fórmula: suma = A + B)
Imprimir("El resultado de la suma es:", suma)
Fin`;

const SimulationPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(DEFAULT_CODE);
  const { 
    memory, 
    consoleMessages, 
    currentLine, 
    status, 
    error, 
    step, 
    reset, 
    submitInput 
  } = useSimulator(code);

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-200"
              title="Volver"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  <Code2 size={28} />
                </div>
                Laboratorio de Programación INTI
              </h1>
              <p className="text-slate-500 mt-1 font-medium">Simulador Educativo de Pseudocódigo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={reset}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
              title="Reiniciar"
            >
              <RotateCcw size={20} />
            </button>
            <button 
              onClick={step}
              disabled={status === 'FINISHED' || status === 'ERROR' || status === 'WAITING_INPUT'}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              <StepForward size={20} />
              Paso a Paso
            </button>
            <button 
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 rounded-xl text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
              disabled={status === 'FINISHED' || status === 'ERROR' || status === 'WAITING_INPUT'}
            >
              <Play size={20} fill="currentColor" />
              Ejecutar
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Editor */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[600px]">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Editor de Pseudocódigo</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                </div>
              </div>
              
              <div className="flex-1 relative font-mono text-sm">
                <div className="absolute inset-0 flex">
                  {/* Line Numbers */}
                  <div className="w-12 bg-slate-50 border-r border-slate-100 flex flex-col items-end pt-4 pr-3 text-slate-300 select-none">
                    {code.split('\n').map((_, i) => (
                      <div key={i} className="h-6 leading-6">{i + 1}</div>
                    ))}
                  </div>
                  
                  {/* Textarea */}
                  <div className="flex-1 relative pt-4">
                    <textarea
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={status !== 'IDLE' && status !== 'FINISHED'}
                      className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none pt-4 pl-4 pr-4 leading-6 text-slate-700 caret-indigo-600"
                      spellCheck={false}
                    />
                    
                    {/* Highlight Overlay */}
                    <div className="absolute inset-0 pointer-events-none pl-4 pr-4 pt-4">
                      {code.split('\n').map((_, i) => {
                        const lineNum = i + 1;
                        const isActive = currentLine === lineNum;
                        return (
                          <div 
                            key={i} 
                            className={`h-6 leading-6 w-full rounded transition-all duration-200 ${
                              isActive ? 'bg-blue-500/10 border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-rose-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <Info size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Right: Console & Memory */}
          <div className="lg:col-span-7 grid grid-rows-2 gap-8 h-[600px]">
            <ConsolePanel 
              messages={consoleMessages} 
              onInput={submitInput} 
              isWaiting={status === 'WAITING_INPUT'} 
            />
            <MemoryPanel memory={memory} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Info size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Modelo Entrada → Proceso → Salida</h3>
              <p className="text-sm text-slate-500">Observa cómo los datos entran por la consola, se procesan en memoria y salen como resultados.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
            <div className={`w-2 h-2 rounded-full ${
              status === 'RUNNING' ? 'bg-emerald-500 animate-pulse' :
              status === 'WAITING_INPUT' ? 'bg-amber-500 animate-pulse' :
              status === 'FINISHED' ? 'bg-indigo-500' :
              status === 'ERROR' ? 'bg-rose-500' : 'bg-slate-300'
            }`} />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Estado: {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
