import { Box, Container, Stack } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

import ModuleHeader from "../../../components/common/ModuleHeader";
import MindfulnessAssessmentForm from "../components/session/MindfulnessAssessmentForm";
import type { MindfulnessAssessmentValue } from "../models/MindfulnessAssessment";
import {
	getPreparedMindfulnessSession,
	type MindfulnessSessionRuntime,
} from "../services/mindfulnessSessionRuntime";

function MindfulnessInitialAssessmentPage() {
	const navigate = useNavigate();
	const runtime: MindfulnessSessionRuntime | null = getPreparedMindfulnessSession();
	const sessionRuntime = runtime;

	if (sessionRuntime === null) {
		return <Navigate to="/mindfulness" replace />;
	}

	if (sessionRuntime.config.enabledVariables.length === 0) {
		return <Navigate to="/mindfulness/session" replace />;
	}

	if (sessionRuntime.initialAssessment !== null) {
		return <Navigate to="/mindfulness/session" replace />;
	}

	function handleSubmitInitialAssessment(values: readonly MindfulnessAssessmentValue[]): void {
		if (sessionRuntime === null) {
			return;
		}

		sessionRuntime.submitInitialAssessment(values);
		navigate("/mindfulness/session", { replace: true });
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
					<ModuleHeader moduleName="Mindfulness" title="Registro inicial de variables" />
					<MindfulnessAssessmentForm
						title="Variables iniciales"
						description="Registra los valores iniciales configurados antes de iniciar la práctica."
						variables={sessionRuntime.config.enabledVariables}
						submitLabel="Iniciar sesión"
						onSubmit={handleSubmitInitialAssessment}
					/>
				</Stack>
			</Container>
		</Box>
	);
}

export default MindfulnessInitialAssessmentPage;