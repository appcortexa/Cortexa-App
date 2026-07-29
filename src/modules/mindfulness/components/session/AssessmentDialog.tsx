import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

import CravingScale from "../../../../components/common/CravingScale";
import type {
	MindfulnessAssessmentValue,
	PendingMindfulnessAssessment,
} from "../../models/MindfulnessAssessment";
import {
	ASSESSMENT_VARIABLE_LABELS,
	ASSESSMENT_VARIABLE_QUESTIONS,
} from "../../models/mindfulness.models";

type AssessmentDialogProps = {
	assessment: PendingMindfulnessAssessment | null;
	onConfirm: (values: readonly MindfulnessAssessmentValue[]) => void;
};

function AssessmentDialog({ assessment, onConfirm }: AssessmentDialogProps) {
	const [values, setValues] = useState<Record<string, number | null>>({});

	const isOpen = assessment !== null;
	const variables = assessment?.variables ?? [];
	const areAllValuesComplete = variables.every((variable) => values[variable] !== null);

	function handleValueChange(variable: string, value: number): void {
		setValues((currentValues) => ({
			...currentValues,
			[variable]: value,
		}));
	}

	function handleConfirm(): void {
		if (assessment === null || !areAllValuesComplete) {
			return;
		}

		onConfirm(
			assessment.variables.map((variable) => ({
				variable,
				value: values[variable] ?? 0,
			})),
		);
		setValues({});
	}

	return (
		<Dialog open={isOpen} fullWidth maxWidth="sm">
			<DialogTitle sx={{ fontWeight: 700 }}>Evaluación intermedia</DialogTitle>
			<DialogContent>
				<Stack spacing={3} sx={{ pt: 0.5 }}>
					<Typography sx={{ color: "text.secondary" }}>
						Registra únicamente las variables configuradas para esta sesión.
					</Typography>
					{variables.map((variable) => (
						<Stack key={variable} spacing={1.5}>
							<Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.main" }}>
								{ASSESSMENT_VARIABLE_LABELS[variable]}
							</Typography>
							<Typography sx={{ color: "text.primary" }}>
								{ASSESSMENT_VARIABLE_QUESTIONS[variable]}
							</Typography>
							<CravingScale value={values[variable] ?? null} onChange={(value) => handleValueChange(variable, value)} />
						</Stack>
					))}
				</Stack>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 2.5 }}>
				<Button variant="contained" onClick={handleConfirm} disabled={!areAllValuesComplete}>
					Continuar sesión
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AssessmentDialog;