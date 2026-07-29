import {
	Box,
	Button,
	Container,
	FormControl,
	FormControlLabel,
	TextField,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CravingScale from "../../components/common/CravingScale";
import ModuleCard from "../../components/common/ModuleCard";
import ModuleHeader from "../../components/common/ModuleHeader";
import { useCueExposureSession } from "../../contexts/CueExposureSessionContext";
import type { IntermediateRecordType } from "./types/cueExposure.types";

const substances = [
	{
		id: "alcohol",
		title: "Alcohol",
		description: "Sesión orientada a estímulos asociados al consumo de alcohol.",
	},
	{
		id: "metanfetaminas",
		title: "Metanfetaminas",
		description: "Sesión orientada a estímulos asociados al consumo de metanfetaminas.",
	},
	{
		id: "cocaina",
		title: "Cocaína",
		description: "Sesión orientada a estímulos asociados al consumo de cocaína.",
	},
];

const durationOptions = Array.from({ length: 20 }, (_, index) => index + 1);

function CueExposureHome() {
	const navigate = useNavigate();
	const { createSession } = useCueExposureSession();
	const [expediente, setExpediente] = useState<string>("");
	const [selectedSubstance, setSelectedSubstance] = useState<string>("");
	const [durationMinutes, setDurationMinutes] = useState<number>(20);
	const [cravingInitial, setCravingInitial] = useState<number | null>(null);
	const [intermediateRecordSetting, setIntermediateRecordSetting] = useState<IntermediateRecordType>("none");
	const isStartDisabled = !expediente.trim() || !selectedSubstance || cravingInitial === null;

	function handleStartSession(): void {
		const normalizedExpediente = expediente.trim();

		if (!normalizedExpediente || cravingInitial === null) {
			return;
		}

		const session = createSession({
			expediente: normalizedExpediente,
			substanceId: selectedSubstance,
			durationMinutes,
			initialCraving: cravingInitial,
			intermediateRecordType: intermediateRecordSetting,
		});

		console.log("[CueExposure] Nueva sesión creada:", session);

		navigate("/cue-exposure/session");
	}

	function handleConsultResults(): void {
		navigate("/cue-exposure/results");
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
				<Stack spacing={3.5}>
					<ModuleHeader
						moduleName="Cue Exposure"
						title="Exposición Controlada a Estímulos Asociados al Consumo"
					/>

					<TextField
						fullWidth
						label="Número de expediente"
						value={expediente}
						onChange={(event) => setExpediente(event.target.value)}
					/>

					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
							Seleccione la sustancia
						</Typography>
						<Stack spacing={2}>
							{substances.map((substance) => (
								<ModuleCard
									key={substance.id}
									title={substance.title}
									description={substance.description}
									selected={selectedSubstance === substance.id}
									onClick={() => setSelectedSubstance(substance.id)}
								/>
							))}
						</Stack>
					</Box>

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
							Craving inicial
						</Typography>
						<CravingScale value={cravingInitial} onChange={setCravingInitial} />
					</Box>

					<Box>
						<Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
							Registros intermedios
						</Typography>
						<FormControl>
							<RadioGroup
								value={intermediateRecordSetting}
								onChange={(event) =>
									setIntermediateRecordSetting(event.target.value as IntermediateRecordType)
								}
							>
								<FormControlLabel value="none" control={<Radio />} label="Sin registros." />
								<FormControlLabel value="25" control={<Radio />} label="Cada 25 %." />
								<FormControlLabel value="33" control={<Radio />} label="Cada 33 %." />
								<FormControlLabel value="50" control={<Radio />} label="Cada 50 %." />
							</RadioGroup>
						</FormControl>
					</Box>

					<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
						<Button fullWidth variant="outlined" size="large" onClick={() => navigate("/reconecta")}>
							Cancelar
						</Button>
						<Button
							fullWidth
							variant="contained"
							size="large"
							onClick={handleStartSession}
							disabled={isStartDisabled}
						>
							Iniciar sesión
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

export default CueExposureHome;