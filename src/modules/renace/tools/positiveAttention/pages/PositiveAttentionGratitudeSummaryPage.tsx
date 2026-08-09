import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { PositiveSummaryCard } from "../../../positiveAttention/PositiveSummaryCard";
import type { PositiveAttentionRecord } from "../../../positiveAttention/PositiveAttentionRecord";

function PositiveAttentionGratitudeSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const gratitudeEntries = (location.state as { gratitudeEntries?: PositiveAttentionRecord[] } | undefined)?.gratitudeEntries ?? [];
	const totalEntries = gratitudeEntries.length;
	const averageIntensity =
		totalEntries > 0 ? (gratitudeEntries.reduce((sum, entry) => sum + entry.intensity, 0) / totalEntries).toFixed(1) : "0";
	const uniqueCategories = new Set(gratitudeEntries.map((entry) => entry.emotion)).size;

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
						Resumen de gratitud consciente
					</Typography>
					<PositiveSummaryCard
						title="Resumen"
						indicators={[
							{ label: "Número de registros", value: totalEntries },
							{ label: "Intensidad promedio de gratitud", value: averageIntensity },
							{ label: "Número de categorías diferentes registradas", value: uniqueCategories },
						]}
					/>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button variant="contained" size="large" onClick={() => navigate("/renace/atencion-positiva/gratitud-consciente/final")}>
							Continuar
						</Button>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}

export default PositiveAttentionGratitudeSummaryPage;
