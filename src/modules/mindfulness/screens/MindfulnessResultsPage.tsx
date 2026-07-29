import { useState } from "react";
import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ModuleHeader from "../../../components/common/ModuleHeader";
import {
	getMindfulnessResultsByExpediente,
	type MindfulnessStoredResult,
} from "../../../services/mindfulnessStorage";

function parseResultTimestamp(result: MindfulnessStoredResult): number {
	const parsed = new Date(result.endedAt).getTime();
	if (!Number.isNaN(parsed)) {
		return parsed;
	}

	const [day, month, year] = result.fecha.split("/").map((value) => Number(value));
	if (!day || !month || !year) {
		return 0;
	}

	return new Date(year, month - 1, day).getTime();
}

function formatDuration(durationMinutes: number): string {
	return `${durationMinutes} minuto${durationMinutes === 1 ? "" : "s"}`;
}

function MindfulnessResultsPage() {
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState("");
	const [results, setResults] = useState<MindfulnessStoredResult[]>([]);
	const [hasSearched, setHasSearched] = useState(false);

	function handleSearch(): void {
		const trimmedExpediente = expediente.trim();
		const foundResults = trimmedExpediente
			? getMindfulnessResultsByExpediente(trimmedExpediente)
			: [];

		setHasSearched(true);
		setResults([...foundResults].sort((a, b) => parseResultTimestamp(b) - parseResultTimestamp(a)));
	}

	function handleViewSummary(result: MindfulnessStoredResult): void {
		navigate("/mindfulness/summary", {
			state: {
				result,
			},
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
				<Stack spacing={3.5}>
					<ModuleHeader moduleName="Mindfulness" title="Consulta de resultados" />

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
												Hora: {result.hora}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Práctica: {result.configuration.practiceLabel}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Modo: {result.configuration.sessionModeLabel}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Duración: {formatDuration(result.configuration.durationMinutes)}
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

					<Button fullWidth variant="outlined" size="large" onClick={() => navigate("/mindfulness")}>
						Regresar
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default MindfulnessResultsPage;
