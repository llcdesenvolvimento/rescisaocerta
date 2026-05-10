import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuizOptionProps {
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  isMulti?: boolean;
}

export function QuizOption({ 
  label, 
  sublabel, 
  selected, 
  onClick, 
  disabled = false,
  isMulti = false 
}: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full min-h-[56px] px-4 py-3.5 rounded-xl text-left",
        "flex items-center gap-3",
        "border transform-gpu",
        "active:scale-[0.98] transition-transform duration-100",
        selected 
          ? "border-primary bg-primary/10 shadow-sm" 
          : "border-border bg-card",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {/* Selection indicator */}
      <div className={cn(
        "flex-shrink-0 w-5 h-5 border-2 flex items-center justify-center",
        isMulti ? "rounded-md" : "rounded-full",
        selected 
          ? "border-primary bg-primary" 
          : "border-muted-foreground/30"
      )}>
        {selected && (
          <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium leading-snug",
          selected ? "text-primary" : "text-foreground"
        )}>
          {label}
        </p>
        {sublabel && (
          <p className={cn(
            "text-xs mt-0.5 leading-tight",
            selected ? "text-primary/80" : "text-muted-foreground"
          )}>
            {sublabel}
          </p>
        )}
      </div>
    </button>
  );
}
