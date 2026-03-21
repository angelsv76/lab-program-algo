import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  BookOpen, 
  Zap, 
  Play, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Lightbulb,
  Star,
  Send
} from 'lucide-react';
import { aiTutorService } from '../engine/aiTutorService';
import ReactMarkdown from 'react-markdown';
import { AIContent } from '../types';
import { formatAlgorithm, normalizeAlgorithm } from '../utils/algorithmFormatter';

export const ModuleDetail: React.FC = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { settings, student, completeModule, progress, getAIContent, saveFeedback } = useStudent();
  const [activeTab, setActiveTab] = useState<'teoria' | 'ejemplos' | 'practica'>('teoria');
  const [aiContent, setAiContent] = useState<AIContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const module = settings.modules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-oxford">Módulo no encontrado</h2>
        <Link to="/modulos" className="text-tech-blue font-bold hover:underline mt-4 inline-block">
          Volver a módulos
        </Link>
      </div>
    );
  }

  const handleGenerateAIContent = async () => {
    setIsGenerating(true);
    setFeedbackSent(false);
    try {
      const content = await getAIContent(
        module.title,
        1, // Nivel inicial
        student?.codigo_grupo || 'General'
      );
      setAiContent(content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendFeedback = () => {
    if (feedbackRating === 0 || !aiContent) return;

    saveFeedback({
      contentId: aiContent.id,
      studentId: student?.id || 'anonimo',
      rating: feedbackRating,
      comment: feedbackComment,
      level: aiContent.nivel,
      topic: aiContent.tema
    });

    setFeedbackSent(true);
    setFeedbackRating(0);
    setFeedbackComment('');
  };

  const isCompleted = progress.completedModules.includes(module.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Navegación y Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/modulos')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-tech-blue">
              {module.category}
            </span>
            <h1 className="text-3xl font-black text-oxford">{module.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl font-black text-sm">
              <CheckCircle2 size={18} />
              Completado
            </div>
          ) : (
            <button 
              onClick={() => completeModule(module.id)}
              className="btn-primary flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              Marcar como completado
            </button>
          )}
        </div>
      </div>

      {/* Tabs de Navegación del Módulo */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
        {(['teoria', 'ejemplos', 'practica'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-black text-sm transition-all ${
              activeTab === tab 
                ? 'bg-white text-tech-blue shadow-sm' 
                : 'text-gray-400 hover:text-oxford'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido Principal */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'teoria' && (
              <motion.div
                key="teoria"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="card p-8 prose prose-slate max-w-none">
                  <h2 className="text-2xl font-black text-oxford mb-4">Conceptos Fundamentales</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {module.description}
                  </p>
                  <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-black text-tech-blue flex items-center gap-2 mb-2">
                      <Lightbulb size={20} />
                      ¿Sabías que?
                    </h4>
                    <p className="text-sm text-blue-800 italic">
                      Este concepto es la base de casi todos los programas que usas a diario, desde WhatsApp hasta los juegos más complejos.
                    </p>
                  </div>
                </div>

                {/* Sección IA */}
                <div className="card p-8 bg-gradient-to-br from-white to-blue-50 border-tech-blue/20">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-tech-blue text-white rounded-xl flex items-center justify-center">
                        <Sparkles size={20} />
                      </div>
                      <h3 className="text-xl font-black text-oxford">Tutor IA Pedagógico</h3>
                    </div>
                    <button 
                      onClick={handleGenerateAIContent}
                      disabled={isGenerating}
                      className="flex items-center gap-2 bg-tech-blue text-white px-4 py-2 rounded-xl font-black text-sm hover:bg-oxford transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? 'Generando...' : aiContent ? 'Actualizar con IA' : 'Generar con IA'}
                      <Zap size={16} />
                    </button>
                  </div>

                  {aiContent ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="prose prose-blue max-w-none bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                        <h4 className="text-tech-blue font-black mb-2">Explicación del Tutor</h4>
                        <ReactMarkdown>{aiContent.explicacion}</ReactMarkdown>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                          <h5 className="text-red-700 font-black text-xs uppercase tracking-widest mb-2">Errores Comunes</h5>
                          <div className="text-sm text-red-800">
                            <ReactMarkdown>{aiContent.errores_comunes}</ReactMarkdown>
                          </div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
                          <h5 className="text-green-700 font-black text-xs uppercase tracking-widest mb-2">Nivel Recomendado</h5>
                          <p className="text-sm text-green-800">Este contenido está optimizado para tu nivel actual ({aiContent.nivel}/5).</p>
                        </div>
                      </div>

                      {/* Feedback Form */}
                      {!feedbackSent ? (
                        <div className="pt-6 border-t border-blue-100">
                          <h5 className="text-sm font-black text-oxford mb-4 flex items-center gap-2">
                            <MessageSquare size={16} className="text-tech-blue" />
                            ¿Qué te pareció esta explicación?
                          </h5>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-bold text-gray-400">Dificultad:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setFeedbackRating(star)}
                                    className="transition-transform hover:scale-110"
                                  >
                                    <Star 
                                      size={24} 
                                      fill={star <= feedbackRating ? '#FF8C00' : 'none'} 
                                      className={star <= feedbackRating ? 'text-tech-orange' : 'text-gray-300'}
                                    />
                                  </button>
                                ))}
                              </div>
                              <span className="text-xs font-black text-tech-orange">
                                {feedbackRating === 1 && 'Muy Fácil'}
                                {feedbackRating === 2 && 'Fácil'}
                                {feedbackRating === 3 && 'Adecuado'}
                                {feedbackRating === 4 && 'Difícil'}
                                {feedbackRating === 5 && 'Muy Difícil'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={feedbackComment}
                                onChange={(e) => setFeedbackComment(e.target.value)}
                                placeholder="Opcional: ¿Cómo podemos mejorar?"
                                className="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue text-sm"
                              />
                              <button 
                                onClick={handleSendFeedback}
                                disabled={feedbackRating === 0}
                                className="p-3 bg-tech-blue text-white rounded-xl disabled:opacity-50 hover:bg-oxford transition-colors"
                              >
                                <Send size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-6 border-t border-blue-100 text-center"
                        >
                          <p className="text-green-600 font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 size={18} />
                            ¡Gracias por tu feedback! Nos ayuda a mejorar el tutor.
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-center py-10 border-2 border-dashed border-blue-100 rounded-2xl">
                      <MessageSquare className="mx-auto text-blue-200 mb-2" size={40} />
                      <p className="text-gray-400 text-sm italic">
                        Haz clic en el botón para que el tutor IA genere contenido personalizado para ti.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'ejemplos' && (
              <motion.div
                key="ejemplos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {aiContent ? (
                  <div className="space-y-6">
                    <div className="card p-8">
                      <h3 className="text-xl font-black text-oxford mb-4 flex items-center gap-2">
                        <Play className="text-tech-orange" size={20} />
                        Ejemplo Práctico
                      </h3>
                      <p className="text-gray-600 mb-6">{aiContent.ejemplo}</p>
                      
                      <div className="space-y-4">
                        <div className="bg-oxford rounded-2xl p-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-tech-blue uppercase tracking-widest">Algoritmo (Pseudocódigo)</span>
                          </div>
                          <pre className="text-white font-mono text-sm whitespace-pre-wrap">{formatAlgorithm(aiContent.algoritmo)}</pre>
                        </div>

                        <div className="bg-gray-900 rounded-2xl p-6">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-tech-orange uppercase tracking-widest">Solución Paso a Paso</span>
                          </div>
                          <div className="text-gray-300 text-sm prose prose-invert max-w-none">
                            <ReactMarkdown>{aiContent.solucion}</ReactMarkdown>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 flex gap-4">
                        <button 
                          onClick={() => navigate('/simulacion', { state: { algorithm: normalizeAlgorithm(aiContent.algoritmo), title: 'Simulación: ' + module.title } })}
                          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-black text-sm transition-colors"
                        >
                          Ver Simulación
                        </button>
                        <button 
                          onClick={() => navigate('/laboratorio', { state: { initialCode: normalizeAlgorithm(aiContent.algoritmo), mode: 'algorithm', title: 'Laboratorio: ' + module.title } })}
                          className="flex-1 py-3 bg-tech-blue text-white rounded-xl font-black text-sm transition-colors"
                        >
                          Probar en Laboratorio
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <Sparkles className="mx-auto text-tech-blue mb-4" size={48} />
                    <h3 className="text-xl font-black text-oxford mb-2">Genera contenido primero</h3>
                    <p className="text-gray-500 mb-6">Ve a la pestaña de Teoría y genera el contenido con IA para ver ejemplos personalizados.</p>
                    <button onClick={() => setActiveTab('teoria')} className="btn-primary">Ir a Teoría</button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'practica' && (
              <motion.div
                key="practica"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {aiContent ? (
                  <div className="card p-8">
                    <div className="w-16 h-16 bg-tech-orange/10 text-tech-orange rounded-2xl flex items-center justify-center mb-6">
                      <Zap size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-oxford mb-4">Reto de Práctica</h3>
                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                      <div className="text-gray-700 leading-relaxed font-bold">
                        <ReactMarkdown>{aiContent.ejercicio}</ReactMarkdown>
                      </div>
                      {aiContent.pista && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3">
                          <Lightbulb className="text-yellow-600 flex-shrink-0" size={18} />
                          <p className="text-xs text-yellow-800 italic">
                            <span className="font-black">Pista:</span> {aiContent.pista}
                          </p>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => navigate('/laboratorio', { state: { initialCode: '', mode: 'python', title: 'Práctica: ' + module.title, challenge: aiContent.ejercicio } })}
                      className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                    >
                      Resolver en Laboratorio
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <Sparkles className="mx-auto text-tech-blue mb-4" size={48} />
                    <h3 className="text-xl font-black text-oxford mb-2">Genera contenido primero</h3>
                    <p className="text-gray-500 mb-6">Ve a la pestaña de Teoría y genera el contenido con IA para ver ejercicios personalizados.</p>
                    <button onClick={() => setActiveTab('teoria')} className="btn-primary">Ir a Teoría</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Informativo */}
        <div className="space-y-6">
          <div className="card p-6 bg-oxford text-white">
            <h4 className="font-black mb-4 flex items-center gap-2">
              <HelpCircle size={18} className="text-tech-blue" />
              Objetivos del Módulo
            </h4>
            <ul className="space-y-3 text-sm text-oxford-light">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-tech-blue rounded-full mt-1.5 flex-shrink-0"></div>
                Comprender la lógica fundamental.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-tech-blue rounded-full mt-1.5 flex-shrink-0"></div>
                Identificar los componentes básicos.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-tech-blue rounded-full mt-1.5 flex-shrink-0"></div>
                Aplicar el concepto en problemas reales.
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <h4 className="font-black text-oxford mb-4">Recursos Adicionales</h4>
            <div className="space-y-3">
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left text-sm font-bold flex items-center justify-between group transition-all">
                Guía en PDF
                <ArrowLeft size={16} className="rotate-180 text-gray-400 group-hover:text-tech-blue" />
              </button>
              <button className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left text-sm font-bold flex items-center justify-between group transition-all">
                Video Tutorial
                <ArrowLeft size={16} className="rotate-180 text-gray-400 group-hover:text-tech-blue" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
