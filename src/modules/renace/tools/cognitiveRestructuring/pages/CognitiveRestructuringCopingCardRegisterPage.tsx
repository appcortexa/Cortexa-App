import {
	Alert,
	Button,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type CopingCardRecord = {
	situation: string;
	reminder: string;
	action: string;
	confidenceOfUse: number;
};

type RegisterPageState = {
	records?: CopingCardRecord[];
};

function sanitizeRecords(state: unknown): CopingCardRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as RegisterPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.situation === "string" &&
			typeof record.reminder === "string" &&
			typeof record.action === "string" &&
			typeof record.confidenceOfUse === "number",
	);
}

function CognitiveRestructuringCopingCardRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<CopingCardRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [reminder, setReminder] = useState("");
	const [action, setAction] = useState("");
	const [confidenceOfUse, setConfidenceOfUse] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [reminderError, setReminderError] = useState(false);
	const [actionError, setActionError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setReminder("");
		setAction("");
		setConfidenceOfUse(5);
		setSituationError(false);
		setReminderError(false);
		setActionError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const trimmedReminder = reminder.trim();
		const trimmedAction = action.trim();

		const hasSituation = trimmedSituation.length > 0;
		const hasReminder = trimmedReminder.length > 0;
		const hasAction = trimmedAction.length > 0;

		setSituationError(!hasSituation);
		setReminderError(!hasReminder);
		setActionError(!hasAction);

		if (!hasSituation || !hasReminder || !hasAction) {
			return;
		}

		setRecords((currentRecords) => [
			...currentRecords,
			{
				situation: trimmedSituation,
				reminder: trimmedReminder,
				action: trimmedAction,
				confidenceOfUse,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/reestructuracion-cognitiva/tarjeta-afrontamiento/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;

	return (
		<InterventionScreenLayout
			title="Creación de Tarjeta de Afrontamiento"
			description="Registra tarjetas prácticas para recordar respuestas útiles en situaciones difíciles y valora tu confianza de uso de 0 a 10."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/reestructuracion-cognitiva/tarjeta-afrontamiento/introduccion")
						}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otra tarjeta
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={!canFinalize} onClick={handleFinalize}>
							Finalizar
						</Button>
					</Stack>
				</Stack>
			}
		>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="¿En qué situación podrías necesitar recordar esta tarjeta?"
					value={situation}
					onChange={(event) => {
						setSituation(event.target.value);
						if (situationError && event.target.value.trim().length > 0) {
							setSituationError(false);
						}
					}}
					error={situationError}
					helperText={situationError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="¿Qué idea te gustaría recordar en ese momento?"
					value={reminder}
					onChange={(event) => {
						setReminder(event.target.value);
						if (reminderError && event.target.value.trim().length > 0) {
							setReminderError(false);
						}
					}}
					error={reminderError}
					helperText={reminderError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="¿Qué acción pequeña podrías realizar cuando aparezca esa situación?"
					value={action}
					onChange={(event) => {
						setAction(event.target.value);
						if (actionError && event.target.value.trim().length > 0) {
							setActionError(false);
						}
					}}
					error={actionError}
					helperText={actionError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider
					label="Confianza de uso"
					value={confidenceOfUse}
					onChange={setConfidenceOfUse}
				/>

				<Button variant="contained" size="large" onClick={handleSaveRecord}>
					Guardar tarjeta
				</Button>

				{records.length > 0 ? (
					<Alert severity="success">
						Tarjeta guardada. Puedes agregar otra tarjeta o finalizar.
					</Alert>
				) : (
					<Alert severity="info">Aún no hay tarjetas registradas.</Alert>
				)}

				{records.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Tarjetas registradas">
							<TableHead>
								<TableRow>
									<TableCell>Situación</TableCell>
									<TableCell>Recordatorio</TableCell>
									<TableCell>Acción</TableCell>
									<TableCell align="right">Confianza de uso</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{records.map((record, index) => (
									<TableRow key={`${record.situation}-${index}`}>
										<TableCell>{record.situation}</TableCell>
										<TableCell>{record.reminder}</TableCell>
										<TableCell>{record.action}</TableCell>
										<TableCell align="right">{record.confidenceOfUse}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				) : null}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default CognitiveRestructuringCopingCardRegisterPage;
