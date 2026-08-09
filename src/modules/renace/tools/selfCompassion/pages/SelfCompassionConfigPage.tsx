import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ToolConfigurationCard from "../../shared/components/ToolConfigurationCard";

function SelfCompassionConfigPage() {
	const navigate = useNavigate();
	const { startSession } = useRenaceSession();

	return (
		<ToolConfigurationCard
			toolName="Autocompasión"
			toolDescription="Prácticas guiadas para reconocer el diálogo autocrítico y promover una relación más amable con uno mismo."
			onCancel={() => navigate("/renace")}
			onStart={(expediente) => {
				startSession(expediente);
				navigate("/renace/autocompasion/catalogo");
			}}
		/>
	);
}

export default SelfCompassionConfigPage;
