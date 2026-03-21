
export class ExpressionEvaluator {
  private static operators: Record<string, { prec: number, assoc: 'L' | 'R' }> = {
    '^': { prec: 4, assoc: 'R' },
    '*': { prec: 3, assoc: 'L' },
    '/': { prec: 3, assoc: 'L' },
    '%': { prec: 3, assoc: 'L' },
    '+': { prec: 2, assoc: 'L' },
    '-': { prec: 2, assoc: 'L' },
    '<': { prec: 1, assoc: 'L' },
    '>': { prec: 1, assoc: 'L' },
    '<=': { prec: 1, assoc: 'L' },
    '>=': { prec: 1, assoc: 'L' },
    '==': { prec: 1, assoc: 'L' },
    '!=': { prec: 1, assoc: 'L' },
    '&&': { prec: 0, assoc: 'L' },
    '||': { prec: 0, assoc: 'L' },
  };

  static evaluate(expression: string, memory: Record<string, any>): any {
    // 1. Normalizar operadores y constantes
    let cleanExpr = expression
      .replace(/\bY\b/g, ' && ')
      .replace(/\bO\b/g, ' || ')
      .replace(/\bNO\b/g, ' ! ')
      .replace(/=/g, ' == ')
      .replace(/==  ==/g, ' == ') // Corregir doble reemplazo
      .replace(/!=  ==/g, ' != ')
      .replace(/<=  ==/g, ' <= ')
      .replace(/>=  ==/g, ' >= ')
      .replace(/\bVerdadero\b/gi, ' true ')
      .replace(/\bFalso\b/gi, ' false ');

    // 2. Tokenizar
    const tokens = this.tokenize(cleanExpr);
    
    // 3. Shunting-yard (Infix to Postfix)
    const postfix = this.shuntingYard(tokens);
    
    // 4. Evaluate Postfix
    return this.evaluatePostfix(postfix, memory);
  }

  private static tokenize(expr: string): string[] {
    const regex = /\s*(\d+\.?\d*|\w+|&&|\|\||<=|>=|==|!=|[+\-*/%^()!<>])\s*/g;
    const tokens: string[] = [];
    let match;
    while ((match = regex.exec(expr)) !== null) {
      tokens.push(match[1]);
    }
    return tokens;
  }

  private static shuntingYard(tokens: string[]): string[] {
    const output: string[] = [];
    const stack: string[] = [];

    tokens.forEach(token => {
      if (!isNaN(Number(token)) || token === 'true' || token === 'false') {
        output.push(token);
      } else if (this.isVariable(token)) {
        output.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          output.push(stack.pop()!);
        }
        stack.pop(); // Remove '('
      } else if (this.operators[token]) {
        const o1 = token;
        while (stack.length > 0 && this.operators[stack[stack.length - 1]]) {
          const o2 = stack[stack.length - 1];
          if ((this.operators[o1].assoc === 'L' && this.operators[o1].prec <= this.operators[o2].prec) ||
              (this.operators[o1].assoc === 'R' && this.operators[o1].prec < this.operators[o2].prec)) {
            output.push(stack.pop()!);
          } else {
            break;
          }
        }
        stack.push(o1);
      } else if (token === '!') {
        stack.push(token);
      }
    });

    while (stack.length > 0) {
      output.push(stack.pop()!);
    }

    return output;
  }

  private static evaluatePostfix(postfix: string[], memory: Record<string, any>): any {
    const stack: any[] = [];

    postfix.forEach(token => {
      if (!isNaN(Number(token))) {
        stack.push(Number(token));
      } else if (token === 'true') {
        stack.push(true);
      } else if (token === 'false') {
        stack.push(false);
      } else if (this.isVariable(token)) {
        if (memory[token] === undefined) throw new Error(`Variable no definida: ${token}`);
        stack.push(memory[token]);
      } else if (token === '!') {
        const a = stack.pop();
        stack.push(!a);
      } else if (this.operators[token]) {
        const b = stack.pop();
        const a = stack.pop();
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(a / b); break;
          case '%': stack.push(a % b); break;
          case '^': stack.push(Math.pow(a, b)); break;
          case '<': stack.push(a < b); break;
          case '>': stack.push(a > b); break;
          case '<=': stack.push(a <= b); break;
          case '>=': stack.push(a >= b); break;
          case '==': stack.push(a == b); break;
          case '!=': stack.push(a != b); break;
          case '&&': stack.push(a && b); break;
          case '||': stack.push(a || b); break;
        }
      }
    });

    return stack[0];
  }

  private static isVariable(token: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token) && 
           !['true', 'false', 'Math'].includes(token) &&
           !this.operators[token] &&
           token !== '!';
  }
}
