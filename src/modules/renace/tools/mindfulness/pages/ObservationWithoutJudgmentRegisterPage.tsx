import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type ObservationRecord = {
	experience: string;
	experienceType: string;
	judgmentNoticed: string;
	observationEase: number;
	additionalComments: string;
};

type RegisterPageState = { records?: ObservationRecord[] };

const experienceTypes = ["Pensamiento", "Emoción", "Sensación corporal", "Recuerdo", "Impulso", "Otro"] as const;
const judgmentOptions = ["Sí", "No"] as const;

function sanitizeRecords(state: unknown): ObservationRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as RegisterPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter(
		(record) =>
			typeof record.experience === "string" &&
			experienceTypes.includes(record.experienceType as (typeof experienceTypes)[number]) &&
			judgmentOptions.includes(record.judgmentNoticed as (typeof judgmentOptions)[number]) &&
			typeof record.observationEase === "number" &&
			record.observationEase >= 0 &&
			record.observationEase <= 10 &&
			typeof record.additionalComments === "string",
	);
}

function ObservationWithoutJudgmentRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState(initialRecords);
	const [experience, setExperience] = useState("");
	const [experienceType, setExperienceType] = useState("");
	const [judgmentNoticed, setJudgmentNoticed] = useState("");
	const [observationEase, setObservationEase] = useState(5);
	const [additionalComments, setAdditionalComments] = useState("");
	const [experienceError, setExperienceError] = useState(false);
	const [experienceTypeError, setExperienceTypeError] = useState(false);
	const [judgmentError, setJudgmentError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(initialRecords.length > 0);

	const resetCurrentForm = () => {
		setExperience("");
		setExperienceType("");
		setJudgmentNoticed("");
		setObservationEase(5);
		setAdditionalComments("");
		setExperienceError(false);
		setExperienceTypeError(false);
		setJudgmentError(false);
	};

	const handleSaveRecord = () => {
		const trimmedExperience = experience.trim();
		const hasExperience = trimmedExperience.length > 0;
		const hasExperienceType = experienceType.length > 0;
		const hasJudgmentAnswer = judgmentNoticed.length > 0;

		setExperienceError(!hasExperience);
		setExperienceTypeError(!hasExperienceType);
		setJudgmentError(!hasJudgmentAnswer);
		if (!hasExperience || !hasExperienceType || !hasJudgmentAnswer) return;

		setRecords((currentRecords) => [
			...currentRecords,
			{ experience: trimmedExperience, experienceType, judgmentNoticed, observationEase, additionalComments: additionalComments.trim() },
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	return (
		<InterventionScreenLayout
			title="Registro de Observación sin Juicio"
			description="Registra una experiencia por vez y observa si surgió algún juicio."
			actions={
				<Stack spacing={1.5}>
					<Button variant="contained" size="large" onClick={handleSaveRecord}>Guardar registro</Button>
					{showPostSaveActions || records.length > 0 ? <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
						{showPostSaveActions ? <Button variant="outlined" size="large" onClick={resetCurrentForm}>Agregar otro registro</Button> : null}
						{records.length > 0 ? <Button variant="contained" size="large" onClick={() => navigate("/renace/mindfulness/observacion-sin-juicio/resumen", { state: { records } })}>Finalizar</Button> : null}
					</Stack> : null}
				</Stack>
			}
		>
			<Stack spacing={2.5}>
				<TextField required fullWidth multiline minRows={3} label="¿Qué observaste?" value={experience} onChange={(event) => { setExperience(event.target.value); setExperienceError(false); }} error={experienceError} helperText={experienceError ? "Este campo es obligatorio." : " "} />
				<TextField required select fullWidth label="Tipo de experiencia" value={experienceType} onChange={(event) => { setExperienceType(event.target.value); setExperienceTypeError(false); }} error={experienceTypeError} helperText={experienceTypeError ? "Este campo es obligatorio." : " "}>
					<MenuItem value="" disabled>Selecciona un tipo</MenuItem>
					{experienceTypes.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
				</TextField>
				<TextField required select fullWidth label="¿Notaste que apareció algún juicio?" value={judgmentNoticed} onChange={(event) => { setJudgmentNoticed(event.target.value); setJudgmentError(false); }} error={judgmentError} helperText={judgmentError ? "Este campo es obligatorio." : " "}>
					<MenuItem value="" disabled>Selecciona una opción</MenuItem>
					{judgmentOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
				</TextField>
				<EmotionIntensitySlider label="Facilidad para observar" value={observationEase} onChange={setObservationEase} />
				<TextField fullWidth multiline minRows={3} label="Comentarios adicionales" value={additionalComments} onChange={(event) => setAdditionalComments(event.target.value)} />
				{records.length > 0 ? <Alert severity="success">Registro guardado. Puedes agregar otro registro o finalizar.</Alert> : <Alert severity="info">Aún no hay registros guardados.</Alert>}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default ObservationWithoutJudgmentRegisterPage;
