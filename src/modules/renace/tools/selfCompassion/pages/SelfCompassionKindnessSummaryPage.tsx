import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import type { SelfCompassionRecord } from "../../../selfCompassion/SelfCompassionRecord";
import { SelfCompassionSummaryCard } from "../../../selfCompassion/SelfCompassionSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";

type KindnessResponseRecord = Pick<
	SelfCompassionRecord,
	"situation" | "selfCriticalThought" | "compassionateResponse" | "intensity"
>;

type SummaryPageState = {
	records?: KindnessResponseRecord[];
};

function sanitizeRecords(state: unknown): KindnessResponseRecord[] {
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
			typeof record.compassionateResponse === "string" &&
			typeof record.intensity === "number",
	);
}

function SelfCompassionKindnessSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const records = sanitizeRecords(location.state);

	if (records.length === 0) {
		return <Navigate to="/renace/autocompasion/responderse-con-amabilidad/registro" replace />;
	}

	const averageCredibility = records.reduce((sum, record) => sum + record.intensity, 0) / records.length;

	return (
		<InterventionScreenLayout
			title="Resumen de respuestas amables"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/autocompasion/responderse-con-amabilidad/registro", { state: { records } })}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/autocompasion/responderse-con-amabilidad/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<SelfCompassionSummaryCard
				title="Resumen"
				indicators={[
					{ label: "Número de ejercicios", value: records.length },
					{ label: "Credibilidad promedio", value: averageCredibility.toFixed(1) },
					{ label: "Número de respuestas elaboradas", value: records.length },
				]}
			/>

			<TableContainer>
				<Table size="small" aria-label="Resumen de respuestas amables">
					<TableHead>
						<TableRow>
							<TableCell>Situación</TableCell>
							<TableCell>Pensamiento autocrítico</TableCell>
							<TableCell>Respuesta amable</TableCell>
							<TableCell align="right">Credibilidad</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{records.map((record, index) => (
							<TableRow key={`${record.situation}-${index}`}>
								<TableCell>{record.situation}</TableCell>
								<TableCell>{record.selfCriticalThought}</TableCell>
								<TableCell>{record.compassionateResponse}</TableCell>
								<TableCell align="right">{record.intensity}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionKindnessSummaryPage;
