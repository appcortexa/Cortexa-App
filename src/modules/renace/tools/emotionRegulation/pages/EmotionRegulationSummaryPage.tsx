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
import type { EmotionRecord } from "../models/EmotionRecord";

type SummaryPageState = {
	records?: EmotionRecord[];
};

function sanitizeRecords(state: unknown): EmotionRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as SummaryPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.situation === "string" &&
			typeof record.emotion === "string" &&
			typeof record.intensity === "number" &&
			Array.isArray(record.physicalSensations),
	);
}

function EmotionRegulationSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return <Navigate to="/renace/regulacion-emocional/identificacion-emocional/registro" replace />;
	}

	const totalRecords = records.length;
	const totalIntensity = records.reduce((sum, record) => sum + record.intensity, 0);
	const averageIntensity = totalIntensity / totalRecords;
	const differentEmotions = new Set(records.map((record) => record.emotion.trim().toLowerCase())).size;

	return (
		<InterventionScreenLayout
			title="Resumen de Identificación Emocional"
			description="Revisa los registros realizados para identificar patrones entre situaciones, emociones y cambios físicos."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/identificacion-emocional/registro", { state: { records } })}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/identificacion-emocional/final")}
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
						label: "Número de emociones registradas",
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
				<Table size="small" aria-label="Resumen de identificación emocional">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Emoción</TableCell>
							<TableCell>Intensidad</TableCell>
							<TableCell>Cambios físicos</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.emotion}</TableCell>
								<TableCell>{record.intensity}</TableCell>
								<TableCell>{record.physicalSensations.join(", ")}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default EmotionRegulationSummaryPage;
