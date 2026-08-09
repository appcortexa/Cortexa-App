import { Alert, MenuItem, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type BreathingPractice = {
	duration: string;
	distractions: number;
	consciousReturns: number;
	attentionStability: number;
	observations: string;
};

type RegisterPageState = { practices?: BreathingPractice[] };

const durationOptions = ["1-2 minutos", "3-5 minutos", "6-10 minutos", "más de 10 minutos"] as const;

function sanitizePractices(state: unknown): BreathingPractice[] {
	if (!state || typeof state !== "object") return [];
	const practices = (state as RegisterPageState).practices;
	if (!Array.isArray(practices)) return [];
	return practices.filter(
		(practice) =>
			typeof practice.duration === "string" &&
			Number.isInteger(practice.distractions) &&
			practice.distractions >= 0 &&
			Number.isInteger(practice.consciousReturns) &&
			practice.consciousReturns >= 0 &&
			typeof practice.attentionStability === "number" &&
			practice.attentionStability >= 0 &&
			practice.attentionStability <= 10 &&
			typeof practice.observations === "string",
	);
}

function BreathingAttentionRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialPractices = useMemo(() => sanitizePractices(location.state), [location.state]);
	const [practices, setPractices] = useState(initialPractices);
	const [duration, setDuration] = useState("");
	const [distractions, setDistractions] = useState("");
	const [consciousReturns, setConsciousReturns] = useState("");
	const [attentionStability, setAttentionStability] = useState(5);
	const [observations, setObservations] = useState("");
	const [durationError, setDurationError] = useState(false);
	const [distractionsError, setDistractionsError] = useState(false);
	const [consciousReturnsError, setConsciousReturnsError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(initialPractices.length > 0);

	const resetCurrentForm = () => {
		setDuration("");
		setDistractions("");
		setConsciousReturns("");
		setAttentionStability(5);
		setObservations("");
		setDurationError(false);
		setDistractionsError(false);
		setConsciousReturnsError(false);
	};

	const handleSavePractice = () => {
		const parsedDistractions = Number(distractions);
		const parsedConsciousReturns = Number(consciousReturns);
		const hasDuration = duration.length > 0;
		const hasDistractions = distractions.trim().length > 0 && Number.isInteger(parsedDistractions) && parsedDistractions >= 0;
		const hasConsciousReturns = consciousReturns.trim().length > 0 && Number.isInteger(parsedConsciousReturns) && parsedConsciousReturns >= 0;

		setDurationError(!hasDuration);
		setDistractionsError(!hasDistractions);
		setConsciousReturnsError(!hasConsciousReturns);

		if (!hasDuration || !hasDistractions || !hasConsciousReturns) return;

		setPractices((currentPractices) => [
			...currentPractices,
			{
				duration,
				distractions: parsedDistractions,
				consciousReturns: parsedConsciousReturns,
				attentionStability,
				observations: observations.trim(),
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	return (
		<InterventionScreenLayout
			title="Registro de Atención a la Respiración"
			description="Registra cómo fue cada práctica de atención a la respiración."
			actions={
				<ExerciseEntryActions
					onSave={handleSavePractice}
					onAddAnother={resetCurrentForm}
					onFinish={() => navigate("/renace/mindfulness/atencion-respiracion/resumen", { state: { practices } })}
					canSave
					showAddAnother={showPostSaveActions}
					showFinish={practices.length > 0}
				/>
			}
		>
			<Stack spacing={2.5}>
				<TextField required select fullWidth label="Duración aproximada de la práctica" value={duration} onChange={(event) => { setDuration(event.target.value); setDurationError(false); }} error={durationError} helperText={durationError ? "Este campo es obligatorio." : " "}>
					<MenuItem value="" disabled>Selecciona una duración</MenuItem>
					{durationOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
				</TextField>
				<TextField required fullWidth type="number" label="¿Cuántas veces notaste que tu atención se había distraído?" value={distractions} onChange={(event) => { setDistractions(event.target.value); setDistractionsError(false); }} slotProps={{ htmlInput: { min: 0, step: 1 } }} error={distractionsError} helperText={distractionsError ? "Ingresa un número entero igual o mayor que cero." : " "} />
				<TextField required fullWidth type="number" label="¿Cuántas veces regresaste conscientemente a la respiración?" value={consciousReturns} onChange={(event) => { setConsciousReturns(event.target.value); setConsciousReturnsError(false); }} slotProps={{ htmlInput: { min: 0, step: 1 } }} error={consciousReturnsError} helperText={consciousReturnsError ? "Ingresa un número entero igual o mayor que cero." : " "} />
				<EmotionIntensitySlider label="Estabilidad de la atención" value={attentionStability} onChange={setAttentionStability} />
				<TextField fullWidth multiline minRows={3} label="Observaciones sobre la experiencia" value={observations} onChange={(event) => setObservations(event.target.value)} />
				{practices.length > 0 ? <Alert severity="success">Práctica guardada. Puedes agregar otra práctica o finalizar.</Alert> : <Alert severity="info">Aún no hay prácticas registradas.</Alert>}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default BreathingAttentionRegisterPage;
