import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function EmotionReevaluationIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Reevaluación Emocional"
			description="Objetivo clínico: explorar cómo cambia la experiencia emocional cuando observamos una situación desde una perspectiva diferente. En ocasiones, una misma situación puede entenderse de distintas maneras. En este ejercicio registrarás cómo cambia tu experiencia emocional después de considerar una perspectiva alternativa."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/regulacion-emocional/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/regulacion-emocional/reevaluacion-emocional/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default EmotionReevaluationIntroPage;
