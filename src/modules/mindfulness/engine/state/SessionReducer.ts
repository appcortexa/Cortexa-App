import { SESSION_ACTION_TYPES, type SessionAction } from "./SessionAction";
import { SESSION_STATES, type SessionState } from "./SessionState";

/**
 * Tabla de transiciones permitidas por accion y estado actual.
 * Si no existe mapeo, la transicion es invalida y se conserva el estado.
 */
const VALID_TRANSITIONS: Record<SessionAction["type"], Partial<Record<SessionState, SessionState>>> = {
	[SESSION_ACTION_TYPES.INITIALIZE]: {
		[SESSION_STATES.IDLE]: SESSION_STATES.READY,
	},
	[SESSION_ACTION_TYPES.START]: {
		[SESSION_STATES.READY]: SESSION_STATES.RUNNING,
	},
	[SESSION_ACTION_TYPES.PAUSE]: {
		[SESSION_STATES.RUNNING]: SESSION_STATES.PAUSED,
	},
	[SESSION_ACTION_TYPES.RESUME]: {
		[SESSION_STATES.PAUSED]: SESSION_STATES.RUNNING,
	},
	[SESSION_ACTION_TYPES.SHOW_ASSESSMENT]: {
		[SESSION_STATES.RUNNING]: SESSION_STATES.ASSESSMENT,
	},
	[SESSION_ACTION_TYPES.CONTINUE]: {
		[SESSION_STATES.ASSESSMENT]: SESSION_STATES.RUNNING,
	},
	[SESSION_ACTION_TYPES.FINISH]: {
		[SESSION_STATES.RUNNING]: SESSION_STATES.FINISHED,
	},
	[SESSION_ACTION_TYPES.RESET]: {
		[SESSION_STATES.FINISHED]: SESSION_STATES.IDLE,
	},
};

/**
 * Reducer puro de estado de sesion. No ejecuta efectos secundarios.
 */
export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
	const nextState = VALID_TRANSITIONS[action.type][state];
	return nextState ?? state;
}