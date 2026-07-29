import { TextField } from "@mui/material";

type ExpedienteFieldProps = {
	value: string;
	onChange: (value: string) => void;
};

function ExpedienteField({ value, onChange }: ExpedienteFieldProps) {
	return (
		<TextField
			fullWidth
			label="Número de expediente"
			value={value}
			onChange={(event) => onChange(event.target.value)}
		/>
	);
}

export default ExpedienteField;