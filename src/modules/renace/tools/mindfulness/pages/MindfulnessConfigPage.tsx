import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ToolConfigurationCard from "../../shared/components/ToolConfigurationCard";

function MindfulnessConfigPage() {
	const navigate = useNavigate();
	const { startSession } = useRenaceSession();

	return (
		<ToolConfigurationCard
			toolName="Mindfulness Clínico"
			toolDescription="Prácticas de atención plena para entrenar el regreso voluntario al momento presente."
			onCancel={() => navigate("/renace")}
			onStart={(expediente) => {
				startSession(expediente);
				navigate("/renace/mindfulness/catalogo");
			}}
		/>
	);
}

export default MindfulnessConfigPage;
