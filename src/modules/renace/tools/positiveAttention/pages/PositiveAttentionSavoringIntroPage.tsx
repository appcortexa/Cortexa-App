import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function PositiveAttentionSavoringIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Saboreo de Experiencias Positivas"
			description="Objetivo clínico: favorecer que el paciente prolongue conscientemente una experiencia agradable identificando los elementos que la hicieron significativa. En este ejercicio recordarás una experiencia positiva reciente, identificarás qué fue lo que más disfrutaste y pensarás cómo favorecer que experiencias similares vuelvan a ocurrir."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/atencion-positiva/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/atencion-positiva/saboreo-experiencias/registro", { state: { savoringEntries: [] } })}
		/>
	);
}

export default PositiveAttentionSavoringIntroPage;
