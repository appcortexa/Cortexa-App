import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function EmotionPersonalPlanIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Plan Personal de Regulación"
			description="Objetivo clínico: integrar las estrategias personales que resultaron más útiles para responder de manera saludable ante emociones intensas. Al finalizar esta herramienta elaborarás un plan personal con las acciones que deseas recordar cuando experimentes una emoción intensa."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/regulacion-emocional/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/regulacion-emocional/plan-personal-regulacion/registro", {
					state: { plan: null },
				})
			}
		/>
	);
}

export default EmotionPersonalPlanIntroPage;
