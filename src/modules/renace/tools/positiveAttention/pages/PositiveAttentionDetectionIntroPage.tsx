import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function PositiveAttentionDetectionIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Detección de Experiencias Positivas"
			description="Objetivo clínico: entrenar la capacidad de reconocer experiencias agradables que ocurren durante la vida cotidiana. En este ejercicio registrarás pequeños acontecimientos positivos que hayan ocurrido recientemente y la emoción que despertaron en ti."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/atencion-positiva/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/atencion-positiva/deteccion-experiencias/registro", { state: { experiences: [] } })}
		/>
	);
}

export default PositiveAttentionDetectionIntroPage;
