import type { Stimulus } from "./stimuli";

// Crea una copia barajada usando Fisher-Yates para no mutar el arreglo recibido.
function shuffleStimuli(stimuli: Stimulus[]): Stimulus[] {
  const shuffled = [...stimuli];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];

    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = current;
  }

  return shuffled;
}

export function generateStimulusPool(
  stimuli: Stimulus[],
  requiredCount: number,
): Stimulus[] {
  if (requiredCount <= 0 || stimuli.length === 0) {
    return [];
  }

  // Repartimos una cuota base para que todas las imágenes se usen casi igual.
  const baseQuota = Math.floor(requiredCount / stimuli.length);
  const remainder = requiredCount % stimuli.length;

  // La selección aleatoria del residuo define qué imágenes reciben un uso extra.
  const randomizedStimuli = shuffleStimuli(stimuli);
  const pool: Stimulus[] = [];

  randomizedStimuli.forEach((stimulus, index) => {
    const extraQuota = index < remainder ? 1 : 0;
    const totalQuota = baseQuota + extraQuota;

    for (let count = 0; count < totalQuota; count += 1) {
      pool.push({ ...stimulus });
    }
  });

  // El resultado final también se baraja para evitar bloques por imagen.
  return shuffleStimuli(pool);
}