import { Button, Stack } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { RelapseSummaryCard } from "../../../relapsePrevention/RelapseSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type RelapsePersonalPlan = { riskSignal: string; protectiveFactor: string; copingStrategy: string; supportResource: string; confidence: number };
type SummaryPageState = { plan?: RelapsePersonalPlan | null };
const protectiveFactorLabels: Record<string, string> = { "support-network": "Red de apoyo", "professional-support": "Apoyo profesional", "healthy-routines": "Rutinas saludables", "self-care": "Autocuidado", "coping-skills": "Habilidades de afrontamiento", "meaningful-activities": "Actividades significativas" };

function sanitizePlan(state: unknown): RelapsePersonalPlan | null {
	if (!state || typeof state !== "object") return null;
	const plan = (state as SummaryPageState).plan;
	if (!plan || typeof plan.riskSignal !== "string" || typeof plan.protectiveFactor !== "string" || typeof plan.copingStrategy !== "string" || typeof plan.supportResource !== "string" || typeof plan.confidence !== "number") return null;
	return plan;
}

function RelapsePersonalPlanSummaryPage() {
	const navigate = useNavigate();
	const plan = sanitizePlan(useLocation().state);
	if (!plan) return <Navigate to="/renace/prevencion-recaidas/plan-personal-prevencion-recaidas/plan" replace />;

	return <InterventionScreenLayout title="Resumen" actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/prevencion-recaidas/plan-personal-prevencion-recaidas/plan", { state: { plan } })}>Volver al plan</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/prevencion-recaidas/plan-personal-prevencion-recaidas/final")}>Finalizar</Button></Stack>}>
		<RelapseSummaryCard title="Mi Plan Personal de Prevención de Recaídas" indicators={[{ label: "Señal principal de riesgo", value: plan.riskSignal }, { label: "Factor protector seleccionado", value: protectiveFactorLabels[plan.protectiveFactor] ?? plan.protectiveFactor }, { label: "Nivel de confianza", value: `${plan.confidence}/10` }]} />
	</InterventionScreenLayout>;
}

export default RelapsePersonalPlanSummaryPage;
