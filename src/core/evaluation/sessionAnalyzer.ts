import type { GeneratedSession } from "../generator/sessionGenerator";
import type { TrialResult } from "./trialScorer";

export interface SessionAnalysis {
  totalTrials: number;
  totalGo: number;
  totalNoGo: number;
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
  hitRate: number | null;
  missRate: number | null;
  falseAlarmRate: number | null;
  correctRejectionRate: number | null;
  accuracy: number | null;
  meanReactionTime: number | null;
  medianReactionTime: number | null;
  standardDeviationReactionTime: number | null;
  minReactionTime: number | null;
  maxReactionTime: number | null;
  percentile25ReactionTime: number | null;
  percentile75ReactionTime: number | null;
  dPrime: number | null;
  criterionC: number | null;
  coefficientOfVariationReactionTime: number | null;
  clinicalIndexes: {
    inhibitoryControl: number | null;
    sustainedAttention: number | null;
    processingSpeed: number | null;
    cognitiveConsistency: number | null;
    reconectaGlobalIndex: number | null;
  };
  interpretation: {
    inhibitoryControl: string | null;
    sustainedAttention: string | null;
    processingSpeed: string | null;
    cognitiveConsistency: string | null;
    reconectaGlobalIndex: string | null;
  };
}

function countResult(trialResult: TrialResult | null, expected: TrialResult): number {
  return trialResult === expected ? 1 : 0;
}

function calculatePercentage(numerator: number, denominator: number): number | null {
  if (denominator === 0) {
    return null;
  }

  const percentage = (numerator / denominator) * 100;
  const rounded = Math.round(percentage * 100) / 100;

  return Math.max(0, Math.min(100, rounded));
}

function correctedHitRate(hits: number, totalGo: number): number {
  return (hits + 0.5) / (totalGo + 1);
}

function correctedFalseAlarmRate(falseAlarms: number, totalNoGo: number): number {
  return (falseAlarms + 0.5) / (totalNoGo + 1);
}

