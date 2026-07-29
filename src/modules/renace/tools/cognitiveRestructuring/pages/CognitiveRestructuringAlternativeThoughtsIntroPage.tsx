import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function CognitiveRestructuringAlternativeThoughtsIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Pensamientos Alternativos"
			description="Objetivo clínico: aprender a construir interpretaciones más equilibradas y útiles después de analizar un pensamiento automático. Después de revisar la evidencia disponible, es posible construir una forma diferente de comprender una situación. El objetivo no es pensar de manera positiva, sino desarrollar interpretaciones más objetivas y funcionales."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/reestructuracion-cognitiva/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/reestructuracion-cognitiva/pensamientos-alternativos/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default CognitiveRestructuringAlternativeThoughtsIntroPage;
