import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function PresentMomentAcceptanceIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Aceptación del Momento Presente"
			description="Objetivo clínico: desarrollar la capacidad de aceptar la experiencia presente sin intentar evitarla, controlarla o cambiarla inmediatamente. Durante esta práctica observarás una experiencia difícil o incómoda y registrarás cómo fue permanecer con ella de manera consciente durante algunos momentos."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/mindfulness/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/mindfulness/aceptacion-momento-presente/registro", { state: { records: [] } })}
		/>
	);
}

export default PresentMomentAcceptanceIntroPage;
