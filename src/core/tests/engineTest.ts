import { LEVELS } from "../levels";
import { generateSession } from "../generator/sessionGenerator";
import {
  alcoholStimuli,
  cocainaStimuli,
  cristalStimuli,
  goStimuli,
  type Stimulus,
} from "../stimuli";

type GeneratedSession = ReturnType<typeof generateSession>;

type SessionFailure = {
  sessionNumber: number;
  expediente: string;
  substance: string;
  level: string;
  error: string;
};

// Normaliza texto para comparar sustancias con o sin acentos, mayusculas o espacios.
function normalizeSubstance(substance: string): string {
  return substance
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Devuelve el catalogo NO_GO permitido para una sustancia especifica.
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

  return [...alcoholStimuli, ...cristalStimuli, ...cocainaStimuli];
}

// Calcula la distribucion esperada de GO y NO_GO de acuerdo con el nivel.
function calculateExpectedCounts(totalTrials: number, noGoPercentage: number): {
  goCount: number;
  noGoCount: number;
} {
  const noGoCount = Math.round(totalTrials * (noGoPercentage / 100));
  const goCount = totalTrials - noGoCount;

  return { goCount, noGoCount };
}

// Obtiene un timestamp de alta precision cuando esta disponible.
function getNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }

  return Date.now();
}

// Valida que la sesion cumpla reglas estructurales y de contenido.
function validateSession(
  session: GeneratedSession,
  expectedSubstance: string,
  expectedLevelId: string,
): void {
  const levelConfig = LEVELS[expectedLevelId];

  if (!levelConfig) {
    throw new Error(`Nivel no encontrado: ${expectedLevelId}`);
  }

  const { goCount: expectedGo, noGoCount: expectedNoGo } = calculateExpectedCounts(
    levelConfig.trials,
    levelConfig.noGoPercentage,
  );

  // Verifica metadata minima requerida.
  if (!session.id || session.id.trim().length === 0) {
    throw new Error("La sesion no contiene un id valido.");
  }

  if (!(session.createdAt instanceof Date) || Number.isNaN(session.createdAt.getTime())) {
    throw new Error("La sesion no contiene createdAt valido.");
  }

  if (!session.version || session.version.trim().length === 0) {
    throw new Error("La sesion no contiene version valida.");
  }

  // Verifica la cantidad total de ensayos.
  if (session.trials.length !== levelConfig.trials) {
    throw new Error(
      `Cantidad de ensayos invalida. Esperado ${levelConfig.trials}, obtenido ${session.trials.length}.`,
    );
  }

  if (session.summary.totalTrials !== levelConfig.trials) {
    throw new Error(
      `Resumen totalTrials invalido. Esperado ${levelConfig.trials}, obtenido ${session.summary.totalTrials}.`,
    );
  }

  const goTrials = session.trials.filter((trial) => trial.type === "GO");
  const noGoTrials = session.trials.filter((trial) => trial.type === "NO_GO");

  // Verifica conteo de GO y NO_GO tanto en ensayos como en summary.
  if (goTrials.length !== expectedGo) {
    throw new Error(`Conteo GO invalido. Esperado ${expectedGo}, obtenido ${goTrials.length}.`);
  }

  if (noGoTrials.length !== expectedNoGo) {
    throw new Error(`Conteo NO_GO invalido. Esperado ${expectedNoGo}, obtenido ${noGoTrials.length}.`);
  }

  if (session.summary.go !== expectedGo) {
    throw new Error(`Resumen GO invalido. Esperado ${expectedGo}, obtenido ${session.summary.go}.`);
  }

  if (session.summary.noGo !== expectedNoGo) {
    throw new Error(
      `Resumen NO_GO invalido. Esperado ${expectedNoGo}, obtenido ${session.summary.noGo}.`,
    );
  }

  const goAllowedIds = new Set(goStimuli.map((stimulus) => stimulus.id));

  // Verifica que todas las imagenes GO existan solo en el catalogo GO.
  for (const trial of goTrials) {
    if (!goAllowedIds.has(trial.stimulus.id)) {
      throw new Error(
        `Estimulo GO fuera de catalogo: ${trial.stimulus.id} (${trial.stimulus.image}).`,
      );
    }
  }

  const noGoAllowedIds = new Set(
    getNoGoCatalogBySubstance(expectedSubstance).map((stimulus) => stimulus.id),
  );

  // Verifica que los NO_GO pertenezcan al catalogo de la sustancia seleccionada.
  for (const trial of noGoTrials) {
    if (!noGoAllowedIds.has(trial.stimulus.id)) {
      throw new Error(
        `Estimulo NO_GO fuera de catalogo para ${expectedSubstance}: ${trial.stimulus.id} (${trial.stimulus.image}).`,
      );
    }
  }
}

export function runEngineTest(iterations: number): void {
  const totalIterations = Math.max(0, Math.floor(iterations));

  if (totalIterations <= 0) {
    console.log("[EngineTest] No hay sesiones para evaluar (iterations <= 0).");
    return;
  }

  const startTime = getNow();
  const levelIds = Object.keys(LEVELS);
  const substances = ["alcohol", "cristal", "cocaina"];

  let successCount = 0;
  const failures: SessionFailure[] = [];

  // Genera y valida multiples sesiones para estresar el motor de generacion.
  for (let index = 0; index < totalIterations; index += 1) {
    const sessionNumber = index + 1;
    const expediente = `EXP-${String(sessionNumber).padStart(5, "0")}`;
    const substance = substances[index % substances.length];
    const levelId = levelIds[index % levelIds.length];

    try {
      const session = generateSession(expediente, substance, levelId);
      validateSession(session, substance, levelId);
      successCount += 1;
    } catch (error) {
      failures.push({
        sessionNumber,
        expediente,
        substance,
        level: levelId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const endTime = getNow();
  const totalTimeMs = endTime - startTime;
  const errorCount = failures.length;

  // Reporte de resumen principal.
  console.log("=== Resumen Engine Test ===");
  console.log(`Sesiones evaluadas: ${totalIterations}`);
  console.log(`Sesiones correctas: ${successCount}`);
  console.log(`Sesiones con error: ${errorCount}`);
  console.log(`Tiempo total de ejecucion: ${totalTimeMs.toFixed(2)} ms`);

  // Reporte detallado de fallas para diagnostico rapido.
  if (failures.length > 0) {
    console.log("=== Detalle de sesiones con error ===");

    for (const failure of failures) {
      console.log(
        `Sesion #${failure.sessionNumber} | Expediente: ${failure.expediente} | Sustancia: ${failure.substance} | Nivel: ${failure.level} | Error: ${failure.error}`,
      );
    }
  }
}
