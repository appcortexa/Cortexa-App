import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function EmotionDifferenceIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Diferenciación Emocional"
			description="Objetivo clínico: aprender a reconocer que una misma situación puede generar varias emociones y distinguir cuál predominó. En muchas situaciones experimentamos más de una emoción al mismo tiempo. En este ejercicio practicarás identificarlas y reconocer cuál tuvo mayor influencia sobre tu experiencia."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/regulacion-emocional/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/regulacion-emocional/diferenciacion-emocional/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default EmotionDifferenceIntroPage;
