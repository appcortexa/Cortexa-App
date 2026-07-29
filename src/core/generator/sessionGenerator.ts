import { LEVELS } from "../levels";
import { generateStimulusPool } from "../quotaGenerator";
import {
  alcoholStimuli,
  cocainaStimuli,
  cristalStimuli,
  goStimuli,
  type Stimulus,
} from "../stimuli";
import { generateSequence } from "./sequenceGenerator";
import type { TrialResult } from "../evaluation/trialScorer";

interface SessionTrial {
  order: number;
  type: "GO" | "NO_GO";
  stimulus: Stimulus;
  response: boolean | null;
  reactionTime: number | null;
  result: TrialResult | null;
  correct: boolean | null;
}

export interface GeneratedSession {
  id: string;
  version: "1.0";
  createdAt: Date;
  status: "READY" | "RUNNING" | "FINISHED";
  expediente: string;
  substance: string;
  level: string;
  config: {
    stimulusDuration: number;
    isi: number;
  };
  summary: {
    totalTrials: number;
    go: number;
    noGo: number;
  };
  trials: SessionTrial[];
}

// Normaliza la sustancia para tolerar variaciones de mayusculas, acentos y espacios.
function normalizeSubstance(substance: string): string {
  return substance
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Selecciona el catalogo NO_GO segun la sustancia elegida.
function getNoGoCatalogBySubstance(substance: string): Stimulus[] {
  const normalized = normalizeSubstance(substance);

  if (normalized === "alcohol") {
    return alcoholStimuli;
  }

  if (normalized === "cristal") {
    return cristalStimuli;
  }

  if (normalized === "cocaina") {
    return cocainaStimuli;
  }

  // Para valores no mapeados (ej. "Otro") se usa un catalogo combinado.
  return [...alcoholStimuli, ...cristalStimuli, ...cocainaStimuli];
}

// Calcula conteos GO/NO_GO de forma consistente y garantiza que la suma sea exacta.
function calculateTrialCounts(totalTrials: number, noGoPercentage: number): {
  goCount: number;
  noGoCount: number;
} {
  const noGoCount = Math.round(totalTrials * (noGoPercentage / 100));
  const goCount = totalTrials - noGoCount;

  return { goCount, noGoCount };
}

// Genera un identificador unico de sesion sin dependencias externas.
function createSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const randomPart = Math.random().toString(36).slice(2, 10);
  return `session-${Date.now()}-${randomPart}`;
}

export function generateSession(
  expediente: string,
  substance: string,
  levelId: string,
): GeneratedSession {
  const levelConfig = LEVELS[levelId];

  if (!levelConfig) {
    throw new Error(`Nivel invalido: ${levelId}`);
  }

  const { trials: totalTrials, noGoPercentage, stimulusDuration, isi } = levelConfig;
  const { goCount, noGoCount } = calculateTrialCounts(totalTrials, noGoPercentage);

  // Se generan pools separados para asegurar cuotas balanceadas por imagen.
  const goPool = generateStimulusPool(goStimuli, goCount);
  const noGoCatalog = getNoGoCatalogBySubstance(substance);
  const noGoPool = generateStimulusPool(noGoCatalog, noGoCount);

  // Se crea una secuencia valida de tipos de ensayo sin imagenes.
  const sequence = generateSequence(totalTrials, noGoCount);

  let goIndex = 0;
  let noGoIndex = 0;

  // Se asigna un estimulo del pool correspondiente a cada tipo de ensayo.
  const trials: SessionTrial[] = sequence.map((type, index) => {
    const stimulus =
      type === "GO" ? goPool[goIndex++] : noGoPool[noGoIndex++];

    if (!stimulus) {
      throw new Error("No hay suficientes estimulos para construir la sesion.");
    }

    return {
      order: index + 1,
      type,
      stimulus,
      response: null,
      reactionTime: null,
      result: null,
      correct: null,
    };
  });

  return {
    id: createSessionId(),
    version: "1.0",
    createdAt: new Date(),
    status: "READY",
    expediente,
    substance,
    level: levelConfig.id,
    config: {
      stimulusDuration,
      isi,
    },
    summary: {
      totalTrials,
      go: goCount,
      noGo: noGoCount,
    },
    trials,
  };
}
