import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import TemporaryToolScreen from "../../shared/components/TemporaryToolScreen";

function BehavioralActivationSessionPage() {
	const navigate = useNavigate();
	const { registerIntervention } = useRenaceSession();

	return (
		<TemporaryToolScreen
			title="Activación Conductual - Sesión"
			backLabel="Regresar a catálogo"
			onBack={() => navigate("/renace/activacion-conductual/catalogo")}
			nextLabel="Continuar a resumen"
			onNext={() => {
				registerIntervention({
					tool: "activacion-conductual",
					exerciseId: "demo-001",
					exerciseTitle: "Intervención de demostración",
					completed: true,
				});
				navigate("/renace/activacion-conductual/resumen");
			}}
		/>
	);
}

export default BehavioralActivationSessionPage;
