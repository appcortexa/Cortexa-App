import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import renaceLogo from "../../../../../assets/logos/Renace.png";
import { cognitiveRestructuringInterventions } from "../config/cognitiveRestructuringInterventions";
import ExerciseCard from "../../shared/components/ExerciseCard";

function CognitiveRestructuringExerciseCatalogPage() {
	const navigate = useNavigate();

	const openIntervention = (interventionId: string, interventionTitle: string) => {
		if (interventionId === "deteccion-pensamientos-automaticos") {
			navigate("/renace/reestructuracion-cognitiva/deteccion-pensamientos-automaticos/introduccion");
			return;
		}

		if (interventionId === "analisis-evidencias") {
			navigate("/renace/reestructuracion-cognitiva/analisis-evidencias/introduccion");
			return;
		}

		if (interventionId === "pensamientos-alternativos") {
			navigate("/renace/reestructuracion-cognitiva/pensamientos-alternativos/introduccion");
			return;
		}

		if (interventionId === "reencuadre-cognitivo") {
			navigate("/renace/reestructuracion-cognitiva/reencuadre-cognitivo/introduccion");
			return;
		}

		if (interventionId === "tarjeta-afrontamiento") {
			navigate("/renace/reestructuracion-cognitiva/tarjeta-afrontamiento/introduccion");
			return;
		}

		navigate(
			`/renace/proximamente?modulo=${encodeURIComponent(`Reestructuración Cognitiva: ${interventionTitle}`)}`,
		);
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
							Reestructuración Cognitiva
						</Typography>
						<Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
							Seleccione la intervención terapéutica que desea utilizar.
						</Typography>
					</Box>

					<Grid container spacing={2.5}>
						{cognitiveRestructuringInterventions.map((intervention) => (
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

export default CognitiveRestructuringExerciseCatalogPage;
