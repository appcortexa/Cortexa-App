import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import type { SelfCompassionRecord } from "../../../selfCompassion/SelfCompassionRecord";
import { SelfCompassionSummaryCard } from "../../../selfCompassion/SelfCompassionSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type SelfCriticalDialogueRecord = Pick<SelfCompassionRecord, "situation" | "selfCriticalThought" | "emotion" | "intensity">;

type SummaryPageState = {
	records?: SelfCriticalDialogueRecord[];
};

function sanitizeRecords(state: unknown): SelfCriticalDialogueRecord[] {
	if (!state || typeof state !== "object") {
		return [];
	}

	const maybeRecords = (state as SummaryPageState).records;

	if (!Array.isArray(maybeRecords)) {
		return [];
	}

	return maybeRecords.filter(
		(record) =>
			typeof record.situation === "string" &&
			typeof record.selfCriticalThought === "string" &&
			typeof record.emotion === "string" &&
			typeof record.intensity === "number",
	);
}

function SelfCompassionDetectionSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);

	if (records.length === 0) {
		return <Navigate to="/renace/autocompasion/deteccion-dialogo-autocritico/registro" replace />;
	}

	const averageIntensity = records.reduce((sum, record) => sum + record.intensity, 0) / records.length;
	const uniqueEmotions = new Set(records.map((record) => record.emotion)).size;

	return (
		<InterventionScreenLayout
			title="Resumen del diálogo autocrítico"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/autocompasion/deteccion-dialogo-autocritico/registro", { state: { records } })
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/autocompasion/deteccion-dialogo-autocritico/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<SelfCompassionSummaryCard
				title="Resumen"
				indicators={[
					{ label: "Número de registros", value: records.length },
					{ label: "Intensidad promedio", value: averageIntensity.toFixed(1) },
					{ label: "Número de emociones diferentes identificadas", value: uniqueEmotions },
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de diálogo autocrítico">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Pensamiento autocrítico</TableCell>
							<TableCell>Emoción</TableCell>
							<TableCell align="right">Intensidad</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.selfCriticalThought}</TableCell>
								<TableCell>{record.emotion}</TableCell>
								<TableCell align="right">{record.intensity}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionDetectionSummaryPage;
