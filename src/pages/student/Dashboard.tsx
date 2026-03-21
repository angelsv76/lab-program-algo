import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Code, 
  Trophy, 
  Clock, 
  ArrowRight, 
  MessageSquare,
  Zap,
  Star,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { adminAuthService } from '../../services/adminAuthService';

export const StudentDashboard: React.FC = () => {
  const { student, progress, settings } = useStudent();
  const isAdmin = adminAuthService.isAuthenticated();

  if (!student && !isAdmin) return null;

  // Mock student for teacher view if no student is logged in
  const displayStudent = student || {
    nombre_completo: 'Vista de Docente',
    codigo_grupo: 'ADMIN',
    nie: '0000000'
  };

  const activeModules = settings.modules.filter(m => m.isActive);
  const completedCount = progress.completedModules.length;
  const progressPercentage = Math.round((completedCount / activeModules.length) * 100);

  return (
    <div className="space-y-8 pb-20">
      {isAdmin && !student && (
        <div className="bg-tech-blue/10 border border-tech-blue p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="text-tech-blue" />
            <div>
              <p className="text-sm font-black text-oxford">Modo de Evaluación Docente</p>
              <p className="text-xs text-gray-500">Estás visualizando la plataforma como un estudiante para revisión de contenido.</p>
            </div>
          </div>
          <Link to="/admin" className="btn-secondary py-2 px-4 text-xs">Volver al Panel</Link>
        </div>
      )}

      {/* Header con Bienvenida */}
      <header className="relative overflow-hidden bg-oxford rounded-3xl p-8 text-white">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="bg-tech-blue/20 text-tech-blue px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                {isAdmin && !student ? 'Vista Previa Docente' : 'Panel del Estudiante'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-4">
                ¡Hola, <span className="text-tech-orange">{displayStudent.nombre_completo.split(' ')[0]}</span>!
              </h1>
              <p className="text-oxford-light max-w-md">
                Hoy es un gran día para fortalecer tu pensamiento computacional. ¿Qué vamos a programar hoy?
              </p>
            </motion.div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Trophy className="text-tech-orange" size={20} />
                <span className="font-bold">{completedCount} Módulos</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <Zap className="text-tech-blue" size={20} />
                <span className="font-bold">{progress.exercisesDone} Ejercicios</span>
              </div>
            </div>
          </div>

          {/* Asistente Visual (Cocodrilo Tecnológico) */}
          <motion.div 
            className="relative w-48 h-48 bg-tech-blue/10 rounded-full flex items-center justify-center border-4 border-tech-blue/20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-6xl">🐊</div>
            <div className="absolute -top-4 -right-4 bg-white text-oxford p-3 rounded-2xl shadow-xl border border-gray-100 max-w-[150px]">
              <p className="text-[10px] font-black leading-tight">
                "¡Recuerda que los algoritmos son como recetas de cocina!"
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-blue/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-tech-orange/10 blur-3xl rounded-full -ml-24 -mb-24"></div>
      </header>

      {/* Grid de Progreso y Acciones Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna de Módulos y Actividad */}
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-oxford flex items-center gap-2">
                <BookOpen className="text-tech-blue" />
                Tus Módulos de Aprendizaje
              </h2>
              <Link to="/modulos" className="text-tech-blue font-bold text-sm hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeModules.slice(0, 4).map((module, index) => {
                const isCompleted = progress.completedModules.includes(module.id);
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/modulos/${module.id}`} className="block h-full">
                      <div className={`card h-full p-6 group-hover:border-tech-blue transition-all ${isCompleted ? 'bg-green-50/50 border-green-100' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-tech-blue'}`}>
                            <Code size={24} />
                          </div>
                          {isCompleted && (
                            <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                              Completado
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-black text-oxford mb-2 group-hover:text-tech-blue transition-colors">
                          {module.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-2">
                          {module.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-black text-oxford group-hover:gap-4 transition-all">
                          {isCompleted ? 'Repasar Módulo' : 'Continuar Aprendiendo'}
                          <ArrowRight size={16} className="text-tech-orange" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Actividad Reciente */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-oxford flex items-center gap-2">
              <Clock className="text-tech-orange" />
              Actividad Reciente
            </h2>
            <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
              <div className="p-6 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-tech-blue/10 text-tech-blue rounded-xl flex items-center justify-center">
                    <Code size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-oxford">Algoritmo de Suma</p>
                    <p className="text-xs text-gray-400">Ejecutado hace 2 horas</p>
                  </div>
                </div>
                <Link to="/laboratorio" className="btn-secondary py-2 px-4 text-xs">Abrir Lab</Link>
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-tech-orange/10 text-tech-orange rounded-xl flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-oxford">Práctica de Variables</p>
                    <p className="text-xs text-gray-400">Completado ayer</p>
                  </div>
                </div>
                <Link to="/practica" className="btn-secondary py-2 px-4 text-xs">Ver Práctica</Link>
              </div>
            </div>
          </section>
        </div>

        {/* Columna Lateral: Estadísticas y Tutor */}
        <div className="space-y-8">
          {/* Card de Progreso General */}
          <div className="card p-6 bg-white">
            <h3 className="text-lg font-black text-oxford mb-6">Tu Progreso General</h3>
            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-tech-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-bold">{progressPercentage}% Completado</span>
              <span className="text-oxford font-black">{completedCount}/{activeModules.length} Módulos</span>
            </div>
          </div>

          {/* Recomendaciones del Tutor IA */}
          <div className="card p-6 bg-tech-orange/5 border-tech-orange/20">
            <h3 className="text-lg font-black text-oxford mb-4 flex items-center gap-2">
              <Sparkles className="text-tech-orange" size={20} />
              Recomendado para ti
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-tech-orange/10 shadow-sm">
                <p className="text-xs font-black text-tech-orange mb-1 uppercase tracking-wider">Siguiente Paso</p>
                <p className="font-bold text-oxford text-sm mb-2">Módulo 2: Estructuras de Control</p>
                <p className="text-[10px] text-gray-500 mb-3">Has dominado las variables, ¡ahora aprende a tomar decisiones!</p>
                <Link to="/modulos/2" className="text-xs font-black text-tech-blue flex items-center gap-1">
                  Comenzar ahora <ArrowRight size={12} />
                </Link>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-tech-orange/10 shadow-sm">
                <p className="text-xs font-black text-tech-orange mb-1 uppercase tracking-wider">Refuerzo</p>
                <p className="font-bold text-oxford text-sm mb-2">Práctica: Operadores Matemáticos</p>
                <p className="text-[10px] text-gray-500 mb-3">Refuerza tus conocimientos en cálculos complejos.</p>
                <Link to="/practica" className="text-xs font-black text-tech-blue flex items-center gap-1">
                  Ir a práctica <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Compañero de Estudio IA (Acceso Rápido) */}
          <div className="card p-6 bg-gradient-to-br from-tech-blue to-oxford text-white border-none">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="font-black">Tutor IA INTI</h3>
                <p className="text-xs text-blue-200">Disponible ahora</p>
              </div>
            </div>
            <p className="text-sm text-blue-100 mb-6">
              ¿Tienes dudas sobre algún algoritmo? Mi IA está lista para explicarte paso a paso.
            </p>
            <button className="w-full py-3 bg-tech-orange hover:bg-orange-600 text-white rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2">
              Preguntar al Tutor
              <Zap size={16} />
            </button>
          </div>

          {/* Logros Recientes */}
          <div className="card p-6">
            <h3 className="text-lg font-black text-oxford mb-4 flex items-center gap-2">
              <Star className="text-tech-orange" size={20} />
              Logros Recientes
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-tech-orange/10 text-tech-orange rounded-lg flex items-center justify-center font-black">
                  1
                </div>
                <div>
                  <p className="text-xs font-black text-oxford">Primer Algoritmo</p>
                  <p className="text-[10px] text-gray-400">Completaste el módulo de Entrada-Proceso-Salida</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-tech-blue/10 text-tech-blue rounded-lg flex items-center justify-center font-black">
                  5
                </div>
                <div>
                  <p className="text-xs font-black text-oxford">Pentaprogramador</p>
                  <p className="text-[10px] text-gray-400">Has resuelto 5 ejercicios correctamente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
