import { ModuleDefinition } from '../types';

export const INITIAL_MODULES: ModuleDefinition[] = [
  {
    id: 'eps',
    title: 'Entrada – Proceso – Salida',
    description: 'Aprende el modelo fundamental de cómo las computadoras procesan información.',
    route: '/modulos/eps',
    isActive: true,
    permanent: true,
    visible: true,
    order: 1,
    category: 'fundamentos'
  },
  {
    id: 'thinking',
    title: 'Pensar como computadora',
    description: 'Entrena tu mente para descomponer problemas en pasos lógicos y precisos.',
    route: '/modulos/thinking',
    isActive: true,
    permanent: true,
    visible: true,
    order: 2,
    category: 'fundamentos'
  },
  {
    id: 'sequences',
    title: 'Secuencias de instrucciones',
    description: 'Domina el orden lógico necesario para que un programa funcione correctamente.',
    route: '/modulos/sequences',
    isActive: true,
    permanent: true,
    visible: true,
    order: 3,
    category: 'fundamentos'
  },
  {
    id: 'math-ops',
    title: 'Operadores matemáticos',
    description: 'Suma, resta, multiplica y divide datos dentro de tus algoritmos.',
    route: '/modulos/math-ops',
    isActive: true,
    permanent: true,
    visible: true,
    order: 4,
    category: 'fundamentos'
  },
  {
    id: 'relational-ops',
    title: 'Operadores relacionales',
    description: 'Compara valores para tomar decisiones lógicas (mayor que, menor que, igual).',
    route: '/modulos/relational-ops',
    isActive: true,
    permanent: true,
    visible: true,
    order: 5,
    category: 'fundamentos'
  },
  {
    id: 'logical-ops',
    title: 'Operadores lógicos',
    description: 'Combina condiciones usando AND, OR y NOT para lógica compleja.',
    route: '/modulos/logical-ops',
    isActive: true,
    permanent: true,
    visible: true,
    order: 6,
    category: 'fundamentos'
  }
];

export const DEFAULT_SETTINGS = {
  hintsEnabled: true,
  finalEvaluationEnabled: true,
  moduleOrder: INITIAL_MODULES.map(m => m.id),
  firstModuleId: 'eps',
  lockedUntilPrevious: true,
  modules: INITIAL_MODULES
};
