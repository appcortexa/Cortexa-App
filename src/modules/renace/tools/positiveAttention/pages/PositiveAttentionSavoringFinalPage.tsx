import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ExerciseCompletionScreen from "../../shared/components/ExerciseCompletionScreen";

function PositiveAttentionSavoringFinalPage() {
	const navigate = useNavigate();
	const { registerIntervention, finishSession } = useRenaceSession();
	const [isFinishing, setIsFinishing] = useState(false);

	const handleFinish = () => {
		if (isFinishing) {
			return;
		}

		setIsFinishing(true);
		registerIntervention({
			tool: "atencion-positiva",
			exerciseId: "saboreo-experiencias",
			exerciseTitle: "Saboreo de Experiencias Positivas",
			completed: true,
		});
		finishSession();
		navigate("/renace");
	};

	return (
		<ExerciseCompletionScreen
			title="Intervención completada"
			description="La intervención finalizó correctamente."
			helperText="Se registrará esta intervención en la sesión actual al volver al menú."
			actionLabel="Volver al menú RENACE"
			onAction={handleFinish}
			disabled={isFinishing}
		/>
	);
}

export default PositiveAttentionSavoringFinalPage;
