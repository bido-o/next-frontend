'use client';

import { useActionState, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

import { saveEventType } from '@/actions/requests';
import { IDLE } from '@/actions/types';
import { SubmitButton } from '@/components/ui/submit-button';
import type { EventType } from '@/lib/api/event-types';
import { cn } from '@/lib/utils';

const STEP = 10;

export function EventTypeForm({
  eventTypes,
  defaultEventTypeId,
  defaultNrPersons,
}: {
  eventTypes: EventType[];
  defaultEventTypeId?: number;
  defaultNrPersons?: number;
}) {
  const [state, action, isPending] = useActionState(saveEventType, IDLE);
  const [selectedId, setSelectedId] = useState<number | null>(defaultEventTypeId ?? null);
  const [persons, setPersons] = useState<string>(
    defaultNrPersons != null ? String(defaultNrPersons) : '',
  );

  const selected = eventTypes.find((e) => e.id === selectedId);
  const errs = state.status === 'error' ? state.fieldErrors ?? {} : {};

  const adjust = (delta: number) => {
    setPersons((p) => {
      const current = Number.parseInt(p, 10) || 0;
      const next = Math.max(0, current + delta);
      return next === 0 ? '' : String(next);
    });
  };

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="eventTypeId" value={selectedId ?? ''} />
      <input type="hidden" name="eventTypeName" value={selected?.name ?? ''} />

      <div>
        <h1 className="text-3xl font-serif font-bold">Ce sărbătorești</h1>
        <h2 className="text-3xl font-serif italic text-orange">și pentru câți?</h2>
      </div>

      {/* Tip eveniment */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Tip eveniment</span>
        {eventTypes.length === 0 ? (
          <p className="text-sm text-red-600">
            Nu s-au putut încărca tipurile de evenimente. Reîncearcă mai târziu.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {eventTypes.map((et) => {
              const active = selectedId === et.id;
              return (
                <label
                  key={et.id}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-2 rounded-2xl border-2 px-3 py-3 text-sm transition-all',
                    active
                      ? 'border-orange bg-orange/5 font-medium'
                      : 'border-black/10 hover:border-black/20',
                  )}
                >
                  <input
                    type="radio"
                    name="eventTypeRadio"
                    checked={active}
                    onChange={() => setSelectedId(et.id)}
                    className="sr-only"
                  />
                  <span>{et.name}</span>
                  {active && (
                    <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={3} className="text-orange shrink-0" />
                  )}
                </label>
              );
            })}
          </div>
        )}
        {errs.eventTypeId?.[0] && <p className="text-sm text-red-600">{errs.eventTypeId[0]}</p>}
      </div>

      {/* Număr persoane */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Număr persoane</span>
        <div className="flex items-center justify-between rounded-2xl border-2 border-black/10 p-3">
          <button
            type="button"
            onClick={() => adjust(-STEP)}
            aria-label="Scade"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-xl hover:bg-cream/70"
          >
            −
          </button>
          <div className="flex flex-col items-center">
            <input
              name="nrPersons"
              inputMode="numeric"
              value={persons}
              onChange={(e) => setPersons(e.target.value.replace(/\D/g, ''))}
              placeholder="—"
              className="w-24 bg-transparent text-center text-3xl font-serif font-bold outline-none"
            />
            <span className="text-xs text-dark/50">invitați</span>
          </div>
          <button
            type="button"
            onClick={() => adjust(STEP)}
            aria-label="Crește"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-orange text-xl text-white hover:bg-orange/90"
          >
            +
          </button>
        </div>
        {errs.nrPersons?.[0] && <p className="text-sm text-red-600">{errs.nrPersons[0]}</p>}
      </div>

      {state.status === 'error' && !Object.keys(errs).length && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton disabled={!selectedId || !persons} isPending={isPending}>
        Continuă →
      </SubmitButton>
    </form>
  );
}
