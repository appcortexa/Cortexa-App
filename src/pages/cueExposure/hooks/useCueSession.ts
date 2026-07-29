import type { Dispatch, SetStateAction } from "react";

import { useCueExposureSession } from "../../../contexts/CueExposureSessionContext";
import type { CueExposureSession, SessionConfig } from "../types/cueExposure.types";

interface UseCueSessionApi {
	session: CueExposureSession | null;
	setSession: Dispatch<SetStateAction<CueExposureSession | null>>;
	createSession: (config: SessionConfig) => CueExposureSession;
}

export function useCueSession(): UseCueSessionApi {
	const { session, setSession, createSession } = useCueExposureSession();

	return { session, setSession, createSession };
}
