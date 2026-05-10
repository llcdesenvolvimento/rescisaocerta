import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface MaskedDateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  hasError?: boolean;
}

function formatDateInput(value: string): string {
  // Remove tudo que não for número
  const digits = value.replace(/\D/g, '').slice(0, 8);
  
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

// Valida se a data é válida
function isValidDate(day: number, month: number, year: number): boolean {
  // Ano deve estar entre 1900 e o ano atual + 1
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) return false;
  
  // Mês deve estar entre 1 e 12
  if (month < 1 || month > 12) return false;
  
  // Dia deve estar entre 1 e o máximo do mês
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;
  
  return true;
}

// Converte DD/MM/AAAA para YYYY-MM-DD (formato do input date)
function toISOFormat(maskedDate: string): string {
  const digits = maskedDate.replace(/\D/g, '');
  if (digits.length !== 8) return '';
  
  const day = parseInt(digits.slice(0, 2), 10);
  const month = parseInt(digits.slice(2, 4), 10);
  const year = parseInt(digits.slice(4, 8), 10);
  
  // Valida a data antes de retornar
  if (!isValidDate(day, month, year)) return '';
  
  return `${year}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}

// Converte YYYY-MM-DD para DD/MM/AAAA
function fromISOFormat(isoDate: string): string {
  if (!isoDate || isoDate.length !== 10) return '';
  
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function MaskedDateInput({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  className,
  placeholder = 'DD/MM/AAAA',
  hasError = false,
}: MaskedDateInputProps) {
  // Estado local para manter o valor durante digitação
  const [localValue, setLocalValue] = useState(() => {
    return value ? fromISOFormat(value) : '';
  });
  const [isInvalid, setIsInvalid] = useState(false);

  // Sincroniza quando o valor externo muda (ex: reset do form)
  useEffect(() => {
    const formatted = value ? fromISOFormat(value) : '';
    // Só atualiza se o valor ISO mudou externamente
    if (formatted !== localValue && value) {
      setLocalValue(formatted);
      setIsInvalid(false);
    } else if (!value && localValue.length === 10) {
      // Se value foi limpo externamente mas tínhamos um valor completo
      setLocalValue('');
      setIsInvalid(false);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    setLocalValue(formatted);
    
    // Quando tiver 10 caracteres (DD/MM/AAAA), converte para ISO e notifica
    if (formatted.length === 10) {
      const isoDate = toISOFormat(formatted);
      if (isoDate) {
        // Data válida
        setIsInvalid(false);
        onChange(isoDate);
      } else {
        // Data inválida - mostrar erro e limpar valor
        setIsInvalid(true);
        onChange('');
      }
    } else {
      // Durante digitação, limpa o valor ISO e reseta erro
      setIsInvalid(false);
      onChange('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas números, backspace, delete, tab, arrows
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (allowedKeys.includes(e.key)) return;
    
    // Permite apenas dígitos
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <div className="relative">
        <Input
          type="text"
          inputMode="numeric"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={10}
          className={cn(
            "pr-10",
            isInvalid && "border-destructive focus-visible:ring-destructive",
            hasError && !value && "bg-destructive/10 border-destructive"
          )}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      {isInvalid && (
        <p className="text-xs text-destructive">Data inválida. Use o formato DD/MM/AAAA.</p>
      )}
    </div>
  );
}
