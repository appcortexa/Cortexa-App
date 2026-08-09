import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import renaceLogo from "../../../../../assets/logos/Renace.png";
import ExerciseCard from "../../shared/components/ExerciseCard";

function MindfulnessExerciseCatalogPage() {
	const navigate = useNavigate();

	return (
		<Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", py: { xs: 4, sm: 6 } }}>
			<Container maxWidth="md">
				<Stack spacing={3}>
					<Box
						component="img"
						src={renaceLogo}
						alt="RENACE"
						sx={{ width: { xs: 220, sm: 260 }, maxWidth: "100%", height: "auto" }}
					/>

					<Box>
						<Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
							Mindfulness Clínico
						</Typography>
						<Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
							Seleccione la intervención terapéutica que desea utilizar.
						</Typography>
					</Box>

					<Grid container spacing={2.5}>
						<Grid size={{ xs: 12, md: 6 }}>
							<ExerciseCard
								title="Atención a la Respiración"
								description="Entrena el regreso voluntario de la atención al momento presente usando la respiración como ancla."
								onOpen={() => navigate("/renace/mindfulness/atencion-respiracion/introduccion")}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<ExerciseCard
								title="Observación sin Juicio"
								description="Entrena la observación de pensamientos, emociones o sensaciones sin calificarlos como buenos o malos."
								onOpen={() => navigate("/renace/mindfulness/observacion-sin-juicio/introduccion")}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<ExerciseCard
								title="Escaneo Corporal"
								description="Favorece la conciencia de las sensaciones físicas presentes mediante la observación atenta de distintas zonas del cuerpo."
								onOpen={() => navigate("/renace/mindfulness/escaneo-corporal/introduccion")}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<ExerciseCard
								title="Aceptación del Momento Presente"
								description="Desarrolla la capacidad de aceptar la experiencia presente sin intentar evitarla, controlarla o cambiarla inmediatamente."
								onOpen={() => navigate("/renace/mindfulness/aceptacion-momento-presente/introduccion")}
							/>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<ExerciseCard
								title="Plan Personal de Mindfulness"
								description="Integra las habilidades de atención plena desarrolladas durante el módulo en un plan breve y concreto para tu vida cotidiana."
								onOpen={() => navigate("/renace/mindfulness/plan-personal/introduccion")}
							/>
						</Grid>
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

export default MindfulnessExerciseCatalogPage;
