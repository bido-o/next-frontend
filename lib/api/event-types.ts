import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';
import type { EventType } from '@/types/event-type';

export function getEventTypes(accessToken: string) {
  return apiFetch<EventType[]>(API_PATHS.EVENT_TYPES, { accessToken });
}
