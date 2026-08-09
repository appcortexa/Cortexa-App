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

type PhysiologicalRecord = {
	emotion: string;
	strategy: string;
	intensityBefore: number;
	intensityAfter: number;
	bodyChanges: string;
};

type SummaryPageState = {
	records?: PhysiologicalRecord[];
};

function sanitizeRecords(state: unknown): PhysiologicalRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as SummaryPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record): record is PhysiologicalRecord =>
			typeof record.emotion === "string" &&
			typeof record.strategy === "string" &&
			typeof record.intensityBefore === "number" &&
			typeof record.intensityAfter === "number" &&
			typeof record.bodyChanges === "string",
	);
}

function EmotionPhysiologicalSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);
	const hasRecords = records.length > 0;

	if (!hasRecords) {
		return <Navigate to="/renace/regulacion-emocional/regulacion-fisiologica/registro" replace />;
	}

	const totalRecords = records.length;
	const averageBefore = records.reduce((sum, record) => sum + record.intensityBefore, 0) / totalRecords;
	const averageAfter = records.reduce((sum, record) => sum + record.intensityAfter, 0) / totalRecords;
	const averageChange = averageBefore - averageAfter;

	return (
		<InterventionScreenLayout
			title="Resumen de Regulación Fisiológica"
			description="Revisa los registros realizados para comparar la intensidad emocional antes y después de la estrategia breve."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/regulacion-fisiologica/registro", { state: { records } })}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/regulacion-fisiologica/final")}
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
						id: "average-before",
						label: "Intensidad promedio antes",
						value: averageBefore.toFixed(1),
					},
					{
						id: "average-after",
						label: "Intensidad promedio después",
						value: averageAfter.toFixed(1),
					},
					{
						id: "average-change",
						label: "Cambio promedio de intensidad (Antes − Después)",
						value: averageChange.toFixed(1),
					},
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de regulación fisiológica">
					<TableHead>
						<TableRow>
							<TableCell>Emoción</TableCell>
							<TableCell>Estrategia utilizada</TableCell>
							<TableCell>Intensidad antes</TableCell>
							<TableCell>Intensidad después</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.emotion}-${index}`}>
								<TableCell>{record.emotion}</TableCell>
								<TableCell>{record.strategy}</TableCell>
								<TableCell>{record.intensityBefore}</TableCell>
								<TableCell>{record.intensityAfter}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default EmotionPhysiologicalSummaryPage;
