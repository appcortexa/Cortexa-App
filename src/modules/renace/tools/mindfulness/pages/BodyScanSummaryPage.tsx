import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { MindfulnessSummaryCard } from "../../../mindfulness/MindfulnessSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type BodyScanRecord = { bodyArea: string; predominantSensation: string; sensationIntensity: number; additionalObservations: string };
type SummaryPageState = { records?: BodyScanRecord[] };

function sanitizeRecords(state: unknown): BodyScanRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as SummaryPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter(
		(record) =>
			typeof record.bodyArea === "string" &&
			typeof record.predominantSensation === "string" &&
			record.predominantSensation.trim().length > 0 &&
			typeof record.sensationIntensity === "number" &&
			record.sensationIntensity >= 0 &&
			record.sensationIntensity <= 10 &&
			typeof record.additionalObservations === "string",
	);
}

function BodyScanSummaryPage() {
	const navigate = useNavigate();
	const records = sanitizeRecords(useLocation().state);
	if (records.length === 0) return <Navigate to="/renace/mindfulness/escaneo-corporal/registro" replace />;

	const averageIntensity = records.reduce((sum, record) => sum + record.sensationIntensity, 0) / records.length;
	const differentBodyAreas = new Set(records.map((record) => record.bodyArea)).size;

	return (
		<InterventionScreenLayout
			title="Resumen de Escaneo Corporal"
			actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/mindfulness/escaneo-corporal/registro", { state: { records } })}>Volver al registro</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/mindfulness/escaneo-corporal/final")}>Finalizar</Button></Stack>}
		>
			<MindfulnessSummaryCard title="Indicadores" indicators={[{ label: "Número de registros", value: records.length }, { label: "Intensidad promedio", value: averageIntensity.toFixed(1) }, { label: "Número de zonas corporales diferentes observadas", value: differentBodyAreas }]} />
			<TableContainer><Table size="small" aria-label="Resumen de escaneo corporal"><TableHead><TableRow><TableCell>Zona corporal</TableCell><TableCell>Sensación predominante</TableCell><TableCell align="right">Intensidad</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.bodyArea}-${index}`}><TableCell>{record.bodyArea}</TableCell><TableCell>{record.predominantSensation}</TableCell><TableCell align="right">{record.sensationIntensity}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
		</InterventionScreenLayout>
	);
}

export default BodyScanSummaryPage;
