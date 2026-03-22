import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Brain, CheckCircle2, AlertCircle, RefreshCcw, ArrowRight, Coffee } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

const COFFEE_STEPS = [
  { id: '1', text: 'Calentar agua en la tetera' },
  { id: '2', text: 'Poner café en la taza' },
  { id: '3', text: 'Verter el agua caliente' },
  { id: '4', text: 'Endulzar al gusto' },
  { id: '5', text: 'Disfrutar el café' },
];

export const ThinkingModule: React.FC = () => {
  const { completeModule } = useStudent();
  const [steps, setSteps] = useState([...COFFEE_STEPS].sort(() => Math.random() - 0.5));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkOrder = () => {
    const currentOrder = steps.map(s => s.id).join(',');
    const correctOrder = COFFEE_STEPS.map(s => s.id).join(',');
    const correct = currentOrder === correctOrder;
    setIsCorrect(correct);
    if (correct) completeModule('thinking');
  };

  const reset = () => {
    setSteps([...COFFEE_STEPS].sort(() => Math.random() - 0.5));
    setIsCorrect(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <div className="bg-tech-blue/10 p-3 rounded-2xl text-tech-blue">
          <Brain size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black">Pensar como Computadora</h1>
          <p className="text-gray-500">Si el orden está mal, el programa falla. Así de simple.</p>
        </div>
      </header>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-100 text-tech-orange rounded-lg">
            <Coffee size={20} />
          </div>
          <h3 className="font-bold">Reto: El Algoritmo del Café</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Cada paso tiene su lugar. Arrastrá los pasos hasta dejarlos en el orden correcto, de arriba hacia abajo.
        </p>

        <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-3">
          {steps.map((step) => (
            <Reorder.Item 
              key={step.id} 
              value={step}
              className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-grab active:cursor-grabbing flex items-center gap-4 hover:border-tech-blue transition-colors"
            >
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xs">
                ::
              </div>
              <span className="font-bold text-oxford">{step.text}</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="mt-8 flex gap-4">
          <button onClick={checkOrder} className="btn-primary flex-1 py-4 flex items-center justify-center gap-2">
            Verificar Algoritmo <ArrowRight size={18} />
          </button>
          <button onClick={reset} className="p-4 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-colors">
            <RefreshCcw size={20} />
          </button>
        </div>
      </div>

      {isCorrect === true && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-green-100 border border-green-200 rounded-2xl flex items-center gap-4 text-green-700">
          <CheckCircle2 size={32} />
          <div>
            <p className="font-bold text-lg">¡Correcto!</p>
            <p className="text-sm">Eso es exactamente cómo piensa un algoritmo: paso a paso, sin saltarse nada.</p>
          </div>
        </motion.div>
      )}

      {isCorrect === false && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-100 border border-red-200 rounded-2xl flex items-center gap-4 text-red-700">
          <AlertCircle size={32} />
          <div>
            <p className="font-bold text-lg">No está bien todavía</p>
            <p className="text-sm">Revisá la secuencia. Hay pasos que no pueden ocurrir antes que otros.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
