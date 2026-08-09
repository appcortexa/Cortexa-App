import { Alert, Button, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type AcceptanceRecord = {
	experience: string;
	greatestDifficulty: string;
	acceptanceLevel: number;
	learning: string;
};

type RegisterPageState = { records?: AcceptanceRecord[] };

function sanitizeRecords(state: unknown): AcceptanceRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as RegisterPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter(
		(record) =>
			typeof record.experience === "string" &&
			typeof record.greatestDifficulty === "string" &&
			typeof record.acceptanceLevel === "number" &&
			record.acceptanceLevel >= 0 &&
			record.acceptanceLevel <= 10 &&
			typeof record.learning === "string",
	);
}

function PresentMomentAcceptanceRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState(initialRecords);
	const [experience, setExperience] = useState("");
	const [greatestDifficulty, setGreatestDifficulty] = useState("");
	const [acceptanceLevel, setAcceptanceLevel] = useState(5);
	const [learning, setLearning] = useState("");
	const [experienceError, setExperienceError] = useState(false);
	const [difficultyError, setDifficultyError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(initialRecords.length > 0);

	const resetCurrentForm = () => {
		setExperience("");
		setGreatestDifficulty("");
		setAcceptanceLevel(5);
		setLearning("");
		setExperienceError(false);
		setDifficultyError(false);
	};

	const handleSaveRecord = () => {
		const trimmedExperience = experience.trim();
		const trimmedDifficulty = greatestDifficulty.trim();
		const hasExperience = trimmedExperience.length > 0;
		const hasDifficulty = trimmedDifficulty.length > 0;

		setExperienceError(!hasExperience);
		setDifficultyError(!hasDifficulty);
		if (!hasExperience || !hasDifficulty) return;

		setRecords((currentRecords) => [
			...currentRecords,
			{ experience: trimmedExperience, greatestDifficulty: trimmedDifficulty, acceptanceLevel, learning: learning.trim() },
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	return (
		<InterventionScreenLayout
			title="Registro de Aceptación del Momento Presente"
			description="Registra una experiencia por vez y cómo fue permanecer con ella de manera consciente."
			actions={
				<Stack spacing={1.5}>
					<Button variant="contained" size="large" onClick={handleSaveRecord}>Guardar registro</Button>
					{showPostSaveActions || records.length > 0 ? <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
						{showPostSaveActions ? <Button variant="outlined" size="large" onClick={resetCurrentForm}>Agregar otro registro</Button> : null}
						{records.length > 0 ? <Button variant="contained" size="large" onClick={() => navigate("/renace/mindfulness/aceptacion-momento-presente/resumen", { state: { records } })}>Finalizar</Button> : null}
					</Stack> : null}
				</Stack>
			}
		>
			<Stack spacing={2.5}>
				<TextField required fullWidth multiline minRows={3} label="¿Qué experiencia intentaste aceptar?" value={experience} onChange={(event) => { setExperience(event.target.value); setExperienceError(false); }} error={experienceError} helperText={experienceError ? "Este campo es obligatorio." : " "} />
				<TextField required fullWidth multiline minRows={3} label="¿Qué fue lo más difícil de permanecer con esa experiencia?" value={greatestDifficulty} onChange={(event) => { setGreatestDifficulty(event.target.value); setDifficultyError(false); }} error={difficultyError} helperText={difficultyError ? "Este campo es obligatorio." : " "} />
				<EmotionIntensitySlider label="Nivel de aceptación" value={acceptanceLevel} onChange={setAcceptanceLevel} />
				<TextField fullWidth multiline minRows={3} label="¿Qué aprendiste durante esta práctica?" value={learning} onChange={(event) => setLearning(event.target.value)} />
				{records.length > 0 ? <Alert severity="success">Registro guardado. Puedes agregar otro registro o finalizar.</Alert> : <Alert severity="info">Aún no hay registros guardados.</Alert>}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default PresentMomentAcceptanceRegisterPage;
