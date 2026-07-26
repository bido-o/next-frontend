import type { SignupRole } from '@/lib/constants';
import { COOKIE_NAMES, COOKIE_MAX_AGE } from '@/lib/constants';
import { createFlowState } from '@/lib/create-flow-state';

export type FlowStep = 'role' | 'email' | 'verify' | 'profile';

export type FlowState = {
  role?: SignupRole;
  email?: string;
  otpSentAt?: number; // timestamp (ms) când a fost trimis ultimul cod OTP
  completedSteps: FlowStep[];
};

const flow = createFlowState<FlowStep, FlowState>(COOKIE_NAMES.AUTH_FLOW, COOKIE_MAX_AGE.AUTH_FLOW);

export const getFlowState = flow.get;
export const updateFlowState = flow.update;
export const markStepCompleted = flow.mark;
export const clearFlowState = flow.clear;
