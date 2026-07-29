import { useEffect, useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

import ModuleHeader from "../../../components/common/ModuleHeader";
import { SESSION_STATES } from "../engine/state/SessionState";
import {
	getPreparedMindfulnessSession,
	resetPreparedMindfulnessSession,
	type MindfulnessSessionRuntime,
} from "../services/mindfulnessSessionRuntime";
import { useMindfulnessSessionRuntime } from "../hooks/useMindfulnessSessionRuntime";
import SessionHeader from "../components/session/SessionHeader";
import PromptViewer from "../components/session/PromptViewer";
import SessionControls from "../components/session/SessionControls";
import AssessmentDialog from "../components/session/AssessmentDialog";
import { SESSION_MODES } from "../models/mindfulness.models";
import SessionCancelConfirmationDialog from "../../../components/common/SessionCancelConfirmationDialog";

function MindfulnessSessionPage() {
	const navigate = useNavigate();
	const [runtime] = useState<MindfulnessSessionRuntime | null>(() => getPreparedMindfulnessSession());
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

	const sessionRuntime = runtime;
	const sessionRuntimeState = sessionRuntime?.engine.getState() ?? SESSION_STATES.IDLE;
	const requiresInitialAssessment =
		sessionRuntime !== null &&
		sessionRuntime.config.enabledVariables.length > 0 &&
		sessionRuntime.initialAssessment === null;
	const {
		remainingMs,
		durationMs,
		isComplete,
		isPaused,
		pendingAssessment,
		promptViewModel,
		handleSubmitAssessment,
		handleTogglePauseResume,
		nextPrompt,
		handleFinishSession,
	} =
		useMindfulnessSessionRuntime(sessionRuntime);

	useEffect(() => {
		if (!sessionRuntime || !isComplete) {
			return;
		}

		navigate(
			sessionRuntime.config.enabledVariables.length > 0
				? "/mindfulness/final-assessment"
				: "/mindfulness/summary",
			{ replace: true },
		);
	}, [isComplete, navigate, sessionRuntime]);

	if (sessionRuntime === null) {
		return <Navigate to="/mindfulness" replace />;
	}

	if (requiresInitialAssessment) {
		return <Navigate to="/mindfulness/initial-assessment" replace />;
	}

	function handleCancelSessionClick(): void {
		setIsCancelDialogOpen(true);
	}

	function handleCloseCancelDialog(): void {
		setIsCancelDialogOpen(false);
	}

	function handleConfirmCancelSession(): void {
		setIsCancelDialogOpen(false);
		resetPreparedMindfulnessSession();
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
			<Container maxWidth={false}>
				<Stack spacing={3.5}>
					<Box sx={{ width: "100%", maxWidth: 600, alignSelf: "center" }}>
						<ModuleHeader moduleName="Mindfulness" title="Sesión en ejecución" />
					</Box>
					<Box sx={{ width: "100%", maxWidth: 600, alignSelf: "center" }}>
						<SessionHeader remainingMs={remainingMs} durationMs={durationMs} />
					</Box>
					<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", px: { xs: 1, sm: 2 } }}>
						<PromptViewer viewModel={promptViewModel} />
					</Box>
					<Box sx={{ width: "100%", maxWidth: 600, alignSelf: "center" }}>
						<SessionControls
							isPaused={isPaused || sessionRuntimeState === SESSION_STATES.PAUSED}
							isDisabled={isComplete || pendingAssessment !== null}
							showNextPrompt={
								sessionRuntime.config.sessionMode === SESSION_MODES.MANUAL &&
								(sessionRuntimeState === SESSION_STATES.RUNNING ||
									sessionRuntimeState === SESSION_STATES.PAUSED)
							}
							onCancelSession={handleCancelSessionClick}
							onTogglePauseResume={handleTogglePauseResume}
							onNextPrompt={nextPrompt}
							onFinishSession={handleFinishSession}
						/>
					</Box>
					<AssessmentDialog
						key={pendingAssessment?.eventId ?? "no-assessment"}
						assessment={pendingAssessment}
						onConfirm={handleSubmitAssessment}
					/>
					<SessionCancelConfirmationDialog
						open={isCancelDialogOpen}
						onClose={handleCloseCancelDialog}
						onConfirmCancel={handleConfirmCancelSession}
					/>
				</Stack>
			</Container>
		</Box>
	);
}

export default MindfulnessSessionPage;
