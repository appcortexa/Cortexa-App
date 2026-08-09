import { Alert, Button, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ProtectiveFactorSelector } from "../../../relapsePrevention/ProtectiveFactorSelector";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

export type RelapsePersonalPlan = { riskSignal: string; protectiveFactor: string; copingStrategy: string; supportResource: string; confidence: number };
type PersonalPlanPageState = { plan?: RelapsePersonalPlan | null };

function sanitizePlan(state: unknown): RelapsePersonalPlan | null {
	if (!state || typeof state !== "object") return null;
	const plan = (state as PersonalPlanPageState).plan;
	if (!plan || typeof plan.riskSignal !== "string" || typeof plan.protectiveFactor !== "string" || typeof plan.copingStrategy !== "string" || typeof plan.supportResource !== "string" || typeof plan.confidence !== "number") return null;
	return plan;
}

function RelapsePersonalPlanPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialPlan = useMemo(() => sanitizePlan(location.state), [location.state]);
	const [riskSignal, setRiskSignal] = useState(initialPlan?.riskSignal ?? "");
	const [protectiveFactor, setProtectiveFactor] = useState(initialPlan?.protectiveFactor ?? "");
	const [copingStrategy, setCopingStrategy] = useState(initialPlan?.copingStrategy ?? "");
	const [supportResource, setSupportResource] = useState(initialPlan?.supportResource ?? "");
	const [confidence, setConfidence] = useState(initialPlan?.confidence ?? 5);
	const [showErrors, setShowErrors] = useState(false);
	const [savedPlan, setSavedPlan] = useState<RelapsePersonalPlan | null>(initialPlan);

	const handleSave = () => {
		const plan = { riskSignal: riskSignal.trim(), protectiveFactor, copingStrategy: copingStrategy.trim(), supportResource: supportResource.trim(), confidence };
		if (!plan.riskSignal || !plan.protectiveFactor || !plan.copingStrategy || !plan.supportResource) { setShowErrors(true); return; }
		setSavedPlan(plan);
		setShowErrors(false);
	};

	return <InterventionScreenLayout title="Plan Personal de Prevención de Recaídas" description="Elabora un plan breve para recordar y aplicar ante situaciones de riesgo." actions={<Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/plan-personal-prevencion-recaidas/introduccion")}>Regresar</Button>}>
		<Stack spacing={2.5}>
			<TextField required multiline minRows={3} fullWidth label="Principal señal de riesgo que debo reconocer" value={riskSignal} onChange={(event) => setRiskSignal(event.target.value)} error={showErrors && !riskSignal.trim()} helperText={showErrors && !riskSignal.trim() ? "Este campo es obligatorio." : " "} />
			<Stack spacing={0.5}><ProtectiveFactorSelector value={protectiveFactor} onChange={setProtectiveFactor} label="Principal factor protector que deseo fortalecer" name="personal-plan-protective-factor" />{showErrors && !protectiveFactor ? <Alert severity="error">Este campo es obligatorio.</Alert> : null}</Stack>
			<TextField required multiline minRows={3} fullWidth label="Estrategia de afrontamiento que aplicaré primero" value={copingStrategy} onChange={(event) => setCopingStrategy(event.target.value)} error={showErrors && !copingStrategy.trim()} helperText={showErrors && !copingStrategy.trim() ? "Este campo es obligatorio." : " "} />
			<TextField required fullWidth label="Persona o recurso al que acudiré si necesito apoyo" value={supportResource} onChange={(event) => setSupportResource(event.target.value)} error={showErrors && !supportResource.trim()} helperText={showErrors && !supportResource.trim() ? "Este campo es obligatorio." : " "} />
			<EmotionIntensitySlider label="Confianza para seguir mi plan" value={confidence} onChange={setConfidence} />
			<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end" }}><Button variant="contained" size="large" onClick={handleSave}>Guardar plan</Button><Button variant="contained" size="large" disabled={!savedPlan} onClick={() => savedPlan && navigate("/renace/prevencion-recaidas/plan-personal-prevencion-recaidas/resumen", { state: { plan: savedPlan } })}>Finalizar</Button></Stack>
			<Alert severity={savedPlan ? "success" : "info"}>{savedPlan ? "Plan guardado. Puedes finalizar cuando lo desees." : "Guarda tu plan para habilitar la finalización."}</Alert>
		</Stack>
	</InterventionScreenLayout>;
}

export default RelapsePersonalPlanPage;
