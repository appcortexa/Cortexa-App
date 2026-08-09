import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PersonalPlan = {
	selectedStrategy: string;
	situation: string;
	firstAction: string;
	confidenceLevel: number;
};

type PersonalPlanPageState = {
	plan?: PersonalPlan | null;
};

function sanitizePlan(state: unknown): PersonalPlan | null {
	if (!state || typeof state !== "object") {
		return null;
	}

	const maybePlan = (state as PersonalPlanPageState).plan;

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

function PositiveAttentionPersonalPlanPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialPlan = useMemo(() => sanitizePlan(location.state), [location.state]);
	const [selectedStrategy, setSelectedStrategy] = useState(initialPlan?.selectedStrategy ?? "");
	const [situation, setSituation] = useState(initialPlan?.situation ?? "");
	const [firstAction, setFirstAction] = useState(initialPlan?.firstAction ?? "");
	const [confidenceLevel, setConfidenceLevel] = useState(initialPlan?.confidenceLevel ?? 5);
	const [selectedStrategyError, setSelectedStrategyError] = useState(false);
	const [situationError, setSituationError] = useState(false);
	const [firstActionError, setFirstActionError] = useState(false);
	const [savedPlan, setSavedPlan] = useState<PersonalPlan | null>(initialPlan);

	const handleSavePlan = () => {
		const trimmedSelectedStrategy = selectedStrategy.trim();
		const trimmedSituation = situation.trim();
		const trimmedFirstAction = firstAction.trim();
		const hasSelectedStrategy = trimmedSelectedStrategy.length > 0;
		const hasSituation = trimmedSituation.length > 0;
		const hasFirstAction = trimmedFirstAction.length > 0;

		setSelectedStrategyError(!hasSelectedStrategy);
		setSituationError(!hasSituation);
		setFirstActionError(!hasFirstAction);

		if (!hasSelectedStrategy || !hasSituation || !hasFirstAction) {
			return;
		}

		setSavedPlan({
			selectedStrategy: trimmedSelectedStrategy,
			situation: trimmedSituation,
			firstAction: trimmedFirstAction,
			confidenceLevel,
		});
	};

	const handleFinalize = () => {
		if (!savedPlan) {
			return;
		}

		navigate("/renace/atencion-positiva/plan-personal/resumen", {
			state: { plan: savedPlan },
		});
	};

	return (
		<InterventionScreenLayout
			title="Plan Personal"
			description="Elabora un plan breve para recordar cómo dirigir tu atención hacia experiencias, recursos y momentos valiosos en tu vida cotidiana."
			actions={
				<Button variant="outlined" size="large" onClick={() => navigate("/renace/atencion-positiva/plan-personal/introduccion")}>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					fullWidth
					label="¿Qué estrategia te resultó más útil durante esta herramienta?"
					value={selectedStrategy}
					onChange={(event) => {
						setSelectedStrategy(event.target.value);
						if (selectedStrategyError && event.target.value.trim().length > 0) {
							setSelectedStrategyError(false);
						}
					}}
					error={selectedStrategyError}
					helperText={selectedStrategyError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿En qué situación cotidiana te gustaría aplicarla con mayor frecuencia?"
					value={situation}
					onChange={(event) => {
						setSituation(event.target.value);
						if (situationError && event.target.value.trim().length > 0) {
							setSituationError(false);
						}
					}}
					error={situationError}
					helperText={situationError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Cuál será la primera acción concreta que realizarás?"
					value={firstAction}
					onChange={(event) => {
						setFirstAction(event.target.value);
						if (firstActionError && event.target.value.trim().length > 0) {
							setFirstActionError(false);
						}
					}}
					error={firstActionError}
					helperText={firstActionError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider label="Confianza para aplicar el plan" value={confidenceLevel} onChange={setConfidenceLevel} />

				<ExerciseEntryActions
					onSave={handleSavePlan}
					onAddAnother={() => undefined}
					onFinish={handleFinalize}
					canSave
					showAddAnother={false}
					showFinish={savedPlan !== null}
				/>

				{savedPlan ? (
					<Alert severity="success">Plan guardado. Puedes finalizar cuando lo desees.</Alert>
				) : (
					<Alert severity="info">Guarda tu plan para habilitar la finalización.</Alert>
				)}

				{savedPlan ? (
					<Stack spacing={0.5} sx={{ px: 1 }}>
						<Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
							Vista previa del plan guardado
						</Typography>
						<Typography variant="body2" sx={{ color: "text.primary" }}>
							Estrategia: {savedPlan.selectedStrategy}
						</Typography>
						<Typography variant="body2" sx={{ color: "text.primary" }}>
							Primera acción: {savedPlan.firstAction}
						</Typography>
					</Stack>
				) : null}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default PositiveAttentionPersonalPlanPage;
