import { Box, Card, CardContent, Container, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

import renaceLogo from "../../../../../assets/logos/Renace.png";

type InterventionScreenLayoutProps = {
	title: string;
	description?: string;
	children?: ReactNode;
	actions?: ReactNode;
};

function InterventionScreenLayout({
	title,
	description,
	children,
	actions,
}: InterventionScreenLayoutProps) {
	return (
		<Box
			sx={{
				bgcolor: "#FFFFFF",
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				py: { xs: 4, sm: 6 },
			}}
		>
			<Container maxWidth="sm">
				<Card variant="outlined" sx={{ borderRadius: 3 }}>
					<CardContent sx={{ px: { xs: 2.5, sm: 4 }, py: { xs: 3, sm: 4 } }}>
						<Stack spacing={2.5}>
							<Box
								component="img"
								src={renaceLogo}
								alt="RENACE"
								sx={{
									width: { xs: 220, sm: 260 },
									maxWidth: "100%",
									height: "auto",
									alignSelf: "center",
								}}
							/>

							<Box>
								<Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
									{title}
								</Typography>
								{description ? (
									<Typography variant="body1" sx={{ color: "text.secondary", mt: 1, lineHeight: 1.6 }}>
										{description}
									</Typography>
								) : null}
							</Box>

							{children}
							{actions}
						</Stack>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}

export default InterventionScreenLayout;
