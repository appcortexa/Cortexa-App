import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import renaceLogo from "../../../../../assets/logos/Renace.png";
import { relapsePreventionInterventions } from "../../../relapsePrevention/relapsePreventionInterventions";
import ExerciseCard from "../../shared/components/ExerciseCard";

function RelapsePreventionExerciseCatalogPage() {
	const navigate = useNavigate();

	const openIntervention = (interventionId: string, interventionTitle: string) => {
		if (interventionId === "risk-warning-signs") {
			navigate("/renace/prevencion-recaidas/identificacion-senales-riesgo/introduccion");
			return;
		}
		if (interventionId === "protective-factors") {
			navigate("/renace/prevencion-recaidas/factores-protectores/introduccion");
			return;
		}
		if (interventionId === "coping-plan") {
			navigate("/renace/prevencion-recaidas/plan-afrontamiento/introduccion");
			return;
		}
		if (interventionId === "mental-rehearsal-risk-situation") {
			navigate("/renace/prevencion-recaidas/ensayo-mental/introduccion");
			return;
		}
		if (interventionId === "personal-relapse-prevention-plan") {
			navigate("/renace/prevencion-recaidas/plan-personal-prevencion-recaidas/introduccion");
			return;
		}

		navigate(`/renace/proximamente?modulo=${encodeURIComponent(`Prevención de Recaídas: ${interventionTitle}`)}`);
	};

	return (
		<Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", py: { xs: 4, sm: 6 } }}>
			<Container maxWidth="md">
				<Stack spacing={3}>
					<Box component="img" src={renaceLogo} alt="RENACE" sx={{ width: { xs: 220, sm: 260 }, maxWidth: "100%", height: "auto" }} />
					<Box>
						<Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
							Prevención de Recaídas
						</Typography>
						<Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
							Seleccione la intervención terapéutica que desea utilizar.
						</Typography>
					</Box>
					<Grid container spacing={2.5}>
						{relapsePreventionInterventions.map((intervention) => (
							<Grid key={intervention.id} size={{ xs: 12, md: 6 }}>
								<ExerciseCard title={intervention.title} description={intervention.description} onOpen={() => openIntervention(intervention.id, intervention.title)} />
							</Grid>
						))}
					</Grid>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end" }}>
						<Button variant="outlined" size="large" onClick={() => navigate("/renace")}>Cancelar</Button>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}

export default RelapsePreventionExerciseCatalogPage;
