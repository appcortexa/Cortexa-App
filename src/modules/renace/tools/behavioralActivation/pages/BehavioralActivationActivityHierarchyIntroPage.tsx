import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function BehavioralActivationActivityHierarchyIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Jerarquía de Actividades"
			description="Objetivo: organizar actividades en un orden de prioridad realista para facilitar su cumplimiento progresivo. Al priorizar actividades alcanzables, aumentas la probabilidad de activarte de forma sostenida."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/activacion-conductual/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/activacion-conductual/jerarquia-actividades/registro", {
					state: { activities: [] },
				})
			}
		/>
	);
}

export default BehavioralActivationActivityHierarchyIntroPage;
