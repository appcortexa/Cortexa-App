import { useNavigate } from "react-router-dom";

import ExerciseIntroductionScreen from "../../shared/components/ExerciseIntroductionScreen";

function AntiRuminationActionWithMeaningIntroPage() {
	const navigate = useNavigate();

	return (
		<ExerciseIntroductionScreen
			title="Acción con Sentido"
			description='Objetivo clínico: aprender a realizar acciones valiosas incluso cuando los pensamientos repetitivos siguen presentes. "La rumiación no tiene que desaparecer para poder actuar. En este ejercicio practicarás realizar pequeñas acciones que sean importantes para ti, aun cuando esos pensamientos continúen apareciendo."'
			backLabel="Volver al catálogo"
			onBack={() => navigate("/renace/antirrumiacion/catalogo")}
			startLabel="Comenzar"
			onStart={() =>
				navigate("/renace/antirrumiacion/accion-con-sentido/registro", {
					state: { exercises: [] },
				})
			}
		/>
	);
}

export default AntiRuminationActionWithMeaningIntroPage;
