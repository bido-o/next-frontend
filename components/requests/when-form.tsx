'use client';

import { useActionState, useState } from 'react';

import { saveWhen } from '@/actions/requests';
import { IDLE } from '@/actions/request-types';
import { SubmitButton } from '@/components/auth/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RequestToggle } from '@/components/requests/request-toggle';
import { LOCATION_CITIES, type LocationCity } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function WhenForm({
  defaultDate,
  defaultTime,
  defaultCity,
  defaultAddress,
  defaultDelivery = false,
}: {
  defaultDate?: string;
  defaultTime?: string;
  defaultCity?: LocationCity;
  defaultAddress?: string;
  defaultDelivery?: boolean;
}) {
  const [state, action, isPending] = useActionState(saveWhen, IDLE);
  const [city, setCity] = useState<LocationCity | null>(defaultCity ?? null);
  const errs = state.status === 'error' ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locationCity" value={city ?? ''} />

      <div>
        <h1 className="text-3xl font-serif font-bold">Când și unde</h1>
        <h2 className="text-3xl font-serif italic text-orange">are loc?</h2>
      </div>

      {/* Data + ora */}
      <div className="space-y-2">
        <Label htmlFor="eventDate">Data evenimentului</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input id="eventDate" name="eventDate" type="date" defaultValue={defaultDate} className="h-12 rounded-xl" />
          <Input name="eventTime" type="time" defaultValue={defaultTime} className="h-12 rounded-xl" />
        </div>
        {errs.eventDate?.[0] && <p className="text-sm text-red-600">{errs.eventDate[0]}</p>}
        {errs.eventTime?.[0] && <p className="text-sm text-red-600">{errs.eventTime[0]}</p>}
      </div>

      {/* Oraș */}
      <div className="space-y-2">
        <span className="text-sm font-medium">
          Oraș <span className="text-dark/40">(opțional)</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {LOCATION_CITIES.map((c) => {
            const active = city === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setCity(active ? null : c.value)}
                className={cn(
                  'rounded-full border-2 px-4 py-2 text-sm transition-all',
                  active
                    ? 'border-orange bg-orange text-white font-medium'
                    : 'border-black/10 hover:border-black/20',
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Adresă */}
      <div className="space-y-2">
        <Label htmlFor="locationAddress">
          Adresă <span className="text-dark/40">(opțional)</span>
        </Label>
        <Input
          id="locationAddress"
          name="locationAddress"
          defaultValue={defaultAddress}
          placeholder="Str. Exemplu 12, Sector 1"
          className="h-12 rounded-xl"
        />
        {errs.locationAddress?.[0] && <p className="text-sm text-red-600">{errs.locationAddress[0]}</p>}
      </div>

      {/* Livrare inclusă */}
      <RequestToggle
        name="deliveryIncluded"
        label="Livrare inclusă"
        description="Furnizorii livrează la adresa evenimentului."
        defaultChecked={defaultDelivery}
      />

      {state.status === 'error' && !Object.keys(errs).length && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton isPending={isPending}>Continuă →</SubmitButton>
    </form>
  );
}
