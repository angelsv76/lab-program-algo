import React from 'react';
import { motion } from 'framer-motion';
import { Shield, GraduationCap, Code, Heart, Mail, Globe } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-oxford rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
        >
          <Code size={48} className="text-tech-blue" />
        </motion.div>
        <h1 className="text-4xl font-black text-oxford">Acerca del Proyecto</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Una plataforma diseñada para transformar el aprendizaje de la programación en el Instituto Nacional Técnico Industrial.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="card p-8 space-y-4"
        >
          <div className="w-12 h-12 bg-blue-100 text-tech-blue rounded-xl flex items-center justify-center">
            <GraduationCap size={24} />
          </div>
          <h3 className="text-xl font-black text-oxford">Propósito Educativo</h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            Esta plataforma ha sido desarrollada como herramienta educativa para apoyar el aprendizaje de algoritmos, 
            pensamiento computacional y programación de los estudiantes de primer año de bachillerato técnico 
            del Instituto Nacional Técnico Industrial (INTI).
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="card p-8 space-y-4"
        >
          <div className="w-12 h-12 bg-orange-100 text-tech-orange rounded-xl flex items-center justify-center">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-black text-oxford">Autoría y Créditos</h3>
          <div className="space-y-2">
            <p className="text-sm font-black text-oxford">Autor:</p>
            <p className="text-sm text-gray-600">Ing. Ángel Sánchez</p>
            <p className="text-sm font-black text-oxford mt-4">Institución:</p>
            <p className="text-sm text-gray-600">Instituto Nacional Técnico Industrial (INTI)</p>
          </div>
        </motion.div>
      </div>

      <div className="card p-8 bg-oxford text-white relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <h3 className="text-2xl font-black">Nuestra Visión</h3>
          <p className="text-oxford-light leading-relaxed">
            Creemos que la programación no es solo escribir código, sino una forma de pensar y resolver problemas. 
            Nuestra meta es que cada estudiante del INTI desarrolle las habilidades lógicas necesarias para triunfar 
            en la era digital, utilizando la Inteligencia Artificial como un aliado pedagógico.
          </p>
          <div className="flex gap-6 pt-4">
            <div className="flex items-center gap-2 text-sm font-bold text-tech-blue">
              <Globe size={16} />
              inti.edu.sv
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-tech-orange">
              <Mail size={16} />
              angel.sanchez@inti.edu.sv
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-tech-blue/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
      </div>

      <footer className="text-center space-y-2 pt-8 border-t border-gray-100">
        <p className="text-sm font-black text-oxford">
          © {new Date().getFullYear()} Ángel Sánchez – Laboratorio de Programación INTI
        </p>
        <p className="text-xs text-gray-400">
          Todos los derechos reservados. Desarrollado con ❤️ para la comunidad educativa del INTI.
        </p>
      </footer>
    </div>
  );
};
