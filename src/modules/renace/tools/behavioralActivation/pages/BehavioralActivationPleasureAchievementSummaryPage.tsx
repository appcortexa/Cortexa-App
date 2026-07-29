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

type PleasureAchievementEntry = {
	activity: string;
	pleasure: number;
	achievement: number;
};

type SummaryPageState = {
	entries?: PleasureAchievementEntry[];
};

function sanitizeEntries(state: unknown): PleasureAchievementEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeEntries = (state as SummaryPageState).entries;

	if (!Array.isArray(maybeEntries)) {
		return [];
	}

	return maybeEntries.filter(
		(entry) =>
			typeof entry.activity === "string" &&
			typeof entry.pleasure === "number" &&
			typeof entry.achievement === "number",
	);
}

function BehavioralActivationPleasureAchievementSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const entries = sanitizeEntries(location.state);
	const hasEntries = entries.length > 0;

	const totalActivities = entries.length;
	const totalPleasure = entries.reduce((sum, entry) => sum + entry.pleasure, 0);
	const totalAchievement = entries.reduce((sum, entry) => sum + entry.achievement, 0);
	const averagePleasure = totalActivities > 0 ? totalPleasure / totalActivities : 0;
	const averageAchievement = totalActivities > 0 ? totalAchievement / totalActivities : 0;
	const summaryMetrics: ExerciseMetric[] = [
		{
			id: "total-activities",
			label: "Número de actividades registradas",
			value: totalActivities,
		},
		{
			id: "average-pleasure",
			label: "Promedio de placer",
			value: averagePleasure.toFixed(1),
		},
		{
			id: "average-achievement",
			label: "Promedio de logro",
			value: averageAchievement.toFixed(1),
		},
	];

	if (!hasEntries) {
		return <Navigate to="/renace/activacion-conductual/registro-placer-logro/registro" replace />;
	}

	return (
		<InterventionScreenLayout
			title="Resumen de Registro Placer–Logro"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/registro-placer-logro/registro", {
								state: { entries },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/activacion-conductual/registro-placer-logro/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<ExerciseMetricsCards metrics={summaryMetrics} />

			<TableContainer>
				<Table size="small" aria-label="Resumen de actividades registradas">
					<TableHead>
						<TableRow>
							<TableCell>Actividad</TableCell>
							<TableCell align="right">Placer</TableCell>
							<TableCell align="right">Logro</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{entries.map((entry, index) => (
							<TableRow key={`${entry.activity}-${index}`}>
								<TableCell>{entry.activity}</TableCell>
								<TableCell align="right">{entry.pleasure}</TableCell>
								<TableCell align="right">{entry.achievement}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default BehavioralActivationPleasureAchievementSummaryPage;
