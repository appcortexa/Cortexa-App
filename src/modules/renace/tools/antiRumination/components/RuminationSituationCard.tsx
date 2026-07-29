import { Card, CardContent, Stack, Typography } from "@mui/material";

type RuminationSituationCardProps = {
	triggerSituation: string;
	ruminationTopic: string;
};

function RuminationSituationCard({ triggerSituation, ruminationTopic }: RuminationSituationCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 3 }}>
			<CardContent>
				<Stack spacing={2}>
					<Stack spacing={0.5}>
						<Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
							Situacion desencadenante
						</Typography>
						<Typography variant="body1" sx={{ color: "text.primary" }}>
							{triggerSituation}
						</Typography>
					</Stack>
					<Stack spacing={0.5}>
						<Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
							Tema de la rumiacion
						</Typography>
						<Typography variant="body1" sx={{ color: "text.primary" }}>
							{ruminationTopic}
						</Typography>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default RuminationSituationCard;