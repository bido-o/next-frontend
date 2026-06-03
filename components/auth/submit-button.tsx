'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SubmitButton({ children, className, disabled, isPending = false,}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isPending?: boolean;
}) {
  return (
    <Button
      type="submit"
      disabled={isPending || disabled}
      className={cn('w-full h-12 rounded-full bg-orange hover:bg-orange/90 text-white font-medium', className,)}
    >
      {isPending ? 'Se procesează...' : children}
    </Button>
  );
}
