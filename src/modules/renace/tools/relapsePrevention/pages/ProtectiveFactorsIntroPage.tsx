import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function ProtectiveFactorsIntroPage() {
	const navigate = useNavigate();

	return <ExerciseIntroductionScreen title="Factores Protectores" description="Objetivo clínico: identificar los recursos personales, sociales y ambientales que ayudan a reducir el riesgo de recaída y favorecen el mantenimiento del cambio. Reconocer los factores protectores fortalece la capacidad para enfrentar situaciones difíciles y mantener los avances alcanzados." backLabel="Volver al catálogo" onBack={() => navigate("/renace/prevencion-recaidas/catalogo")} startLabel="Comenzar" onStart={() => navigate("/renace/prevencion-recaidas/factores-protectores/registro", { state: { records: [] } })} />;
}

export default ProtectiveFactorsIntroPage;
