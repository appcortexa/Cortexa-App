import { Alert, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import EmotionSelector from "../../emotionRegulation/components/EmotionSelector";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import type { PositiveAttentionRecord } from "../../../positiveAttention/PositiveAttentionRecord";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PositiveAttentionDetectionExperience = Pick<
	PositiveAttentionRecord,
	"situation" | "description" | "emotion" | "intensity"
>;

type RegisterPageState = {
	experiences?: PositiveAttentionDetectionExperience[];
};

const emotionOptions = [
	"Alegría",
	"Tranquilidad",
	"Satisfacción",
	"Esperanza",
	"Amor",
	"Orgullo",
	"Calma",
];

function sanitizeExperiences(state: unknown): PositiveAttentionDetectionExperience[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeExperiences = (state as RegisterPageState).experiences;

	if (!Array.isArray(maybeExperiences)) {
		return [];
	}

	return maybeExperiences.filter(
		(experience) =>
			typeof experience.situation === "string" &&
			typeof experience.description === "string" &&
			typeof experience.emotion === "string" &&
			typeof experience.intensity === "number",
	);
}

function PositiveAttentionDetectionRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialExperiences = useMemo(() => sanitizeExperiences(location.state), [location.state]);
	const [experiences, setExperiences] = useState<PositiveAttentionDetectionExperience[]>(initialExperiences);
	const [situation, setSituation] = useState("");
	const [description, setDescription] = useState("");
	const [emotion, setEmotion] = useState("");
	const [intensity, setIntensity] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [descriptionError, setDescriptionError] = useState(false);
	const [emotionError, setEmotionError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(experiences.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setDescription("");
		setEmotion("");
		setIntensity(5);
		setSituationError(false);
		setDescriptionError(false);
		setEmotionError(false);
	};

	const handleSaveExperience = () => {
		const trimmedSituation = situation.trim();
		const trimmedDescription = description.trim();
		const trimmedEmotion = emotion.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasDescription = trimmedDescription.length > 0;
		const hasEmotion = trimmedEmotion.length > 0;

		setSituationError(!hasSituation);
		setDescriptionError(!hasDescription);
		setEmotionError(!hasEmotion);

		if (!hasSituation || !hasDescription || !hasEmotion) {
			return;
		}

		setExperiences((currentExperiences) => [
			...currentExperiences,
			{
				situation: trimmedSituation,
				description: trimmedDescription,
				emotion: trimmedEmotion,
				intensity,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinish = () => {
		navigate("/renace/atencion-positiva/deteccion-experiencias/resumen", {
			state: { experiences },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro de experiencias positivas"
			description="Registra cada experiencia positiva identificando situación, descripción, emoción predominante e intensidad positiva (0 a 10)."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/atencion-positiva/deteccion-experiencias/introduccion")}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro ejercicio
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={experiences.length === 0} onClick={handleFinish}>
							Finalizar
						</Button>
					</Stack>
				</Stack>
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
					label="¿Qué ocurrió?"
					value={description}
					onChange={(event) => {
						setDescription(event.target.value);
						if (descriptionError && event.target.value.trim().length > 0) {
							setDescriptionError(false);
						}
					}}
					error={descriptionError}
					helperText={descriptionError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionSelector
					label="¿Qué emoción predominó?"
					options={emotionOptions}
					value={emotion}
					onChange={setEmotion}
					error={emotionError}
					helperText={emotionError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider
					label="Intensidad positiva"
					value={intensity}
					onChange={setIntensity}
				/>

				<ExerciseEntryActions
					onSave={handleSaveExperience}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinish}
					canSave={true}
					showAddAnother={showPostSaveActions}
					showFinish={experiences.length > 0}
				/>

				{experiences.length > 0 ? (
					<Alert severity="success">Experiencia guardada. Puedes agregar otra o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay experiencias registradas.</Alert>
				)}

				{experiences.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Experiencias positivas registradas">
							<TableHead>
								<TableRow>
									<TableCell>Situación</TableCell>
									<TableCell>Experiencia positiva</TableCell>
									<TableCell>Emoción</TableCell>
									<TableCell align="right">Intensidad</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{experiences.map((experience, index) => (
									<TableRow key={`${experience.situation}-${index}`}>
										<TableCell>{experience.situation}</TableCell>
										<TableCell>{experience.description}</TableCell>
										<TableCell>{experience.emotion}</TableCell>
										<TableCell align="right">{experience.intensity}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : null}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default PositiveAttentionDetectionRegisterPage;
