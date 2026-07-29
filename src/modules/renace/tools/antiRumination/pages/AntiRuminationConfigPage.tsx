import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ToolConfigurationCard from "../../shared/components/ToolConfigurationCard";

function AntiRuminationConfigPage() {
	const navigate = useNavigate();
	const { startSession } = useRenaceSession();

	return (
		<ToolConfigurationCard
			toolName="Antirrumiación"
			toolDescription="Estrategias para interrumpir bucles rumiativos y recuperar foco en acciones concretas del presente."
			onCancel={() => navigate("/renace")}
			onStart={(expediente) => {
				startSession(expediente);
				navigate("/renace/antirrumiacion/catalogo");
			}}
		/>
	);
}

export default AntiRuminationConfigPage;