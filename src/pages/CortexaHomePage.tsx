import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Stack,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/hooks/useAuth";
import cortexaLogo from "../assets/logos/cortexa.png";

function CortexaHomePage() {
	const navigate = useNavigate();
	const { signOut } = useAuth();
	const [confirmingSignOut, setConfirmingSignOut] = useState(false);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const [signOutError, setSignOutError] = useState<string | null>(null);

	const handleSignOut = async () => {
		setIsSigningOut(true);
		setSignOutError(null);

		try {
			await signOut();
			navigate("/login", { replace: true });
		} catch {
			setSignOutError("No fue posible cerrar sesión. Inténtalo de nuevo.");
		} finally {
			setIsSigningOut(false);
		}
	};

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

					<Button
						variant="text"
						color="inherit"
						onClick={() => setConfirmingSignOut(true)}
						sx={{ alignSelf: "center", color: "text.secondary", textTransform: "none" }}
					>
						Cerrar sesión
					</Button>
				</Stack>
			</Container>

			<Dialog open={confirmingSignOut} onClose={isSigningOut ? undefined : () => setConfirmingSignOut(false)}>
				<DialogTitle>Cerrar sesión</DialogTitle>
				<DialogContent>
					<DialogContentText>
						¿Quieres cerrar tu sesión en este dispositivo?
					</DialogContentText>
					{signOutError && (
						<Typography color="error" variant="body2" sx={{ mt: 2 }}>
							{signOutError}
						</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button disabled={isSigningOut} onClick={() => setConfirmingSignOut(false)}>Cancelar</Button>
					<Button disabled={isSigningOut} onClick={handleSignOut} variant="contained">
						Cerrar sesión
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default CortexaHomePage;
