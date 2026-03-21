import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Calendar,
  User,
  Search,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminAccessCodes: React.FC = () => {
  const navigate = useNavigate();
  const { accessCodes, addAccessCode, toggleAccessCode, deleteAccessCode } = useStudent();
  const [newCode, setNewCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCode.trim()) {
      addAccessCode(newCode.trim());
      setNewCode('');
    }
  };

  const filteredCodes = accessCodes.filter(c => 
    c.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-oxford">Gestión de Grupos</h1>
            <p className="text-gray-500">Administra los códigos de acceso para grupos institucionales (INTI)</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario para agregar */}
        <div className="card h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus size={20} className="text-tech-blue" />
            Nuevo Código
          </h2>
          <form onSubmit={handleAddCode} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Código del Grupo</label>
              <input 
                type="text" 
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Ej. MA1B"
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-tech-blue border border-transparent transition-all font-bold uppercase"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-4 bg-tech-blue text-white rounded-xl font-black shadow-lg hover:bg-oxford transition-all flex items-center justify-center gap-2"
            >
              Guardar Código
            </button>
          </form>
        </div>

        {/* Lista de códigos */}
        <div className="lg:col-span-2 card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap size={20} className="text-tech-orange" />
              Grupos Activos
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Buscar código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-tech-blue border border-transparent transition-all w-full md:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Código</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Creado</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCodes.map((code) => (
                  <motion.tr 
                    key={code.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4">
                      <span className="font-black text-oxford text-lg">{code.codigo}</span>
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => toggleAccessCode(code.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                          code.activo 
                            ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {code.activo ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {code.activo ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-600 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(code.fecha_creacion).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <User size={10} /> {code.creado_por}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <button 
                        onClick={() => {
                          deleteAccessCode(code.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar código"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {filteredCodes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-400 italic">
                      No se encontraron códigos que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
