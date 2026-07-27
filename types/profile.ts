/* ─────────── payload-uri trimise la creare ─────────── */

export type ClientProfileInput = {
  firstName: string;
  lastName: string;
};

export type SupplierProfileInput = {
  companyName: string;
};

/* ─────────── profiluri returnate de backend ─────────── */

export type ClientProfile = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  companyName: string | null;
  cui: string | null;
  billingAddress: string | null;
};

export type SupplierProfile = {
  id: number;
  companyName: string;
  creditBalance: number | null;
  minOrder: number | null;
  avgRating: number | null;
  acceptsOnlinePayments: boolean | null;
  hasLegalInfo: boolean | null;
  totalOffersWon: number | null;
  totalDisputesLost: number | null;
  totalOffersSubmitted: number | null;
};
