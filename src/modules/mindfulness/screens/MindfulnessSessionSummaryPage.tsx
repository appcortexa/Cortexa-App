import { useEffect, useMemo, useRef } from "react";
import { Box, Container, Divider, Stack, Button, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ModuleHeader from "../../../components/common/ModuleHeader";
import SessionConfigurationCard from "../components/SessionConfigurationCard";
import SummaryValueList from "../components/session/SummaryValueList";
import type { MindfulnessSessionSummaryFieldViewModel } from "../models/MindfulnessSessionSummaryViewModel";
import {
	saveMindfulnessResult,
	type MindfulnessStoredResult,
} from "../../../services/mindfulnessStorage";
import type { MindfulnessSessionRuntime } from "../services/mindfulnessSessionRuntime";
import {
	buildMindfulnessSessionSummaryViewModel,
	getPreparedMindfulnessSession,
	resetPreparedMindfulnessSession,
} from "../services/mindfulnessSessionRuntime";

function formatSessionDateTime(isoValue: string): string {
	const parsed = new Date(isoValue);
	if (Number.isNaN(parsed.getTime())) {
		return "Sin registro";
	}

	return new Intl.DateTimeFormat("es-MX", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(parsed);
}

function formatDuration(durationMinutes: number): string {
	return `${durationMinutes} minuto${durationMinutes === 1 ? "" : "s"}`;
}

function formatDurationFromMs(durationMs: number): string {
	const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatPracticeLabel(practice: MindfulnessSessionRuntime["config"]["practice"]): string {
	if (practice === "BREATH") {
		return "Respiración consciente";
	}

	if (practice === "BODY_SCAN") {
		return "Escaneo corporal";
	}

	if (practice === "THOUGHTS") {
		return "Observación de pensamientos";
	}

	if (practice === "EMOTIONS") {
		return "Observación de emociones";
	}

	if (practice === "CRAVING") {
		return "Surf del craving";
	}

	return "Atención en los sentidos";
}

function formatFrequencyLabel(frequency: MindfulnessSessionRuntime["config"]["assessmentFrequency"]): string {
	if (frequency === "PERCENT_25") {
		return "Cada 25 %";
	}

	if (frequency === "PERCENT_33") {
		return "Cada 33 %";
	}

	if (frequency === "PERCENT_50") {
		return "Cada 50 %";
	}

	return "Sin registros";
}

function formatVariableLabel(variable: MindfulnessSessionRuntime["config"]["enabledVariables"][number]): string {
	if (variable === "CRAVING") {
		return "Craving";
	}

	if (variable === "ANXIETY") {
		return "Ansiedad";
	}

	return "Tensión emocional";
}

function MindfulnessSessionSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const hasPersistedResultRef = useRef(false);
	const navigationState = location.state as { result?: MindfulnessStoredResult } | undefined;
	const storedResult = navigationState?.result ?? null;
	const runtime: MindfulnessSessionRuntime | null = getPreparedMindfulnessSession();
	const isHistoryView = storedResult !== null;
	const shouldRedirectToHome = !isHistoryView && runtime === null;
	const shouldRedirectToFinalAssessment =
		!isHistoryView &&
		runtime !== null &&
		runtime.config.enabledVariables.length > 0 &&
		runtime.finalAssessment === null;
	const runtimeViewModel = runtime ? buildMindfulnessSessionSummaryViewModel(runtime) : null;
	const viewModel = storedResult ? storedResult.summary : runtimeViewModel;

	const informationItems: MindfulnessSessionSummaryFieldViewModel[] = storedResult
		? [
				{ label: "Expediente", value: storedResult.expediente },
				{ label: "Inicio", value: formatSessionDateTime(storedResult.startedAt) },
				{ label: "Fin", value: formatSessionDateTime(storedResult.endedAt) },
			]
		: runtime
			? [
					{ label: "Expediente", value: runtime.config.expediente },
					{
						label: "Inicio",
						value: runtime.startedAt ? formatSessionDateTime(runtime.startedAt) : "Sin registro",
					},
					{
						label: "Fin",
						value: runtime.finishedAt ? formatSessionDateTime(runtime.finishedAt) : "Sin registro",
					},
				]
			: [];

	const configurationItems: MindfulnessSessionSummaryFieldViewModel[] = storedResult
		? [
				{ label: "Práctica", value: storedResult.configuration.practiceLabel },
				{ label: "Modo", value: storedResult.configuration.sessionModeLabel },
				{ label: "Duración", value: formatDuration(storedResult.configuration.durationMinutes) },
				{ label: "Frecuencia", value: storedResult.configuration.assessmentFrequencyLabel },
				{
					label: "Variables evaluadas",
					value:
						storedResult.configuration.enabledVariablesLabels.length > 0
							? storedResult.configuration.enabledVariablesLabels.join(", ")
							: "Sin variables",
				},
			]
		: runtime
			? [
					{ label: "Práctica", value: formatPracticeLabel(runtime.config.practice) },
					{ label: "Modo", value: runtime.config.sessionMode === "MANUAL" ? "Manual" : "Automático" },
					{ label: "Duración", value: formatDuration(runtime.config.durationMinutes) },
					{ label: "Frecuencia", value: formatFrequencyLabel(runtime.config.assessmentFrequency) },
					{
						label: "Variables evaluadas",
						value:
							runtime.config.enabledVariables.length > 0
								? runtime.config.enabledVariables.map((variable) => formatVariableLabel(variable)).join(", ")
								: "Sin variables",
					},
				]
			: [];

	const finalSummaryItems = useMemo<MindfulnessSessionSummaryFieldViewModel[]>(() => {
		if (storedResult) {
			return storedResult.finalSummary;
		}

		if (!runtime) {
			return [];
		}

		return [
			{ label: "Duración programada", value: formatDuration(runtime.config.durationMinutes) },
			{ label: "Duración efectiva", value: formatDurationFromMs(runtime.clock.getElapsedMs()) },
			{
				label: "Evaluaciones intermedias",
				value: String(runtime.intermediateAssessments.length),
			},
		];
	}, [runtime, storedResult]);

	useEffect(() => {
		if (storedResult !== null || runtime === null || hasPersistedResultRef.current || viewModel === null) {
			return;
		}

		if (runtime.finishedAt === null) {
			return;
		}

		if (runtime.config.enabledVariables.length > 0 && runtime.finalAssessment === null) {
			return;
		}

		hasPersistedResultRef.current = true;

		try {
			saveMindfulnessResult({
				startedAt: runtime.startedAt ?? runtime.finishedAt,
				endedAt: runtime.finishedAt,
				config: runtime.config,
				initialAssessment: runtime.initialAssessment,
				intermediateAssessments: runtime.intermediateAssessments,
				finalAssessment: runtime.finalAssessment,
				summary: viewModel,
				finalSummary: finalSummaryItems,
			});
		} catch (error) {
			console.error("No se pudo guardar el resultado de Mindfulness", error);
		}
	}, [finalSummaryItems, runtime, storedResult, viewModel]);

	function handleFinish(): void {
		if (storedResult !== null) {
			navigate("/mindfulness/results", { replace: true });
			return;
		}

		resetPreparedMindfulnessSession();
		navigate("/mindfulness", { replace: true });
	}

	if (shouldRedirectToHome) {
		return <Navigate to="/mindfulness" replace />;
	}

	if (shouldRedirectToFinalAssessment) {
		return <Navigate to="/mindfulness/final-assessment" replace />;
	}

	if (viewModel === null) {
		return <Navigate to="/mindfulness" replace />;
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
					<ModuleHeader moduleName="Mindfulness" title="Resumen de la sesión" />

					<SessionConfigurationCard title="Información general">
						<SummaryValueList items={informationItems} emptyMessage="Sin datos disponibles." />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Configuración">
						<SummaryValueList items={configurationItems} emptyMessage="Sin configuración disponible." />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Evaluación inicial">
						<SummaryValueList
							items={viewModel.initialVariables}
							emptyMessage="No se registraron variables iniciales."
						/>
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Evaluaciones intermedias">
						{viewModel.intermediateAssessments.length === 0 ? (
							<Typography sx={{ color: "text.secondary" }}>
								No se realizaron evaluaciones intermedias.
							</Typography>
						) : (
							<Stack spacing={2.5} divider={<Divider flexItem />}>
								{viewModel.intermediateAssessments.map((assessment) => (
									<Stack key={`${assessment.title}-${assessment.recordedAt}`} spacing={1.5}>
										<Stack
											direction={{ xs: "column", sm: "row" }}
											spacing={1}
											sx={{ justifyContent: "space-between" }}
										>
											<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
												{assessment.title}
											</Typography>
											<Typography sx={{ color: "text.secondary" }}>{assessment.recordedAt}</Typography>
										</Stack>
										<SummaryValueList items={assessment.values} emptyMessage="Sin valores registrados." />
									</Stack>
								))}
							</Stack>
						)}
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Evaluación final">
						<SummaryValueList
							items={viewModel.finalVariables}
							emptyMessage="No se registraron variables finales."
						/>
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Resumen">
						<SummaryValueList items={finalSummaryItems} emptyMessage="Sin resumen disponible." />
					</SessionConfigurationCard>

					<Button fullWidth variant="contained" size="large" onClick={handleFinish}>
						{storedResult !== null ? "Regresar" : "Finalizar"}
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default MindfulnessSessionSummaryPage;