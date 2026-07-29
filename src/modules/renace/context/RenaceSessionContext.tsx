import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface InterventionHistory {
	tool: string;
	exerciseId: string;
	exerciseTitle: string;
	completed: boolean;
	timestamp: string;
}

export interface RenaceSession {
	expediente: string;
	interventions: InterventionHistory[];
}

type RegisterInterventionInput = Omit<InterventionHistory, "timestamp">;

type RenaceSessionContextValue = {
	session: RenaceSession | null;
	startSession: (expediente: string) => void;
	finishSession: () => void;
	registerIntervention: (intervention: RegisterInterventionInput) => void;
};

const RenaceSessionContext = createContext<RenaceSessionContextValue | undefined>(undefined);

type RenaceSessionProviderProps = {
	children: ReactNode;
};

export function RenaceSessionProvider({ children }: RenaceSessionProviderProps) {
	const [session, setSession] = useState<RenaceSession | null>(null);

	const startSession = (expediente: string) => {
		setSession({
			expediente,
			interventions: [],
		});
	};

	const finishSession = () => {
		setSession(null);
	};

	const registerIntervention = (intervention: RegisterInterventionInput) => {
		setSession((currentSession) => {
			if (!currentSession) {
				return currentSession;
			}

			return {
				...currentSession,
				interventions: [
					...currentSession.interventions,
					{
						...intervention,
						timestamp: new Date().toISOString(),
					},
				],
			};
		});
	};

	const value = useMemo(
		() => ({
			session,
			startSession,
			finishSession,
			registerIntervention,
		}),
		[session],
	);

	return <RenaceSessionContext.Provider value={value}>{children}</RenaceSessionContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRenaceSession() {
	const context = useContext(RenaceSessionContext);

	if (!context) {
		throw new Error("useRenaceSession must be used within a RenaceSessionProvider");
	}

	return context;
}