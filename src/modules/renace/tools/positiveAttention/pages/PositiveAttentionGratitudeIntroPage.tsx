import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function PositiveAttentionGratitudeIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Gratitud Consciente"
			description="Objetivo clínico: favorecer el reconocimiento consciente de personas, situaciones o experiencias valiosas presentes en la vida cotidiana. En este ejercicio registrarás aquello por lo que sientes gratitud y reflexionarás brevemente sobre el significado que tiene para ti."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/atencion-positiva/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/atencion-positiva/gratitud-consciente/registro", { state: { gratitudeEntries: [] } })}
		/>
	);
}

export default PositiveAttentionGratitudeIntroPage;
