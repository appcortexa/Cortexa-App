import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import RenaceModuleCard from "../components/RenaceModuleCard";
import renaceLogo from "../../../assets/logos/renace.png";

type RenaceModule = {
	titulo: string;
	descripcion: string;
};

const renaceModules: RenaceModule[] = [
	{
		titulo: "Activación Conductual",
		descripcion: "Prácticas estructuradas para aumentar conductas con sentido y contacto con reforzadores saludables.",
	},
	{
		titulo: "Reestructuración Cognitiva",
		descripcion: "Entrenamiento para identificar, cuestionar y reformular pensamientos automáticos disfuncionales.",
	},
	{
		titulo: "Antirrumiación",
		descripcion: "Estrategias para interrumpir bucles rumiativos y recuperar foco en acciones concretas del presente.",
	},
	{
		titulo: "Regulación Emocional",
		descripcion: "Recursos prácticos para reconocer emociones y responder de forma adaptativa en momentos de intensidad.",
	},
	{
		titulo: "Atención Positiva",
		descripcion: "Ejercicios orientados a detectar experiencias valiosas y ampliar sesgos atencionales saludables.",
	},
	{
		titulo: "Autocompasión",
		descripcion: "Prácticas guiadas de trato amable hacia uno mismo para reducir autocrítica y vergüenza.",
	},
	{
		titulo: "Respiración",
		descripcion: "Acceso rápido al módulo de respiración para regulación fisiológica y emocional.",
	},
	{
		titulo: "Mindfulness",
		descripcion: "Acceso rápido a prácticas de atención plena para estabilización atencional y autocuidado.",
	},
];

function RenaceMainMenuPage() {
	const navigate = useNavigate();
	const behavioralActivationTitle = "Activación Conductual";
	const cognitiveRestructuringTitle = "Reestructuración Cognitiva";
	const antiRuminationTitle = "Antirrumiación";

	const openComingSoon = (moduleTitle: string) => {
		if (moduleTitle === behavioralActivationTitle) {
			navigate("/renace/activacion-conductual/configuracion");
			return;
		}

		if (moduleTitle === cognitiveRestructuringTitle) {
			navigate("/renace/reestructuracion-cognitiva/configuracion");
			return;
		}

		if (moduleTitle === antiRuminationTitle) {
			navigate("/renace/antirrumiacion/configuracion");
			return;
		}

		navigate(`/renace/proximamente?modulo=${encodeURIComponent(moduleTitle)}`);
	};

	return (
		<Box
			sx={{
				bgcolor: "#FFFFFF",
				minHeight: "100vh",
				pt: { xs: 6, sm: 8 },
				pb: { xs: 4, sm: 6 },
			}}
		>
			<Container maxWidth="md">
				<Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
					<Box
						component="img"
						src={renaceLogo}
						alt="RENACE"
						sx={{
							width: { xs: 300, sm: 325, md: 350 },
							maxWidth: "100%",
							height: "auto",
							mb: -1,
						}}
					/>
					<Typography variant="h6" sx={{ color: "text.primary" }}>
						Tratamiento para Depresión.
					</Typography>

					<Grid container spacing={2} sx={{ width: "100%", mt: 0.5 }}>
						{renaceModules.map((moduleItem) => (
							<Grid key={moduleItem.titulo} size={{ xs: 12, sm: 6 }}>
								<RenaceModuleCard
									titulo={moduleItem.titulo}
									descripcion={moduleItem.descripcion}
									boton="Abrir"
									onClick={() => openComingSoon(moduleItem.titulo)}
								/>
							</Grid>
						))}
					</Grid>

					<Box sx={{ width: "100%", textAlign: "left", pt: 1 }}>
						<Button variant="outlined" size="large" onClick={() => navigate("/")}>
							← Volver a CORTEXA
						</Button>
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}

export default RenaceMainMenuPage;
