import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, BookOpen, FlaskConical, Activity, 
  Settings, Info, LogOut, Menu, X, Zap
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { motion, AnimatePresence } from 'framer-motion';

import { adminAuthService } from '../services/adminAuthService';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { student, logout } = useStudent();
  const isAdmin = adminAuthService.isAuthenticated();
  const adminSession = adminAuthService.getSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: Home, label: 'Inicio' },
    { to: '/dashboard', icon: Activity, label: 'Dashboard' },
    { to: '/modulos', icon: BookOpen, label: 'Módulos' },
    { to: '/practica', icon: Zap, label: 'Práctica' },
    { to: '/laboratorio', icon: FlaskConical, label: 'Laboratorio' },
    { to: '/admin', icon: Settings, label: 'Docente' },
    { to: '/acerca', icon: Info, label: 'Acerca' },
  ];

  const handleLogout = () => {
    if (isAdmin) {
      adminAuthService.logout();
    }
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-tech-gray">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-oxford text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-tech-blue rounded-xl flex items-center justify-center font-bold text-xl">
            I
          </div>
          <div>
            <h1 className="font-black text-lg leading-none">INTI</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Laboratorio</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${isActive ? 'bg-tech-blue text-white shadow-lg' : 'text-white/60 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {(student || isAdmin) && (
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isAdmin && !student ? 'bg-tech-blue' : 'bg-tech-orange'}`}>
                {student ? student.nombre_completo[0] : (adminSession?.username[0].toUpperCase() || 'A')}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{student ? student.nombre_completo : 'Administrador'}</p>
                <p className="text-[10px] text-white/40 uppercase">{student ? student.codigo_grupo : 'Docente'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-white/40 hover:text-red-400 transition-colors w-full"
            >
              <LogOut size={14} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-oxford text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-tech-blue rounded-lg flex items-center justify-center font-bold">I</div>
          <span className="font-black">INTI</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-oxford pt-20 p-6"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-6 py-4 rounded-2xl text-lg
                    ${isActive ? 'bg-tech-blue text-white' : 'text-white/60'}
                  `}
                >
                  <item.icon size={24} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              
              {(student || isAdmin) && (
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl text-lg text-red-400 w-full"
                >
                  <LogOut size={24} />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <div className="flex-1 p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>

        {/* Footer Global */}
        <footer className="p-8 border-t border-gray-100 bg-white text-center">
          <p className="text-xs font-black text-oxford">
            © {new Date().getFullYear()} Ángel Sánchez – Laboratorio de Programación INTI
          </p>
          <p className="text-[10px] text-gray-400 mt-1">
            Plataforma educativa creada para apoyar a los estudiantes del Instituto Nacional Técnico Industrial.
          </p>
        </footer>
      </main>
    </div>
  );
};
