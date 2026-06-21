import { RequestHeader } from '@/components/requests/request-header';
import { EventTypeForm } from '@/components/requests/event-type-form';
import { getEventTypes, type EventType } from '@/lib/api/event-types';
import { requireSession } from '@/lib/auth/session';
import { getRequestFlow } from '@/lib/bidding/request-flow';

export default async function TypePage() {
  const session = await requireSession();
  const flow = await getRequestFlow();

  let eventTypes: EventType[] = [];
  try {
    eventTypes = await getEventTypes(session.accessToken);
  } catch {
    eventTypes = [];
  }

  return (
    <>
      <RequestHeader step={1} showBack={false} />
      <EventTypeForm
        eventTypes={eventTypes}
        defaultEventTypeId={flow.eventTypeId}
        defaultNrPersons={flow.nrPersons}
      />
    </>
  );
}
