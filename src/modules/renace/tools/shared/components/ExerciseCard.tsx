import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";

type ExerciseCardProps = {
	title: string;
	description: string;
	onOpen: () => void;
};

function ExerciseCard({ title, description, onOpen }: ExerciseCardProps) {
	return (
		<Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
			<CardContent>
				<Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: "primary.main" }}>
					{title}
				</Typography>
				<Typography variant="body2" sx={{ mt: 1, color: "text.secondary", lineHeight: 1.6 }}>
					{description}
				</Typography>
			</CardContent>
			<CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
				<Button variant="contained" size="medium" onClick={onOpen}>
					Abrir
				</Button>
			</CardActions>
		</Card>
	);
}

export default ExerciseCard;
