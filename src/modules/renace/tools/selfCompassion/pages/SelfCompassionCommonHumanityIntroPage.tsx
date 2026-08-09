import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function SelfCompassionCommonHumanityIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Humanidad Compartida"
			description="Objetivo clínico: reconocer que las dificultades personales también forman parte de la experiencia humana. En este ejercicio reflexionarás sobre una situación difícil y explorarás cómo otras personas también pueden vivir experiencias similares, sin minimizar lo que tú has sentido."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/autocompasion/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/autocompasion/humanidad-compartida/registro", { state: { records: [] } })
			}
		/>
	);
}

export default SelfCompassionCommonHumanityIntroPage;
