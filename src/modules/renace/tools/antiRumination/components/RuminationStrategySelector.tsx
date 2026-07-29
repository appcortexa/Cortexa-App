import { MenuItem, TextField } from "@mui/material";

const ruminationStrategies = [
	"Respiracion",
	"Mindfulness",
	"Caminar",
	"Hablar con alguien",
	"Cambiar de actividad",
	"Escribir",
	"Otra",
] as const;

type RuminationStrategySelectorProps = {
	value: string;
	onChange: (nextValue: string) => void;
	label?: string;
};

function RuminationStrategySelector({
	value,
	onChange,
	label = "Estrategia utilizada",
}: RuminationStrategySelectorProps) {
	return (
		<TextField
			select
			fullWidth
			label={label}
			value={value}
			onChange={(event) => onChange(event.target.value)}
		>
			{ruminationStrategies.map((strategy) => (
				<MenuItem key={strategy} value={strategy}>
					{strategy}
				</MenuItem>
			))}
		</TextField>
	);
}

export default RuminationStrategySelector;