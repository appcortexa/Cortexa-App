import { Alert, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import EmotionSelector from "../components/EmotionSelector";

type ReevaluationRecord = {
	situation: string;
	initialInterpretation: string;
	newPerspective: string;
	emotion: string;
	intensity: number;
};

type RegisterPageState = {
	records?: ReevaluationRecord[];
};

const emotionOptions = ["Tristeza", "Ansiedad", "Enojo", "Culpa", "Verguenza", "Frustración", "Miedo"];

function sanitizeRecords(state: unknown): ReevaluationRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as RegisterPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record): record is ReevaluationRecord =>
			typeof record.situation === "string" &&
			typeof record.initialInterpretation === "string" &&
			typeof record.newPerspective === "string" &&
			typeof record.emotion === "string" &&
			typeof record.intensity === "number",
	);
}

function EmotionReevaluationRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { session } = useRenaceSession();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<ReevaluationRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [initialInterpretation, setInitialInterpretation] = useState("");
	const [newPerspective, setNewPerspective] = useState("");
	const [emotion, setEmotion] = useState("");
	const [intensity, setIntensity] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [initialInterpretationError, setInitialInterpretationError] = useState(false);
	const [newPerspectiveError, setNewPerspectiveError] = useState(false);
	const [emotionError, setEmotionError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setInitialInterpretation("");
		setNewPerspective("");
		setEmotion("");
		setIntensity(5);
		setSituationError(false);
		setInitialInterpretationError(false);
		setNewPerspectiveError(false);
		setEmotionError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const trimmedInitialInterpretation = initialInterpretation.trim();
		const trimmedNewPerspective = newPerspective.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasInitialInterpretation = trimmedInitialInterpretation.length > 0;
		const hasNewPerspective = trimmedNewPerspective.length > 0;
		const hasEmotion = emotion.trim().length > 0;

		setSituationError(!hasSituation);
		setInitialInterpretationError(!hasInitialInterpretation);
		setNewPerspectiveError(!hasNewPerspective);
		setEmotionError(!hasEmotion);

		if (!hasSituation || !hasInitialInterpretation || !hasNewPerspective || !hasEmotion) {
			return;
		}

		const nextRecord: ReevaluationRecord = {
			situation: trimmedSituation,
			initialInterpretation: trimmedInitialInterpretation,
			newPerspective: trimmedNewPerspective,
			emotion,
			intensity,
		};

		setRecords((currentRecords) => [...currentRecords, nextRecord]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/regulacion-emocional/reevaluacion-emocional/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;

	return (
		<InterventionScreenLayout
			title="Registro de Reevaluación Emocional"
			description="Registra la situación, tu interpretación inicial, una nueva perspectiva y la emoción predominante que aparece tras esa reevaluación."
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

				<TextField
					required
					fullWidth
					label="¿Cómo interpretaste inicialmente esa situación?"
					value={initialInterpretation}
					multiline
					minRows={2}
					onChange={(event) => {
						setInitialInterpretation(event.target.value);
						if (initialInterpretationError && event.target.value.trim().length > 0) {
							setInitialInterpretationError(false);
						}
					}}
					error={initialInterpretationError}
					helperText={initialInterpretationError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="Después de reflexionar, ¿hay otra forma de entender esa situación?"
					value={newPerspective}
					multiline
					minRows={2}
					onChange={(event) => {
						setNewPerspective(event.target.value);
						if (newPerspectiveError && event.target.value.trim().length > 0) {
							setNewPerspectiveError(false);
						}
					}}
					error={newPerspectiveError}
					helperText={newPerspectiveError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionSelector
					label="¿Qué emoción predominó después de esa nueva perspectiva?"
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
					label="Intensidad emocional actual"
					value={intensity}
					onChange={setIntensity}
				/>

				{records.length > 0 ? (
					<Alert severity="success">
						Registro guardado. Puedes agregar otro ejercicio o finalizar.
					</Alert>
				) : (
					<Alert severity="info">Aún no hay registros de reevaluación emocional.</Alert>
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

export default EmotionReevaluationRegisterPage;
