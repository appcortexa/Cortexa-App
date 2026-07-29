import { Box, Slider, Stack, Typography } from "@mui/material";

type EmotionIntensitySliderProps = {
	label: string;
	value: number;
	onChange: (nextValue: number) => void;
};

function EmotionIntensitySlider({ label, value, onChange }: EmotionIntensitySliderProps) {
	return (
		<Stack spacing={1}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
				<Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
					{label}
				</Typography>
				<Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
					{value}/10
				</Typography>
			</Box>
			<Slider
				value={value}
				min={0}
				max={10}
				step={1}
				marks
				valueLabelDisplay="auto"
				onChange={(_event, nextValue) => {
					if (typeof nextValue === "number") {
						onChange(nextValue);
					}
				}}
			/>
		</Stack>
	);
}

export default EmotionIntensitySlider;
