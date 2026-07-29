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

import CognitiveSummaryCard from "../components/CognitiveSummaryCard";
import type { CognitiveRecord } from "../models/CognitiveRecord";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type AutomaticThoughtRecord = Pick<CognitiveRecord, "situation" | "automaticThought" | "emotion" | "emotionIntensity">;

type SummaryPageState = {
	records?: AutomaticThoughtRecord[];
};

function sanitizeRecords(state: unknown): AutomaticThoughtRecord[] {
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
			typeof record.automaticThought === "string" &&
			typeof record.emotion === "string" &&
			typeof record.emotionIntensity === "number",
	);
}

function CognitiveRestructuringAutomaticThoughtsSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return (
			<Navigate
				to="/renace/reestructuracion-cognitiva/deteccion-pensamientos-automaticos/registro"
				replace
			/>
		);
	}

	const totalThoughts = records.length;
	const totalEmotionIntensity = records.reduce((sum, record) => sum + record.emotionIntensity, 0);
	const averageEmotionIntensity = totalEmotionIntensity / totalThoughts;
	const differentEmotions = new Set(records.map((record) => record.emotion.trim().toLowerCase())).size;

	return (
		<InterventionScreenLayout
			title="Resumen de Pensamientos Registrados"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate(
								"/renace/reestructuracion-cognitiva/deteccion-pensamientos-automaticos/registro",
								{ state: { records } },
							)
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() =>
							navigate("/renace/reestructuracion-cognitiva/deteccion-pensamientos-automaticos/final")
						}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<CognitiveSummaryCard
				title="Indicadores"
				indicators={[
					{
						id: "total-thoughts",
						label: "Número de pensamientos registrados",
						value: totalThoughts,
					},
					{
						id: "average-emotion-intensity",
						label: "Intensidad emocional promedio",
						value: averageEmotionIntensity.toFixed(1),
					},
					{
						id: "different-emotions",
						label: "Número de emociones diferentes identificadas",
						value: differentEmotions,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de pensamientos automáticos">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Pensamiento automático</TableCell>
							<TableCell>Emoción</TableCell>
							<TableCell align="right">Intensidad</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.automaticThought}</TableCell>
								<TableCell>{record.emotion}</TableCell>
								<TableCell align="right">{record.emotionIntensity}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default CognitiveRestructuringAutomaticThoughtsSummaryPage;
