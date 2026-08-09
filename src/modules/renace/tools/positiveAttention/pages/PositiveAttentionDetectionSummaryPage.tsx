import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { PositiveSummaryCard } from "../../../positiveAttention/PositiveSummaryCard";
import type { PositiveAttentionRecord } from "../../../positiveAttention/PositiveAttentionRecord";

function PositiveAttentionDetectionSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const experiences = (location.state as { experiences?: PositiveAttentionRecord[] } | undefined)?.experiences ?? [];
	const totalExperiences = experiences.length;
	const averageIntensity =
		totalExperiences > 0 ? (experiences.reduce((sum, experience) => sum + experience.intensity, 0) / totalExperiences).toFixed(1) : "0";
	const uniqueEmotions = new Set(experiences.map((experience) => experience.emotion)).size;

	return (
		<Box
			sx={{
				bgcolor: "#FFFFFF",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				py: { xs: 4, sm: 6 },
			}}
		>
			<Container maxWidth="sm">
				<Stack spacing={3}>
					<Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
						Resumen de experiencias positivas
					</Typography>
					<PositiveSummaryCard
						title="Resumen"
						indicators={[
							{ label: "Número de experiencias registradas", value: totalExperiences },
							{ label: "Intensidad positiva promedio", value: averageIntensity },
							{ label: "Número de emociones diferentes identificadas", value: uniqueEmotions },
						]}
					/>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button variant="contained" size="large" onClick={() => navigate("/renace/atencion-positiva/deteccion-experiencias/final")}>
							Continuar
						</Button>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}

export default PositiveAttentionDetectionSummaryPage;
