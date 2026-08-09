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
import EmotionSummaryCard from "../components/EmotionSummaryCard";

type ReevaluationRecord = {
	situation: string;
	initialInterpretation: string;
	newPerspective: string;
	emotion: string;
	intensity: number;
};

type SummaryPageState = {
	records?: ReevaluationRecord[];
};

function sanitizeRecords(state: unknown): ReevaluationRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as SummaryPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record): record is ReevaluationRecord =>
			typeof record.situation === "string" &&
			typeof record.initialInterpretation === "string" &&
			typeof record.newPerspective === "string" &&
			typeof record.emotion === "string" &&
			typeof record.intensity === "number",
	);
}

function EmotionReevaluationSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return <Navigate to="/renace/regulacion-emocional/reevaluacion-emocional/registro" replace />;
	}

	const totalRecords = records.length;
	const averageIntensity = records.reduce((sum, record) => sum + record.intensity, 0) / totalRecords;
	const differentEmotions = new Set(records.map((record) => record.emotion.trim().toLowerCase())).size;

	return (
		<InterventionScreenLayout
			title="Resumen de Reevaluación Emocional"
			description="Revisa los registros para comparar la situación, la nueva perspectiva y la emoción predominante actual."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/reevaluacion-emocional/registro", { state: { records } })}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/reevaluacion-emocional/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<EmotionSummaryCard
				title="Indicadores"
				indicators={[
					{
						id: "total-records",
						label: "Número de ejercicios realizados",
						value: totalRecords,
					},
					{
						id: "average-intensity",
						label: "Intensidad promedio",
						value: averageIntensity.toFixed(1),
					},
					{
						id: "different-emotions",
						label: "Número de emociones diferentes identificadas",
						value: differentEmotions,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de reevaluación emocional">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Interpretación inicial</TableCell>
							<TableCell>Nueva perspectiva</TableCell>
							<TableCell>Emoción predominante</TableCell>
							<TableCell>Intensidad actual</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.initialInterpretation}</TableCell>
								<TableCell>{record.newPerspective}</TableCell>
								<TableCell>{record.emotion}</TableCell>
								<TableCell>{record.intensity}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default EmotionReevaluationSummaryPage;
