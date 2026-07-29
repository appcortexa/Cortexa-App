import { useMemo, useState } from "react";
import { Box, Button, Container, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ModuleCard from "../../../components/common/ModuleCard";
import ModuleHeader from "../../../components/common/ModuleHeader";
import DurationSelector from "../../mindfulness/components/DurationSelector";
import ExpedienteField from "../../mindfulness/components/ExpedienteField";
import SessionConfigurationCard from "../../mindfulness/components/SessionConfigurationCard";
import StartSessionButton from "../../mindfulness/components/StartSessionButton";
import VariableSelector from "../../mindfulness/components/VariableSelector";
import { BREATHING_PATTERNS_CATALOG } from "../models/BreathingPatternsCatalog";
import type { BreathingPattern } from "../models/BreathingPattern";
import type { BreathingSessionConfig } from "../models/BreathingSessionConfig";
import {
	ASSESSMENT_FREQUENCIES,
	type AssessmentVariable,
} from "../../mindfulness/models/mindfulness.models";
import {
	buildBreathingIntermediateAssessmentsConfig,
	buildBreathingSessionConfig,
} from "../services/breathingSessionConfigBuilder";
import { createBreathingSessionContext } from "../services/createBreathingSessionContext";
import { prepareBreathingSessionContext } from "../services/preparedBreathingSessionContext";

type CustomPatternInputs = {
	inhale: string;
	hold: string;
	exhale: string;
	holdOptional: string;
};

function parseWholeNonNegative(value: string): number | null {
	if (!value.trim()) {
		return null;
	}

	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed < 0) {
		return null;
	}

	return parsed;
}

function buildCustomPattern(
	pattern: BreathingPattern,
	input: CustomPatternInputs,
): BreathingPattern | null {
	const inhaleSeconds = parseWholeNonNegative(input.inhale);
	const holdSeconds = parseWholeNonNegative(input.hold);
	const exhaleSeconds = parseWholeNonNegative(input.exhale);
	const optionalHoldSeconds = parseWholeNonNegative(input.holdOptional);

	if (
		inhaleSeconds === null || inhaleSeconds <= 0 ||
		holdSeconds === null || holdSeconds <= 0 ||
		exhaleSeconds === null || exhaleSeconds <= 0 ||
		optionalHoldSeconds === null
	) {
		return null;
	}

	const phases: BreathingPattern["phases"] = [
		{ id: "inhale", key: "INHALE", label: "Inhalación", durationSeconds: inhaleSeconds },
		{ id: "hold", key: "HOLD", label: "Pausa", durationSeconds: holdSeconds },
		{ id: "exhale", key: "EXHALE", label: "Exhalación", durationSeconds: exhaleSeconds },
		...(optionalHoldSeconds > 0
			? [{ id: "hold-empty", key: "HOLD_EMPTY", label: "Pausa opcional", durationSeconds: optionalHoldSeconds }]
			: []),
	];
	const totalCycleSeconds = phases.reduce(
		(total, phase) => total + (phase.durationSeconds ?? 0),
		0,
	);

	return {
		...pattern,
		phases,
		totalCycleSeconds,
	};
}

