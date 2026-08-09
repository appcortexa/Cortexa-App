import { Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type CopingPlanRecord = { riskSituation: string; copingStrategy: string; firstStep: string; confidence: number; supportResource?: string };
type RegisterPageState = { records?: CopingPlanRecord[] };

function sanitizeRecords(state: unknown): CopingPlanRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as RegisterPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record): record is CopingPlanRecord => typeof record.riskSituation === "string" && typeof record.copingStrategy === "string" && typeof record.firstStep === "string" && typeof record.confidence === "number" && (typeof record.supportResource === "undefined" || typeof record.supportResource === "string"));
}

function CopingPlanRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<CopingPlanRecord[]>(initialRecords);
	const [riskSituation, setRiskSituation] = useState("");
	const [copingStrategy, setCopingStrategy] = useState("");
	const [firstStep, setFirstStep] = useState("");
	const [confidence, setConfidence] = useState(5);
	const [supportResource, setSupportResource] = useState("");
	const [errors, setErrors] = useState({ riskSituation: false, copingStrategy: false, firstStep: false });

	const resetForm = () => { setRiskSituation(""); setCopingStrategy(""); setFirstStep(""); setConfidence(5); setSupportResource(""); setErrors({ riskSituation: false, copingStrategy: false, firstStep: false }); };
	const saveRecord = () => {
		const situation = riskSituation.trim(); const strategy = copingStrategy.trim(); const step = firstStep.trim();
		const nextErrors = { riskSituation: !situation, copingStrategy: !strategy, firstStep: !step };
		setErrors(nextErrors);
		if (nextErrors.riskSituation || nextErrors.copingStrategy || nextErrors.firstStep) return;
		setRecords((current) => [...current, { riskSituation: situation, copingStrategy: strategy, firstStep: step, confidence, supportResource: supportResource.trim() || undefined }]);
		resetForm();
	};

	return <InterventionScreenLayout title="Registro de Planes de Afrontamiento" description="Registra las estrategias que puedes aplicar ante situaciones de riesgo." actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/plan-afrontamiento/introduccion")}>Regresar</Button><Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>{records.length > 0 ? <Button variant="outlined" size="large" onClick={resetForm}>Agregar otro registro</Button> : null}<Button variant="contained" size="large" disabled={records.length === 0} onClick={() => navigate("/renace/prevencion-recaidas/plan-afrontamiento/resumen", { state: { records } })}>Finalizar</Button></Stack></Stack>}>
		<Stack spacing={2}>
			<TextField required multiline minRows={3} fullWidth label="Situación de riesgo" value={riskSituation} onChange={(event) => { setRiskSituation(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, riskSituation: false })); }} error={errors.riskSituation} helperText={errors.riskSituation ? "Este campo es obligatorio." : " "} />
			<TextField required multiline minRows={3} fullWidth label="Estrategia principal de afrontamiento" value={copingStrategy} onChange={(event) => { setCopingStrategy(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, copingStrategy: false })); }} error={errors.copingStrategy} helperText={errors.copingStrategy ? "Este campo es obligatorio." : " "} />
			<TextField required fullWidth label="Primer paso que realizarás" value={firstStep} onChange={(event) => { setFirstStep(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, firstStep: false })); }} error={errors.firstStep} helperText={errors.firstStep ? "Este campo es obligatorio." : " "} />
			<EmotionIntensitySlider label="Confianza para aplicar el plan" value={confidence} onChange={setConfidence} />
			<TextField fullWidth label="Persona o recurso de apoyo" value={supportResource} onChange={(event) => setSupportResource(event.target.value)} />
			<Button variant="contained" size="large" onClick={saveRecord}>Guardar registro</Button>
			<Alert severity={records.length ? "success" : "info"}>{records.length ? "Registro guardado. Puedes agregar otro registro o finalizar." : "Aún no hay planes de afrontamiento registrados."}</Alert>
			{records.length ? <TableContainer><Table size="small" aria-label="Planes de afrontamiento registrados"><TableHead><TableRow><TableCell>Situación de riesgo</TableCell><TableCell>Estrategia de afrontamiento</TableCell><TableCell>Primer paso</TableCell><TableCell align="right">Confianza</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.riskSituation}-${index}`}><TableCell>{record.riskSituation}</TableCell><TableCell>{record.copingStrategy}</TableCell><TableCell>{record.firstStep}</TableCell><TableCell align="right">{record.confidence}</TableCell></TableRow>)}</TableBody></Table></TableContainer> : null}
		</Stack>
	</InterventionScreenLayout>;
}

export default CopingPlanRegisterPage;
