import { COOKIE_NAMES, COOKIE_MAX_AGE } from '@/lib/constants';
import { createFlowState } from '@/lib/create-flow-state';
import type { AuthFlowState, AuthFlowStep } from '@/types/auth';

const flow = createFlowState<AuthFlowStep, AuthFlowState>(
  COOKIE_NAMES.AUTH_FLOW,
  COOKIE_MAX_AGE.AUTH_FLOW,
);

export const getFlowState = flow.get;
export const updateFlowState = flow.update;
export const markStepCompleted = flow.mark;
export const clearFlowState = flow.clear;
