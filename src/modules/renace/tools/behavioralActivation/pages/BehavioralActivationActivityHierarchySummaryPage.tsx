import {
	Button,
	Grid,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import SummaryMetricCard from "../../shared/components/SummaryMetricCard";

type ActivityHierarchyEntry = {
	activity: string;
	importance: number;
	difficulty: number;
	probability: number;
	priority: number;
};

type SummaryPageState = {
	activities?: ActivityHierarchyEntry[];
};

function sanitizeActivities(state: unknown): ActivityHierarchyEntry[] {
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
			typeof entry.importance === "number" &&
			typeof entry.difficulty === "number" &&
			typeof entry.probability === "number" &&
			typeof entry.priority === "number",
	);
}

function BehavioralActivationActivityHierarchySummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const activities = sanitizeActivities(location.state);
	const hasActivities = activities.length > 0;

	if (!hasActivities) {
		return <Navigate to="/renace/activacion-conductual/jerarquia-actividades/registro" replace />;
	}

	const sortedActivities = [...activities].sort((a, b) => a.priority - b.priority);
	const totalActivities = sortedActivities.length;
	const totalImportance = sortedActivities.reduce((sum, entry) => sum + entry.importance, 0);
	const totalDifficulty = sortedActivities.reduce((sum, entry) => sum + entry.difficulty, 0);
	const totalProbability = sortedActivities.reduce((sum, entry) => sum + entry.probability, 0);
	const averageImportance = totalActivities > 0 ? totalImportance / totalActivities : 0;
	const averageDifficulty = totalActivities > 0 ? totalDifficulty / totalActivities : 0;
	const averageProbability = totalActivities > 0 ? totalProbability / totalActivities : 0;

	return (
		<InterventionScreenLayout
			title="Resumen de Jerarquía"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/jerarquia-actividades/prioridades", {
								state: { activities: sortedActivities },
							})
						}
					>
						Volver a prioridades
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/activacion-conductual/jerarquia-actividades/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<Grid container spacing={1.5}>
				<Grid size={{ xs: 12, sm: 6 }}>
					<SummaryMetricCard label="Número de actividades" value={totalActivities} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<SummaryMetricCard label="Importancia promedio" value={averageImportance.toFixed(1)} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<SummaryMetricCard label="Dificultad promedio" value={averageDifficulty.toFixed(1)} />
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<SummaryMetricCard label="Probabilidad promedio" value={averageProbability.toFixed(1)} />
				</Grid>
			</Grid>

			<TableContainer>
				<Table size="small" aria-label="Resumen de actividades priorizadas">
					<TableHead>
						<TableRow>
							<TableCell align="right">Prioridad</TableCell>
							<TableCell>Actividad</TableCell>
							<TableCell align="right">Importancia</TableCell>
							<TableCell align="right">Dificultad</TableCell>
							<TableCell align="right">Probabilidad</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedActivities.map((entry, index) => (
							<TableRow key={`${entry.activity}-${index}`}>
								<TableCell align="right">{entry.priority}</TableCell>
								<TableCell>{entry.activity}</TableCell>
								<TableCell align="right">{entry.importance}</TableCell>
								<TableCell align="right">{entry.difficulty}</TableCell>
								<TableCell align="right">{entry.probability}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default BehavioralActivationActivityHierarchySummaryPage;
