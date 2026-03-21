
import React, { useState, useRef, useEffect } from 'react';
import { ConsoleMessage } from '../engine/engineTypes';
import { Terminal, ChevronRight } from 'lucide-react';

interface ConsolePanelProps {
  messages: ConsoleMessage[];
  onInput: (value: string) => void;
  isWaiting: boolean;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ messages, onInput, isWaiting }) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onInput(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
        <Terminal size={16} className="text-tech-blue" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Consola INTI</span>
      </div>
      
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${
            msg.type === 'system' ? 'text-gray-400 italic' :
            msg.type === 'error' ? 'text-red-600' :
            msg.type === 'input' ? 'text-tech-blue font-bold' : 'text-slate-700'
          }`}>
            <span className="opacity-30 select-none">
              {msg.type === 'input' ? '>' : msg.type === 'output' ? '•' : '#'}
            </span>
            <p className="break-words">{msg.text}</p>
          </div>
        ))}
      </div>

      {isWaiting && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
          <ChevronRight size={18} className="text-tech-blue animate-pulse" />
          <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe un valor y presiona Enter..."
            className="flex-1 bg-transparent border-none outline-none text-oxford placeholder:text-gray-400 font-mono text-sm"
          />
        </form>
      )}
    </div>
  );
};
