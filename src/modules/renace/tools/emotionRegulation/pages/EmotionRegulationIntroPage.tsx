import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function EmotionRegulationIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Identificación Emocional"
			description="Objetivo clínico: aprender a reconocer la emoción predominante, su intensidad y las señales físicas asociadas. Las emociones suelen manifestarse tanto en nuestros pensamientos como en nuestro cuerpo. En este ejercicio practicarás reconocer cuál fue la emoción predominante y cómo la experimentaste."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/regulacion-emocional/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/regulacion-emocional/identificacion-emocional/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default EmotionRegulationIntroPage;
