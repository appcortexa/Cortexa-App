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
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type EvidenceAnalysisRecord = {
	thought: string;
	supportingFacts: string;
	doubtingFacts: string;
	convictionLevel: number;
};

type SummaryPageState = {
	records?: EvidenceAnalysisRecord[];
};

function sanitizeRecords(state: unknown): EvidenceAnalysisRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as SummaryPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.thought === "string" &&
			typeof record.supportingFacts === "string" &&
			typeof record.doubtingFacts === "string" &&
			typeof record.convictionLevel === "number",
	);
}

function CognitiveRestructuringEvidenceAnalysisSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return <Navigate to="/renace/reestructuracion-cognitiva/analisis-evidencias/registro" replace />;
	}

	const totalThoughts = records.length;
	const totalConviction = records.reduce((sum, record) => sum + record.convictionLevel, 0);
	const averageConviction = totalConviction / totalThoughts;
	const recordsWithBothFacts = records.filter(
		(record) => record.supportingFacts.trim().length > 0 && record.doubtingFacts.trim().length > 0,
	).length;

	return (
		<InterventionScreenLayout
			title="Resumen de Análisis de Evidencias"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/reestructuracion-cognitiva/analisis-evidencias/registro", {
								state: { records },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/reestructuracion-cognitiva/analisis-evidencias/final")}
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
						label: "Número de pensamientos analizados",
						value: totalThoughts,
					},
					{
						id: "average-conviction",
						label: "Convicción promedio",
						value: averageConviction.toFixed(1),
					},
					{
						id: "records-with-both-facts",
						label: "Registros con hechos que apoyan y hechos que generan dudas",
						value: recordsWithBothFacts,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de análisis de evidencias">
					<TableHead>
						<TableRow>
							<TableCell>Pensamiento</TableCell>
							<TableCell>Hechos que lo apoyan</TableCell>
							<TableCell>Hechos que generan dudas</TableCell>
							<TableCell align="right">Nivel de convicción</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.thought}-${index}`}>
								<TableCell>{record.thought}</TableCell>
								<TableCell>{record.supportingFacts || "-"}</TableCell>
								<TableCell>{record.doubtingFacts || "-"}</TableCell>
								<TableCell align="right">{record.convictionLevel}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default CognitiveRestructuringEvidenceAnalysisSummaryPage;