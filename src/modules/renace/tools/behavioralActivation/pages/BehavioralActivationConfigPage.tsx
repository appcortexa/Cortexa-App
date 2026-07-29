import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ToolConfigurationCard from "../../shared/components/ToolConfigurationCard";

function BehavioralActivationConfigPage() {
	const navigate = useNavigate();
	const { startSession } = useRenaceSession();

	return (
		<ToolConfigurationCard
			toolName="Activación Conductual"
			toolDescription="Prácticas estructuradas para aumentar conductas con sentido y contacto con reforzadores saludables."
			onCancel={() => navigate("/renace")}
			onStart={(expediente) => {
				startSession(expediente);
				navigate("/renace/activacion-conductual/catalogo");
			}}
		/>
	);
}

export default BehavioralActivationConfigPage;
