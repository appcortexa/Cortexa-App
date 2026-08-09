import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ToolConfigurationCard from "../../shared/components/ToolConfigurationCard";

function EmotionRegulationConfigPage() {
	const navigate = useNavigate();
	const { startSession } = useRenaceSession();

	return (
		<ToolConfigurationCard
			toolName="Regulación Emocional"
			toolDescription="Herramientas para reconocer emociones, medir su intensidad y observar señales físicas asociadas."
			onCancel={() => navigate("/renace")}
			onStart={(expediente) => {
				startSession(expediente);
				navigate("/renace/regulacion-emocional/catalogo");
			}}
		/>
	);
}

export default EmotionRegulationConfigPage;
