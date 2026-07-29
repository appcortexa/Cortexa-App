import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

type SessionCancelConfirmationDialogProps = {
	open: boolean;
	onClose: () => void;
	onConfirmCancel: () => void;
	title?: string;
	message?: string;
	secondaryMessage?: string;
	continueLabel?: string;
	cancelLabel?: string;
};

function SessionCancelConfirmationDialog({
	open,
	onClose,
	onConfirmCancel,
	title = "Cancelar sesión",
	message = "¿Deseas cancelar la sesión actual?",
	secondaryMessage = "Los datos de esta sesión no serán guardados.",
	continueLabel = "Continuar sesión",
	cancelLabel = "Cancelar sesión",
}: SessionCancelConfirmationDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
			<DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
			<DialogContent>
				<Typography sx={{ color: "text.primary", mb: 1.5 }}>{message}</Typography>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{secondaryMessage}
				</Typography>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2.5 }}>
				<Button onClick={onClose} variant="outlined">
					{continueLabel}
				</Button>
				<Button onClick={onConfirmCancel} variant="contained" color="error">
					{cancelLabel}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default SessionCancelConfirmationDialog;