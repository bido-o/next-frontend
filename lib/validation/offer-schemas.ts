import { z } from 'zod';

// Toggle-urile trimit un hidden input "true"/"false".
const boolFromForm = z.preprocess((v) => v === 'true' || v === 'on' || v === true, z.boolean());

// Gol ("") → undefined pentru text opțional.
const optionalText = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
  z.string().trim().max(2000, 'Mesajul e prea lung.').optional(),
);

// Gol ("") → 0 pentru avans (câmp opțional, fără avans implicit).
const moneyOrZero = (v: unknown) =>
  v == null || (typeof v === 'string' && v.trim() === '') ? 0 : v;

const twoDecimals = (v: number) => Number.isInteger(v * 100);

export const createOfferSchema = z
  .object({
    requestId: z.coerce.number().int().positive(),
    totalPrice: z.coerce
      .number()
      .positive('Prețul total trebuie să fie mai mare decât 0.')
      .refine(twoDecimals, 'Prețul poate avea maxim 2 zecimale.'),
    upfrontPayment: z.preprocess(
      moneyOrZero,
      z.coerce
        .number()
        .nonnegative('Avansul nu poate fi negativ.')
        .refine(twoDecimals, 'Avansul poate avea maxim 2 zecimale.'),
    ),
    description: optionalText,
    onlinePaymentAvailable: boolFromForm,
  })
  .refine((d) => d.upfrontPayment <= d.totalPrice, {
    message: 'Avansul nu poate depăși prețul total.',
    path: ['upfrontPayment'],
  });
