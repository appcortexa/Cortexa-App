import { Button, Stack } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { PositiveSummaryCard } from "../../../positiveAttention/PositiveSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PersonalPlan = {
	selectedStrategy: string;
	situation: string;
	firstAction: string;
	confidenceLevel: number;
};

type SummaryPageState = {
	plan?: PersonalPlan | null;
};

function sanitizePlan(state: unknown): PersonalPlan | null {
	if (!state || typeof state !== "object") {
		return null;
	}

	const maybePlan = (state as SummaryPageState).plan;

	if (!maybePlan || typeof maybePlan !== "object") {
		return null;
	}

	if (
		typeof (maybePlan as PersonalPlan).selectedStrategy !== "string" ||
		typeof (maybePlan as PersonalPlan).situation !== "string" ||
		typeof (maybePlan as PersonalPlan).firstAction !== "string" ||
		typeof (maybePlan as PersonalPlan).confidenceLevel !== "number"
	) {
		return null;
	}

	return maybePlan as PersonalPlan;
}

function PositiveAttentionPersonalPlanSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const plan = sanitizePlan(location.state);

	if (!plan) {
		return <Navigate to="/renace/atencion-positiva/plan-personal/registro" replace />;
	}

	return (
		<InterventionScreenLayout
			title="Resumen"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button variant="outlined" size="large" onClick={() => navigate("/renace/atencion-positiva/plan-personal/registro", { state: { plan } })}>
						Volver al plan
					</Button>
					<Button variant="contained" size="large" onClick={() => navigate("/renace/atencion-positiva/plan-personal/final")}>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<PositiveSummaryCard
				title="Mi Plan Personal de Atención Positiva"
				indicators={[
					{ label: "Estrategia principal", value: plan.selectedStrategy },
					{ label: "Nivel de confianza", value: `${plan.confidenceLevel}/10` },
				]}
			/>
		</InterventionScreenLayout>
	);
}

export default PositiveAttentionPersonalPlanSummaryPage;
