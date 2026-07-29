import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function AntiRuminationDetectionIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Detección de Rumiación"
			description='Objetivo clínico: aprender a reconocer cuándo un pensamiento comienza a repetirse de forma persistente y genera sensación de quedarse atrapado en él. "La rumiación consiste en permanecer dando vueltas repetidamente a una misma preocupación o situación. El primer paso para manejarla consiste en aprender a reconocer cuándo aparece."'
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/antirrumiacion/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/antirrumiacion/deteccion-rumiacion/registro", {
					state: { episodes: [] },
				})
			}
		/>
	);
}

export default AntiRuminationDetectionIntroPage;