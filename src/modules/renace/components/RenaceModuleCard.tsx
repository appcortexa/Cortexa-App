import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";

type RenaceModuleCardProps = {
	titulo: string;
	descripcion: string;
	boton: string;
	onClick: () => void;
};

function RenaceModuleCard({ titulo, descripcion, boton, onClick }: RenaceModuleCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 3, height: "100%", display: "flex", flexDirection: "column" }}>
			<CardContent sx={{ px: 3, py: 2.5, flexGrow: 1 }}>
				<Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
					{titulo}
				</Typography>
				<Typography variant="body2" sx={{ color: "text.secondary", mt: 0.75, lineHeight: 1.6 }}>
					{descripcion}
				</Typography>
			</CardContent>
			<CardActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
				<Button variant="outlined" onClick={onClick}>
					{boton}
				</Button>
			</CardActions>
		</Card>
	);
}

export default RenaceModuleCard;
