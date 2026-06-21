import { redirect } from 'next/navigation';

import { REQUEST_ROUTES } from '@/lib/constants';

export default function NewRequestIndex() {
  redirect(REQUEST_ROUTES.TYPE);
}
