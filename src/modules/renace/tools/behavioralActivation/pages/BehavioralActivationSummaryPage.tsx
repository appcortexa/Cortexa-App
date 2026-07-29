import { useNavigate } from "react-router-dom";

import TemporaryToolScreen from "../../shared/components/TemporaryToolScreen";

function BehavioralActivationSummaryPage() {
	const navigate = useNavigate();

	return (
		<TemporaryToolScreen
			title="Activación Conductual - Resumen"
			backLabel="Regresar a sesión"
			onBack={() => navigate("/renace/activacion-conductual/sesion")}
			nextLabel="Continuar a resultados"
			onNext={() => navigate("/renace/activacion-conductual/resultados")}
		/>
	);
}

export default BehavioralActivationSummaryPage;
