/**
 * Laboratorio de Programación INTI
 * © 2025 Angel Sanchez – Todos los derechos reservados
 *
 * Servicio pedagógico de IA con streaming, timeout y reintentos.
 */

import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { AIContent } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const MODEL_CONFIG = {
  model: 'gemini-2.0-flash',
  config: {
    thinkingConfig: { thinkingLevel: ThinkingLevel.NONE },
    maxOutputTokens: 1200,
    temperature: 0.7,
  },
};

// Timeout: si Gemini no responde en 20s, cancela
function withTimeout<T>(promise: Promise<T>, ms = 20000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), ms)
    ),
  ]);
}

// Reintento simple: 2 intentos con 1.5s de espera entre ellos
async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  throw new Error('Max retries reached');
}

export const aiPedagogicalService = {
  /**
   * Genera contenido educativo usando streaming para que el texto
   * aparezca progresivamente en vez de esperar la respuesta completa.
   * onChunk se llama con cada fragmento recibido.
   */
  generateContentStreaming: async (
    tema: string,
    nivel: number,
    especialidad: string = 'General',
    onChunk: (partial: Partial<AIContent>) => void
  ): Promise<Partial<AIContent>> => {
    const prompt = `Eres un tutor de programación para estudiantes de 14-16 años del INTI El Salvador.
Genera contenido para: "${tema}", nivel ${nivel}/5, especialidad "${especialidad}".

Responde SOLO con JSON válido, sin texto adicional:
{
  "explicacion": "explicación clara en 3-4 oraciones",
  "ejemplo": "ejemplo práctico relacionado con ${especialidad}",
  "algoritmo": "pseudocódigo con Inicio...Fin",
  "errores_comunes": "2-3 errores frecuentes",
  "solucion": "solución paso a paso",
  "ejercicio": "enunciado para practicar",
  "pista": "una pista breve"
}`;

    return withRetry(async () => {
      const stream = await withTimeout(
        ai.models.generateContentStream({
          ...MODEL_CONFIG,
          contents: prompt,
          config: {
            ...MODEL_CONFIG.config,
            responseMimeType: 'application/json',
          },
        }),
        20000
      );

      let accumulated = '';

      for await (const chunk of stream) {
        const text = chunk.text ?? '';
        accumulated += text;

        // Intenta parsear parcialmente para mostrar lo que ya llegó
        try {
          const partial = JSON.parse(accumulated);
          onChunk({ ...partial, tema, nivel, especialidad });
        } catch {
          // JSON incompleto — sigue acumulando
        }
      }

      // Parse final
      const clean = accumulated.replace(/```json|```/g, '').trim();
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

  /**
   * Versión sin streaming para compatibilidad con código existente.
   */
  generateContent: async (
    tema: string,
    nivel: number,
    especialidad: string = 'General'
  ): Promise<Partial<AIContent>> => {
    const prompt = `Eres un tutor de programación para estudiantes de 14-16 años del INTI El Salvador.
Genera contenido para: "${tema}", nivel ${nivel}/5, especialidad "${especialidad}".

Responde SOLO con JSON válido, sin texto adicional:
{
  "explicacion": "explicación clara en 3-4 oraciones",
  "ejemplo": "ejemplo práctico relacionado con ${especialidad}",
  "algoritmo": "pseudocódigo con Inicio...Fin",
  "errores_comunes": "2-3 errores frecuentes",
  "solucion": "solución paso a paso",
  "ejercicio": "enunciado para practicar",
  "pista": "una pista breve"
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
        20000
      );

      const clean = (response.text || '{}').replace(/```json|```/g, '').trim();
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
