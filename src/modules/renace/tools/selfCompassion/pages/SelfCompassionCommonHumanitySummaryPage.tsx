import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import type { CommonHumanityRecord } from "../../../selfCompassion/CommonHumanityRecord";
import { SelfCompassionSummaryCard } from "../../../selfCompassion/SelfCompassionSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type SummaryPageState = {
	records?: CommonHumanityRecord[];
};

function sanitizeRecords(state: unknown): CommonHumanityRecord[] {
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
			typeof record.isolationFeeling === "string" &&
			typeof record.sharedHumanityReflection === "string" &&
			typeof record.connectionLevel === "number",
	);
}

function SelfCompassionCommonHumanitySummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);

	if (records.length === 0) {
		return <Navigate to="/renace/autocompasion/humanidad-compartida/registro" replace />;
	}

	const averageConnection = records.reduce((sum, record) => sum + record.connectionLevel, 0) / records.length;

	return (
		<InterventionScreenLayout
			title="Resumen de humanidad compartida"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() =>
							navigate("/renace/autocompasion/humanidad-compartida/registro", { state: { records } })
						}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/autocompasion/humanidad-compartida/final")}
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
					{ label: "Nivel promedio de conexión", value: averageConnection.toFixed(1) },
					{ label: "Número de reflexiones elaboradas", value: records.length },
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de humanidad compartida">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Sensación de aislamiento</TableCell>
							<TableCell>Reflexión de humanidad compartida</TableCell>
							<TableCell align="right">Nivel de conexión</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.isolationFeeling}</TableCell>
								<TableCell>{record.sharedHumanityReflection}</TableCell>
								<TableCell align="right">{record.connectionLevel}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionCommonHumanitySummaryPage;
