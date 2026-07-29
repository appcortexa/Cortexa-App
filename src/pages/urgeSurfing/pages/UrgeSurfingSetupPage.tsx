import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, FormControl, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

import ModuleHeader from "../../../components/common/ModuleHeader";
import type { CardAdvanceMode, IntermediateRecordFrequency } from "../types/SessionConfig";
import type { UrgeSurfingPreparationState } from "../types/SessionContext";

const durationOptions = Array.from({ length: 20 }, (_, index) => index + 1);

const frequencyOptions: Array<{ value: IntermediateRecordFrequency; label: string }> = [
	{ value: "none", label: "Sin registros" },
	{ value: "25", label: "Cada 25 %" },
	{ value: "33", label: "Cada 33 %" },
	{ value: "50", label: "Cada 50 %" },
];

const cardAdvanceModeOptions: Array<{ value: CardAdvanceMode; label: string }> = [
	{ value: "automatic", label: "Automático" },
	{ value: "manual", label: "Manual (controlado por el terapeuta)" },
];

function isDurationValid(durationMinutes: number): boolean {
	return Number.isInteger(durationMinutes) && durationMinutes >= 1 && durationMinutes <= 20;
}

function UrgeSurfingSetupPage() {
	const navigate = useNavigate();
	const [expediente, setExpediente] = useState<string>("");
	const [durationMinutes, setDurationMinutes] = useState<number>(20);
	const [intermediateRecordFrequency, setIntermediateRecordFrequency] = useState<IntermediateRecordFrequency | "">("");
	const [cardAdvanceMode, setCardAdvanceMode] = useState<CardAdvanceMode | "">("");

	const isContinueDisabled =
		!expediente.trim() || !isDurationValid(durationMinutes) || !intermediateRecordFrequency || !cardAdvanceMode;

	function handleContinue(): void {
		const normalizedExpediente = expediente.trim();

		if (!normalizedExpediente || !isDurationValid(durationMinutes) || !intermediateRecordFrequency || !cardAdvanceMode) {
			return;
		}

		const preparationState: UrgeSurfingPreparationState = {
			expediente: normalizedExpediente,
			durationMinutes,
			intermediateRecordFrequency,
			cardAdvanceMode,
		};

		navigate("/urge-surfing/initial-craving", {
			state: preparationState,
		});
	}

	function handleConsultResults(): void {
		navigate("/urge-surfing/results");
	}

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
					<ModuleHeader
						moduleName="Reconecta Urge Surfing"
						title="Entrenamiento para el Manejo Consciente del Craving"
					/>

					<TextField
						fullWidth
						label="Número de expediente"
						value={expediente}
						onChange={(event) => setExpediente(event.target.value)}
					/>

					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
							Duración
						</Typography>
						<FormControl fullWidth>
							<Select
								value={durationMinutes}
								onChange={(event) => setDurationMinutes(Number(event.target.value))}
								size="medium"
							>
								{durationOptions.map((minutes) => (
									<MenuItem key={minutes} value={minutes}>
										{minutes} minuto{minutes === 1 ? "" : "s"}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
							Frecuencia de registros
						</Typography>
						<FormControl fullWidth>
							<Select
								displayEmpty
								value={intermediateRecordFrequency}
								onChange={(event) => setIntermediateRecordFrequency(event.target.value as IntermediateRecordFrequency)}
								size="medium"
							>
								<MenuItem value="" disabled>
									Seleccione una opción
								</MenuItem>
								{frequencyOptions.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
							Avance de tarjetas
						</Typography>
						<FormControl fullWidth>
							<Select
								displayEmpty
								value={cardAdvanceMode}
								onChange={(event) => setCardAdvanceMode(event.target.value as CardAdvanceMode)}
								size="medium"
							>
								<MenuItem value="" disabled>
									Seleccione una opción
								</MenuItem>
								{cardAdvanceModeOptions.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
						<Button fullWidth variant="outlined" size="large" onClick={() => navigate("/reconecta")}>
							Cancelar
						</Button>
						<Button fullWidth variant="contained" size="large" disabled={isContinueDisabled} onClick={handleContinue}>
							Continuar
						</Button>
					</Stack>

					<Button fullWidth variant="contained" color="secondary" size="large" onClick={handleConsultResults}>
						Consultar resultados
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}

export default UrgeSurfingSetupPage;