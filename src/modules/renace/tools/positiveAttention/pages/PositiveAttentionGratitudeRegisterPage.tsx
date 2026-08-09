import { Alert, Button, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import EmotionIntensitySlider from "../../cognitiveRestructuring/components/EmotionIntensitySlider";
import ExerciseEntryActions from "../../shared/components/ExerciseEntryActions";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import type { PositiveAttentionRecord } from "../../../positiveAttention/PositiveAttentionRecord";

type PositiveAttentionGratitudeEntry = Pick<
	PositiveAttentionRecord,
	"description" | "emotion" | "reflection" | "intensity"
>;

type RegisterPageState = {
	gratitudeEntries?: PositiveAttentionGratitudeEntry[];
};

const gratitudeCategoryOptions = [
	"Persona",
	"Situación",
	"Experiencia",
	"Logro personal",
	"Otra",
] as const;

function sanitizeGratitudeEntries(state: unknown): PositiveAttentionGratitudeEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeEntries = (state as RegisterPageState).gratitudeEntries;

	if (!Array.isArray(maybeEntries)) {
		return [];
	}

	return maybeEntries.filter(
		(entry) =>
			typeof entry.description === "string" &&
			typeof entry.emotion === "string" &&
			typeof entry.reflection === "string" &&
			typeof entry.intensity === "number",
	);
}

function PositiveAttentionGratitudeRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialEntries = useMemo(() => sanitizeGratitudeEntries(location.state), [location.state]);
	const [gratitudeEntries, setGratitudeEntries] = useState<PositiveAttentionGratitudeEntry[]>(initialEntries);
	const [reason, setReason] = useState("");
	const [category, setCategory] = useState("");
	const [meaning, setMeaning] = useState("");
	const [intensity, setIntensity] = useState(5);
	const [reasonError, setReasonError] = useState(false);
	const [categoryError, setCategoryError] = useState(false);
	const [meaningError, setMeaningError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(gratitudeEntries.length > 0);

	const resetCurrentForm = () => {
		setReason("");
		setCategory("");
		setMeaning("");
		setIntensity(5);
		setReasonError(false);
		setCategoryError(false);
		setMeaningError(false);
	};

	const handleSaveEntry = () => {
		const trimmedReason = reason.trim();
		const trimmedCategory = category.trim();
		const trimmedMeaning = meaning.trim();
		const hasReason = trimmedReason.length > 0;
		const hasCategory = trimmedCategory.length > 0;
		const hasMeaning = trimmedMeaning.length > 0;

		setReasonError(!hasReason);
		setCategoryError(!hasCategory);
		setMeaningError(!hasMeaning);

		if (!hasReason || !hasCategory || !hasMeaning) {
			return;
		}

		setGratitudeEntries((currentEntries) => [
			...currentEntries,
			{
				description: trimmedReason,
				emotion: trimmedCategory,
				reflection: trimmedMeaning,
				intensity,
			},
		]);
		resetCurrentForm();
		setShowPostSaveActions(true);
	};

	const handleFinish = () => {
		navigate("/renace/atencion-positiva/gratitud-consciente/resumen", {
			state: { gratitudeEntries },
		});
	};

	return (
		<InterventionScreenLayout
			title="Registro de gratitud consciente"
			description="Registra aquello por lo que sientes gratitud, la categoría principal y la intensidad de esa sensación (0 a 10)."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/atencion-positiva/gratitud-consciente/introduccion")}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button variant="outlined" size="large" onClick={resetCurrentForm}>
								Agregar otro ejercicio
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={gratitudeEntries.length === 0} onClick={handleFinish}>
							Finalizar
						</Button>
					</Stack>
				</Stack>
			}
		>
			<Stack spacing={2.5}>
				<TextField
					required
					fullWidth
					label="¿Por qué sientes gratitud?"
					value={reason}
					onChange={(event) => {
						setReason(event.target.value);
						if (reasonError && event.target.value.trim().length > 0) {
							setReasonError(false);
						}
					}}
					error={reasonError}
					helperText={reasonError ? "Este campo es obligatorio." : " "}
				/>

				<TextField
					required
					select
					fullWidth
					label="¿Corresponde principalmente a...?"
					value={category}
					onChange={(event) => {
						setCategory(event.target.value);
						if (categoryError && event.target.value.trim().length > 0) {
							setCategoryError(false);
						}
					}}
					error={categoryError}
					helperText={categoryError ? "Este campo es obligatorio." : " "}
				>
					<MenuItem value="" disabled>
						Selecciona una categoría
					</MenuItem>
					{gratitudeCategoryOptions.map((option) => (
						<MenuItem key={option} value={option}>
							{option}
						</MenuItem>
					))}
				</TextField>

				<TextField
					required
					fullWidth
					label="¿Qué significado tuvo para ti?"
					value={meaning}
					onChange={(event) => {
						setMeaning(event.target.value);
						if (meaningError && event.target.value.trim().length > 0) {
							setMeaningError(false);
						}
					}}
					error={meaningError}
					helperText={meaningError ? "Este campo es obligatorio." : " "}
				/>

				<EmotionIntensitySlider
					label="Intensidad de gratitud"
					value={intensity}
					onChange={setIntensity}
				/>

				<ExerciseEntryActions
					onSave={handleSaveEntry}
					onAddAnother={resetCurrentForm}
					onFinish={handleFinish}
					canSave={true}
					showAddAnother={showPostSaveActions}
					showFinish={gratitudeEntries.length > 0}
				/>

				{gratitudeEntries.length > 0 ? (
					<Alert severity="success">Registro guardado. Puedes agregar otro o finalizar.</Alert>
				) : (
					<Alert severity="info">Aún no hay registros de gratitud.</Alert>
				)}

				{gratitudeEntries.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Registros de gratitud consciente">
							<TableHead>
								<TableRow>
									<TableCell>Motivo de gratitud</TableCell>
									<TableCell>Categoría</TableCell>
									<TableCell>Significado</TableCell>
									<TableCell align="right">Intensidad</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{gratitudeEntries.map((entry, index) => (
									<TableRow key={`${entry.description}-${index}`}>
										<TableCell>{entry.description}</TableCell>
										<TableCell>{entry.emotion}</TableCell>
										<TableCell>{entry.reflection}</TableCell>
										<TableCell align="right">{entry.intensity}</TableCell>
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

export default PositiveAttentionGratitudeRegisterPage;
