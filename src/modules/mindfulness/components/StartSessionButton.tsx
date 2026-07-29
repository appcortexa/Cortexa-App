import { Button, Stack } from "@mui/material";

type StartSessionButtonProps = {
	enabled: boolean;
	onCancel: () => void;
	onClick: () => void;
};

function StartSessionButton({ enabled, onCancel, onClick }: StartSessionButtonProps) {
	return (
		<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
			<Button fullWidth variant="outlined" size="large" onClick={onCancel}>
				Cancelar
			</Button>
			<Button fullWidth variant="contained" size="large" disabled={!enabled} onClick={onClick}>
				Iniciar sesión
			</Button>
		</Stack>
	);
}

export default StartSessionButton;