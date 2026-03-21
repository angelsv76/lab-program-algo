import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { Users, Search, Filter, ArrowLeft, UserPlus, MoreVertical, Shield, GraduationCap, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AdminUsers: React.FC = () => {
  const { students } = useStudent();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.nie.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-oxford">Gestión de Usuarios</h1>
            <p className="text-gray-500">Administre el acceso y perfiles de los estudiantes</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-oxford text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-oxford-light text-xs font-black uppercase tracking-widest">Total Estudiantes</p>
              <h2 className="text-4xl font-black mt-2">{students.length}</h2>
            </div>
            <Users className="text-tech-blue" size={32} />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Administradores</p>
              <h2 className="text-4xl font-black mt-2 text-oxford">1</h2>
            </div>
            <Shield className="text-tech-orange" size={32} />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o NIE..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-tech-blue border border-transparent focus:border-tech-blue transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <tr>
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">NIE</th>
                <th className="px-6 py-4">Grupo</th>
                <th className="px-6 py-4">Registro</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-tech-blue flex items-center justify-center font-black">
                        {student.nombre_completo.charAt(0)}
                      </div>
                      <span className="font-bold text-oxford">{student.nombre_completo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{student.nie}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap size={14} className="text-tech-blue" />
                      <span className="font-bold text-sm">{student.codigo_grupo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      {new Date(student.fecha_registro).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-gray-400" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="p-20 text-center">
            <Users className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 italic">No se encontraron estudiantes con los criterios de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
};
