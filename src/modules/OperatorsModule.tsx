import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Equal, ShieldCheck, 
  CheckCircle2, AlertCircle, HelpCircle,
  ArrowRight, Calculator
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

type OperatorType = 'math-ops' | 'relational-ops' | 'logical-ops';

interface Question {
  q: string;
  a: string;
  options: string[];
}

const QUESTIONS: Record<OperatorType, Question[]> = {
  'math-ops': [
    { q: '¿Cuál es el resultado de 10 + 5 * 2?', a: '20', options: ['30', '20', '25', '15'] },
    { q: '¿Qué operador se usa para la división?', a: '/', options: ['*', '/', '+', '%'] },
  ],
  'relational-ops': [
    { q: '¿Qué resultado da 10 > 5?', a: 'Verdadero', options: ['Verdadero', 'Falso'] },
    { q: '¿Cuál es el operador para "Igual a"?', a: '==', options: ['=', '==', '!=', '>='] },
  ],
  'logical-ops': [
    { q: 'Verdadero AND Falso es...', a: 'Falso', options: ['Verdadero', 'Falso'] },
    { q: 'Verdadero OR Falso es...', a: 'Verdadero', options: ['Verdadero', 'Falso'] },
  ]
};

export const OperatorsModule: React.FC<{ type: OperatorType }> = ({ type }) => {
  const { completeModule } = useStudent();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [finished, setFinished] = useState(false);

  const questions = QUESTIONS[type];
  const current = questions[currentIdx];

  const handleCheck = () => {
    const correct = selected === current.a;
    setIsCorrect(correct);
    if (correct) {
      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(currentIdx + 1);
          setSelected(null);
          setIsCorrect(null);
        } else {
          setFinished(true);
          completeModule(type);
        }
      }, 1500);
    }
  };

  const titles = {
    'math-ops': { title: 'Operadores Matemáticos', icon: PlusCircle, color: 'text-blue-500' },
    'relational-ops': { title: 'Operadores Relacionales', icon: Equal, color: 'text-orange-500' },
    'logical-ops': { title: 'Operadores Lógicos', icon: ShieldCheck, color: 'text-green-500' },
  };

  const info = titles[type];

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-black">¡Listo!</h2>
        <p className="text-gray-500">Completaste este módulo. Ya tenés estas herramientas claras para usarlas en tus algoritmos.</p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl bg-gray-50 ${info.color}`}>
          <info.icon size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black">{info.title}</h1>
          <p className="text-gray-500">Probá lo que ya sabés. Sin trampa.</p>
        </div>
      </header>

      <div className="card">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pregunta {currentIdx + 1} de {questions.length}</span>
          <Calculator size={20} className="text-gray-200" />
        </div>

        <h3 className="text-xl font-bold mb-8">{current.q}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`
                p-4 rounded-xl border-2 text-left font-bold transition-all
                ${selected === opt ? 'border-tech-blue bg-tech-blue/5 text-tech-blue' : 'border-gray-100 hover:border-gray-200'}
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button 
            onClick={handleCheck}
            disabled={!selected || isCorrect === true}
            className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
          >
            Verificar Respuesta <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isCorrect === true && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-green-100 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
            <CheckCircle2 size={20} />
            <span className="font-bold">¡Correcto! Siguiente pregunta...</span>
          </motion.div>
        )}
        {isCorrect === false && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-100 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <span className="font-bold">No es esa. Intentá de nuevo.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
