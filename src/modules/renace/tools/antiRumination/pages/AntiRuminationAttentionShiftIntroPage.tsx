import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function AntiRuminationAttentionShiftIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Cambio de Atención"
			description='Objetivo clínico: aprender a dirigir voluntariamente la atención hacia actividades elegidas de forma consciente cuando aparece la rumiación. "La atención puede dirigirse voluntariamente. En este ejercicio practicarás cambiar el foco de tu atención desde los pensamientos repetitivos hacia actividades elegidas de manera consciente."'
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/antirrumiacion/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/antirrumiacion/cambio-atencion/registro", {
					state: { exercises: [] },
				})
			}
		/>
	);
}

export default AntiRuminationAttentionShiftIntroPage;