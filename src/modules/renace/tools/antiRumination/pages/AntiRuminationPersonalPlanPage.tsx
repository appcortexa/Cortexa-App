import {
	Alert,
	Button,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PersonalPlan = {
	selectedStrategy: string;
	firstAction: string;
	lifeArea: string;
	confidenceLevel: number;
};

type PersonalPlanPageState = {
	plan?: PersonalPlan | null;
};

const lifeAreaOptions = [
	"Trabajo / Estudios",
	"Familia",
	"Pareja",
	"Amigos",
	"Salud",
	"Autocuidado",
	"Tiempo libre",
	"Otra",
] as const;

function sanitizePlan(state: unknown): PersonalPlan | null {
	if (!state || typeof state !== "object") {
		return null;
	}

	const maybePlan = (state as PersonalPlanPageState).plan;

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

function AntiRuminationPersonalPlanPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialPlan = useMemo(() => sanitizePlan(location.state), [location.state]);
	const [selectedStrategy, setSelectedStrategy] = useState(initialPlan?.selectedStrategy ?? "");
	const [firstAction, setFirstAction] = useState(initialPlan?.firstAction ?? "");
	const [lifeArea, setLifeArea] = useState(initialPlan?.lifeArea ?? "");
	const [confidenceLevel, setConfidenceLevel] = useState(initialPlan?.confidenceLevel ?? 5);
	const [selectedStrategyError, setSelectedStrategyError] = useState(false);
	const [firstActionError, setFirstActionError] = useState(false);
	const [lifeAreaError, setLifeAreaError] = useState(false);
	const [savedPlan, setSavedPlan] = useState<PersonalPlan | null>(initialPlan);

	const handleSavePlan = () => {
		const trimmedSelectedStrategy = selectedStrategy.trim();
		const trimmedFirstAction = firstAction.trim();
		const trimmedLifeArea = lifeArea.trim();
		const hasSelectedStrategy = trimmedSelectedStrategy.length > 0;
		const hasFirstAction = trimmedFirstAction.length > 0;
		const hasLifeArea = trimmedLifeArea.length > 0;

		setSelectedStrategyError(!hasSelectedStrategy);
		setFirstActionError(!hasFirstAction);
		setLifeAreaError(!hasLifeArea);

		if (!hasSelectedStrategy || !hasFirstAction || !hasLifeArea) {
			return;
		}

		setSavedPlan({
			selectedStrategy: trimmedSelectedStrategy,
			firstAction: trimmedFirstAction,
			lifeArea: trimmedLifeArea,
			confidenceLevel,
		});
	};

	const handleFinalize = () => {
		if (!savedPlan) {
			return;
		}

		navigate("/renace/antirrumiacion/aprendizajes/resumen", {
			state: { plan: savedPlan },
		});
	};

	return (
		<InterventionScreenLayout
			title="Plan Personal"
			description="Define un plan breve y personal para responder de forma diferente cuando reaparezca la rumiación."
			actions={
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/renace/antirrumiacion/aprendizajes/introduccion")}
				>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					label="¿Qué estrategia te resultó más útil para interrumpir la rumiación?"
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
					label="¿Qué será lo primero que harás cuando notes que estás comenzando a rumiar?"
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

				<TextField
					required
					select
					fullWidth
					label="¿Qué área importante de tu vida deseas seguir fortaleciendo?"
					value={lifeArea}
					onChange={(event) => {
						setLifeArea(event.target.value);
						if (lifeAreaError && event.target.value.trim().length > 0) {
							setLifeAreaError(false);
						}
					}}
					error={lifeAreaError}
					helperText={lifeAreaError ? "Este campo es obligatorio." : " "}
				>
					<MenuItem value="" disabled>
						Selecciona un área
					</MenuItem>
					{lifeAreaOptions.map((lifeAreaOption) => (
						<MenuItem key={lifeAreaOption} value={lifeAreaOption}>
							{lifeAreaOption}
						</MenuItem>
					))}
				</TextField>

				<EmotionIntensitySlider
					label="Confianza para aplicar el plan"
					value={confidenceLevel}
					onChange={setConfidenceLevel}
				/>

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

export default AntiRuminationPersonalPlanPage;
