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

type SummaryPageState = {
	commitments?: WeeklyCommitment[];
};

function sanitizeCommitments(state: unknown): WeeklyCommitment[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeCommitments = (state as SummaryPageState).commitments;

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

function BehavioralActivationWeeklyPlanSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const commitments = sanitizeCommitments(location.state);
	const hasCommitments = commitments.length > 0;

	if (!hasCommitments) {
		return <Navigate to="/renace/activacion-conductual/plan-semanal/registro" replace />;
	}

	const totalCommitments = commitments.length;
	const totalPriority = commitments.reduce((sum, entry) => sum + entry.priority, 0);
	const totalConfidence = commitments.reduce((sum, entry) => sum + entry.confidence, 0);
	const averagePriority = totalCommitments > 0 ? totalPriority / totalCommitments : 0;
	const averageConfidence = totalCommitments > 0 ? totalConfidence / totalCommitments : 0;

	return (
		<InterventionScreenLayout
			title="Resumen del Plan Semanal"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/plan-semanal/registro", {
								state: { commitments },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/activacion-conductual/plan-semanal/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<Grid container spacing={1.5}>
				<Grid size={{ xs: 12, sm: 4 }}>
					<SummaryMetricCard label="Número de compromisos" value={totalCommitments} />
				</Grid>
				<Grid size={{ xs: 12, sm: 4 }}>
					<SummaryMetricCard label="Prioridad promedio" value={averagePriority.toFixed(1)} />
				</Grid>
				<Grid size={{ xs: 12, sm: 4 }}>
					<SummaryMetricCard label="Confianza promedio" value={averageConfidence.toFixed(1)} />
				</Grid>
			</Grid>

			<TableContainer>
				<Table size="small" aria-label="Resumen de compromisos semanales">
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
		</InterventionScreenLayout>
	);
}

export default BehavioralActivationWeeklyPlanSummaryPage;
