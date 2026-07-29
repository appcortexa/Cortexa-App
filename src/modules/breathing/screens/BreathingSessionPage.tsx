import { useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Button, Container, IconButton, Stack, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ModuleHeader from "../../../components/common/ModuleHeader";
import SessionCancelConfirmationDialog from "../../../components/common/SessionCancelConfirmationDialog";
import SessionConfigurationCard from "../../mindfulness/components/SessionConfigurationCard";
import SessionHeader from "../../mindfulness/components/session/SessionHeader";
import AssessmentPanel from "../components/AssessmentPanel";
import BreathingAnimator from "../components/BreathingAnimator";
import type { BreathingSessionContext } from "../models/BreathingSessionContext";
import type { BreathingSessionViewModel } from "../models/BreathingSessionViewModel";
import { BREATHING_SESSION_RUNTIME_STATUSES } from "../services/BreathingSessionRuntime";
import {
	getPreparedBreathingSessionContext,
	resetPreparedBreathingSessionContext,
} from "../services/preparedBreathingSessionContext";
import { buildBreathingSessionSummaryViewModel } from "../services/SessionSummaryBuilder";
import type { SaveBreathingSessionInput } from "../services/breathingStorageService";
import {
	BreathingSessionPresenter,
	buildBreathingSessionViewModel,
} from "../services/BreathingSessionPresenter";

function isBreathingSessionContext(value: unknown): value is BreathingSessionContext {
	if (!value || typeof value !== "object") {
		return false;
	}

	const state = value as Partial<BreathingSessionContext>;
	const config = state.config;
	const timeline = state.timeline;
	const cursor = state.cursor;
	const runtime = state.runtime;
	const conductor = state.conductor;
	const sessionDataCollector = state.sessionDataCollector;

	return Boolean(
		config &&
			typeof config.expediente === "string" &&
			typeof config.durationMinutes === "number" &&
			config.pattern &&
			typeof config.pattern.name === "string" &&
		timeline &&
			typeof timeline.durationMs === "number" &&
			Array.isArray(timeline.timelineEvents) &&
		cursor &&
			typeof cursor.current === "function" &&
			typeof cursor.getIndex === "function" &&
		runtime &&
			typeof runtime.getSnapshot === "function" &&
			typeof runtime.getTimeline === "function" &&
			runtime.clock &&
			typeof runtime.clock.isRunning === "function" &&
		conductor &&
			typeof conductor.getVisualState === "function" &&
		sessionDataCollector &&
			typeof sessionDataCollector.getSnapshot === "function" &&
			typeof sessionDataCollector.recordIntermediateAssessment === "function",
	);
}

function BreathingSessionPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [sessionContext] = useState<BreathingSessionContext | null>(() => {
		const preparedContext = getPreparedBreathingSessionContext();

		if (preparedContext !== null) {
			return preparedContext;
		}

		return isBreathingSessionContext(location.state) ? location.state : null;
	});
	const [presenter] = useState(() =>
		sessionContext === null ? null : new BreathingSessionPresenter(sessionContext),
	);
	const [viewModel, setViewModel] = useState<BreathingSessionViewModel | null>(() =>
		sessionContext === null ? null : buildBreathingSessionViewModel(sessionContext),
	);
	const [manualAssessmentEventId, setManualAssessmentEventId] = useState<string | null>(null);
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const hasNavigatedToSummaryRef = useRef(false);

	useEffect(() => {
		if (presenter === null) {
			return;
		}

		const handlePresenterChange = () => {
			setViewModel(presenter.getViewModel());
		};

		presenter.subscribe(handlePresenterChange);
		return () => presenter.unsubscribe(handlePresenterChange);
	}, [presenter]);

	useEffect(() => {
		if (sessionContext === null || viewModel === null) {
			return;
		}

		if (
			viewModel.runtimeStatus === BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED ||
			viewModel.runtimeStatus === BREATHING_SESSION_RUNTIME_STATUSES.CANCELLED
		) {
			sessionContext.sessionDataCollector.markSessionFinished();
		}
	}, [sessionContext, viewModel]);

	useEffect(() => {
		if (sessionContext === null || viewModel === null || hasNavigatedToSummaryRef.current) {
			return;
		}

		if (viewModel.runtimeStatus !== BREATHING_SESSION_RUNTIME_STATUSES.COMPLETED) {
			return;
		}

		hasNavigatedToSummaryRef.current = true;
		const variableLabelsByKey = Object.fromEntries(
			sessionContext.config.assessmentVariables.map((variable) => [variable.key, variable.label]),
		);
		const summaryViewModel = buildBreathingSessionSummaryViewModel(
			sessionContext.sessionDataCollector,
			{ variableLabelsByKey },
		);
		const collectedData = sessionContext.sessionDataCollector.getSnapshot();
		const saveSessionInput: SaveBreathingSessionInput = {
			sessionId: collectedData.timestamps.createdAt,
			expediente: sessionContext.config.expediente,
			summary: summaryViewModel,
			collectedData,
		};

		navigate("/breathing/summary", {
			state: {
				summaryViewModel,
				saveSessionInput,
				source: "session",
			},
		});
	}, [navigate, sessionContext, viewModel]);

	if (sessionContext === null || presenter === null || viewModel === null) {
		return <Navigate to="/breathing" replace />;
	}

	const visualState = sessionContext.conductor.getVisualState();
	const canPauseSession = viewModel.runtimeStatus === BREATHING_SESSION_RUNTIME_STATUSES.RUNNING;
	const isAssessmentPanelVisible =
		viewModel.runtimeStatus === BREATHING_SESSION_RUNTIME_STATUSES.ASSESSMENT_PAUSED &&
		manualAssessmentEventId !== null;

	function handleBeginSession(): void {
		if (sessionContext === null || presenter === null) {
			return;
		}

		presenter.startSession();
		sessionContext.sessionDataCollector.markSessionStarted();
		setViewModel(presenter.getViewModel());
	}

	function handlePauseSession(): void {
		if (sessionContext === null || presenter === null) {
			return;
		}

		setManualAssessmentEventId(`manual-${Date.now()}-${sessionContext.runtime.getSnapshot().currentEventIndex}`);
		sessionContext.runtime.pauseForAssessment();
		setViewModel(presenter.getViewModel());
	}

	function handleAssessmentCompleted(): void {
		if (sessionContext === null || presenter === null) {
			return;
		}

		sessionContext.runtime.resumeAfterAssessment();
		setManualAssessmentEventId(null);
		setViewModel(presenter.getViewModel());
	}

	function handleCancelSessionClick(): void {
		setIsCancelDialogOpen(true);
	}

	function handleCloseCancelDialog(): void {
		setIsCancelDialogOpen(false);
	}

	function handleConfirmCancelSession(): void {
		if (sessionContext === null) {
			return;
		}

		sessionContext.runtime.cancelSession();
		resetPreparedBreathingSessionContext();
		setIsCancelDialogOpen(false);
		navigate("/reconecta", { replace: true });
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
						title="Sesión clínica preparada"
					/>

					<SessionHeader remainingMs={viewModel.remainingMs} durationMs={viewModel.durationMs} />

					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<IconButton
							onClick={handleCancelSessionClick}
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

					<SessionConfigurationCard title="Animación respiratoria">
						<Typography variant="body2" color="text.secondary">
							Visualización basada en el estado clínico actual.
						</Typography>
						<Box sx={{ minHeight: { xs: 280, sm: 320 }, display: "flex", alignItems: "center" }}>
							<BreathingAnimator visualState={visualState} />
						</Box>
					</SessionConfigurationCard>

					<SessionConfigurationCard title={viewModel.currentPhase}>
						<Box
							sx={{
								minHeight: { xs: 72, sm: 80 },
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								textAlign: "center",
							}}
						>
							<Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.4 }}>
								{viewModel.instructionText}
							</Typography>
						</Box>
					</SessionConfigurationCard>

					{isAssessmentPanelVisible ? (
						<AssessmentPanel
							variables={sessionContext.config.assessmentVariables}
							sessionDataCollector={sessionContext.sessionDataCollector}
							assessmentEventId={manualAssessmentEventId}
							onAssessmentCompleted={handleAssessmentCompleted}
						/>
					) : null}

					<Button
						fullWidth
						variant="contained"
						disabled={!viewModel.canBeginSession || isAssessmentPanelVisible}
						onClick={handleBeginSession}
					>
						{viewModel.beginSessionLabel}
					</Button>

					<Button
						fullWidth
						variant="contained"
						color="warning"
						disabled={!canPauseSession || isAssessmentPanelVisible}
						onClick={handlePauseSession}
					>
						Pausar sesión
					</Button>


					<SessionCancelConfirmationDialog
						open={isCancelDialogOpen}
						onClose={handleCloseCancelDialog}
						onConfirmCancel={handleConfirmCancelSession}
						message="¿Desea cancelar la sesión?"
						secondaryMessage="La información registrada hasta este momento se perderá."
					/>
				</Stack>
			</Container>
		</Box>
	);
}

export default BreathingSessionPage;
