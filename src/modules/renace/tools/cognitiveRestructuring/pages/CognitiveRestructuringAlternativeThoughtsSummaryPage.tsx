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

type AlternativeThoughtRecord = {
	originalThought: string;
	alternativeInterpretation: string;
	credibility: number;
	actionPlan: string;
};

type SummaryPageState = {
	records?: AlternativeThoughtRecord[];
};

function sanitizeRecords(state: unknown): AlternativeThoughtRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as SummaryPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.originalThought === "string" &&
			typeof record.alternativeInterpretation === "string" &&
			typeof record.credibility === "number" &&
			typeof record.actionPlan === "string",
	);
}

function CognitiveRestructuringAlternativeThoughtsSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return <Navigate to="/renace/reestructuracion-cognitiva/pensamientos-alternativos/registro" replace />;
	}

	const totalThoughts = records.length;
	const totalCredibility = records.reduce((sum, record) => sum + record.credibility, 0);
	const averageCredibility = totalCredibility / totalThoughts;
	const recordsWithActionPlan = records.filter((record) => record.actionPlan.trim().length > 0).length;

	return (
		<InterventionScreenLayout
			title="Resumen de Pensamientos Alternativos"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/reestructuracion-cognitiva/pensamientos-alternativos/registro", {
								state: { records },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/reestructuracion-cognitiva/pensamientos-alternativos/final")}
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
						label: "Número de pensamientos trabajados",
						value: totalThoughts,
					},
					{
						id: "average-credibility",
						label: "Credibilidad promedio",
						value: averageCredibility.toFixed(1),
					},
					{
						id: "records-with-action-plan",
						label: "Registros que incluyen un plan de acción",
						value: recordsWithActionPlan,
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de pensamientos alternativos">
					<TableHead>
						<TableRow>
							<TableCell>Pensamiento original</TableCell>
							<TableCell>Nueva interpretación</TableCell>
							<TableCell align="right">Credibilidad</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.originalThought}-${index}`}>
								<TableCell>{record.originalThought}</TableCell>
								<TableCell>{record.alternativeInterpretation}</TableCell>
								<TableCell align="right">{record.credibility}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default CognitiveRestructuringAlternativeThoughtsSummaryPage;
