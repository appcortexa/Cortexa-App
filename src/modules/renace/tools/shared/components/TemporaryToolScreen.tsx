import { Box, Button, Container, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type TemporaryToolScreenProps = {
	title: string;
	backLabel: string;
	onBack: () => void;
	nextLabel?: string;
	onNext?: () => void;
	extraActions?: ReactNode;
};

function TemporaryToolScreen({
	title,
	backLabel,
	onBack,
	nextLabel,
	onNext,
	extraActions,
}: TemporaryToolScreenProps) {
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
				<Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
					<Typography
						variant="h4"
						component="h1"
						sx={{
							fontWeight: 700,
							color: "primary.main",
							fontSize: { xs: "1.8rem", sm: "2.125rem" },
						}}
					>
						{title}
					</Typography>
					<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
						<Button variant="outlined" size="large" onClick={onBack}>
							{backLabel}
						</Button>
						{nextLabel && onNext ? (
							<Button variant="contained" size="large" onClick={onNext}>
								{nextLabel}
							</Button>
						) : null}
					</Stack>
					{extraActions}
				</Stack>
			</Container>
		</Box>
	);
}

export default TemporaryToolScreen;
