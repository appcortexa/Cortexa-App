import {
	Alert,
	Button,
	MenuItem,
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
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type ActivityHierarchyEntry = {
	activity: string;
	importance: number;
	difficulty: number;
	probability: number;
	priority?: number;
};

type PrioritiesPageState = {
	activities?: ActivityHierarchyEntry[];
};

function sanitizeActivities(state: unknown): ActivityHierarchyEntry[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeActivities = (state as PrioritiesPageState).activities;

	if (!Array.isArray(maybeActivities)) {
		return [];
	}

	return maybeActivities.filter(
		(entry) =>
			typeof entry.activity === "string" &&
			typeof entry.importance === "number" &&
			typeof entry.difficulty === "number" &&
			typeof entry.probability === "number" &&
			(typeof entry.priority === "undefined" || typeof entry.priority === "number"),
	);
}

function BehavioralActivationActivityHierarchyPrioritiesPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const activities = sanitizeActivities(location.state);
	const hasActivities = activities.length > 0;

	const initialPrioritizedActivities = useMemo(
		() =>
			activities.map((entry, index) => ({
				...entry,
				priority:
					typeof entry.priority === "number" &&
					entry.priority >= 1 &&
					entry.priority <= activities.length
						? entry.priority
						: index + 1,
			})),
		[activities],
	);
	const [prioritizedActivities, setPrioritizedActivities] =
		useState<ActivityHierarchyEntry[]>(initialPrioritizedActivities);
	const availablePriorities = Array.from({ length: prioritizedActivities.length }, (_, index) => index + 1);

	const usedPriorities = prioritizedActivities.map((entry) => entry.priority);
	const hasUniquePriorities = new Set(usedPriorities).size === prioritizedActivities.length;

	if (!hasActivities) {
		return <Navigate to="/renace/activacion-conductual/jerarquia-actividades/registro" replace />;
	}

	return (
		<InterventionScreenLayout
			title="Asignación de Prioridades"
			description="Asigna una prioridad numérica a cada actividad. 1 indica la prioridad más alta."
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/activacion-conductual/jerarquia-actividades/registro", {
								state: { activities: prioritizedActivities },
							})
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						disabled={!hasUniquePriorities}
						onClick={() =>
							navigate("/renace/activacion-conductual/jerarquia-actividades/resumen", {
								state: { activities: prioritizedActivities },
							})
						}
					>
						Continuar
					</Button>
				</Stack>
			}
		>
			<Stack spacing={2}>
				{hasUniquePriorities ? null : (
					<Alert severity="warning">Cada actividad debe tener una prioridad única.</Alert>
				)}

				<TableContainer>
					<Table size="small" aria-label="Asignación de prioridades">
						<TableHead>
							<TableRow>
								<TableCell>Actividad</TableCell>
								<TableCell align="right">Importancia</TableCell>
								<TableCell align="right">Dificultad</TableCell>
								<TableCell align="right">Probabilidad</TableCell>
								<TableCell align="right">Prioridad</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{prioritizedActivities.map((entry, index) => (
								<TableRow key={`${entry.activity}-${index}`}>
									<TableCell>{entry.activity}</TableCell>
									<TableCell align="right">{entry.importance}</TableCell>
									<TableCell align="right">{entry.difficulty}</TableCell>
									<TableCell align="right">{entry.probability}</TableCell>
									<TableCell align="right">
										<TextField
											select
											size="small"
											label="Prioridad"
											value={entry.priority}
											onChange={(event) => {
												const nextPriority = Number(event.target.value);
												setPrioritizedActivities((currentActivities) =>
													currentActivities.map((activityEntry, activityIndex) =>
													activityIndex === index
														? { ...activityEntry, priority: nextPriority }
														: activityEntry,
													),
												);
											}}
											sx={{ minWidth: 96 }}
										>
											{availablePriorities.map((priority) => (
												<MenuItem key={priority} value={priority}>
													{priority}
												</MenuItem>
											))}
										</TextField>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>

				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					Usa números consecutivos para definir la jerarquía de actividades.
				</Typography>
			</Stack>
		</InterventionScreenLayout>
	);
}

export default BehavioralActivationActivityHierarchyPrioritiesPage;
