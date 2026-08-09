import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { PositiveSummaryCard } from "../../../positiveAttention/PositiveSummaryCard";

type PositiveAttentionSavoringEntry = {
	description: string;
	emotion: string;
	intensity: number;
	reflection: string;
};

function PositiveAttentionSavoringSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const savoringEntries = (location.state as { savoringEntries?: PositiveAttentionSavoringEntry[] } | undefined)?.savoringEntries ?? [];
	const totalEntries = savoringEntries.length;
	const averageEnjoyment =
		totalEntries > 0 ? (savoringEntries.reduce((sum, entry) => sum + entry.intensity, 0) / totalEntries).toFixed(1) : "0";
	const uniqueStrategies = new Set(savoringEntries.map((entry) => entry.reflection)).size;

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
						Resumen de saboreo de experiencias positivas
					</Typography>
					<PositiveSummaryCard
						title="Resumen"
						indicators={[
							{ label: "Número de experiencias registradas", value: totalEntries },
							{ label: "Nivel promedio de disfrute", value: averageEnjoyment },
							{ label: "Número de estrategias diferentes para repetir experiencias positivas", value: uniqueStrategies },
						]}
					/>
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button variant="contained" size="large" onClick={() => navigate("/renace/atencion-positiva/saboreo-experiencias/final")}>
							Continuar
						</Button>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}

export default PositiveAttentionSavoringSummaryPage;
