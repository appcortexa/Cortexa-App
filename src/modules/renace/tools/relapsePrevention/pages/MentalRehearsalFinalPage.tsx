import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRenaceSession } from "../../../context/RenaceSessionContext";
import ExerciseCompletionScreen from "../../shared/components/ExerciseCompletionScreen";

function MentalRehearsalFinalPage() {
	const navigate = useNavigate();
	const { registerIntervention, finishSession } = useRenaceSession();
	const [isFinishing, setIsFinishing] = useState(false);
	const handleFinish = () => {
		if (isFinishing) return;
		setIsFinishing(true);
		registerIntervention({ tool: "prevencion-recaidas", exerciseId: "ensayo-mental", exerciseTitle: "Ensayo Mental de una Situación de Riesgo", completed: true });
		finishSession();
		navigate("/renace");
	};
	return <ExerciseCompletionScreen title="Intervención completada" description="La intervención finalizó correctamente." helperText="Se registrará esta intervención en la sesión actual al volver al menú." actionLabel="Volver al menú RENACE" onAction={handleFinish} disabled={isFinishing} />;
}

export default MentalRehearsalFinalPage;
