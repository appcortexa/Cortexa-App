import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function EmotionPhysiologicalIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Regulación Fisiológica"
			description="Objetivo clínico: observar cómo cambia la intensidad emocional después de utilizar una estrategia breve de regulación fisiológica. Después de realizar una estrategia de regulación dirigida por tu terapeuta, registrarás cómo cambió tu experiencia emocional y corporal."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/regulacion-emocional/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/regulacion-emocional/regulacion-fisiologica/registro", {
					state: { records: [] },
				})
			}
		/>
	);
}

export default EmotionPhysiologicalIntroPage;
