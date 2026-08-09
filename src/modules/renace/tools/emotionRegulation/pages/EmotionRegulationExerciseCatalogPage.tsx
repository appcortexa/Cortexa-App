import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import renaceLogo from "../../../../../assets/logos/Renace.png";
import ExerciseCard from "../../shared/components/ExerciseCard";
import { emotionRegulationInterventions } from "../config/emotionRegulationInterventions";

function EmotionRegulationExerciseCatalogPage() {
	const navigate = useNavigate();

	const openIntervention = (interventionId: string, interventionTitle: string) => {
		if (interventionId === "identificacion-emocional") {
			navigate("/renace/regulacion-emocional/identificacion-emocional/introduccion");
			return;
		}

		if (interventionId === "diferenciacion-emocional") {
			navigate("/renace/regulacion-emocional/diferenciacion-emocional/introduccion");
			return;
		}

		if (interventionId === "regulacion-fisiologica") {
			navigate("/renace/regulacion-emocional/regulacion-fisiologica/introduccion");
			return;
		}

		if (interventionId === "reevaluacion-emocional") {
			navigate("/renace/regulacion-emocional/reevaluacion-emocional/introduccion");
			return;
		}

		if (interventionId === "plan-personal-regulacion") {
			navigate("/renace/regulacion-emocional/plan-personal-regulacion/introduccion");
			return;
		}

		navigate(`/renace/proximamente?modulo=${encodeURIComponent(`Regulación Emocional: ${interventionTitle}`)}`);
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
							Regulación Emocional
						</Typography>
						<Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
							Seleccione la intervención terapéutica que desea utilizar.
						</Typography>
					</Box>

					<Grid container spacing={2.5}>
						{emotionRegulationInterventions.map((intervention) => (
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

export default EmotionRegulationExerciseCatalogPage;
