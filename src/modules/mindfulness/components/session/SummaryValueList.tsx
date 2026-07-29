import { Box, Stack, Typography } from "@mui/material";

import type {
	MindfulnessSessionSummaryFieldViewModel,
	MindfulnessSessionSummaryValueViewModel,
} from "../../models/MindfulnessSessionSummaryViewModel";

type SummaryItem = MindfulnessSessionSummaryFieldViewModel | MindfulnessSessionSummaryValueViewModel;

type SummaryValueListProps = {
	items: readonly SummaryItem[];
	emptyMessage: string;
};

function SummaryValueList({ items, emptyMessage }: SummaryValueListProps) {
	if (items.length === 0) {
		return <Typography sx={{ color: "text.secondary" }}>{emptyMessage}</Typography>;
	}

	return (
		<Stack spacing={1.5}>
			{items.map((item) => (
				<Box
					key={`${item.label}-${item.value}`}
					sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}
				>
					<Typography sx={{ color: "text.secondary" }}>{item.label}</Typography>
					<Typography sx={{ fontWeight: 700, textAlign: "right" }}>{item.value}</Typography>
				</Box>
			))}
		</Stack>
	);
}

export default SummaryValueList;