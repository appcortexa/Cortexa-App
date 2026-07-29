import { FormControl, MenuItem, Select } from "@mui/material";

import { mindfulnessConfig } from "../config/mindfulnessConfig";

type DurationSelectorProps = {
	value: number;
	onChange: (durationMinutes: number) => void;
};

const MIN_DURATION = mindfulnessConfig.minDurationMinutes;
const MAX_DURATION = mindfulnessConfig.maxDurationMinutes;

const durationOptions = Array.from({ length: MAX_DURATION - MIN_DURATION + 1 }, (_, index) => index + MIN_DURATION);

function DurationSelector({ value, onChange }: DurationSelectorProps) {
	return (
		<FormControl fullWidth>
			<Select value={value} onChange={(event) => onChange(Number(event.target.value))} size="medium">
				{durationOptions.map((minutes) => (
					<MenuItem key={minutes} value={minutes}>
						{minutes} minuto{minutes === 1 ? "" : "s"}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export default DurationSelector;