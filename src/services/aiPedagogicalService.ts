/**
 * Laboratorio de Programación INTI
 * © 2025 Angel Sanchez – Todos los derechos reservados
 *
 * Servicio pedagógico de IA con timeout y reintentos.
 */

import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { AIContent } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const MODEL_CONFIG = {
  model: 'gemini-flash-latest',
  config: {
    thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    maxOutputTokens: 1200,
    temperature: 0.7,
  },
};

function withTimeout<T>(promise: Promise<T>, ms = 25000): Promise<T> {
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

export const aiPedagogicalService = {
  generateContent: async (
    tema: string,
    nivel: number,
    especialidad: string = 'General'
  ): Promise<Partial<AIContent>> => {
    const prompt = `Eres un tutor de programación para estudiantes de 14-16 años del INTI El Salvador.
Genera contenido educativo para: "${tema}", nivel ${nivel}/5, especialidad "${especialidad}".

Responde ÚNICAMENTE con un objeto JSON válido, sin explicaciones ni texto adicional:
{
  "explicacion": "explicación clara en 3-4 oraciones usando lenguaje sencillo",
  "ejemplo": "ejemplo práctico relacionado con la especialidad ${especialidad}",
  "algoritmo": "pseudocódigo que inicia con Inicio y termina con Fin",
  "errores_comunes": "lista de 2-3 errores frecuentes de los principiantes",
  "solucion": "solución paso a paso del ejemplo",
  "ejercicio": "enunciado de un ejercicio de práctica",
  "pista": "una pista breve para resolver el ejercicio"
}`;

    return withRetry(async () => {
      const response = await withTimeout(
        ai.models.generateContent({
          ...MODEL_CONFIG,
          contents: prompt,
          config: {
            ...MODEL_CONFIG.config,
            responseMimeType: 'application/json',
          },
        }),
        25000
      );

      const raw = response.text || '';
      if (!raw.trim()) throw new Error('La IA devolvió una respuesta vacía.');

      // Limpia posibles bloques markdown que Gemini a veces agrega
      const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const result = JSON.parse(clean);

      return {
        ...result,
        tema,
        nivel,
        especialidad,
        fecha_generacion: new Date().toISOString(),
        estado: 'activo',
      };
    });
  },

  explainError: async (code: string, error: string): Promise<string> => {
    const prompt = `El estudiante obtuvo este error:
Error: ${error}
Código: ${code}

En 2-3 oraciones sencillas: ¿por qué ocurrió y cómo corregirlo sin dar la solución completa?`;

    return withRetry(async () => {
      const response = await withTimeout(
        ai.models.generateContent({ ...MODEL_CONFIG, contents: prompt }),
        15000
      );
      return response.text || 'No se pudo generar una explicación.';
    });
  },
};
