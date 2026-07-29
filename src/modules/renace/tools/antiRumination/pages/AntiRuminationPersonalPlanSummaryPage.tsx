import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import RuminationSummaryCard from "../components/RuminationSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PersonalPlan = {
	selectedStrategy: string;
	firstAction: string;
	lifeArea: string;
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
		typeof maybePlan.selectedStrategy !== "string" ||
		typeof maybePlan.firstAction !== "string" ||
		typeof maybePlan.lifeArea !== "string" ||
		typeof maybePlan.confidenceLevel !== "number"
	) {
		return null;
	}

	return maybePlan;
}

function AntiRuminationPersonalPlanSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const plan = sanitizePlan(location.state);

	if (!plan) {
		return <Navigate to="/renace/antirrumiacion/aprendizajes/plan-personal" replace />;
	}

	return (
		<InterventionScreenLayout
			title="Resumen"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/antirrumiacion/aprendizajes/plan-personal", {
								state: { plan },
							})
						}
					>
						Volver al plan
					</Button>
					<Button variant="contained" size="large" onClick={() => navigate("/renace/antirrumiacion/aprendizajes/final")}>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<Card variant="outlined" sx={{ borderRadius: 3 }}>
				<CardContent>
					<Stack spacing={1.5}>
						<Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: "primary.main" }}>
							Mi Plan Personal Antirrumiación
						</Typography>
						<Typography variant="body2" sx={{ color: "text.primary" }}>
							Estrategia elegida: {plan.selectedStrategy}
						</Typography>
						<Typography variant="body2" sx={{ color: "text.primary" }}>
							Primera acción que realizaré: {plan.firstAction}
						</Typography>
					</Stack>
				</CardContent>
			</Card>

			<RuminationSummaryCard
				title="Mi Plan Personal Antirrumiación"
				metrics={[
					{
						id: "selected-life-area",
						label: "Área seleccionada",
						value: plan.lifeArea,
					},
					{
						id: "confidence-level",
						label: "Nivel de confianza",
						value: `${plan.confidenceLevel}/10`,
					},
				]}
			/>
		</InterventionScreenLayout>
	);
}

export default AntiRuminationPersonalPlanSummaryPage;
