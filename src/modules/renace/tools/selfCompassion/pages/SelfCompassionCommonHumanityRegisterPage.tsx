import { Alert, Button, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { CommonHumanityRecord } from "../../../selfCompassion/CommonHumanityRecord";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type RegisterPageState = {
	records?: CommonHumanityRecord[];
};

function sanitizeRecords(state: unknown): CommonHumanityRecord[] {
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
			typeof record.isolationFeeling === "string" &&
			typeof record.sharedHumanityReflection === "string" &&
			typeof record.connectionLevel === "number",
	);
}

function SelfCompassionCommonHumanityRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<CommonHumanityRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [isolationFeeling, setIsolationFeeling] = useState("");
	const [sharedHumanityReflection, setSharedHumanityReflection] = useState("");
	const [connectionLevel, setConnectionLevel] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [isolationError, setIsolationError] = useState(false);
	const [reflectionError, setReflectionError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(initialRecords.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setIsolationFeeling("");
		setSharedHumanityReflection("");
		setConnectionLevel(5);
		setSituationError(false);
		setIsolationError(false);
		setReflectionError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const trimmedIsolationFeeling = isolationFeeling.trim();
		const trimmedReflection = sharedHumanityReflection.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasIsolationFeeling = trimmedIsolationFeeling.length > 0;
		const hasReflection = trimmedReflection.length > 0;

		setSituationError(!hasSituation);
		setIsolationError(!hasIsolationFeeling);
		setReflectionError(!hasReflection);

		if (!hasSituation || !hasIsolationFeeling || !hasReflection) {
			return;
		}

		setRecords((currentRecords) => [
			...currentRecords,
			{
				situation: trimmedSituation,
				isolationFeeling: trimmedIsolationFeeling,
				sharedHumanityReflection: trimmedReflection,
				connectionLevel,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinish = () => {
		navigate("/renace/autocompasion/humanidad-compartida/resumen", { state: { records } });
	};

	return (
		<InterventionScreenLayout
			title="Registro de humanidad compartida"
			description="Registra una situación difícil y tu reflexión sobre cómo esa experiencia también puede formar parte de la experiencia humana."
			actions={
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/renace/autocompasion/humanidad-compartida/introduccion")}
				>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					fullWidth
					label="Situación difícil"
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
					label="¿Qué te hizo sentir que estabas solo(a) en esa experiencia?"
					value={isolationFeeling}
					onChange={(event) => {
						setIsolationFeeling(event.target.value);
						if (isolationError && event.target.value.trim().length > 0) {
							setIsolationError(false);
						}
					}}
					error={isolationError}
					helperText={isolationError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="¿Qué podría recordarte que otras personas también atraviesan situaciones parecidas?"
					value={sharedHumanityReflection}
					onChange={(event) => {
						setSharedHumanityReflection(event.target.value);
						if (reflectionError && event.target.value.trim().length > 0) {
							setReflectionError(false);
						}
					}}
					error={reflectionError}
					helperText={reflectionError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider label="Conexión" value={connectionLevel} onChange={setConnectionLevel} />

				<ExerciseEntryActions
					onSave={handleSaveRecord}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinish}
					canSave
					showAddAnother={showPostSaveActions}
					showFinish={records.length > 0}
				/>

				{records.length > 0 ? (
					<Alert severity="success">Ejercicio guardado. Puedes agregar otro ejercicio o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay ejercicios guardados.</Alert>
				)}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionCommonHumanityRegisterPage;
