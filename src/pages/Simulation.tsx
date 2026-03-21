import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Play, 
  SkipForward, 
  RotateCcw, 
  Cpu, 
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SimulationEngine } from '../engine/SimulationEngine';
import { SimulationState } from '../types/simulation';
import { MemoryPanel } from '../components/simulation/MemoryPanel';

export const Simulation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { algorithm, title } = (location.state as { algorithm: string; title: string }) || { 
    algorithm: 'Inicio\n  x = 10\n  Escribir "El valor es ", x\nFin',
    title: 'Simulación de Algoritmo'
  };

  const [state, setState] = useState<SimulationState>(() => 
    SimulationEngine.init(algorithm)
  );
  const [showInputError, setShowInputError] = useState(false);

  const handleStep = () => {
    if (state.status === 'WAITING_INPUT') {
      setShowInputError(true);
      setTimeout(() => setShowInputError(false), 3000);
      return;
    }
    
    if (state.status === 'FINISHED') return;
    
    const nextState = SimulationEngine.step(state);
    setState(nextState);
  };

  const handleInput = (value: string) => {
    const nextState = SimulationEngine.provideInput(state, value);
    setState(nextState);
  };

  const reset = () => {
    setState(SimulationEngine.init(algorithm));
    setShowInputError(false);
  };

  const runAll = () => {
    let currentState = { ...state };
    // Ejecutar hasta que termine o necesite input
    while (currentState.status !== 'FINISHED' && currentState.status !== 'WAITING_INPUT' && currentState.status !== 'ERROR') {
      currentState = SimulationEngine.step(currentState);
    }
    setState(currentState);
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-oxford">{title}</h1>
            <p className="text-gray-500">Ejecución paso a paso del algoritmo</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all" title="Reiniciar">
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={runAll} 
            disabled={state.status === 'FINISHED' || state.status === 'WAITING_INPUT'}
            className="p-3 bg-oxford text-white rounded-xl hover:bg-black transition-all disabled:opacity-50" 
            title="Ejecutar hasta pausa"
          >
            <Play size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Código y Trazado */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-0 overflow-hidden border-oxford/10">
            <div className="bg-oxford p-4 flex items-center gap-2 text-white">
              <Cpu size={18} className="text-tech-blue" />
              <span className="text-xs font-black uppercase tracking-widest">CPU - Línea por Línea</span>
            </div>
            <div className="bg-oxford-dark p-4 font-mono text-sm space-y-1">
              {state.instructions.map((inst, i) => (
                <div 
                  key={i} 
                  className={`flex gap-4 p-2 rounded-lg transition-all ${
                    state.currentPointer === i 
                      ? 'bg-tech-blue/20 border-l-4 border-tech-blue text-white' 
                      : 'text-gray-500'
                  }`}
                >
                  <span className="w-8 text-right opacity-30">{inst.line}</span>
                  <span>{inst.raw}</span>
                  {state.currentPointer === i && (
                    <motion.span 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="ml-auto text-tech-blue"
                    >
                      <ChevronRight size={16} />
                    </motion.span>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex flex-col items-center gap-4">
              <AnimatePresence>
                {showInputError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-red-600 text-sm font-bold"
                  >
                    <AlertCircle size={16} />
                    Debe ingresar un valor para continuar.
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={handleStep}
                disabled={state.status === 'FINISHED' || state.status === 'ERROR'}
                className="btn-primary w-full max-w-xs flex items-center justify-center gap-2 py-4 disabled:opacity-50"
              >
                {state.status === 'FINISHED' ? 'Simulación Finalizada' : 'Siguiente Paso'}
                <SkipForward size={20} />
              </button>
            </div>
          </div>

          {/* Consola de Salida */}
          <div className="card p-6 bg-white">
            <div className="flex-1 font-mono text-sm overflow-y-auto space-y-1">
              {state.console.map((line, i) => (
                <div key={i} className={`flex gap-2 ${line.type === 'system' ? 'text-slate-400 italic' : 'text-gray-800 font-bold'}`}>
                  <span className="text-gray-300">{'>'}</span>
                  <span>{line.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Memoria y Variables */}
        <div className="space-y-6">
          <div className="card p-6 bg-white">
            <MemoryPanel memory={state.memory} />
          </div>

          <AnimatePresence>
            {state.status === 'WAITING_INPUT' && state.waitingFor && (
              <div className="card p-6 bg-tech-blue/5 border-tech-blue/20">
                <h4 className="font-black text-oxford mb-2">Entrada Requerida</h4>
                <p className="text-sm text-gray-600 mb-4">{state.waitingFor.message}</p>
                <input 
                  autoFocus
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleInput((e.target as HTMLInputElement).value);
                    }
                  }}
                  className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-tech-blue"
                  placeholder="Escribe el valor..."
                />
              </div>
            )}
          </AnimatePresence>

          {state.status === 'ERROR' && (
            <div className="card p-6 bg-red-50 border-red-200">
              <div className="flex items-center gap-3 text-red-700 mb-2">
                <AlertCircle size={24} />
                <h4 className="font-black">Error en Ejecución</h4>
              </div>
              <p className="text-sm text-red-600">
                {state.error}
              </p>
            </div>
          )}

          {state.status === 'FINISHED' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 bg-green-50 border-green-200"
            >
              <div className="flex items-center gap-3 text-green-700 mb-4">
                <CheckCircle2 size={24} />
                <h4 className="font-black">¡Simulación Exitosa!</h4>
              </div>
              <p className="text-sm text-green-600 mb-6">
                El algoritmo ha finalizado correctamente. Has visto cómo cambian las variables y qué se muestra en pantalla.
              </p>
              <button 
                onClick={() => navigate(-1)}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all"
              >
                Volver
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

