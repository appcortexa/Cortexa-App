import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function BreathingAttentionIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Atención a la Respiración"
			description="Objetivo clínico: entrenar la capacidad de regresar voluntariamente la atención al momento presente utilizando la respiración como ancla. Durante esta práctica observarás tu respiración y registrarás cómo fue tu experiencia. No buscamos evitar distracciones; buscamos notar cuándo aparecen y regresar suavemente la atención a la respiración."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/mindfulness/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/mindfulness/atencion-respiracion/registro", { state: { practices: [] } })}
		/>
	);
}

export default BreathingAttentionIntroPage;
