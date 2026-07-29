import {
	Alert,
	Button,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type AttentionShiftExercise = {
	initialAttention: string;
	newAttention: string;
	activityPerformed: string;
	attentionEase: number;
};

type RegisterPageState = {
	exercises?: AttentionShiftExercise[];
};

function sanitizeExercises(state: unknown): AttentionShiftExercise[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeExercises = (state as RegisterPageState).exercises;

	if (!Array.isArray(maybeExercises)) {
		return [];
	}

	return maybeExercises.filter(
		(exercise) =>
			typeof exercise.initialAttention === "string" &&
			typeof exercise.newAttention === "string" &&
			typeof exercise.activityPerformed === "string" &&
			typeof exercise.attentionEase === "number",
	);
}

function AntiRuminationAttentionShiftRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialExercises = useMemo(() => sanitizeExercises(location.state), [location.state]);
	const [exercises, setExercises] = useState<AttentionShiftExercise[]>(initialExercises);
	const [initialAttention, setInitialAttention] = useState("");
	const [newAttention, setNewAttention] = useState("");
	const [activityPerformed, setActivityPerformed] = useState("");
	const [attentionEase, setAttentionEase] = useState(5);
	const [initialAttentionError, setInitialAttentionError] = useState(false);
	const [newAttentionError, setNewAttentionError] = useState(false);
	const [activityPerformedError, setActivityPerformedError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(exercises.length > 0);

	const resetCurrentForm = () => {
		setInitialAttention("");
		setNewAttention("");
		setActivityPerformed("");
		setAttentionEase(5);
		setInitialAttentionError(false);
		setNewAttentionError(false);
		setActivityPerformedError(false);
	};

	const handleSaveExercise = () => {
		const trimmedInitialAttention = initialAttention.trim();
		const trimmedNewAttention = newAttention.trim();
		const trimmedActivityPerformed = activityPerformed.trim();
		const hasInitialAttention = trimmedInitialAttention.length > 0;
		const hasNewAttention = trimmedNewAttention.length > 0;
		const hasActivityPerformed = trimmedActivityPerformed.length > 0;

		setInitialAttentionError(!hasInitialAttention);
		setNewAttentionError(!hasNewAttention);
		setActivityPerformedError(!hasActivityPerformed);

		if (!hasInitialAttention || !hasNewAttention || !hasActivityPerformed) {
			return;
		}

		setExercises((currentExercises) => [
			...currentExercises,
			{
				initialAttention: trimmedInitialAttention,
				newAttention: trimmedNewAttention,
				activityPerformed: trimmedActivityPerformed,
				attentionEase,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/antirrumiacion/cambio-atencion/resumen", {
			state: { exercises },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro"
			description="Registra los ejercicios en los que redirigiste voluntariamente tu atención."
			actions={
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/renace/antirrumiacion/cambio-atencion/introduccion")}
				>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					label="¿Hacia dónde estaba dirigida tu atención cuando apareció la rumiación?"
					value={initialAttention}
					onChange={(event) => {
						setInitialAttention(event.target.value);
						if (initialAttentionError && event.target.value.trim().length > 0) {
							setInitialAttentionError(false);
						}
					}}
					error={initialAttentionError}
					helperText={initialAttentionError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Hacia dónde decidiste dirigir voluntariamente tu atención?"
					value={newAttention}
					onChange={(event) => {
						setNewAttention(event.target.value);
						if (newAttentionError && event.target.value.trim().length > 0) {
							setNewAttentionError(false);
						}
					}}
					error={newAttentionError}
					helperText={newAttentionError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué actividad realizaste para mantener esa nueva atención?"
					value={activityPerformed}
					onChange={(event) => {
						setActivityPerformed(event.target.value);
						if (activityPerformedError && event.target.value.trim().length > 0) {
							setActivityPerformedError(false);
						}
					}}
					error={activityPerformedError}
					helperText={activityPerformedError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider
					label="Facilidad para mantener la atención"
					value={attentionEase}
					onChange={setAttentionEase}
				/>

				<ExerciseEntryActions
					onSave={handleSaveExercise}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinalize}
					canSave
					showAddAnother={showPostSaveActions}
					showFinish={showPostSaveActions}
				/>

				{exercises.length > 0 ? (
					<Alert severity="success">Ejercicio guardado. Puedes agregar otro ejercicio o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay ejercicios registrados.</Alert>
				)}

				{exercises.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Ejercicios registrados de cambio de atención">
							<TableHead>
								<TableRow>
									<TableCell>Atención inicial</TableCell>
									<TableCell>Nueva atención</TableCell>
									<TableCell>Actividad realizada</TableCell>
									<TableCell align="right">Facilidad</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{exercises.map((exercise, index) => (
									<TableRow key={`${exercise.initialAttention}-${index}`}>
										<TableCell>{exercise.initialAttention}</TableCell>
										<TableCell>{exercise.newAttention}</TableCell>
										<TableCell>{exercise.activityPerformed}</TableCell>
										<TableCell align="right">{exercise.attentionEase}</TableCell>
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

export default AntiRuminationAttentionShiftRegisterPage;