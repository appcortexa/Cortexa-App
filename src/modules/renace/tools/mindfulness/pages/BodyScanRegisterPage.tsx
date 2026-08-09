import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type BodyScanRecord = {
	bodyArea: string;
	predominantSensation: string;
	sensationIntensity: number;
	additionalObservations: string;
};

type RegisterPageState = { records?: BodyScanRecord[] };

const bodyAreaOptions = ["Cabeza", "Cuello", "Hombros", "Brazos", "Pecho", "Abdomen", "Espalda", "Piernas", "Pies", "Todo el cuerpo", "Otra"] as const;

function sanitizeRecords(state: unknown): BodyScanRecord[] {
	if (!state || typeof state !== "object") return [];
	const records = (state as RegisterPageState).records;
	if (!Array.isArray(records)) return [];
	return records.filter(
		(record) =>
			bodyAreaOptions.includes(record.bodyArea as (typeof bodyAreaOptions)[number]) &&
			typeof record.predominantSensation === "string" &&
			record.predominantSensation.trim().length > 0 &&
			typeof record.sensationIntensity === "number" &&
			record.sensationIntensity >= 0 &&
			record.sensationIntensity <= 10 &&
			typeof record.additionalObservations === "string",
	);
}

function BodyScanRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState(initialRecords);
	const [bodyArea, setBodyArea] = useState("");
	const [predominantSensation, setPredominantSensation] = useState("");
	const [sensationIntensity, setSensationIntensity] = useState(5);
	const [additionalObservations, setAdditionalObservations] = useState("");
	const [bodyAreaError, setBodyAreaError] = useState(false);
	const [sensationError, setSensationError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(initialRecords.length > 0);

	const resetCurrentForm = () => {
		setBodyArea("");
		setPredominantSensation("");
		setSensationIntensity(5);
		setAdditionalObservations("");
		setBodyAreaError(false);
		setSensationError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSensation = predominantSensation.trim();
		const hasBodyArea = bodyArea.length > 0;
		const hasSensation = trimmedSensation.length > 0;

		setBodyAreaError(!hasBodyArea);
		setSensationError(!hasSensation);
		if (!hasBodyArea || !hasSensation) return;

		setRecords((currentRecords) => [
			...currentRecords,
			{ bodyArea, predominantSensation: trimmedSensation, sensationIntensity, additionalObservations: additionalObservations.trim() },
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	return (
		<InterventionScreenLayout
			title="Registro de Escaneo Corporal"
			description="Registra una zona corporal y la sensación que observaste en ella."
			actions={
				<Stack spacing={1.5}>
					<Button variant="contained" size="large" onClick={handleSaveRecord}>Guardar registro</Button>
					{showPostSaveActions || records.length > 0 ? <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
						{showPostSaveActions ? <Button variant="outlined" size="large" onClick={resetCurrentForm}>Agregar otro registro</Button> : null}
						{records.length > 0 ? <Button variant="contained" size="large" onClick={() => navigate("/renace/mindfulness/escaneo-corporal/resumen", { state: { records } })}>Finalizar</Button> : null}
					</Stack> : null}
				</Stack>
			}
		>
			<Stack spacing={2.5}>
				<TextField required select fullWidth label="Zona corporal observada" value={bodyArea} onChange={(event) => { setBodyArea(event.target.value); setBodyAreaError(false); }} error={bodyAreaError} helperText={bodyAreaError ? "Este campo es obligatorio." : " "}>
					<MenuItem value="" disabled>Selecciona una zona corporal</MenuItem>
					{bodyAreaOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
				</TextField>
				<TextField required fullWidth multiline minRows={3} label="Sensación predominante" value={predominantSensation} onChange={(event) => { setPredominantSensation(event.target.value); setSensationError(false); }} error={sensationError} helperText={sensationError ? "Este campo es obligatorio." : " "} />
				<EmotionIntensitySlider label="Intensidad de la sensación" value={sensationIntensity} onChange={setSensationIntensity} />
				<TextField fullWidth multiline minRows={3} label="Observaciones adicionales" value={additionalObservations} onChange={(event) => setAdditionalObservations(event.target.value)} />
				{records.length > 0 ? <Alert severity="success">Registro guardado. Puedes agregar otro registro o finalizar.</Alert> : <Alert severity="info">Aún no hay registros guardados.</Alert>}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default BodyScanRegisterPage;
