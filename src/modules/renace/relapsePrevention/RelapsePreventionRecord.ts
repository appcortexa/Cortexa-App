/**
 * Modelo compartido para los registros de intervenciones de prevención de recaídas.
 * Sus campos son opcionales para poder reutilizarlo entre los distintos ejercicios.
 */
export interface RelapsePreventionRecord {
  id?: string;
  riskSituation?: string;
  warningSigns?: string[];
  protectiveFactors?: string[];
  copingPlan?: string;
  confidenceLevel?: number;
  notes?: string;
}
