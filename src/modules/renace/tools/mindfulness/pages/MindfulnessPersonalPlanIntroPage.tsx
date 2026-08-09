import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function MindfulnessPersonalPlanIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Plan Personal de Mindfulness"
			description="Objetivo clínico: integrar las habilidades de atención plena desarrolladas durante el módulo en un plan breve y concreto para la vida cotidiana. Al finalizar este módulo elaborarás un plan sencillo que te ayude a recordar cuándo y cómo practicar mindfulness en tu rutina diaria."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/mindfulness/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/mindfulness/plan-personal/registro", { state: { plan: null } })}
		/>
	);
}

export default MindfulnessPersonalPlanIntroPage;
