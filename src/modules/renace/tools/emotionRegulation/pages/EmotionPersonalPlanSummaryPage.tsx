import { Button, Stack } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import EmotionSummaryCard from "../components/EmotionSummaryCard";

type PersonalPlan = {
	emotion: string;
	strategy: string;
	firstAction: string;
	confidence: number;
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
		typeof maybePlan.emotion !== "string" ||
		typeof maybePlan.strategy !== "string" ||
		typeof maybePlan.firstAction !== "string" ||
		typeof maybePlan.confidence !== "number"
	) {
		return null;
	}

	return maybePlan;
}

function EmotionPersonalPlanSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const plan = sanitizePlan(location.state);

	if (!plan) {
		return <Navigate to="/renace/regulacion-emocional/plan-personal-regulacion/registro" replace />;
	}

	return (
		<InterventionScreenLayout
			title="Resumen de Plan Personal"
			description="Revisa tu plan personal de regulación para recordarlo cuando aparezca una emoción intensa."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/plan-personal-regulacion/registro", { state: { plan } })}
					>
						Volver al plan
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/regulacion-emocional/plan-personal-regulacion/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<EmotionSummaryCard
				title="Mi Plan Personal de Regulación"
				indicators={[
					{
						id: "main-emotion",
						label: "Emoción principal",
						value: plan.emotion,
					},
					{
						id: "confidence",
						label: "Nivel de confianza",
						value: `${plan.confidence}/10`,
					},
				]}
			/>
		</InterventionScreenLayout>
	);
}

export default EmotionPersonalPlanSummaryPage;
