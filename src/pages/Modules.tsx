import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Modules: React.FC = () => {
  const { settings, progress } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const activeModules = settings.modules.filter(m => m.isActive);
  
  const filteredModules = activeModules.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         m.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todas' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', ...new Set(activeModules.map(m => m.category))];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black text-oxford">Módulos de Aprendizaje</h1>
        <p className="text-gray-500 mt-2">Explora y domina los fundamentos de la programación</p>
      </header>

      {/* Buscador y Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="¿Qué quieres aprender hoy? (ej. Bucles, Variables...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-transparent focus:border-tech-blue outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent font-bold text-sm outline-none"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module, index) => {
          const isCompleted = progress.completedModules.includes(module.id);
          
          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative"
            >
              <Link to={`/modulos/${module.id}`} className="block h-full">
                <div className={`card h-full flex flex-col p-6 transition-all hover:shadow-xl hover:-translate-y-1 ${isCompleted ? 'border-green-200 bg-green-50/30' : ''}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-tech-blue'}`}>
                      <BookOpen size={24} />
                    </div>
                    {isCompleted ? (
                      <CheckCircle2 className="text-green-500" size={24} />
                    ) : module.permanent ? (
                      <Zap className="text-tech-orange" size={20} />
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-tech-blue mb-2 block">
                      {module.category}
                    </span>
                    <h3 className="text-xl font-black text-oxford mb-3 group-hover:text-tech-blue transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                      {module.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-black text-oxford group-hover:text-tech-blue transition-colors">
                      {isCompleted ? 'Repasar contenido' : 'Empezar ahora'}
                      <ArrowRight size={16} className="text-tech-orange" />
                    </div>
                    {module.permanent && (
                      <span className="text-[9px] font-black bg-oxford text-white px-2 py-1 rounded-md uppercase tracking-tighter">
                        Fundamental
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-black text-oxford">No encontramos ese módulo</h3>
          <p className="text-gray-500">Intenta con otra palabra clave o categoría.</p>
        </div>
      )}
    </div>
  );
};
