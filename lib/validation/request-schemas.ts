import { z } from 'zod';

// Gol ("" din FormData) → undefined, ca să trateze corect câmpurile opționale.
const emptyToUndefined = (v: unknown) => {
  if (v == null) return undefined;
  return typeof v === 'string' && v.trim() === '' ? undefined : v;
};

// Toggle-urile trimit un hidden input cu "true"/"false".
const boolFromForm = z.preprocess((v) => v === 'true' || v === 'on' || v === true, z.boolean());

const optionalText = z.preprocess(emptyToUndefined, z.string().trim().optional());

// Pas 1 — tip eveniment + număr persoane
export const eventTypeStepSchema = z.object({
  eventTypeId: z.coerce
    .number()
    .int()
    .positive('Alege un tip de eveniment.'),
  nrPersons: z.coerce
    .number()
    .int()
    .positive('Numărul de persoane trebuie să fie pozitiv.'),
});

// Pas 2 — când + unde
export const whenStepSchema = z.object({
  eventDate: z.string().min(1, 'Alege data evenimentului.'),
  eventTime: z.string().min(1, 'Alege ora evenimentului.'),
  locationCity: z.preprocess(emptyToUndefined, z.enum(['BUCURESTI', 'CLUJ']).optional()),
  locationAddress: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(255, 'Adresa e prea lungă (max 255 caractere).').optional(),
  ),
  deliveryIncluded: boolFromForm,
});

// Pas 3 — buget + detalii finale (acesta declanșează POST-ul final)
export const budgetStepSchema = z.object({
  budgetTotal: z.coerce
    .number()
    .positive('Bugetul trebuie să fie mai mare decât 0.')
    .refine(
      (v) => Number.isInteger(v * 100),
      'Bugetul poate avea maxim 2 zecimale.',
    ),
  budgetFlexible: boolFromForm,
  message: optionalText,
  expiresInHours: z.coerce
    .number()
    .refine((v) => [24, 48, 72, 168].includes(v), 'Opțiune de expirare invalidă.'),
});
