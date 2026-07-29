import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function CognitiveRestructuringAutomaticThoughtsIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Detección de Pensamientos Automáticos"
			description="Objetivo: identificar pensamientos automáticos que aparecen ante situaciones específicas para aumentar conciencia cognitiva. Un pensamiento automático es una idea rápida que aparece sin analizarse y puede influir en la emoción y la conducta."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/reestructuracion-cognitiva/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/reestructuracion-cognitiva/deteccion-pensamientos-automaticos/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default CognitiveRestructuringAutomaticThoughtsIntroPage;
