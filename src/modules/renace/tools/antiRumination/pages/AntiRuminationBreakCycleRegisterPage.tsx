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
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import RuminationStrategySelector from "../components/RuminationStrategySelector";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type BreakCycleExercise = {
	repetitiveThought: string;
	strategyUsed: string;
	observedOutcome: string;
	perceivedUsefulness: number;
};

type RegisterPageState = {
	exercises?: BreakCycleExercise[];
};

function sanitizeExercises(state: unknown): BreakCycleExercise[] {
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
			typeof exercise.strategyUsed === "string" &&
			typeof exercise.observedOutcome === "string" &&
			typeof exercise.perceivedUsefulness === "number",
	);
}

function AntiRuminationBreakCycleRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialExercises = useMemo(() => sanitizeExercises(location.state), [location.state]);
	const [exercises, setExercises] = useState<BreakCycleExercise[]>(initialExercises);
	const [repetitiveThought, setRepetitiveThought] = useState("");
	const [strategyUsed, setStrategyUsed] = useState("");
	const [observedOutcome, setObservedOutcome] = useState("");
	const [perceivedUsefulness, setPerceivedUsefulness] = useState(5);
	const [repetitiveThoughtError, setRepetitiveThoughtError] = useState(false);
	const [strategyUsedError, setStrategyUsedError] = useState(false);
	const [observedOutcomeError, setObservedOutcomeError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(exercises.length > 0);

	const resetCurrentForm = () => {
		setRepetitiveThought("");
		setStrategyUsed("");
		setObservedOutcome("");
		setPerceivedUsefulness(5);
		setRepetitiveThoughtError(false);
		setStrategyUsedError(false);
		setObservedOutcomeError(false);
	};

	const handleSaveExercise = () => {
		const trimmedRepetitiveThought = repetitiveThought.trim();
		const trimmedStrategyUsed = strategyUsed.trim();
		const trimmedObservedOutcome = observedOutcome.trim();
		const hasRepetitiveThought = trimmedRepetitiveThought.length > 0;
		const hasStrategyUsed = trimmedStrategyUsed.length > 0;
		const hasObservedOutcome = trimmedObservedOutcome.length > 0;

		setRepetitiveThoughtError(!hasRepetitiveThought);
		setStrategyUsedError(!hasStrategyUsed);
		setObservedOutcomeError(!hasObservedOutcome);

		if (!hasRepetitiveThought || !hasStrategyUsed || !hasObservedOutcome) {
			return;
		}

		setExercises((currentExercises) => [
			...currentExercises,
			{
				repetitiveThought: trimmedRepetitiveThought,
				strategyUsed: trimmedStrategyUsed,
				observedOutcome: trimmedObservedOutcome,
				perceivedUsefulness,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/antirrumiacion/romper-ciclo/resumen", {
			state: { exercises },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro"
			description="Registra cada ejercicio para observar qué ocurrió después de aplicar una estrategia de interrupción."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/antirrumiacion/romper-ciclo/introduccion")}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro ejercicio
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={exercises.length === 0} onClick={handleFinalize}>
							Finalizar
						</Button>
					</Stack>
				</Stack>
			}
		>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					label="¿Qué pensamiento repetitivo estabas experimentando?"
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

				<Stack spacing={0.5}>
					<RuminationStrategySelector
						label="¿Qué estrategia utilizaste para interrumpir ese ciclo?"
						value={strategyUsed}
						onChange={(nextValue) => {
							setStrategyUsed(nextValue);
							if (strategyUsedError && nextValue.trim().length > 0) {
								setStrategyUsedError(false);
							}
						}}
					/>
					<Typography variant="caption" sx={{ color: strategyUsedError ? "error.main" : "text.secondary", px: 1.75 }}>
						{strategyUsedError ? "Este campo es obligatorio." : " "}
					</Typography>
				</Stack>

				<TextField
					required
					fullWidth
					label="¿Qué ocurrió después de utilizar esa estrategia?"
					value={observedOutcome}
					onChange={(event) => {
						setObservedOutcome(event.target.value);
						if (observedOutcomeError && event.target.value.trim().length > 0) {
							setObservedOutcomeError(false);
						}
					}}
					error={observedOutcomeError}
					helperText={
						observedOutcomeError
							? "Este campo es obligatorio."
							: "Registra únicamente la experiencia observada."
					}
				/>

				<EmotionIntensitySlider
					label="Utilidad percibida"
					value={perceivedUsefulness}
					onChange={setPerceivedUsefulness}
				/>

				<Button variant="contained" size="large" onClick={handleSaveExercise}>
					Guardar ejercicio
				</Button>

				{exercises.length > 0 ? (
					<Alert severity="success">Ejercicio guardado. Puedes agregar otro ejercicio o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay ejercicios registrados.</Alert>
				)}

				{exercises.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Ejercicios registrados de romper el ciclo">
							<TableHead>
								<TableRow>
									<TableCell>Pensamiento repetitivo</TableCell>
									<TableCell>Estrategia utilizada</TableCell>
									<TableCell>Resultado observado</TableCell>
									<TableCell align="right">Utilidad percibida</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{exercises.map((exercise, index) => (
									<TableRow key={`${exercise.repetitiveThought}-${index}`}>
										<TableCell>{exercise.repetitiveThought}</TableCell>
										<TableCell>{exercise.strategyUsed}</TableCell>
										<TableCell>{exercise.observedOutcome}</TableCell>
										<TableCell align="right">{exercise.perceivedUsefulness}</TableCell>
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

export default AntiRuminationBreakCycleRegisterPage;