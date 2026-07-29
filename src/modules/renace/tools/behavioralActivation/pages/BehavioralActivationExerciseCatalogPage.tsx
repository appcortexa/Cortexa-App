import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import renaceLogo from "../../../../../assets/logos/Renace.png";
import { behavioralActivationExercises } from "../config/behavioralActivationExercises";
import ExerciseCard from "../../shared/components/ExerciseCard";

function BehavioralActivationExerciseCatalogPage() {
	const navigate = useNavigate();

	const openExercise = (exerciseId: string, exerciseTitle: string) => {
		if (exerciseId === "agenda-actividades") {
			navigate("/renace/activacion-conductual/agenda-actividades/introduccion");
			return;
		}

		if (exerciseId === "registro-placer-logro") {
			navigate("/renace/activacion-conductual/registro-placer-logro/introduccion");
			return;
		}

		if (exerciseId === "identificacion-evitacion") {
			navigate("/renace/activacion-conductual/identificacion-evitacion/introduccion");
			return;
		}

		if (exerciseId === "jerarquia-actividades") {
			navigate("/renace/activacion-conductual/jerarquia-actividades/introduccion");
			return;
		}

		if (exerciseId === "plan-semanal") {
			navigate("/renace/activacion-conductual/plan-semanal/introduccion");
			return;
		}

		navigate(`/renace/proximamente?modulo=${encodeURIComponent(`Activación Conductual: ${exerciseTitle}`)}`);
	};

	return (
		<Box
			sx={{
				bgcolor: "#FFFFFF",
				minHeight: "100vh",
				py: { xs: 4, sm: 6 },
			}}
		>
			<Container maxWidth="md">
				<Stack spacing={3}>
					<Box
						component="img"
						src={renaceLogo}
						alt="RENACE"
						sx={{
							width: { xs: 220, sm: 260 },
							maxWidth: "100%",
							height: "auto",
						}}
					/>

					<Box>
						<Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
							Activación Conductual
						</Typography>
						<Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
							Seleccione el ejercicio terapéutico que desea utilizar.
						</Typography>
					</Box>

					<Grid container spacing={2.5}>
						{behavioralActivationExercises.map((exercise) => (
							<Grid key={exercise.id} size={{ xs: 12, md: 6 }}>
								<ExerciseCard
									title={exercise.title}
									description={exercise.description}
									onOpen={() => openExercise(exercise.id, exercise.title)}
								/>
							</Grid>
						))}
					</Grid>

					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end" }}>
						<Button variant="outlined" size="large" onClick={() => navigate("/renace")}>
							Cancelar
						</Button>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}

export default BehavioralActivationExerciseCatalogPage;
