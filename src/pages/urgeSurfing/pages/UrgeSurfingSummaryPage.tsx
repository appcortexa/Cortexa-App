import { Box, Button, Container, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import type { SessionResult } from "../types/SessionResult";

function isSessionResultState(value: unknown): value is SessionResult {
	if (!value || typeof value !== "object") {
		return false;
	}

	const state = value as Partial<SessionResult>;

	return (
		typeof state.patientId === "string" &&
		state.startedAt instanceof Date &&
		state.endedAt instanceof Date &&
		typeof state.durationMinutes === "number" &&
		typeof state.durationSeconds === "number" &&
		(state.cardAdvanceMode === "automatic" || state.cardAdvanceMode === "manual") &&
		(state.intermediateRecordFrequency === "none" ||
			state.intermediateRecordFrequency === "25" ||
			state.intermediateRecordFrequency === "33" ||
			state.intermediateRecordFrequency === "50") &&
		typeof state.initialCraving === "number" &&
		Array.isArray(state.intermediateRecords) &&
		typeof state.finalCraving === "number"
	);
}

function formatDuration(durationSeconds: number): string {
	const minutes = Math.floor(durationSeconds / 60);
	const seconds = durationSeconds % 60;

	return `${minutes} min ${String(seconds).padStart(2, "0")} s`;
}

function formatSecond(secondFromStart: number): string {
	const minutes = Math.floor(secondFromStart / 60);
	const seconds = secondFromStart % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function sortIntermediateRecordsByTime(result: SessionResult): SessionResult["intermediateRecords"] {
	return [...result.intermediateRecords].sort((a, b) => a.secondFromStart - b.secondFromStart);
}

function UrgeSurfingSummaryPage() {
	const location = useLocation();
	const navigate = useNavigate();

	if (!isSessionResultState(location.state)) {
		return <Navigate to="/urge-surfing" replace />;
	}

	const result = location.state;
	const sortedIntermediateRecords = sortIntermediateRecordsByTime(result);

	function handleFinish(): void {
		navigate("/urge-surfing", { replace: true });
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
				<Stack spacing={3}>
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main", mb: 1.5 }}>
							Resumen de sesión
						</Typography>
					</Box>

					<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
						<Stack spacing={1.25}>
							<Typography variant="body1" sx={{ color: "text.primary" }}>
								Expediente: {result.patientId}
							</Typography>
							<Typography variant="body1" sx={{ color: "text.primary" }}>
								Duración: {formatDuration(result.durationSeconds)}
							</Typography>
							<Typography variant="body1" sx={{ color: "text.primary" }}>
								Craving inicial: {result.initialCraving}
							</Typography>
							<Typography variant="body1" sx={{ color: "text.primary" }}>
								Craving final: {result.finalCraving}
							</Typography>
						</Stack>
					</Paper>

					<Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
						<Stack spacing={1.5}>
							<Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
								Registros de craving
							</Typography>

							<Table size="small" aria-label="tabla de registros de craving">
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 700 }}>Momento</TableCell>
										<TableCell sx={{ fontWeight: 700 }} align="right">
											Craving
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>Inicial</TableCell>
										<TableCell align="right">{result.initialCraving}</TableCell>
									</TableRow>
									{sortedIntermediateRecords.map((record, index) => (
										<TableRow key={`${record.secondFromStart}-${index}`}>
											<TableCell>{formatSecond(record.secondFromStart)}</TableCell>
											<TableCell align="right">{record.craving}</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell>Final</TableCell>
										<TableCell align="right">{result.finalCraving}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Stack>
					</Paper>

					<Button fullWidth variant="contained" size="large" onClick={handleFinish}>
						Finalizar
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default UrgeSurfingSummaryPage;
