import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import renaceLogo from "../../../../../assets/logos/Renace.png";
import { antiRuminationInterventions } from "../config/antiRuminationInterventions";
import ExerciseCard from "../../shared/components/ExerciseCard";

function AntiRuminationExerciseCatalogPage() {
	const navigate = useNavigate();

	const openIntervention = (interventionId: string, interventionTitle: string) => {
		if (interventionId === "deteccion-rumiacion") {
			navigate("/renace/antirrumiacion/deteccion-rumiacion/introduccion");
			return;
		}

		if (interventionId === "romper-ciclo") {
			navigate("/renace/antirrumiacion/romper-ciclo/introduccion");
			return;
		}

		if (interventionId === "cambio-atencion") {
			navigate("/renace/antirrumiacion/cambio-atencion/introduccion");
			return;
		}

		if (interventionId === "accion-con-sentido") {
			navigate("/renace/antirrumiacion/accion-con-sentido/introduccion");
			return;
		}

		if (interventionId === "aprendizajes") {
			navigate("/renace/antirrumiacion/aprendizajes/introduccion");
			return;
		}

		navigate(`/renace/proximamente?modulo=${encodeURIComponent(`Antirrumiación: ${interventionTitle}`)}`);
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
							Antirrumiación
						</Typography>
						<Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
							Seleccione la intervención terapéutica que desea utilizar.
						</Typography>
					</Box>

					<Grid container spacing={2.5}>
						{antiRuminationInterventions.map((intervention) => (
							<Grid key={intervention.id} size={{ xs: 12, md: 6 }}>
								<ExerciseCard
									title={intervention.title}
									description={intervention.description}
									onOpen={() => openIntervention(intervention.id, intervention.title)}
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

export default AntiRuminationExerciseCatalogPage;