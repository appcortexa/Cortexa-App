import { Alert, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import EmotionSelector from "../components/EmotionSelector";

type PhysiologicalRecord = {
	emotion: string;
	strategy: string;
	intensityBefore: number;
	intensityAfter: number;
	bodyChanges: string;
};

type RegisterPageState = {
	records?: PhysiologicalRecord[];
};

const emotionOptions = ["Tristeza", "Ansiedad", "Enojo", "Culpa", "Verguenza", "Frustración", "Miedo"];
const strategyOptions = [
	"Respiración diafragmática",
	"Respiración lenta",
	"Relajación muscular",
	"Pausa consciente",
	"Estiramiento",
	"Otra",
];

function sanitizeRecords(state: unknown): PhysiologicalRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as RegisterPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record): record is PhysiologicalRecord =>
			typeof record.emotion === "string" &&
			typeof record.strategy === "string" &&
			typeof record.intensityBefore === "number" &&
			typeof record.intensityAfter === "number" &&
			typeof record.bodyChanges === "string",
	);
}

function EmotionPhysiologicalRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { session } = useRenaceSession();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<PhysiologicalRecord[]>(initialRecords);
	const [emotion, setEmotion] = useState("");
	const [strategy, setStrategy] = useState("");
	const [intensityBefore, setIntensityBefore] = useState(5);
	const [intensityAfter, setIntensityAfter] = useState(5);
	const [bodyChanges, setBodyChanges] = useState("");
	const [emotionError, setEmotionError] = useState(false);
	const [strategyError, setStrategyError] = useState(false);
	const [bodyChangesError, setBodyChangesError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setEmotion("");
		setStrategy("");
		setIntensityBefore(5);
		setIntensityAfter(5);
		setBodyChanges("");
		setEmotionError(false);
		setStrategyError(false);
		setBodyChangesError(false);
	};

	const handleSaveRecord = () => {
		const trimmedBodyChanges = bodyChanges.trim();
		const hasEmotion = emotion.trim().length > 0;
		const hasStrategy = strategy.trim().length > 0;
		const hasBodyChanges = trimmedBodyChanges.length > 0;

		setEmotionError(!hasEmotion);
		setStrategyError(!hasStrategy);
		setBodyChangesError(!hasBodyChanges);

		if (!hasEmotion || !hasStrategy || !hasBodyChanges) {
			return;
		}

		const nextRecord: PhysiologicalRecord = {
			emotion,
			strategy,
			intensityBefore,
			intensityAfter,
			bodyChanges: trimmedBodyChanges,
		};

		setRecords((currentRecords) => [...currentRecords, nextRecord]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/regulacion-emocional/regulacion-fisiologica/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;

	return (
		<InterventionScreenLayout
			title="Registro de Regulación Fisiológica"
			description="Registra la emoción que deseabas regular, la estrategia utilizada y cómo cambió tu experiencia antes y después de esa estrategia breve."
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
				<EmotionSelector
					label="¿Qué emoción querías regular?"
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

				<TextField
					select
					fullWidth
					label="¿Qué estrategia utilizaste?"
					value={strategy}
					onChange={(event) => {
						setStrategy(event.target.value);
						if (strategyError && event.target.value.trim().length > 0) {
							setStrategyError(false);
						}
					}}
					error={strategyError}
					helperText={strategyError ? "Selecciona una estrategia." : " "}
				>
					{strategyOptions.map((strategyOption) => (
						<MenuItem key={strategyOption} value={strategyOption}>
							{strategyOption}
						</MenuItem>
					))}
				</TextField>

				<EmotionIntensitySlider
					label="Intensidad antes"
					value={intensityBefore}
					onChange={setIntensityBefore}
				/>

				<EmotionIntensitySlider
					label="Intensidad después"
					value={intensityAfter}
					onChange={setIntensityAfter}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué cambios notaste en tu cuerpo?"
					value={bodyChanges}
					multiline
					minRows={3}
					onChange={(event) => {
						setBodyChanges(event.target.value);
						if (bodyChangesError && event.target.value.trim().length > 0) {
							setBodyChangesError(false);
						}
					}}
					error={bodyChangesError}
					helperText={bodyChangesError ? "Este campo es obligatorio." : "Ejemplo: respiración más tranquila, menor tensión muscular, sensación de relajación, disminución de palpitaciones."}
				/>

				{records.length > 0 ? (
					<Alert severity="success">
						Registro guardado. Puedes agregar otro ejercicio o finalizar.
					</Alert>
				) : (
					<Alert severity="info">Aún no hay registros de regulación fisiológica.</Alert>
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

export default EmotionPhysiologicalRegisterPage;
