
import { Instruction } from '../parser/parserTypes';
import { SimulatorState, ConsoleMessage } from './engineTypes';
import { ExpressionEvaluator } from './expressionEvaluator';

export const initializeSimulator = (instructions: Instruction[]): SimulatorState => ({
  instructionPointer: 0,
  memory: {},
  consoleBuffer: [{ type: 'system', text: 'Simulador inicializado.', timestamp: Date.now() }],
  status: 'IDLE',
});

export const stepSimulator = (state: SimulatorState, instructions: Instruction[]): SimulatorState => {
  if (state.status === 'FINISHED' || state.status === 'ERROR') return state;
  if (state.instructionPointer >= instructions.length) {
    return { ...state, status: 'FINISHED' };
  }

  const inst = instructions[state.instructionPointer];
  const nextState = { ...state, consoleBuffer: [...state.consoleBuffer], memory: { ...state.memory } };

  try {
    switch (inst.type) {
      case 'START':
        nextState.status = 'RUNNING';
        nextState.consoleBuffer.push({ type: 'system', text: 'Ejecución iniciada...', timestamp: Date.now() });
        nextState.instructionPointer++;
        break;

      case 'READ':
        nextState.status = 'WAITING_INPUT';
        nextState.waitingVariable = inst.payload.variable;
        nextState.consoleBuffer.push({ type: 'output', text: inst.payload.prompt, timestamp: Date.now() });
        // No incrementamos el puntero hasta recibir el input
        break;

      case 'CALCULATE':
        const { target, expression } = inst.payload;
        const result = ExpressionEvaluator.evaluate(expression, nextState.memory);
        nextState.memory[target] = result;
        nextState.consoleBuffer.push({ type: 'system', text: `Calcular: ${target} = ${expression} (Resultado: ${result})`, timestamp: Date.now() });
        nextState.instructionPointer++;
        break;

      case 'PRINT':
        const { message, variable } = inst.payload;
        let text = message;
        if (variable) {
          const val = nextState.memory[variable];
          text += ` ${val !== undefined ? val : '[Indefinido]'}`;
        }
        nextState.consoleBuffer.push({ type: 'output', text, timestamp: Date.now() });
        nextState.instructionPointer++;
        break;

      case 'END':
        nextState.status = 'FINISHED';
        nextState.consoleBuffer.push({ type: 'system', text: 'Ejecución finalizada.', timestamp: Date.now() });
        nextState.instructionPointer++;
        break;

      default:
        // Por ahora ignoramos estructuras de control en la ejecución básica
        nextState.instructionPointer++;
        break;
    }
  } catch (error: any) {
    nextState.status = 'ERROR';
    nextState.error = error.message;
    nextState.consoleBuffer.push({ type: 'error', text: `Error: ${error.message}`, timestamp: Date.now() });
  }

  return nextState;
};

export const submitInputToSimulator = (state: SimulatorState, value: string): SimulatorState => {
  if (state.status !== 'WAITING_INPUT' || !state.waitingVariable) return state;

  const nextState = { ...state, consoleBuffer: [...state.consoleBuffer], memory: { ...state.memory } };
  const numVal = Number(value);
  nextState.memory[state.waitingVariable] = isNaN(numVal) || value.trim() === '' ? value : numVal;
  
  nextState.consoleBuffer.push({ type: 'input', text: value, timestamp: Date.now() });
  nextState.status = 'RUNNING';
  nextState.waitingVariable = undefined;
  nextState.instructionPointer++;

  return nextState;
};
