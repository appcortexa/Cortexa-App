import { Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ProtectiveFactorSelector } from "../../../relapsePrevention/ProtectiveFactorSelector";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type ProtectiveFactorRecord = { riskSituation: string; protectiveFactor: string; helpDescription: string; confidence: number; otherResources?: string };
type RegisterPageState = { records?: ProtectiveFactorRecord[] };

const protectiveFactorLabels: Record<string, string> = { "support-network": "Red de apoyo", "professional-support": "Apoyo profesional", "healthy-routines": "Rutinas saludables", "self-care": "Autocuidado", "coping-skills": "Habilidades de afrontamiento", "meaningful-activities": "Actividades significativas" };

function sanitizeRecords(state: unknown): ProtectiveFactorRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as RegisterPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter((record): record is ProtectiveFactorRecord => typeof record.riskSituation === "string" && typeof record.protectiveFactor === "string" && typeof record.helpDescription === "string" && typeof record.confidence === "number" && (typeof record.otherResources === "undefined" || typeof record.otherResources === "string"));
}

function factorLabel(value: string) { return protectiveFactorLabels[value] ?? value; }

function ProtectiveFactorsRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<ProtectiveFactorRecord[]>(initialRecords);
	const [riskSituation, setRiskSituation] = useState("");
	const [protectiveFactor, setProtectiveFactor] = useState("");
	const [helpDescription, setHelpDescription] = useState("");
	const [confidence, setConfidence] = useState(5);
	const [otherResources, setOtherResources] = useState("");
	const [errors, setErrors] = useState({ riskSituation: false, protectiveFactor: false, helpDescription: false });

	const resetForm = () => { setRiskSituation(""); setProtectiveFactor(""); setHelpDescription(""); setConfidence(5); setOtherResources(""); setErrors({ riskSituation: false, protectiveFactor: false, helpDescription: false }); };
	const saveRecord = () => {
		const situation = riskSituation.trim(); const description = helpDescription.trim();
		const nextErrors = { riskSituation: !situation, protectiveFactor: !protectiveFactor, helpDescription: !description };
		setErrors(nextErrors);
		if (nextErrors.riskSituation || nextErrors.protectiveFactor || nextErrors.helpDescription) return;
		setRecords((current) => [...current, { riskSituation: situation, protectiveFactor, helpDescription: description, confidence, otherResources: otherResources.trim() || undefined }]);
		resetForm();
	};

	return <InterventionScreenLayout title="Registro de Factores Protectores" description="Registra los recursos que pueden ayudarte ante situaciones de riesgo." actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/factores-protectores/introduccion")}>Regresar</Button><Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>{records.length > 0 ? <Button variant="outlined" size="large" onClick={resetForm}>Agregar otro registro</Button> : null}<Button variant="contained" size="large" disabled={records.length === 0} onClick={() => navigate("/renace/prevencion-recaidas/factores-protectores/resumen", { state: { records } })}>Finalizar</Button></Stack></Stack>}>
		<Stack spacing={2}>
			<TextField required multiline minRows={3} fullWidth label="Situación de riesgo" value={riskSituation} onChange={(event) => { setRiskSituation(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, riskSituation: false })); }} error={errors.riskSituation} helperText={errors.riskSituation ? "Este campo es obligatorio." : " "} />
			<Stack spacing={0.5}><ProtectiveFactorSelector value={protectiveFactor} onChange={(value) => { setProtectiveFactor(value); setErrors((current) => ({ ...current, protectiveFactor: false })); }} label="Factor protector principal" name="protective-factor-main" />{errors.protectiveFactor ? <Alert severity="error">Este campo es obligatorio.</Alert> : null}</Stack>
			<TextField required multiline minRows={3} fullWidth label="¿Cómo puede ayudarte ese factor protector?" value={helpDescription} onChange={(event) => { setHelpDescription(event.target.value); if (event.target.value.trim()) setErrors((current) => ({ ...current, helpDescription: false })); }} error={errors.helpDescription} helperText={errors.helpDescription ? "Este campo es obligatorio." : " "} />
			<EmotionIntensitySlider label="Confianza en el factor protector" value={confidence} onChange={setConfidence} />
			<TextField multiline minRows={3} fullWidth label="Otros recursos disponibles" value={otherResources} onChange={(event) => setOtherResources(event.target.value)} />
			<Button variant="contained" size="large" onClick={saveRecord}>Guardar registro</Button>
			<Alert severity={records.length ? "success" : "info"}>{records.length ? "Registro guardado. Puedes agregar otro registro o finalizar." : "Aún no hay factores protectores registrados."}</Alert>
			{records.length ? <TableContainer><Table size="small" aria-label="Factores protectores registrados"><TableHead><TableRow><TableCell>Situación de riesgo</TableCell><TableCell>Factor protector</TableCell><TableCell align="right">Confianza</TableCell></TableRow></TableHead><TableBody>{records.map((record, index) => <TableRow key={`${record.riskSituation}-${index}`}><TableCell>{record.riskSituation}</TableCell><TableCell>{factorLabel(record.protectiveFactor)}</TableCell><TableCell align="right">{record.confidence}</TableCell></TableRow>)}</TableBody></Table></TableContainer> : null}
		</Stack>
	</InterventionScreenLayout>;
}

export default ProtectiveFactorsRegisterPage;
