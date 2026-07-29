import { Box } from "@mui/material";

import type { BreathingVisualState } from "../models/BreathingVisualState";

interface BreathingAnimatorProps {
	readonly visualState: BreathingVisualState;
}

const SVG_VIEWBOX_SIZE = 200;
const MIN_RADIUS = 36;
const MAX_RADIUS = 82;
const CENTER = SVG_VIEWBOX_SIZE / 2;
const TRANSITION_MS = 120;

function clamp(value: number): number {
	if (value <= 0) {
		return 0;
	}

	if (value >= 1) {
		return 1;
	}

	return value;
}

function resolveRadius(visualState: BreathingVisualState): number {
	const progress = clamp(visualState.phaseProgress);
	const amplitude = MAX_RADIUS - MIN_RADIUS;

	switch (visualState.phaseKey) {
		case "INHALE":
			return MIN_RADIUS + amplitude * progress;
		case "EXHALE":
			return MAX_RADIUS - amplitude * progress;
		case "HOLD":
		case "HOLD_FULL":
		case "HOLD_EMPTY":
			return MAX_RADIUS;
		case "REST":
			return MIN_RADIUS;
		default:
			return MIN_RADIUS;
	}
}

export default function BreathingAnimator({ visualState }: BreathingAnimatorProps) {
	const radius = resolveRadius(visualState);
	const glowRadius = Math.max(MIN_RADIUS, radius + 16);

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				py: 1,
			}}
		>
			<svg
				viewBox={`0 0 ${SVG_VIEWBOX_SIZE} ${SVG_VIEWBOX_SIZE}`}
				width="100%"
				height="260"
				role="img"
				aria-label={`Animación respiratoria ${visualState.displayText}`}
			>
				<defs>
					<radialGradient id="breathing-core" cx="50%" cy="45%" r="60%">
						<stop offset="0%" stopColor="#E5FBF2" />
						<stop offset="60%" stopColor="#84D8B7" />
						<stop offset="100%" stopColor="#2D8F68" />
					</radialGradient>
				</defs>

				<circle
					cx={CENTER}
					cy={CENTER}
					r={glowRadius}
					fill="#B8EED8"
					fillOpacity={0.26}
					style={{ transition: `r ${TRANSITION_MS}ms linear` }}
				/>

				<circle
					cx={CENTER}
					cy={CENTER}
					r={radius}
					fill="url(#breathing-core)"
					stroke="#1E6B4C"
					strokeWidth="2"
					style={{ transition: `r ${TRANSITION_MS}ms linear` }}
				/>
			</svg>
		</Box>
	);
}