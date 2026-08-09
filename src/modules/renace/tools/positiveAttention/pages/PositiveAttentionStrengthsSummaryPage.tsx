import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { PositiveSummaryCard } from "../../../positiveAttention/PositiveSummaryCard";
import type { PositiveAttentionRecord } from "../../../positiveAttention/PositiveAttentionRecord";

function PositiveAttentionStrengthsSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const strengths = (location.state as { strengths?: PositiveAttentionRecord[] } | undefined)?.strengths ?? [];
	const totalStrengths = strengths.length;
	const averageUtility =
		totalStrengths > 0 ? (strengths.reduce((sum, entry) => sum + entry.intensity, 0) / totalStrengths).toFixed(1) : "0";
	const uniqueStrengths = new Set(strengths.map((entry) => entry.strength)).size;

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
						Resumen de fortalezas personales
					</Typography>
					<PositiveSummaryCard
						title="Resumen"
						indicators={[
							{ label: "Número de fortalezas registradas", value: totalStrengths },
							{ label: "Utilidad promedio", value: averageUtility },
							{ label: "Número de fortalezas diferentes utilizadas", value: uniqueStrengths },
						]}
					/>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button variant="contained" size="large" onClick={() => navigate("/renace/atencion-positiva/fortalezas-personales/final")}>
							Continuar
						</Button>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}

export default PositiveAttentionStrengthsSummaryPage;
