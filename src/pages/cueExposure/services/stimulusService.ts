import { alcoholStimuli, cocainaStimuli, cristalStimuli, type Stimulus } from "../../../core/stimuli";

type CueExposureSubstanceId = "alcohol" | "metanfetaminas" | "cocaina";

const SUBSTANCE_STIMULI_MAP: Record<CueExposureSubstanceId, readonly Stimulus[]> = {
	alcohol: alcoholStimuli,
	metanfetaminas: cristalStimuli,
	cocaina: cocainaStimuli,
};

export interface StimulusService {
	getAllImages: () => string[];
	getNextImage: () => string;
}

function shuffleImages(images: readonly string[]): string[] {
	const shuffled = [...images];

	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}

	return shuffled;
}

function buildImagePool(substanceId: CueExposureSubstanceId): string[] {
	return SUBSTANCE_STIMULI_MAP[substanceId].map((stimulus) => stimulus.image);
}

export function createStimulusService(substanceId: string): StimulusService {
	const normalizedSubstanceId = (substanceId === "cristal" ? "metanfetaminas" : substanceId) as CueExposureSubstanceId;
	const sourceImages = buildImagePool(normalizedSubstanceId);
	let remainingImages = shuffleImages(sourceImages);
	let previousImage: string | null = null;

	function refillPool(): void {
		remainingImages = shuffleImages(sourceImages);

		if (previousImage && remainingImages.length > 1 && remainingImages[0] === previousImage) {
			[remainingImages[0], remainingImages[1]] = [remainingImages[1], remainingImages[0]];
		}
	}

	function getNextImage(): string {
		if (sourceImages.length === 0) {
			return "";
		}

		if (remainingImages.length === 0) {
			refillPool();
		}

		let nextImage = remainingImages.shift() ?? sourceImages[0];

		if (previousImage && sourceImages.length > 1 && nextImage === previousImage) {
			if (remainingImages.length === 0) {
				refillPool();
			}

			const alternativeIndex = remainingImages.findIndex((image) => image !== previousImage);

			if (alternativeIndex >= 0) {
				const [alternativeImage] = remainingImages.splice(alternativeIndex, 1);
				remainingImages.unshift(nextImage);
				nextImage = alternativeImage;
			}
		}

		previousImage = nextImage;
		return nextImage;
	}

	return {
		getAllImages: () => [...sourceImages],
		getNextImage,
	};
}
