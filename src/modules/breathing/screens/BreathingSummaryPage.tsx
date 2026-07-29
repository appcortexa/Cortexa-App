import { useEffect, useRef } from "react";
import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ModuleHeader from "../../../components/common/ModuleHeader";
import SessionConfigurationCard from "../../mindfulness/components/SessionConfigurationCard";
import SummaryValueList from "../../mindfulness/components/session/SummaryValueList";
import type {
	BreathingSessionSummaryFieldViewModel,
	BreathingSessionSummaryViewModel,
} from "../models/BreathingSessionSummaryViewModel";
import {
	breathingStorageService,
	type SaveBreathingSessionInput,
} from "../services/breathingStorageService";

type BreathingSummaryNavigationState = {
	summaryViewModel?: BreathingSessionSummaryViewModel;
	saveSessionInput?: SaveBreathingSessionInput;
	source?: "session" | "history";
};

const GENERAL_DETAIL_LABELS = [
	"Expediente",
	"Patrón respiratorio",
	"Duración",
	"Variables de evaluación",
] as const;

function isSummaryField(value: unknown): value is BreathingSessionSummaryFieldViewModel {
	if (!value || typeof value !== "object") {
		return false;
	}

	const field = value as Partial<BreathingSessionSummaryFieldViewModel>;
	return typeof field.label === "string" && typeof field.value === "string";
}

function isBreathingSessionSummaryViewModel(value: unknown): value is BreathingSessionSummaryViewModel {
	if (!value || typeof value !== "object") {
		return false;
	}

	const model = value as Partial<BreathingSessionSummaryViewModel>;
	return (
		Array.isArray(model.details) &&
		Array.isArray(model.initialVariables) &&
		Array.isArray(model.intermediateAssessments) &&
		Array.isArray(model.finalVariables) &&
		model.details.every(isSummaryField)
	);
}

function isSaveBreathingSessionInput(value: unknown): value is SaveBreathingSessionInput {
	if (!value || typeof value !== "object") {
		return false;
	}

	const input = value as Partial<SaveBreathingSessionInput>;

	return (
		typeof input.sessionId === "string" &&
		typeof input.expediente === "string" &&
		input.summary !== undefined &&
		input.collectedData !== undefined
	);
}

function filterDetailsByLabel(
	details: readonly BreathingSessionSummaryFieldViewModel[],
	allowedLabels: readonly string[],
): BreathingSessionSummaryFieldViewModel[] {
	return details.filter((detail) => allowedLabels.includes(detail.label));
}

function formatIntermediateAssessmentTitle(title: string): string {
	return title.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function BreathingSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const hasPersistedSessionRef = useRef(false);
	const navigationState = location.state as BreathingSummaryNavigationState | null;
	const summaryViewModel = isBreathingSessionSummaryViewModel(navigationState?.summaryViewModel)
		? navigationState.summaryViewModel
		: null;
	const saveSessionInput = isSaveBreathingSessionInput(navigationState?.saveSessionInput)
		? navigationState.saveSessionInput
		: null;
	const isHistoryView = navigationState?.source === "history";

	useEffect(() => {
		if (isHistoryView || saveSessionInput === null || hasPersistedSessionRef.current) {
			return;
		}

		hasPersistedSessionRef.current = true;

		try {
			breathingStorageService.saveSession(saveSessionInput);
		} catch (error) {
			console.error("No se pudo guardar el resultado de Respiración Diafragmática", error);
		}
	}, [isHistoryView, saveSessionInput]);

	if (summaryViewModel === null) {
		return <Navigate to="/breathing" replace />;
	}

	const generalDetails = filterDetailsByLabel(summaryViewModel.details, GENERAL_DETAIL_LABELS);

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
						title="Resumen de la sesión"
					/>

					<SessionConfigurationCard title="Información general">
						<SummaryValueList items={generalDetails} emptyMessage="Sin información general disponible." />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Evaluaciones intermedias">
						{summaryViewModel.intermediateAssessments.length === 0 ? (
							<Typography sx={{ color: "text.secondary" }}>
								No se realizaron evaluaciones intermedias.
							</Typography>
						) : (
							<Stack spacing={2.5} divider={<Divider flexItem />}>
								{summaryViewModel.intermediateAssessments.map((assessment, index) => (
									<Stack key={`${assessment.title}-${index}`} spacing={1.5}>
										<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
											{formatIntermediateAssessmentTitle(assessment.title)}
										</Typography>
										<SummaryValueList
											items={assessment.values}
											emptyMessage="Sin valores registrados."
										/>
									</Stack>
								))}
							</Stack>
						)}
					</SessionConfigurationCard>

					<Button fullWidth variant="contained" onClick={() => navigate("/breathing", { replace: true })}>
						{isHistoryView ? "Regresar" : "Finalizar"}
					</Button>
					{isHistoryView ? null : (
						<Button fullWidth variant="outlined" color="secondary" onClick={() => navigate("/breathing/session")}>
							Volver a sesión
						</Button>
					)}
				</Stack>
			</Container>
		</Box>
	);
}

export default BreathingSummaryPage;
