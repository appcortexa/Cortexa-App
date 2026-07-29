export type TrialType = "GO" | "NO_GO";

export interface SequenceValidationResult {
    isValid: boolean;
    errors: string[];
}

/**
 * Cuenta cuantas veces aparece un tipo de ensayo en la secuencia.
 */
function countTrialsByType(sequence: TrialType[], trialType: TrialType): number {
    return sequence.reduce((total, current) => {
        return current === trialType ? total + 1 : total;
    }, 0);
}

/**
 * Valida una secuencia de ensayos GO/NO_GO segun reglas de consistencia.
 *
 * Nota: La validacion de distribucion homogenea y deteccion de patrones
 * repetitivos se implementara en una segunda version del validador.
 */
export function validateSequence(
    sequence: TrialType[],
    expectedGo: number,
    expectedNoGo: number
): SequenceValidationResult {
    const errors: string[] = [];

    const goCount = countTrialsByType(sequence, "GO");
    const noGoCount = countTrialsByType(sequence, "NO_GO");

    // Regla 1: Numero exacto de ensayos GO.
    if (goCount !== expectedGo) {
        errors.push(
            `Cantidad de GO invalida: se esperaban ${expectedGo} y se encontraron ${goCount}.`
        );
    }

    // Regla 2: Numero exacto de ensayos NO_GO.
    if (noGoCount !== expectedNoGo) {
        errors.push(
            `Cantidad de NO_GO invalida: se esperaban ${expectedNoGo} y se encontraron ${noGoCount}.`
        );
    }

    // Regla 3: Nunca dos NO_GO consecutivos.
    for (let i = 1; i < sequence.length; i += 1) {
        if (sequence[i] === "NO_GO" && sequence[i - 1] === "NO_GO") {
            errors.push(`Hay dos NO_GO consecutivos en las posiciones ${i} y ${i + 1}.`);
            break;
        }
    }

    // Regla 4: Nunca mas de cinco GO consecutivos.
    let goStreak = 0;
    for (const trial of sequence) {
        if (trial === "GO") {
            goStreak += 1;
            if (goStreak > 5) {
                errors.push("Hay mas de cinco ensayos GO consecutivos.");
                break;
            }
        } else {
            goStreak = 0;
        }
    }

    // Regla 5: El primer NO_GO debe aparecer a partir del ensayo 4.
    const firstNoGoIndex = sequence.indexOf("NO_GO");
    if (firstNoGoIndex !== -1 && firstNoGoIndex < 3) {
        errors.push(
            `El primer NO_GO aparece demasiado pronto (ensayo ${firstNoGoIndex + 1}). Debe aparecer a partir del ensayo 4.`
        );
    }

    // Regla 6: En los primeros cinco ensayos puede existir maximo un NO_GO.
    const firstFive = sequence.slice(0, 5);
    const noGoInFirstFive = countTrialsByType(firstFive, "NO_GO");
    if (noGoInFirstFive > 1) {
        errors.push("En los primeros cinco ensayos hay mas de un NO_GO.");
    }

    // Regla 7: En los ultimos cinco ensayos puede existir maximo un NO_GO.
    const lastFive = sequence.slice(-5);
    const noGoInLastFive = countTrialsByType(lastFive, "NO_GO");
    if (noGoInLastFive > 1) {
        errors.push("En los ultimos cinco ensayos hay mas de un NO_GO.");
    }

    // Regla 8: El ultimo ensayo debe ser GO.
    if (sequence.length === 0 || sequence[sequence.length - 1] !== "GO") {
        errors.push("El ultimo ensayo debe ser GO.");
    }

    if (errors.length === 0) {
        return {
            isValid: true,
            errors: []
        };
    }

    return {
        isValid: false,
        errors
    };
}
