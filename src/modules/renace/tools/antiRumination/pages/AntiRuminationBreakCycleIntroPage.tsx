import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function AntiRuminationBreakCycleIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Romper el Ciclo"
			description='Objetivo clínico: practicar estrategias sencillas para interrumpir un episodio de rumiación y observar qué ocurre después de utilizarlas. "Cuando una persona queda atrapada en pensamientos repetitivos, puede aprender a interrumpir ese ciclo mediante diferentes estrategias. El objetivo de este ejercicio no es eliminar los pensamientos, sino practicar formas de responder de manera diferente."'
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/antirrumiacion/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/antirrumiacion/romper-ciclo/registro", {
					state: { exercises: [] },
				})
			}
		/>
	);
}

export default AntiRuminationBreakCycleIntroPage;