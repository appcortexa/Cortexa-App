import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Stack } from "@mui/material";

import ModuleHeader from "../../../components/common/ModuleHeader";
import ExpedienteField from "../components/ExpedienteField";
import DurationSelector from "../components/DurationSelector";
import PracticeSelector from "../components/PracticeSelector";
import SessionConfigurationCard from "../components/SessionConfigurationCard";
import StartSessionButton from "../components/StartSessionButton";
import VariableSelector from "../components/VariableSelector";
import AssessmentFrequencySelector from "../components/AssessmentFrequencySelector";
import SessionModeSelector from "../components/SessionModeSelector";
import { mindfulnessConfig } from "../config/mindfulnessConfig";
import type { MindfulnessSessionConfig } from "../models/MindfulnessSessionConfig";
import { prepareMindfulnessSession } from "../services/mindfulnessSessionRuntime";
import {
	ASSESSMENT_FREQUENCIES,
	type AssessmentFrequency,
	type AssessmentVariable,
	type PracticeType,
	SESSION_MODES,
	type SessionMode,
} from "../models/mindfulness.models";

function MindfulnessConfigPage() {
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState<string>("");
	const [selectedPractice, setSelectedPractice] = useState<PracticeType | null>(null);
	const [durationMinutes, setDurationMinutes] = useState<number>(mindfulnessConfig.minDurationMinutes);
	const [enabledVariables, setEnabledVariables] = useState<AssessmentVariable[]>([]);
	const [assessmentFrequency, setAssessmentFrequency] = useState<AssessmentFrequency>(ASSESSMENT_FREQUENCIES.NONE);
	const [sessionMode, setSessionMode] = useState<SessionMode>(SESSION_MODES.AUTOMATIC);

	const sessionConfig = useMemo<MindfulnessSessionConfig | null>(() => {
		const normalizedExpediente = expediente.trim();

		if (!normalizedExpediente || !selectedPractice) {
			return null;
		}

		return {
			expediente: normalizedExpediente,
			practice: selectedPractice,
			durationMinutes,
			enabledVariables,
			assessmentFrequency,
			sessionMode,
		};
	}, [assessmentFrequency, durationMinutes, enabledVariables, expediente, selectedPractice, sessionMode]);

	const isStartDisabled = !expediente.trim() || !selectedPractice;

	function handleCancel(): void {
		navigate("/reconecta");
	}

	function handleStartSession(): void {
		if (!sessionConfig) {
			return;
		}

		prepareMindfulnessSession(sessionConfig);
		const nextPath = sessionConfig.enabledVariables.length > 0
			? "/mindfulness/initial-assessment"
			: "/mindfulness/session";

		navigate(nextPath, {
			state: {
				config: sessionConfig,
			},
		});
	}

	function handleConsultResults(): void {
		navigate("/mindfulness/results");
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
						moduleName="Mindfulness"
						title="Configuracion de sesion de practica consciente"
					/>

					<SessionConfigurationCard title="Número de expediente">
						<ExpedienteField value={expediente} onChange={setExpediente} />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Seleccione la practica">
						<PracticeSelector value={selectedPractice} onChange={setSelectedPractice} />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Duracion">
						<DurationSelector value={durationMinutes} onChange={setDurationMinutes} />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Variables de registro">
						<VariableSelector value={enabledVariables} onChange={setEnabledVariables} />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Frecuencia de registros intermedios">
						<AssessmentFrequencySelector value={assessmentFrequency} onChange={setAssessmentFrequency} />
					</SessionConfigurationCard>

					<SessionConfigurationCard title="Modo de avance de las tarjetas">
						<SessionModeSelector value={sessionMode} onChange={setSessionMode} />
					</SessionConfigurationCard>

					<StartSessionButton enabled={!isStartDisabled} onCancel={handleCancel} onClick={handleStartSession} />

					<Button fullWidth variant="contained" color="secondary" size="large" onClick={handleConsultResults}>
						Consultar resultados
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default MindfulnessConfigPage;
