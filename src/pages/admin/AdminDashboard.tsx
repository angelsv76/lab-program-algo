import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAuthService } from '../../services/adminAuthService';
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  BookOpen, 
  LogOut, 
  Users, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  GraduationCap,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStudent } from '../../context/StudentContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { settings, progress, aiContents, feedbacks } = useStudent();

  const handleLogout = () => {
    adminAuthService.logout();
    navigate('/admin/login');
  };

  const stats = [
    { label: 'Módulos Activos', value: settings.modules.filter(m => m.isActive).length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Contenido IA', value: aiContents.length, icon: Sparkles, color: 'text-tech-blue', bg: 'bg-blue-50' },
    { label: 'Feedback IA', value: feedbacks.length, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Alertas de Sistema', value: '0', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  const barData = {
    labels: ['EPS', 'Thinking', 'Sequences', 'Math', 'Relational', 'Logic'],
    datasets: [
      {
        label: 'Uso por Módulo',
        data: [450, 320, 280, 510, 190, 150],
        backgroundColor: 'rgba(0, 123, 255, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['ITSI', 'Software', 'Automotriz', 'Industrial'],
    datasets: [
      {
        data: [40, 35, 15, 10],
        backgroundColor: [
          '#007BFF',
          '#6f42c1',
          '#fd7e14',
          '#28a745',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-oxford">Panel de Control</h1>
          <p className="text-gray-500">Gestión global de la plataforma educativa INTI</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-6 flex items-center gap-4"
          >
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-oxford">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="text-tech-blue" size={20} />
              Actividad de Módulos
            </h3>
          </div>
          <div className="h-[300px]">
            <Bar 
              data={barData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
              }} 
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users className="text-purple-600" size={20} />
            Distribución por Especialidad
          </h3>
          <div className="h-[250px] flex items-center justify-center">
            <Doughnut 
              data={doughnutData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Settings size={20} className="text-tech-blue" /> Gestión de Módulos
            </h2>
            <Link to="/admin/modules" className="text-sm text-tech-blue font-bold hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-4">
            {settings.modules.slice(0, 3).map(module => (
              <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-sm">{module.title}</span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${module.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                  {module.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="card space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-tech-orange" /> Actividad Reciente
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Juan Pérez', module: 'EPS', result: 'Correcto', color: 'text-green-600' },
              { name: 'María García', module: 'Math Ops', result: 'Error', color: 'text-red-600' },
              { name: 'Carlos López', module: 'Logic', result: 'Correcto', color: 'text-green-600' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{row.name}</span>
                  <span className="text-[10px] text-gray-400 uppercase">{row.module}</span>
                </div>
                <span className={`text-xs font-black ${row.color}`}>{row.result}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link to="/admin/modules" className="card hover:border-tech-blue transition-all group">
          <BookOpen className="text-tech-blue mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold">Módulos</h3>
          <p className="text-xs text-gray-500 mt-1">Activar/desactivar contenido</p>
        </Link>
        <Link to="/admin/exercises" className="card hover:border-tech-orange transition-all group">
          <Sparkles className="text-tech-orange mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold">Contenidos IA</h3>
          <p className="text-xs text-gray-500 mt-1">Administrar motor pedagógico</p>
        </Link>
        <Link to="/admin/statistics" className="card hover:border-purple-500 transition-all group">
          <BarChart3 className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold">Estadísticas</h3>
          <p className="text-xs text-gray-500 mt-1">Progreso detallado</p>
        </Link>
        <Link to="/admin/users" className="card hover:border-green-500 transition-all group">
          <Users className="text-green-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold">Usuarios</h3>
          <p className="text-xs text-gray-500 mt-1">Gestión de estudiantes</p>
        </Link>
        <Link to="/admin/access-codes" className="card hover:border-tech-blue transition-all group md:col-span-1">
          <GraduationCap className="text-tech-blue mb-4 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="font-bold">Grupos</h3>
          <p className="text-xs text-gray-500 mt-1">Gestión de códigos INTI</p>
        </Link>
      </div>
    </div>
  );
};
