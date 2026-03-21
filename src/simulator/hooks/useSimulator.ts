
import { useState, useCallback, useEffect } from 'react';
import { parseProgram } from '../parser/parseProgram';
import { Instruction } from '../parser/parserTypes';
import { SimulatorState } from '../engine/engineTypes';
import { initializeSimulator, stepSimulator, submitInputToSimulator } from '../engine/simulatorEngine';

export const useSimulator = (code: string) => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [state, setState] = useState<SimulatorState>(initializeSimulator([]));

  // Re-parse when code changes
  useEffect(() => {
    const result = parseProgram(code);
    setInstructions(result.instructions);
    setErrors(result.errors);
    setState(initializeSimulator(result.instructions));
  }, [code]);

  const step = useCallback(() => {
    setState(prev => stepSimulator(prev, instructions));
  }, [instructions]);

  const run = useCallback(() => {
    // Implementación básica de run: ejecutar hasta que necesite input o termine
    // En un hook real, esto podría ser un loop con delay
    setState(prev => {
      let current = prev;
      if (current.status === 'IDLE') {
        current = { ...current, status: 'RUNNING' };
      }
      return current;
    });
  }, []);

  const submitInput = useCallback((value: string) => {
    setState(prev => submitInputToSimulator(prev, value));
  }, []);

  const reset = useCallback(() => {
    setState(initializeSimulator(instructions));
  }, [instructions]);

  return {
    memory: state.memory,
    consoleMessages: state.consoleBuffer,
    currentLine: instructions[state.instructionPointer]?.line || -1,
    status: state.status,
    error: state.error || (errors.length > 0 ? errors[0] : undefined),
    step,
    run,
    submitInput,
    reset,
    waitingVariable: state.waitingVariable
  };
};
