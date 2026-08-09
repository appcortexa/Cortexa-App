import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { RelapseSummaryCard } from "../../../relapsePrevention/RelapseSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type MentalRehearsalRecord = { riskSituation: string; strategy: string; expectedResult: string; confidence: number; improvementAreas?: string };
type SummaryPageState = { records?: MentalRehearsalRecord[] };

function sanitizeRecords(state: unknown): MentalRehearsalRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as SummaryPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record): record is MentalRehearsalRecord => typeof record.riskSituation === "string" && typeof record.strategy === "string" && typeof record.expectedResult === "string" && typeof record.confidence === "number");
}

function MentalRehearsalSummaryPage() {
	const navigate = useNavigate();
	const records = sanitizeRecords(useLocation().state);
	if (!records.length) return <Navigate to="/renace/prevencion-recaidas/ensayo-mental/registro" replace />;
	const averageConfidence = records.reduce((total, record) => total + record.confidence, 0) / records.length;
	const differentStrategies = new Set(records.map((record) => record.strategy.trim().toLocaleLowerCase())).size;

	return <InterventionScreenLayout title="Resumen de Ensayos Mentales" actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/ensayo-mental/registro", { state: { records } })}>Volver al registro</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/prevencion-recaidas/ensayo-mental/final")}>Finalizar</Button></Stack>}>
		<RelapseSummaryCard title="Indicadores" indicators={[{ label: "Número de ensayos realizados", value: records.length }, { label: "Confianza promedio", value: averageConfidence.toFixed(1) }, { label: "Número de estrategias diferentes practicadas", value: differentStrategies }]} />
		<TableContainer><Table size="small" aria-label="Resumen de ensayos mentales"><TableHead><TableRow><TableCell>Situación de riesgo</TableCell><TableCell>Estrategia aplicada</TableCell><TableCell>Resultado esperado</TableCell><TableCell align="right">Confianza</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.riskSituation}-${index}`}><TableCell>{record.riskSituation}</TableCell><TableCell>{record.strategy}</TableCell><TableCell>{record.expectedResult}</TableCell><TableCell align="right">{record.confidence}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
	</InterventionScreenLayout>;
}

export default MentalRehearsalSummaryPage;
