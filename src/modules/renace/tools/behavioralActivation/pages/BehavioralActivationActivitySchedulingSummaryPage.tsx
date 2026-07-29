import {
	Button,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ExerciseMetricsCards from "../../shared/components/ExerciseMetricsCards";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import type { ExerciseMetric } from "../../shared/types/exercise";

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

type SummaryPageState = {
	activities?: ActivityScheduleEntry[];
};

function sanitizeActivities(state: unknown): ActivityScheduleEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeActivities = (state as SummaryPageState).activities;

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

function BehavioralActivationActivitySchedulingSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const activities = sanitizeActivities(location.state);
	const hasActivities = activities.length > 0;

	const totalActivities = activities.length;
	const totalDifficulty = activities.reduce((sum, entry) => sum + entry.difficulty, 0);
	const totalConfidence = activities.reduce((sum, entry) => sum + entry.confidence, 0);
	const averageDifficulty = totalActivities > 0 ? totalDifficulty / totalActivities : 0;
	const averageConfidence = totalActivities > 0 ? totalConfidence / totalActivities : 0;
	const summaryMetrics: ExerciseMetric[] = [
		{
			id: "total-activities",
			label: "Número de actividades",
			value: totalActivities,
		},
		{
			id: "average-difficulty",
			label: "Promedio de dificultad",
			value: averageDifficulty.toFixed(1),
		},
		{
			id: "average-confidence",
			label: "Promedio de confianza",
			value: averageConfidence.toFixed(1),
		},
	];

	if (!hasActivities) {
		return <Navigate to="/renace/activacion-conductual/agenda-actividades/programacion" replace />;
	}

	return (
		<InterventionScreenLayout
			title="Resumen de Programación"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/agenda-actividades/programacion", {
								state: { activities },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/activacion-conductual/agenda-actividades/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<ExerciseMetricsCards metrics={summaryMetrics} />

			<TableContainer>
				<Table size="small" aria-label="Resumen de actividades programadas">
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
		</InterventionScreenLayout>
	);
}

export default BehavioralActivationActivitySchedulingSummaryPage;
