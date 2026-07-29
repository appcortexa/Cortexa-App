import { Stack } from "@mui/material";

import ModuleCard from "../../../components/common/ModuleCard";
import { PRACTICE_TYPES, type PracticeType } from "../models/mindfulness.models";

type PracticeSelectorProps = {
	value: PracticeType | null;
	onChange: (practice: PracticeType) => void;
};

const practiceOptions: Array<{ value: PracticeType; title: string; description: string }> = [
	{
		value: PRACTICE_TYPES.BREATH,
		title: "Respiracion consciente",
		description: "Atencion focalizada en la respiracion para anclar la mente al presente.",
	},
	{
		value: PRACTICE_TYPES.BODY_SCAN,
		title: "Escaneo corporal",
		description: "Recorrido guiado por sensaciones fisicas con observacion sin juicio.",
	},
	{
		value: PRACTICE_TYPES.THOUGHTS,
		title: "Observacion de pensamientos",
		description: "Reconocimiento de pensamientos como eventos mentales transitorios.",
	},
	{
		value: PRACTICE_TYPES.EMOTIONS,
		title: "Observacion de emociones",
		description: "Identificacion y aceptacion de estados emocionales en tiempo real.",
	},
	{
		value: PRACTICE_TYPES.CRAVING,
		title: "Surf del craving",
		description: "Trabajo de exposicion interna para observar impulso sin reaccionar.",
	},
	{
		value: PRACTICE_TYPES.SENSES,
		title: "Atencion en los sentidos",
		description: "Practica de grounding usando vista, oido, tacto, olfato y gusto.",
	},
];

function PracticeSelector({ value, onChange }: PracticeSelectorProps) {
	return (
		<Stack spacing={2}>
			{practiceOptions.map((practice) => (
				<ModuleCard
					key={practice.value}
					title={practice.title}
					description={practice.description}
					selected={value === practice.value}
					onClick={() => onChange(practice.value)}
				/>
			))}
		</Stack>
	);
}

export default PracticeSelector;