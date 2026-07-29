import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

import renaceLogo from "../../../../../assets/logos/Renace.png";

type ToolConfigurationCardProps = {
	toolName: string;
	toolDescription: string;
	onCancel: () => void;
	onStart: (expediente: string) => void;
};

function ToolConfigurationCard({
	toolName,
	toolDescription,
	onCancel,
	onStart,
}: ToolConfigurationCardProps) {
	const [recordNumber, setRecordNumber] = useState("");
	const [recordNumberError, setRecordNumberError] = useState(false);

	const handleStart = () => {
		const trimmedRecordNumber = recordNumber.trim();

		if (trimmedRecordNumber.length === 0) {
			setRecordNumberError(true);
			return;
		}

		setRecordNumberError(false);
		onStart(trimmedRecordNumber);
	};

	const handleRecordNumberChange = (value: string) => {
		setRecordNumber(value);

		if (recordNumberError && value.trim().length > 0) {
			setRecordNumberError(false);
		}
	};

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
									{toolName}
								</Typography>
								<Typography variant="body1" sx={{ color: "text.secondary", mt: 1, lineHeight: 1.6 }}>
									{toolDescription}
								</Typography>
							</Box>

							<TextField
								required
								fullWidth
								label="Número de expediente"
								value={recordNumber}
								onChange={(event) => handleRecordNumberChange(event.target.value)}
								error={recordNumberError}
								helperText={recordNumberError ? "Ingresa el número de expediente para continuar." : " "}
							/>

							<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "flex-end" }}>
								<Button variant="outlined" size="large" onClick={onCancel}>
									Cancelar
								</Button>
								<Button variant="contained" size="large" onClick={handleStart}>
									Iniciar
								</Button>
							</Stack>
						</Stack>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
}

export default ToolConfigurationCard;