import { Button, Stack, Typography } from "@mui/material";

type CravingScaleProps = {
	value: number | null;
	onChange: (value: number) => void;
};

const scaleValues = Array.from({ length: 11 }, (_, index) => index);

function CravingScale({ value, onChange }: CravingScaleProps) {
	return (
		<Stack spacing={1.5}>
			<Stack direction="row" sx={{ justifyContent: "space-between" }}>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					0
				</Typography>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					10
				</Typography>
			</Stack>
			<Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
				{scaleValues.map((scaleValue) => {
					const selected = value !== null && value === scaleValue;

					return (
						<Button
							key={scaleValue}
							variant={selected ? "contained" : "outlined"}
							onClick={() => onChange(scaleValue)}
							sx={{
								minWidth: 44,
								px: 0,
								borderRadius: 2,
								fontWeight: 700,
							}}
						>
							{scaleValue}
						</Button>
					);
				})}
			</Stack>
		</Stack>
	);
}

export default CravingScale;