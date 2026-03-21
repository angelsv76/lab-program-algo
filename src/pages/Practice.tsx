import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  ArrowLeft, 
  ChevronRight, 
  Play, 
  Code, 
  Cpu,
  Trophy,
  Filter,
  Search
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Exercise } from '../types';

export const Practice: React.FC = () => {
  const { exerciseBank, progress } = useStudent();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('Todas');

  const filteredExercises = exerciseBank.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         ex.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiff = filterDifficulty === 'Todas' || ex.difficulty.toString() === filterDifficulty;
    return matchesSearch && matchesDiff;
  });

  const handleStartExercise = (ex: Exercise, mode: 'algorithm' | 'python' | 'simulation') => {
    if (mode === 'simulation') {
      navigate('/simulacion', { state: { algorithm: ex.solution, title: ex.title } });
    } else if (mode === 'python') {
      navigate('/laboratorio', { state: { initialCode: ex.solution, mode: 'python', title: ex.title } });
    } else {
      navigate('/laboratorio', { state: { initialCode: ex.solution, mode: 'algorithm', title: ex.title } });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-oxford">Banco de Práctica</h1>
          <p className="text-gray-500 mt-2">Pon a prueba tus conocimientos con desafíos reales</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ejercicios Resueltos</span>
            <span className="text-xl font-black text-tech-blue">{progress.exercisesDone}</span>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-tech-blue rounded-xl flex items-center justify-center">
            <Trophy size={20} />
          </div>
        </div>
      </header>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar ejercicios..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-transparent focus:border-tech-blue outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-transparent font-bold text-sm outline-none"
          >
            <option value="Todas">Todas las dificultades</option>
            <option value="1">Nivel 1 (Básico)</option>
            <option value="2">Nivel 2</option>
            <option value="3">Nivel 3</option>
            <option value="4">Nivel 4</option>
            <option value="5">Nivel 5 (Experto)</option>
          </select>
        </div>
      </div>

      {/* Lista de Ejercicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((ex, index) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card group hover:shadow-xl transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${
                    ex.difficulty <= 2 ? 'bg-green-100 text-green-600' : 
                    ex.difficulty <= 4 ? 'bg-orange-100 text-tech-orange' : 'bg-red-100 text-red-600'
                  }`}>
                    Nivel {ex.difficulty}
                  </span>
                  <span className="text-[10px] font-black bg-blue-50 text-tech-blue px-2 py-1 rounded-md uppercase tracking-widest">
                    {ex.specialty || 'General'}
                  </span>
                </div>
                <Zap className="text-tech-orange" size={20} />
              </div>

              <h3 className="text-xl font-black text-oxford mb-2 group-hover:text-tech-blue transition-colors">
                {ex.title}
              </h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                {ex.description}
              </p>

              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleStartExercise(ex, 'simulation')}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-tech-blue transition-all"
                >
                  <Cpu size={18} />
                  <span className="text-[9px] font-black uppercase">Simular</span>
                </button>
                <button 
                  onClick={() => handleStartExercise(ex, 'algorithm')}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-orange-50 text-gray-400 hover:text-tech-orange transition-all"
                >
                  <Code size={18} />
                  <span className="text-[9px] font-black uppercase">Algoritmo</span>
                </button>
                <button 
                  onClick={() => handleStartExercise(ex, 'python')}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-green-50 text-gray-400 hover:text-green-600 transition-all"
                >
                  <Play size={18} />
                  <span className="text-[9px] font-black uppercase">Python</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 card border-dashed border-2">
            <Target className="mx-auto text-gray-200 mb-4" size={48} />
            <h3 className="text-xl font-black text-oxford">No hay ejercicios disponibles</h3>
            <p className="text-gray-400 max-w-xs mx-auto mt-2">
              Pide a tu docente que agregue ejercicios al banco desde el panel de administración.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
