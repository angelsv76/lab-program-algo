import React from 'react';
import { BarChart3, ArrowLeft, Download, TrendingUp, Users, Award, Target, Sparkles, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStudent } from '../../context/StudentContext';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Line, Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const AdminStatistics: React.FC = () => {
  const { aiContents, feedbacks, students } = useStudent();

  const lineData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        fill: true,
        label: 'Ejercicios Completados',
        data: [65, 59, 80, 81, 56, 40, 30],
        borderColor: '#007BFF',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const radarData = {
    labels: ['Lógica', 'Matemática', 'EPS', 'Secuencias', 'Pensamiento'],
    datasets: [
      {
        label: 'Promedio Institucional',
        data: [85, 70, 90, 65, 80],
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: '#007BFF',
        borderWidth: 2,
      },
    ],
  };

  // Calcular promedio de dificultad percibida
  const avgDifficulty = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
    : '0';

  // Calcular promedio de dificultad por tema
  const topicStats = feedbacks.reduce((acc: any, f) => {
    if (!acc[f.topic]) {
      acc[f.topic] = { total: 0, count: 0 };
    }
    acc[f.topic].total += f.rating;
    acc[f.topic].count += 1;
    return acc;
  }, {});

  const sortedTopics = Object.keys(topicStats)
    .map(topic => ({
      topic,
      avg: (topicStats[topic].total / topicStats[topic].count).toFixed(1),
      count: topicStats[topic].count
    }))
    .sort((a, b) => Number(b.avg) - Number(a.avg));

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-oxford">Estadísticas Detalladas</h1>
            <p className="text-gray-500">Análisis de rendimiento y progreso de estudiantes</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-oxford text-white rounded-xl font-black hover:bg-black transition-all shadow-lg shadow-oxford/20">
          <Download size={18} /> Exportar Reporte PDF
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Promedio General', value: '8.4', icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Tasa de Éxito', value: '92%', icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Contenido IA', value: aiContents.length.toString(), icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Feedback Recibido', value: feedbacks.length.toString(), icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-oxford">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-tech-blue" size={20} /> Actividad Semanal
          </h3>
          <div className="h-[300px]">
            <Line 
              data={lineData} 
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
            <Star className="text-tech-orange" size={20} /> Dificultad Percibida (IA)
          </h3>
          <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
            <div className="text-6xl font-black text-oxford">{avgDifficulty}</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={32} 
                  fill={star <= Number(avgDifficulty) ? '#FF8C00' : 'none'} 
                  className={star <= Number(avgDifficulty) ? 'text-tech-orange' : 'text-gray-200'}
                />
              ))}
            </div>
            <p className="text-gray-500 text-sm italic">Promedio basado en {feedbacks.length} evaluaciones</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Target className="text-red-500" size={20} /> Temas con Mayor Dificultad
          </h3>
          <div className="space-y-4">
            {sortedTopics.length === 0 ? (
              <div className="text-center py-12 text-gray-400 italic">
                No hay datos de dificultad por tema aún
              </div>
            ) : (
              sortedTopics.slice(0, 4).map((item, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-oxford">{item.topic}</span>
                      <span className="text-xs text-gray-400">({item.count} feedbacks)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-red-600">{item.avg}</span>
                      <Star size={14} fill="#EF4444" className="text-red-600" />
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(Number(item.avg) / 5) * 100}%` }}
                      className="h-full bg-red-500"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Users className="text-tech-blue" size={20} /> Distribución por Especialidad
          </h3>
          <div className="space-y-4">
            {[
              { specialty: 'Software', avg: 9.2, progress: 85, students: 42 },
              { specialty: 'ITSI', avg: 8.5, progress: 78, students: 38 },
              { specialty: 'Automotriz', avg: 7.8, progress: 65, students: 24 },
              { specialty: 'Industrial', avg: 8.1, progress: 72, students: 20 },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-oxford">{item.specialty}</span>
                    <span className="text-xs text-gray-400">({item.students} estudiantes)</span>
                  </div>
                  <span className="font-black text-tech-blue">Promedio: {item.avg}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    className="h-full bg-tech-blue"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <MessageSquare className="text-purple-600" size={20} /> Último Feedback de IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 italic">
              No hay feedback registrado aún
            </div>
          ) : (
            feedbacks.slice(-6).reverse().map((f) => (
              <div key={f.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-tech-blue">
                      {f.topic}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Nivel {f.level}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {new Date(f.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} fill={s <= f.rating ? '#FF8C00' : 'none'} className={s <= f.rating ? 'text-tech-orange' : 'text-gray-200'} />
                  ))}
                </div>
                {f.comment && <p className="text-xs text-gray-600 italic line-clamp-2">"{f.comment}"</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
