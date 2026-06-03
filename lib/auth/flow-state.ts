import { cookies } from 'next/headers';
import { COOKIE_NAMES, COOKIE_MAX_AGE, type Role } from '@/lib/constants';

export type FlowStep = 'role' | 'email' | 'verify' | 'profile';

export type FlowState = {
  role?: Role;
  email?: string;
  otpSentAt?: number; // timestamp (ms) când a fost trimis ultimul cod OTP
  completedSteps: FlowStep[];
};

const opts = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: COOKIE_MAX_AGE.FLOW,
};

export async function getFlowState(): Promise<FlowState> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAMES.FLOW)?.value;
  if (!raw) return { completedSteps: [] };
  
  try {
    return JSON.parse(raw) as FlowState;
  } catch {
    return { completedSteps: [] };
  }
}

export async function updateFlowState(patch: Partial<FlowState>) {
  const current = await getFlowState();
  const merged: FlowState = {
    ...current,
    ...patch,
    completedSteps: Array.from(
      new Set([...(current.completedSteps ?? []), ...(patch.completedSteps ?? [])]),
    ),
  };
  
  const store = await cookies();
  store.set(COOKIE_NAMES.FLOW, JSON.stringify(merged), opts);
  return merged;
}

export async function markStepCompleted(step: FlowStep, patch: Partial<FlowState> = {}) {
  return updateFlowState({ ...patch, completedSteps: [step] });
}

export async function clearFlowState() {
  const store = await cookies();
  store.delete(COOKIE_NAMES.FLOW);
}