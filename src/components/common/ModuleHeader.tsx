import { Box, Typography } from "@mui/material";

type ModuleHeaderProps = {
	moduleName?: string;
	title: string;
};

function ModuleHeader({ moduleName, title }: ModuleHeaderProps) {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", textAlign: "center" }}>
			<Box
				component="img"
				src="/logo/logo-reconecta.png"
				alt="Reconecta"
				sx={{
					width: { xs: 160, sm: 200 },
					maxWidth: "100%",
					height: "auto",
				}}
			/>

			<Box>
				<Typography
					variant="h4"
					component="h1"
					sx={{
						fontWeight: 700,
						color: "primary.main",
						fontSize: { xs: "1.8rem", sm: "2.125rem" },
					}}
				>
					Reconecta
				</Typography>
				{moduleName ? (
					<Typography
						variant="h4"
						component="h2"
						sx={{
							fontWeight: 700,
							color: "primary.main",
							fontSize: { xs: "1.8rem", sm: "2.125rem" },
							mt: 0.5,
						}}
					>
						{moduleName}
					</Typography>
				) : null}
				<Typography
					variant="subtitle1"
					sx={{ color: "text.secondary", mt: 1, fontSize: { xs: "1rem", sm: "1.125rem" } }}
				>
					{title}
				</Typography>
			</Box>
		</Box>
	);
}

export default ModuleHeader;