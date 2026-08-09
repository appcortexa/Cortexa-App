import { Alert, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import EmotionSelector from "../components/EmotionSelector";

type EmotionDifferenceRecord = {
	situation: string;
	emotions: string[];
	predominantEmotion: string;
	clarity: number;
};

type RegisterPageState = {
	records?: EmotionDifferenceRecord[];
};

const emotionOptions = ["Tristeza", "Ansiedad", "Enojo", "Culpa", "Verguenza", "Frustración", "Miedo"];

function sanitizeRecords(state: unknown): EmotionDifferenceRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as RegisterPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record): record is EmotionDifferenceRecord =>
			typeof record.situation === "string" &&
			Array.isArray(record.emotions) &&
			typeof record.predominantEmotion === "string" &&
			typeof record.clarity === "number",
	);
}

function EmotionDifferenceRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { session } = useRenaceSession();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<EmotionDifferenceRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
	const [predominantEmotion, setPredominantEmotion] = useState("");
	const [clarity, setClarity] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [emotionsError, setEmotionsError] = useState(false);
	const [predominantEmotionError, setPredominantEmotionError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setSelectedEmotions([]);
		setPredominantEmotion("");
		setClarity(5);
		setSituationError(false);
		setEmotionsError(false);
		setPredominantEmotionError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasEmotions = selectedEmotions.length > 0;
		const hasPredominantEmotion = predominantEmotion.trim().length > 0;

		setSituationError(!hasSituation);
		setEmotionsError(!hasEmotions);
		setPredominantEmotionError(!hasPredominantEmotion);

		if (!hasSituation || !hasEmotions || !hasPredominantEmotion) {
			return;
		}

		const nextRecord: EmotionDifferenceRecord = {
			situation: trimmedSituation,
			emotions: selectedEmotions,
			predominantEmotion,
			clarity,
		};

		setRecords((currentRecords) => [...currentRecords, nextRecord]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/regulacion-emocional/diferenciacion-emocional/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;
	const availablePredominantEmotions = selectedEmotions.filter(Boolean);

	return (
		<InterventionScreenLayout
			title="Registro de Diferenciación Emocional"
			description="Registra una situación por vez, identifica las emociones presentes, elige cuál predominó y evalúa qué tan claras resultaron esas diferencias."
			actions={
				<ExerciseEntryActions
					onSave={handleSaveRecord}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinalize}
					canSave
					showAddAnother={showPostSaveActions}
					showFinish={canFinalize}
				/>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					fullWidth
					label="¿Qué situación ocurrió?"
					value={situation}
					onChange={(event) => {
						setSituation(event.target.value);
						if (situationError && event.target.value.trim().length > 0) {
							setSituationError(false);
						}
					}}
					error={situationError}
					helperText={situationError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionSelector
					label="¿Qué emociones estuvieron presentes?"
					options={emotionOptions}
					value={selectedEmotions}
					onChange={(nextValue) => {
						setSelectedEmotions((currentValues) => {
							if (currentValues.includes(nextValue)) {
								return currentValues.filter((value) => value !== nextValue);
							}

							if (currentValues.length >= 3) {
								return currentValues;
							}

							return [...currentValues, nextValue];
						});
						setPredominantEmotion("");
						if (emotionsError && selectedEmotions.length > 0) {
							setEmotionsError(false);
						}
					}}
					multiple
					error={emotionsError}
					helperText={emotionsError ? "Selecciona al menos una emoción." : "Puedes elegir hasta tres emociones."}
				/>

				<TextField
					select
					fullWidth
					label="¿Cuál fue la emoción predominante?"
					value={predominantEmotion}
					onChange={(event) => {
						setPredominantEmotion(event.target.value);
						if (predominantEmotionError && event.target.value.trim().length > 0) {
							setPredominantEmotionError(false);
						}
					}}
					error={predominantEmotionError}
					helperText={predominantEmotionError ? "Selecciona una emoción predominante." : " "}
				>
					{availablePredominantEmotions.map((emotionOption) => (
						<MenuItem key={emotionOption} value={emotionOption}>
							{emotionOption}
						</MenuItem>
					))}
				</TextField>

				<EmotionIntensitySlider
					label="Claridad emocional"
					value={clarity}
					onChange={setClarity}
				/>

				{records.length > 0 ? (
					<Alert severity="success">
						Registro guardado. Puedes agregar otro ejercicio o finalizar.
					</Alert>
				) : (
					<Alert severity="info">Aún no hay registros de diferenciación emocional.</Alert>
				)}

				{session ? (
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Expediente: {session.expediente}
					</Typography>
				) : null}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default EmotionDifferenceRegisterPage;
