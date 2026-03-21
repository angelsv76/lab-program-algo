import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { BookOpen, ToggleLeft, ToggleRight, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AdminModules: React.FC = () => {
  const { settings, toggleModule } = useStudent();

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-oxford">Gestión de Módulos</h1>
          <p className="text-gray-500">Configure la disponibilidad y visibilidad de los contenidos pedagógicos</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {settings.modules.sort((a, b) => a.order - b.order).map((module) => (
          <motion.div 
            key={module.id} 
            layout
            className="card flex flex-col md:flex-row items-center justify-between p-6 gap-4"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`p-3 rounded-2xl ${module.permanent ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-tech-blue'}`}>
                <BookOpen size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{module.title}</h3>
                  {module.permanent && (
                    <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-black uppercase">
                      <Lock size={10} /> Permanente
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">{module.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-1 mr-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibilidad</span>
                <div className="flex items-center gap-2 text-tech-blue font-bold text-sm">
                  {module.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  {module.visible ? 'Público' : 'Oculto'}
                </div>
              </div>

              <button 
                onClick={() => !module.permanent && toggleModule(module.id)}
                disabled={module.permanent}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black transition-all ${
                  module.permanent 
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                    : module.isActive 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'bg-red-50 text-red-400 hover:bg-red-100'
                }`}
              >
                {module.isActive ? (
                  <><ToggleRight size={24} /> Activo</>
                ) : (
                  <><ToggleLeft size={24} /> Inactivo</>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start">
        <div className="bg-tech-blue p-2 rounded-lg text-white">
          <Lock size={20} />
        </div>
        <div>
          <h4 className="font-bold text-tech-blue">Módulos Fundamentales</h4>
          <p className="text-sm text-blue-800/70 mt-1">
            Los módulos marcados como permanentes no pueden ser desactivados ya que forman parte del currículo base obligatorio de primer año.
          </p>
        </div>
      </div>
    </div>
  );
};
