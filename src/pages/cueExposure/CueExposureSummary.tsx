import {
	Box,
	Button,
	Container,
	Paper,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

import { useCueExposureSession } from "../../contexts/CueExposureSessionContext";
import { createCueExposureResultFromSession, saveCueExposureResult } from "../../services/cueExposureStorage";
import type { CueExposureSession } from "./types/cueExposure.types";

const substanceLabels: Record<string, string> = {
	alcohol: "Alcohol",
	metanfetaminas: "Metanfetaminas",
	cocaina: "Cocaína",
};

function formatDuration(durationMinutes: number): string {
	return `${durationMinutes} minuto${durationMinutes === 1 ? "" : "s"}`;
}

function formatRelativeTime(relativeSecond: number | null): string {
	if (relativeSecond === null) {
		return "Sin registro";
	}

	const minutes = Math.floor(relativeSecond / 60);
	const seconds = relativeSecond % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatPercentageMoment(checkpointSecond: number, totalSessionSeconds: number): string {
	if (totalSessionSeconds <= 0) {
		return "0 %";
	}

	const percentage = Math.round((checkpointSecond / totalSessionSeconds) * 100);
	return `${percentage} %`;
}

interface CueExposureSummaryProps {
	session?: CueExposureSession | null;
	onBack?: () => void;
}

function CueExposureSummary({ session: providedSession, onBack }: CueExposureSummaryProps) {
	const navigate = useNavigate();
	const { session: contextSession, clearSession } = useCueExposureSession();
	const session = providedSession ?? contextSession;
	const isQueryMode = Boolean(providedSession);

	if (!session) {
		return <Navigate to="/cue-exposure" replace />;
	}

	const intermediateRecords = session.cravingRecords.filter((record) => record.type === "intermediate");
	const initialCraving = session.cravingRecords.find((record) => record.type === "initial");
	const finalCraving = session.cravingRecords.find((record) => record.type === "final");
	const totalSessionSeconds = Math.round(session.config.durationMinutes * 60);

	function handleFinish(): void {
		if (!session) {
			return;
		}

		const result = createCueExposureResultFromSession(session);
		saveCueExposureResult(result);
		clearSession();
		navigate("/", { replace: true });
	}

	function handleBack(): void {
		if (onBack) {
			onBack();
			return;
		}

		navigate("/cue-exposure/results", { replace: true });
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

					<Stack spacing={1.5}>
						<Typography variant="body1" sx={{ color: "text.primary" }}>
							Sustancia: {substanceLabels[session.config.substanceId] ?? session.config.substanceId}
						</Typography>
						<Typography variant="body1" sx={{ color: "text.primary" }}>
							Duración: {formatDuration(session.config.durationMinutes)}
						</Typography>
					</Stack>

					<TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto" }}>
						<Table size="small" aria-label="tabla de resumen de craving">
							<TableHead>
								<TableRow>
									<TableCell sx={{ fontWeight: 700 }}>Momento</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Tiempo</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Craving</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>Inicial</TableCell>
									<TableCell>00:00</TableCell>
									<TableCell>{initialCraving?.value ?? "Sin registro"}</TableCell>
								</TableRow>
								{intermediateRecords.map((record) => (
									<TableRow key={record.id}>
										<TableCell>{formatPercentageMoment(record.checkpointSecond, totalSessionSeconds)}</TableCell>
										<TableCell>{formatRelativeTime(record.relativeSecond)}</TableCell>
										<TableCell>{record.value ?? "Sin registro"}</TableCell>
									</TableRow>
								))}
								<TableRow>
									<TableCell>Final</TableCell>
									<TableCell>{formatRelativeTime(totalSessionSeconds)}</TableCell>
									<TableCell>{finalCraving?.value ?? "Sin registro"}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>

					<Button fullWidth variant={isQueryMode ? "outlined" : "contained"} size="large" onClick={isQueryMode ? handleBack : handleFinish}>
						{isQueryMode ? "Regresar" : "Finalizar"}
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default CueExposureSummary;