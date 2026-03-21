/**
 * Laboratorio de Programación INTI
 * © 2025 Angel Sanchez – Todos los derechos reservados
 *
 * Página de inicio de sesión del panel de administración.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAuthService } from '../../services/adminAuthService';
import { ShieldAlert, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  React.useEffect(() => {
    if (adminAuthService.isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Pequeño delay para mejorar UX y evitar fuerza bruta rápida
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = await adminAuthService.login(username, password);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Credenciales inválidas');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-tech-blue text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-oxford">Acceso Administrativo</h2>
          <p className="text-gray-400 text-sm">Ingrese sus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tech-blue focus:border-tech-blue transition-all outline-none"
                placeholder="Usuario"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-tech-blue focus:border-tech-blue transition-all outline-none"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-tech-blue text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Verificando...' : 'Iniciar Sesión'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 text-xs hover:text-tech-blue transition-colors underline"
          >
            Volver al inicio
          </button>
        </div>
      </motion.div>
    </div>
  );
};
