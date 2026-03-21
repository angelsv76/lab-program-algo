import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { ListOrdered, CheckCircle2, AlertCircle, RefreshCcw, ArrowRight, Play } from 'lucide-react';
import { useStudent } from '../context/StudentContext';

const SANDWICH_STEPS = [
  { id: '1', text: 'Tomar dos rebanadas de pan' },
  { id: '2', text: 'Untar mantequilla en el pan' },
  { id: '3', text: 'Colocar el jamón y el queso' },
  { id: '4', text: 'Cerrar el sándwich' },
  { id: '5', text: 'Comer el sándwich' },
];

export const SequencesModule: React.FC = () => {
  const { completeModule } = useStudent();
  const [steps, setSteps] = useState([...SANDWICH_STEPS].sort(() => Math.random() - 0.5));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const checkOrder = () => {
    const currentOrder = steps.map(s => s.id).join(',');
    const correctOrder = SANDWICH_STEPS.map(s => s.id).join(',');
    const correct = currentOrder === correctOrder;
    setIsCorrect(correct);
    if (correct) completeModule('sequences');
  };

  const reset = () => {
    setSteps([...SANDWICH_STEPS].sort(() => Math.random() - 0.5));
    setIsCorrect(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <div className="bg-tech-blue/10 p-3 rounded-2xl text-tech-blue">
          <ListOrdered size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black">Secuencias de Instrucciones</h1>
          <p className="text-gray-500">El orden de los pasos es vital para el éxito de un algoritmo.</p>
        </div>
      </header>

      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 text-tech-blue rounded-lg">
            <Play size={20} fill="currentColor" />
          </div>
          <h3 className="font-bold">Reto: Preparar un Sándwich</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Arrastra los pasos para ordenarlos correctamente de arriba hacia abajo.
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
            Verificar Secuencia <ArrowRight size={18} />
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
            <p className="font-bold text-lg">¡Secuencia Correcta!</p>
            <p className="text-sm">Has entendido que el orden de las instrucciones altera el resultado final.</p>
          </div>
        </motion.div>
      )}

      {isCorrect === false && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-100 border border-red-200 rounded-2xl flex items-center gap-4 text-red-700">
          <AlertCircle size={32} />
          <div>
            <p className="font-bold text-lg">Secuencia Ilógica</p>
            <p className="text-sm">No puedes comer el sándwich antes de cerrarlo. Revisa el orden.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
