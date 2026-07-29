import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function CognitiveRestructuringEvidenceAnalysisIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Análisis de Evidencias"
			description="Objetivo: aprender a revisar un pensamiento considerando toda la información disponible antes de aceptarlo como verdadero. En muchas ocasiones damos por cierto nuestro primer pensamiento sin detenernos a analizar toda la información disponible. Este ejercicio ayuda a revisar los hechos que apoyan ese pensamiento y aquellos que invitan a cuestionarlo."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/reestructuracion-cognitiva/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/reestructuracion-cognitiva/analisis-evidencias/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default CognitiveRestructuringEvidenceAnalysisIntroPage;