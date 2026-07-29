import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

import { ASSESSMENT_FREQUENCIES, type AssessmentFrequency } from "../models/mindfulness.models";

type AssessmentFrequencySelectorProps = {
	value: AssessmentFrequency;
	onChange: (frequency: AssessmentFrequency) => void;
};

const frequencyOptions: Array<{ value: AssessmentFrequency; label: string }> = [
	{ value: ASSESSMENT_FREQUENCIES.NONE, label: "Sin registros" },
	{ value: ASSESSMENT_FREQUENCIES.PERCENT_25, label: "Cada 25 %" },
	{ value: ASSESSMENT_FREQUENCIES.PERCENT_33, label: "Cada 33 %" },
	{ value: ASSESSMENT_FREQUENCIES.PERCENT_50, label: "Cada 50 %" },
];

function AssessmentFrequencySelector({ value, onChange }: AssessmentFrequencySelectorProps) {
	return (
		<FormControl>
			<RadioGroup value={value} onChange={(event) => onChange(event.target.value as AssessmentFrequency)}>
				{frequencyOptions.map((option) => (
					<FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
				))}
			</RadioGroup>
		</FormControl>
	);
}

export default AssessmentFrequencySelector;