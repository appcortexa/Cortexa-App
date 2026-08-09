import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ToolConfigurationCard from "../../shared/components/ToolConfigurationCard";

function PositiveAttentionConfigPage() {
	const navigate = useNavigate();
	const { startSession } = useRenaceSession();

	return (
		<ToolConfigurationCard
			toolName="Atención Positiva"
			toolDescription="Registra experiencias positivas recientes y reconoce la emoción que despertaron para reforzar la atención en aspectos valiosos de la vida cotidiana."
			onCancel={() => navigate("/renace")}
			onStart={(expediente) => {
				startSession(expediente);
				navigate("/renace/atencion-positiva/catalogo");
			}}
		/>
	);
}

export default PositiveAttentionConfigPage;
