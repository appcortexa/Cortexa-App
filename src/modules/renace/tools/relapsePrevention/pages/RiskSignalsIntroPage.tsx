import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function RiskSignalsIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Identificación de Señales de Riesgo"
			description="Objetivo clínico: favorecer el reconocimiento temprano de pensamientos, emociones, situaciones y conductas que podrían aumentar el riesgo de recaída. Identificar oportunamente las señales de riesgo permite actuar antes de que la situación se vuelva más difícil de manejar."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/prevencion-recaidas/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/prevencion-recaidas/identificacion-senales-riesgo/registro", { state: { records: [] } })}
		/>
	);
}

export default RiskSignalsIntroPage;
