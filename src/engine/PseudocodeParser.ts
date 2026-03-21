
import { Instruction, InstructionType } from '../types/simulation';

export class PseudocodeParser {
  static parse(code: string): Instruction[] {
    const lines = code.split('\n').filter(l => l.trim() !== '');
    const instructions: Instruction[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      // Intentar extraer número de línea si existe (ej: "1 Inicio" o "1. Inicio")
      const match = trimmed.match(/^(\d+)[.\s]+(.*)$/);
      
      let lineNum: number;
      let content: string;

      if (match) {
        lineNum = parseInt(match[1]);
        content = match[2].trim();
      } else {
        lineNum = index + 1;
        content = trimmed;
      }

      instructions.push(this.parseInstruction(lineNum, content));
    });

    // Post-procesamiento para enlazar saltos (IFs, WHILEs, FORs)
    this.linkBlocks(instructions);

    return instructions;
  }

  private static parseInstruction(line: number, content: string): Instruction {
    const lowerContent = content.toLowerCase();

    if (lowerContent.startsWith('inicio')) return { line, type: 'START', raw: content };
    if (lowerContent.startsWith('fin') && !lowerContent.startsWith('finsi') && !lowerContent.startsWith('finmientras') && !lowerContent.startsWith('finpara')) {
      return { line, type: 'END', raw: content };
    }

    // Leer("mensaje", variable)
    const readMatch = content.match(/Leer\s*\(\s*"([^"]*)"\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\)/i);
    if (readMatch) {
      return { 
        line, 
        type: 'READ', 
        raw: content, 
        payload: { message: readMatch[1], variable: readMatch[2] } 
      };
    }

    // Calcular(Fórmula: variable = expresión)
    const calcMatch = content.match(/Calcular\s*\(\s*Fórmula:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)\s*\)/i);
    if (calcMatch) {
      let expr = calcMatch[2].trim();
      if (expr.endsWith(')')) expr = expr.slice(0, -1).trim();
      return { 
        line, 
        type: 'CALCULATE', 
        raw: content, 
        payload: { variable: calcMatch[1], expression: expr } 
      };
    }

    // Imprimir("mensaje", variable) o Imprimir("mensaje")
    const printMatch = content.match(/Imprimir\s*\(\s*"([^"]*)"\s*(?:,\s*([a-zA-Z_][a-zA-Z0-9_]*))?\s*\)/i);
    if (printMatch) {
      return { 
        line, 
        type: 'PRINT', 
        raw: content, 
        payload: { message: printMatch[1], variable: printMatch[2] } 
      };
    }

    // Estructuras de Control
    if (content.startsWith('Si')) {
      const cond = content.match(/Si\s*\((.*)\)\s*Entonces/i);
      return { line, type: 'IF', raw: content, payload: { condition: cond ? cond[1] : 'false' } };
    }
    if (content.toLowerCase() === 'sino') return { line, type: 'ELSE', raw: content };
    if (content.toLowerCase() === 'finsi') return { line, type: 'END_IF', raw: content };

    if (content.startsWith('Mientras')) {
      const cond = content.match(/Mientras\s*\((.*)\)\s*Hacer/i);
      return { line, type: 'WHILE', raw: content, payload: { condition: cond ? cond[1] : 'false' } };
    }
    if (content.toLowerCase() === 'finmientras') return { line, type: 'END_WHILE', raw: content };

    if (content.startsWith('Para')) {
      // Para (i = 1; i <= 10; i++) Hacer
      const forMatch = content.match(/Para\s*\(\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^;]*);\s*([^;]*);\s*([^)]*)\s*\)\s*Hacer/i);
      if (forMatch) {
        return { 
          line, 
          type: 'FOR', 
          raw: content, 
          payload: { 
            variable: forMatch[1], 
            startExpr: forMatch[2], 
            condition: forMatch[3], 
            stepExpr: forMatch[4] 
          } 
        };
      }
    }
    if (content.toLowerCase() === 'finpara') return { line, type: 'END_FOR', raw: content };

    return { line, type: 'UNKNOWN', raw: content };
  }

  private static linkBlocks(instructions: Instruction[]) {
    const stack: { type: string, index: number }[] = [];

    instructions.forEach((inst, index) => {
      if (inst.type === 'IF' || inst.type === 'WHILE' || inst.type === 'FOR') {
        stack.push({ type: inst.type, index });
      } else if (inst.type === 'ELSE') {
        const top = stack[stack.length - 1];
        if (top && top.type === 'IF') {
          inst.payload = { jumpTo: -1, ifIndex: top.index };
          instructions[top.index].payload.elseIndex = index;
        }
      } else if (inst.type === 'END_IF') {
        const top = stack.pop();
        if (top && top.type === 'IF') {
          inst.payload = { ifIndex: top.index };
          instructions[top.index].payload.endIfIndex = index;
          // Si había un ELSE, también apuntarlo al final
          if (instructions[top.index].payload.elseIndex !== undefined) {
            instructions[instructions[top.index].payload.elseIndex].payload.jumpTo = index;
          }
        }
      } else if (inst.type === 'END_WHILE') {
        const top = stack.pop();
        if (top && top.type === 'WHILE') {
          inst.payload = { jumpTo: top.index };
          instructions[top.index].payload.endWhileIndex = index;
        }
      } else if (inst.type === 'END_FOR') {
        const top = stack.pop();
        if (top && top.type === 'FOR') {
          inst.payload = { jumpTo: top.index };
          instructions[top.index].payload.endForIndex = index;
        }
      }
    });
  }
}
