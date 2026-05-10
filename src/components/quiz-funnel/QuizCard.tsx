import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  children: ReactNode;
  className?: string;
}

export function QuizCard({ children, className }: QuizCardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-2xl p-5 sm:p-7",
        "border border-border/40 shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
