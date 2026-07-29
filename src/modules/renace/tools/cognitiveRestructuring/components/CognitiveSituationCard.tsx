import { Card, CardContent, Stack, Typography } from "@mui/material";

type CognitiveSituationCardProps = {
	situation: string;
	automaticThought: string;
};

function CognitiveSituationCard({ situation, automaticThought }: CognitiveSituationCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 3 }}>
			<CardContent>
				<Stack spacing={2}>
					<Stack spacing={0.5}>
						<Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
							Situacion
						</Typography>
						<Typography variant="body1" sx={{ color: "text.primary" }}>
							{situation}
						</Typography>
					</Stack>
					<Stack spacing={0.5}>
						<Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
							Pensamiento Automatico
						</Typography>
						<Typography variant="body1" sx={{ color: "text.primary" }}>
							{automaticThought}
						</Typography>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default CognitiveSituationCard;
