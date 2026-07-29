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

type WeeklyCommitment = {
	activity: string;
	day: WeekDay;
	moment: DayMoment;
	priority: number;
	confidence: number;
};

type RegisterPageState = {
	commitments?: WeeklyCommitment[];
};

function sanitizeCommitments(state: unknown): WeeklyCommitment[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeCommitments = (state as RegisterPageState).commitments;

	if (!Array.isArray(maybeCommitments)) {
		return [];
	}

	return maybeCommitments.filter(
		(entry) =>
			typeof entry.activity === "string" &&
			weekDays.includes(entry.day) &&
			dayMoments.includes(entry.moment) &&
			typeof entry.priority === "number" &&
			typeof entry.confidence === "number",
	);
}

function BehavioralActivationWeeklyPlanRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialCommitments = useMemo(() => sanitizeCommitments(location.state), [location.state]);
	const [commitments, setCommitments] = useState<WeeklyCommitment[]>(initialCommitments);
	const [activity, setActivity] = useState("");
	const [day, setDay] = useState<WeekDay>("Lunes");
	const [moment, setMoment] = useState<DayMoment>("Mañana");
	const [priority, setPriority] = useState<number>(3);
	const [confidence, setConfidence] = useState<number>(5);
	const [activityError, setActivityError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(commitments.length > 0);

	const resetCurrentForm = () => {
		setActivity("");
		setDay("Lunes");
		setMoment("Mañana");
		setPriority(3);
		setConfidence(5);
		setActivityError(false);
	};

	const handleSaveCommitment = () => {
		const trimmedActivity = activity.trim();

		if (trimmedActivity.length === 0) {
			setActivityError(true);
			return;
		}

		setCommitments((currentCommitments) => [
			...currentCommitments,
			{
				activity: trimmedActivity,
				day,
				moment,
				priority,
				confidence,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/activacion-conductual/plan-semanal/resumen", {
			state: { commitments },
		});
	};

	const canFinalize = commitments.length > 0;

	return (
		<InterventionScreenLayout
			title="Planificación Semanal"
			description="Registra cada compromiso con actividad, día, momento del día, prioridad y confianza para cumplirlo."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button variant="outlined" size="large" onClick={() => navigate("/renace/activacion-conductual/plan-semanal/introduccion")}>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro compromiso
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
						Prioridad: {priority}
					</Typography>
					<Slider
						value={priority}
						onChange={(_, value) => setPriority(value as number)}
						min={1}
						max={5}
						step={1}
						valueLabelDisplay="auto"
					/>
				</Stack>

				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Confianza para cumplirla: {confidence}
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

				<Button variant="contained" size="large" onClick={handleSaveCommitment}>
					Guardar compromiso
				</Button>

				{commitments.length > 0 ? (
					<Alert severity="success">Compromiso guardado. Puedes agregar otro compromiso o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay compromisos registrados.</Alert>
				)}

				{commitments.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Compromisos registrados">
							<TableHead>
								<TableRow>
									<TableCell>Actividad</TableCell>
									<TableCell>Día</TableCell>
									<TableCell>Momento</TableCell>
									<TableCell align="right">Prioridad</TableCell>
									<TableCell align="right">Confianza</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{commitments.map((entry, index) => (
									<TableRow key={`${entry.activity}-${index}`}>
										<TableCell>{entry.activity}</TableCell>
										<TableCell>{entry.day}</TableCell>
										<TableCell>{entry.moment}</TableCell>
										<TableCell align="right">{entry.priority}</TableCell>
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

export default BehavioralActivationWeeklyPlanRegisterPage;
