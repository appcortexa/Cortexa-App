import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function RelapsePersonalPlanIntroPage() {
	const navigate = useNavigate();

	return <ExerciseIntroductionScreen title="Plan Personal de Prevención de Recaídas" description="Objetivo clínico: integrar las señales de riesgo, los factores protectores y las estrategias de afrontamiento en un plan personal breve que facilite responder de manera adaptativa ante futuras situaciones de riesgo. Este plan resume los recursos personales que deseas recordar y aplicar cuando aparezcan situaciones que puedan aumentar el riesgo de recaída." backLabel="Volver al catálogo" onBack={() => navigate("/renace/prevencion-recaidas/catalogo")} startLabel="Comenzar" onStart={() => navigate("/renace/prevencion-recaidas/plan-personal-prevencion-recaidas/plan")} />;
}

export default RelapsePersonalPlanIntroPage;
