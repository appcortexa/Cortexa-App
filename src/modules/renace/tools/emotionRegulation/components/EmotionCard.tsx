import { Card, CardContent, Stack, Typography } from "@mui/material";

type EmotionCardProps = {
	label: string;
	value: string;
	accent?: string;
};

function EmotionCard({ label, value, accent = "primary.main" }: EmotionCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
			<CardContent>
				<Stack spacing={1}>
					<Typography variant="body2" sx={{ color: "text.secondary" }}>
						{label}
					</Typography>
					<Typography variant="body1" sx={{ fontWeight: 700, color: accent }}>
						{value}
					</Typography>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default EmotionCard;
