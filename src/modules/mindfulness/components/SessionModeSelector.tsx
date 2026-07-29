import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

import { SESSION_MODES, type SessionMode } from "../models/mindfulness.models";

type SessionModeSelectorProps = {
	value: SessionMode;
	onChange: (mode: SessionMode) => void;
};

const modeOptions: Array<{ value: SessionMode; label: string }> = [
	{ value: SESSION_MODES.AUTOMATIC, label: "Automático" },
	{ value: SESSION_MODES.MANUAL, label: "Manual" },
];

function SessionModeSelector({ value, onChange }: SessionModeSelectorProps) {
	return (
		<FormControl>
			<RadioGroup value={value} onChange={(event) => onChange(event.target.value as SessionMode)}>
				{modeOptions.map((option) => (
					<FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
				))}
			</RadioGroup>
		</FormControl>
	);
}

export default SessionModeSelector;
