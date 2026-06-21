import { redirect } from 'next/navigation';

import { RequestHeader } from '@/components/requests/request-header';
import { BudgetForm } from '@/components/requests/budget-form';
import { getRequestFlow } from '@/lib/bidding/request-flow';
import { DEFAULT_EXPIRY_HOURS, REQUEST_ROUTES } from '@/lib/constants';

export default async function BudgetPage() {
  const flow = await getRequestFlow();
  if (!flow.eventTypeId) redirect(REQUEST_ROUTES.TYPE);
  if (!flow.eventDate) redirect(REQUEST_ROUTES.WHEN);

  return (
    <>
      <RequestHeader step={3} />
      <BudgetForm
        nrPersons={flow.nrPersons}
        defaultBudget={flow.budgetTotal}
        defaultFlexible={flow.budgetFlexible}
        defaultMessage={flow.message}
        defaultExpiry={flow.expiresInHours ?? DEFAULT_EXPIRY_HOURS}
      />
    </>
  );
}
