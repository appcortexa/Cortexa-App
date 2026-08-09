import { Alert, Button, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { SelfCompassionRecord } from "../../../selfCompassion/SelfCompassionRecord";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import EmotionSelector from "../../emotionRegulation/components/EmotionSelector";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type SelfCriticalDialogueRecord = Pick<SelfCompassionRecord, "situation" | "selfCriticalThought" | "emotion" | "intensity">;

type RegisterPageState = {
	records?: SelfCriticalDialogueRecord[];
};

const emotionOptions = ["Tristeza", "Ansiedad", "Enojo", "Vergüenza", "Culpa", "Frustración", "Miedo", "Soledad"];

function sanitizeRecords(state: unknown): SelfCriticalDialogueRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as RegisterPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.situation === "string" &&
			typeof record.selfCriticalThought === "string" &&
			typeof record.emotion === "string" &&
			typeof record.intensity === "number",
	);
}

function SelfCompassionDetectionRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<SelfCriticalDialogueRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [selfCriticalThought, setSelfCriticalThought] = useState("");
	const [emotion, setEmotion] = useState("");
	const [intensity, setIntensity] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [thoughtError, setThoughtError] = useState(false);
	const [emotionError, setEmotionError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(initialRecords.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setSelfCriticalThought("");
		setEmotion("");
		setIntensity(5);
		setSituationError(false);
		setThoughtError(false);
		setEmotionError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const trimmedThought = selfCriticalThought.trim();
		const trimmedEmotion = emotion.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasThought = trimmedThought.length > 0;
		const hasEmotion = trimmedEmotion.length > 0;

		setSituationError(!hasSituation);
		setThoughtError(!hasThought);
		setEmotionError(!hasEmotion);

		if (!hasSituation || !hasThought || !hasEmotion) {
			return;
		}

		setRecords((currentRecords) => [
			...currentRecords,
			{
				situation: trimmedSituation,
				selfCriticalThought: trimmedThought,
				emotion: trimmedEmotion,
				intensity,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinish = () => {
		navigate("/renace/autocompasion/deteccion-dialogo-autocritico/resumen", { state: { records } });
	};

	return (
		<InterventionScreenLayout
			title="Registro del diálogo autocrítico"
			description="Registra situaciones en las que apareció un pensamiento crítico hacia ti mismo y la emoción asociada."
			actions={
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/renace/autocompasion/deteccion-dialogo-autocritico/introduccion")}
				>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					fullWidth
					label="Situación"
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

				<TextField
					required
					fullWidth
					label="¿Qué te dijiste a ti mismo?"
					value={selfCriticalThought}
					onChange={(event) => {
						setSelfCriticalThought(event.target.value);
						if (thoughtError && event.target.value.trim().length > 0) {
							setThoughtError(false);
						}
					}}
					error={thoughtError}
					helperText={thoughtError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionSelector
					label="Emoción predominante"
					options={emotionOptions}
					value={emotion}
					onChange={setEmotion}
					error={emotionError}
					helperText={emotionError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider label="Intensidad emocional" value={intensity} onChange={setIntensity} />

				<ExerciseEntryActions
					onSave={handleSaveRecord}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinish}
					canSave
					showAddAnother={showPostSaveActions}
					showFinish={records.length > 0}
				/>

				{records.length > 0 ? (
					<Alert severity="success">Registro guardado. Puedes agregar otro ejercicio o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay registros guardados.</Alert>
				)}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionDetectionRegisterPage;
