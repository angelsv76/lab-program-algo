import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, StudentProgress, AppSettings, Exercise, AccessCode, AIContent, ExerciseFeedback } from '../types';
import { storageService } from '../services/storageService';
import { DEFAULT_SETTINGS } from '../data/modulesConfig';
import { aiPedagogicalService } from '../services/aiPedagogicalService';

interface StudentContextType {
  student: Student | null;
  students: Student[];
  progress: StudentProgress;
  settings: AppSettings;
  exerciseBank: Exercise[];
  accessCodes: AccessCode[];
  aiContents: AIContent[];
  feedbacks: ExerciseFeedback[];
  registerStudent: (student: Student) => void;
  updateProgress: (updates: Partial<StudentProgress>) => void;
  completeModule: (moduleId: string) => void;
  updateSettings: (newSettings: AppSettings) => void;
  toggleModule: (moduleId: string) => void;
  addToExerciseBank: (exercise: Exercise) => void;
  addAccessCode: (code: string) => void;
  toggleAccessCode: (id: string) => void;
  deleteAccessCode: (id: string) => void;
  validateAccessCode: (code: string) => boolean;
  getAIContent: (tema: string, nivel: number, especialidad: string) => Promise<AIContent>;
  saveFeedback: (feedback: Omit<ExerciseFeedback, 'id' | 'timestamp'>) => void;
  updateAIContent: (id: string, updates: Partial<AIContent>) => void;
  deleteAIContent: (id: string) => void;
  logout: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student | null>(storageService.getStudent());
  const [students, setStudents] = useState<Student[]>(storageService.get('inti_students_list') || []);
  const [progress, setProgress] = useState<StudentProgress>(storageService.getProgress());
  const [settings, setSettings] = useState<AppSettings>(storageService.getSettings() || DEFAULT_SETTINGS);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>(storageService.get('access_codes') || [
    { id: '1', codigo: 'MA1B', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '2', codigo: 'ITSI1A', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '3', codigo: 'MA1A', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '4', codigo: 'MA1E', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '5', codigo: 'MA1F', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '6', codigo: 'DS1A', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '7', codigo: 'DS1D', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '8', codigo: 'MA1G', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '9', codigo: 'MA1H', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '10', codigo: 'MI1A', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '11', codigo: 'MI1B', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '12', codigo: 'ITSI2A', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
    { id: '13', codigo: 'ITSI3A', activo: true, fecha_creacion: new Date().toISOString(), creado_por: 'Sistema' },
  ]);
  const [exerciseBank, setExerciseBank] = useState<Exercise[]>(() => {
    const saved = storageService.get('exercise_bank') || [
      {
        id: 'ex-1',
        title: 'Suma de dos números',
        description: 'Crea un algoritmo que pida dos números y muestre su suma.',
        difficulty: 1,
        type: 'algorithm',
        solution: 'Inicio\n  a = 5\n  b = 10\n  suma = a + b\n  Escribir "La suma es "\n  Escribir suma\nFin',
        createdAt: new Date().toISOString(),
        module: 'math-ops',
        specialty: 'General'
      },
      {
        id: 'ex-2',
        title: 'Cálculo de Área de Círculo',
        description: 'Calcula el área de un círculo dado su radio.',
        difficulty: 2,
        type: 'algorithm',
        solution: 'Inicio\n  radio = 7\n  pi = 3.1416\n  area = pi * radio * radio\n  Escribir "El área es "\n  Escribir area\nFin',
        createdAt: new Date().toISOString(),
        module: 'math-ops',
        specialty: 'Industrial'
      }
    ];
    // Limpiar duplicados por ID
    const unique = Array.from(new Map(saved.map((item: any) => [item.id, item])).values());
    return unique as Exercise[];
  });
  const [aiContents, setAiContents] = useState<AIContent[]>(() => {
    const saved = storageService.get('inti_ai_content') || [];
    // Normalizar datos existentes para evitar errores de ReactMarkdown
    return saved.map((c: any) => ({
      ...c,
      explicacion: Array.isArray(c.explicacion) ? c.explicacion.join('\n\n') : String(c.explicacion || ''),
      ejemplo: Array.isArray(c.ejemplo) ? c.ejemplo.join('\n\n') : String(c.ejemplo || ''),
      algoritmo: Array.isArray(c.algoritmo) ? c.algoritmo.join('\n\n') : String(c.algoritmo || ''),
      solucion: Array.isArray(c.solucion) ? c.solucion.join('\n\n') : String(c.solucion || ''),
      ejercicio: Array.isArray(c.ejercicio) ? c.ejercicio.join('\n\n') : String(c.ejercicio || ''),
      pista: Array.isArray(c.pista) ? c.pista.join('\n\n') : String(c.pista || ''),
      errores_comunes: Array.isArray(c.errores_comunes) ? c.errores_comunes.join('\n\n') : String(c.errores_comunes || '')
    }));
  });
  const [feedbacks, setFeedbacks] = useState<ExerciseFeedback[]>(storageService.get('inti_feedback') || []);

  useEffect(() => {
    if (!storageService.getSettings()) {
      storageService.saveSettings(DEFAULT_SETTINGS);
    }
    // Cargar lista de estudiantes para administración
    if (students.length === 0) {
      const initialStudents = [
        { id: '1', nombre_completo: 'Juan Pérez', nie: '2024001', codigo_grupo: 'MA1B', fecha_registro: '2024-03-01', ultimo_acceso: '2024-03-01' },
        { id: '2', nombre_completo: 'María García', nie: '2024002', codigo_grupo: 'ITSI1A', fecha_registro: '2024-03-02', ultimo_acceso: '2024-03-02' },
        { id: '3', nombre_completo: 'Carlos López', nie: '2024003', codigo_grupo: 'MA1A', fecha_registro: '2024-03-05', ultimo_acceso: '2024-03-05' },
      ];
      setStudents(initialStudents);
      storageService.save('inti_students_list', initialStudents);
    }
  }, []);

  const registerStudent = (newStudent: Student) => {
    // Verificar si el estudiante ya existe por NIE
    const existingStudent = students.find(s => s.nie === newStudent.nie);
    
    if (existingStudent) {
      // Si existe, actualizamos sus datos (por si cambió el nombre o grupo)
      const updatedStudent = { ...existingStudent, ...newStudent, id: existingStudent.id, ultimo_acceso: new Date().toISOString() };
      const updatedList = students.map(s => s.id === existingStudent.id ? updatedStudent : s);
      
      storageService.save('inti_students_list', updatedList);
      setStudents(updatedList);
      storageService.saveStudent(updatedStudent);
      setStudent(updatedStudent);
    } else {
      // Si no existe, lo agregamos
      const studentWithAccess = { ...newStudent, ultimo_acceso: new Date().toISOString() };
      const updatedList = [...students, studentWithAccess];
      storageService.save('inti_students_list', updatedList);
      setStudents(updatedList);
      storageService.saveStudent(studentWithAccess);
      setStudent(studentWithAccess);
    }
  };

  const updateProgress = (updates: Partial<StudentProgress>) => {
    const newProgress = { ...progress, ...updates, lastActivity: new Date().toISOString() };
    storageService.saveProgress(newProgress);
    setProgress(newProgress);
  };

  const completeModule = (moduleId: string) => {
    if (!progress.completedModules.includes(moduleId)) {
      updateProgress({
        completedModules: [...progress.completedModules, moduleId],
        exercisesDone: progress.exercisesDone + 1
      });
    }
  };

  const updateSettings = (newSettings: AppSettings) => {
    storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const toggleModule = (moduleId: string) => {
    const newModules = settings.modules.map(m => 
      m.id === moduleId ? { ...m, isActive: !m.isActive } : m
    );
    updateSettings({ ...settings, modules: newModules });
  };

  const addToExerciseBank = (exercise: Exercise) => {
    // Evitar duplicados por ID
    if (exerciseBank.some(ex => ex.id === exercise.id)) {
      return;
    }
    const newBank = [...exerciseBank, exercise];
    storageService.save('exercise_bank', newBank);
    setExerciseBank(newBank);
  };

  const addAccessCode = (codigo: string) => {
    const newCode: AccessCode = {
      id: Date.now().toString(),
      codigo: codigo.toUpperCase(),
      activo: true,
      fecha_creacion: new Date().toISOString(),
      creado_por: 'Docente'
    };
    const newCodes = [...accessCodes, newCode];
    storageService.save('access_codes', newCodes);
    setAccessCodes(newCodes);
  };

  const toggleAccessCode = (id: string) => {
    const newCodes = accessCodes.map(c => c.id === id ? { ...c, activo: !c.activo } : c);
    storageService.save('access_codes', newCodes);
    setAccessCodes(newCodes);
  };

  const deleteAccessCode = (id: string) => {
    const newCodes = accessCodes.filter(c => c.id !== id);
    storageService.save('access_codes', newCodes);
    setAccessCodes(newCodes);
  };

  const validateAccessCode = (code: string) => {
    return accessCodes.some(c => c.codigo === code.toUpperCase() && c.activo);
  };

  const getAIContent = async (tema: string, nivel: number, especialidad: string): Promise<AIContent> => {
    // Buscar en caché local
    const cached = aiContents.find(c => c.tema === tema && c.nivel === nivel && c.especialidad === especialidad && c.estado === 'activo');
    if (cached) return cached;

    // Generar nuevo
    const generated = await aiPedagogicalService.generateContent(tema, nivel, especialidad);
    
    // Normalizar campos para asegurar que sean strings (evitar errores de ReactMarkdown si la IA devuelve arrays)
    const normalizeString = (val: any): string => {
      if (Array.isArray(val)) return val.join('\n\n');
      if (typeof val === 'object' && val !== null) return JSON.stringify(val);
      return String(val || '');
    };

    const newContent: AIContent = {
      id: Date.now().toString(),
      tema,
      nivel,
      especialidad,
      estado: 'activo',
      fecha_generacion: new Date().toISOString(),
      explicacion: normalizeString(generated.explicacion),
      ejemplo: normalizeString(generated.ejemplo),
      algoritmo: normalizeString(generated.algoritmo),
      solucion: normalizeString(generated.solucion),
      ejercicio: normalizeString(generated.ejercicio),
      pista: normalizeString(generated.pista),
      errores_comunes: normalizeString(generated.errores_comunes),
      dificultad: normalizeString(generated.dificultad)
    };

    const updatedContents = [...aiContents, newContent];
    setAiContents(updatedContents);
    storageService.save('inti_ai_content', updatedContents);
    return newContent;
  };

  const saveFeedback = (feedback: Omit<ExerciseFeedback, 'id' | 'timestamp'>) => {
    const newFeedback: ExerciseFeedback = {
      id: Date.now().toString(),
      ...feedback,
      timestamp: new Date().toISOString()
    };
    const updatedFeedbacks = [...feedbacks, newFeedback];
    setFeedbacks(updatedFeedbacks);
    storageService.save('inti_feedback', updatedFeedbacks);
  };

  const updateAIContent = (id: string, updates: Partial<AIContent>) => {
    const updated = aiContents.map(c => c.id === id ? { ...c, ...updates } : c);
    setAiContents(updated);
    storageService.save('inti_ai_content', updated);
  };

  const deleteAIContent = (id: string) => {
    const updated = aiContents.filter(c => c.id !== id);
    setAiContents(updated);
    storageService.save('inti_ai_content', updated);
  };

  const logout = () => {
    storageService.clearStudent();
    setStudent(null);
    setProgress(storageService.getProgress());
  };

  return (
    <StudentContext.Provider value={{ 
      student, 
      students,
      progress, 
      settings, 
      exerciseBank,
      accessCodes,
      aiContents,
      feedbacks,
      registerStudent, 
      updateProgress, 
      completeModule,
      updateSettings,
      toggleModule,
      addToExerciseBank,
      addAccessCode,
      toggleAccessCode,
      deleteAccessCode,
      validateAccessCode,
      getAIContent,
      saveFeedback,
      updateAIContent,
      deleteAIContent,
      logout 
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudent must be used within a StudentProvider');
  return context;
};
