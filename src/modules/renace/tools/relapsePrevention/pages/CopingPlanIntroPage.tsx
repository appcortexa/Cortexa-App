import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function CopingPlanIntroPage() {
	const navigate = useNavigate();

	return <ExerciseIntroductionScreen title="Plan de Afrontamiento" description="Objetivo clínico: diseñar estrategias concretas para responder de manera adaptativa ante situaciones de riesgo de recaída. Preparar con anticipación una respuesta facilita actuar con mayor claridad cuando aparezcan situaciones difíciles." backLabel="Volver al catálogo" onBack={() => navigate("/renace/prevencion-recaidas/catalogo")} startLabel="Comenzar" onStart={() => navigate("/renace/prevencion-recaidas/plan-afrontamiento/registro", { state: { records: [] } })} />;
}

export default CopingPlanIntroPage;
