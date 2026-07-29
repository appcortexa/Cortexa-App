import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ToolConfigurationCard from "../../shared/components/ToolConfigurationCard";

function CognitiveRestructuringConfigPage() {
	const navigate = useNavigate();
	const { startSession } = useRenaceSession();

	return (
		<ToolConfigurationCard
			toolName="Reestructuración Cognitiva"
			toolDescription="Entrenamiento para identificar, cuestionar y reformular pensamientos automáticos disfuncionales."
			onCancel={() => navigate("/renace")}
			onStart={(expediente) => {
				startSession(expediente);
				navigate("/renace/reestructuracion-cognitiva/catalogo");
			}}
		/>
	);
}

export default CognitiveRestructuringConfigPage;
