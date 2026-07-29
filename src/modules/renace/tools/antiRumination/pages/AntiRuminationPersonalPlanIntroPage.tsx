import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function AntiRuminationPersonalPlanIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Plan Personal Antirrumiación"
			description='Objetivo clínico: integrar las estrategias aprendidas durante la sesión en un plan sencillo que pueda utilizar cuando vuelva a aparecer la rumiación. "Al finalizar esta herramienta elaborarás un plan personal con las estrategias que consideras más útiles para responder de forma diferente cuando aparezcan pensamientos repetitivos."'
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/antirrumiacion/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/antirrumiacion/aprendizajes/plan-personal", {
					state: { plan: null },
				})
			}
		/>
	);
}

export default AntiRuminationPersonalPlanIntroPage;
