import { Button, Stack } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { MindfulnessSummaryCard } from "../../../mindfulness/MindfulnessSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PersonalPlan = {
	practice: string;
	practiceMoment: string;
	firstAction: string;
	confidenceLevel: number;
};

type SummaryPageState = {
	plan?: PersonalPlan | null;
};

function sanitizePlan(state: unknown): PersonalPlan | null {
	if (!state || typeof state !== "object") return null;

	const plan = (state as SummaryPageState).plan;
	if (!plan || typeof plan !== "object") return null;

	if (
		typeof plan.practice !== "string" ||
		typeof plan.practiceMoment !== "string" ||
		typeof plan.firstAction !== "string" ||
		typeof plan.confidenceLevel !== "number"
	) {
		return null;
	}

	return plan;
}

function MindfulnessPersonalPlanSummaryPage() {
	const navigate = useNavigate();
	const plan = sanitizePlan(useLocation().state);

	if (!plan) return <Navigate to="/renace/mindfulness/plan-personal/registro" replace />;

	return (
		<InterventionScreenLayout
			title="Resumen"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button variant="outlined" size="large" onClick={() => navigate("/renace/mindfulness/plan-personal/registro", { state: { plan } })}>
						Volver al plan
					</Button>
					<Button variant="contained" size="large" onClick={() => navigate("/renace/mindfulness/plan-personal/final")}>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<MindfulnessSummaryCard
				title="Mi Plan Personal de Mindfulness"
				indicators={[
					{ label: "Práctica seleccionada", value: plan.practice },
					{ label: "Nivel de confianza", value: `${plan.confidenceLevel}/10` },
				]}
			/>
		</InterventionScreenLayout>
	);
}

export default MindfulnessPersonalPlanSummaryPage;
