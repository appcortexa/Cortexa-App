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

type ReframingRecord = {
	situation: string;
	initialInterpretation: string;
	friendPerspective: string;
	newPerspective: string;
	perceivedUsefulness: number;
};

type RegisterPageState = {
	records?: ReframingRecord[];
};

function sanitizeRecords(state: unknown): ReframingRecord[] {
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
			typeof record.initialInterpretation === "string" &&
			typeof record.friendPerspective === "string" &&
			typeof record.newPerspective === "string" &&
			typeof record.perceivedUsefulness === "number",
	);
}

function CognitiveRestructuringReframingRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialRecords = useMemo(() => sanitizeRecords(location.state), [location.state]);
	const [records, setRecords] = useState<ReframingRecord[]>(initialRecords);
	const [situation, setSituation] = useState("");
	const [initialInterpretation, setInitialInterpretation] = useState("");
	const [friendPerspective, setFriendPerspective] = useState("");
	const [newPerspective, setNewPerspective] = useState("");
	const [perceivedUsefulness, setPerceivedUsefulness] = useState(5);
	const [situationError, setSituationError] = useState(false);
	const [initialInterpretationError, setInitialInterpretationError] = useState(false);
	const [friendPerspectiveError, setFriendPerspectiveError] = useState(false);
	const [newPerspectiveError, setNewPerspectiveError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(records.length > 0);

	const resetCurrentForm = () => {
		setSituation("");
		setInitialInterpretation("");
		setFriendPerspective("");
		setNewPerspective("");
		setPerceivedUsefulness(5);
		setSituationError(false);
		setInitialInterpretationError(false);
		setFriendPerspectiveError(false);
		setNewPerspectiveError(false);
	};

	const handleSaveRecord = () => {
		const trimmedSituation = situation.trim();
		const trimmedInitialInterpretation = initialInterpretation.trim();
		const trimmedFriendPerspective = friendPerspective.trim();
		const trimmedNewPerspective = newPerspective.trim();

		const hasSituation = trimmedSituation.length > 0;
		const hasInitialInterpretation = trimmedInitialInterpretation.length > 0;
		const hasFriendPerspective = trimmedFriendPerspective.length > 0;
		const hasNewPerspective = trimmedNewPerspective.length > 0;

		setSituationError(!hasSituation);
		setInitialInterpretationError(!hasInitialInterpretation);
		setFriendPerspectiveError(!hasFriendPerspective);
		setNewPerspectiveError(!hasNewPerspective);

		if (!hasSituation || !hasInitialInterpretation || !hasFriendPerspective || !hasNewPerspective) {
			return;
		}

		setRecords((currentRecords) => [
			...currentRecords,
			{
				situation: trimmedSituation,
				initialInterpretation: trimmedInitialInterpretation,
				friendPerspective: trimmedFriendPerspective,
				newPerspective: trimmedNewPerspective,
				perceivedUsefulness,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/reestructuracion-cognitiva/reencuadre-cognitivo/resumen", {
			state: { records },
		});
	};

	const canFinalize = records.length > 0;

	return (
		<InterventionScreenLayout
			title="Registro de Reencuadre Cognitivo"
			description="Registra una situación por vez para explorar nuevas perspectivas y valorar su utilidad de 0 a 10."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/reestructuracion-cognitiva/reencuadre-cognitivo/introduccion")}
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
					label="Situación"
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
					label="¿Cómo interpretaste inicialmente esa situación?"
					value={initialInterpretation}
					onChange={(event) => {
						setInitialInterpretation(event.target.value);
						if (initialInterpretationError && event.target.value.trim().length > 0) {
							setInitialInterpretationError(false);
						}
					}}
					error={initialInterpretationError}
					helperText={initialInterpretationError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="Imagina que un buen amigo viviera exactamente esta situación. ¿Qué le dirías?"
					value={friendPerspective}
					onChange={(event) => {
						setFriendPerspective(event.target.value);
						if (friendPerspectiveError && event.target.value.trim().length > 0) {
							setFriendPerspectiveError(false);
						}
					}}
					error={friendPerspectiveError}
					helperText={friendPerspectiveError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					fullWidth
					multiline
					minRows={3}
					label="Después de este ejercicio, ¿cómo cambiaría tu manera de comprender lo ocurrido?"
					value={newPerspective}
					onChange={(event) => {
						setNewPerspective(event.target.value);
						if (newPerspectiveError && event.target.value.trim().length > 0) {
							setNewPerspectiveError(false);
						}
					}}
					error={newPerspectiveError}
					helperText={newPerspectiveError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider
					label="Utilidad percibida"
					value={perceivedUsefulness}
					onChange={setPerceivedUsefulness}
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
					<TableContainer>
						<Table size="small" aria-label="Ejercicios registrados">
							<TableHead>
								<TableRow>
									<TableCell>Situación</TableCell>
									<TableCell>Interpretación inicial</TableCell>
									<TableCell>Nueva perspectiva</TableCell>
									<TableCell align="right">Utilidad percibida</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{records.map((record, index) => (
									<TableRow key={`${record.situation}-${index}`}>
										<TableCell>{record.situation}</TableCell>
										<TableCell>{record.initialInterpretation}</TableCell>
										<TableCell>{record.newPerspective}</TableCell>
										<TableCell align="right">{record.perceivedUsefulness}</TableCell>
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

export default CognitiveRestructuringReframingRegisterPage;
