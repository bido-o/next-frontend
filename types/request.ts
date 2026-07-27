import type { LOCATION_CITIES } from '@/lib/constants';

/** Orașele în care se poate organiza un eveniment. */
export type LocationCity = (typeof LOCATION_CITIES)[number]['value'];

export type RequestStatus = 'OPEN' | 'CLOSED' | 'EXPIRED' | 'CANCELLED';

/** Oglindește CreateRequestDto din bidding service. */
export type CreateRequestInput = {
  eventTypeId: number;
  nrPersons: number;
  budgetTotal: number;
  budgetFlexible: boolean;
  eventDate: string;
  locationCity?: LocationCity;
  locationAddress?: string;
  message?: string;
  deliveryIncluded: boolean;
  expiresAt?: string;
};

export type RequestResponse = {
  id: number;
  nrPersons: number;
  budgetTotal: number;
  budgetFlexible: boolean;
  eventDate: string;
  locationCity: LocationCity | null;
  locationAddress: string | null;
  message: string | null;
  deliveryIncluded: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  status: RequestStatus;
  clientId: number;
  eventTypeId: number;
  eventTypeName: string;
};

/* ─────────── flow-ul de creare a unei cereri ─────────── */

export type RequestFlowStep = 'type' | 'when' | 'budget';

/**
 * Datele acumulate de-a lungul pașilor de creare a unei cereri.
 * Persistate într-un cookie httpOnly între pași; un singur POST se face la final
 * (operația de creare e atomică).
 */
export type RequestFlowState = {
  // pas 1 — tip + persoane
  eventTypeId?: number;
  eventTypeName?: string; // doar pentru afișare (recapitulare/succes)
  nrPersons?: number;

  // pas 2 — când + unde
  eventDate?: string;
  locationCity?: LocationCity;
  locationAddress?: string;
  deliveryIncluded?: boolean;

  // pas 3 — buget + detalii
  budgetTotal?: number;
  budgetFlexible?: boolean;
  message?: string;
  expiresInHours?: number;

  completedSteps: RequestFlowStep[];
};
