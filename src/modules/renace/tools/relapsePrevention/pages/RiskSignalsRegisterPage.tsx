import { Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type RiskSignalRecord = {
	riskSituation: string;
	warningSignal: string;
	riskLevel: number;
	notes?: string;
};

type RegisterPageState = { records?: RiskSignalRecord[] };

function sanitizeRecords(state: unknown): RiskSignalRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as RegisterPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record): record is RiskSignalRecord =>
		typeof record.riskSituation === "string" && typeof record.warningSignal === "string" && typeof record.riskLevel === "number" &&
		(typeof record.notes === "undefined" || typeof record.notes === "string"),
	);
}

function RiskSignalsRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<RiskSignalRecord[]>(initialRecords);
	const [riskSituation, setRiskSituation] = useState("");
	const [warningSignal, setWarningSignal] = useState("");
	const [riskLevel, setRiskLevel] = useState(5);
	const [notes, setNotes] = useState("");
	const [riskSituationError, setRiskSituationError] = useState(false);
	const [warningSignalError, setWarningSignalError] = useState(false);

	const resetForm = () => {
		setRiskSituation(""); setWarningSignal(""); setRiskLevel(5); setNotes(""); setRiskSituationError(false); setWarningSignalError(false);
	};
	const saveRecord = () => {
		const situation = riskSituation.trim();
		const signal = warningSignal.trim();
		setRiskSituationError(!situation);
		setWarningSignalError(!signal);
		if (!situation || !signal) return;
		setRecords((current) => [...current, { riskSituation: situation, warningSignal: signal, riskLevel, notes: notes.trim() || undefined }]);
		resetForm();
	};

	return (
		<InterventionScreenLayout title="Registro de Señales de Riesgo" description="Registra las situaciones y señales de alerta que has identificado." actions={
			<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
				<Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/identificacion-senales-riesgo/introduccion")}>Regresar</Button>
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
					{records.length > 0 ? <Button variant="outlined" size="large" onClick={resetForm}>Agregar otro registro</Button> : null}
					<Button variant="contained" size="large" disabled={records.length === 0} onClick={() => navigate("/renace/prevencion-recaidas/identificacion-senales-riesgo/resumen", { state: { records } })}>Finalizar</Button>
				</Stack>
			</Stack>
		}>
			<Stack spacing={2}>
				<TextField required multiline minRows={3} fullWidth label="Situación de riesgo" value={riskSituation} onChange={(event) => { setRiskSituation(event.target.value); if (riskSituationError && event.target.value.trim()) setRiskSituationError(false); }} error={riskSituationError} helperText={riskSituationError ? "Este campo es obligatorio." : " "} />
				<TextField required multiline minRows={3} fullWidth label="Señal de alerta identificada" value={warningSignal} onChange={(event) => { setWarningSignal(event.target.value); if (warningSignalError && event.target.value.trim()) setWarningSignalError(false); }} error={warningSignalError} helperText={warningSignalError ? "Este campo es obligatorio." : " "} />
				<EmotionIntensitySlider label="Nivel de riesgo" value={riskLevel} onChange={setRiskLevel} />
				<TextField multiline minRows={3} fullWidth label="Observaciones adicionales" value={notes} onChange={(event) => setNotes(event.target.value)} />
				<Button variant="contained" size="large" onClick={saveRecord}>Guardar registro</Button>
				<Alert severity={records.length ? "success" : "info"}>{records.length ? "Registro guardado. Puedes agregar otro registro o finalizar." : "Aún no hay señales registradas."}</Alert>
				{records.length ? <TableContainer><Table size="small" aria-label="Señales de riesgo registradas"><TableHead><TableRow><TableCell>Situación de riesgo</TableCell><TableCell>Señal de alerta</TableCell><TableCell align="right">Nivel de riesgo</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.riskSituation}-${index}`}><TableCell>{record.riskSituation}</TableCell><TableCell>{record.warningSignal}</TableCell><TableCell align="right">{record.riskLevel}</TableCell></TableRow>)}</TableBody></Table></TableContainer> : null}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default RiskSignalsRegisterPage;
