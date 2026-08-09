import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { APP_VERSION } from "../config/app";

const upcomingModules: string[] = [];

function MainMenuPage() {
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
				<Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center", textAlign: "center" }}>
					<Box
						component="img"
						src="/logo/logo-reconecta.png"
						alt="Reconecta"
						sx={{
							width: { xs: 180, sm: 220 },
							maxWidth: "100%",
							height: "auto",
						}}
					/>

					<Box>
						<Typography
							variant="h4"
							component="h1"
							sx={{
								fontWeight: 700,
								color: "primary.main",
								fontSize: { xs: "1.8rem", sm: "2.125rem" },
							}}
						>
							Reconecta
						</Typography>
						<Typography
							variant="subtitle1"
							sx={{ color: "text.secondary", mt: 1, fontSize: { xs: "1rem", sm: "1.125rem" } }}
						>
							Plataforma de Neuromodulación.
						</Typography>
					</Box>

					<Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 420 }}>
						Seleccione el módulo que desea utilizar:
					</Typography>

					<Stack sx={{ width: "100%" }} spacing={2}>
						<Card variant="outlined" sx={{ borderRadius: 3 }}>
							<CardActionArea onClick={() => navigate("/go-no-go")} sx={{ borderRadius: 3 }}>
								<CardContent sx={{ px: 3, py: 2.5, textAlign: "left" }}>
									<Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
										Go / No-Go
									</Typography>
									<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, lineHeight: 1.6 }}>
										Evaluación y entrenamiento del control inhibitorio.
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>

						<Card variant="outlined" sx={{ borderRadius: 3 }}>
							<CardActionArea onClick={() => navigate("/cue-exposure")} sx={{ borderRadius: 3 }}>
								<CardContent sx={{ px: 3, py: 2.5, textAlign: "left" }}>
									<Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
										Cue Exposure
									</Typography>
									<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, lineHeight: 1.6 }}>
										Exposición controlada a estímulos relacionados con la sustancia.
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>

						<Card variant="outlined" sx={{ borderRadius: 3 }}>
							<CardActionArea onClick={() => navigate("/urge-surfing")} sx={{ borderRadius: 3 }}>
								<CardContent sx={{ px: 3, py: 2.5, textAlign: "left" }}>
									<Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
										Urge Surfing
									</Typography>
									<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, lineHeight: 1.6 }}>
										Entrenamiento guiado para el manejo consciente del craving.
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					</Stack>

					<Box sx={{ width: "100%", textAlign: "left", pt: 1 }}>
						<Stack spacing={1.5}>
							<Card variant="outlined" sx={{ borderRadius: 3 }}>
								<CardActionArea onClick={() => navigate("/mindfulness")} sx={{ borderRadius: 3 }}>
									<CardContent sx={{ px: 3, py: 2.5, textAlign: "left" }}>
										<Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
											Mindfulness
										</Typography>
										<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, lineHeight: 1.6 }}>
											Práctica guiada para entrenar la atención y la regulación emocional.
										</Typography>
									</CardContent>
								</CardActionArea>
							</Card>

							<Card variant="outlined" sx={{ borderRadius: 3 }}>
								<CardActionArea onClick={() => navigate("/breathing")} sx={{ borderRadius: 3 }}>
									<CardContent sx={{ px: 3, py: 2.5, textAlign: "left" }}>
										<Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
											Respiración Diafragmática
										</Typography>
										<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, lineHeight: 1.6 }}>
											Ejercicios guiados de respiración diafragmática para favorecer la regulación fisiológica y emocional durante la estimulación con tDCS.
										</Typography>
									</CardContent>
								</CardActionArea>
							</Card>

							{upcomingModules.map((moduleName) => (
								<Card
									key={moduleName}
									variant="outlined"
									sx={{
										borderRadius: 3,
										opacity: 0.6,
										bgcolor: "action.hover",
									}}
								>
									<CardContent sx={{ px: 3, py: 2.25 }}>
										<Typography variant="h6" sx={{ fontWeight: 700, color: "text.secondary" }}>
											{moduleName}
										</Typography>
										<Typography variant="body2" sx={{ color: "text.disabled", mt: 0.75 }}>
											Disponible en próximas versiones
										</Typography>
									</CardContent>
								</Card>
							))}
						</Stack>
					</Box>

					<Box sx={{ width: "100%", textAlign: "left", pt: 1 }}>
						<Button variant="outlined" size="large" onClick={() => navigate("/")}>
							← Volver a CORTEXA
						</Button>
					</Box>

					<Typography variant="body2" sx={{ color: "text.secondary", pt: 1 }}>
						Versión {APP_VERSION}
					</Typography>
				</Box>
			</Container>
		</Box>
	);
}

export default MainMenuPage;