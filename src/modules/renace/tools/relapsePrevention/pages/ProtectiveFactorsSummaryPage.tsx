import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { RelapseSummaryCard } from "../../../relapsePrevention/RelapseSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type ProtectiveFactorRecord = { riskSituation: string; protectiveFactor: string; helpDescription: string; confidence: number; otherResources?: string };
type SummaryPageState = { records?: ProtectiveFactorRecord[] };
const protectiveFactorLabels: Record<string, string> = { "support-network": "Red de apoyo", "professional-support": "Apoyo profesional", "healthy-routines": "Rutinas saludables", "self-care": "Autocuidado", "coping-skills": "Habilidades de afrontamiento", "meaningful-activities": "Actividades significativas" };

function sanitizeRecords(state: unknown): ProtectiveFactorRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as SummaryPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record): record is ProtectiveFactorRecord => typeof record.riskSituation === "string" && typeof record.protectiveFactor === "string" && typeof record.helpDescription === "string" && typeof record.confidence === "number");
}

function ProtectiveFactorsSummaryPage() {
	const navigate = useNavigate();
	const records = sanitizeRecords(useLocation().state);
	if (!records.length) return <Navigate to="/renace/prevencion-recaidas/factores-protectores/registro" replace />;
	const averageConfidence = records.reduce((total, record) => total + record.confidence, 0) / records.length;
	const differentFactors = new Set(records.map((record) => record.protectiveFactor)).size;

	return <InterventionScreenLayout title="Resumen de Factores Protectores" actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/factores-protectores/registro", { state: { records } })}>Volver al registro</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/prevencion-recaidas/factores-protectores/final")}>Finalizar</Button></Stack>}>
		<RelapseSummaryCard title="Indicadores" indicators={[{ label: "Número de factores protectores registrados", value: records.length }, { label: "Confianza promedio", value: averageConfidence.toFixed(1) }, { label: "Número de factores protectores diferentes utilizados", value: differentFactors }]} />
		<TableContainer><Table size="small" aria-label="Resumen de factores protectores"><TableHead><TableRow><TableCell>Situación de riesgo</TableCell><TableCell>Factor protector</TableCell><TableCell align="right">Confianza</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.riskSituation}-${index}`}><TableCell>{record.riskSituation}</TableCell><TableCell>{protectiveFactorLabels[record.protectiveFactor] ?? record.protectiveFactor}</TableCell><TableCell align="right">{record.confidence}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
	</InterventionScreenLayout>;
}

export default ProtectiveFactorsSummaryPage;
