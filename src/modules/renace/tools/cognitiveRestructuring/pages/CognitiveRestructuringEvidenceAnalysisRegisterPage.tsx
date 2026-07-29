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

type EvidenceAnalysisRecord = {
	thought: string;
	supportingFacts: string;
	doubtingFacts: string;
	convictionLevel: number;
};

type RegisterPageState = {
	records?: EvidenceAnalysisRecord[];
};

function sanitizeRecords(state: unknown): EvidenceAnalysisRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as RegisterPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.thought === "string" &&
			typeof record.supportingFacts === "string" &&
			typeof record.doubtingFacts === "string" &&
			typeof record.convictionLevel === "number",
	);
}

function CognitiveRestructuringEvidenceAnalysisRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<EvidenceAnalysisRecord[]>(initialRecords);
	const [thought, setThought] = useState("");
	const [supportingFacts, setSupportingFacts] = useState("");
	const [doubtingFacts, setDoubtingFacts] = useState("");
	const [convictionLevel, setConvictionLevel] = useState(5);
	const [thoughtError, setThoughtError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setThought("");
		setSupportingFacts("");
		setDoubtingFacts("");
		setConvictionLevel(5);
		setThoughtError(false);
	};

	const handleSaveRecord = () => {
		const trimmedThought = thought.trim();
		const trimmedSupportingFacts = supportingFacts.trim();
		const trimmedDoubtingFacts = doubtingFacts.trim();
		const hasThought = trimmedThought.length > 0;

		setThoughtError(!hasThought);

		if (!hasThought) {
			return;
		}

		setRecords((currentRecords) => [
			...currentRecords,
			{
				thought: trimmedThought,
				supportingFacts: trimmedSupportingFacts,
				doubtingFacts: trimmedDoubtingFacts,
				convictionLevel,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/reestructuracion-cognitiva/analisis-evidencias/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;

	return (
		<InterventionScreenLayout
			title="Registro de Análisis"
			description="Registra un pensamiento por vez para revisar hechos que lo apoyan, hechos que generan dudas y nivel de convicción (0 a 10)."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/reestructuracion-cognitiva/analisis-evidencias/introduccion")
						}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro análisis
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
					label="Pensamiento que deseas analizar"
					value={thought}
					onChange={(event) => {
						setThought(event.target.value);
						if (thoughtError && event.target.value.trim().length > 0) {
							setThoughtError(false);
						}
					}}
					error={thoughtError}
					helperText={thoughtError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					fullWidth
					multiline
					minRows={3}
					label="¿Qué hechos apoyan ese pensamiento?"
					value={supportingFacts}
					onChange={(event) => setSupportingFacts(event.target.value)}
				/>

				<TextField
					fullWidth
					multiline
					minRows={3}
					label="¿Qué hechos hacen dudar de ese pensamiento?"
					value={doubtingFacts}
					onChange={(event) => setDoubtingFacts(event.target.value)}
				/>

				<EmotionIntensitySlider
					label="Nivel de convicción"
					value={convictionLevel}
					onChange={setConvictionLevel}
				/>

				<Button variant="contained" size="large" onClick={handleSaveRecord}>
					Guardar análisis
				</Button>

				{records.length > 0 ? (
					<Alert severity="success">Análisis guardado. Puedes agregar otro análisis o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay análisis registrados.</Alert>
				)}

				{records.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Análisis registrados">
							<TableHead>
								<TableRow>
									<TableCell>Pensamiento</TableCell>
									<TableCell>Hechos que lo apoyan</TableCell>
									<TableCell>Hechos que generan dudas</TableCell>
									<TableCell align="right">Nivel de convicción</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{records.map((record, index) => (
									<TableRow key={`${record.thought}-${index}`}>
										<TableCell>{record.thought}</TableCell>
										<TableCell>{record.supportingFacts || "-"}</TableCell>
										<TableCell>{record.doubtingFacts || "-"}</TableCell>
										<TableCell align="right">{record.convictionLevel}</TableCell>
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

export default CognitiveRestructuringEvidenceAnalysisRegisterPage;