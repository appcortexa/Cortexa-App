import {
	Alert,
	Button,
	Slider,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type PleasureAchievementEntry = {
	activity: string;
	pleasure: number;
	achievement: number;
};

type RegisterPageState = {
	entries?: PleasureAchievementEntry[];
};

function sanitizeEntries(state: unknown): PleasureAchievementEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeEntries = (state as RegisterPageState).entries;

	if (!Array.isArray(maybeEntries)) {
		return [];
	}

	return maybeEntries.filter(
		(entry) =>
			typeof entry.activity === "string" &&
			typeof entry.pleasure === "number" &&
			typeof entry.achievement === "number",
	);
}

function BehavioralActivationPleasureAchievementRegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();

	const initialEntries = useMemo(() => sanitizeEntries(location.state), [location.state]);
	const [entries, setEntries] = useState<PleasureAchievementEntry[]>(initialEntries);
	const [activity, setActivity] = useState("");
	const [pleasure, setPleasure] = useState<number>(5);
	const [achievement, setAchievement] = useState<number>(5);
	const [activityError, setActivityError] = useState(false);
	const [showPostSaveActions, setShowPostSaveActions] = useState(entries.length > 0);

	const handleSaveEntry = () => {
		const trimmedActivity = activity.trim();

		if (trimmedActivity.length === 0) {
			setActivityError(true);
			return;
		}

		setEntries((currentEntries) => [
			...currentEntries,
			{
				activity: trimmedActivity,
				pleasure,
				achievement,
			},
		]);
		setActivity("");
		setPleasure(5);
		setAchievement(5);
		setActivityError(false);
		setShowPostSaveActions(true);
	};

	const handleFinalize = () => {
		navigate("/renace/activacion-conductual/registro-placer-logro/resumen", {
			state: { entries },
		});
	};

	const canFinalize = entries.length > 0;

	return (
		<InterventionScreenLayout
			title="Registro Placer–Logro"
			description="Registra una actividad por vez y califica cuánto placer y logro te produjo en una escala de 0 a 10."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/registro-placer-logro/introduccion")
						}
					>
						Regresar
					</Button>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						{showPostSaveActions ? (
							<Button
								variant="outlined"
								size="large"
								onClick={() => {
									setActivity("");
									setPleasure(5);
									setAchievement(5);
									setActivityError(false);
								}}
							>
								Agregar otra actividad
							</Button>
						) : null}
						<Button variant="contained" size="large" disabled={!canFinalize} onClick={handleFinalize}>
							Finalizar registro
						</Button>
					</Stack>
				</Stack>
			}
		>
			<Stack spacing={2}>
				<TextField
					required
					fullWidth
					label="Actividad"
					value={activity}
					onChange={(event) => {
						setActivity(event.target.value);
						if (activityError && event.target.value.trim().length > 0) {
							setActivityError(false);
						}
					}}
					error={activityError}
					helperText={activityError ? "Ingresa una actividad para guardarla." : " "}
				/>

				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Placer: {pleasure}
					</Typography>
					<Slider
						value={pleasure}
						onChange={(_, value) => setPleasure(value as number)}
						min={0}
						max={10}
						step={1}
						valueLabelDisplay="auto"
					/>
				</Stack>

				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						Logro: {achievement}
					</Typography>
					<Slider
						value={achievement}
						onChange={(_, value) => setAchievement(value as number)}
						min={0}
						max={10}
						step={1}
						valueLabelDisplay="auto"
					/>
				</Stack>

				<Button variant="contained" size="large" onClick={handleSaveEntry}>
					Guardar actividad
				</Button>

				{entries.length > 0 ? (
					<Alert severity="success">Actividad guardada. Puedes agregar otra actividad o finalizar el registro.</Alert>
				) : (
					<Alert severity="info">Aún no hay actividades registradas.</Alert>
				)}

				{entries.length > 0 ? (
					<TableContainer>
						<Table size="small" aria-label="Actividades registradas">
							<TableHead>
								<TableRow>
									<TableCell>Actividad</TableCell>
									<TableCell align="right">Placer</TableCell>
									<TableCell align="right">Logro</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{entries.map((entry, index) => (
									<TableRow key={`${entry.activity}-${index}`}>
										<TableCell>{entry.activity}</TableCell>
										<TableCell align="right">{entry.pleasure}</TableCell>
										<TableCell align="right">{entry.achievement}</TableCell>
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

export default BehavioralActivationPleasureAchievementRegisterPage;
