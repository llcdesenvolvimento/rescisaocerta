import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({ title, children, className, ...props }: FormSectionProps) {
  return (
    <div className={cn('space-y-2.5 sm:space-y-4', className)} {...props}>
      <h3 className="text-sm sm:text-base font-semibold text-primary uppercase tracking-wide leading-tight">
        {title}
      </h3>
      <div className="space-y-2.5 sm:space-y-4">
        {children}
      </div>
    </div>
  );
}
