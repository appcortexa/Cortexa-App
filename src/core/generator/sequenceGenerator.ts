import { validateSequence, type TrialType } from "./sequenceValidator";

const MAX_GO_STREAK = 5;
const MIN_FIRST_BLOCK = 3;
const MIN_INTERNAL_BLOCK = 1;
const MIN_LAST_BLOCK = 1;

interface Block {
    index: number;
    goCount: number;
    capacity: number;
}

/**
 * Fisher-Yates.
 */
function shuffle<T>(array: T[]): T[] {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

/**
 * Construye la estructura mínima obligatoria.
 */
function buildBlocks(noGoCount: number): Block[] {
    const blockCount = noGoCount + 1;
    const blocks: Block[] = [];

    for (let i = 0; i < blockCount; i++) {

        let minimum = MIN_INTERNAL_BLOCK;

        if (i === 0) {
            minimum = MIN_FIRST_BLOCK;
        }

        if (i === blockCount - 1) {
            minimum = MIN_LAST_BLOCK;
        }

        blocks.push({
            index: i,
            goCount: minimum,
            capacity: MAX_GO_STREAK - minimum
        });
    }

    return blocks;
}

/**
 * Reparte los GO restantes.
 *
 * La distribución es pseudoaleatoria,
 * equilibrada
 * y nunca excede cinco GO consecutivos.
 */
function distributeGo(blocks: Block[], remaining: number): void {

    while (remaining > 0) {

        const order = shuffle(
            blocks
                .filter(block => block.capacity > 0)
                .map(block => block.index)
        );

        if (order.length === 0) {
            throw new Error("No existe capacidad suficiente para distribuir GO.");
        }

        let distributed = false;

        for (const index of order) {

            if (remaining === 0) {
                break;
            }

            const block = blocks[index];

            if (block.capacity === 0) {
                continue;
            }

            block.goCount++;
            block.capacity--;

            remaining--;

            distributed = true;
        }

        if (!distributed) {
            throw new Error("Distribución imposible.");
        }
    }
}

/**
 * Evita patrones como:
 *
 * 5-5-5-5
 * 4-4-4
 * 3-3-3
 *
 * mezclando únicamente tamaños de bloque.
 */
function reducePatterns(blocks: Block[]): void {

    for (let i = 2; i < blocks.length; i++) {

        const a = blocks[i - 2];
        const b = blocks[i - 1];
        const c = blocks[i];

        if (
            a.goCount === b.goCount &&
            b.goCount === c.goCount
        ) {

            const candidates = shuffle(
                blocks.filter(block =>
                    block.goCount !== c.goCount &&
                    block.index !== 0 &&
                    block.index !== blocks.length - 1
                )
            );

            if (candidates.length > 0) {

                const candidate = candidates[0];

                const temp = candidate.goCount;

                candidate.goCount = c.goCount;
                c.goCount = temp;
            }
        }
    }
}

/**
 * Convierte bloques GO en la secuencia final.
 */
function buildSequence(
    blocks: Block[],
    noGoCount: number
): TrialType[] {

    const sequence: TrialType[] = [];

    for (let i = 0; i < blocks.length; i++) {

        for (let j = 0; j < blocks[i].goCount; j++) {
            sequence.push("GO");
        }

        if (i < noGoCount) {
            sequence.push("NO_GO");
        }
    }

    return sequence;
}

/**
 * Generador clínico oficial Reconecta.
 */
export function generateSequence(
    totalTrials: number,
    noGoCount: number
): TrialType[] {

    const trials = Math.floor(totalTrials);
    const noGo = Math.floor(noGoCount);

    if (trials <= 0) {
        throw new Error("Total de ensayos inválido.");
    }

    if (noGo < 0) {
        throw new Error("Cantidad NO_GO inválida.");
    }

    if (noGo >= trials) {
        throw new Error("Cantidad NO_GO inválida.");
    }

    const go = trials - noGo;

    const blocks = buildBlocks(noGo);

    const minimumGo =
        blocks.reduce(
            (sum, block) => sum + block.goCount,
            0
        );

    if (go < minimumGo) {
        throw new Error(
            "No existen suficientes GO para cumplir las restricciones clínicas."
        );
    }

    const maximumGo =
        blocks.length * MAX_GO_STREAK;

    if (go > maximumGo) {
        throw new Error(
            "Demasiados GO para respetar el máximo de cinco consecutivos."
        );
    }

    distributeGo(
        blocks,
        go - minimumGo
    );

    reducePatterns(blocks);

    const sequence =
        buildSequence(
            blocks,
            noGo
        );

    if (sequence.length !== trials) {
        throw new Error(
            "Longitud de secuencia incorrecta."
        );
    }

    const validation =
        validateSequence(
            sequence,
            go,
            noGo
        );

    if (!validation.isValid) {
        throw new Error(
            validation.errors.join(" | ")
        );
    }

    return sequence;
}