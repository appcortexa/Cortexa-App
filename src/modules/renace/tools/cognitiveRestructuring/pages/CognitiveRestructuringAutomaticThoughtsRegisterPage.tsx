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

import EmotionIntensitySlider from "../components/EmotionIntensitySlider";
import type { CognitiveRecord } from "../models/CognitiveRecord";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type AutomaticThoughtRecord = Pick<CognitiveRecord, "situation" | "automaticThought" | "emotion" | "emotionIntensity">;

type RegisterPageState = {
	records?: AutomaticThoughtRecord[];
};

const emotionOptions = ["Tristeza", "Ansiedad", "Enojo", "Culpa", "Verguenza", "Frustración", "Miedo"];

function sanitizeRecords(state: unknown): AutomaticThoughtRecord[] {
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
			typeof record.automaticThought === "string" &&
			typeof record.emotion === "string" &&
			typeof record.emotionIntensity === "number",
	);
}

function CognitiveRestructuringAutomaticThoughtsRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<AutomaticThoughtRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [automaticThought, setAutomaticThought] = useState("");
	const [emotion, setEmotion] = useState(emotionOptions[0]);
	const [emotionIntensity, setEmotionIntensity] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [automaticThoughtError, setAutomaticThoughtError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setAutomaticThought("");
		setEmotion(emotionOptions[0]);
		setEmotionIntensity(5);
		setSituationError(false);
		setAutomaticThoughtError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const trimmedAutomaticThought = automaticThought.trim();
		const hasSituation = trimmedSituation.length > 0;
		const hasAutomaticThought = trimmedAutomaticThought.length > 0;

		setSituationError(!hasSituation);
		setAutomaticThoughtError(!hasAutomaticThought);

		if (!hasSituation || !hasAutomaticThought) {
			return;
		}

		setRecords((currentRecords) => [
			...currentRecords,
			{
				situation: trimmedSituation,
				automaticThought: trimmedAutomaticThought,
				emotion,
				emotionIntensity,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/reestructuracion-cognitiva/deteccion-pensamientos-automaticos/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;

	return (
		<InterventionScreenLayout
			title="Registro de Pensamientos"
			description="Registra una situación por vez con su pensamiento automático, emoción predominante e intensidad emocional (0 a 10)."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate(
								"/renace/reestructuracion-cognitiva/deteccion-pensamientos-automaticos/introduccion",
							)
						}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro pensamiento
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={!canFinalize} onClick={handleFinalize}>
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
					label="Pensamiento automático"
					value={automaticThought}
					onChange={(event) => {
						setAutomaticThought(event.target.value);
						if (automaticThoughtError && event.target.value.trim().length > 0) {
							setAutomaticThoughtError(false);
						}
					}}
					error={automaticThoughtError}
					helperText={automaticThoughtError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					select
					fullWidth
					label="Emoción predominante"
					value={emotion}
					onChange={(event) => setEmotion(event.target.value)}
				>
					{emotionOptions.map((emotionOption) => (
						<MenuItem key={emotionOption} value={emotionOption}>
							{emotionOption}
						</MenuItem>
					))}
				</TextField>

				<EmotionIntensitySlider
					label="Intensidad emocional"
					value={emotionIntensity}
					onChange={setEmotionIntensity}
				/>

				<Button variant="contained" size="large" onClick={handleSaveRecord}>
					Guardar pensamiento
				</Button>

				{records.length > 0 ? (
					<Alert severity="success">
						Pensamiento guardado. Puedes agregar otro pensamiento o finalizar.
					</Alert>
				) : (
					<Alert severity="info">Aún no hay pensamientos registrados.</Alert>
				)}

				{records.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Pensamientos registrados">
							<TableHead>
								<TableRow>
									<TableCell>Situación</TableCell>
									<TableCell>Pensamiento automático</TableCell>
									<TableCell>Emoción</TableCell>
									<TableCell align="right">Intensidad</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{records.map((record, index) => (
									<TableRow key={`${record.situation}-${index}`}>
										<TableCell>{record.situation}</TableCell>
										<TableCell>{record.automaticThought}</TableCell>
										<TableCell>{record.emotion}</TableCell>
										<TableCell align="right">{record.emotionIntensity}</TableCell>
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

export default CognitiveRestructuringAutomaticThoughtsRegisterPage;
