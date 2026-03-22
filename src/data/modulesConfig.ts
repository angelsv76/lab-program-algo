import { ModuleDefinition } from '../types';

export const INITIAL_MODULES: ModuleDefinition[] = [
  {
    id: 'eps',
    title: 'Entrada – Proceso – Salida',
    description: 'Toda computadora hace lo mismo: recibe datos, los transforma y entrega un resultado. Acá aprendés cómo.',
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
    description: 'Las computadoras no adivinan. Necesitan instrucciones exactas, en orden. Aquí practicás eso.',
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
    description: 'Un paso fuera de lugar y el programa falla. Practicá el orden correcto de las instrucciones.',
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
    description: 'Suma, resta, multiplica, dividí. Los algoritmos hacen cálculos todo el tiempo — acá aprendés cómo.',
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
    description: '¿Es mayor? ¿Es igual? ¿Cuál es más pequeño? Con estos operadores tu algoritmo toma decisiones.',
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
    description: 'A veces una condición no es suficiente. AND, OR y NOT te permiten combinarlas para decisiones más complejas.',
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
