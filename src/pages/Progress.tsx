import React from 'react';
import { useStudent } from '../context/StudentContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { 
  Award, Clock, BookOpen, 
  AlertCircle, CheckCircle2, TrendingUp 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Progress: React.FC = () => {
  const { progress, settings } = useStudent();

  const moduleStats = settings.modules.map(m => ({
    name: m.title.split(' ')[0],
    completed: progress.completedModules.includes(m.id) ? 100 : 0,
    moduleId: m.id
  }));

  const pieData = [
    { name: 'Completados', value: progress.completedModules.length },
    { name: 'Pendientes', value: settings.modules.length - progress.completedModules.length },
  ];

  const COLORS = ['#007BFF', '#E5E7EB'];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black mb-2">Mi Progreso Académico</h1>
        <p className="text-gray-500">Visualiza tus logros y áreas de mejora en tiempo real.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Módulos Listos" 
          value={`${progress.completedModules.length}/${settings.modules.length}`}
          icon={CheckCircle2}
          color="text-green-500"
          bg="bg-green-50"
        />
        <StatCard 
          label="Ejercicios" 
          value={progress.exercisesDone}
          icon={Award}
          color="text-blue-500"
          bg="bg-blue-50"
        />
        <StatCard 
          label="Errores Detectados" 
          value={progress.errorsCount}
          icon={AlertCircle}
          color="text-red-500"
          bg="bg-red-50"
        />
        <StatCard 
          label="Última Actividad" 
          value={new Date(progress.lastActivity).toLocaleDateString()}
          icon={Clock}
          color="text-orange-500"
          bg="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-8 card">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-tech-blue" />
            Avance por Módulo (%)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#9CA3AF' }}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {moduleStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.completed === 100 ? '#007BFF' : '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="lg:col-span-4 card flex flex-col items-center justify-center">
          <h3 className="font-bold mb-6 text-center">Distribución de Aprendizaje</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 w-full">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-tech-blue"></div> Completados</span>
              <span className="font-bold">{progress.completedModules.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200"></div> Pendientes</span>
              <span className="font-bold">{settings.modules.length - progress.completedModules.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: any, icon: any, color: string, bg: string }> = ({ label, value, icon: Icon, color, bg }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="card flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${bg} ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black">{value}</p>
    </div>
  </motion.div>
);
