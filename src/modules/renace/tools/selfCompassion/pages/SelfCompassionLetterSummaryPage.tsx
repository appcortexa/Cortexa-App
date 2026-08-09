import { Button, Stack, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { CompassionPhraseCard } from "../../../selfCompassion/CompassionPhraseCard";
import { SelfCompassionSummaryCard } from "../../../selfCompassion/SelfCompassionSummaryCard";
import InterventionScreenLayout from "../../shared/components/InterventionScreenLayout";
import type { CompassionateLetterRecord } from "./SelfCompassionLetterRegisterPage";

type SummaryPageState = {
	record?: CompassionateLetterRecord;
};

function getRecord(state: unknown): CompassionateLetterRecord | null {
	if (!state || typeof state !== "object") {
		return null;
	}

	const { record } = state as SummaryPageState;
	if (
		!record ||
		typeof record.situation !== "string" ||
		typeof record.letter !== "string" ||
		typeof record.mainIdea !== "string" ||
		typeof record.usefulness !== "number"
	) {
		return null;
	}

	return record;
}

function SelfCompassionLetterSummaryPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const record = getRecord(location.state);

	if (!record) {
		return <Navigate to="/renace/autocompasion/carta-compasiva/registro" replace />;
	}

	return (
		<InterventionScreenLayout
			title="Resumen de carta compasiva"
			actions={
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
					<Button
						variant="outlined"
						size="large"
						onClick={() => navigate("/renace/autocompasion/carta-compasiva/registro")}
					>
						Volver al registro
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={() => navigate("/renace/autocompasion/carta-compasiva/final")}
					>
						Finalizar
					</Button>
				</Stack>
			}
		>
			<Stack spacing={2.5}>
				<Stack spacing={0.5}>
					<Typography variant="subtitle2" color="text.secondary">
						Situación
					</Typography>
					<Typography variant="body1">{record.situation}</Typography>
				</Stack>

				<CompassionPhraseCard title="Idea principal" phrase={record.mainIdea} />

				<SelfCompassionSummaryCard
					indicators={[
						{ label: "Carta completada", value: "Sí" },
						{ label: "Nivel de utilidad", value: `${record.usefulness}/10` },
					]}
				/>
			</Stack>
		</InterventionScreenLayout>
	);
}

export default SelfCompassionLetterSummaryPage;
