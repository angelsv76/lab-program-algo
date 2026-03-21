
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Keyboard, Send } from 'lucide-react';

interface InputRequestProps {
  variable: string;
  message?: string | null;
  onSave: (value: string) => void;
}

export const InputRequest: React.FC<InputRequestProps> = ({ variable, message, onSave }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() !== '') {
      onSave(value);
      setValue('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-tech-blue/10 border border-tech-blue/20 rounded-2xl space-y-4"
    >
      <div className="flex items-center gap-2 text-tech-blue">
        <Keyboard size={20} />
        <h4 className="font-black text-sm uppercase tracking-widest">Entrada Requerida</h4>
      </div>
      <div className="space-y-1">
        {message && (
          <p className="text-sm font-bold text-oxford">
            {message}
          </p>
        )}
        <p className="text-xs text-gray-500">
          Ingrese un valor para la variable <span className="font-mono font-bold text-tech-blue">{variable}</span>:
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          autoFocus
          type="text" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-tech-blue font-mono text-tech-blue font-bold"
          placeholder="Ej: 500"
        />
        <button 
          type="submit"
          className="bg-tech-blue text-white p-3 rounded-xl hover:bg-oxford transition-all shadow-lg shadow-tech-blue/20"
        >
          <Send size={20} />
        </button>
      </form>
    </motion.div>
  );
};
