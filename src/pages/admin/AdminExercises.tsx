import React, { useState } from 'react';
import { LayoutDashboard, ArrowLeft, RefreshCw, Lightbulb, CheckCircle, Cpu, Zap, ChevronRight, PlusCircle, Sparkles, Eye, EyeOff, Trash2, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { exerciseGenerator, GeneratedExercise } from '../../engine/exerciseGenerator';
import { Specialty } from '../../data/exerciseTemplates';
import { useStudent } from '../../context/StudentContext';
import { Exercise, AIContent } from '../../types';

export const AdminExercises: React.FC = () => {
  const { addToExerciseBank, aiContents, updateAIContent, deleteAIContent } = useStudent();
  const [specialty, setSpecialty] = useState<Specialty>('General');
  const [difficulty, setDifficulty] = useState(1);
  const [moduleId, setModuleId] = useState('math-ops');
  const [currentExercise, setCurrentExercise] = useState<GeneratedExercise | null>(null);
  const [view, setView] = useState<'generator' | 'ai-content'>('generator');

  const generate = () => {
    const ex = exerciseGenerator.generate(moduleId, specialty, difficulty);
    setCurrentExercise(ex);
  };

  const handleAddToBank = () => {
    if (!currentExercise) return;
    
    const exercise: Exercise = {
      id: currentExercise.id,
      title: currentExercise.title,
      description: currentExercise.description,
      difficulty: currentExercise.difficulty as any,
      type: 'algorithm',
      solution: currentExercise.expectedAnswer.toString(),
      createdAt: new Date().toISOString(),
      module: moduleId,
      specialty: specialty,
      data: {
        hints: currentExercise.hints
      }
    };
    
    addToExerciseBank(exercise);
    alert('Ejercicio agregado al banco con éxito');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-oxford">Gestión de Contenidos</h1>
            <p className="text-gray-500">Administre ejercicios automáticos y contenido generado por IA</p>
          </div>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('generator')}
            className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${view === 'generator' ? 'bg-white text-tech-blue shadow-sm' : 'text-gray-400'}`}
          >
            Generador
          </button>
          <button 
            onClick={() => setView('ai-content')}
            className={`px-4 py-2 rounded-lg font-black text-xs transition-all ${view === 'ai-content' ? 'bg-white text-tech-blue shadow-sm' : 'text-gray-400'}`}
          >
            Contenido IA ({aiContents.length})
          </button>
        </div>
      </header>

      {view === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="card h-fit space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Cpu className="text-tech-blue" size={20} /> Configuración
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Módulo</label>
                <select 
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue"
                >
                  <option value="eps">Entrada-Proceso-Salida</option>
                  <option value="math-ops">Operadores Aritméticos</option>
                  <option value="relational-ops">Operadores Relacionales</option>
                  <option value="logic-ops">Operadores Lógicos</option>
                  <option value="operator-priority">Prioridad de Operadores</option>
                  <option value="algorithmic-structures">Estructuras Algorítmicas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Especialidad</label>
                <div className="grid grid-cols-2 gap-2">
                  {['General', 'ITSI', 'Software', 'Automotriz', 'Industrial'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpecialty(s as Specialty)}
                      className={`p-2 text-xs font-bold rounded-lg border transition-all ${
                        specialty === s 
                        ? 'bg-tech-blue border-tech-blue text-white shadow-md' 
                        : 'bg-white border-gray-200 text-gray-500 hover:border-tech-blue'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Dificultad (Nivel {difficulty})</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  className="w-full accent-tech-blue"
                />
              </div>

              <button
                onClick={generate}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4"
              >
                <RefreshCw size={20} /> Generar
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {currentExercise ? (
              <motion.div
                key={currentExercise.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card border-l-4 border-l-green-500 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-2 py-1 rounded">
                      {currentExercise.type} - Nivel {currentExercise.difficulty}
                    </span>
                    <h2 className="text-xl font-black text-oxford mt-2">{currentExercise.title}</h2>
                  </div>
                  <Zap className="text-tech-orange" size={24} />
                </div>

                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 italic text-lg">
                  "{currentExercise.description}"
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-gray-500 flex items-center gap-2">
                    <Lightbulb size={16} className="text-tech-orange" /> Pistas
                  </h4>
                  {currentExercise.hints.map((hint, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black">
                        {i + 1}
                      </span>
                      {hint}
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <span className="text-sm font-bold">Respuesta:</span>
                    <code className="bg-oxford text-white px-3 py-1 rounded-lg font-mono text-sm">
                      {currentExercise.expectedAnswer}
                    </code>
                  </div>

                  <button
                    onClick={handleAddToBank}
                    className="flex items-center gap-2 px-4 py-2 bg-tech-blue text-white rounded-xl font-bold hover:bg-oxford transition-all shadow-md"
                  >
                    <PlusCircle size={18} /> Agregar al Banco
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="card h-full flex flex-col items-center justify-center text-center p-12 border-dashed border-2">
                <RefreshCw className="text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 italic">Configure y genere un ejercicio para previsualizar</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {aiContents.length === 0 ? (
            <div className="card p-20 text-center border-dashed border-2">
              <Sparkles className="mx-auto text-gray-200 mb-4" size={64} />
              <h3 className="text-xl font-black text-gray-400">No hay contenido de IA generado aún</h3>
              <p className="text-gray-400 max-w-md mx-auto mt-2">El contenido aparecerá aquí a medida que los estudiantes utilicen el tutor IA en los módulos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {aiContents.map((content) => (
                <div key={content.id} className={`card border-l-4 ${content.estado === 'oculto' ? 'border-l-gray-300 opacity-75' : 'border-l-tech-blue'} space-y-4`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-tech-blue bg-blue-50 px-2 py-1 rounded">
                          {content.tema}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Nivel {content.nivel} - {content.especialidad}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                          content.estado === 'activo' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {content.estado}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-oxford mt-2">Contenido Generado el {new Date(content.fecha_generacion).toLocaleDateString()}</h4>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateAIContent(content.id, { estado: content.estado === 'activo' ? 'oculto' : 'activo' })}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                        title={content.estado === 'activo' ? 'Ocultar' : 'Activar'}
                      >
                        {content.estado === 'activo' ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button 
                        onClick={() => deleteAIContent(content.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                    <div>
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Explicación</h5>
                      <p className="text-sm text-gray-600 line-clamp-3">{content.explicacion}</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Ejercicio Propuesto</h5>
                      <p className="text-sm text-gray-600 line-clamp-3 font-bold">{content.ejercicio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
