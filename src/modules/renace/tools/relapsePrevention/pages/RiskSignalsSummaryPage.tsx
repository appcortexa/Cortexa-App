import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { RelapseSummaryCard } from "../../../relapsePrevention/RelapseSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type RiskSignalRecord = { riskSituation: string; warningSignal: string; riskLevel: number; notes?: string };
type SummaryPageState = { records?: RiskSignalRecord[] };

function sanitizeRecords(state: unknown): RiskSignalRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as SummaryPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record): record is RiskSignalRecord =>
		typeof record.riskSituation === "string" && typeof record.warningSignal === "string" && typeof record.riskLevel === "number");
}

function RiskSignalsSummaryPage() {
	const navigate = useNavigate();
	const records = sanitizeRecords(useLocation().state);
	if (!records.length) return <Navigate to="/renace/prevencion-recaidas/identificacion-senales-riesgo/registro" replace />;
	const averageRiskLevel = records.reduce((total, record) => total + record.riskLevel, 0) / records.length;
	const differentSituations = new Set(records.map((record) => record.riskSituation.trim().toLocaleLowerCase())).size;

	return <InterventionScreenLayout title="Resumen de Señales de Riesgo" actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/identificacion-senales-riesgo/registro", { state: { records } })}>Volver al registro</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/prevencion-recaidas/identificacion-senales-riesgo/final")}>Finalizar</Button></Stack>}>
		<RelapseSummaryCard title="Indicadores" indicators={[{ label: "Número de señales registradas", value: records.length }, { label: "Nivel promedio de riesgo", value: averageRiskLevel.toFixed(1) }, { label: "Número de situaciones diferentes registradas", value: differentSituations }]} />
		<TableContainer><Table size="small" aria-label="Resumen de señales de riesgo"><TableHead><TableRow><TableCell>Situación de riesgo</TableCell><TableCell>Señal de alerta</TableCell><TableCell align="right">Nivel de riesgo</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.riskSituation}-${index}`}><TableCell>{record.riskSituation}</TableCell><TableCell>{record.warningSignal}</TableCell><TableCell align="right">{record.riskLevel}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
	</InterventionScreenLayout>;
}

export default RiskSignalsSummaryPage;
