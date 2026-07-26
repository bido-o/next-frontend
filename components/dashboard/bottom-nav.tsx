'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home09Icon,
  Search01Icon,
  PlusSignIcon,
  Note01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';

import { ROLES, type AccountRole } from '@/lib/constants';
import { cn } from '@/lib/utils';

type NavItem = {
  label: string;
  icon: typeof Home09Icon;
  href: string | null; // null → rută inexistentă încă (inactivă)
  primary?: boolean;
};

const CLIENT_NAV: NavItem[] = [
  { label: 'Acasă', icon: Home09Icon, href: '/' },
  { label: 'Caută', icon: Search01Icon, href: null },
  { label: 'Cerere nouă', icon: PlusSignIcon, href: '/requests/new', primary: true },
  { label: 'Cereri', icon: Note01Icon, href: null },
  { label: 'Cont', icon: UserIcon, href: null },
];

const SUPPLIER_NAV: NavItem[] = [
  { label: 'Acasă', icon: Home09Icon, href: '/' },
  { label: 'Cereri', icon: Search01Icon, href: null },
  { label: 'Ofertele mele', icon: Note01Icon, href: null },
  { label: 'Cont', icon: UserIcon, href: null },
];

/*
  Dock de navigare:
    - mobil  → bară fixă jos, pe toată lățimea
    - desktop → pill compact, centrat, plutitor
*/
export function BottomNav({ role }: { role?: AccountRole }) {
  const pathname = usePathname();
  const items = role === ROLES.SUPPLIER ? SUPPLIER_NAV : CLIENT_NAV;

  return (
    <nav
      className={cn(
        'fixed z-20 border-black/5 bg-white/90 backdrop-blur',
        'inset-x-0 bottom-0 border-t', // mobil
        'md:inset-x-auto md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:rounded-full md:border md:shadow-lg md:shadow-black/5', // desktop
      )}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2 md:justify-center md:gap-1 md:px-3">
        {items.map((item) => (
          <NavLink key={item.label} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = item.href != null && pathname === item.href;

  // Butonul "+" e evidențiat (rotund, portocaliu).
  if (item.primary) {
    const fab = (
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange text-white shadow-lg shadow-orange/30 transition-transform active:translate-y-px">
        <HugeiconsIcon icon={item.icon} size={24} strokeWidth={2} />
      </span>
    );
    return item.href ? (
      <Link href={item.href} aria-label={item.label} className="flex items-center">
        {fab}
      </Link>
    ) : (
      fab
    );
  }

  const content = (
    <span
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-full px-3 py-1 transition-colors md:flex-row md:gap-2 md:px-3 md:py-2',
        active ? 'text-orange' : 'text-dark/50',
        item.href && !active && 'hover:text-dark',
      )}
    >
      <HugeiconsIcon icon={item.icon} size={22} strokeWidth={1.8} />
      {/* Eticheta: vizibilă pe mobil (sub icon), ascunsă în dock-ul desktop */}
      <span className="text-[10px] md:hidden">{item.label}</span>
    </span>
  );

  // Rută inexistentă → afișată dar inactivă (fără navigare).
  if (!item.href) {
    return (
      <span aria-disabled aria-label={item.label} className="cursor-default opacity-60">
        {content}
      </span>
    );
  }

  return (
    <Link href={item.href} aria-label={item.label} aria-current={active ? 'page' : undefined}>
      {content}
    </Link>
  );
}
