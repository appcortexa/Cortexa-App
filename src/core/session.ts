import type { Stimulus } from "./stimuli";

// Representa un intento individual dentro de la evaluación Go/No-Go.
export interface Trial {
  trialNumber: number;
  stimulus: Stimulus;
  expectedResponse: boolean;
  response: boolean | null;
  reactionTime: number | null;
  isCorrect: boolean | null;
  stimulusDuration: number;
  isi: number;
}

// Resume el rendimiento global de la sesión al finalizar los intentos.
export interface SessionSummary {
  commissionErrors: number;
  omissionErrors: number;
  correctResponses: number;
  averageReactionTime: number;
  minimumReactionTime: number;
  maximumReactionTime: number;
  accuracy: number;
  canAdvanceLevel: boolean;
}

// Define la estructura completa de una sesión de evaluación y su estado.
export interface EvaluationSession {
  sessionId: string;
  date: Date;
  expediente: string;
  substance: string;
  level: string;
  totalTrials: number;
  completedTrials: number;
  status: "READY" | "RUNNING" | "FINISHED";
  trials: Trial[];
  summary: SessionSummary | null;
}
