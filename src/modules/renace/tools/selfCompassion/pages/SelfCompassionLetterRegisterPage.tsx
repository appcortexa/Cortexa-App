import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

export type CompassionateLetterRecord = {
	situation: string;
	letter: string;
	mainIdea: string;
	usefulness: number;
};

function SelfCompassionLetterRegisterPage() {
	const navigate = useNavigate();
	const [situation, setSituation] = useState("");
	const [letter, setLetter] = useState("");
	const [mainIdea, setMainIdea] = useState("");
	const [usefulness, setUsefulness] = useState(5);
	const [showErrors, setShowErrors] = useState(false);
	const [record, setRecord] = useState<CompassionateLetterRecord | null>(null);

	const saveExercise = () => {
		const nextRecord = {
			situation: situation.trim(),
			letter: letter.trim(),
			mainIdea: mainIdea.trim(),
			usefulness,
		};

		if (!nextRecord.situation || !nextRecord.letter || !nextRecord.mainIdea) {
			setShowErrors(true);
			return;
		}

		setRecord(nextRecord);
		setShowErrors(false);
	};

	return (
		<InterventionScreenLayout
			title="Carta compasiva hacia uno mismo"
			description="Escribe una carta para acompañarte con comprensión, aceptación y apoyo frente a una dificultad."
			actions={
				<Button
					variant="outlined"
					size="large"
					onClick={() => navigate("/renace/autocompasion/carta-compasiva/introduccion")}
				>
					Regresar
				</Button>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					fullWidth
					label="Situación difícil que deseas abordar"
					value={situation}
					onChange={(event) => setSituation(event.target.value)}
					error={showErrors && !situation.trim()}
					helperText={showErrors && !situation.trim() ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					multiline
					minRows={6}
					label="Carta dirigida a ti mismo"
					value={letter}
					onChange={(event) => setLetter(event.target.value)}
					error={showErrors && !letter.trim()}
					helperText={showErrors && !letter.trim() ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					label="¿Qué idea principal deseas recordar de esta carta?"
					value={mainIdea}
					onChange={(event) => setMainIdea(event.target.value)}
					error={showErrors && !mainIdea.trim()}
					helperText={showErrors && !mainIdea.trim() ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider label="Utilidad" value={usefulness} onChange={setUsefulness} />

				<ExerciseEntryActions
					onSave={saveExercise}
					onAddAnother={() => undefined}
					onFinish={() => {
						if (record) {
							navigate("/renace/autocompasion/carta-compasiva/resumen", { state: { record } });
						}
					}}
					canSave={!record}
					showAddAnother={false}
					showFinish={record !== null}
				/>
			</Stack>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionLetterRegisterPage;
