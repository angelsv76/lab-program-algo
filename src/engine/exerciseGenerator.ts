import { exerciseTemplates, ExerciseTemplate, Specialty } from '../data/exerciseTemplates';
import { ExpressionEvaluator } from './ExpressionEvaluator';

export interface GeneratedExercise {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: number;
  expectedAnswer: number | string;
  hints: string[];
  data: any;
}

export const exerciseGenerator = {
  generate: (moduleId: string, specialty: Specialty = 'General', difficulty: number = 1): GeneratedExercise | null => {
    // 1. Filtrar plantillas por módulo y especialidad
    let compatibleTemplates = exerciseTemplates.filter(t => 
      t.module === moduleId && 
      (t.specialty === specialty || t.specialty === 'General')
    );

    // 2. Filtrar por dificultad (intentar coincidencia exacta, si no, menor o igual)
    let difficultyTemplates = compatibleTemplates.filter(t => t.difficulty === difficulty);
    if (difficultyTemplates.length === 0) {
      difficultyTemplates = compatibleTemplates.filter(t => t.difficulty <= difficulty);
    }

    if (difficultyTemplates.length === 0) return null;

    // 3. Seleccionar una plantilla al azar de las filtradas
    const template = difficultyTemplates[Math.floor(Math.random() * difficultyTemplates.length)];
    
    // 4. Generar valores para las variables
    const vars: { [key: string]: number } = {};
    Object.keys(template.variables).forEach(key => {
      const config = template.variables[key];
      vars[key] = Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
    });

    // 5. Reemplazar variables en el template (descripción para el usuario)
    let description = template.template;
    Object.keys(vars).forEach(key => {
      description = description.replace(new RegExp(`\\{${key}\\}`, 'g'), vars[key].toString());
    });

    // 6. Calcular respuesta esperada usando ExpressionEvaluator si hay fórmula
    let expectedAnswer: any = 0;
    
    if (template.formula) {
      try {
        const result = ExpressionEvaluator.evaluate(template.formula, vars);
        
        if (typeof result === 'boolean') {
          expectedAnswer = result ? 'Verdadero' : 'Falso';
        } else if (typeof result === 'number') {
          // Redondear a 2 decimales si es necesario
          expectedAnswer = Number.isInteger(result) ? result : parseFloat(result.toFixed(2));
        } else {
          expectedAnswer = result;
        }
      } catch (error) {
        console.error('Error evaluando fórmula:', error);
        expectedAnswer = 'Error';
      }
    } else {
      // Fallback para lógica manual si no hay fórmula (mantenemos compatibilidad)
      if (template.id === 'struct-if-1') expectedAnswer = vars.x > 10 ? vars.x + 5 : vars.x - 5;
      if (template.id === 'struct-if-2') expectedAnswer = vars.edad >= 18 ? 'Mayor' : 'Menor';
      if (template.id === 'struct-while-1') expectedAnswer = vars.n;
    }

    return {
      id: `${template.id}-${Date.now()}`,
      title: `Ejercicio de ${template.module}`,
      description,
      type: template.type,
      difficulty: template.difficulty,
      expectedAnswer,
      hints: template.hints,
      data: { vars }
    };
  }
};
