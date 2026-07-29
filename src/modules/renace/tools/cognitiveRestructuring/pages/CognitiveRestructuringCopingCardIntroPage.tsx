import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function CognitiveRestructuringCopingCardIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Tarjeta de Afrontamiento"
			description="Objetivo clínico: sintetizar ideas y estrategias útiles para afrontar futuras situaciones difíciles. Una tarjeta de afrontamiento resume los aprendizajes obtenidos durante la terapia. Tener preparado este recordatorio puede ayudarte a responder de forma más útil cuando vuelvan a aparecer situaciones difíciles."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/reestructuracion-cognitiva/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/reestructuracion-cognitiva/tarjeta-afrontamiento/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default CognitiveRestructuringCopingCardIntroPage;
