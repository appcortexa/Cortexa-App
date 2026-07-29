import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Button,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { LEVELS } from "../core/levels";

const APP_VERSION = "1.0.0";
type AppMode = "evaluation" | "training";

function HomePage() {
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState("");
	const [sustancia, setSustancia] = useState("");
	const [nivel, setNivel] = useState("");
	const [mode, setMode] = useState<AppMode | "">("");

	const levelOptions = useMemo(() => Object.values(LEVELS), []);
	const isStartDisabled = !expediente.trim() || !sustancia || !nivel || !mode;

	const handleStart = () => {
		if (!mode) {
			return;
		}

		navigate("/instructions", {
			state: {
				expediente: expediente.trim(),
				sustancia,
				nivel,
				mode,
			},
		});
	};

	const handleClear = () => {
		setExpediente("");
		setSustancia("");
		setNivel("");
		setMode("");
	};

	const handleConsultResults = () => {
		navigate("/results");
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
							Reconecta Go-NoGo
						</Typography>
						<Typography
							variant="subtitle1"
							sx={{ color: "text.secondary", mt: 1, fontSize: { xs: "1rem", sm: "1.125rem" } }}
						>
							Evaluación de Control Inhibitorio
						</Typography>
					</Box>

					<Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
						<TextField
							fullWidth
							label="Número de expediente"
							value={expediente}
							onChange={(event) => setExpediente(event.target.value)}
						/>

						<FormControl fullWidth>
							<InputLabel id="sustancia-label">Sustancia</InputLabel>
							<Select
								labelId="sustancia-label"
								label="Sustancia"
								value={sustancia}
								onChange={(event) => setSustancia(event.target.value)}
							>
								<MenuItem value="Alcohol">Alcohol</MenuItem>
								<MenuItem value="Cristal">Cristal</MenuItem>
								<MenuItem value="Cocaina">Cocaína</MenuItem>
								<MenuItem value="Otro">Otro</MenuItem>
							</Select>
						</FormControl>

						<FormControl fullWidth>
							<InputLabel id="nivel-label">Nivel</InputLabel>
							<Select
								labelId="nivel-label"
								label="Nivel"
								value={nivel}
								onChange={(event) => setNivel(event.target.value)}
							>
								{levelOptions.map((level) => (
									<MenuItem key={level.id} value={level.id}>
										{level.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Box sx={{ width: "100%", textAlign: "left" }}>
							<Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
								Tipo de sesión
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
								{/* Evaluación Neurofuncional oculta temporalmente. Reactivar cuando el módulo se libere para uso clínico. */}
								<Button
									fullWidth
									size="large"
									variant={mode === "training" ? "contained" : "outlined"}
									onClick={() => setMode("training")}
									sx={{ py: 1.75, fontWeight: 700 }}
								>
									Entrenamiento Neurocognitivo
								</Button>
							</Box>
						</Box>

						<Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
							<Button fullWidth variant="contained" size="large" disabled={isStartDisabled} onClick={handleStart}>
								Continuar
							</Button>
							<Button fullWidth variant="outlined" size="large" onClick={handleClear}>
								Limpiar
							</Button>
						</Box>

						<Box sx={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
							<Button variant="outlined" size="large" onClick={() => navigate("/reconecta")}>
								Cancelar
							</Button>
						</Box>

						<Button fullWidth variant="contained" color="secondary" size="large" onClick={handleConsultResults}>
							Consultar resultados
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

export default HomePage;
