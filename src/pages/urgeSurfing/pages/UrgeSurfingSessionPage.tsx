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
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import CravingScale from "../../../components/common/CravingScale";
import SessionPromptCard from "../../../components/common/SessionPromptCard";
import { saveUrgeSurfingResult } from "../../../services/urgeSurfingStorage";
import { SessionEngine } from "../engine/SessionEngine";
import { SESSION_TIMELINE_EVENT_TYPES } from "../types/SessionTimeline";
import type { UrgeSurfingSessionContext } from "../types/SessionContext";
import type { IntermediateCravingRecord, SessionResult } from "../types/SessionResult";

function isSessionNavigationState(value: unknown): value is UrgeSurfingSessionContext {
	if (!value || typeof value !== "object") {
		return false;
	}

	const state = value as Partial<UrgeSurfingSessionContext>;
	const config = state.sessionConfig;
	const plan = state.sessionPlan;

	return Boolean(
		typeof state.expediente === "string" &&
		config &&
			typeof config.durationMinutes === "number" &&
			typeof config.initialCraving === "number" &&
			(config.intermediateRecordFrequency === "none" ||
				config.intermediateRecordFrequency === "25" ||
				config.intermediateRecordFrequency === "33" ||
				config.intermediateRecordFrequency === "50") &&
			(config.cardAdvanceMode === "automatic" || config.cardAdvanceMode === "manual") &&
			plan &&
			typeof plan.totalDurationSeconds === "number" &&
			Array.isArray(plan.cards) &&
			Array.isArray(plan.timeline) &&
			(state.cardAdvanceMode === "automatic" || state.cardAdvanceMode === "manual"),
	);
}

