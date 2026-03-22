import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  LogIn, 
  Zap, 
  ShieldCheck, 
  Code, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

import { adminAuthService } from '../services/adminAuthService';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { registerStudent, student, validateAccessCode, accessCodes } = useStudent();
  const isAdmin = adminAuthService.isAuthenticated();
  const [formData, setFormData] = useState({
    nombre_completo: '',
    nie: '',
    codigo_grupo: ''
  });
  const [error, setError] = useState('');

  // Si ya hay un estudiante o admin, redirigir al dashboard correspondiente
  React.useEffect(() => {
    if (student) {
      navigate('/dashboard');
    } else if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [student, isAdmin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAccessCode(formData.codigo_grupo)) {
      const newStudent = {
        id: Date.now().toString(),
        nombre_completo: formData.nombre_completo,
        nie: formData.nie,
        codigo_grupo: formData.codigo_grupo.toUpperCase(),
        fecha_registro: new Date().toISOString(),
        ultimo_acceso: new Date().toISOString()
      };
      registerStudent(newStudent);
      navigate('/dashboard');
    } else {
      setError('Código de grupo no autorizado.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Hero Section */}
      <div className="flex-1 space-y-8 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-tech-blue px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <Zap size={14} />
            Plataforma Educativa INTI
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-oxford leading-tight">
            Aprendé a <br />
            <span className="text-tech-blue">pensar</span> <br />
            como programador
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Algoritmos, pseudocódigo y lógica de programación — con ejercicios diseñados para tu especialidad en el INTI.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <span className="text-sm font-bold text-oxford">Seguro y Local</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 text-tech-orange rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <span className="text-sm font-bold text-oxford">Tutoría con IA</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-tech-blue rounded-xl flex items-center justify-center">
              <Code size={20} />
            </div>
            <span className="text-sm font-bold text-oxford">Práctica Real</span>
          </div>
        </div>
      </div>

      {/* Access Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="card p-8 shadow-2xl border-oxford/5">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-oxford">¿Sos estudiante del INTI?</h2>
            <p className="text-gray-400 text-sm">Ingresá tus datos para entrar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nombre Completo</label>
              <input 
                type="text" 
                required
                value={formData.nombre_completo}
                onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
                placeholder="Ej. Juan Pérez López"
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-tech-blue border border-transparent transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">NIE</label>
              <input 
                type="text" 
                required
                value={formData.nie}
                onChange={(e) => setFormData({...formData, nie: e.target.value})}
                placeholder="Tu número de identificación"
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-tech-blue border border-transparent transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Código de Grupo</label>
              <select 
                required
                value={formData.codigo_grupo}
                onChange={(e) => {
                  setFormData({...formData, codigo_grupo: e.target.value});
                  setError('');
                }}
                className={`w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-tech-blue border transition-all ${error ? 'border-red-500' : 'border-transparent'}`}
              >
                <option value="">Selecciona tu grupo</option>
                {accessCodes.filter(c => c.activo).map(code => (
                  <option key={code.id} value={code.codigo}>
                    {code.codigo}
                  </option>
                ))}
              </select>
              {error && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">
                  {error}
                </p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-tech-blue text-white rounded-xl font-black text-lg shadow-lg hover:bg-oxford transition-all flex items-center justify-center gap-2 mt-6"
            >
              Ingresar
              <ChevronRight size={20} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              ¿Eres docente? <span onClick={() => navigate('/admin')} className="text-tech-blue font-bold cursor-pointer hover:underline">Acceso Administrativo</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
