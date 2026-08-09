import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function SelfCompassionKindnessIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Responderse con amabilidad"
			description="Objetivo clínico: aprender a responderse con comprensión y apoyo frente a situaciones difíciles. En este ejercicio identificarás un pensamiento autocrítico y escribirás una respuesta más amable y comprensiva, como si estuvieras acompañando a alguien importante para ti."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/autocompasion/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/autocompasion/responderse-con-amabilidad/registro", { state: { records: [] } })}
		/>
	);
}

export default SelfCompassionKindnessIntroPage;
