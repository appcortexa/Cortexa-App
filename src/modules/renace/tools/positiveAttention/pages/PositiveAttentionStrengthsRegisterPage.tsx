import { Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import { StrengthSelector } from "../../../positiveAttention/StrengthSelector";
import type { PositiveAttentionRecord } from "../../../positiveAttention/PositiveAttentionRecord";

type PositiveAttentionStrengthEntry = Pick<
	PositiveAttentionRecord,
	"situation" | "strength" | "reflection" | "intensity"
>;

type RegisterPageState = {
	strengths?: PositiveAttentionStrengthEntry[];
};

function sanitizeStrengthEntries(state: unknown): PositiveAttentionStrengthEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeStrengths = (state as RegisterPageState).strengths;

	if (!Array.isArray(maybeStrengths)) {
		return [];
	}

	return maybeStrengths.filter(
		(entry) =>
			typeof entry.situation === "string" &&
			typeof entry.strength === "string" &&
			typeof entry.reflection === "string" &&
			typeof entry.intensity === "number",
	);
}

function PositiveAttentionStrengthsRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialStrengths = useMemo(() => sanitizeStrengthEntries(location.state), [location.state]);
	const [strengthEntries, setStrengthEntries] = useState<PositiveAttentionStrengthEntry[]>(initialStrengths);
	const [situation, setSituation] = useState("");
	const [strength, setStrength] = useState("");
	const [reflection, setReflection] = useState("");
	const [intensity, setIntensity] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [reflectionError, setReflectionError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(strengthEntries.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setStrength("");
		setReflection("");
		setIntensity(5);
		setSituationError(false);
		setReflectionError(false);
	};

	const handleSaveEntry = () => {
		const trimmedSituation = situation.trim();
		const trimmedStrength = strength.trim();
		const trimmedReflection = reflection.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasStrength = trimmedStrength.length > 0;
		const hasReflection = trimmedReflection.length > 0;

		setSituationError(!hasSituation);
		setReflectionError(!hasReflection);

		if (!hasSituation || !hasStrength || !hasReflection) {
			return;
		}

		setStrengthEntries((currentEntries) => [
			...currentEntries,
			{
				situation: trimmedSituation,
				strength: trimmedStrength,
				reflection: trimmedReflection,
				intensity,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinish = () => {
		navigate("/renace/atencion-positiva/fortalezas-personales/resumen", {
			state: { strengths: strengthEntries },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro de fortalezas personales"
			description="Registra cada situación, la fortaleza personal que utilizaste, cómo te ayudó y la utilidad percibida (0 a 10)."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/atencion-positiva/fortalezas-personales/introduccion")}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro ejercicio
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={strengthEntries.length === 0} onClick={handleFinish}>
							Finalizar
						</Button>
					</Stack>
				</Stack>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					fullWidth
					label="¿Qué situación enfrentaste?"
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

				<StrengthSelector
					label="¿Qué fortaleza personal utilizaste?"
					value={strength}
					onChange={setStrength}
				/>

				<TextField
					required
					fullWidth
					label="¿Cómo te ayudó esa fortaleza?"
					value={reflection}
					onChange={(event) => {
						setReflection(event.target.value);
						if (reflectionError && event.target.value.trim().length > 0) {
							setReflectionError(false);
						}
					}}
					error={reflectionError}
					helperText={reflectionError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider
					label="Utilidad percibida"
					value={intensity}
					onChange={setIntensity}
				/>

				<ExerciseEntryActions
					onSave={handleSaveEntry}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinish}
					canSave={true}
					showAddAnother={showPostSaveActions}
					showFinish={strengthEntries.length > 0}
				/>

				{strengthEntries.length > 0 ? (
					<Alert severity="success">Registro guardado. Puedes agregar otro o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay registros de fortalezas.</Alert>
				)}

				{strengthEntries.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Fortalezas personales registradas">
							<TableHead>
								<TableRow>
									<TableCell>Situación</TableCell>
									<TableCell>Fortaleza</TableCell>
									<TableCell>Cómo ayudó</TableCell>
									<TableCell align="right">Utilidad percibida</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{strengthEntries.map((entry, index) => (
									<TableRow key={`${entry.situation}-${index}`}>
										<TableCell>{entry.situation}</TableCell>
										<TableCell>{entry.strength}</TableCell>
										<TableCell>{entry.reflection}</TableCell>
										<TableCell align="right">{entry.intensity}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : null}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default PositiveAttentionStrengthsRegisterPage;
