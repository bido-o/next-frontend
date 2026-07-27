import { COOKIE_NAMES, COOKIE_MAX_AGE } from '@/lib/constants';
import { createFlowState } from '@/lib/create-flow-state';
import type { RequestFlowState, RequestFlowStep } from '@/types/request';

const flow = createFlowState<RequestFlowStep, RequestFlowState>(
  COOKIE_NAMES.REQUEST_FLOW,
  COOKIE_MAX_AGE.REQUEST_FLOW,
);

export const getRequestFlow = flow.get;
export const updateRequestFlow = flow.update;
export const markRequestStep = flow.mark;
export const clearRequestFlow = flow.clear;
