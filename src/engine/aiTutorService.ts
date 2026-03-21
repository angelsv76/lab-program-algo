/**
 * Laboratorio de Programación INTI
 * © 2025 Angel Sanchez – Todos los derechos reservados
 *
 * Servicio del Tutor IA con streaming, timeout y reintentos.
 */

import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const MODEL_CONFIG = {
  model: 'gemini-flash-latest',
  config: {
    thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    maxOutputTokens: 800,
    temperature: 0.7,
  },
};

function withTimeout<T>(promise: Promise<T>, ms = 20000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), ms)
    ),
  ]);
}

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Max retries reached');
}

export interface AIResponse {
  text: string;
  explanation?: string;
  steps?: string[];
  code?: string;
}

export const aiTutorService = {
  generateExplanationStreaming: async (
    concept: string,
    level: string,
    specialty: string,
    onChunk: (text: string) => void
  ): Promise<string> => {
    const prompt = `Eres un tutor de programación del INTI El Salvador para estudiantes de bachillerato (14-16 años).
Explica "${concept}" para nivel "${level}", especialidad "${specialty}" (ITSI, Software, Automotriz o Industrial).
Usa lenguaje sencillo y motivador. Sigue el modelo: Entrada → Proceso → Salida. Máximo 150 palabras.`;

    return withRetry(async () => {
      const stream = await withTimeout(
        ai.models.generateContentStream({ ...MODEL_CONFIG, contents: prompt }),
        20000
      );

      let full = '';
      for await (const chunk of stream) {
        const text = chunk.text ?? '';
        full += text;
        onChunk(text);
      }
      return full || 'No pude generar una respuesta.';
    });
  },

  generateExplanation: async (
    concept: string,
    level: string,
    specialty: string
  ): Promise<string> => {
    const prompt = `Eres un tutor de programación del INTI El Salvador para estudiantes de bachillerato (14-16 años).
Explica "${concept}" para nivel "${level}", especialidad "${specialty}".
Usa lenguaje sencillo. Sigue el modelo: Entrada → Proceso → Salida. Máximo 150 palabras.`;

    return withRetry(async () => {
      const response = await withTimeout(
        ai.models.generateContent({ ...MODEL_CONFIG, contents: prompt }),
        20000
      );
      return response.text || 'No pude generar una respuesta.';
    });
  },

  generateExample: async (
    concept: string,
    specialty: string,
    difficulty: string = 'Básico'
  ): Promise<AIResponse> => {
    const prompt = `Genera un ejemplo de "${concept}" para especialidad "${specialty}", dificultad "${difficulty}".
Responde SOLO con JSON válido:
{
  "text": "contexto del problema (2 oraciones)",
  "code": "pseudocódigo numerado con Inicio/Fin",
  "explanation": "explicación en 3 pasos"
}`;

    return withRetry(async () => {
      const response = await withTimeout(
        ai.models.generateContent({
          ...MODEL_CONFIG,
          contents: prompt,
          config: { ...MODEL_CONFIG.config, responseMimeType: 'application/json' },
        }),
        20000
      );
      const clean = (response.text || '{}').replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const result = JSON.parse(clean);
      return {
        text: result.text || 'Error al generar ejemplo.',
        code: result.code,
        explanation: result.explanation,
      };
    });
  },

  analyzeAlgorithm: async (code: string): Promise<string> => {
    const prompt = `Analiza este pseudocódigo para un estudiante de 14-16 años del INTI.
Explica brevemente qué hace (Entrada→Proceso→Salida), detecta errores lógicos y sugiere una mejora.
Máximo 120 palabras.

Pseudocódigo:
${code}`;

    return withRetry(async () => {
      const response = await withTimeout(
        ai.models.generateContent({ ...MODEL_CONFIG, contents: prompt }),
        20000
      );
      return response.text || 'Error al analizar el algoritmo.';
    });
  },
};
