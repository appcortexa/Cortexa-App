import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function RenaceHomePage() {
	const navigate = useNavigate();

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
				<Stack spacing={2.5} sx={{ alignItems: "center", textAlign: "center" }}>
					<Typography
						variant="h4"
						component="h1"
						sx={{
							fontWeight: 700,
							color: "primary.main",
							fontSize: { xs: "1.8rem", sm: "2.125rem" },
						}}
					>
						RENACE
					</Typography>
					<Typography variant="h6" sx={{ color: "text.primary" }}>
						Tratamiento para Depresión
					</Typography>
					<Typography variant="body1" sx={{ color: "text.secondary" }}>
						Protocolo en desarrollo.
					</Typography>
					<Button variant="outlined" size="large" onClick={() => navigate("/")}>
						Volver a CORTEXA
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default RenaceHomePage;
