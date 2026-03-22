import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight, CheckCircle2, RefreshCcw, Play } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export const EPSModule: React.FC = () => {
  const { completeModule } = useStudent();
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState({ num1: '', num2: '' });
  const [result, setResult] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = () => {
    if (!inputs.num1 || !inputs.num2) return;
    setIsProcessing(true);
    setResult(null);
    
    setTimeout(() => {
      const sum = parseFloat(inputs.num1) + parseFloat(inputs.num2);
      setResult(sum);
      setIsProcessing(false);
      completeModule('eps');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <div className="bg-tech-blue/10 p-3 rounded-2xl text-tech-blue">
          <Cpu size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black">Entrada – Proceso – Salida</h1>
          <p className="text-gray-500">Todo programa funciona así. Sin excepción.</p>
        </div>
      </header>

      <div className="flex gap-2 bg-white p-1 rounded-2xl border border-gray-200">
        <button onClick={() => setStep(1)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'bg-tech-blue text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>Explicación</button>
        <button onClick={() => setStep(2)} className={`flex-1 py-3 rounded-xl font-bold transition-all ${step === 2 ? 'bg-tech-blue text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>Simulador</button>
      </div>

      {step === 1 ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card border-blue-100 bg-blue-50/30">
              <h4 className="font-black text-blue-600 mb-2 uppercase tracking-widest text-xs">1. Entrada</h4>
              <p className="text-sm text-gray-600">Los datos que el programa recibe para trabajar. Puede ser lo que el usuario escribe, o datos que vienen de otro lado.</p>
            </div>
            <div className="card border-tech-orange/10 bg-orange-50/30">
              <h4 className="font-black text-tech-orange mb-2 uppercase tracking-widest text-xs">2. Proceso</h4>
              <p className="text-sm text-gray-600">Lo que el programa hace con esos datos. Un cálculo, una comparación, una transformación. Aquí está la lógica.</p>
            </div>
            <div className="card border-green-100 bg-green-50/30">
              <h4 className="font-black text-green-600 mb-2 uppercase tracking-widest text-xs">3. Salida</h4>
              <p className="text-sm text-gray-600">El resultado que el programa entrega. Puede ser un número, un mensaje, o una acción — lo que el usuario finalmente ve.</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4">Ejemplo del día a día: Una licuadora</h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8">
              <div className="text-center">
                <div className="bg-gray-100 p-4 rounded-2xl mb-2">🍎 🍌 🥛</div>
                <p className="text-xs font-bold text-gray-400 uppercase">Frutas y Leche</p>
                <p className="font-bold text-blue-600">Entrada</p>
              </div>
              <ArrowRight className="text-gray-200 hidden md:block" size={32} />
              <div className="text-center">
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="bg-gray-100 p-4 rounded-2xl mb-2"
                >
                  🌀
                </motion.div>
                <p className="text-xs font-bold text-gray-400 uppercase">Licuar</p>
                <p className="font-bold text-tech-orange">Proceso</p>
              </div>
              <ArrowRight className="text-gray-200 hidden md:block" size={32} />
              <div className="text-center">
                <div className="bg-gray-100 p-4 rounded-2xl mb-2">🥤</div>
                <p className="text-xs font-bold text-gray-400 uppercase">Batido</p>
                <p className="font-bold text-green-600">Salida</p>
              </div>
            </div>
          </div>
          <button onClick={() => setStep(2)} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
            Probar el Simulador <ArrowRight size={18} />
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="card">
            <h3 className="font-bold mb-6">Simulador: Suma de dos números</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Input */}
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-2">Entrada</label>
                  <input 
                    type="number" 
                    value={inputs.num1}
                    onChange={(e) => setInputs({...inputs, num1: e.target.value})}
                    placeholder="Número 1"
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 mb-2"
                  />
                  <input 
                    type="number" 
                    value={inputs.num2}
                    onChange={(e) => setInputs({...inputs, num2: e.target.value})}
                    placeholder="Número 2"
                    className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Process */}
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${isProcessing ? 'bg-tech-orange text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-400'}`}>
                  {isProcessing ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                      <RefreshCcw size={32} />
                    </motion.div>
                  ) : (
                    <Cpu size={32} />
                  )}
                </div>
                <p className={`mt-2 font-bold ${isProcessing ? 'text-tech-orange' : 'text-gray-400'}`}>
                  {isProcessing ? 'Sumando...' : 'Esperando'}
                </p>
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing || !inputs.num1 || !inputs.num2}
                  className="mt-4 btn-orange py-2 px-6 disabled:opacity-30"
                >
                  Procesar
                </button>
              </div>

              {/* Output */}
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100 min-h-[120px] flex flex-col justify-center items-center text-center">
                <label className="text-[10px] font-bold text-green-400 uppercase tracking-widest block mb-2">Salida</label>
                {result !== null ? (
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <p className="text-4xl font-black text-green-600">{result}</p>
                    <p className="text-xs text-green-500 font-bold mt-1">¡Resultado listo!</p>
                  </motion.div>
                ) : (
                  <p className="text-gray-300 italic text-sm">Sin resultado</p>
                )}
              </div>
            </div>
          </div>

          {result !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-green-100 border border-green-200 rounded-2xl flex items-center gap-4 text-green-700"
            >
              <CheckCircle2 size={32} />
              <div>
                <p className="font-bold text-lg">¡Bien hecho!</p>
                <p className="text-sm">Ya viste el modelo EPS en acción. Ahora lo vas a reconocer en cualquier programa que escribás.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
