import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function SelfCompassionLetterIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Carta compasiva hacia uno mismo"
			description="Objetivo clínico: practicar una forma más comprensiva y amable de dirigirse a uno mismo frente a las dificultades. En este ejercicio escribirás una carta dirigida a ti mismo como si estuvieras acompañando con comprensión y respeto a una persona importante para ti que atraviesa una situación difícil."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/autocompasion/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/autocompasion/carta-compasiva/registro")}
		/>
	);
}

export default SelfCompassionLetterIntroPage;
