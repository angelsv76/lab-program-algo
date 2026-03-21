export interface AccessCode {
  id: string;
  codigo: string;
  activo: boolean;
  fecha_creacion: string;
  creado_por: string;
}

export interface Student {
  id: string;
  nombre_completo: string;
  nie: string;
  codigo_grupo: string;
  fecha_registro: string;
  ultimo_acceso: string;
}

export interface AIContent {
  id: string;
  tema: string;
  nivel: number;
  explicacion: string;
  ejemplo: string;
  algoritmo: string;
  solucion: string;
  ejercicio: string;
  pista?: string;
  errores_comunes: string;
  dificultad: 'muy facil' | 'adecuado' | 'dificil' | string;
  estado: 'activo' | 'oculto' | 'en revision' | 'eliminado';
  fecha_generacion: string;
  especialidad: string;
}

export interface ExerciseFeedback {
  id: string;
  contentId: string;
  studentId: string;
  rating: number;
  comment?: string;
  topic: string;
  level: number;
  timestamp: string;
}

export interface ModuleProgress {
  moduleId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'available';
  score?: number;
  attempts?: number;
  completedAt?: string;
}

export interface StudentProgress {
  completedModules: string[];
  exercisesDone: number;
  errorsCount: number;
  totalTimeMinutes: number;
  lastActivity: string;
}

export interface ModuleDefinition {
  id: string;
  title: string;
  description: string;
  route: string;
  isActive: boolean;
  permanent: boolean;
  visible: boolean;
  order: number;
  category: string;
}

export interface AppSettings {
  hintsEnabled: boolean;
  finalEvaluationEnabled: boolean;
  moduleOrder: string[];
  firstModuleId: string;
  lockedUntilPrevious: boolean;
  modules: ModuleDefinition[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: 'algorithm' | 'python' | 'simulation' | 'identify-eps' | 'order-steps' | 'complete-algorithm' | 'detect-errors' | 'desk-test';
  solution: string;
  steps?: string[];
  createdAt: string;
  module?: string;
  specialty?: string;
  data?: any;
}
