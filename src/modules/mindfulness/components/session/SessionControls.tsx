import { Stack, Button } from "@mui/material";

type SessionControlsProps = {
	isPaused: boolean;
	isDisabled: boolean;
	showNextPrompt: boolean;
	onCancelSession: () => void;
	onTogglePauseResume: () => void;
	onNextPrompt: () => void;
	onFinishSession: () => void;
};

function SessionControls({
	isPaused,
	isDisabled,
	showNextPrompt,
	onCancelSession,
	onTogglePauseResume,
	onNextPrompt,
	onFinishSession,
}: SessionControlsProps) {
	return (
		<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
			<Button fullWidth variant="outlined" color="error" size="large" onClick={onCancelSession}>
				Cancelar
			</Button>
			<Button fullWidth variant="outlined" size="large" disabled={isDisabled} onClick={onTogglePauseResume}>
				{isPaused ? "Reanudar" : "Pausar"}
			</Button>
			{showNextPrompt ? (
				<Button fullWidth variant="outlined" size="large" disabled={isDisabled || isPaused} onClick={onNextPrompt}>
					Siguiente
				</Button>
			) : null}
			<Button fullWidth variant="contained" size="large" disabled={isDisabled} onClick={onFinishSession}>
				Finalizar
			</Button>
		</Stack>
	);
}

export default SessionControls;
