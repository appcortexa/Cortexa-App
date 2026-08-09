import { Alert, Button, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

export type SelfCompassionPersonalPlan = {
	mainStrategy: string;
	reminderSituations: string;
	firstAction: string;
	confidenceLevel: number;
};

type PersonalPlanPageState = {
	plan?: SelfCompassionPersonalPlan | null;
};

function sanitizePlan(state: unknown): SelfCompassionPersonalPlan | null {
	if (!state || typeof state !== "object") {
		return null;
	}

	const plan = (state as PersonalPlanPageState).plan;
	if (
		!plan ||
		typeof plan.mainStrategy !== "string" ||
		typeof plan.reminderSituations !== "string" ||
		typeof plan.firstAction !== "string" ||
		typeof plan.confidenceLevel !== "number"
	) {
		return null;
	}

	return plan;
}

function SelfCompassionPersonalPlanRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialPlan = useMemo(() => sanitizePlan(location.state), [location.state]);
	const [mainStrategy, setMainStrategy] = useState(initialPlan?.mainStrategy ?? "");
	const [reminderSituations, setReminderSituations] = useState(initialPlan?.reminderSituations ?? "");
	const [firstAction, setFirstAction] = useState(initialPlan?.firstAction ?? "");
	const [confidenceLevel, setConfidenceLevel] = useState(initialPlan?.confidenceLevel ?? 5);
	const [showErrors, setShowErrors] = useState(false);
	const [savedPlan, setSavedPlan] = useState<SelfCompassionPersonalPlan | null>(initialPlan);

	const handleSave = () => {
		const plan = {
			mainStrategy: mainStrategy.trim(),
			reminderSituations: reminderSituations.trim(),
			firstAction: firstAction.trim(),
			confidenceLevel,
		};

		if (!plan.mainStrategy || !plan.reminderSituations || !plan.firstAction) {
			setShowErrors(true);
			return;
		}

		setSavedPlan(plan);
		setShowErrors(false);
	};

	return (
		<InterventionScreenLayout
			title="Plan Personal de Autocompasión"
			description="Elabora un plan breve para recurrir a la autocompasión cuando detectes autocrítica o atravieses una situación difícil."
			actions={
				<Button variant="outlined" size="large" onClick={() => navigate("/renace/autocompasion/plan-personal/introduccion")}>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2.5}>
				<TextField required fullWidth label="¿Cuál fue la estrategia de autocompasión que más te ayudó?" value={mainStrategy} onChange={(event) => setMainStrategy(event.target.value)} error={showErrors && !mainStrategy.trim()} helperText={showErrors && !mainStrategy.trim() ? "Este campo es obligatorio." : " "} />
				<TextField required fullWidth label="¿En qué situaciones te gustaría recordarla?" value={reminderSituations} onChange={(event) => setReminderSituations(event.target.value)} error={showErrors && !reminderSituations.trim()} helperText={showErrors && !reminderSituations.trim() ? "Este campo es obligatorio." : " "} />
				<TextField required fullWidth label="¿Qué será lo primero que harás cuando detectes autocrítica?" value={firstAction} onChange={(event) => setFirstAction(event.target.value)} error={showErrors && !firstAction.trim()} helperText={showErrors && !firstAction.trim() ? "Este campo es obligatorio." : " "} />
				<EmotionIntensitySlider label="Confianza" value={confidenceLevel} onChange={setConfidenceLevel} />
				<ExerciseEntryActions onSave={handleSave} onAddAnother={() => undefined} onFinish={() => savedPlan && navigate("/renace/autocompasion/plan-personal/resumen", { state: { plan: savedPlan } })} canSave showAddAnother={false} showFinish={savedPlan !== null} />
				<Alert severity={savedPlan ? "success" : "info"}>{savedPlan ? "Plan guardado. Puedes finalizar cuando lo desees." : "Guarda tu plan para habilitar la finalización."}</Alert>
			</Stack>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionPersonalPlanRegisterPage;
