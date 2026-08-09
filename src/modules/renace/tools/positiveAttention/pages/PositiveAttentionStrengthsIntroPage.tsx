import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function PositiveAttentionStrengthsIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Fortalezas Personales"
			description="Objetivo clínico: reconocer las fortalezas personales utilizadas en situaciones reales y valorar cómo ayudaron a afrontar dichas experiencias. En este ejercicio identificarás recursos personales que utilizaste recientemente y reflexionarás sobre la manera en que te ayudaron."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/atencion-positiva/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/atencion-positiva/fortalezas-personales/registro", { state: { strengths: [] } })}
		/>
	);
}

export default PositiveAttentionStrengthsIntroPage;
