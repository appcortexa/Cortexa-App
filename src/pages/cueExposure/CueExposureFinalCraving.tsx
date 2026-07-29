import { useEffect, useState } from "react";

import { Box, Container } from "@mui/material";
import { Navigate } from "react-router-dom";

import { useCueExposureSession } from "../../contexts/CueExposureSessionContext";
import CravingDialog from "./components/CravingDialog";

function CueExposureFinalCraving() {
	const { session, setSession } = useCueExposureSession();
	const [cravingValue, setCravingValue] = useState<number | null>(null);

	useEffect(() => {
		if (!session) {
			return;
		}

		setSession((previousSession) => {
			if (!previousSession || previousSession.id !== session.id) {
				return previousSession;
			}

			if (previousSession.state.status === "finished" && previousSession.finishedAt) {
				return previousSession;
			}

			return {
				...previousSession,
				finishedAt: previousSession.finishedAt ?? new Date().toISOString(),
				state: {
					...previousSession.state,
					status: "finished",
				},
			};
		});
	}, [session, setSession]);

	function handleContinue(): void {
		if (!session || cravingValue === null) {
			return;
		}

		setSession((previousSession) => {
			if (!previousSession || previousSession.id !== session.id) {
				return previousSession;
			}

			return {
				...previousSession,
				cravingRecords: previousSession.cravingRecords.map((record) =>
					record.type === "final"
						? {
							...record,
							relativeSecond: previousSession.state.elapsedSeconds,
							value: cravingValue,
							recordedAt: new Date().toISOString(),
						}
						: record,
				),
				result: {
					...previousSession.result,
					finalCraving: cravingValue,
				},
			};
		});
	}

	if (!session) {
		return <Navigate to="/cue-exposure" replace />;
	}

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
				<CravingDialog
					question="¿Qué intensidad tiene en este momento tu deseo de consumir?"
					value={cravingValue}
					onChange={setCravingValue}
					onContinue={handleContinue}
				/>
			</Container>
		</Box>
	);
}

export default CueExposureFinalCraving;