
import { SimulationState, Instruction, ConsoleLine } from '../types/simulation';
import { ExpressionEvaluator } from './ExpressionEvaluator';
import { PseudocodeParser } from './PseudocodeParser';

export class SimulationEngine {
  static init(code: string): SimulationState {
    const instructions = PseudocodeParser.parse(code);
    return {
      instructions,
      currentPointer: 0,
      memory: {},
      console: [{ type: 'system', text: 'Simulador listo. Presione "Ejecutar" para iniciar.', timestamp: Date.now() }],
      status: 'IDLE'
    };
  }

  static step(state: SimulationState): SimulationState {
    if (state.status === 'FINISHED' || state.status === 'ERROR' || state.currentPointer >= state.instructions.length) {
      return { ...state, status: 'FINISHED' };
    }

    const inst = state.instructions[state.currentPointer];
    const nextState = { ...state, console: [...state.console], memory: { ...state.memory } };

    try {
      switch (inst.type) {
        case 'START':
          nextState.memory = {};
          nextState.console.push({ type: 'system', text: '--- Inicio del Algoritmo ---', timestamp: Date.now() });
          nextState.currentPointer++;
          nextState.status = 'RUNNING';
          break;

        case 'READ':
          nextState.status = 'WAITING_INPUT';
          nextState.waitingFor = { variable: inst.payload.variable, message: inst.payload.message };
          nextState.console.push({ type: 'output', text: inst.payload.message, timestamp: Date.now() });
          // No incrementamos el puntero hasta recibir el input
          break;

        case 'CALCULATE':
          const { variable, expression } = inst.payload;
          const result = ExpressionEvaluator.evaluate(expression, nextState.memory);
          nextState.memory[variable] = result;
          nextState.console.push({ type: 'system', text: `Fórmula: ${variable} = ${expression} (Resultado: ${result})`, timestamp: Date.now() });
          nextState.currentPointer++;
          break;

        case 'PRINT':
          const { message, variable: varName } = inst.payload;
          let outputText = message;
          if (varName) {
            const val = nextState.memory[varName];
            outputText += ` ${val !== undefined ? val : '[Variable no definida]'}`;
          }
          nextState.console.push({ type: 'output', text: outputText, timestamp: Date.now() });
          nextState.currentPointer++;
          break;

        case 'IF':
          const condition = ExpressionEvaluator.evaluate(inst.payload.condition, nextState.memory);
          if (condition) {
            nextState.currentPointer++;
          } else {
            // Saltar al ELSE o al END_IF
            nextState.currentPointer = inst.payload.elseIndex !== undefined 
              ? inst.payload.elseIndex + 1 
              : inst.payload.endIfIndex + 1;
          }
          break;

        case 'ELSE':
          // Si llegamos a un ELSE ejecutando el bloque IF, debemos saltar al END_IF
          nextState.currentPointer = inst.payload.jumpTo + 1;
          break;

        case 'END_IF':
          nextState.currentPointer++;
          break;

        case 'WHILE':
          const whileCond = ExpressionEvaluator.evaluate(inst.payload.condition, nextState.memory);
          if (whileCond) {
            nextState.currentPointer++;
          } else {
            nextState.currentPointer = inst.payload.endWhileIndex + 1;
          }
          break;

        case 'END_WHILE':
          nextState.currentPointer = inst.payload.jumpTo; // Volver al inicio del While
          break;

        case 'FOR':
          // Si es la primera vez que entramos al FOR (o volvemos desde el END_FOR)
          // Necesitamos saber si estamos inicializando o incrementando
          const forVar = inst.payload.variable;
          
          if (nextState.memory[forVar] === undefined) {
            // Inicialización
            nextState.memory[forVar] = ExpressionEvaluator.evaluate(inst.payload.startExpr, nextState.memory);
          } else {
            // Incremento (esto sucede cuando volvemos del END_FOR)
            // Si el puntero actual es el mismo que el anterior, significa que estamos re-evaluando el FOR
            // Pero el SimulationEngine.step se llama externamente.
            // La lógica actual en step() incrementa el puntero o salta.
            // Para el FOR, si la condición es verdadera, entramos al bloque.
            // El incremento debe ocurrir AL FINAL del bloque, usualmente en el END_FOR o al volver al FOR.
            
            // Cambio de estrategia: El incremento ocurre cuando volvemos desde END_FOR.
            // Pero el END_FOR salta de vuelta al FOR. 
            // Entonces, si venimos de un salto (jumpTo), incrementamos.
            // Sin embargo, el estado no guarda de dónde venimos fácilmente sin añadir un campo 'lastPointer'.
            
            // Alternativa: El SimulationEngine.step para el FOR evalúa la condición.
            // Si es la primera vez, inicializa. Si no, asume que el incremento ya se hizo o se hará.
            // Vamos a manejar el incremento en el END_FOR para que sea más natural.
          }

          // Evaluar condición
          const forCond = ExpressionEvaluator.evaluate(inst.payload.condition, nextState.memory);
          if (forCond) {
            nextState.currentPointer++;
          } else {
            // Limpiar variable del bucle al salir (opcional, pero ayuda a re-entrar)
            delete nextState.memory[forVar];
            nextState.currentPointer = inst.payload.endForIndex + 1;
          }
          break;

        case 'END_FOR':
          // Aplicar incremento antes de saltar de vuelta
          const forInst = nextState.instructions[inst.payload.jumpTo];
          if (forInst && forInst.type === 'FOR') {
            const v = forInst.payload.variable;
            const step = forInst.payload.stepExpr.includes('++') 
              ? `${v} + 1` 
              : forInst.payload.stepExpr.split('=')[1]?.trim() || forInst.payload.stepExpr;
            
            nextState.memory[v] = ExpressionEvaluator.evaluate(step, nextState.memory);
          }
          nextState.currentPointer = inst.payload.jumpTo; // Volver al inicio del For
          break;

        case 'END':
          nextState.console.push({ type: 'system', text: '--- Algoritmo Finalizado ---', timestamp: Date.now() });
          nextState.status = 'FINISHED';
          nextState.currentPointer++;
          break;

        default:
          nextState.currentPointer++;
          break;
      }
    } catch (error: any) {
      nextState.status = 'ERROR';
      nextState.error = error.message;
      nextState.console.push({ type: 'error', text: `Error: ${error.message}`, timestamp: Date.now() });
    }

    return nextState;
  }

  static provideInput(state: SimulationState, value: string): SimulationState {
    if (state.status !== 'WAITING_INPUT' || !state.waitingFor) return state;

    const nextState = { ...state, console: [...state.console], memory: { ...state.memory } };
    const { variable } = state.waitingFor;

    // Intentar convertir a número si es posible
    const numVal = Number(value);
    nextState.memory[variable] = isNaN(numVal) || value.trim() === '' ? value : numVal;
    
    nextState.console.push({ type: 'input', text: value, timestamp: Date.now() });
    nextState.status = 'RUNNING';
    nextState.waitingFor = undefined;
    nextState.currentPointer++;

    return nextState;
  }
}