function BreathingConfigPage() {
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState<string>("");
	const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
	const [durationMinutes, setDurationMinutes] = useState<number>(1);
	const [selectedVariables, setSelectedVariables] = useState<AssessmentVariable[]>([]);
	const [customPatternInputs, setCustomPatternInputs] = useState<CustomPatternInputs>({
		inhale: "4",
		hold: "2",
		exhale: "6",
		holdOptional: "0",
	});

	const selectedPattern = useMemo(
		() => BREATHING_PATTERNS_CATALOG.find((pattern) => pattern.id === selectedPatternId) ?? null,
		[selectedPatternId],
	);

	const resolvedPattern = useMemo<BreathingPattern | null>(() => {
		if (selectedPattern === null) {
			return null;
		}

		if (!selectedPattern.allowsCustomization) {
			return selectedPattern;
		}

		return buildCustomPattern(selectedPattern, customPatternInputs);
	}, [customPatternInputs, selectedPattern]);

	const sessionConfig = useMemo<BreathingSessionConfig | null>(
		() => buildBreathingSessionConfig({
			expediente,
			pattern: resolvedPattern,
			durationMinutes,
			assessmentFrequency: ASSESSMENT_FREQUENCIES.NONE,
			assessmentVariables: selectedVariables,
		}),
		[durationMinutes, expediente, resolvedPattern, selectedVariables],
	);

	const intermediateAssessmentsConfig = useMemo(
		() => buildBreathingIntermediateAssessmentsConfig(ASSESSMENT_FREQUENCIES.NONE),
		[],
	);

	const isStartEnabled = sessionConfig !== null;

	function handleStartSession(): void {
		if (sessionConfig === null) {
			return;
		}

		const sessionContext = createBreathingSessionContext({
			config: sessionConfig,
			intermediateAssessmentsConfig,
		});
		prepareBreathingSessionContext(sessionContext);

		navigate("/breathing/session");
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
						title="Configuración de sesión"
					/>

					<SessionConfigurationCard title="Número de expediente">
						<ExpedienteField value={expediente} onChange={setExpediente} />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Patrón respiratorio">
						<Stack spacing={1.5}>
							{BREATHING_PATTERNS_CATALOG.map((pattern) => {
								const phasesDescription = pattern.phases
									.map((phase) => `${phase.label} ${phase.durationSeconds ?? "-"} s`)
									.join(" · ");

								return (
									<ModuleCard
										key={pattern.id}
										title={pattern.name}
										description={pattern.description ?? phasesDescription}
										selected={pattern.id === selectedPatternId}
										onClick={() => setSelectedPatternId(pattern.id)}
									/>
								);
							})}

							{selectedPattern?.allowsCustomization ? (
								<Stack spacing={1.5} sx={{ pt: 1 }}>
									<TextField
										fullWidth
										type="number"
										label="Inhalación (segundos)"
										value={customPatternInputs.inhale}
										slotProps={{ htmlInput: { min: 1, step: 1 } }}
										onChange={(event) =>
											setCustomPatternInputs((current) => ({
												...current,
												inhale: event.target.value,
											}))
										}
									/>
									<TextField
										fullWidth
										type="number"
										label="Pausa (segundos)"
										value={customPatternInputs.hold}
										slotProps={{ htmlInput: { min: 1, step: 1 } }}
										onChange={(event) =>
											setCustomPatternInputs((current) => ({
												...current,
												hold: event.target.value,
											}))
										}
									/>
									<TextField
										fullWidth
										type="number"
										label="Exhalación (segundos)"
										value={customPatternInputs.exhale}
										slotProps={{ htmlInput: { min: 1, step: 1 } }}
										onChange={(event) =>
											setCustomPatternInputs((current) => ({
												...current,
												exhale: event.target.value,
											}))
										}
									/>
									<TextField
										fullWidth
										type="number"
										label="Pausa opcional (segundos)"
										value={customPatternInputs.holdOptional}
										slotProps={{ htmlInput: { min: 0, step: 1 } }}
										onChange={(event) =>
											setCustomPatternInputs((current) => ({
												...current,
												holdOptional: event.target.value,
											}))
										}
									/>
								</Stack>
							) : null}
						</Stack>
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Duración">
						<DurationSelector value={durationMinutes} onChange={setDurationMinutes} />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Variables clínicas">
						<VariableSelector value={selectedVariables} onChange={setSelectedVariables} />
					</SessionConfigurationCard>

					<StartSessionButton
						enabled={isStartEnabled}
						onCancel={() => navigate("/reconecta")}
						onClick={handleStartSession}
					/>

					<Button fullWidth variant="contained" color="secondary" size="large" onClick={() => navigate("/breathing/results")}>
						Consultar resultados
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default BreathingConfigPage;
