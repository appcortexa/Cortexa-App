import { Button, Stack } from "@mui/material";

type ExerciseEntryActionsProps = {
	onSave: () => void;
	onAddAnother: () => void;
	onFinish: () => void;
	canSave: boolean;
	showAddAnother: boolean;
	showFinish: boolean;
};

function ExerciseEntryActions({
	onSave,
	onAddAnother,
	onFinish,
	canSave,
	showAddAnother,
	showFinish,
}: ExerciseEntryActionsProps) {
	return (
		<Stack spacing={1.5}>
			<Button variant="contained" size="large" onClick={onSave} disabled={!canSave}>
				Guardar ejercicio
			</Button>

			{showAddAnother || showFinish ? (
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					{showAddAnother ? (
						<Button variant="outlined" size="large" onClick={onAddAnother}>
							Agregar otro ejercicio
						</Button>
					) : null}
					{showFinish ? (
						<Button variant="contained" size="large" onClick={onFinish}>
							Finalizar
						</Button>
					) : null}
				</Stack>
			) : null}
		</Stack>
	);
}

export default ExerciseEntryActions;