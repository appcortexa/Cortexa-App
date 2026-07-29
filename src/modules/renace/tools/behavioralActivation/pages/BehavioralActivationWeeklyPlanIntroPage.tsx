import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function BehavioralActivationWeeklyPlanIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Plan Semanal"
			description="Objetivo clínico: traducir tu activación conductual en compromisos concretos y alcanzables para esta semana. Definir qué harás, cuándo lo harás y con qué nivel de prioridad y confianza aumenta la probabilidad de cumplimiento."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/activacion-conductual/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/activacion-conductual/plan-semanal/registro", {
					state: { commitments: [] },
				})
			}
		/>
	);
}

export default BehavioralActivationWeeklyPlanIntroPage;
