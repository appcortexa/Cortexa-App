import { Card, CardContent, Typography } from "@mui/material";

type SummaryMetricCardProps = {
	label: string;
	value: string | number;
};

function SummaryMetricCard({ label, value }: SummaryMetricCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 2 }}>
			<CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
				<Typography variant="body2" sx={{ color: "text.secondary" }}>
					{label}
				</Typography>
				<Typography variant="h6" component="p" sx={{ fontWeight: 700 }}>
					{value}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default SummaryMetricCard;
