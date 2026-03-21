
import { Instruction } from './parserTypes';

export const parseInstruction = (lineText: string, lineNum: number): Instruction => {
  const trimmed = lineText.trim();
  const lower = trimmed.toLowerCase();

  if (lower === 'inicio') return { type: 'START', line: lineNum, raw: trimmed };
  if (lower === 'fin') return { type: 'END', line: lineNum, raw: trimmed };

  // Leer("mensaje", variable)
  const readMatch = trimmed.match(/Leer\s*\(\s*"([^"]*)"\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)/i);
  if (readMatch) {
    return { 
      type: 'READ', 
      line: lineNum, 
      raw: trimmed, 
      payload: { prompt: readMatch[1], variable: readMatch[2] } 
    };
  }

  // Imprimir("mensaje", variable) o Imprimir("mensaje")
  const printMatch = trimmed.match(/Imprimir\s*\(\s*"([^"]*)"\s*(?:,\s*([a-zA-Z_][a-zA-Z0-9_]*))?\s*\)/i);
  if (printMatch) {
    return { 
      type: 'PRINT', 
      line: lineNum, 
      raw: trimmed, 
      payload: { message: printMatch[1], variable: printMatch[2] } 
    };
  }

  // Calcular(Fórmula: variable = expresión)
  const calcMatch = trimmed.match(/Calcular\s*\(\s*Fórmula:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)\s*\)/i);
  if (calcMatch) {
    let expr = calcMatch[2].trim();
    if (expr.endsWith(')')) expr = expr.slice(0, -1).trim();
    return { 
      type: 'CALCULATE', 
      line: lineNum, 
      raw: trimmed, 
      payload: { target: calcMatch[1], expression: expr } 
    };
  }

  // Estructuras de control (básico para el parser)
  if (trimmed.startsWith('Si')) return { type: 'IF', line: lineNum, raw: trimmed };
  if (lower === 'sino') return { type: 'ELSE', line: lineNum, raw: trimmed };
  if (lower === 'finsi') return { type: 'END_IF', line: lineNum, raw: trimmed };
  if (trimmed.startsWith('Mientras')) return { type: 'WHILE', line: lineNum, raw: trimmed };
  if (lower === 'finmientras') return { type: 'END_WHILE', line: lineNum, raw: trimmed };
  if (trimmed.startsWith('Para')) return { type: 'FOR', line: lineNum, raw: trimmed };
  if (lower === 'finpara') return { type: 'END_FOR', line: lineNum, raw: trimmed };

  throw new Error(`Instrucción no reconocida: "${trimmed}"`);
};
