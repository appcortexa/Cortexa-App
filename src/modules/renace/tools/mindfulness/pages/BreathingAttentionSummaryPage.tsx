import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { MindfulnessSummaryCard } from "../../../mindfulness/MindfulnessSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type BreathingPractice = { duration: string; distractions: number; consciousReturns: number; attentionStability: number; observations: string };
type SummaryPageState = { practices?: BreathingPractice[] };

function sanitizePractices(state: unknown): BreathingPractice[] {
	if (!state || typeof state !== "object") return [];
	const practices = (state as SummaryPageState).practices;
	if (!Array.isArray(practices)) return [];
	return practices.filter((practice) => typeof practice.duration === "string" && Number.isInteger(practice.distractions) && practice.distractions >= 0 && Number.isInteger(practice.consciousReturns) && practice.consciousReturns >= 0 && typeof practice.attentionStability === "number" && practice.attentionStability >= 0 && practice.attentionStability <= 10 && typeof practice.observations === "string");
}

function BreathingAttentionSummaryPage() {
	const navigate = useNavigate();
	const practices = sanitizePractices(useLocation().state);

	if (practices.length === 0) return <Navigate to="/renace/mindfulness/atencion-respiracion/registro" replace />;

	const averageAttentionStability = practices.reduce((sum, practice) => sum + practice.attentionStability, 0) / practices.length;
	const averageConsciousReturns = practices.reduce((sum, practice) => sum + practice.consciousReturns, 0) / practices.length;

	return (
		<InterventionScreenLayout
			title="Resumen de Atención a la Respiración"
			actions={<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}><Button variant="outlined" size="large" onClick={() => navigate("/renace/mindfulness/atencion-respiracion/registro", { state: { practices } })}>Volver al registro</Button><Button variant="contained" size="large" onClick={() => navigate("/renace/mindfulness/atencion-respiracion/final")}>Finalizar</Button></Stack>}
		>
			<MindfulnessSummaryCard title="Indicadores" indicators={[{ label: "Número de prácticas registradas", value: practices.length }, { label: "Estabilidad promedio", value: averageAttentionStability.toFixed(1) }, { label: "Promedio de retornos conscientes", value: averageConsciousReturns.toFixed(1) }]} />
			<TableContainer><Table size="small" aria-label="Resumen de prácticas de atención a la respiración"><TableHead><TableRow><TableCell>Duración</TableCell><TableCell align="right">Número de distracciones</TableCell><TableCell align="right">Número de retornos conscientes</TableCell><TableCell align="right">Estabilidad atencional</TableCell></TableRow></TableHead><TableBody>{practices.map((practice, index) => <TableRow key={`${practice.duration}-${index}`}><TableCell>{practice.duration}</TableCell><TableCell align="right">{practice.distractions}</TableCell><TableCell align="right">{practice.consciousReturns}</TableCell><TableCell align="right">{practice.attentionStability}</TableCell></TableRow>)}</TableBody></Table></TableContainer>
		</InterventionScreenLayout>
	);
}

export default BreathingAttentionSummaryPage;
