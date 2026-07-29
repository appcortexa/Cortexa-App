import { useEffect, useMemo, useRef, useState } from "react";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
	Box,
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

import { cueExposureConfig } from "../../config/cueExposureConfig";
import { useCueExposureSession } from "../../contexts/CueExposureSessionContext";
import CravingDialog from "./components/CravingDialog";
import ImageViewer from "./components/ImageViewer";
import { createStimulusService } from "./services/stimulusService";
import type { CueExposureSession as CueExposureSessionState, SessionCheckpoint } from "./types/cueExposure.types";

function formatRemainingTime(remainingSeconds: number): string {
	const safeSeconds = Math.max(0, remainingSeconds);
	const minutes = Math.floor(safeSeconds / 60);
	const seconds = safeSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getActiveCheckpoint(session: CueExposureSessionState | null): SessionCheckpoint | null {
	if (!session) {
		return null;
	}

	return session.checkpoints[session.state.nextCheckpointIndex] ?? null;
}

function getIntermediateStats(session: CueExposureSessionState): {
	averageIntermediateCraving: number | null;
	intermediateRecordsCompleted: number;
} {
	const completedValues = session.cravingRecords
		.filter((record) => record.type === "intermediate" && record.value !== null)
		.map((record) => record.value as number);

	if (completedValues.length === 0) {
		return {
			averageIntermediateCraving: null,
			intermediateRecordsCompleted: 0,
		};
	}

	const total = completedValues.reduce((sum, value) => sum + value, 0);

	return {
		averageIntermediateCraving: total / completedValues.length,
		intermediateRecordsCompleted: completedValues.length,
	};
}

function CueExposureSession() {
	const navigate = useNavigate();
	const { session, setSession, clearSession } = useCueExposureSession();
	const [currentImage, setCurrentImage] = useState<string>("");
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [cravingValue, setCravingValue] = useState<number | null>(null);
	const config = session?.config;
	const substanceId = config?.substanceId ?? "alcohol";
	const stimulusService = useMemo(() => createStimulusService(substanceId), [substanceId]);
	const totalSeconds = config ? Math.round(config.durationMinutes * 60) : 0;
	const imageStepSeconds = Math.max(1, Math.round(cueExposureConfig.imageDurationMs / 1000));
	const imagePhaseRef = useRef(0);
	const skipNextImageAdvanceRef = useRef(false);
	const completedRef = useRef(false);
	const sessionId = session?.id ?? null;
	const remainingSeconds = config ? Math.max(0, totalSeconds - session.state.elapsedSeconds) : 0;
	const activeCheckpoint = getActiveCheckpoint(session);
	const isFinalPrompt = Boolean(config && session && session.state.status === "paused" && session.state.elapsedSeconds >= totalSeconds);
	const isIntermediatePrompt = Boolean(session && session.state.status === "paused" && activeCheckpoint);
	const isCravingPromptVisible = isFinalPrompt || isIntermediatePrompt;

	useEffect(() => {
		if (!sessionId || !config) {
			return undefined;
		}

		completedRef.current = false;
		imagePhaseRef.current = 0;

		const startedAt = session?.startedAt ?? new Date().toISOString();

		setSession((previousSession) => {
			if (!previousSession || previousSession.id !== sessionId) {
				return previousSession;
			}

			if (previousSession.startedAt === startedAt && previousSession.state.status !== "created") {
				return previousSession;
			}

			const initialImage = stimulusService.getNextImage();
			setCurrentImage(initialImage);

			return {
				...previousSession,
				startedAt,
				state: {
					...previousSession.state,
					status: "running",
				},
			};
		});

		return undefined;
	}, [config, session?.startedAt, sessionId, setSession, stimulusService]);

	useEffect(() => {
		if (!sessionId || !config || !session || session.state.status !== "running") {
			return undefined;
		}

		const tick = () => {
			setSession((previousSession) => {
				if (!previousSession || previousSession.id !== sessionId) {
					return previousSession;
				}

				if (previousSession.state.status !== "running") {
					return previousSession;
				}

				const nextElapsedSeconds = Math.min(totalSeconds, previousSession.state.elapsedSeconds + 1);
				const nextCheckpoint = previousSession.checkpoints[previousSession.state.nextCheckpointIndex] ?? null;
				const reachedCheckpoint = Boolean(nextCheckpoint && nextElapsedSeconds >= nextCheckpoint.second);
				const reachedEnd = nextElapsedSeconds >= totalSeconds;
				const nextStatus = reachedCheckpoint || reachedEnd ? "paused" : "running";

				if (previousSession.state.elapsedSeconds === nextElapsedSeconds && previousSession.state.status === nextStatus) {
					return previousSession;
				}

				return {
					...previousSession,
					state: {
						...previousSession.state,
						status: nextStatus,
						elapsedSeconds: nextElapsedSeconds,
					},
				};
			});
		};

		const intervalId = window.setInterval(tick, 1000);

		return () => window.clearInterval(intervalId);
	}, [config, session, sessionId, setSession, totalSeconds]);

	useEffect(() => {
		if (!session || session.state.status !== "running") {
			return;
		}

		const nextImagePhase = Math.floor(session.state.elapsedSeconds / imageStepSeconds);

		if (skipNextImageAdvanceRef.current) {
			skipNextImageAdvanceRef.current = false;
			imagePhaseRef.current = nextImagePhase;
			return;
		}

		if (nextImagePhase !== imagePhaseRef.current) {
			imagePhaseRef.current = nextImagePhase;
			setCurrentImage(stimulusService.getNextImage());
		}
	}, [imageStepSeconds, session, stimulusService]);

	useEffect(() => {
		if (!session || session.state.status !== "finished" || completedRef.current) {
			return;
		}

		completedRef.current = true;
		navigate("/cue-exposure/summary", { replace: true });
	}, [navigate, session]);

	useEffect(() => {
		if (!isCravingPromptVisible) {
			setCravingValue(null);
		}
	}, [isCravingPromptVisible]);

	function handleCancelSession(): void {
		setIsCancelDialogOpen(false);
		clearSession();
		navigate("/reconecta", { replace: true });
	}

	function handleCravingContinue(): void {
		if (!session || cravingValue === null || !config) {
			return;
		}

		const recordedAt = new Date().toISOString();

		setSession((previousSession) => {
			if (!previousSession || previousSession.id !== session.id) {
				return previousSession;
			}

			const isFinalRecord = previousSession.state.elapsedSeconds >= totalSeconds;
			if (!isFinalRecord) {
				skipNextImageAdvanceRef.current = true;
			}

			const checkpoint = previousSession.checkpoints[previousSession.state.nextCheckpointIndex] ?? null;

			const cravingRecords = previousSession.cravingRecords.map((record) => {
				if (isFinalRecord && record.type === "final") {
					return {
						...record,
						value: cravingValue,
						relativeSecond: previousSession.state.elapsedSeconds,
						recordedAt,
					};
				}

				if (!isFinalRecord && checkpoint && record.type === "intermediate" && record.checkpointSecond === checkpoint.second) {
					return {
						...record,
						value: cravingValue,
						relativeSecond: previousSession.state.elapsedSeconds,
						recordedAt,
					};
				}

				return record;
			});

			const checkpoints = previousSession.checkpoints.map((item, index) =>
				!isFinalRecord && checkpoint && index === previousSession.state.nextCheckpointIndex
					? {
						...item,
						isCompleted: true,
					}
					: item,
			);

			const sessionWithRecords: CueExposureSessionState = {
				...previousSession,
				finishedAt: isFinalRecord ? recordedAt : previousSession.finishedAt,
				checkpoints,
				cravingRecords,
				state: {
					...previousSession.state,
					status: isFinalRecord ? "finished" : "running",
					nextCheckpointIndex: isFinalRecord
						? previousSession.state.nextCheckpointIndex
						: previousSession.state.nextCheckpointIndex + 1,
				},
				result: {
					...previousSession.result,
					finalCraving: isFinalRecord ? cravingValue : previousSession.result.finalCraving,
				},
			};

			const stats = getIntermediateStats(sessionWithRecords);

			return {
				...sessionWithRecords,
				result: {
					...sessionWithRecords.result,
					averageIntermediateCraving: stats.averageIntermediateCraving,
					intermediateRecordsCompleted: stats.intermediateRecordsCompleted,
				},
			};
		});
	}

	if (!session || !config) {
		return <Navigate to="/cue-exposure" replace />;
	}

	const remainingTimeLabel = formatRemainingTime(remainingSeconds);
	const cravingQuestion = isFinalPrompt
		? "¿Qué intensidad tiene en este momento tu deseo de consumir?"
		: "¿Qué intensidad tiene en este momento tu deseo de consumir?";

	return (
		<Box
			sx={{
				bgcolor: "#FFFFFF",
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				py: { xs: 2, sm: 3 },
			}}
		>
			<Container
				maxWidth={false}
				sx={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
					justifyContent: isCravingPromptVisible ? "center" : "flex-start",
				}}
			>
				{isCravingPromptVisible ? (
					<Container maxWidth="sm">
						<CravingDialog
							question={cravingQuestion}
							value={cravingValue}
							onChange={setCravingValue}
							onContinue={handleCravingContinue}
						/>
					</Container>
				) : (
					<Stack spacing={2} sx={{ height: "100%" }}>
						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.75 }}>
							<Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main", fontSize: { xs: "1.8rem", sm: "2.125rem" } }}>
								Reconecta
							</Typography>
							<Typography variant="subtitle1" sx={{ color: "text.secondary", fontSize: { xs: "1rem", sm: "1.125rem" } }}>
								Cue Exposure
							</Typography>
						</Box>

						<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, px: { xs: 0.5, sm: 1 } }}>
							<Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
								Tiempo restante
							</Typography>
							<Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
								{remainingTimeLabel}
							</Typography>
						</Box>

						<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
							<IconButton
								onClick={() => setIsCancelDialogOpen(true)}
								aria-label="Cancelar sesión"
								sx={{
									width: 56,
									height: 56,
									p: 1.5,
									color: "error.main",
									border: 1,
									borderColor: "error.main",
									bgcolor: "rgba(211, 47, 47, 0.06)",
									"&:hover": {
										bgcolor: "rgba(211, 47, 47, 0.12)",
									},
								}}
							>
								<CloseRoundedIcon sx={{ fontSize: 24 }} />
							</IconButton>
						</Box>

						{currentImage ? <ImageViewer src={currentImage} fadeMs={cueExposureConfig.imageFadeMs} /> : null}
					</Stack>
				)}
			</Container>

			<Dialog open={isCancelDialogOpen} onClose={() => setIsCancelDialogOpen(false)} fullWidth maxWidth="xs">
				<DialogTitle sx={{ fontWeight: 700 }}>Cancelar sesión</DialogTitle>
				<DialogContent>
					<Typography sx={{ color: "text.primary", mb: 1.5 }}>
						¿Desea cancelar la sesión?
					</Typography>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						La información registrada hasta este momento se perderá.
					</Typography>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 2.5 }}>
					<Button onClick={() => setIsCancelDialogOpen(false)} variant="outlined">
						Continuar sesión
					</Button>
					<Button onClick={handleCancelSession} variant="contained" color="error">
						Cancelar sesión
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default CueExposureSession;