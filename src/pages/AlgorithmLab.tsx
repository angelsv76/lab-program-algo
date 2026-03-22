import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  RotateCcw, 
  StepForward, 
  Terminal, 
  Database, 
  Code2, 
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationEngine } from '../engine/SimulationEngine';
import { SimulationState, ConsoleLine } from '../types/simulation';
import { aiTutorService } from '../engine/aiTutorService';
import { EPSModel } from '../components/simulation/EPSModel';

const DEFAULT_CODE = `1 Inicio
2 Leer("Digite el valor de A:", A)
3 Leer("Digite el valor de B:", B)
4 Calcular(Fórmula: suma = A + B)
5 Imprimir("El resultado de la suma es:", suma)
6 Fin`;

const AlgorithmLab: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [simState, setSimState] = useState<SimulationState>(SimulationEngine.init(DEFAULT_CODE));
  const [inputValue, setInputValue] = useState('');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(800);
  const [activeTab, setActiveTab] = useState<'console' | 'memory'>('console');
  
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simState.console]);

  // Focus input when waiting
  useEffect(() => {
    if (simState.status === 'WAITING_INPUT') {
      inputRef.current?.focus();
    }
  }, [simState.status]);

  // Auto-play logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlaying && simState.status === 'RUNNING') {
      timer = setTimeout(() => {
        handleStep();
      }, playbackSpeed);
    } else if (simState.status !== 'RUNNING' && simState.status !== 'WAITING_INPUT') {
      setIsAutoPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, simState.status, simState.currentPointer, playbackSpeed]);

  const handleReset = () => {
    setSimState(SimulationEngine.init(code));
    setIsAutoPlaying(false);
  };

  const handleStep = () => {
    if (simState.status === 'IDLE') {
      setSimState(prev => ({ ...prev, status: 'RUNNING' }));
    } else {
      setSimState(prev => SimulationEngine.step(prev));
    }
  };

  const handleRun = () => {
    if (simState.status === 'FINISHED' || simState.status === 'ERROR') {
      const newState = SimulationEngine.init(code);
      setSimState({ ...newState, status: 'RUNNING' });
      setIsAutoPlaying(true);
    } else if (simState.status === 'IDLE') {
      setSimState(prev => ({ ...prev, status: 'RUNNING' }));
      setIsAutoPlaying(true);
    } else {
      setIsAutoPlaying(true);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    setSimState(prev => SimulationEngine.provideInput(prev, inputValue));
    setInputValue('');
  };

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAskAI = async () => {
    setIsAnalyzing(true);
    setActiveTab('console');
    setSimState(prev => ({
      ...prev,
      console: [...prev.console, { type: 'system', text: 'Analizando algoritmo con IA...', timestamp: Date.now() }]
    }));

    try {
      const analysis = await aiTutorService.analyzeAlgorithm(code);
      setSimState(prev => ({
        ...prev,
        console: [...prev.console, { type: 'system', text: 'Respuesta del Tutor IA:', timestamp: Date.now() }, { type: 'output', text: analysis, timestamp: Date.now() }]
      }));
    } catch (error) {
      setSimState(prev => ({
        ...prev,
        console: [...prev.console, { type: 'error', text: 'Error al conectar con el Tutor IA.', timestamp: Date.now() }]
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentLine = simState.instructions[simState.currentPointer]?.line;

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-oxford overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-oxford mr-2"
            title="Volver"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-tech-blue/10 flex items-center justify-center border border-tech-blue/20">
            <Code2 className="text-tech-blue" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-oxford">Laboratorio de Programación INTI</h1>
            <p className="text-xs text-gray-400 font-mono">v1.9 • Simulador Interactivo</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Velocidad</span>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="100"
              value={2100 - playbackSpeed}
              onChange={(e) => setPlaybackSpeed(2100 - parseInt(e.target.value))}
              className="w-20 accent-tech-blue cursor-pointer"
            />
          </div>
          <button 
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-oxford"
            title="Reiniciar"
          >
            <RotateCcw size={20} />
          </button>
          <div className="h-6 w-px bg-gray-200 mx-2" />
          <button 
            onClick={handleStep}
            disabled={simState.status === 'FINISHED' || simState.status === 'WAITING_INPUT' || isAutoPlaying}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all text-sm font-medium border border-gray-200 shadow-sm"
          >
            <StepForward size={18} />
            Paso a Paso
          </button>
          <button 
            onClick={handleRun}
            disabled={simState.status === 'FINISHED' || isAutoPlaying}
            className="flex items-center gap-2 px-6 py-2 bg-tech-blue hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-all text-sm font-bold text-white shadow-lg shadow-tech-blue/20"
          >
            <Play size={18} fill="currentColor" />
            Ejecutar
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-200 bg-white">
          <div className="h-10 border-b border-gray-100 flex items-center px-4 justify-between bg-gray-50">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <Code2 size={14} />
              PSEUDOCÓDIGO.INTI
            </div>
            {simState.status !== 'IDLE' && (
              <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-tech-blue/10 border border-tech-blue/20 text-[10px] font-bold text-tech-blue animate-pulse">
                SIMULACIÓN ACTIVA
              </div>
            )}
          </div>
          
          <div className="flex-1 relative font-mono text-sm overflow-auto custom-scrollbar">
            <div className="absolute inset-0 flex">
              {/* Line Numbers */}
              <div className="w-12 bg-gray-50 border-r border-gray-100 flex flex-col items-end pt-4 pr-3 text-gray-400 select-none">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="h-6 leading-6">{i + 1}</div>
                ))}
              </div>
              
              {/* Code Area */}
              <div className="flex-1 relative pt-4">
                <textarea
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setSimState(SimulationEngine.init(e.target.value));
                  }}
                  disabled={simState.status !== 'IDLE' && simState.status !== 'FINISHED'}
                  className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none pt-4 pl-4 pr-4 leading-6 text-oxford caret-tech-blue disabled:opacity-80"
                  spellCheck={false}
                />
                
                {/* Highlighting Overlay */}
                <div className="absolute inset-0 pointer-events-none pl-4 pr-4 pt-4">
                  {code.split('\n').map((line, i) => {
                    const lineNum = i + 1;
                    const isActive = currentLine === lineNum;
                    return (
                      <div 
                        key={i} 
                        className={`h-6 leading-6 w-full rounded transition-all duration-200 ${
                          isActive ? 'bg-tech-blue/10 border-2 border-tech-blue shadow-[0_0_15px_rgba(0,112,243,0.3)]' : ''
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Console & Memory */}
        <div className="w-1/2 flex flex-col bg-white">
          {/* Tabs */}
          <div className="h-10 border-b border-gray-200 flex items-center px-2 gap-1 bg-gray-50">
            <button 
              onClick={() => setActiveTab('console')}
              className={`px-4 h-8 rounded-md flex items-center gap-2 text-xs font-medium transition-all ${
                activeTab === 'console' ? 'bg-white text-tech-blue shadow-sm border border-gray-200' : 'text-gray-500 hover:text-oxford'
              }`}
            >
              <Terminal size={14} />
              Consola Interactiva
            </button>
            <button 
              onClick={() => setActiveTab('memory')}
              className={`px-4 h-8 rounded-md flex items-center gap-2 text-xs font-medium transition-all ${
                activeTab === 'memory' ? 'bg-white text-tech-blue shadow-sm border border-gray-200' : 'text-gray-500 hover:text-oxford'
              }`}
            >
              <Database size={14} />
              Panel de Memoria
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === 'console' ? (
                <motion.div 
                  key="console"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 flex flex-col p-4 font-mono text-sm"
                >
                  {/* EPS Model Indicator */}
                  <div className="mb-4">
                    <EPSModel currentType={simState.instructions[simState.currentPointer]?.type} />
                  </div>

                  <div className="flex-1 overflow-auto custom-scrollbar space-y-2 mb-4">
                    {simState.console.map((line, i) => (
                      <div key={i} className={`flex gap-3 ${
                        line.type === 'system' ? 'text-gray-400 italic' :
                        line.type === 'error' ? 'text-red-600' :
                        line.type === 'input' ? 'text-tech-blue font-bold' : 'text-slate-600'
                      }`}>
                        <span className="shrink-0 opacity-30">
                          {line.type === 'input' ? '>' : line.type === 'output' ? '•' : '#'}
                        </span>
                        <p className="break-words">{line.text}</p>
                      </div>
                    ))}
                    <div ref={consoleEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="h-12 border border-gray-200 rounded-xl bg-gray-50 flex items-center px-4 gap-3 focus-within:border-tech-blue/50 transition-colors">
                    <ChevronRight size={18} className={simState.status === 'WAITING_INPUT' ? 'text-tech-blue' : 'text-gray-400'} />
                    <form onSubmit={handleInputSubmit} className="flex-1">
                      <input 
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={simState.status !== 'WAITING_INPUT'}
                        placeholder={simState.status === 'WAITING_INPUT' ? 'Escribe aquí y presiona Enter...' : 'Esperando ejecución...'}
                        className="w-full bg-transparent outline-none text-tech-blue font-bold placeholder:text-gray-400 disabled:text-gray-300 disabled:cursor-not-allowed"
                      />
                    </form>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="memory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute inset-0 p-6"
                >
                  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                          <th className="px-6 py-3 border-b border-gray-100">Variable</th>
                          <th className="px-6 py-3 border-b border-gray-100 text-right">Valor Actual</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-mono">
                        {Object.keys(simState.memory).length === 0 ? (
                          <tr>
                            <td colSpan={2} className="px-6 py-12 text-center text-gray-400 italic">
                              La memoria está vacía. Ejecuta el algoritmo para ver las variables.
                            </td>
                          </tr>
                        ) : (
                          Object.entries(simState.memory).map(([key, val]) => (
                            <tr key={key} className="group hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 border-b border-gray-100 text-tech-blue font-bold">{key}</td>
                              <td className="px-6 py-4 border-b border-gray-100 text-right text-oxford">
                                {typeof val === 'boolean' ? (val ? 'Verdadero' : 'Falso') : val}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Bar */}
          <div className="h-10 border-t border-gray-200 bg-gray-50 flex items-center justify-between px-4 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  simState.status === 'RUNNING' ? 'bg-green-500 animate-pulse' :
                  simState.status === 'WAITING_INPUT' ? 'bg-tech-orange animate-pulse' :
                  simState.status === 'FINISHED' ? 'bg-tech-blue' :
                  simState.status === 'ERROR' ? 'bg-red-500' : 'bg-gray-400'
                }`} />
                <span className="text-gray-500">Estado:</span>
                <span className={
                  simState.status === 'RUNNING' ? 'text-green-600' :
                  simState.status === 'WAITING_INPUT' ? 'text-tech-orange' :
                  simState.status === 'FINISHED' ? 'text-tech-blue' :
                  simState.status === 'ERROR' ? 'text-red-600' : 'text-gray-500'
                }>
                  {simState.status === 'IDLE' ? 'Listo' :
                   simState.status === 'RUNNING' ? 'Ejecutando' :
                   simState.status === 'WAITING_INPUT' ? 'Esperando Entrada' :
                   simState.status === 'FINISHED' ? 'Finalizado' : 'Error'}
                </span>
              </div>
              {simState.status === 'WAITING_INPUT' && (
                <div className="text-tech-orange">
                  Variable: {simState.waitingFor?.variable}
                </div>
              )}
            </div>
            <div className="text-gray-400">
              INTI Lab • Pensamiento Computacional
            </div>
          </div>
        </div>
      </main>

      {/* Footer / IA Help */}
      <footer className="h-12 border-t border-gray-200 bg-white flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Sparkles size={14} className="text-tech-orange" />
          ¿Tu algoritmo no hace lo que esperabas?
          <button 
            onClick={handleAskAI}
            disabled={isAnalyzing}
            className="text-tech-blue hover:underline font-bold ml-1 disabled:opacity-50"
          >
            {isAnalyzing ? 'Analizando...' : 'Preguntar al Tutor IA'}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Todo algoritmo bien escrito es la base de un futuro programa
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AlgorithmLab;
