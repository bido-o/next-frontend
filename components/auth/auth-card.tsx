import { cn } from '@/lib/utils';

export function AuthCard({ children, className }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('w-full max-w-md bg-white rounded-3xl shadow-sm border border-black/5 p-8', className)}>
      {children}
    </div>
  );
}
