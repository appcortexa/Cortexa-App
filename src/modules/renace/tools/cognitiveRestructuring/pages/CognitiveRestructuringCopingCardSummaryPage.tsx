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

type CopingCardRecord = {
	situation: string;
	reminder: string;
	action: string;
	confidenceOfUse: number;
};

type SummaryPageState = {
	records?: CopingCardRecord[];
};

function sanitizeRecords(state: unknown): CopingCardRecord[] {
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
			typeof record.reminder === "string" &&
			typeof record.action === "string" &&
			typeof record.confidenceOfUse === "number",
	);
}

function CognitiveRestructuringCopingCardSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return <Navigate to="/renace/reestructuracion-cognitiva/tarjeta-afrontamiento/registro" replace />;
	}

	const totalCards = records.length;
	const totalConfidence = records.reduce((sum, record) => sum + record.confidenceOfUse, 0);
	const averageConfidence = totalConfidence / totalCards;
	const definedActions = records.filter((record) => record.action.trim().length > 0).length;

	return (
		<InterventionScreenLayout
			title="Resumen de Tarjetas de Afrontamiento"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/reestructuracion-cognitiva/tarjeta-afrontamiento/registro", {
								state: { records },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/reestructuracion-cognitiva/tarjeta-afrontamiento/final")}
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
						id: "total-cards",
						label: "Número de tarjetas creadas",
						value: totalCards,
					},
					{
						id: "average-confidence",
						label: "Confianza promedio",
						value: averageConfidence.toFixed(1),
					},
					{
						id: "defined-actions",
						label: "Número de acciones definidas",
						value: definedActions,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de tarjetas de afrontamiento">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Recordatorio</TableCell>
							<TableCell>Acción</TableCell>
							<TableCell align="right">Confianza de uso</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.reminder}</TableCell>
								<TableCell>{record.action}</TableCell>
								<TableCell align="right">{record.confidenceOfUse}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default CognitiveRestructuringCopingCardSummaryPage;
