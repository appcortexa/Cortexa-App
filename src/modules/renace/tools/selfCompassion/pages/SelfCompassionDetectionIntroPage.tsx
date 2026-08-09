import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function SelfCompassionDetectionIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Detección del diálogo autocrítico"
			description="Objetivo clínico: reconocer el diálogo interno autocrítico presente en distintas situaciones cotidianas. En este ejercicio identificarás momentos en los que aparecieron pensamientos críticos hacia ti mismo y registrarás cómo te hicieron sentir."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/autocompasion/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/autocompasion/deteccion-dialogo-autocritico/registro", { state: { records: [] } })}
		/>
	);
}

export default SelfCompassionDetectionIntroPage;
