
/**
 * Formatea un algoritmo de pseudocódigo al estándar pedagógico del INTI:
 * 1. Inicio
 * 2. ...
 * n. Fin
 */
export const formatAlgorithm = (code: string): string => {
  if (!code) return '';

  const lines = code.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const normalizedLines: string[] = [];
  let hasStart = false;
  let hasEnd = false;

  for (let line of lines) {
    const lowerLine = line.toLowerCase();

    // Ignorar "Algoritmo Nombre"
    if (lowerLine.startsWith('algoritmo')) {
      continue;
    }

    // Normalizar FinAlgoritmo a Fin
    if (lowerLine === 'finalgoritmo') {
      line = 'Fin';
    }

    // Normalizar Mostrar a Escribir
    if (lowerLine.startsWith('mostrar ')) {
      line = 'Escribir ' + line.substring(8);
    } else if (lowerLine === 'mostrar') {
      line = 'Escribir';
    }

    if (line.toLowerCase() === 'inicio') hasStart = true;
    if (line.toLowerCase() === 'fin') hasEnd = true;

    normalizedLines.push(line);
  }

  // Asegurar Inicio al principio
  if (!hasStart) {
    normalizedLines.unshift('Inicio');
  } else {
    // Si ya tiene Inicio, asegurarnos que sea la primera (moviéndola si es necesario)
    const startIndex = normalizedLines.findIndex(l => l.toLowerCase() === 'inicio');
    if (startIndex > 0) {
      const startLine = normalizedLines.splice(startIndex, 1)[0];
      normalizedLines.unshift(startLine);
    }
  }

  // Asegurar Fin al final
  if (!hasEnd) {
    normalizedLines.push('Fin');
  } else {
    // Si ya tiene Fin, asegurarnos que sea la última
    const endIndex = normalizedLines.findIndex(l => l.toLowerCase() === 'fin');
    if (endIndex !== -1 && endIndex !== normalizedLines.length - 1) {
      const endLine = normalizedLines.splice(endIndex, 1)[0];
      normalizedLines.push(endLine);
    }
  }

  // Numerar las líneas
  return normalizedLines
    .map((line, index) => `${index + 1}. ${line}`)
    .join('\n');
};

/**
 * Retorna el código sin numeración pero normalizado (Inicio/Fin)
 * Útil para pasar al simulador o laboratorio
 */
export const normalizeAlgorithm = (code: string): string => {
  const formatted = formatAlgorithm(code);
  return formatted
    .split('\n')
    .map(line => line.replace(/^\d+\.\s*/, ''))
    .join('\n');
};
