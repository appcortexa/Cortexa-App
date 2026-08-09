import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { MindfulnessSummaryCard } from "../../../mindfulness/MindfulnessSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type AcceptanceRecord = { experience: string; greatestDifficulty: string; acceptanceLevel: number; learning: string };
type SummaryPageState = { records?: AcceptanceRecord[] };

function sanitizeRecords(state: unknown): AcceptanceRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as SummaryPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record) => typeof record.experience === "string" && typeof record.greatestDifficulty === "string" && typeof record.acceptanceLevel === "number" && record.acceptanceLevel >= 0 && record.acceptanceLevel <= 10 && typeof record.learning === "string");
}

function PresentMomentAcceptanceSummaryPage() {
	const navigate = useNavigate();
	const records = sanitizeRecords(useLocation().state);
	if (records.length === 0) return <Navigate to="/renace/mindfulness/aceptacion-momento-presente/registro" replace />;

	const averageAcceptance = records.reduce((sum, record) => sum + record.acceptanceLevel, 0) / records.length;
	const recordedLearnings = records.filter((record) => record.learning.trim().length > 0).length;

	return (
		<InterventionScreenLayout
			title="Resumen de Aceptación del Momento Presente"
			actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/mindfulness/aceptacion-momento-presente/registro", { state: { records } })}>Volver al registro</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/mindfulness/aceptacion-momento-presente/final")}>Finalizar</Button></Stack>}
		>
			<MindfulnessSummaryCard title="Indicadores" indicators={[{ label: "Número de prácticas", value: records.length }, { label: "Aceptación promedio", value: averageAcceptance.toFixed(1) }, { label: "Número de aprendizajes registrados", value: recordedLearnings }]} />
			<TableContainer><Table size="small" aria-label="Resumen de aceptación del momento presente"><TableHead><TableRow><TableCell>Experiencia</TableCell><TableCell>Mayor dificultad</TableCell><TableCell align="right">Nivel de aceptación</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.experience}-${index}`}><TableCell>{record.experience}</TableCell><TableCell>{record.greatestDifficulty}</TableCell><TableCell align="right">{record.acceptanceLevel}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
		</InterventionScreenLayout>
	);
}

export default PresentMomentAcceptanceSummaryPage;
