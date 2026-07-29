import {
	Alert,
	Button,
	MenuItem,
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

const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;
const dayMoments = ["Mañana", "Tarde", "Noche"] as const;

type WeekDay = (typeof weekDays)[number];
type DayMoment = (typeof dayMoments)[number];

type ActivityScheduleEntry = {
	activity: string;
	day: WeekDay;
	moment: DayMoment;
	difficulty: number;
	confidence: number;
};

type RegisterPageState = {
	activities?: ActivityScheduleEntry[];
};

function sanitizeActivities(state: unknown): ActivityScheduleEntry[] {
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
			weekDays.includes(entry.day) &&
			dayMoments.includes(entry.moment) &&
			typeof entry.difficulty === "number" &&
			typeof entry.confidence === "number",
	);
}

function BehavioralActivationActivitySchedulingRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialActivities = useMemo(() => sanitizeActivities(location.state), [location.state]);
	const [activities, setActivities] = useState<ActivityScheduleEntry[]>(initialActivities);
	const [activity, setActivity] = useState("");
	const [day, setDay] = useState<WeekDay>("Lunes");
	const [moment, setMoment] = useState<DayMoment>("Mañana");
	const [difficulty, setDifficulty] = useState<number>(5);
	const [confidence, setConfidence] = useState<number>(5);
	const [activityError, setActivityError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(activities.length > 0);

	const resetCurrentForm = () => {
		setActivity("");
		setDay("Lunes");
		setMoment("Mañana");
		setDifficulty(5);
		setConfidence(5);
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
				day,
				moment,
				difficulty,
				confidence,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/activacion-conductual/agenda-actividades/resumen", {
			state: { activities },
		});
	};

	const canFinalize = activities.length > 0;

	return (
		<InterventionScreenLayout
			title="Programación de Actividades"
			description="Registra cada actividad con su día, momento del día, dificultad y confianza para realizarla."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/agenda-actividades/introduccion")
						}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otra actividad
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={!canFinalize} onClick={handleFinalize}>
							Finalizar registro
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

				<TextField
					select
					fullWidth
					label="Día de la semana"
					value={day}
					onChange={(event) => setDay(event.target.value as WeekDay)}
				>
					{weekDays.map((item) => (
						<MenuItem key={item} value={item}>
							{item}
						</MenuItem>
					))}
				</TextField>

				<TextField
					select
					fullWidth
					label="Momento del día"
					value={moment}
					onChange={(event) => setMoment(event.target.value as DayMoment)}
				>
					{dayMoments.map((item) => (
						<MenuItem key={item} value={item}>
							{item}
						</MenuItem>
					))}
				</TextField>

				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Dificultad: {difficulty}
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
						Confianza para realizarla: {confidence}
					</Typography>
					<Slider
						value={confidence}
						onChange={(_, value) => setConfidence(value as number)}
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
					<Alert severity="success">Actividad guardada. Puedes agregar otra actividad o finalizar el registro.</Alert>
				) : (
					<Alert severity="info">Aún no hay actividades registradas.</Alert>
				)}

				{activities.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Actividades programadas">
							<TableHead>
								<TableRow>
									<TableCell>Actividad</TableCell>
									<TableCell>Día</TableCell>
									<TableCell>Momento</TableCell>
									<TableCell align="right">Dificultad</TableCell>
									<TableCell align="right">Confianza</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{activities.map((entry, index) => (
									<TableRow key={`${entry.activity}-${index}`}>
										<TableCell>{entry.activity}</TableCell>
										<TableCell>{entry.day}</TableCell>
										<TableCell>{entry.moment}</TableCell>
										<TableCell align="right">{entry.difficulty}</TableCell>
										<TableCell align="right">{entry.confidence}</TableCell>
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

export default BehavioralActivationActivitySchedulingRegisterPage;
