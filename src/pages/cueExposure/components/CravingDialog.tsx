import { Box, Button, Stack, Typography } from "@mui/material";

import CravingScale from "../../../components/common/CravingScale";

interface CravingDialogProps {
	question: string;
	value: number | null;
	onChange: (value: number) => void;
	onContinue: () => void;
	continueLabel?: string;
	helpText?: string;
}

function CravingDialog({
	question,
	value,
	onChange,
	onContinue,
	continueLabel = "Continuar",
	helpText = "Escala 0-10",
}: CravingDialogProps) {
	return (
		<Stack spacing={3.5} sx={{ width: "100%" }}>
			<Box sx={{ textAlign: "center" }}>
				<Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: "primary.main", mb: 1.5 }}>
					Cue Exposure
				</Typography>
				<Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.5 }}>
					{question}
				</Typography>
			</Box>

			<Box>
				<Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5, textAlign: "center" }}>
					{helpText}
				</Typography>
				<CravingScale value={value} onChange={onChange} />
			</Box>

			<Button fullWidth variant="contained" size="large" onClick={onContinue} disabled={value === null}>
				{continueLabel}
			</Button>
		</Stack>
	);
}

export default CravingDialog;