import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { MindfulnessSummaryCard } from "../../../mindfulness/MindfulnessSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type ObservationRecord = { experience: string; experienceType: string; judgmentNoticed: string; observationEase: number; additionalComments: string };
type SummaryPageState = { records?: ObservationRecord[] };

function sanitizeRecords(state: unknown): ObservationRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as SummaryPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record) => typeof record.experience === "string" && typeof record.experienceType === "string" && (record.judgmentNoticed === "Sí" || record.judgmentNoticed === "No") && typeof record.observationEase === "number" && record.observationEase >= 0 && record.observationEase <= 10 && typeof record.additionalComments === "string");
}

function ObservationWithoutJudgmentSummaryPage() {
	const navigate = useNavigate();
	const records = sanitizeRecords(useLocation().state);
	if (records.length === 0) return <Navigate to="/renace/mindfulness/observacion-sin-juicio/registro" replace />;

	const averageObservationEase = records.reduce((sum, record) => sum + record.observationEase, 0) / records.length;
	const recordsWithJudgment = records.filter((record) => record.judgmentNoticed === "Sí").length;

	return (
		<InterventionScreenLayout
			title="Resumen de Observación sin Juicio"
			actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/mindfulness/observacion-sin-juicio/registro", { state: { records } })}>Volver al registro</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/mindfulness/observacion-sin-juicio/final")}>Finalizar</Button></Stack>}
		>
			<MindfulnessSummaryCard title="Indicadores" indicators={[{ label: "Número de registros", value: records.length }, { label: "Facilidad promedio", value: averageObservationEase.toFixed(1) }, { label: "Número de registros con juicio identificado", value: recordsWithJudgment }]} />
			<TableContainer><Table size="small" aria-label="Resumen de observación sin juicio"><TableHead><TableRow><TableCell>Experiencia observada</TableCell><TableCell>Tipo</TableCell><TableCell>¿Hubo juicio?</TableCell><TableCell align="right">Facilidad para observar</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.experience}-${index}`}><TableCell>{record.experience}</TableCell><TableCell>{record.experienceType}</TableCell><TableCell>{record.judgmentNoticed}</TableCell><TableCell align="right">{record.observationEase}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
		</InterventionScreenLayout>
	);
}

export default ObservationWithoutJudgmentSummaryPage;
