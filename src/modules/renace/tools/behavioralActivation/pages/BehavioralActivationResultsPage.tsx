import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import TemporaryToolScreen from "../../shared/components/TemporaryToolScreen";

function BehavioralActivationResultsPage() {
	const navigate = useNavigate();
	const { finishSession } = useRenaceSession();

	return (
		<TemporaryToolScreen
			title="Activación Conductual - Resultados"
			backLabel="Regresar a resumen"
			onBack={() => navigate("/renace/activacion-conductual/resumen")}
			nextLabel="Volver al menú RENACE"
			onNext={() => {
				finishSession();
				navigate("/renace");
			}}
		/>
	);
}

export default BehavioralActivationResultsPage;
