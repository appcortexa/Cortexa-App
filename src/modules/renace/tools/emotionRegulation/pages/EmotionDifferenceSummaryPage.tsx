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

type EmotionDifferenceRecord = {
	situation: string;
	emotions: string[];
	predominantEmotion: string;
	clarity: number;
};

type SummaryPageState = {
	records?: EmotionDifferenceRecord[];
};

function sanitizeRecords(state: unknown): EmotionDifferenceRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as SummaryPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record): record is EmotionDifferenceRecord =>
			typeof record.situation === "string" &&
			Array.isArray(record.emotions) &&
			typeof record.predominantEmotion === "string" &&
			typeof record.clarity === "number",
	);
}

function EmotionDifferenceSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return <Navigate to="/renace/regulacion-emocional/diferenciacion-emocional/registro" replace />;
	}

	const totalRecords = records.length;
	const totalDistinctEmotions = new Set(records.flatMap((record) => record.emotions)).size;
	const averageClarity = records.reduce((sum, record) => sum + record.clarity, 0) / totalRecords;

	return (
		<InterventionScreenLayout
			title="Resumen de Diferenciación Emocional"
			description="Revisa los registros para comparar las emociones presentes, la predominante y la claridad observada."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/diferenciacion-emocional/registro", { state: { records } })}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/diferenciacion-emocional/final")}
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
						label: "Número de registros",
						value: totalRecords,
					},
					{
						id: "total-distinct-emotions",
						label: "Número total de emociones diferentes identificadas",
						value: totalDistinctEmotions,
					},
					{
						id: "average-clarity",
						label: "Claridad promedio",
						value: averageClarity.toFixed(1),
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de diferenciación emocional">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Emociones identificadas</TableCell>
							<TableCell>Emoción predominante</TableCell>
							<TableCell>Claridad emocional</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.emotions.join(", ")}</TableCell>
								<TableCell>{record.predominantEmotion}</TableCell>
								<TableCell>{record.clarity}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default EmotionDifferenceSummaryPage;
