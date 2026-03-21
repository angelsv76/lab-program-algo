/**
 * Laboratorio de Programación INTI
 * © 2025 Angel Sanchez – Todos los derechos reservados
 *
 * Tutor IA con respuesta en streaming (el texto aparece progresivamente).
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Zap, Sparkles, User, Bot, Loader2, WifiOff } from 'lucide-react';
import { aiTutorService } from '../../engine/aiTutorService';
import { useStudent } from '../../context/StudentContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isStreaming?: boolean;
  error?: boolean;
}

export const AITutor: React.FC = () => {
  const { student } = useStudent();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `¡Hola ${student?.nombre_completo.split(' ')[0] || 'estudiante'}! Soy tu tutor IA del INTI. ¿En qué puedo ayudarte con tus algoritmos hoy?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Agrega mensaje vacío del AI que se va llenando con streaming
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [
      ...prev,
      { id: aiMsgId, text: '', sender: 'ai', timestamp: new Date(), isStreaming: true },
    ]);

    try {
      await aiTutorService.generateExplanationStreaming(
        currentInput,
        'básico',
        student?.codigo_grupo || 'General',
        (chunk) => {
          // Actualiza el mensaje en tiempo real con cada fragmento
          setMessages(prev =>
            prev.map(m =>
              m.id === aiMsgId ? { ...m, text: m.text + chunk } : m
            )
          );
          scrollToBottom();
        }
      );
      // Marca como terminado
      setMessages(prev =>
        prev.map(m => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))
      );
    } catch (error: any) {
      const isTimeout = error?.message === 'TIMEOUT';
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMsgId
            ? {
                ...m,
                text: isTimeout
                  ? 'La respuesta tardó demasiado. Intenta con una pregunta más corta.'
                  : 'No pude conectarme con el servidor. Verifica tu conexión e intenta de nuevo.',
                isStreaming: false,
                error: true,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón Flotante */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-tech-blue text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-white"
      >
        <Zap size={32} />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-tech-orange rounded-full flex items-center justify-center"
        >
          <Sparkles size={10} />
        </motion.div>
      </motion.button>

      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-28 right-8 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-oxford p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tech-blue rounded-xl flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-black text-sm">Tutor IA INTI</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-blue-200 uppercase font-black tracking-widest">En línea</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user' ? 'bg-tech-orange text-white' : 'bg-oxford text-white'
                    }`}>
                      {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-tech-blue text-white rounded-tr-none'
                        : msg.error
                        ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none'
                        : 'bg-white text-oxford shadow-sm border border-gray-100 rounded-tl-none'
                    }`}>
                      {msg.text || (msg.isStreaming && (
                        <span className="flex items-center gap-2 text-gray-400">
                          <Loader2 size={14} className="animate-spin" />
                          <span>Escribiendo...</span>
                        </span>
                      ))}
                      {/* Cursor parpadeante mientras llega el stream */}
                      {msg.isStreaming && msg.text && (
                        <span className="inline-block w-1 h-4 bg-tech-blue ml-0.5 animate-pulse rounded" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu duda aquí..."
                  disabled={isLoading}
                  className="flex-1 bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-tech-blue border border-transparent transition-all text-sm disabled:opacity-60"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-12 h-12 bg-tech-blue text-white rounded-2xl flex items-center justify-center hover:bg-oxford transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
