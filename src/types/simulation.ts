
export type SimulationStatus = 'IDLE' | 'RUNNING' | 'WAITING_INPUT' | 'FINISHED' | 'ERROR';

export type InstructionType = 
  | 'START' 
  | 'READ' 
  | 'CALCULATE' 
  | 'PRINT' 
  | 'END' 
  | 'IF' 
  | 'ELSE' 
  | 'END_IF' 
  | 'WHILE' 
  | 'END_WHILE' 
  | 'FOR' 
  | 'END_FOR' 
  | 'UNKNOWN';

export interface Instruction {
  line: number;
  type: InstructionType;
  raw: string;
  payload?: any;
}

export interface SimulationState {
  instructions: Instruction[];
  currentPointer: number;
  memory: Record<string, any>;
  console: ConsoleLine[];
  status: SimulationStatus;
  waitingFor?: {
    variable: string;
    message: string;
  };
  error?: string;
}

export interface ConsoleLine {
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
  timestamp: number;
}
