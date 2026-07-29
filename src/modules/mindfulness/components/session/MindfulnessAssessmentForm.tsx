import { useMemo, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";

import CravingScale from "../../../../components/common/CravingScale";
import SessionConfigurationCard from "../SessionConfigurationCard";
import type { MindfulnessAssessmentValue } from "../../models/MindfulnessAssessment";
import {
	ASSESSMENT_VARIABLE_LABELS,
	ASSESSMENT_VARIABLE_QUESTIONS,
	type AssessmentVariable,
} from "../../models/mindfulness.models";

type AssessmentValueState = Partial<Record<AssessmentVariable, number>>;

type MindfulnessAssessmentFormProps = {
	title: string;
	description: string;
	variables: readonly AssessmentVariable[];
	submitLabel: string;
	onSubmit: (values: readonly MindfulnessAssessmentValue[]) => void;
};

function MindfulnessAssessmentForm({
	title,
	description,
	variables,
	submitLabel,
	onSubmit,
}: MindfulnessAssessmentFormProps) {
	const [values, setValues] = useState<AssessmentValueState>({});

	const areAllValuesComplete = useMemo(
		() => variables.every((variable) => typeof values[variable] === "number"),
		[values, variables],
	);

	function handleValueChange(variable: AssessmentVariable, value: number): void {
		setValues((currentValues) => ({
			...currentValues,
			[variable]: value,
		}));
	}

	function handleSubmit(): void {
		if (!areAllValuesComplete) {
			return;
		}

		onSubmit(
			variables.map((variable) => ({
				variable,
				value: values[variable] ?? 0,
			})),
		);
	}

	return (
		<Stack spacing={3}>
			<SessionConfigurationCard title={title}>
				<Stack spacing={3}>
					<Typography sx={{ color: "text.secondary" }}>{description}</Typography>
					{variables.map((variable) => (
						<Stack key={variable} spacing={1.5}>
							<Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
								{ASSESSMENT_VARIABLE_LABELS[variable]}
							</Typography>
							<Typography>{ASSESSMENT_VARIABLE_QUESTIONS[variable]}</Typography>
							<CravingScale
								value={values[variable] ?? null}
								onChange={(value) => handleValueChange(variable, value)}
							/>
						</Stack>
					))}
				</Stack>
			</SessionConfigurationCard>

			<Button fullWidth variant="contained" size="large" disabled={!areAllValuesComplete} onClick={handleSubmit}>
				{submitLabel}
			</Button>
		</Stack>
	);
}

export default MindfulnessAssessmentForm;