function inverseNormalCDF(p: number): number {
  if (Number.isNaN(p)) {
    return Number.NaN;
  }

  if (p <= 0) {
    return Number.NEGATIVE_INFINITY;
  }

  if (p >= 1) {
    return Number.POSITIVE_INFINITY;
  }

  // Acklam's rational approximation for the standard normal quantile.
  const a = [
    -3.969683028665376e1,
    2.209460984245205e2,
    -2.759285104469687e2,
    1.38357751867269e2,
    -3.066479806614716e1,
    2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1,
    1.615858368580409e2,
    -1.556989798598866e2,
    6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3,
    -3.223964580411365e-1,
    -2.400758277161838,
    -2.549732539343734,
    4.374664141464968,
    2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3,
    3.224671290700398e-1,
    2.445134137142996,
    3.754408661907416,
  ];

  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }

  if (p <= pHigh) {
    const q = p - 0.5;
    const r = q * q;
    return (
      (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
      q /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }

  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(
    (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}

function calcularMedia(valores: number[]): number | null {
  if (valores.length === 0) {
    return null;
  }

  const suma = valores.reduce((acumulado, valor) => acumulado + valor, 0);
  return suma / valores.length;
}

function calcularMediana(valoresOrdenados: number[]): number | null {
  if (valoresOrdenados.length === 0) {
    return null;
  }

  const mitad = Math.floor(valoresOrdenados.length / 2);
  if (valoresOrdenados.length % 2 === 0) {
    return (valoresOrdenados[mitad - 1] + valoresOrdenados[mitad]) / 2;
  }

  return valoresOrdenados[mitad];
}

function calcularDesviacionEstandar(valores: number[]): number | null {
  const media = calcularMedia(valores);
  if (media === null) {
    return null;
  }

  const sumaCuadrados = valores.reduce((acumulado, valor) => {
    const diferencia = valor - media;
    return acumulado + diferencia * diferencia;
  }, 0);

  // Desviacion estandar poblacional para describir la sesion observada.
  return Math.sqrt(sumaCuadrados / valores.length);
}

function calcularPercentil(valoresOrdenados: number[], percentil: number): number | null {
  if (valoresOrdenados.length === 0) {
    return null;
  }

  if (percentil <= 0) {
    return valoresOrdenados[0];
  }

  if (percentil >= 100) {
    return valoresOrdenados[valoresOrdenados.length - 1];
  }

  const posicion = ((valoresOrdenados.length - 1) * percentil) / 100;
  const indiceInferior = Math.floor(posicion);
  const indiceSuperior = Math.ceil(posicion);

  if (indiceInferior === indiceSuperior) {
    return valoresOrdenados[indiceInferior];
  }

  const pesoSuperior = posicion - indiceInferior;
  const pesoInferior = 1 - pesoSuperior;

  return (
    valoresOrdenados[indiceInferior] * pesoInferior +
    valoresOrdenados[indiceSuperior] * pesoSuperior
  );
}

function createNullClinicalIndexes(): SessionAnalysis["clinicalIndexes"] {
  return {
    inhibitoryControl: null,
    sustainedAttention: null,
    processingSpeed: null,
    cognitiveConsistency: null,
    reconectaGlobalIndex: null,
  };
}

function createNullInterpretation(): SessionAnalysis["interpretation"] {
  return {
    inhibitoryControl: null,
    sustainedAttention: null,
    processingSpeed: null,
    cognitiveConsistency: null,
    reconectaGlobalIndex: null,
  };
}

function normalizeDPrimeForClinicalIndex(dPrime: number): number {
  if (dPrime <= 0) {
    return 0;
  }

  if (dPrime >= 4) {
    return 100;
  }

  return (dPrime / 4) * 100;
}

function calculateInhibitoryControlIndex(
  falseAlarmRate: number | null,
  correctRejectionRate: number | null,
  dPrime: number | null,
): number | null {
  if (falseAlarmRate === null || correctRejectionRate === null || dPrime === null) {
    return null;
  }

  const falseAlarmNormalized = 100 - falseAlarmRate;
  const dPrimeNormalized = normalizeDPrimeForClinicalIndex(dPrime);

  const score =
    falseAlarmNormalized * 0.5 +
    correctRejectionRate * 0.3 +
    dPrimeNormalized * 0.2;

  const clamped = Math.max(0, Math.min(100, score));
  return Math.round(clamped * 10) / 10;
}

function calculateSustainedAttentionIndex(
  hitRate: number | null,
  missRate: number | null,
): number | null {
  if (hitRate === null || missRate === null) {
    return null;
  }

  const score = hitRate * 0.7 + (100 - missRate) * 0.3;
  const clamped = Math.max(0, Math.min(100, score));
  return Math.round(clamped * 10) / 10;
}

function calculateProcessingSpeedIndex(
  meanReactionTime: number | null,
): number | null {
  if (meanReactionTime === null) {
    return null;
  }

  if (meanReactionTime <= 300) {
    return 100;
  }

  if (meanReactionTime >= 700) {
    return 0;
  }

  const score = 100 - ((meanReactionTime - 300) / 400) * 100;
  const clamped = Math.max(0, Math.min(100, score));
  return Math.round(clamped * 10) / 10;
}

function calculateCoefficientOfVariationReactionTime(
  meanReactionTime: number | null,
  standardDeviationReactionTime: number | null,
): number | null {
  if (meanReactionTime === null || standardDeviationReactionTime === null) {
    return null;
  }

  return (standardDeviationReactionTime / meanReactionTime) * 100;
}

function calculateCognitiveConsistencyIndex(
  coefficientOfVariationReactionTime: number | null,
): number | null {
  if (coefficientOfVariationReactionTime === null) {
    return null;
  }

  if (coefficientOfVariationReactionTime <= 10) {
    return 100;
  }

  if (coefficientOfVariationReactionTime >= 40) {
    return 0;
  }

  const score = 100 - ((coefficientOfVariationReactionTime - 10) / 30) * 100;
  const clamped = Math.max(0, Math.min(100, score));
  return Math.round(clamped * 10) / 10;
}

function calculateReconectaGlobalIndex(
  inhibitoryControl: number | null,
  sustainedAttention: number | null,
  processingSpeed: number | null,
  cognitiveConsistency: number | null,
): number | null {
  if (
    inhibitoryControl === null ||
    sustainedAttention === null ||
    processingSpeed === null ||
    cognitiveConsistency === null
  ) {
    return null;
  }

  const score =
    inhibitoryControl * 0.4 +
    sustainedAttention * 0.25 +
    processingSpeed * 0.15 +
    cognitiveConsistency * 0.2;

  return Math.round(score * 10) / 10;
}

function interpretCognitiveConsistency(score: number | null): string | null {
  if (score === null) {
    return null;
  }

  if (score >= 90) {
    return "Excelente";
  }

  if (score >= 80) {
    return "Muy bueno";
  }

  if (score >= 70) {
    return "Adecuado";
  }

  if (score >= 60) {
    return "Leve alteración";
  }

  if (score >= 40) {
    return "Alteración moderada";
  }

  if (score >= 20) {
    return "Alteración importante";
  }

  return "Alteración severa";
}

function interpretInhibitoryControl(score: number | null): string | null {
  if (score === null) {
    return null;
  }

  if (score >= 90) {
    return "Excelente";
  }

  if (score >= 80) {
    return "Muy bueno";
  }

  if (score >= 70) {
    return "Adecuado";
  }

  if (score >= 60) {
    return "Leve alteracion";
  }

  if (score >= 40) {
    return "Alteracion moderada";
  }

  if (score >= 20) {
    return "Alteracion importante";
  }

  return "Alteracion severa";
}

function interpretSustainedAttention(score: number | null): string | null {
  if (score === null) {
    return null;
  }

  if (score >= 90) {
    return "Excelente";
  }

  if (score >= 80) {
    return "Muy bueno";
  }

  if (score >= 70) {
    return "Adecuado";
  }

  if (score >= 60) {
    return "Leve alteracion";
  }

  if (score >= 40) {
    return "Alteracion moderada";
  }

  if (score >= 20) {
    return "Alteracion importante";
  }

  return "Alteracion severa";
}

function interpretProcessingSpeed(score: number | null): string | null {
  if (score === null) {
    return null;
  }

  if (score >= 90) {
    return "Excelente";
  }

  if (score >= 80) {
    return "Muy bueno";
  }

  if (score >= 70) {
    return "Adecuado";
  }

  if (score >= 60) {
    return "Leve alteracion";
  }

  if (score >= 40) {
    return "Alteracion moderada";
  }

  if (score >= 20) {
    return "Alteracion importante";
  }

  return "Alteracion severa";
}

function interpretReconectaGlobalIndex(score: number | null): string | null {
  if (score === null) {
    return null;
  }

  if (score >= 90) {
    return "Excelente";
  }

  if (score >= 80) {
    return "Muy bueno";
  }

  if (score >= 70) {
    return "Adecuado";
  }

  if (score >= 60) {
    return "Leve alteración";
  }

  if (score >= 40) {
    return "Alteración moderada";
  }

  if (score >= 20) {
    return "Alteración importante";
  }

  return "Alteración severa";
}

export function analyzeSession(
  session: Pick<GeneratedSession, "trials">,
): SessionAnalysis {
  let totalGo = 0;
  let totalNoGo = 0;
  let hits = 0;
  let misses = 0;
  let falseAlarms = 0;
  let correctRejections = 0;

  const hitReactionTimes: number[] = [];

  for (const trial of session.trials) {
    if (trial.type === "GO") {
      totalGo += 1;
    } else {
      totalNoGo += 1;
    }

    hits += countResult(trial.result, "HIT");
    misses += countResult(trial.result, "MISS");
    falseAlarms += countResult(trial.result, "FALSE_ALARM");
    correctRejections += countResult(trial.result, "CORRECT_REJECTION");

    if (trial.result === "HIT" && trial.reactionTime !== null) {
      hitReactionTimes.push(trial.reactionTime);
    }
  }

  let dPrime: number | null = null;
  let criterionC: number | null = null;

  if (totalGo > 0 && totalNoGo > 0) {
    const zHit = inverseNormalCDF(correctedHitRate(hits, totalGo));
    const zFalseAlarm = inverseNormalCDF(
      correctedFalseAlarmRate(falseAlarms, totalNoGo),
    );

    dPrime = zHit - zFalseAlarm;
    criterionC = -(zHit + zFalseAlarm) / 2;
  }

  const falseAlarmRate = calculatePercentage(falseAlarms, totalNoGo);
  const correctRejectionRate = calculatePercentage(correctRejections, totalNoGo);
  const hitRate = calculatePercentage(hits, totalGo);
  const missRate = calculatePercentage(misses, totalGo);
  const inhibitoryControlIndex = calculateInhibitoryControlIndex(
    falseAlarmRate,
    correctRejectionRate,
    dPrime,
  );
  const inhibitoryControlInterpretation = interpretInhibitoryControl(
    inhibitoryControlIndex,
  );
  const sustainedAttentionIndex = calculateSustainedAttentionIndex(
    hitRate,
    missRate,
  );
  const sustainedAttentionInterpretation = interpretSustainedAttention(
    sustainedAttentionIndex,
  );
  const meanReactionTime = calcularMedia(hitReactionTimes);
  const standardDeviationReactionTime = calcularDesviacionEstandar(hitReactionTimes);
  const coefficientOfVariationReactionTime = calculateCoefficientOfVariationReactionTime(
    meanReactionTime,
    standardDeviationReactionTime,
  );
  const cognitiveConsistencyIndex = calculateCognitiveConsistencyIndex(
    coefficientOfVariationReactionTime,
  );
  const cognitiveConsistencyInterpretation = interpretCognitiveConsistency(
    cognitiveConsistencyIndex,
  );
  const processingSpeedIndex = calculateProcessingSpeedIndex(meanReactionTime);
  const processingSpeedInterpretation = interpretProcessingSpeed(
    processingSpeedIndex,
  );
  const reconectaGlobalIndex = calculateReconectaGlobalIndex(
    inhibitoryControlIndex,
    sustainedAttentionIndex,
    processingSpeedIndex,
    cognitiveConsistencyIndex,
  );
  const reconectaGlobalInterpretation = interpretReconectaGlobalIndex(
    reconectaGlobalIndex,
  );

  if (hitReactionTimes.length === 0) {
    return {
      totalTrials: session.trials.length,
      totalGo,
      totalNoGo,
      hits,
      misses,
      falseAlarms,
      correctRejections,
      hitRate,
      missRate,
      falseAlarmRate,
      correctRejectionRate,
      accuracy: calculatePercentage(hits + correctRejections, session.trials.length),
      meanReactionTime: null,
      medianReactionTime: null,
      standardDeviationReactionTime: null,
      minReactionTime: null,
      maxReactionTime: null,
      percentile25ReactionTime: null,
      percentile75ReactionTime: null,
      dPrime,
      criterionC,
      coefficientOfVariationReactionTime,
      clinicalIndexes: {
        ...createNullClinicalIndexes(),
        inhibitoryControl: inhibitoryControlIndex,
        sustainedAttention: sustainedAttentionIndex,
        processingSpeed: processingSpeedIndex,
        cognitiveConsistency: cognitiveConsistencyIndex,
        reconectaGlobalIndex,
      },
      interpretation: {
        ...createNullInterpretation(),
        inhibitoryControl: inhibitoryControlInterpretation,
        sustainedAttention: sustainedAttentionInterpretation,
        processingSpeed: processingSpeedInterpretation,
        cognitiveConsistency: cognitiveConsistencyInterpretation,
        reconectaGlobalIndex: reconectaGlobalInterpretation,
      },
    };
  }

  const reactionTimesOrdenados = [...hitReactionTimes].sort((a, b) => a - b);

  return {
    totalTrials: session.trials.length,
    totalGo,
    totalNoGo,
    hits,
    misses,
    falseAlarms,
    correctRejections,
    hitRate,
    missRate,
    falseAlarmRate,
    correctRejectionRate,
    accuracy: calculatePercentage(hits + correctRejections, session.trials.length),
    meanReactionTime,
    medianReactionTime: calcularMediana(reactionTimesOrdenados),
    standardDeviationReactionTime: calcularDesviacionEstandar(hitReactionTimes),
    minReactionTime: reactionTimesOrdenados[0],
    maxReactionTime: reactionTimesOrdenados[reactionTimesOrdenados.length - 1],
    percentile25ReactionTime: calcularPercentil(reactionTimesOrdenados, 25),
    percentile75ReactionTime: calcularPercentil(reactionTimesOrdenados, 75),
    dPrime,
    criterionC,
    coefficientOfVariationReactionTime,
    clinicalIndexes: {
      ...createNullClinicalIndexes(),
      inhibitoryControl: inhibitoryControlIndex,
      sustainedAttention: sustainedAttentionIndex,
      processingSpeed: processingSpeedIndex,
      cognitiveConsistency: cognitiveConsistencyIndex,
      reconectaGlobalIndex,
    },
    interpretation: {
      ...createNullInterpretation(),
      inhibitoryControl: inhibitoryControlInterpretation,
      sustainedAttention: sustainedAttentionInterpretation,
      processingSpeed: processingSpeedInterpretation,
      cognitiveConsistency: cognitiveConsistencyInterpretation,
      reconectaGlobalIndex: reconectaGlobalInterpretation,
    },
  };
}