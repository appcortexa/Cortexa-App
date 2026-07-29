import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

type ModuleCardProps = {
	title: string;
	description: string;
	selected?: boolean;
	disabled?: boolean;
	onClick?: () => void;
};

function ModuleCard({ title, description, selected = false, disabled = false, onClick }: ModuleCardProps) {
	return (
		<Card
			variant="outlined"
			sx={{
				borderRadius: 3,
				opacity: disabled ? 0.6 : 1,
				bgcolor: disabled ? "action.hover" : selected ? "primary.50" : "background.paper",
				borderColor: selected ? "primary.main" : "divider",
				borderWidth: selected ? 2 : 1,
			}}
		>
			<CardActionArea
				disabled={disabled}
				onClick={onClick}
				sx={{ borderRadius: 3, alignItems: "stretch" }}
			>
				<CardContent sx={{ px: 3, py: 2.5, textAlign: "left" }}>
					<Typography variant="h6" sx={{ fontWeight: 700, color: selected ? "primary.main" : "primary.main" }}>
						{title}
					</Typography>
					<Typography
						variant="body2"
						sx={{ color: disabled ? "text.disabled" : "text.secondary", mt: 0.75, lineHeight: 1.6 }}
					>
						{description}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

export default ModuleCard;