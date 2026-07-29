import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function CognitiveRestructuringReframingIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Reencuadre Cognitivo"
			description="Objetivo clínico: aprender a observar una misma situación desde perspectivas diferentes para favorecer interpretaciones más equilibradas. Una misma experiencia puede comprenderse de distintas maneras. Explorar otras perspectivas no significa negar lo ocurrido, sino ampliar la forma en que lo interpretamos."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/reestructuracion-cognitiva/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/reestructuracion-cognitiva/reencuadre-cognitivo/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default CognitiveRestructuringReframingIntroPage;
