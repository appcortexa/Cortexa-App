import { Stack } from "@mui/material";

import type { ExerciseMetric } from "../types/exercise";
import SummaryMetricCard from "./SummaryMetricCard";

type ExerciseMetricsCardsProps = {
	metrics: ExerciseMetric[];
};

function ExerciseMetricsCards({ metrics }: ExerciseMetricsCardsProps) {
	return (
		<Stack spacing={1}>
			{metrics.map((metric) => (
				<SummaryMetricCard key={metric.id} label={metric.label} value={metric.value} />
			))}
		</Stack>
	);
}

export default ExerciseMetricsCards;
