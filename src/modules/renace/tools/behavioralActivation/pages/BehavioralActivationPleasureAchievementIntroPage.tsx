import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function BehavioralActivationPleasureAchievementIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Registro Placer–Logro"
			description="Este ejercicio ayuda a observar de forma concreta qué actividades del día aumentan tu sensación de placer y de logro para orientar mejor tu activación conductual."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/activacion-conductual/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/activacion-conductual/registro-placer-logro/registro", {
					state: { entries: [] },
				})
			}
		/>
	);
}

export default BehavioralActivationPleasureAchievementIntroPage;
