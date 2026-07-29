import { Card, CardContent, Stack, Typography } from "@mui/material";

export type RuminationSummaryMetric = {
	id: string;
	label: string;
	value: string | number;
};

type RuminationSummaryCardProps = {
	title: string;
	metrics: RuminationSummaryMetric[];
};

function RuminationSummaryCard({ title, metrics }: RuminationSummaryCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 3 }}>
			<CardContent>
				<Stack spacing={1.5}>
					<Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: "primary.main" }}>
						{title}
					</Typography>
					{metrics.map((metric) => (
						<Stack key={metric.id} direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
							<Typography variant="body2" sx={{ color: "text.secondary" }}>
								{metric.label}
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
								{metric.value}
							</Typography>
						</Stack>
					))}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default RuminationSummaryCard;