function formatRemainingTime(totalDurationSeconds: number, elapsedSeconds: number): string {
	const remainingSeconds = Math.max(totalDurationSeconds - elapsedSeconds, 0);
	const minutes = Math.floor(remainingSeconds / 60);
	const seconds = remainingSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function UrgeSurfingSessionPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [elapsedSeconds, setElapsedSeconds] = useState(0);
	const [activeCardId, setActiveCardId] = useState<string | null>(null);
	const [activeCardVisibleSinceSecond, setActiveCardVisibleSinceSecond] = useState<number | null>(null);
	const [manualCardQueue, setManualCardQueue] = useState<string[]>([]);
	const [intermediateRecords, setIntermediateRecords] = useState<IntermediateCravingRecord[]>([]);
	const [pendingAssessmentSeconds, setPendingAssessmentSeconds] = useState<number[]>([]);
	const [isFinalCravingDialogOpen, setIsFinalCravingDialogOpen] = useState(false);
	const [sessionStartedAt, setSessionStartedAt] = useState<Date | null>(null);
	const [sessionEndedAt, setSessionEndedAt] = useState<Date | null>(null);
	const [sessionDurationSeconds, setSessionDurationSeconds] = useState<number | null>(null);
	const engineRef = useRef<SessionEngine | null>(null);
	const hasPersistedResultRef = useRef(false);

	if (!isSessionNavigationState(location.state)) {
		return <Navigate to="/urge-surfing" replace />;
	}

	const { sessionPlan } = location.state;
	const isManualMode = location.state.cardAdvanceMode === "manual";
	const activeCard = useMemo(
		() => sessionPlan.cards.find((card) => card.id === activeCardId) ?? null,
		[activeCardId, sessionPlan.cards],
	);
	const activeCardTitle = activeCard?.title ?? "";
	const activeCardText = activeCard?.text ?? "";
	const isNextEnabled = useMemo(() => {
		if (!isManualMode || !activeCard || activeCardVisibleSinceSecond === null) {
			return false;
		}

		if (manualCardQueue.length === 0) {
			return false;
		}

		return elapsedSeconds - activeCardVisibleSinceSecond >= sessionPlan.cardDurationSeconds;
	}, [activeCard, activeCardVisibleSinceSecond, elapsedSeconds, isManualMode, manualCardQueue.length, sessionPlan.cardDurationSeconds]);
	const totalAssessments = sessionPlan.assessmentTimes.length;
	const hasAssessments = totalAssessments > 0;
	const currentAssessmentNumber = useMemo(() => {
		if (!hasAssessments) {
			return 0;
		}

		return Math.min(intermediateRecords.length + 1, totalAssessments);
	}, [hasAssessments, intermediateRecords.length, totalAssessments]);
	const activeAssessmentSecond = pendingAssessmentSeconds[0] ?? null;
	const isAssessmentDialogOpen = activeAssessmentSecond !== null;

	function handleManualNext(): void {
		if (!isNextEnabled) {
			return;
		}

		setManualCardQueue((previousQueue) => {
			const [nextCardId, ...rest] = previousQueue;

			if (!nextCardId) {
				return previousQueue;
			}

			setActiveCardId(nextCardId);
			setActiveCardVisibleSinceSecond(elapsedSeconds);

			return rest;
		});
	}

	function handleAssessmentValueSelect(craving: number): void {
		setPendingAssessmentSeconds((previousPending) => {
			const [currentAssessmentSecond, ...rest] = previousPending;

			if (currentAssessmentSecond === undefined) {
				return previousPending;
			}

			setIntermediateRecords((previousRecords) => {
				if (previousRecords.some((record) => record.secondFromStart === currentAssessmentSecond)) {
					return previousRecords;
				}

				return [
					...previousRecords,
					{
						secondFromStart: currentAssessmentSecond,
						craving,
					},
				];
			});

			return rest;
		});
	}

	function handleConfirmCancelSession(): void {
		const engine = engineRef.current;

		if (engine) {
			engine.stop();
			engine.dispose();
			engineRef.current = null;
		}

		setIsCancelDialogOpen(false);
		navigate("/reconecta", { replace: true });
	}

	function handleFinalCravingValueSelect(finalCraving: number): void {
		if (!sessionEndedAt || sessionDurationSeconds === null) {
			return;
		}

		const startedAt = sessionStartedAt ?? new Date(sessionEndedAt.getTime() - sessionDurationSeconds * 1000);
		const sessionResult: SessionResult = {
			patientId: location.state.expediente,
			startedAt,
			endedAt: sessionEndedAt,
			durationMinutes: location.state.sessionConfig.durationMinutes,
			durationSeconds: sessionDurationSeconds,
			cardAdvanceMode: location.state.sessionConfig.cardAdvanceMode,
			intermediateRecordFrequency: location.state.sessionConfig.intermediateRecordFrequency,
			initialCraving: location.state.sessionConfig.initialCraving,
			intermediateRecords,
			finalCraving,
		};

		if (!hasPersistedResultRef.current) {
			hasPersistedResultRef.current = true;
			try {
				saveUrgeSurfingResult(sessionResult);
			} catch (error) {
				console.error("No se pudo guardar el resultado de Urge Surfing", error);
			}
		}

		setIsFinalCravingDialogOpen(false);
		navigate("/urge-surfing/summary", {
			state: sessionResult,
			replace: true,
		});
	}

	useEffect(() => {
		const engine = new SessionEngine(sessionPlan.timeline);
		engineRef.current = engine;
		setSessionStartedAt(new Date());

		const unsubscribeTick = engine.onTick((payload) => {
			setElapsedSeconds(payload.elapsedSeconds);
		});

		const unsubscribeTimelineEvent = engine.onTimelineEvent((event) => {
			if (event.type === SESSION_TIMELINE_EVENT_TYPES.ASSESSMENT) {
				setPendingAssessmentSeconds((previousPending) => {
					if (previousPending.includes(event.second)) {
						return previousPending;
					}

					return [...previousPending, event.second];
				});
				return;
			}

			if (event.type !== SESSION_TIMELINE_EVENT_TYPES.CARD) {
				return;
			}

			if (!isManualMode) {
				setActiveCardId(event.cardId);
				setActiveCardVisibleSinceSecond(event.second);
				return;
			}

			setActiveCardId((currentCardId) => {
				if (!currentCardId) {
					setActiveCardVisibleSinceSecond(event.second);
					return event.cardId;
				}

				setManualCardQueue((previousQueue) => {
					if (previousQueue.includes(event.cardId) || currentCardId === event.cardId) {
						return previousQueue;
					}

					return [...previousQueue, event.cardId];
				});

				return currentCardId;
			});
		});

		const unsubscribeFinish = engine.onFinish((payload) => {
			if (payload.reason !== "timeline-complete") {
				return;
			}

			setSessionDurationSeconds(payload.elapsedSeconds);
			setSessionEndedAt(new Date());
			setIsFinalCravingDialogOpen(true);
		});

		engine.start();

		return () => {
			unsubscribeFinish();
			unsubscribeTimelineEvent();
			unsubscribeTick();
			if (engineRef.current === engine) {
				engineRef.current = null;
			}
			engine.dispose();
		};
	}, [isManualMode, sessionPlan.timeline]);

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
					justifyContent: "flex-start",
				}}
			>
				<Stack spacing={2} sx={{ height: "100%" }}>
					<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 0.75 }}>
						<Typography
							variant="h4"
							component="h1"
							sx={{ fontWeight: 700, color: "primary.main", fontSize: { xs: "1.8rem", sm: "2.125rem" } }}
						>
							Urge Surfing
						</Typography>
					</Box>

					<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, px: { xs: 0.5, sm: 1 } }}>
						<Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
							Tiempo restante
						</Typography>
						<Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main" }}>
							{formatRemainingTime(sessionPlan.totalDurationSeconds, elapsedSeconds)}
						</Typography>
						{hasAssessments ? (
							<Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
								Registro {currentAssessmentNumber} de {totalAssessments}
							</Typography>
						) : null}
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

					<Box sx={{ flex: 1, minHeight: 0, display: "flex", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 2 } }}>
						<SessionPromptCard title={activeCardTitle} message={activeCardText} />
					</Box>

					{isManualMode ? (
						<Box sx={{ display: "flex", justifyContent: "center", pb: { xs: 1, sm: 1.5 } }}>
							<Button variant="contained" size="large" disabled={!isNextEnabled} onClick={handleManualNext} sx={{ minWidth: 180 }}>
								Siguiente
							</Button>
						</Box>
					) : null}
				</Stack>
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
					<Button onClick={handleConfirmCancelSession} variant="contained" color="error">
						Cancelar sesión
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={isAssessmentDialogOpen} fullWidth maxWidth="sm">
				<DialogTitle sx={{ fontWeight: 700 }}>Evaluación intermedia</DialogTitle>
				<DialogContent>
					<Stack spacing={2.5} sx={{ pt: 0.5 }}>
						<Typography sx={{ color: "text.primary" }}>¿Qué intensidad tiene ahora el deseo de consumir?</Typography>
						<CravingScale value={null} onChange={handleAssessmentValueSelect} />
					</Stack>
				</DialogContent>
			</Dialog>

			<Dialog open={isFinalCravingDialogOpen} fullWidth maxWidth="sm">
				<DialogTitle sx={{ fontWeight: 700 }}>Craving final</DialogTitle>
				<DialogContent>
					<Stack spacing={2.5} sx={{ pt: 0.5 }}>
						<Typography sx={{ color: "text.primary" }}>¿Qué intensidad tiene ahora el deseo de consumir?</Typography>
						<CravingScale value={null} onChange={handleFinalCravingValueSelect} />
					</Stack>
				</DialogContent>
			</Dialog>
		</Box>
	);
}

export default UrgeSurfingSessionPage;
