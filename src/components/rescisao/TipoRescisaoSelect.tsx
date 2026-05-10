import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TipoRescisao } from '@/types/rescisao';
import { cn } from '@/lib/utils';

interface TipoRescisaoSelectProps {
  value: TipoRescisao;
  onChange: (value: TipoRescisao) => void;
  className?: string;
}

const opcoes: { value: TipoRescisao; label: string; description: string }[] = [
  { 
    value: 'sem_justa_causa', 
    label: 'Sem justa causa',
    description: 'Demissão por iniciativa do empregador'
  },
  { 
    value: 'pedido_demissao', 
    label: 'Pedido de demissão',
    description: 'Iniciativa do empregado'
  },
  { 
    value: 'justa_causa', 
    label: 'Justa causa',
    description: 'Falta grave do empregado'
  },
  { 
    value: 'acordo_484a', 
    label: 'Acordo (art. 484-A)',
    description: 'Rescisão por acordo entre as partes'
  },
];

export function TipoRescisaoSelect({ value, onChange, className }: TipoRescisaoSelectProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-sm font-medium text-foreground">
        Tipo de rescisão <span className="text-destructive">*</span>
      </Label>
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as TipoRescisao)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
      >
        {opcoes.map((opcao) => (
          <label
            key={opcao.value}
            className={cn(
              'flex items-start gap-2.5 sm:gap-3 rounded-xl border-2 p-3 sm:p-4 cursor-pointer transition-all',
              value === opcao.value
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
            )}
          >
            <RadioGroupItem value={opcao.value} className="mt-0.5 shrink-0" />
            <div className="space-y-0.5 min-w-0">
              <span className="font-medium text-sm block">{opcao.label}</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{opcao.description}</p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
