import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import cortexaLogo from "../assets/logos/cortexa.png";

function CortexaHomePage() {
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
				<Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
					<Box>
						<Box
							component="img"
							src={cortexaLogo}
							alt="Logo CORTEXA"
							sx={{
								display: "block",
								mx: "auto",
								width: { xs: 240, sm: 260, md: 280 },
								height: "auto",
								mb: 1,
							}}
						/>
						<Typography
							variant="subtitle1"
							sx={{ color: "text.secondary", mt: 0.5, fontSize: { xs: "1rem", sm: "1.125rem" } }}
						>
							Plataforma de Neuromodulación Cognitiva
						</Typography>
					</Box>

					<Stack spacing={2} sx={{ width: "100%" }}>
						<Card variant="outlined" sx={{ borderRadius: 3 }}>
							<CardContent sx={{ px: 3, py: 3, textAlign: "left" }}>
								<Stack spacing={2}>
									<Box>
										<Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
											RECONECTA
										</Typography>
										<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, lineHeight: 1.6 }}>
											Tratamiento para Trastornos por Consumo de Sustancias
										</Typography>
									</Box>
									<Button variant="contained" size="large" onClick={() => navigate("/reconecta")}>
										Ingresar
									</Button>
								</Stack>
							</CardContent>
						</Card>

						<Card variant="outlined" sx={{ borderRadius: 3 }}>
							<CardContent sx={{ px: 3, py: 3, textAlign: "left" }}>
								<Stack spacing={2}>
									<Box>
										<Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
											RENACE
										</Typography>
										<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, lineHeight: 1.6 }}>
											Tratamiento para Depresión
										</Typography>
									</Box>
									<Button variant="contained" size="large" onClick={() => navigate("/renace")}>
										Ingresar
									</Button>
								</Stack>
							</CardContent>
						</Card>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}

export default CortexaHomePage;
