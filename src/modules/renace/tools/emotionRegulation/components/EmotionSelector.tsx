import { Box, Chip, Stack, Typography } from "@mui/material";

type EmotionSelectorProps = {
	label: string;
	options: string[];
	value: string | string[];
	onChange: (nextValue: string) => void;
	error?: boolean;
	helperText?: string;
	multiple?: boolean;
};

function EmotionSelector({ label, options, value, onChange, error, helperText, multiple = false }: EmotionSelectorProps) {
	const isSelected = (option: string) => {
		if (multiple) {
			return Array.isArray(value) && value.includes(option);
		}

		return value === option;
	};

	return (
		<Stack spacing={1}>
			<Typography variant="subtitle2" sx={{ color: error ? "error.main" : "text.secondary" }}>
				{label}
			</Typography>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
				{options.map((option) => (
					<Chip
						key={option}
						label={option}
						color={isSelected(option) ? "primary" : "default"}
						variant={isSelected(option) ? "filled" : "outlined"}
						onClick={() => onChange(option)}
						sx={{ cursor: "pointer" }}
					/>
				))}
			</Box>
			{helperText ? (
				<Typography variant="caption" sx={{ color: error ? "error.main" : "text.secondary" }}>
					{helperText}
				</Typography>
			) : null}
		</Stack>
	);
}

export default EmotionSelector;
