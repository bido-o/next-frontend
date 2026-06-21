import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';

export type EventType = {
  id: number;
  name: string;
};

export function getEventTypes(accessToken: string) {
  return apiFetch<EventType[]>(API_PATHS.EVENT_TYPES, { accessToken });
}
