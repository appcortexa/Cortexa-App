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

type ActionWithMeaningExercise = {
	repetitiveThought: string;
	valuableAction: string;
	lifeArea: string;
	actionSatisfaction: number;
};

type SummaryPageState = {
	exercises?: ActionWithMeaningExercise[];
};

function sanitizeExercises(state: unknown): ActionWithMeaningExercise[] {
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
			typeof exercise.valuableAction === "string" &&
			typeof exercise.lifeArea === "string" &&
			typeof exercise.actionSatisfaction === "number",
	);
}

function AntiRuminationActionWithMeaningSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const exercises = sanitizeExercises(location.state);
	const hasExercises = exercises.length > 0;

	if (!hasExercises) {
		return <Navigate to="/renace/antirrumiacion/accion-con-sentido/registro" replace />;
	}

	const totalExercises = exercises.length;
	const totalSatisfaction = exercises.reduce((sum, exercise) => sum + exercise.actionSatisfaction, 0);
	const averageSatisfaction = totalSatisfaction / totalExercises;
	const uniqueLifeAreasCount = new Set(
		exercises
			.map((exercise) => exercise.lifeArea.trim().toLowerCase())
			.filter((lifeArea) => lifeArea.length > 0),
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
							navigate("/renace/antirrumiacion/accion-con-sentido/registro", {
								state: { exercises },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/antirrumiacion/accion-con-sentido/final")}
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
						label: "Número de acciones registradas",
						value: totalExercises,
					},
					{
						id: "average-satisfaction",
						label: "Satisfacción promedio",
						value: averageSatisfaction.toFixed(1),
					},
					{
						id: "different-life-areas",
						label: "Número de áreas diferentes fortalecidas",
						value: uniqueLifeAreasCount,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de ejercicios de acción con sentido">
					<TableHead>
						<TableRow>
							<TableCell>Pensamiento repetitivo</TableCell>
							<TableCell>Acción realizada</TableCell>
							<TableCell>Área fortalecida</TableCell>
							<TableCell align="right">Satisfacción</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{exercises.map((exercise, index) => (
							<TableRow key={`${exercise.repetitiveThought}-${index}`}>
								<TableCell>{exercise.repetitiveThought}</TableCell>
								<TableCell>{exercise.valuableAction}</TableCell>
								<TableCell>{exercise.lifeArea}</TableCell>
								<TableCell align="right">{exercise.actionSatisfaction}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default AntiRuminationActionWithMeaningSummaryPage;
