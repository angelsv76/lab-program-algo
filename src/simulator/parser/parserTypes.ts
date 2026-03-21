
export type InstructionType = 
  | 'START' 
  | 'END' 
  | 'READ' 
  | 'PRINT' 
  | 'CALCULATE' 
  | 'IF' 
  | 'ELSE' 
  | 'END_IF' 
  | 'WHILE' 
  | 'END_WHILE' 
  | 'FOR' 
  | 'END_FOR';

export interface Instruction {
  type: InstructionType;
  line: number;
  raw: string;
  payload?: any;
}

export interface ParseResult {
  instructions: Instruction[];
  errors: string[];
}
