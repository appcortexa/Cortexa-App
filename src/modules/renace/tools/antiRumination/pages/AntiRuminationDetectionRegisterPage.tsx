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
import type { RuminationRecord } from "../models/RuminationRecord";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type RuminationDetectionEpisode = Pick<
	RuminationRecord,
	"triggerSituation" | "ruminationTopic" | "duration" | "ruminationIntensity"
>;

type RegisterPageState = {
	episodes?: RuminationDetectionEpisode[];
};

const durationOptions = [
	"Menos de 5 minutos",
	"5-15 minutos",
	"15-30 minutos",
	"30-60 minutos",
	"Más de una hora",
] as const;

function sanitizeEpisodes(state: unknown): RuminationDetectionEpisode[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeEpisodes = (state as RegisterPageState).episodes;

	if (!Array.isArray(maybeEpisodes)) {
		return [];
	}

	return maybeEpisodes.filter(
		(episode) =>
			typeof episode.triggerSituation === "string" &&
			typeof episode.ruminationTopic === "string" &&
			typeof episode.duration === "string" &&
			typeof episode.ruminationIntensity === "number",
	);
}

function AntiRuminationDetectionRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialEpisodes = useMemo(() => sanitizeEpisodes(location.state), [location.state]);
	const [episodes, setEpisodes] = useState<RuminationDetectionEpisode[]>(initialEpisodes);
	const [triggerSituation, setTriggerSituation] = useState("");
	const [ruminationTopic, setRuminationTopic] = useState("");
	const [duration, setDuration] = useState("");
	const [ruminationIntensity, setRuminationIntensity] = useState(5);
	const [triggerSituationError, setTriggerSituationError] = useState(false);
	const [ruminationTopicError, setRuminationTopicError] = useState(false);
	const [durationError, setDurationError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(episodes.length > 0);

	const resetCurrentForm = () => {
		setTriggerSituation("");
		setRuminationTopic("");
		setDuration("");
		setRuminationIntensity(5);
		setTriggerSituationError(false);
		setRuminationTopicError(false);
		setDurationError(false);
	};

	const handleSaveEpisode = () => {
		const trimmedTriggerSituation = triggerSituation.trim();
		const trimmedRuminationTopic = ruminationTopic.trim();
		const hasTriggerSituation = trimmedTriggerSituation.length > 0;
		const hasRuminationTopic = trimmedRuminationTopic.length > 0;
		const hasDuration = duration.trim().length > 0;

		setTriggerSituationError(!hasTriggerSituation);
		setRuminationTopicError(!hasRuminationTopic);
		setDurationError(!hasDuration);

		if (!hasTriggerSituation || !hasRuminationTopic || !hasDuration) {
			return;
		}

		setEpisodes((currentEpisodes) => [
			...currentEpisodes,
			{
				triggerSituation: trimmedTriggerSituation,
				ruminationTopic: trimmedRuminationTopic,
				duration,
				ruminationIntensity,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/antirrumiacion/deteccion-rumiacion/resumen", {
			state: { episodes },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro de Rumiación"
			description="Registra cada episodio de rumiación identificando situación, tema, duración y sensación de atrapamiento (0 a 10)."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/antirrumiacion/deteccion-rumiacion/introduccion")}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro episodio
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={episodes.length === 0} onClick={handleFinalize}>
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
					label="Situación desencadenante"
					value={triggerSituation}
					onChange={(event) => {
						setTriggerSituation(event.target.value);
						if (triggerSituationError && event.target.value.trim().length > 0) {
							setTriggerSituationError(false);
						}
					}}
					error={triggerSituationError}
					helperText={triggerSituationError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Sobre qué comenzaste a pensar repetidamente?"
					value={ruminationTopic}
					onChange={(event) => {
						setRuminationTopic(event.target.value);
						if (ruminationTopicError && event.target.value.trim().length > 0) {
							setRuminationTopicError(false);
						}
					}}
					error={ruminationTopicError}
					helperText={ruminationTopicError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					select
					fullWidth
					label="¿Durante cuánto tiempo sentiste que quedaste atrapado(a) en esos pensamientos?"
					value={duration}
					onChange={(event) => {
						setDuration(event.target.value);
						if (durationError && event.target.value.trim().length > 0) {
							setDurationError(false);
						}
					}}
					error={durationError}
					helperText={durationError ? "Este campo es obligatorio." : " "}
				>
					<MenuItem value="" disabled>
						Selecciona una duración
					</MenuItem>
					{durationOptions.map((durationOption) => (
						<MenuItem key={durationOption} value={durationOption}>
							{durationOption}
						</MenuItem>
					))}
				</TextField>

				<EmotionIntensitySlider
					label="Sensación de atrapamiento"
					value={ruminationIntensity}
					onChange={setRuminationIntensity}
				/>

				<Button variant="contained" size="large" onClick={handleSaveEpisode}>
					Guardar episodio
				</Button>

				{episodes.length > 0 ? (
					<Alert severity="success">Episodio guardado. Puedes agregar otro episodio o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay episodios registrados.</Alert>
				)}

				{episodes.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Episodios de rumiación registrados">
							<TableHead>
								<TableRow>
									<TableCell>Situación desencadenante</TableCell>
									<TableCell>Tema de la rumiación</TableCell>
									<TableCell>Duración</TableCell>
									<TableCell align="right">Sensación de atrapamiento</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{episodes.map((episode, index) => (
									<TableRow key={`${episode.triggerSituation}-${index}`}>
										<TableCell>{episode.triggerSituation}</TableCell>
										<TableCell>{episode.ruminationTopic}</TableCell>
										<TableCell>{episode.duration}</TableCell>
										<TableCell align="right">{episode.ruminationIntensity}</TableCell>
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

export default AntiRuminationDetectionRegisterPage;