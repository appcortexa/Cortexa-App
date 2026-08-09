import { Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PositiveAttentionSavoringEntry = {
	description: string;
	emotion: string;
	intensity: number;
	reflection: string;
};

type RegisterPageState = {
	savoringEntries?: PositiveAttentionSavoringEntry[];
};

function sanitizeSavoringEntries(state: unknown): PositiveAttentionSavoringEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeEntries = (state as RegisterPageState).savoringEntries;

	if (!Array.isArray(maybeEntries)) {
		return [];
	}

	return maybeEntries.filter(
		(entry) =>
			typeof entry.description === "string" &&
			typeof entry.reflection === "string" &&
			typeof entry.emotion === "string" &&
			typeof entry.intensity === "number",
	);
}

function PositiveAttentionSavoringRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialEntries = useMemo(() => sanitizeSavoringEntries(location.state), [location.state]);
	const [savoringEntries, setSavoringEntries] = useState<PositiveAttentionSavoringEntry[]>(initialEntries);
	const [experience, setExperience] = useState("");
	const [enjoyment, setEnjoyment] = useState("");
	const [repeatStrategy, setRepeatStrategy] = useState("");
	const [intensity, setIntensity] = useState(5);
	const [experienceError, setExperienceError] = useState(false);
	const [enjoymentError, setEnjoymentError] = useState(false);
	const [repeatStrategyError, setRepeatStrategyError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(savoringEntries.length > 0);

	const resetCurrentForm = () => {
		setExperience("");
		setEnjoyment("");
		setRepeatStrategy("");
		setIntensity(5);
		setExperienceError(false);
		setEnjoymentError(false);
		setRepeatStrategyError(false);
	};

	const handleSaveEntry = () => {
		const trimmedExperience = experience.trim();
		const trimmedEnjoyment = enjoyment.trim();
		const trimmedRepeatStrategy = repeatStrategy.trim();
		const hasExperience = trimmedExperience.length > 0;
		const hasEnjoyment = trimmedEnjoyment.length > 0;
		const hasRepeatStrategy = trimmedRepeatStrategy.length > 0;

		setExperienceError(!hasExperience);
		setEnjoymentError(!hasEnjoyment);
		setRepeatStrategyError(!hasRepeatStrategy);

		if (!hasExperience || !hasEnjoyment || !hasRepeatStrategy) {
			return;
		}

		setSavoringEntries((currentEntries) => [
			...currentEntries,
			{
				description: trimmedExperience,
				emotion: trimmedEnjoyment,
				reflection: trimmedRepeatStrategy,
				intensity,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinish = () => {
		navigate("/renace/atencion-positiva/saboreo-experiencias/resumen", {
			state: { savoringEntries },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro de saboreo"
			description="Describe una experiencia positiva, identifica qué te gustó más y qué podrías hacer para volver a experimentar algo similar."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/atencion-positiva/saboreo-experiencias/introduccion")}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro ejercicio
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={savoringEntries.length === 0} onClick={handleFinish}>
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
					label="Describe la experiencia positiva."
					value={experience}
					onChange={(event) => {
						setExperience(event.target.value);
						if (experienceError && event.target.value.trim().length > 0) {
							setExperienceError(false);
						}
					}}
					error={experienceError}
					helperText={experienceError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué fue lo que más disfrutaste?"
					value={enjoyment}
					onChange={(event) => {
						setEnjoyment(event.target.value);
						if (enjoymentError && event.target.value.trim().length > 0) {
							setEnjoymentError(false);
						}
					}}
					error={enjoymentError}
					helperText={enjoymentError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué podrías hacer para volver a vivir una experiencia similar?"
					value={repeatStrategy}
					onChange={(event) => {
						setRepeatStrategy(event.target.value);
						if (repeatStrategyError && event.target.value.trim().length > 0) {
							setRepeatStrategyError(false);
						}
					}}
					error={repeatStrategyError}
					helperText={repeatStrategyError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider
					label="Nivel de disfrute"
					value={intensity}
					onChange={setIntensity}
				/>

				<ExerciseEntryActions
					onSave={handleSaveEntry}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinish}
					canSave={true}
					showAddAnother={showPostSaveActions}
					showFinish={savoringEntries.length > 0}
				/>

				{savoringEntries.length > 0 ? (
					<Alert severity="success">Registro guardado. Puedes agregar otro o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay experiencias registradas.</Alert>
				)}

				{savoringEntries.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Experiencias de saboreo registradas">
							<TableHead>
								<TableRow>
									<TableCell>Experiencia</TableCell>
									<TableCell>Lo que más disfrutó</TableCell>
									<TableCell>Cómo podría repetirla</TableCell>
									<TableCell align="right">Nivel de disfrute</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{savoringEntries.map((entry, index) => (
									<TableRow key={`${entry.description}-${index}`}>
										<TableCell>{entry.description}</TableCell>
										<TableCell>{entry.emotion}</TableCell>
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

export default PositiveAttentionSavoringRegisterPage;
