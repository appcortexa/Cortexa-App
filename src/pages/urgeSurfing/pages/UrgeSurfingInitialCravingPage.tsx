import { useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import CravingScale from "../../../components/common/CravingScale";
import { SessionPlanner } from "../engine/SessionPlanner";
import type { SessionConfig } from "../types/SessionConfig";
import type { UrgeSurfingPreparationState, UrgeSurfingSessionContext } from "../types/SessionContext";

function isPreparationState(value: unknown): value is UrgeSurfingPreparationState {
	if (!value || typeof value !== "object") {
		return false;
	}

	const state = value as Partial<UrgeSurfingPreparationState>;
	const durationMinutes = state.durationMinutes;

	return (
		typeof state.expediente === "string" &&
		typeof durationMinutes === "number" &&
		Number.isInteger(durationMinutes) &&
		durationMinutes >= 1 &&
		durationMinutes <= 20 &&
		(state.intermediateRecordFrequency === "none" ||
			state.intermediateRecordFrequency === "25" ||
			state.intermediateRecordFrequency === "33" ||
			state.intermediateRecordFrequency === "50") &&
		(state.cardAdvanceMode === "automatic" || state.cardAdvanceMode === "manual")
	);
}

function UrgeSurfingInitialCravingPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const [cravingInitial, setCravingInitial] = useState<number | null>(null);

	if (!isPreparationState(location.state)) {
		return <Navigate to="/urge-surfing" replace />;
	}

	const { durationMinutes, intermediateRecordFrequency, cardAdvanceMode } = location.state;
	const isStartDisabled = cravingInitial === null;

	function handleStartSession(): void {
		if (cravingInitial === null) {
			return;
		}

		const sessionConfig: SessionConfig = {
			durationMinutes,
			initialCraving: cravingInitial,
			intermediateRecordFrequency,
			cardAdvanceMode,
		};

		const planner = new SessionPlanner();
		const sessionPlan = planner.planCheckpoints(sessionConfig);
		const sessionContext: UrgeSurfingSessionContext = {
			expediente: location.state.expediente,
			sessionConfig,
			sessionPlan,
			cardAdvanceMode,
		};

		navigate("/urge-surfing/session", {
			state: sessionContext,
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
				<Stack spacing={3}>
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
							Craving inicial
						</Typography>
					</Box>

					<CravingScale value={cravingInitial} onChange={setCravingInitial} />

					<Button fullWidth variant="contained" size="large" disabled={isStartDisabled} onClick={handleStartSession}>
						Iniciar sesión
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default UrgeSurfingInitialCravingPage;