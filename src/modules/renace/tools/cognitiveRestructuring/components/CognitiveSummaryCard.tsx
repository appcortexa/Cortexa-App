import { Card, CardContent, Stack, Typography } from "@mui/material";

export type CognitiveSummaryIndicator = {
	id: string;
	label: string;
	value: string | number;
};

type CognitiveSummaryCardProps = {
	title: string;
	indicators: CognitiveSummaryIndicator[];
};

function CognitiveSummaryCard({ title, indicators }: CognitiveSummaryCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 3 }}>
			<CardContent>
				<Stack spacing={1.5}>
					<Typography variant="h6" component="h3" sx={{ fontWeight: 700, color: "primary.main" }}>
						{title}
					</Typography>
					{indicators.map((indicator) => (
						<Stack key={indicator.id} direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
							<Typography variant="body2" sx={{ color: "text.secondary" }}>
								{indicator.label}
							</Typography>
							<Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
								{indicator.value}
							</Typography>
						</Stack>
					))}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default CognitiveSummaryCard;
