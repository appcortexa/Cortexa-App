import { FormControlLabel, Stack, Switch } from "@mui/material";

import {
	ASSESSMENT_VARIABLES,
	ASSESSMENT_VARIABLE_LABELS,
	type AssessmentVariable,
} from "../models/mindfulness.models";

type VariableSelectorProps = {
	value: AssessmentVariable[];
	onChange: (variables: AssessmentVariable[]) => void;
};

type VariableOption = {
	value: AssessmentVariable;
	label: string;
};

const variableOptions: VariableOption[] = [
	{ value: ASSESSMENT_VARIABLES.CRAVING, label: ASSESSMENT_VARIABLE_LABELS[ASSESSMENT_VARIABLES.CRAVING] },
	{ value: ASSESSMENT_VARIABLES.ANXIETY, label: ASSESSMENT_VARIABLE_LABELS[ASSESSMENT_VARIABLES.ANXIETY] },
	{
		value: ASSESSMENT_VARIABLES.EMOTIONAL_TENSION,
		label: ASSESSMENT_VARIABLE_LABELS[ASSESSMENT_VARIABLES.EMOTIONAL_TENSION],
	},
];

function VariableSelector({ value, onChange }: VariableSelectorProps) {
	function handleToggle(variable: AssessmentVariable): void {
		if (value.includes(variable)) {
			onChange(value.filter((enabledVariable) => enabledVariable !== variable));
			return;
		}

		onChange([...value, variable]);
	}

	return (
		<Stack spacing={0.5}>
			{variableOptions.map((option) => (
				<FormControlLabel
					key={option.value}
					control={
						<Switch
							checked={value.includes(option.value)}
							onChange={() => handleToggle(option.value)}
						/>
					}
					label={option.label}
				/>
			))}
		</Stack>
	);
}

export default VariableSelector;