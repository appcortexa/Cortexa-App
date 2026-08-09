import { Alert, Button, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { SelfCompassionRecord } from "../../../selfCompassion/SelfCompassionRecord";
import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type KindnessResponseRecord = Pick<
	SelfCompassionRecord,
	"situation" | "selfCriticalThought" | "compassionateResponse" | "intensity"
>;

type RegisterPageState = {
	records?: KindnessResponseRecord[];
};

function sanitizeRecords(state: unknown): KindnessResponseRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as RegisterPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.situation === "string" &&
			typeof record.selfCriticalThought === "string" &&
			typeof record.compassionateResponse === "string" &&
			typeof record.intensity === "number",
	);
}

function SelfCompassionKindnessRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<KindnessResponseRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [selfCriticalThought, setSelfCriticalThought] = useState("");
	const [compassionateResponse, setCompassionateResponse] = useState("");
	const [credibility, setCredibility] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [thoughtError, setThoughtError] = useState(false);
	const [responseError, setResponseError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(initialRecords.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setSelfCriticalThought("");
		setCompassionateResponse("");
		setCredibility(5);
		setSituationError(false);
		setThoughtError(false);
		setResponseError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const trimmedThought = selfCriticalThought.trim();
		const trimmedResponse = compassionateResponse.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasThought = trimmedThought.length > 0;
		const hasResponse = trimmedResponse.length > 0;

		setSituationError(!hasSituation);
		setThoughtError(!hasThought);
		setResponseError(!hasResponse);

		if (!hasSituation || !hasThought || !hasResponse) {
			return;
		}

		setRecords((currentRecords) => [
			...currentRecords,
			{
				situation: trimmedSituation,
				selfCriticalThought: trimmedThought,
				compassionateResponse: trimmedResponse,
				intensity: credibility,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinish = () => {
		navigate("/renace/autocompasion/responderse-con-amabilidad/resumen", { state: { records } });
	};

	return (
		<InterventionScreenLayout
			title="Registro de respuestas amables"
			description="Registra un pensamiento autocrítico y una respuesta amable dirigida hacia ti mismo."
			actions={
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/renace/autocompasion/responderse-con-amabilidad/introduccion")}
				>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					fullWidth
					label="Situación"
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
					label="Pensamiento autocrítico"
					value={selfCriticalThought}
					onChange={(event) => {
						setSelfCriticalThought(event.target.value);
						if (thoughtError && event.target.value.trim().length > 0) {
							setThoughtError(false);
						}
					}}
					error={thoughtError}
					helperText={thoughtError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="¿Cómo te responderías con amabilidad?"
					value={compassionateResponse}
					onChange={(event) => {
						setCompassionateResponse(event.target.value);
						if (responseError && event.target.value.trim().length > 0) {
							setResponseError(false);
						}
					}}
					error={responseError}
					helperText={responseError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider label="Credibilidad" value={credibility} onChange={setCredibility} />

				<ExerciseEntryActions
					onSave={handleSaveRecord}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinish}
					canSave
					showAddAnother={showPostSaveActions}
					showFinish={records.length > 0}
				/>

				{records.length > 0 ? (
					<Alert severity="success">Ejercicio guardado. Puedes agregar otro ejercicio o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay ejercicios guardados.</Alert>
				)}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionKindnessRegisterPage;
