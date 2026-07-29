import {
	Button,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import RuminationSummaryCard from "../components/RuminationSummaryCard";
import type { RuminationRecord } from "../models/RuminationRecord";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type RuminationDetectionEpisode = Pick<
	RuminationRecord,
	"triggerSituation" | "ruminationTopic" | "duration" | "ruminationIntensity"
>;

type SummaryPageState = {
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

	const maybeEpisodes = (state as SummaryPageState).episodes;

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

function AntiRuminationDetectionSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const episodes = sanitizeEpisodes(location.state);
	const hasEpisodes = episodes.length > 0;

	if (!hasEpisodes) {
		return <Navigate to="/renace/antirrumiacion/deteccion-rumiacion/registro" replace />;
	}

	const totalEpisodes = episodes.length;
	const totalRuminationIntensity = episodes.reduce((sum, episode) => sum + episode.ruminationIntensity, 0);
	const averageRuminationIntensity = totalRuminationIntensity / totalEpisodes;
	const episodesByDuration = durationOptions.map((durationOption) => ({
		duration: durationOption,
		count: episodes.filter((episode) => episode.duration === durationOption).length,
	}));

	return (
		<InterventionScreenLayout
			title="Resumen de Episodios"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/antirrumiacion/deteccion-rumiacion/registro", {
								state: { episodes },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/antirrumiacion/deteccion-rumiacion/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<RuminationSummaryCard
				title="Indicadores"
				metrics={[
					{
						id: "total-episodes",
						label: "Número de episodios registrados",
						value: totalEpisodes,
					},
					{
						id: "average-rumination-intensity",
						label: "Sensación promedio de atrapamiento",
						value: averageRuminationIntensity.toFixed(1),
					},
					...episodesByDuration.map((durationMetric) => ({
						id: `duration-${durationMetric.duration}`,
						label: `Episodios (${durationMetric.duration})`,
						value: durationMetric.count,
					})),
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de episodios de rumiación">
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
		</InterventionScreenLayout>
	);
}

export default AntiRuminationDetectionSummaryPage;