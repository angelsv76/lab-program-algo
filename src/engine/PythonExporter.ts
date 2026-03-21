
import { Instruction } from '../types/simulation';

export class PythonExporter {
  static toPython(instructions: Instruction[]): string {
    let pythonCode = "# Código generado por Laboratorio INTI\n";
    pythonCode += "# Modelo: Entrada -> Proceso -> Salida\n\n";

    let indentLevel = 0;
    const getIndent = () => "    ".repeat(indentLevel);

    instructions.forEach(inst => {
      switch (inst.type) {
        case 'START':
          pythonCode += "# --- Inicio del Algoritmo ---\n";
          break;
        case 'READ':
          pythonCode += `${getIndent()}${inst.payload.variable} = input("${inst.payload.message} ")\n`;
          pythonCode += `${getIndent()}try:\n`;
          pythonCode += `${getIndent()}    ${inst.payload.variable} = float(${inst.payload.variable})\n`;
          pythonCode += `${getIndent()}except ValueError:\n`;
          pythonCode += `${getIndent()}    pass\n`;
          break;
        case 'CALCULATE':
          // Reemplazar operadores lógicos
          let expr = inst.payload.expression
            .replace(/\bY\b/g, 'and')
            .replace(/\bO\b/g, 'or')
            .replace(/\bNO\b/g, 'not');
          pythonCode += `${getIndent()}${inst.payload.variable} = ${expr}\n`;
          break;
        case 'PRINT':
          if (inst.payload.variable) {
            pythonCode += `${getIndent()}print("${inst.payload.message}", ${inst.payload.variable})\n`;
          } else {
            pythonCode += `${getIndent()}print("${inst.payload.message}")\n`;
          }
          break;
        case 'IF':
          let ifCond = inst.payload.condition
            .replace(/\bY\b/g, 'and')
            .replace(/\bO\b/g, 'or')
            .replace(/\bNO\b/g, 'not');
          pythonCode += `${getIndent()}if ${ifCond}:\n`;
          indentLevel++;
          break;
        case 'ELSE':
          indentLevel--;
          pythonCode += `${getIndent()}else:\n`;
          indentLevel++;
          break;
        case 'END_IF':
          indentLevel--;
          break;
        case 'WHILE':
          let whileCond = inst.payload.condition
            .replace(/\bY\b/g, 'and')
            .replace(/\bO\b/g, 'or')
            .replace(/\bNO\b/g, 'not');
          pythonCode += `${getIndent()}while ${whileCond}:\n`;
          indentLevel++;
          break;
        case 'END_WHILE':
          indentLevel--;
          break;
        case 'FOR':
          // Para (i = 1; i <= 10; i++) Hacer
          // En Python: for i in range(1, 11):
          // Simplificamos para el caso más común
          const { variable, startExpr, condition } = inst.payload;
          const endVal = condition.split('<=')[1]?.trim() || condition.split('<')[1]?.trim();
          pythonCode += `${getIndent()}for ${variable} in range(${startExpr}, int(${endVal}) + 1):\n`;
          indentLevel++;
          break;
        case 'END_FOR':
          indentLevel--;
          break;
        case 'END':
          pythonCode += "\n# --- Fin del Algoritmo ---";
          break;
      }
    });

    return pythonCode;
  }
}
