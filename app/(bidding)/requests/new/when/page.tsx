import { redirect } from 'next/navigation';

import { RequestHeader } from '@/components/requests/request-header';
import { WhenForm } from '@/components/requests/when-form';
import { getRequestFlow } from '@/lib/bidding/request-flow';
import { REQUEST_ROUTES } from '@/lib/constants';

export default async function WhenPage() {
  const flow = await getRequestFlow();
  if (!flow.eventTypeId) redirect(REQUEST_ROUTES.TYPE);

  return (
    <>
      <RequestHeader step={2} />
      <WhenForm
        defaultDate={flow.eventDate?.slice(0, 10)}
        defaultTime={flow.eventDate?.slice(11, 16)}
        defaultCity={flow.locationCity}
        defaultAddress={flow.locationAddress}
        defaultDelivery={flow.deliveryIncluded}
      />
    </>
  );
}
