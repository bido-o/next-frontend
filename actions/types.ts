export type ActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> };

export const IDLE: ActionState = { status: 'idle' };
