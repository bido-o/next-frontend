import { apiFetch } from './client';
import { API_PATHS } from '@/lib/constants';

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'NOT_CHOSEN' | 'CANCELLED';

export type OfferResponse = {
  id: number;
  requestId: number;
  supplierProfileId: number;
  totalPrice: number;
  upfrontPayment: number;
  description: string | null;
  status: OfferStatus;
  onlinePaymentAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

// Oglindește SentOfferDto — oferta + context din cererea pe care s-a ofertat.
export type SentOfferResponse = OfferResponse & {
  eventTypeName: string;
  requestMessage: string | null;
};

export function listMyOffers(accessToken: string) {
  return apiFetch<SentOfferResponse[]>(`${API_PATHS.OFFERS}/sent`, { accessToken });
}
