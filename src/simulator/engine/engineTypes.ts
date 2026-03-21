
import { Instruction } from '../parser/parserTypes';

export type SimulatorStatus = 'IDLE' | 'RUNNING' | 'WAITING_INPUT' | 'FINISHED' | 'ERROR';

export interface ConsoleMessage {
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
  timestamp: number;
}

export interface SimulatorState {
  instructionPointer: number;
  memory: Record<string, any>;
  consoleBuffer: ConsoleMessage[];
  status: SimulatorStatus;
  waitingVariable?: string;
  error?: string;
}
