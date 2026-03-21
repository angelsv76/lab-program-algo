export type Specialty = 'ITSI' | 'Software' | 'Automotriz' | 'Industrial' | 'General';

export interface ExerciseTemplate {
  id: string;
  module: string;
  specialty: Specialty;
  difficulty: 1 | 2 | 3 | 4 | 5;
  template: string;
  formula?: string; // Fórmula para calcular la respuesta automáticamente
  variables: {
    [key: string]: { min: number; max: number; step?: number };
  };
  hints: string[];
  type: 'eps' | 'sequence' | 'math' | 'logic' | 'algorithm';
}

export const exerciseTemplates: ExerciseTemplate[] = [
  // ITSI
  {
    id: 'itsi-storage-1',
    module: 'math-ops',
    specialty: 'ITSI',
    difficulty: 1,
    template: 'Una memoria USB tiene {gb1} GB y otra tiene {gb2} GB. ¿Cuál es la capacidad total en GB?',
    formula: 'gb1 + gb2',
    variables: {
      gb1: { min: 4, max: 64 },
      gb2: { min: 4, max: 64 }
    },
    hints: [
      'Debes sumar ambas capacidades.',
      'La operación es gb1 + gb2.',
      'Suma los dos valores numéricos.'
    ],
    type: 'math'
  },
  {
    id: 'itsi-bandwidth-1',
    module: 'math-ops',
    specialty: 'ITSI',
    difficulty: 3,
    template: 'Una conexión descarga a {mbps} Mbps. ¿Cuántos MB se descargarán en {seg} segundos? (Recuerda: 8 bits = 1 byte)',
    formula: '(mbps * seg) / 8',
    variables: {
      mbps: { min: 10, max: 100 },
      seg: { min: 10, max: 60 }
    },
    hints: [
      'Primero calcula el total de bits (Mbps * segundos).',
      'Luego divide entre 8 para obtener Bytes.'
    ],
    type: 'math'
  },
  // Automotriz
  {
    id: 'auto-fuel-1',
    module: 'math-ops',
    specialty: 'Automotriz',
    difficulty: 2,
    template: 'Un motor consume {litros} litros por hora. Si el tanque tiene {total} litros, ¿cuántas horas puede funcionar?',
    formula: 'total / litros',
    variables: {
      litros: { min: 2, max: 10 },
      total: { min: 20, max: 100 }
    },
    hints: [
      'Es una división.',
      'Divide el total entre el consumo por hora.',
      'Operación: total / litros.'
    ],
    type: 'math'
  },
  {
    id: 'auto-torque-1',
    module: 'math-ops',
    specialty: 'Automotriz',
    difficulty: 4,
    template: 'Calcula la potencia (HP) si el torque es {torque} lb-ft y las RPM son {rpm}. Fórmula: (Torque * RPM) / 5252',
    formula: '(torque * rpm) / 5252',
    variables: {
      torque: { min: 100, max: 400 },
      rpm: { min: 2000, max: 6000 }
    },
    hints: [
      'Multiplica el torque por las RPM.',
      'Divide el resultado entre la constante 5252.'
    ],
    type: 'math'
  },
  // Software
  {
    id: 'soft-complexity-1',
    module: 'math-ops',
    specialty: 'Software',
    difficulty: 3,
    template: 'Si un algoritmo tiene una complejidad de O(n^2) y n = {n}, ¿cuántas operaciones aproximadas realizará?',
    formula: 'n ^ 2',
    variables: {
      n: { min: 10, max: 50 }
    },
    hints: [
      'Eleva el valor de n al cuadrado.',
      'Operación: n * n o n ^ 2.'
    ],
    type: 'math'
  },
  // Industrial
  {
    id: 'ind-prod-1',
    module: 'math-ops',
    specialty: 'Industrial',
    difficulty: 2,
    template: 'Una máquina produce {unidades} unidades por hora. ¿Cuántas unidades producirá en un turno de {horas} horas si se pierde un {descanso}% de tiempo en mantenimiento?',
    formula: 'unidades * horas * (1 - descanso / 100)',
    variables: {
      unidades: { min: 50, max: 200 },
      horas: { min: 8, max: 12 },
      descanso: { min: 5, max: 15 }
    },
    hints: [
      'Calcula la producción total teórica.',
      'Resta el porcentaje de tiempo perdido.'
    ],
    type: 'math'
  },
  // EPS General
  {
    id: 'eps-general-1',
    module: 'eps',
    specialty: 'General',
    difficulty: 1,
    template: 'Algoritmo para calcular el área de un círculo. Radio = {radio}.',
    formula: '3.1416 * radio * radio',
    variables: {
      radio: { min: 1, max: 20 }
    },
    hints: [
      'La entrada es el radio.',
      'El proceso es PI * radio * radio.',
      'La salida es el área.'
    ],
    type: 'eps'
  },
  // Operadores Relacionales
  {
    id: 'relational-1',
    module: 'relational-ops',
    specialty: 'General',
    difficulty: 1,
    template: '¿Cuál es el resultado de la expresión: {a} > {b}?',
    formula: 'a > b',
    variables: {
      a: { min: 1, max: 100 },
      b: { min: 1, max: 100 }
    },
    hints: [
      'Compara si el primer número es mayor que el segundo.',
      'El resultado debe ser Verdadero o Falso.'
    ],
    type: 'logic'
  },
  {
    id: 'relational-2',
    module: 'relational-ops',
    specialty: 'General',
    difficulty: 2,
    template: '¿Cuál es el resultado de la expresión: {a} <= {b}?',
    formula: 'a <= b',
    variables: {
      a: { min: 1, max: 50 },
      b: { min: 1, max: 50 }
    },
    hints: [
      'Compara si el primer número es menor o igual al segundo.',
      'El resultado debe ser Verdadero o Falso.'
    ],
    type: 'logic'
  },
  // Operadores Lógicos
  {
    id: 'logic-1',
    module: 'logic-ops',
    specialty: 'General',
    difficulty: 2,
    template: 'Si A = {a} y B = {b}, ¿cuál es el resultado de (A > 10) Y (B < 20)?',
    formula: '(a > 10) && (b < 20)',
    variables: {
      a: { min: 5, max: 15 },
      b: { min: 15, max: 25 }
    },
    hints: [
      'Evalúa primero cada comparación.',
      'El operador Y requiere que ambas condiciones sean verdaderas.'
    ],
    type: 'logic'
  },
  {
    id: 'logic-2',
    module: 'logic-ops',
    specialty: 'General',
    difficulty: 3,
    template: 'Si A = {a}, ¿cuál es el resultado de NO (A == 10)?',
    formula: '!(a == 10)',
    variables: {
      a: { min: 8, max: 12 }
    },
    hints: [
      'Evalúa la comparación dentro del paréntesis.',
      'El operador NO invierte el resultado lógico.'
    ],
    type: 'logic'
  },
  // Prioridad de Operadores
  {
    id: 'priority-1',
    module: 'operator-priority',
    specialty: 'General',
    difficulty: 2,
    template: '¿Cuál es el resultado de: {a} + {b} * {c}?',
    formula: 'a + b * c',
    variables: {
      a: { min: 2, max: 10 },
      b: { min: 2, max: 10 },
      c: { min: 2, max: 10 }
    },
    hints: [
      'Recuerda la jerarquía de operadores.',
      'La multiplicación se realiza antes que la suma.'
    ],
    type: 'math'
  },
  {
    id: 'priority-2',
    module: 'operator-priority',
    specialty: 'General',
    difficulty: 3,
    template: '¿Cuál es el resultado de: ({a} + {b}) * {c} / 2?',
    formula: '(a + b) * c / 2',
    variables: {
      a: { min: 2, max: 10 },
      b: { min: 2, max: 10 },
      c: { min: 2, max: 10 }
    },
    hints: [
      'Los paréntesis tienen la mayor prioridad.',
      'Luego realiza la multiplicación y división de izquierda a derecha.'
    ],
    type: 'math'
  },
  {
    id: 'priority-3',
    module: 'operator-priority',
    specialty: 'General',
    difficulty: 4,
    template: '¿Cuál es el resultado de: {a} * {b} + {c} / 2 - {d}?',
    formula: 'a * b + c / 2 - d',
    variables: {
      a: { min: 2, max: 5 },
      b: { min: 2, max: 5 },
      c: { min: 10, max: 20 },
      d: { min: 1, max: 5 }
    },
    hints: [
      'Multiplicación y división tienen la misma prioridad, se resuelven de izquierda a derecha.',
      'Suma y resta se resuelven al final, también de izquierda a derecha.'
    ],
    type: 'math'
  },
  {
    id: 'priority-complex-1',
    module: 'operator-priority',
    specialty: 'General',
    difficulty: 5,
    template: 'Evalúa la expresión siguiendo la jerarquía Pa-Po-Pro-Su: {a} + {b} * ({c} ^ 2) - {d} / 2',
    formula: 'a + b * (c ^ 2) - d / 2',
    variables: {
      a: { min: 1, max: 10 },
      b: { min: 2, max: 5 },
      c: { min: 2, max: 3 },
      d: { min: 2, max: 10 }
    },
    hints: [
      '1. Paréntesis y Potencias primero.',
      '2. Multiplicación y División después.',
      '3. Sumas y Restas al final.'
    ],
    type: 'math'
  },
  // Estructuras Algorítmicas
  {
    id: 'struct-if-1',
    module: 'algorithmic-structures',
    specialty: 'General',
    difficulty: 2,
    template: 'Si X = {x}, ¿qué valor imprimirá el algoritmo? \nSi X > 10 Entonces \n  Imprimir X + 5 \nSino \n  Imprimir X - 5 \nFinSi',
    variables: {
      x: { min: 5, max: 15 }
    },
    hints: [
      'Evalúa la condición X > 10.',
      'Sigue el camino del Entonces si es verdadero, o del Sino si es falso.'
    ],
    type: 'algorithm'
  },
  {
    id: 'struct-if-2',
    module: 'algorithmic-structures',
    specialty: 'General',
    difficulty: 3,
    template: 'Si Edad = {edad}, ¿qué mensaje se imprimirá? \nSi Edad >= 18 Entonces \n  Imprimir "Mayor" \nSino \n  Imprimir "Menor" \nFinSi',
    variables: {
      edad: { min: 15, max: 21 }
    },
    hints: [
      'Compara la edad con 18.',
      'Si es 18 o más, es Mayor.'
    ],
    type: 'algorithm'
  },
  {
    id: 'struct-while-1',
    module: 'algorithmic-structures',
    specialty: 'General',
    difficulty: 4,
    template: '¿Cuántas veces se ejecutará el ciclo? \nI = 1 \nMientras I <= {n} Hacer \n  I = I + 1 \nFinMientras',
    variables: {
      n: { min: 3, max: 7 }
    },
    hints: [
      'Observa el valor inicial de I.',
      'Cuenta cuántas veces I cumple la condición antes de incrementarse.'
    ],
    type: 'algorithm'
  }
];
