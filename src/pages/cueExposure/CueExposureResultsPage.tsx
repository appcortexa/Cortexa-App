import { useState } from "react";
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CueExposureSummary from "./CueExposureSummary";
import { getCueExposureResultsByExpediente, type CueExposureResult } from "../../services/cueExposureStorage";
import type { CueExposureSession } from "./types/cueExposure.types";

const substanceLabels: Record<string, string> = {
	alcohol: "Alcohol",
	metanfetaminas: "Metanfetaminas",
	cocaina: "Cocaína",
};

function formatDuration(durationMinutes: number): string {
	return `${durationMinutes} minuto${durationMinutes === 1 ? "" : "s"}`;
}

function parseResultTimestamp(result: CueExposureResult): number {
	const parsed = new Date(`${result.fecha}T${result.hora}`).getTime();
	return Number.isNaN(parsed) ? 0 : parsed;
}

function buildSessionForSummary(result: CueExposureResult): CueExposureSession {
	const totalSeconds = result.duracion * 60;
	const createdAt = `${result.fecha}T${result.hora}`;

	return {
		id: result.id,
		createdAt,
		startedAt: createdAt,
		finishedAt: createdAt,
		config: {
			expediente: result.expediente,
			substanceId: result.sustancia,
			durationMinutes: result.duracion,
			initialCraving: result.cravingInicial ?? 0,
			intermediateRecordType: "none",
		},
		checkpoints: [],
		cravingRecords: [
			{
				id: `${result.id}-initial`,
				type: "initial",
				checkpointSecond: 0,
				relativeSecond: 0,
				value: result.cravingInicial,
				recordedAt: null,
			},
			...result.registrosIntermedios.map((record, index) => ({
				id: `${result.id}-intermediate-${index}`,
				type: "intermediate" as const,
				checkpointSecond: record.checkpointSecond,
				relativeSecond: record.relativeSecond,
				value: record.value,
				recordedAt: record.recordedAt,
			})),
			{
				id: `${result.id}-final`,
				type: "final",
				checkpointSecond: totalSeconds,
				relativeSecond: totalSeconds,
				value: result.cravingFinal,
				recordedAt: null,
			},
		],
		state: {
			status: "finished",
			elapsedSeconds: totalSeconds,
			nextCheckpointIndex: 0,
		},
		result: {
			initialCraving: result.cravingInicial,
			finalCraving: result.cravingFinal,
			averageIntermediateCraving: null,
			intermediateRecordsCompleted: result.registrosIntermedios.length,
			totalIntermediateRecords: result.registrosIntermedios.length,
		},
	};
}

function CueExposureResultsPage() {
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState("");
	const [results, setResults] = useState<CueExposureResult[]>([]);
	const [hasSearched, setHasSearched] = useState(false);
	const [selectedSession, setSelectedSession] = useState<CueExposureSession | null>(null);

	function handleSearch() {
		const trimmedExpediente = expediente.trim();
		const foundResults = trimmedExpediente
			? getCueExposureResultsByExpediente(trimmedExpediente)
			: [];

		setHasSearched(true);
		setResults([...foundResults].sort((a, b) => parseResultTimestamp(b) - parseResultTimestamp(a)));
		setSelectedSession(null);
	}

	function handleViewSummary(result: CueExposureResult) {
		setSelectedSession(buildSessionForSummary(result));
	}

	function handleBackToSearch() {
		setSelectedSession(null);
	}

	if (selectedSession) {
		return <CueExposureSummary session={selectedSession} onBack={handleBackToSearch} />;
	}

	return (
		<Box
			sx={{
				bgcolor: "#FFFFFF",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				py: { xs: 4, sm: 6 },
			}}
		>
			<Container maxWidth="sm">
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
					<Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main", textAlign: "center" }}>
						Consulta de resultados
					</Typography>

					<TextField
						fullWidth
						label="Número de expediente"
						required
						value={expediente}
						onChange={(event) => setExpediente(event.target.value)}
					/>

					<Button fullWidth variant="contained" size="large" onClick={handleSearch}>
						Buscar
					</Button>

					{hasSearched && results.length === 0 ? (
						<Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
							No se encontraron sesiones para este número de expediente.
						</Typography>
					) : null}

					{results.length > 0 ? (
						<Stack spacing={1.5}>
							{results.map((result) => (
								<Card key={result.id} variant="outlined">
									<CardContent>
										<Stack spacing={0.75}>
											<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
												Fecha: {result.fecha}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Sustancia: {substanceLabels[result.sustancia] ?? result.sustancia}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Duración: {formatDuration(result.duracion)}
											</Typography>
										</Stack>
									</CardContent>
									<Box sx={{ px: 2, pb: 2 }}>
										<Button fullWidth variant="outlined" onClick={() => handleViewSummary(result)}>
											Ver resumen
										</Button>
									</Box>
								</Card>
							))}
						</Stack>
					) : null}

					<Button fullWidth variant="outlined" size="large" onClick={() => navigate("/cue-exposure")}>
						Regresar
					</Button>
				</Box>
			</Container>
		</Box>
	);
}

export default CueExposureResultsPage;
