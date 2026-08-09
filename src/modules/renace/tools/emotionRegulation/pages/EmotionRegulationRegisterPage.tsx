import { Alert, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import EmotionSelector from "../components/EmotionSelector";
import type { EmotionRecord } from "../models/EmotionRecord";

type RegisterPageState = {
	records?: EmotionRecord[];
};

const emotionOptions = ["Tristeza", "Ansiedad", "Enojo", "Culpa", "Verguenza", "Frustración", "Miedo"];

function sanitizeRecords(state: unknown): EmotionRecord[] {
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
			typeof record.emotion === "string" &&
			typeof record.intensity === "number" &&
			Array.isArray(record.physicalSensations),
	);
}

function buildRecordId() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}

	return `emotion-${Date.now()}`;
}

function EmotionRegulationRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { session } = useRenaceSession();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<EmotionRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [emotion, setEmotion] = useState(emotionOptions[0]);
	const [intensity, setIntensity] = useState(5);
	const [physicalSensations, setPhysicalSensations] = useState("");
	const [situationError, setSituationError] = useState(false);
	const [physicalSensationsError, setPhysicalSensationsError] = useState(false);
	const [emotionError, setEmotionError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setEmotion(emotionOptions[0]);
		setIntensity(5);
		setPhysicalSensations("");
		setSituationError(false);
		setPhysicalSensationsError(false);
		setEmotionError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const trimmedPhysicalSensations = physicalSensations.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasPhysicalSensations = trimmedPhysicalSensations.length > 0;
		const hasEmotion = emotion.trim().length > 0;

		setSituationError(!hasSituation);
		setPhysicalSensationsError(!hasPhysicalSensations);
		setEmotionError(!hasEmotion);

		if (!hasSituation || !hasPhysicalSensations || !hasEmotion) {
			return;
		}

		const nextRecord: EmotionRecord = {
			id: buildRecordId(),
			situation: trimmedSituation,
			emotion,
			intensity,
			physicalSensations: trimmedPhysicalSensations
				.split(/\n|,/)
				.map((value) => value.trim())
				.filter(Boolean),
			regulationStrategy: "",
			result: "",
		};

		setRecords((currentRecords) => [...currentRecords, nextRecord]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/regulacion-emocional/identificacion-emocional/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;

	return (
		<InterventionScreenLayout
			title="Registro de Identificación Emocional"
			description="Registra una situación por vez con la emoción predominante, su intensidad y los cambios que percibiste en tu cuerpo."
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
					label="¿Cuál fue la emoción predominante?"
					options={emotionOptions}
					value={emotion}
					onChange={(nextValue) => {
						setEmotion(nextValue);
						if (emotionError && nextValue.trim().length > 0) {
							setEmotionError(false);
						}
					}}
					error={emotionError}
					helperText={emotionError ? "Selecciona una emoción." : " "}
				/>

				<EmotionIntensitySlider
					label="Intensidad emocional"
					value={intensity}
					onChange={setIntensity}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué cambios notaste en tu cuerpo?"
					value={physicalSensations}
					multiline
					minRows={3}
					onChange={(event) => {
						setPhysicalSensations(event.target.value);
						if (physicalSensationsError && event.target.value.trim().length > 0) {
							setPhysicalSensationsError(false);
						}
					}}
					error={physicalSensationsError}
					helperText={physicalSensationsError ? "Este campo es obligatorio." : "Ejemplo: tensión muscular, respiración rápida, palpitaciones, nudo en la garganta."}
				/>

				{records.length > 0 ? (
					<Alert severity="success">
						Registro guardado. Puedes agregar otro ejercicio o finalizar.
					</Alert>
				) : (
					<Alert severity="info">Aún no hay registros de identificación emocional.</Alert>
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

export default EmotionRegulationRegisterPage;
