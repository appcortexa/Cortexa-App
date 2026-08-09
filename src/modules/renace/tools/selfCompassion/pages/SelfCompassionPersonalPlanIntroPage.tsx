import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function SelfCompassionPersonalPlanIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Plan Personal de Autocompasión"
			description="Objetivo clínico: integrar las estrategias de autocompasión que resultaron más útiles para favorecer su aplicación en la vida cotidiana. En este ejercicio elaborarás un plan sencillo que podrás utilizar cuando notes que aparece la autocrítica o estés atravesando una situación difícil."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/autocompasion/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/autocompasion/plan-personal/registro")}
		/>
	);
}

export default SelfCompassionPersonalPlanIntroPage;
