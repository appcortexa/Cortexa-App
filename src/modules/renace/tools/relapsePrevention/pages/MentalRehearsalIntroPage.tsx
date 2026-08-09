import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function MentalRehearsalIntroPage() {
	const navigate = useNavigate();

	return <ExerciseIntroductionScreen title="Ensayo Mental de una Situación de Riesgo" description="Objetivo clínico: practicar mentalmente la aplicación del plan de afrontamiento ante una situación de riesgo, fortaleciendo la preparación y la confianza para actuar de manera adaptativa. Imaginar paso a paso cómo responderías ante una situación difícil ayuda a preparar respuestas más eficaces cuando ocurra en la vida real." backLabel="Volver al catálogo" onBack={() => navigate("/renace/prevencion-recaidas/catalogo")} startLabel="Comenzar" onStart={() => navigate("/renace/prevencion-recaidas/ensayo-mental/registro", { state: { records: [] } })} />;
}

export default MentalRehearsalIntroPage;
