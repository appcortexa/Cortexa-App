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

import CognitiveSummaryCard from "../components/CognitiveSummaryCard";
import EmotionIntensitySlider from "../components/EmotionIntensitySlider";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type AlternativeThoughtRecord = {
	originalThought: string;
	alternativeInterpretation: string;
	credibility: number;
	actionPlan: string;
};

type RegisterPageState = {
	records?: AlternativeThoughtRecord[];
};

function sanitizeRecords(state: unknown): AlternativeThoughtRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as RegisterPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.originalThought === "string" &&
			typeof record.alternativeInterpretation === "string" &&
			typeof record.credibility === "number" &&
			typeof record.actionPlan === "string",
	);
}

function CognitiveRestructuringAlternativeThoughtsRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<AlternativeThoughtRecord[]>(initialRecords);
	const [originalThought, setOriginalThought] = useState("");
	const [alternativeInterpretation, setAlternativeInterpretation] = useState("");
	const [credibility, setCredibility] = useState(5);
	const [actionPlan, setActionPlan] = useState("");
	const [originalThoughtError, setOriginalThoughtError] = useState(false);
	const [alternativeInterpretationError, setAlternativeInterpretationError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setOriginalThought("");
		setAlternativeInterpretation("");
		setCredibility(5);
		setActionPlan("");
		setOriginalThoughtError(false);
		setAlternativeInterpretationError(false);
	};

	const handleSaveRecord = () => {
		const trimmedOriginalThought = originalThought.trim();
		const trimmedAlternativeInterpretation = alternativeInterpretation.trim();
		const trimmedActionPlan = actionPlan.trim();
		const hasOriginalThought = trimmedOriginalThought.length > 0;
		const hasAlternativeInterpretation = trimmedAlternativeInterpretation.length > 0;

		setOriginalThoughtError(!hasOriginalThought);
		setAlternativeInterpretationError(!hasAlternativeInterpretation);

		if (!hasOriginalThought || !hasAlternativeInterpretation) {
			return;
		}

		setRecords((currentRecords) => [
			...currentRecords,
			{
				originalThought: trimmedOriginalThought,
				alternativeInterpretation: trimmedAlternativeInterpretation,
				credibility,
				actionPlan: trimmedActionPlan,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/reestructuracion-cognitiva/pensamientos-alternativos/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;
	const averageCredibility = canFinalize
		? (records.reduce((sum, record) => sum + record.credibility, 0) / records.length).toFixed(1)
		: "0.0";
	const recordsWithActionPlan = records.filter((record) => record.actionPlan.trim().length > 0).length;

	return (
		<InterventionScreenLayout
			title="Registro de Pensamientos Alternativos"
			description="Registra un pensamiento original, su interpretación alternativa y la credibilidad percibida de 0 a 10."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/reestructuracion-cognitiva/pensamientos-alternativos/introduccion")
						}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro ejercicio
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
					label="Pensamiento original"
					value={originalThought}
					onChange={(event) => {
						setOriginalThought(event.target.value);
						if (originalThoughtError && event.target.value.trim().length > 0) {
							setOriginalThoughtError(false);
						}
					}}
					error={originalThoughtError}
					helperText={originalThoughtError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="¿Qué interpretación alternativa podría explicar esta situación?"
					value={alternativeInterpretation}
					onChange={(event) => {
						setAlternativeInterpretation(event.target.value);
						if (alternativeInterpretationError && event.target.value.trim().length > 0) {
							setAlternativeInterpretationError(false);
						}
					}}
					error={alternativeInterpretationError}
					helperText={alternativeInterpretationError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider label="Credibilidad" value={credibility} onChange={setCredibility} />

				<TextField
					fullWidth
					multiline
					minRows={3}
					label="¿Cómo cambiaría tu forma de actuar si pensaras de esta manera?"
					value={actionPlan}
					onChange={(event) => setActionPlan(event.target.value)}
				/>

				<Button variant="contained" size="large" onClick={handleSaveRecord}>
					Guardar ejercicio
				</Button>

				{records.length > 0 ? (
					<Alert severity="success">
						Ejercicio guardado. Puedes agregar otro ejercicio o finalizar.
					</Alert>
				) : (
					<Alert severity="info">Aún no hay ejercicios registrados.</Alert>
				)}

				{records.length > 0 ? (
					<>
						<CognitiveSummaryCard
							title="Indicadores actuales"
							indicators={[
								{
									id: "total-records",
									label: "Número de pensamientos trabajados",
									value: records.length,
								},
								{
									id: "average-credibility",
									label: "Credibilidad promedio",
									value: averageCredibility,
								},
								{
									id: "records-with-action-plan",
									label: "Registros con plan de acción",
									value: recordsWithActionPlan,
								},
							]}
						/>

						<TableContainer>
							<Table size="small" aria-label="Ejercicios registrados">
								<TableHead>
									<TableRow>
										<TableCell>Pensamiento original</TableCell>
										<TableCell>Nueva interpretación</TableCell>
										<TableCell align="right">Credibilidad</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{records.map((record, index) => (
										<TableRow key={`${record.originalThought}-${index}`}>
											<TableCell>{record.originalThought}</TableCell>
											<TableCell>{record.alternativeInterpretation}</TableCell>
											<TableCell align="right">{record.credibility}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</>
				) : null}
			</Stack>
		</InterventionScreenLayout>
	);
}

export default CognitiveRestructuringAlternativeThoughtsRegisterPage;
