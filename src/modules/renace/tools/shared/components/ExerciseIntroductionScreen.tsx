import { Button, Stack } from "@mui/material";

import InterventionScreenLayout from "./InterventionScreenLayout";

type ExerciseIntroductionScreenProps = {
	title: string;
	description: string;
	backLabel: string;
	onBack: () => void;
	startLabel: string;
	onStart: () => void;
};

function ExerciseIntroductionScreen({
	title,
	description,
	backLabel,
	onBack,
	startLabel,
	onStart,
}: ExerciseIntroductionScreenProps) {
	return (
		<InterventionScreenLayout
			title={title}
			description={description}
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end" }}>
					<Button variant="outlined" size="large" onClick={onBack}>
						{backLabel}
					</Button>
					<Button variant="contained" size="large" onClick={onStart}>
						{startLabel}
					</Button>
				</Stack>
			}
		/>
	);
}

export default ExerciseIntroductionScreen;
