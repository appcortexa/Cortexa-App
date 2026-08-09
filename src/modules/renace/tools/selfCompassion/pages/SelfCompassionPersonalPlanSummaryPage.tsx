import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { CompassionPhraseCard } from "../../../selfCompassion/CompassionPhraseCard";
import { SelfCompassionSummaryCard } from "../../../selfCompassion/SelfCompassionSummaryCard";
import type { SelfCompassionPersonalPlan } from "./SelfCompassionPersonalPlanRegisterPage";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type SummaryPageState = { plan?: SelfCompassionPersonalPlan | null };

function sanitizePlan(state: unknown): SelfCompassionPersonalPlan | null {
	const plan = state && typeof state === "object" ? (state as SummaryPageState).plan : null;
	return plan && typeof plan.mainStrategy === "string" && typeof plan.reminderSituations === "string" && typeof plan.firstAction === "string" && typeof plan.confidenceLevel === "number" ? plan : null;
}

function SelfCompassionPersonalPlanSummaryPage() {
	const navigate = useNavigate();
	const plan = sanitizePlan(useLocation().state);

	if (!plan) return <Navigate to="/renace/autocompasion/plan-personal/registro" replace />;

	return (
		<InterventionScreenLayout title="Resumen" actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/autocompasion/plan-personal/registro", { state: { plan } })}>Volver al plan</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/autocompasion/plan-personal/final")}>Finalizar</Button></Stack>}>
			<CompassionPhraseCard title="Mi Plan Personal de Autocompasión" phrase={plan.mainStrategy} />
			<Card variant="outlined" sx={{ borderRadius: 2 }}><CardContent><Stack spacing={1.5}><Typography variant="body2" color="text.secondary">Situaciones donde deseo aplicarla</Typography><Typography variant="body1">{plan.reminderSituations}</Typography><Typography variant="body2" color="text.secondary">Primera acción</Typography><Typography variant="body1">{plan.firstAction}</Typography></Stack></CardContent></Card>
			<SelfCompassionSummaryCard indicators={[{ label: "Nivel de confianza", value: `${plan.confidenceLevel}/10` }, { label: "Plan completado", value: "Sí" }]} />
		</InterventionScreenLayout>
	);
}

export default SelfCompassionPersonalPlanSummaryPage;
