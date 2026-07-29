import { Box, LinearProgress, Stack, Typography } from "@mui/material";

type SessionHeaderProps = {
	remainingMs: number;
	durationMs: number;
};

function formatRemainingTime(remainingMs: number): string {
	const safeRemainingMs = Math.max(0, remainingMs);
	const totalSeconds = Math.floor(safeRemainingMs / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function SessionHeader({ remainingMs, durationMs }: SessionHeaderProps) {
	const progress = durationMs <= 0 ? 0 : ((durationMs - Math.max(0, remainingMs)) / durationMs) * 100;

	return (
		<Box sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", px: 3, py: 2.5 }}>
			<Stack spacing={1.25}>
				<Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
						Tiempo restante
					</Typography>
					<Typography variant="h5" sx={{ fontWeight: 700, color: "primary.main" }}>
						{formatRemainingTime(remainingMs)}
					</Typography>
				</Box>

				<LinearProgress
					variant="determinate"
					value={Math.min(100, Math.max(0, progress))}
					sx={{ height: 10, borderRadius: 999 }}
				/>
			</Stack>
		</Box>
	);
}

export default SessionHeader;