import { Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type MentalRehearsalRecord = { riskSituation: string; strategy: string; expectedResult: string; confidence: number; improvementAreas?: string };
type RegisterPageState = { records?: MentalRehearsalRecord[] };

function sanitizeRecords(state: unknown): MentalRehearsalRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as RegisterPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record): record is MentalRehearsalRecord => typeof record.riskSituation === "string" && typeof record.strategy === "string" && typeof record.expectedResult === "string" && typeof record.confidence === "number" && (typeof record.improvementAreas === "undefined" || typeof record.improvementAreas === "string"));
}

function MentalRehearsalRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<MentalRehearsalRecord[]>(initialRecords);
	const [riskSituation, setRiskSituation] = useState("");
	const [strategy, setStrategy] = useState("");
	const [expectedResult, setExpectedResult] = useState("");
	const [confidence, setConfidence] = useState(5);
	const [improvementAreas, setImprovementAreas] = useState("");
	const [errors, setErrors] = useState({ riskSituation: false, strategy: false, expectedResult: false });

	const resetForm = () => { setRiskSituation(""); setStrategy(""); setExpectedResult(""); setConfidence(5); setImprovementAreas(""); setErrors({ riskSituation: false, strategy: false, expectedResult: false }); };
	const saveRecord = () => {
		const situation = riskSituation.trim(); const appliedStrategy = strategy.trim(); const result = expectedResult.trim();
		const nextErrors = { riskSituation: !situation, strategy: !appliedStrategy, expectedResult: !result };
		setErrors(nextErrors);
		if (nextErrors.riskSituation || nextErrors.strategy || nextErrors.expectedResult) return;
		setRecords((current) => [...current, { riskSituation: situation, strategy: appliedStrategy, expectedResult: result, confidence, improvementAreas: improvementAreas.trim() || undefined }]);
		resetForm();
	};

	return <InterventionScreenLayout title="Registro de Ensayos Mentales" description="Registra cómo responderías ante situaciones de riesgo imaginadas." actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/ensayo-mental/introduccion")}>Regresar</Button><Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>{records.length > 0 ? <Button variant="outlined" size="large" onClick={resetForm}>Agregar otro registro</Button> : null}<Button variant="contained" size="large" disabled={records.length === 0} onClick={() => navigate("/renace/prevencion-recaidas/ensayo-mental/resumen", { state: { records } })}>Finalizar</Button></Stack></Stack>}>
		<Stack spacing={2}>
			<TextField required multiline minRows={3} fullWidth label="Situación de riesgo imaginada" value={riskSituation} onChange={(event) => { setRiskSituation(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, riskSituation: false })); }} error={errors.riskSituation} helperText={errors.riskSituation ? "Este campo es obligatorio." : " "} />
			<TextField required multiline minRows={3} fullWidth label="¿Qué estrategia aplicarías primero?" value={strategy} onChange={(event) => { setStrategy(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, strategy: false })); }} error={errors.strategy} helperText={errors.strategy ? "Este campo es obligatorio." : " "} />
			<TextField required multiline minRows={3} fullWidth label="¿Cuál sería el resultado esperado?" value={expectedResult} onChange={(event) => { setExpectedResult(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, expectedResult: false })); }} error={errors.expectedResult} helperText={errors.expectedResult ? "Este campo es obligatorio." : " "} />
			<EmotionIntensitySlider label="Confianza en el ensayo" value={confidence} onChange={setConfidence} />
			<TextField multiline minRows={3} fullWidth label="Aspectos que deseas mejorar" value={improvementAreas} onChange={(event) => setImprovementAreas(event.target.value)} />
			<Button variant="contained" size="large" onClick={saveRecord}>Guardar registro</Button>
			<Alert severity={records.length ? "success" : "info"}>{records.length ? "Registro guardado. Puedes agregar otro registro o finalizar." : "Aún no hay ensayos mentales registrados."}</Alert>
			{records.length ? <TableContainer><Table size="small" aria-label="Ensayos mentales registrados"><TableHead><TableRow><TableCell>Situación de riesgo</TableCell><TableCell>Estrategia aplicada</TableCell><TableCell>Resultado esperado</TableCell><TableCell align="right">Confianza</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.riskSituation}-${index}`}><TableCell>{record.riskSituation}</TableCell><TableCell>{record.strategy}</TableCell><TableCell>{record.expectedResult}</TableCell><TableCell align="right">{record.confidence}</TableCell></TableRow>)}</TableBody></Table></TableContainer> : null}
		</Stack>
	</InterventionScreenLayout>;
}

export default MentalRehearsalRegisterPage;
