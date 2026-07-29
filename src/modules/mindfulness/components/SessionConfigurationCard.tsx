import type { ReactNode } from "react";
import { Card, CardContent, Typography } from "@mui/material";

type SessionConfigurationCardProps = {
	title: string;
	children: ReactNode;
};

function SessionConfigurationCard({ title, children }: SessionConfigurationCardProps) {
	return (
		<Card variant="outlined" sx={{ borderRadius: 3 }}>
			<CardContent sx={{ px: 3, py: 2.5 }}>
				<Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
					{title}
				</Typography>
				{/* ModuleCard no se reutiliza aqui porque su CardActionArea captura clicks de seleccion. */}
				{children}
			</CardContent>
		</Card>
	);
}

export default SessionConfigurationCard;