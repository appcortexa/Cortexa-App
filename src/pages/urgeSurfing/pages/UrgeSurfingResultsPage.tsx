import { useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
	getUrgeSurfingResultsByExpediente,
	type UrgeSurfingStoredResult,
} from "../../../services/urgeSurfingStorage";
import type { SessionResult } from "../types/SessionResult";

function parseResultTimestamp(result: UrgeSurfingStoredResult): number {
	const parsed = new Date(result.endedAt).getTime();
	if (!Number.isNaN(parsed)) {
		return parsed;
	}

	const fallbackParsed = new Date(`${result.fecha} ${result.hora}`).getTime();
	return Number.isNaN(fallbackParsed) ? 0 : fallbackParsed;
}

function formatDuration(durationSeconds: number): string {
	const minutes = Math.floor(durationSeconds / 60);
	const seconds = durationSeconds % 60;
	return `${minutes} min ${String(seconds).padStart(2, "0")} s`;
}

function buildSessionResult(result: UrgeSurfingStoredResult): SessionResult {
	return {
		patientId: result.expediente,
		startedAt: new Date(result.startedAt),
		endedAt: new Date(result.endedAt),
		durationMinutes: result.durationMinutes,
		durationSeconds: result.durationSeconds,
		cardAdvanceMode: result.cardAdvanceMode,
		intermediateRecordFrequency: result.intermediateRecordFrequency,
		initialCraving: result.initialCraving,
		intermediateRecords: result.intermediateRecords.map((record) => ({
			secondFromStart: record.secondFromStart,
			craving: record.craving,
		})),
		finalCraving: result.finalCraving,
	};
}

function UrgeSurfingResultsPage() {
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState("");
	const [results, setResults] = useState<UrgeSurfingStoredResult[]>([]);
	const [hasSearched, setHasSearched] = useState(false);

	function handleSearch(): void {
		const trimmedExpediente = expediente.trim();
		const foundResults = trimmedExpediente ? getUrgeSurfingResultsByExpediente(trimmedExpediente) : [];

		setHasSearched(true);
		setResults([...foundResults].sort((a, b) => parseResultTimestamp(b) - parseResultTimestamp(a)));
	}

	function handleViewSummary(result: UrgeSurfingStoredResult): void {
		navigate("/urge-surfing/summary", {
			state: buildSessionResult(result),
		});
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
					<Typography
						variant="h4"
						component="h1"
						sx={{ fontWeight: 700, color: "primary.main", textAlign: "center" }}
					>
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
												Duración: {formatDuration(result.durationSeconds)}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Craving inicial: {result.initialCraving}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Craving final: {result.finalCraving}
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

					<Button fullWidth variant="outlined" size="large" onClick={() => navigate("/urge-surfing")}>
						Regresar
					</Button>
				</Box>
			</Container>
		</Box>
	);
}

export default UrgeSurfingResultsPage;
