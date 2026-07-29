import { Box, Container, Stack } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

import ModuleHeader from "../../../components/common/ModuleHeader";
import MindfulnessAssessmentForm from "../components/session/MindfulnessAssessmentForm";
import type { MindfulnessAssessmentValue } from "../models/MindfulnessAssessment";
import {
	getPreparedMindfulnessSession,
	type MindfulnessSessionRuntime,
} from "../services/mindfulnessSessionRuntime";

function MindfulnessFinalAssessmentPage() {
	const navigate = useNavigate();
	const runtime: MindfulnessSessionRuntime | null = getPreparedMindfulnessSession();
	const sessionRuntime = runtime;

	if (sessionRuntime === null) {
		return <Navigate to="/mindfulness" replace />;
	}

	if (sessionRuntime.config.enabledVariables.length === 0) {
		return <Navigate to="/mindfulness/summary" replace />;
	}

	if (sessionRuntime.finalAssessment !== null) {
		return <Navigate to="/mindfulness/summary" replace />;
	}

	function handleSubmitFinalAssessment(values: readonly MindfulnessAssessmentValue[]): void {
		if (sessionRuntime === null) {
			return;
		}

		sessionRuntime.submitFinalAssessment(values);
		navigate("/mindfulness/summary", { replace: true });
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
					<ModuleHeader moduleName="Mindfulness" title="Registro final de variables" />
					<MindfulnessAssessmentForm
						title="Variables finales"
						description="Registra los valores obtenidos al finalizar la práctica."
						variables={sessionRuntime.config.enabledVariables}
						submitLabel="Ver resumen"
						onSubmit={handleSubmitFinalAssessment}
					/>
				</Stack>
			</Container>
		</Box>
	);
}

export default MindfulnessFinalAssessmentPage;