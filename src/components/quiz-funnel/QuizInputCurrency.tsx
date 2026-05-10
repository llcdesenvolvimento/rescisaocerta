import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { DollarSign } from 'lucide-react';

interface QuizInputCurrencyProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function QuizInputCurrency({ 
  value, 
  onChange, 
  placeholder = "R$ 0,00",
  autoFocus = true 
}: QuizInputCurrencyProps) {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value > 0) {
      setDisplayValue(formatCurrency(value));
    }
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    
    // Remover tudo exceto números
    rawValue = rawValue.replace(/\D/g, '');
    
    // Converter para número (centavos para reais)
    const numericValue = parseInt(rawValue, 10) / 100 || 0;
    
    onChange(numericValue);
    setDisplayValue(numericValue > 0 ? formatCurrency(numericValue) : '');
  };

  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-primary" />
        </div>
      </div>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "w-full h-16 pl-16 pr-4 text-center text-2xl font-bold rounded-xl border",
          "bg-background border-border transition-all duration-200",
          "placeholder:text-muted-foreground/40 placeholder:font-normal placeholder:text-lg",
          "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
          value > 0 && "text-primary border-primary/30 bg-primary/5"
        )}
      />
    </div>
  );
}
