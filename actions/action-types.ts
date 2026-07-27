/** Starea întoarsă de Server Actions către `useActionState`. */
export type ActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> };

/** Starea inițială, înainte de orice submit. */
export const IDLE: ActionState = { status: 'idle' };
