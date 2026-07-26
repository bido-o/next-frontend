import { z } from 'zod';
import { SIGNUP_ROLES } from '@/lib/constants';

export const roleSchema = z.object({
  role: z.enum(SIGNUP_ROLES),
});

export const emailSchema = z.object({
  email: z.email('Adresă de email invalidă.'),
});

export const otpSchema = z.object({
  otpCode: z
    .string()
    .length(6, 'Codul trebuie să aibă 6 cifre.')
    .regex(/^\d+$/, 'Codul trebuie să conțină doar cifre.'),
});

export const clientProfileSchema = z.object({
  firstName: z.string().min(1, 'Prenumele este obligatoriu.'),
  lastName: z.string().min(1, 'Numele este obligatoriu.'),
});

export const supplierProfileSchema = z.object({
  companyName: z.string().min(1, 'Numele companiei este obligatoriu.'),
});
