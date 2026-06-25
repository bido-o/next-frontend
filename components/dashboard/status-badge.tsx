import { REQUEST_STATUS_META, OFFER_STATUS_META } from '@/lib/constants';
import type { RequestStatus } from '@/lib/api/requests';
import type { OfferStatus } from '@/lib/api/offers';
import { cn } from '@/lib/utils';

const TONE_CLASSES: Record<string, string> = {
  green: 'bg-green-50 text-green-700',
  blue: 'bg-blue-50 text-blue-700',
  neutral: 'bg-black/5 text-dark/60',
};

type Props =
  | { status: RequestStatus; variant?: 'request' }
  | { status: OfferStatus; variant: 'offer' };

export function StatusBadge(props: Props) {
  const meta =
    props.variant === 'offer'
      ? OFFER_STATUS_META[props.status as OfferStatus]
      : REQUEST_STATUS_META[props.status as RequestStatus];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        TONE_CLASSES[meta.tone],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </span>
  );
}
