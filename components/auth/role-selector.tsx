'use client';

import { useActionState, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ShoppingBag02Icon,
  DeliveryTruck01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons';

import { selectRole } from '@/actions/auth';
import { IDLE } from '@/actions/types';
import { ROLES, type SignupRole } from '@/lib/constants';
import { BidoLogo } from '@/components/bido-logo';
import { SubmitButton } from '@/components/ui/submit-button';
import { cn } from '@/lib/utils';

const OPTIONS: Array<{
  value: SignupRole;
  title: string;
  description: string;
  icon: typeof ShoppingBag02Icon;
}> = [
  {
    value: ROLES.CLIENT,
    title: 'Caut servicii culinare',
    description:
      'Publici cereri, primești oferte, alegi furnizorul. Gratuit pentru totdeauna.',
    icon: ShoppingBag02Icon,
  },
  {
    value: ROLES.SUPPLIER,
    title: 'Ofer servicii culinare',
    description:
      'Catering, food-truck sau specialist autorizat. Primești cereri, trimiți oferte.',
    icon: DeliveryTruck01Icon,
  },
];


export function RoleSelector() {
  const [state, action, isPending] = useActionState(selectRole, IDLE);
  const [selected, setSelected] = useState<SignupRole | null>(null);

  return (
    <form action={action} className="space-y-4">
      <h1 className="text-3xl font-serif font-bold">
        Cum vrei să folosești <BidoLogo />?
      </h1>

      <div className="space-y-3 pt-2">
        {OPTIONS.map((opt) => {
          const active = (selected === opt.value);
          return (
            <label
              key={opt.value}
              className={cn('block cursor-pointer rounded-2xl border-2 p-4 transition-all',
                active
                  ? 'border-orange bg-orange/5'
                  : 'border-black/10 hover:border-black/20',
              )}
            >
              <input
                type="radio"
                name="role"
                value={opt.value}
                checked={active}
                onChange={() => setSelected(opt.value)}
                className="sr-only"
              />
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-cream p-2">
                  <HugeiconsIcon icon={opt.icon} size={22} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="font-serif text-lg font-semibold">
                    {opt.title}
                  </div>
                  <p className="text-sm text-dark/60 mt-1">{opt.description}</p>
                </div>
                <div
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0',
                    active ? 'border-orange bg-orange' : 'border-black/20',
                  )}
                >
                  {active && (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={14}
                      strokeWidth={3}
                      color="white"
                    />
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton disabled={!selected} isPending={isPending}>
        Continuă ca {selected === ROLES.SUPPLIER ? 'Furnizor' : 'Client'} →
      </SubmitButton>
    </form>
  );
}
