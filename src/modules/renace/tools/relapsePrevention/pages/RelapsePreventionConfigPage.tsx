import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ToolConfigurationCard from "../../shared/components/ToolConfigurationCard";

function RelapsePreventionConfigPage() {
	const navigate = useNavigate();
	const { startSession } = useRenaceSession();

	return (
		<ToolConfigurationCard
			toolName="Prevención de Recaídas"
			toolDescription="Intervenciones para reconocer señales de riesgo y fortalecer recursos de prevención."
			onCancel={() => navigate("/renace")}
			onStart={(expediente) => {
				startSession(expediente);
				navigate("/renace/prevencion-recaidas/catalogo");
			}}
		/>
	);
}

export default RelapsePreventionConfigPage;
