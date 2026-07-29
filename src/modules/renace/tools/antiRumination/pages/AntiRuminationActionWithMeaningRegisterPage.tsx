import {
	Alert,
	Button,
	MenuItem,
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

type ActionWithMeaningExercise = {
	repetitiveThought: string;
	valuableAction: string;
	lifeArea: string;
	actionSatisfaction: number;
};

type RegisterPageState = {
	exercises?: ActionWithMeaningExercise[];
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

function sanitizeExercises(state: unknown): ActionWithMeaningExercise[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeExercises = (state as RegisterPageState).exercises;

	if (!Array.isArray(maybeExercises)) {
		return [];
	}

	return maybeExercises.filter(
		(exercise) =>
			typeof exercise.repetitiveThought === "string" &&
			typeof exercise.valuableAction === "string" &&
			typeof exercise.lifeArea === "string" &&
			typeof exercise.actionSatisfaction === "number",
	);
}

function AntiRuminationActionWithMeaningRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialExercises = useMemo(() => sanitizeExercises(location.state), [location.state]);
	const [exercises, setExercises] = useState<ActionWithMeaningExercise[]>(initialExercises);
	const [repetitiveThought, setRepetitiveThought] = useState("");
	const [valuableAction, setValuableAction] = useState("");
	const [lifeArea, setLifeArea] = useState("");
	const [actionSatisfaction, setActionSatisfaction] = useState(5);
	const [repetitiveThoughtError, setRepetitiveThoughtError] = useState(false);
	const [valuableActionError, setValuableActionError] = useState(false);
	const [lifeAreaError, setLifeAreaError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(exercises.length > 0);

	const resetCurrentForm = () => {
		setRepetitiveThought("");
		setValuableAction("");
		setLifeArea("");
		setActionSatisfaction(5);
		setRepetitiveThoughtError(false);
		setValuableActionError(false);
		setLifeAreaError(false);
	};

	const handleSaveExercise = () => {
		const trimmedRepetitiveThought = repetitiveThought.trim();
		const trimmedValuableAction = valuableAction.trim();
		const trimmedLifeArea = lifeArea.trim();
		const hasRepetitiveThought = trimmedRepetitiveThought.length > 0;
		const hasValuableAction = trimmedValuableAction.length > 0;
		const hasLifeArea = trimmedLifeArea.length > 0;

		setRepetitiveThoughtError(!hasRepetitiveThought);
		setValuableActionError(!hasValuableAction);
		setLifeAreaError(!hasLifeArea);

		if (!hasRepetitiveThought || !hasValuableAction || !hasLifeArea) {
			return;
		}

		setExercises((currentExercises) => [
			...currentExercises,
			{
				repetitiveThought: trimmedRepetitiveThought,
				valuableAction: trimmedValuableAction,
				lifeArea: trimmedLifeArea,
				actionSatisfaction,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/antirrumiacion/accion-con-sentido/resumen", {
			state: { exercises },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro"
			description="Registra acciones valiosas realizadas aun cuando la rumiación estaba presente."
			actions={
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/renace/antirrumiacion/accion-con-sentido/introduccion")}
				>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					label="¿Qué pensamiento repetitivo estaba presente?"
					value={repetitiveThought}
					onChange={(event) => {
						setRepetitiveThought(event.target.value);
						if (repetitiveThoughtError && event.target.value.trim().length > 0) {
							setRepetitiveThoughtError(false);
						}
					}}
					error={repetitiveThoughtError}
					helperText={repetitiveThoughtError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué acción valiosa decidiste realizar a pesar de esos pensamientos?"
					value={valuableAction}
					onChange={(event) => {
						setValuableAction(event.target.value);
						if (valuableActionError && event.target.value.trim().length > 0) {
							setValuableActionError(false);
						}
					}}
					error={valuableActionError}
					helperText={valuableActionError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					select
					fullWidth
					label="¿Qué área importante de tu vida fortaleciste con esa acción?"
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
					label="Satisfacción con la acción"
					value={actionSatisfaction}
					onChange={setActionSatisfaction}
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
						<Table size="small" aria-label="Ejercicios registrados de acción con sentido">
							<TableHead>
								<TableRow>
									<TableCell>Pensamiento repetitivo</TableCell>
									<TableCell>Acción realizada</TableCell>
									<TableCell>Área fortalecida</TableCell>
									<TableCell align="right">Satisfacción</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{exercises.map((exercise, index) => (
									<TableRow key={`${exercise.repetitiveThought}-${index}`}>
										<TableCell>{exercise.repetitiveThought}</TableCell>
										<TableCell>{exercise.valuableAction}</TableCell>
										<TableCell>{exercise.lifeArea}</TableCell>
										<TableCell align="right">{exercise.actionSatisfaction}</TableCell>
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

export default AntiRuminationActionWithMeaningRegisterPage;
