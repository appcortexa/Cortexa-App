import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function PositiveAttentionPersonalPlanIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Plan Personal de Atención Positiva"
			description="Objetivo clínico: integrar las estrategias personales que resultaron más útiles para mantener una atención consciente hacia experiencias positivas. Al finalizar esta herramienta elaborarás un plan personal para recordar cómo dirigir tu atención hacia experiencias, recursos y momentos valiosos en tu vida cotidiana."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/atencion-positiva/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/atencion-positiva/plan-personal/registro", { state: { plan: null } })}
		/>
	);
}

export default PositiveAttentionPersonalPlanIntroPage;
