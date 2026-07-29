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

type AttentionShiftExercise = {
	initialAttention: string;
	newAttention: string;
	activityPerformed: string;
	attentionEase: number;
};

type SummaryPageState = {
	exercises?: AttentionShiftExercise[];
};

function sanitizeExercises(state: unknown): AttentionShiftExercise[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeExercises = (state as SummaryPageState).exercises;

	if (!Array.isArray(maybeExercises)) {
		return [];
	}

	return maybeExercises.filter(
		(exercise) =>
			typeof exercise.initialAttention === "string" &&
			typeof exercise.newAttention === "string" &&
			typeof exercise.activityPerformed === "string" &&
			typeof exercise.attentionEase === "number",
	);
}

function AntiRuminationAttentionShiftSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const exercises = sanitizeExercises(location.state);
	const hasExercises = exercises.length > 0;

	if (!hasExercises) {
		return <Navigate to="/renace/antirrumiacion/cambio-atencion/registro" replace />;
	}

	const totalExercises = exercises.length;
	const totalEase = exercises.reduce((sum, exercise) => sum + exercise.attentionEase, 0);
	const averageEase = totalEase / totalExercises;
	const differentActivitiesCount = new Set(
		exercises
			.map((exercise) => exercise.activityPerformed.trim().toLowerCase())
			.filter((activity) => activity.length > 0),
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
							navigate("/renace/antirrumiacion/cambio-atencion/registro", {
								state: { exercises },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/antirrumiacion/cambio-atencion/final")}
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
						id: "average-ease",
						label: "Facilidad promedio",
						value: averageEase.toFixed(1),
					},
					{
						id: "different-activities",
						label: "Número de actividades diferentes realizadas",
						value: differentActivitiesCount,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de ejercicios de cambio de atención">
					<TableHead>
						<TableRow>
							<TableCell>Atención inicial</TableCell>
							<TableCell>Nueva atención</TableCell>
							<TableCell>Actividad realizada</TableCell>
							<TableCell align="right">Facilidad</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{exercises.map((exercise, index) => (
							<TableRow key={`${exercise.initialAttention}-${index}`}>
								<TableCell>{exercise.initialAttention}</TableCell>
								<TableCell>{exercise.newAttention}</TableCell>
								<TableCell>{exercise.activityPerformed}</TableCell>
								<TableCell align="right">{exercise.attentionEase}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default AntiRuminationAttentionShiftSummaryPage;