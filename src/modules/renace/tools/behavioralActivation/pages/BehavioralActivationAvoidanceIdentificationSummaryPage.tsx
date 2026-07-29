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

import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import SummaryMetricCard from "../../shared/components/SummaryMetricCard";

type AvoidanceEntry = {
	avoidedActivity: string;
	obstacle: string;
	intensity: number;
	alternative: string;
};

type SummaryPageState = {
	entries?: AvoidanceEntry[];
};

function sanitizeEntries(state: unknown): AvoidanceEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeEntries = (state as SummaryPageState).entries;

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

function BehavioralActivationAvoidanceIdentificationSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const entries = sanitizeEntries(location.state);
	const hasEntries = entries.length > 0;

	const totalSituations = entries.length;
	const totalIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0);
	const averageIntensity = totalSituations > 0 ? totalIntensity / totalSituations : 0;
	const alternativesCount = entries.filter((entry) => entry.alternative.trim().length > 0).length;

	if (!hasEntries) {
		return <Navigate to="/renace/activacion-conductual/identificacion-evitacion/registro" replace />;
	}

	return (
		<InterventionScreenLayout
			title="Resumen de Identificación de Evitación"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/identificacion-evitacion/registro", {
								state: { entries },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/activacion-conductual/identificacion-evitacion/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<Stack spacing={1}>
				<SummaryMetricCard label="Número de situaciones registradas" value={totalSituations} />
				<SummaryMetricCard label="Intensidad promedio" value={averageIntensity.toFixed(1)} />
				<SummaryMetricCard label="Estrategias alternativas propuestas" value={alternativesCount} />
			</Stack>

			<TableContainer>
				<Table size="small" aria-label="Resumen de evitación">
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
		</InterventionScreenLayout>
	);
}

export default BehavioralActivationAvoidanceIdentificationSummaryPage;
