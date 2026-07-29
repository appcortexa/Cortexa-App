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

import RuminationSummaryCard from "../components/RuminationSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type BreakCycleExercise = {
	repetitiveThought: string;
	strategyUsed: string;
	observedOutcome: string;
	perceivedUsefulness: number;
};

type SummaryPageState = {
	exercises?: BreakCycleExercise[];
};

function sanitizeExercises(state: unknown): BreakCycleExercise[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeExercises = (state as SummaryPageState).exercises;

	if (!Array.isArray(maybeExercises)) {
		return [];
	}

	return maybeExercises.filter(
		(exercise) =>
			typeof exercise.repetitiveThought === "string" &&
			typeof exercise.strategyUsed === "string" &&
			typeof exercise.observedOutcome === "string" &&
			typeof exercise.perceivedUsefulness === "number",
	);
}

function AntiRuminationBreakCycleSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const exercises = sanitizeExercises(location.state);
	const hasExercises = exercises.length > 0;

	if (!hasExercises) {
		return <Navigate to="/renace/antirrumiacion/romper-ciclo/registro" replace />;
	}

	const totalExercises = exercises.length;
	const totalUsefulness = exercises.reduce((sum, exercise) => sum + exercise.perceivedUsefulness, 0);
	const averageUsefulness = totalUsefulness / totalExercises;
	const uniqueStrategiesCount = new Set(
		exercises
			.map((exercise) => exercise.strategyUsed.trim().toLowerCase())
			.filter((strategyUsed) => strategyUsed.length > 0),
	).size;

	return (
		<InterventionScreenLayout
			title="Resumen"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/antirrumiacion/romper-ciclo/registro", {
								state: { exercises },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/antirrumiacion/romper-ciclo/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<RuminationSummaryCard
				title="Indicadores"
				metrics={[
					{
						id: "total-exercises",
						label: "Número de ejercicios registrados",
						value: totalExercises,
					},
					{
						id: "average-usefulness",
						label: "Utilidad promedio",
						value: averageUsefulness.toFixed(1),
					},
					{
						id: "different-strategies",
						label: "Número de estrategias diferentes utilizadas",
						value: uniqueStrategiesCount,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de ejercicios de romper el ciclo">
					<TableHead>
						<TableRow>
							<TableCell>Pensamiento repetitivo</TableCell>
							<TableCell>Estrategia utilizada</TableCell>
							<TableCell>Resultado observado</TableCell>
							<TableCell align="right">Utilidad percibida</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{exercises.map((exercise, index) => (
							<TableRow key={`${exercise.repetitiveThought}-${index}`}>
								<TableCell>{exercise.repetitiveThought}</TableCell>
								<TableCell>{exercise.strategyUsed}</TableCell>
								<TableCell>{exercise.observedOutcome}</TableCell>
								<TableCell align="right">{exercise.perceivedUsefulness}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default AntiRuminationBreakCycleSummaryPage;