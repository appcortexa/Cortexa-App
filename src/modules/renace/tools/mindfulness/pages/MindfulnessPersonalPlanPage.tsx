import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PersonalPlan = {
	practice: string;
	practiceMoment: string;
	firstAction: string;
	confidenceLevel: number;
};

type PersonalPlanPageState = {
	plan?: PersonalPlan | null;
};

const practiceOptions = [
	"Atención a la Respiración",
	"Observación sin Juicio",
	"Escaneo Corporal",
	"Aceptación del Momento Presente",
] as const;

function sanitizePlan(state: unknown): PersonalPlan | null {
	if (!state || typeof state !== "object") return null;

	const plan = (state as PersonalPlanPageState).plan;
	if (!plan || typeof plan !== "object") return null;

	if (
		typeof plan.practice !== "string" ||
		typeof plan.practiceMoment !== "string" ||
		typeof plan.firstAction !== "string" ||
		typeof plan.confidenceLevel !== "number" ||
		plan.confidenceLevel < 0 ||
		plan.confidenceLevel > 10
	) {
		return null;
	}

	return plan;
}

function MindfulnessPersonalPlanPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialPlan = useMemo(() => sanitizePlan(location.state), [location.state]);
	const [practice, setPractice] = useState(initialPlan?.practice ?? "");
	const [practiceMoment, setPracticeMoment] = useState(initialPlan?.practiceMoment ?? "");
	const [firstAction, setFirstAction] = useState(initialPlan?.firstAction ?? "");
	const [confidenceLevel, setConfidenceLevel] = useState(initialPlan?.confidenceLevel ?? 5);
	const [practiceError, setPracticeError] = useState(false);
	const [practiceMomentError, setPracticeMomentError] = useState(false);
	const [firstActionError, setFirstActionError] = useState(false);
	const [savedPlan, setSavedPlan] = useState<PersonalPlan | null>(initialPlan);

	const handleSavePlan = () => {
		const trimmedPractice = practice.trim();
		const trimmedPracticeMoment = practiceMoment.trim();
		const trimmedFirstAction = firstAction.trim();
		const hasPractice = trimmedPractice.length > 0;
		const hasPracticeMoment = trimmedPracticeMoment.length > 0;
		const hasFirstAction = trimmedFirstAction.length > 0;

		setPracticeError(!hasPractice);
		setPracticeMomentError(!hasPracticeMoment);
		setFirstActionError(!hasFirstAction);

		if (!hasPractice || !hasPracticeMoment || !hasFirstAction) return;

		setSavedPlan({
			practice: trimmedPractice,
			practiceMoment: trimmedPracticeMoment,
			firstAction: trimmedFirstAction,
			confidenceLevel,
		});
	};

	return (
		<InterventionScreenLayout
			title="Plan Personal de Mindfulness"
			description="Elabora un plan breve y concreto para integrar mindfulness en tu rutina diaria."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button variant="outlined" size="large" onClick={() => navigate("/renace/mindfulness/plan-personal/introduccion")}>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						<Button variant="contained" size="large" onClick={handleSavePlan}>
							Guardar plan
						</Button>
						<Button
							variant="contained"
							size="large"
							disabled={!savedPlan}
							onClick={() => navigate("/renace/mindfulness/plan-personal/resumen", { state: { plan: savedPlan } })}
						>
							Finalizar
						</Button>
					</Stack>
				</Stack>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					select
					fullWidth
					label="Práctica de mindfulness que me resultó más útil"
					value={practice}
					onChange={(event) => {
						setPractice(event.target.value);
						setPracticeError(false);
					}}
					error={practiceError}
					helperText={practiceError ? "Este campo es obligatorio." : " "}
				>
					<MenuItem value="" disabled>Selecciona una práctica</MenuItem>
					{practiceOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
				</TextField>
				<TextField
					required
					fullWidth
					label="¿En qué momento del día pienso practicarla con mayor frecuencia?"
					value={practiceMoment}
					onChange={(event) => {
						setPracticeMoment(event.target.value);
						setPracticeMomentError(false);
					}}
					error={practiceMomentError}
					helperText={practiceMomentError ? "Este campo es obligatorio." : " "}
				/>
				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="Primera acción concreta que realizaré para recordar practicar mindfulness"
					value={firstAction}
					onChange={(event) => {
						setFirstAction(event.target.value);
						setFirstActionError(false);
					}}
					error={firstActionError}
					helperText={firstActionError ? "Este campo es obligatorio." : " "}
				/>
				<EmotionIntensitySlider label="Confianza para aplicar el plan" value={confidenceLevel} onChange={setConfidenceLevel} />
				{savedPlan ? <Alert severity="success">Plan guardado. Puedes finalizar cuando lo desees.</Alert> : <Alert severity="info">Completa los campos obligatorios para guardar tu plan.</Alert>}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default MindfulnessPersonalPlanPage;
