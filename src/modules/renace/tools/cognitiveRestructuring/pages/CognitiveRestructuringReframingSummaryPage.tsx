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

type ReframingRecord = {
	situation: string;
	initialInterpretation: string;
	friendPerspective: string;
	newPerspective: string;
	perceivedUsefulness: number;
};

type SummaryPageState = {
	records?: ReframingRecord[];
};

function sanitizeRecords(state: unknown): ReframingRecord[] {
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
			typeof record.initialInterpretation === "string" &&
			typeof record.friendPerspective === "string" &&
			typeof record.newPerspective === "string" &&
			typeof record.perceivedUsefulness === "number",
	);
}

function CognitiveRestructuringReframingSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return <Navigate to="/renace/reestructuracion-cognitiva/reencuadre-cognitivo/registro" replace />;
	}

	const totalSituations = records.length;
	const totalUsefulness = records.reduce((sum, record) => sum + record.perceivedUsefulness, 0);
	const averageUsefulness = totalUsefulness / totalSituations;
	const completedReframes = records.filter((record) => record.newPerspective.trim().length > 0).length;

	return (
		<InterventionScreenLayout
			title="Resumen de Reencuadre Cognitivo"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/reestructuracion-cognitiva/reencuadre-cognitivo/registro", {
								state: { records },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/reestructuracion-cognitiva/reencuadre-cognitivo/final")}
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
						id: "total-situations",
						label: "Número de situaciones trabajadas",
						value: totalSituations,
					},
					{
						id: "average-usefulness",
						label: "Utilidad promedio",
						value: averageUsefulness.toFixed(1),
					},
					{
						id: "completed-reframes",
						label: "Número de reencuadres completados",
						value: completedReframes,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de reencuadre cognitivo">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Interpretación inicial</TableCell>
							<TableCell>Nueva perspectiva</TableCell>
							<TableCell align="right">Utilidad percibida</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.initialInterpretation}</TableCell>
								<TableCell>{record.newPerspective}</TableCell>
								<TableCell align="right">{record.perceivedUsefulness}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default CognitiveRestructuringReframingSummaryPage;
