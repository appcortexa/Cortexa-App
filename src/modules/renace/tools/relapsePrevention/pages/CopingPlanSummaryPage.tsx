import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { RelapseSummaryCard } from "../../../relapsePrevention/RelapseSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type CopingPlanRecord = { riskSituation: string; copingStrategy: string; firstStep: string; confidence: number; supportResource?: string };
type SummaryPageState = { records?: CopingPlanRecord[] };

function sanitizeRecords(state: unknown): CopingPlanRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as SummaryPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record): record is CopingPlanRecord => typeof record.riskSituation === "string" && typeof record.copingStrategy === "string" && typeof record.firstStep === "string" && typeof record.confidence === "number");
}

function CopingPlanSummaryPage() {
	const navigate = useNavigate();
	const records = sanitizeRecords(useLocation().state);
	if (!records.length) return <Navigate to="/renace/prevencion-recaidas/plan-afrontamiento/registro" replace />;
	const averageConfidence = records.reduce((total, record) => total + record.confidence, 0) / records.length;
	const differentStrategies = new Set(records.map((record) => record.copingStrategy.trim().toLocaleLowerCase())).size;

	return <InterventionScreenLayout title="Resumen de Planes de Afrontamiento" actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/plan-afrontamiento/registro", { state: { records } })}>Volver al registro</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/prevencion-recaidas/plan-afrontamiento/final")}>Finalizar</Button></Stack>}>
		<RelapseSummaryCard title="Indicadores" indicators={[{ label: "Número de planes registrados", value: records.length }, { label: "Confianza promedio", value: averageConfidence.toFixed(1) }, { label: "Número de estrategias diferentes", value: differentStrategies }]} />
		<TableContainer><Table size="small" aria-label="Resumen de planes de afrontamiento"><TableHead><TableRow><TableCell>Situación de riesgo</TableCell><TableCell>Estrategia de afrontamiento</TableCell><TableCell>Primer paso</TableCell><TableCell align="right">Confianza</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.riskSituation}-${index}`}><TableCell>{record.riskSituation}</TableCell><TableCell>{record.copingStrategy}</TableCell><TableCell>{record.firstStep}</TableCell><TableCell align="right">{record.confidence}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
	</InterventionScreenLayout>;
}

export default CopingPlanSummaryPage;
