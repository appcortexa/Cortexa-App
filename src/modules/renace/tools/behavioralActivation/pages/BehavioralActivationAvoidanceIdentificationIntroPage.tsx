import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function BehavioralActivationAvoidanceIdentificationIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Identificación de Evitación"
			description="Objetivo: reconocer situaciones que estás evitando para entender cómo la evitación puede mantener la depresión. Al identificar actividad evitada, obstáculo e intensidad, podrás definir alternativas concretas para intentarlas la próxima vez."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/activacion-conductual/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/activacion-conductual/identificacion-evitacion/registro", {
					state: { entries: [] },
				})
			}
		/>
	);
}

export default BehavioralActivationAvoidanceIdentificationIntroPage;
