import { Button, Typography } from "@mui/material";

import InterventionScreenLayout from "./InterventionScreenLayout";

type ExerciseCompletionScreenProps = {
	title: string;
	description?: string;
	helperText?: string;
	actionLabel: string;
	onAction: () => void;
	disabled?: boolean;
};

function ExerciseCompletionScreen({
	title,
	description,
	helperText,
	actionLabel,
	onAction,
	disabled,
}: ExerciseCompletionScreenProps) {
	return (
		<InterventionScreenLayout
			title={title}
			description={description}
			actions={
				<Button variant="contained" size="large" onClick={onAction} disabled={disabled}>
					{actionLabel}
				</Button>
			}
		>
			{helperText ? (
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{helperText}
				</Typography>
			) : null}
		</InterventionScreenLayout>
	);
}

export default ExerciseCompletionScreen;
