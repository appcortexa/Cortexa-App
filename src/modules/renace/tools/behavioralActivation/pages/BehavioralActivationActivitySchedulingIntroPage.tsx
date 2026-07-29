import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function BehavioralActivationActivitySchedulingIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Programación de Actividades"
			description="Objetivo: planificar actividades concretas para organizar la semana. En este ejercicio registrarás actividad, día, momento del día, dificultad y confianza para realizarla."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/activacion-conductual/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/activacion-conductual/agenda-actividades/programacion", {
					state: { activities: [] },
				})
			}
		/>
	);
}

export default BehavioralActivationActivitySchedulingIntroPage;
