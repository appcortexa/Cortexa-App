import {
	Alert,
	Button,
	Slider,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type AvoidanceEntry = {
	avoidedActivity: string;
	obstacle: string;
	intensity: number;
	alternative: string;
};

type RegisterPageState = {
	entries?: AvoidanceEntry[];
};

function sanitizeEntries(state: unknown): AvoidanceEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeEntries = (state as RegisterPageState).entries;

	if (!Array.isArray(maybeEntries)) {
		return [];
	}

	return maybeEntries.filter(
		(entry) =>
			typeof entry.avoidedActivity === "string" &&
			typeof entry.obstacle === "string" &&
			typeof entry.intensity === "number" &&
			typeof entry.alternative === "string",
	);
}

function BehavioralActivationAvoidanceIdentificationRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialEntries = useMemo(() => sanitizeEntries(location.state), [location.state]);
	const [entries, setEntries] = useState<AvoidanceEntry[]>(initialEntries);
	const [avoidedActivity, setAvoidedActivity] = useState("");
	const [obstacle, setObstacle] = useState("");
	const [intensity, setIntensity] = useState<number>(5);
	const [alternative, setAlternative] = useState("");
	const [activityError, setActivityError] = useState(false);
	const [obstacleError, setObstacleError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(entries.length > 0);

	const resetCurrentForm = () => {
		setAvoidedActivity("");
		setObstacle("");
		setIntensity(5);
		setAlternative("");
		setActivityError(false);
		setObstacleError(false);
	};

	const handleSaveEntry = () => {
		const trimmedActivity = avoidedActivity.trim();
		const trimmedObstacle = obstacle.trim();
		const trimmedAlternative = alternative.trim();
		const hasActivity = trimmedActivity.length > 0;
		const hasObstacle = trimmedObstacle.length > 0;

		setActivityError(!hasActivity);
		setObstacleError(!hasObstacle);

		if (!hasActivity || !hasObstacle) {
			return;
		}

		setEntries((currentEntries) => [
			...currentEntries,
			{
				avoidedActivity: trimmedActivity,
				obstacle: trimmedObstacle,
				intensity,
				alternative: trimmedAlternative,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/activacion-conductual/identificacion-evitacion/resumen", {
			state: { entries },
		});
	};

	const canFinalize = entries.length > 0;

	return (
		<InterventionScreenLayout
			title="Identificación de Evitación"
			description="Registra una situación evitada por vez: actividad evitada, obstáculo, intensidad (0 a 10) y una alternativa opcional para la próxima ocasión."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/identificacion-evitacion/introduccion")
						}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro registro
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={!canFinalize} onClick={handleFinalize}>
							Finalizar
						</Button>
					</Stack>
				</Stack>
			}
		>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					label="Actividad evitada"
					value={avoidedActivity}
					onChange={(event) => {
						setAvoidedActivity(event.target.value);
						if (activityError && event.target.value.trim().length > 0) {
							setActivityError(false);
						}
					}}
					error={activityError}
					helperText={activityError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué hizo que la evitaras?"
					value={obstacle}
					onChange={(event) => {
						setObstacle(event.target.value);
						if (obstacleError && event.target.value.trim().length > 0) {
							setObstacleError(false);
						}
					}}
					error={obstacleError}
					helperText={obstacleError ? "Este campo es obligatorio." : " "}
				/>

				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Intensidad del obstáculo: {intensity}
					</Typography>
					<Slider
						value={intensity}
						onChange={(_, value) => setIntensity(value as number)}
						min={0}
						max={10}
						step={1}
						valueLabelDisplay="auto"
					/>
				</Stack>

				<TextField
					fullWidth
					label="¿Qué alternativa podrías intentar la próxima vez?"
					value={alternative}
					onChange={(event) => setAlternative(event.target.value)}
					helperText="Opcional"
				/>

				<Button variant="contained" size="large" onClick={handleSaveEntry}>
					Guardar registro
				</Button>

				{entries.length > 0 ? (
					<Alert severity="success">Registro guardado. Puedes agregar otro registro o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay situaciones de evitación registradas.</Alert>
				)}

				{entries.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Registros de evitación">
							<TableHead>
								<TableRow>
									<TableCell>Actividad evitada</TableCell>
									<TableCell>Obstáculo</TableCell>
									<TableCell align="right">Intensidad</TableCell>
									<TableCell>Alternativa</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{entries.map((entry, index) => (
									<TableRow key={`${entry.avoidedActivity}-${index}`}>
										<TableCell>{entry.avoidedActivity}</TableCell>
										<TableCell>{entry.obstacle}</TableCell>
										<TableCell align="right">{entry.intensity}</TableCell>
										<TableCell>{entry.alternative || "-"}</TableCell>
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

export default BehavioralActivationAvoidanceIdentificationRegisterPage;
