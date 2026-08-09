import { Alert, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import EmotionSelector from "../components/EmotionSelector";

type PersonalPlan = {
	emotion: string;
	strategy: string;
	firstAction: string;
	confidence: number;
};

type PersonalPlanPageState = {
	plan?: PersonalPlan | null;
};

const emotionOptions = ["Tristeza", "Ansiedad", "Enojo", "Culpa", "Verguenza", "Frustración", "Miedo"];

function sanitizePlan(state: unknown): PersonalPlan | null {
	if (!state || typeof state !== "object") {
		return null;
	}

	const maybePlan = (state as PersonalPlanPageState).plan;

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

function EmotionPersonalPlanPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { session } = useRenaceSession();

	const initialPlan = useMemo(() => sanitizePlan(location.state), [location.state]);
	const [emotion, setEmotion] = useState(initialPlan?.emotion ?? "");
	const [strategy, setStrategy] = useState(initialPlan?.strategy ?? "");
	const [firstAction, setFirstAction] = useState(initialPlan?.firstAction ?? "");
	const [confidence, setConfidence] = useState(initialPlan?.confidence ?? 5);
	const [emotionError, setEmotionError] = useState(false);
	const [strategyError, setStrategyError] = useState(false);
	const [firstActionError, setFirstActionError] = useState(false);
	const [savedPlan, setSavedPlan] = useState<PersonalPlan | null>(initialPlan);

	const handleSavePlan = () => {
		const trimmedEmotion = emotion.trim();
		const trimmedStrategy = strategy.trim();
		const trimmedFirstAction = firstAction.trim();
		const hasEmotion = trimmedEmotion.length > 0;
		const hasStrategy = trimmedStrategy.length > 0;
		const hasFirstAction = trimmedFirstAction.length > 0;

		setEmotionError(!hasEmotion);
		setStrategyError(!hasStrategy);
		setFirstActionError(!hasFirstAction);

		if (!hasEmotion || !hasStrategy || !hasFirstAction) {
			return;
		}

		setSavedPlan({
			emotion: trimmedEmotion,
			strategy: trimmedStrategy,
			firstAction: trimmedFirstAction,
			confidence,
		});
	};

	const handleFinalize = () => {
		if (!savedPlan) {
			return;
		}

		navigate("/renace/regulacion-emocional/plan-personal-regulacion/resumen", {
			state: { plan: savedPlan },
		});
	};

	return (
		<InterventionScreenLayout
			title="Plan Personal de Regulación"
			description="Registra un único plan personal para recordar qué harás cuando aparezca una emoción intensa."
			actions={
				<ExerciseEntryActions
					onSave={handleSavePlan}
					onAddAnother={() => undefined}
					onFinish={handleFinalize}
					canSave
					showAddAnother={false}
					showFinish={savedPlan !== null}
				/>
			}
		>
			<Stack spacing={2.5}>
				<EmotionSelector
					label="¿Qué emoción suele resultarte más difícil de regular?"
					options={emotionOptions}
					value={emotion}
					onChange={(nextValue) => {
						setEmotion(nextValue);
						if (emotionError && nextValue.trim().length > 0) {
							setEmotionError(false);
						}
					}}
					error={emotionError}
					helperText={emotionError ? "Selecciona una emoción." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué estrategia te funcionó mejor durante esta sesión?"
					value={strategy}
					multiline
					minRows={2}
					onChange={(event) => {
						setStrategy(event.target.value);
						if (strategyError && event.target.value.trim().length > 0) {
							setStrategyError(false);
						}
					}}
					error={strategyError}
					helperText={strategyError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué será lo primero que harás la próxima vez que aparezca esa emoción?"
					value={firstAction}
					multiline
					minRows={2}
					onChange={(event) => {
						setFirstAction(event.target.value);
						if (firstActionError && event.target.value.trim().length > 0) {
							setFirstActionError(false);
						}
					}}
					error={firstActionError}
					helperText={firstActionError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider
					label="Confianza para aplicar el plan"
					value={confidence}
					onChange={setConfidence}
				/>

				{savedPlan ? (
					<Alert severity="success">Plan guardado. Puedes finalizar cuando lo desees.</Alert>
				) : (
					<Alert severity="info">Completa los campos obligatorios para guardar tu plan.</Alert>
				)}

				{session ? (
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Expediente: {session.expediente}
					</Typography>
				) : null}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default EmotionPersonalPlanPage;
