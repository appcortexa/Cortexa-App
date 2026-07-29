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

type ActivityHierarchyEntry = {
	activity: string;
	importance: number;
	difficulty: number;
	probability: number;
	priority?: number;
};

type RegisterPageState = {
	activities?: ActivityHierarchyEntry[];
};

function sanitizeActivities(state: unknown): ActivityHierarchyEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeActivities = (state as RegisterPageState).activities;

	if (!Array.isArray(maybeActivities)) {
		return [];
	}

	return maybeActivities.filter(
		(entry) =>
			typeof entry.activity === "string" &&
			typeof entry.importance === "number" &&
			typeof entry.difficulty === "number" &&
			typeof entry.probability === "number" &&
			(typeof entry.priority === "undefined" || typeof entry.priority === "number"),
	);
}

function BehavioralActivationActivityHierarchyRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialActivities = useMemo(() => sanitizeActivities(location.state), [location.state]);
	const [activities, setActivities] = useState<ActivityHierarchyEntry[]>(initialActivities);
	const [activity, setActivity] = useState("");
	const [importance, setImportance] = useState<number>(5);
	const [difficulty, setDifficulty] = useState<number>(5);
	const [probability, setProbability] = useState<number>(5);
	const [activityError, setActivityError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(activities.length > 0);

	const resetCurrentForm = () => {
		setActivity("");
		setImportance(5);
		setDifficulty(5);
		setProbability(5);
		setActivityError(false);
	};

	const handleSaveEntry = () => {
		const trimmedActivity = activity.trim();

		if (trimmedActivity.length === 0) {
			setActivityError(true);
			return;
		}

		setActivities((currentActivities) => [
			...currentActivities,
			{
				activity: trimmedActivity,
				importance,
				difficulty,
				probability,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleContinue = () => {
		navigate("/renace/activacion-conductual/jerarquia-actividades/prioridades", {
			state: { activities },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro de Actividades"
			description="Registra cada actividad e indica su importancia, dificultad percibida y probabilidad de realizarla."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/activacion-conductual/jerarquia-actividades/introduccion")}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otra actividad
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={activities.length === 0} onClick={handleContinue}>
							Continuar
						</Button>
					</Stack>
				</Stack>
			}
		>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					label="Actividad"
					value={activity}
					onChange={(event) => {
						setActivity(event.target.value);
						if (activityError && event.target.value.trim().length > 0) {
							setActivityError(false);
						}
					}}
					error={activityError}
					helperText={activityError ? "Ingresa una actividad para guardarla." : " "}
				/>

				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Importancia: {importance}
					</Typography>
					<Slider
						value={importance}
						onChange={(_, value) => setImportance(value as number)}
						min={0}
						max={10}
						step={1}
						valueLabelDisplay="auto"
					/>
				</Stack>

				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Dificultad percibida: {difficulty}
					</Typography>
					<Slider
						value={difficulty}
						onChange={(_, value) => setDifficulty(value as number)}
						min={0}
						max={10}
						step={1}
						valueLabelDisplay="auto"
					/>
				</Stack>

				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Probabilidad de realizarla: {probability}
					</Typography>
					<Slider
						value={probability}
						onChange={(_, value) => setProbability(value as number)}
						min={0}
						max={10}
						step={1}
						valueLabelDisplay="auto"
					/>
				</Stack>

				<Button variant="contained" size="large" onClick={handleSaveEntry}>
					Guardar actividad
				</Button>

				{activities.length > 0 ? (
					<Alert severity="success">Actividad guardada. Puedes agregar otra actividad o continuar.</Alert>
				) : (
					<Alert severity="info">Aún no hay actividades registradas.</Alert>
				)}

				{activities.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Actividades registradas">
							<TableHead>
								<TableRow>
									<TableCell>Actividad</TableCell>
									<TableCell align="right">Importancia</TableCell>
									<TableCell align="right">Dificultad</TableCell>
									<TableCell align="right">Probabilidad</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{activities.map((entry, index) => (
									<TableRow key={`${entry.activity}-${index}`}>
										<TableCell>{entry.activity}</TableCell>
										<TableCell align="right">{entry.importance}</TableCell>
										<TableCell align="right">{entry.difficulty}</TableCell>
										<TableCell align="right">{entry.probability}</TableCell>
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

export default BehavioralActivationActivityHierarchyRegisterPage;
