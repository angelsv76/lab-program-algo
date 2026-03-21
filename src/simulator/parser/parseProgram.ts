
import { ParseResult, Instruction } from './parserTypes';
import { parseInstruction } from './parseInstruction';

export const parseProgram = (code: string): ParseResult => {
  const lines = code.split('\n');
  const instructions: Instruction[] = [];
  const errors: string[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed === '') return;

    try {
      // Ignorar números de línea si el usuario los puso (ej: "1 Inicio")
      const cleanLine = trimmed.replace(/^\d+[.\s]+/, '');
      instructions.push(parseInstruction(cleanLine, index + 1));
    } catch (e: any) {
      errors.push(`Línea ${index + 1}: ${e.message}`);
    }
  });

  // Validaciones básicas
  if (instructions.length > 0) {
    if (instructions[0].type !== 'START') {
      errors.push('El algoritmo debe comenzar con "Inicio"');
    }
    if (instructions[instructions.length - 1].type !== 'END') {
      errors.push('El algoritmo debe terminar con "Fin"');
    }
  } else {
    errors.push('El algoritmo está vacío');
  }

  return { instructions, errors };
};
