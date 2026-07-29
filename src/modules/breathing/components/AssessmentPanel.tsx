import { useMemo, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import CravingScale from "../../../components/common/CravingScale";
import type {
	BreathingAssessmentValue,
	BreathingAssessmentVariableDefinition,
} from "../models/BreathingAssessment";
import type { SessionDataCollector } from "../services/SessionDataCollector";
import SessionConfigurationCard from "../../mindfulness/components/SessionConfigurationCard";

type AssessmentPanelProps = {
	variables: readonly BreathingAssessmentVariableDefinition[];
	sessionDataCollector: SessionDataCollector;
	assessmentEventId: string | null;
	onAssessmentCompleted: () => void;
};

type AssessmentValueState = Record<string, number | null>;

function AssessmentPanel({
	variables,
	sessionDataCollector,
	assessmentEventId,
	onAssessmentCompleted,
}: AssessmentPanelProps) {
	const [values, setValues] = useState<AssessmentValueState>({});

	const areAllValuesComplete = useMemo(
		() => variables.every((variable) => typeof values[variable.key] === "number"),
		[values, variables],
	);

	function handleValueChange(variableKey: string, value: number): void {
		setValues((currentValues) => ({
			...currentValues,
			[variableKey]: value,
		}));
	}

	function handleSubmit(): void {
		if (!areAllValuesComplete) {
			return;
		}

		const assessmentValues: readonly BreathingAssessmentValue[] = variables.map((variable) => ({
			variableKey: variable.key,
			value: values[variable.key] ?? variable.minValue,
		}));

		sessionDataCollector.recordIntermediateAssessment({
			assessmentEventId,
			values: assessmentValues,
		});
		onAssessmentCompleted();
		setValues({});
	}

	return (
		<Stack spacing={2.5}>
			<SessionConfigurationCard title="Evaluación clínica intermedia">
				<Stack spacing={2.5}>
					<Typography sx={{ color: "text.secondary" }}>
						Registra las variables configuradas para esta sesión antes de continuar.
					</Typography>
					{variables.length === 0 ? (
						<Typography sx={{ color: "text.secondary" }}>
							No hay variables seleccionadas para esta evaluación.
						</Typography>
					) : (
						variables.map((variable) => (
							<Stack key={variable.key} spacing={1.5}>
								<Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
									{variable.label}
								</Typography>
								<Typography>{variable.question}</Typography>
								<CravingScale
									value={values[variable.key] ?? null}
									onChange={(value) => handleValueChange(variable.key, value)}
								/>
							</Stack>
						))
					)}

					<Button
						fullWidth
						variant="contained"
						size="large"
						disabled={!areAllValuesComplete}
						onClick={handleSubmit}
					>
						Continuar sesión
					</Button>
				</Stack>
			</SessionConfigurationCard>
		</Stack>
	);
}

export default AssessmentPanel;
