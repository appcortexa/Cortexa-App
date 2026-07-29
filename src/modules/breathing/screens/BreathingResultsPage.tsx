import { useState } from "react";
import { Box, Button, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ModuleHeader from "../../../components/common/ModuleHeader";
import ExpedienteField from "../../mindfulness/components/ExpedienteField";
import {
	breathingStorageService,
	type BreathingStoredSession,
} from "../services/breathingStorageService";

function parseResultTimestamp(result: BreathingStoredSession): number {
	const finishedAt = result.collectedData.timestamps.sessionFinishedAt;
	const updatedAt = result.collectedData.timestamps.updatedAt;
	const parsed = new Date(finishedAt ?? updatedAt).getTime();

	return Number.isNaN(parsed) ? 0 : parsed;
}

function formatTimestamp(isoTimestamp: string | null): string {
	if (!isoTimestamp) {
		return "Sin registro";
	}

	const parsed = new Date(isoTimestamp);
	if (Number.isNaN(parsed.getTime())) {
		return "Sin registro";
	}

	return new Intl.DateTimeFormat("es-MX", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(parsed);
}

function findSummaryDetail(result: BreathingStoredSession, label: string): string {
	const detail = result.summary.details.find((item) => item.label === label);
	return detail?.value ?? "Sin registro";
}

function BreathingResultsPage() {
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState("");
	const [results, setResults] = useState<BreathingStoredSession[]>([]);
	const [hasSearched, setHasSearched] = useState(false);

	function handleSearch(): void {
		const trimmedExpediente = expediente.trim();
		const foundResults = trimmedExpediente
			? breathingStorageService.getSessionsByExpediente(trimmedExpediente)
			: [];

		setHasSearched(true);
		setResults([...foundResults].sort((a, b) => parseResultTimestamp(b) - parseResultTimestamp(a)));
	}

	function handleViewSummary(result: BreathingStoredSession): void {
		navigate("/breathing/summary", {
			state: {
				summaryViewModel: result.summary,
				source: "history",
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
					<ModuleHeader
						moduleName="Respiración Diafragmática"
						title="Consulta de resultados"
					/>

					<ExpedienteField value={expediente} onChange={setExpediente} />

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
								<Card key={result.sessionId} variant="outlined">
									<CardContent>
										<Stack spacing={0.75}>
											<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
												Fin: {formatTimestamp(result.collectedData.timestamps.sessionFinishedAt)}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Patrón: {findSummaryDetail(result, "Patrón respiratorio")}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Duración: {findSummaryDetail(result, "Duración")}
											</Typography>
											<Typography variant="body2" sx={{ color: "text.secondary" }}>
												Evaluaciones intermedias: {findSummaryDetail(result, "Evaluaciones intermedias")}
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

					<Button fullWidth variant="contained" onClick={() => navigate("/breathing")}>
						Regresar
					</Button>
					<Button fullWidth variant="outlined" color="secondary" onClick={() => navigate("/")}>
						Volver al menú principal
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default BreathingResultsPage;
