import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";

import { createCueExposureSession } from "../pages/cueExposure/services/sessionFactory";
import type { CueExposureSession, SessionConfig } from "../pages/cueExposure/types/cueExposure.types";

interface CueExposureSessionContextValue {
	session: CueExposureSession | null;
	setSession: Dispatch<SetStateAction<CueExposureSession | null>>;
	createSession: (config: SessionConfig) => CueExposureSession;
	clearSession: () => void;
}

const CueExposureSessionContext = createContext<CueExposureSessionContextValue | undefined>(undefined);

interface CueExposureSessionProviderProps {
	children: ReactNode;
}

export function CueExposureSessionProvider({ children }: CueExposureSessionProviderProps) {
	const [session, setSession] = useState<CueExposureSession | null>(null);

	const createSession = useCallback((config: SessionConfig): CueExposureSession => {
		const newSession = createCueExposureSession(config);
		setSession(newSession);
		return newSession;
	}, []);

	const clearSession = useCallback(() => {
		setSession(null);
	}, []);

	const value = useMemo(
		() => ({
			session,
			setSession,
			createSession,
			clearSession,
		}),
		[session, createSession, clearSession],
	);

	return <CueExposureSessionContext.Provider value={value}>{children}</CueExposureSessionContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCueExposureSession(): CueExposureSessionContextValue {
	const context = useContext(CueExposureSessionContext);

	if (!context) {
		throw new Error("useCueExposureSession must be used within CueExposureSessionProvider");
	}

	return context;
}