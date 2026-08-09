import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function ObservationWithoutJudgmentIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Observación sin Juicio"
			description="Objetivo clínico: entrenar la capacidad de observar pensamientos, emociones o sensaciones sin calificarlos como buenos o malos. Durante esta práctica registrarás aquello que apareció en tu experiencia y observarás si surgió una tendencia automática a juzgarlo. El objetivo no es eliminar los juicios, sino reconocerlos con mayor claridad."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/mindfulness/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/mindfulness/observacion-sin-juicio/registro", { state: { records: [] } })}
		/>
	);
}

export default ObservationWithoutJudgmentIntroPage;
