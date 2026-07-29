import { Box, Stack, Typography } from "@mui/material";

type SessionPromptCardProps = {
	title: string;
	message: string;
	compact?: boolean;
};

function SessionPromptCard({ title, message, compact = false }: SessionPromptCardProps) {
	return (
		<Box
			sx={{
				width: "100%",
				maxWidth: compact ? "100%" : "min(100%, 1100px)",
				minHeight: compact ? { xs: 88, sm: 96 } : { xs: "50vh", sm: "60vh", md: "64vh" },
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				borderRadius: 3,
				boxShadow: "0 20px 60px rgba(15, 23, 42, 0.16)",
				bgcolor: "#F8FAFC",
				p: compact ? { xs: 1.5, sm: 2 } : { xs: 3, sm: 5 },
			}}
		>
			<Stack spacing={1.5} sx={{ width: "100%", alignItems: "center" }}>
				<Typography
					variant="overline"
					sx={{
						fontWeight: 700,
						color: "text.secondary",
						letterSpacing: "0.08em",
						textTransform: "uppercase",
					}}
				>
					{title}
				</Typography>
				<Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.4 }}>
					{message}
				</Typography>
			</Stack>
		</Box>
	);
}

export default SessionPromptCard;
