import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

function RenaceComingSoonPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const moduleName = searchParams.get("modulo") ?? "Este módulo";

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
						Próximamente
					</Typography>
					<Typography variant="body1" sx={{ color: "text.secondary" }}>
						{moduleName} estará disponible en una próxima entrega.
					</Typography>
					<Button variant="outlined" size="large" onClick={() => navigate("/renace")}>
						Volver al menú RENACE
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default RenaceComingSoonPage;
