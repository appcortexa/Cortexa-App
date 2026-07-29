import type { SessionAnalysis } from "../core/evaluation/sessionAnalyzer";
import type { GeneratedSession } from "../core/generator/sessionGenerator";

const STORAGE_KEY = "reconecta_results_v1";

export type SessionMode = "evaluation" | "training";

type StoredSession = Omit<GeneratedSession, "createdAt"> & {
  createdAt: Date | string;
};

function createAnalysisSnapshot(
  source: SessionAnalysis,
): SessionAnalysis {
  return {
    totalTrials: source.totalTrials,
    totalGo: source.totalGo,
    totalNoGo: source.totalNoGo,
    hits: source.hits,
    misses: source.misses,
    falseAlarms: source.falseAlarms,
    correctRejections: source.correctRejections,
    hitRate: source.hitRate,
    missRate: source.missRate,
    falseAlarmRate: source.falseAlarmRate,
    correctRejectionRate: source.correctRejectionRate,
    accuracy: source.accuracy,
    meanReactionTime: source.meanReactionTime,
    medianReactionTime: source.medianReactionTime,
    standardDeviationReactionTime: source.standardDeviationReactionTime,
    minReactionTime: source.minReactionTime,
    maxReactionTime: source.maxReactionTime,
    percentile25ReactionTime: source.percentile25ReactionTime,
    percentile75ReactionTime: source.percentile75ReactionTime,
    dPrime: source.dPrime,
    criterionC: source.criterionC,
    coefficientOfVariationReactionTime: source.coefficientOfVariationReactionTime,
    clinicalIndexes: {
      inhibitoryControl: source.clinicalIndexes.inhibitoryControl,
      sustainedAttention: source.clinicalIndexes.sustainedAttention,
      processingSpeed: source.clinicalIndexes.processingSpeed,
      cognitiveConsistency: source.clinicalIndexes.cognitiveConsistency,
      reconectaGlobalIndex: source.clinicalIndexes.reconectaGlobalIndex,
    },
    interpretation: {
      inhibitoryControl: source.interpretation.inhibitoryControl,
      sustainedAttention: source.interpretation.sustainedAttention,
      processingSpeed: source.interpretation.processingSpeed,
      cognitiveConsistency: source.interpretation.cognitiveConsistency,
      reconectaGlobalIndex: source.interpretation.reconectaGlobalIndex,
    },
  };
}

function toStoredSession(session?: GeneratedSession | StoredSession): StoredSession | undefined {
  if (!session) {
    return undefined;
  }

  const createdAt = session.createdAt instanceof Date
    ? session.createdAt.toISOString()
    : String(session.createdAt);

  return {
    ...session,
    createdAt,
  };
}

export interface StoredResult extends SessionAnalysis {
  id: string;
  fecha: string;
  hora: string;
  expediente: string;
  modo: SessionMode;
  sustancia: string;
  nivel: string;
  sessionId?: string;
  createdAt?: string;
  session?: StoredSession;
  analysis: SessionAnalysis;
  clinicalIndexes: SessionAnalysis["clinicalIndexes"];
  interpretations: SessionAnalysis["interpretation"];
}

export type SaveResultInput = Omit<
  StoredResult,
  "id" | "fecha" | "hora" | "analysis" | "clinicalIndexes" | "interpretations"
> &
  Partial<Pick<StoredResult, "id" | "fecha" | "hora" | "analysis" | "clinicalIndexes" | "interpretations">>;

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createResultId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `result-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDateTimeStamp(date = new Date()): { fecha: string; hora: string } {
  const fecha = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  const hora = new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);

  return { fecha, hora };
}

function readStoredResults(): StoredResult[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return (parsed as Array<Partial<StoredResult>>).map((result) => {
      const sourceAnalysis = createAnalysisSnapshot(result as SessionAnalysis);

      return {
        ...(result as StoredResult),
        session: toStoredSession(result.session),
        analysis: result.analysis ? createAnalysisSnapshot(result.analysis) : sourceAnalysis,
        clinicalIndexes: result.clinicalIndexes ?? sourceAnalysis.clinicalIndexes,
        interpretations: result.interpretations ?? result.interpretation ?? sourceAnalysis.interpretation,
      };
    });
  } catch {
    return [];
  }
}

function writeStoredResults(results: StoredResult[]): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function saveResult(result: SaveResultInput): StoredResult {
  const timestamp = createDateTimeStamp();
  const analysis = result.analysis
    ? createAnalysisSnapshot(result.analysis)
    : createAnalysisSnapshot(result as SessionAnalysis);
  const interpretations = result.interpretations ?? result.interpretation ?? analysis.interpretation;
  const clinicalIndexes = result.clinicalIndexes ?? analysis.clinicalIndexes;

  const record: StoredResult = {
    ...result,
    id: result.id ?? createResultId(),
    fecha: result.fecha ?? timestamp.fecha,
    hora: result.hora ?? timestamp.hora,
    session: toStoredSession(result.session),
    analysis,
    clinicalIndexes,
    interpretations,
  };

  const results = readStoredResults();
  results.unshift(record);
  writeStoredResults(results);

  return record;
}

export function getAllResults(): StoredResult[] {
  return readStoredResults();
}

export function getResultsByExpediente(expediente: string): StoredResult[] {
  const normalizedExpediente = expediente.trim().toLowerCase();

  if (!normalizedExpediente) {
    return [];
  }

  return readStoredResults().filter(
    (result) => result.expediente.trim().toLowerCase() === normalizedExpediente,
  );
}

export function clearResults(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
