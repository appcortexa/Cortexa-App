import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function BodyScanIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Escaneo Corporal"
			description="Objetivo clínico: favorecer la conciencia de las sensaciones físicas presentes en distintas partes del cuerpo, desarrollando una observación atenta y abierta. Durante esta práctica recorrerás mentalmente diferentes zonas del cuerpo y registrarás las sensaciones que hayan llamado tu atención, sin intentar modificarlas."
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/mindfulness/catalogo")}
			startLabel="Comenzar"
			onStart={() => navigate("/renace/mindfulness/escaneo-corporal/registro", { state: { records: [] } })}
		/>
	);
}

export default BodyScanIntroPage;
