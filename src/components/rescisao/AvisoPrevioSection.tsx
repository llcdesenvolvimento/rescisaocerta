import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { TipoAviso, TipoRescisao } from '@/types/rescisao';
import { NumberInput } from './NumberInput';
import { cn } from '@/lib/utils';

interface AvisoPrevioSectionProps {
  tipoRescisao: TipoRescisao;
  tipoAviso: TipoAviso;
  diasAviso: number;
  naoCumpriuAviso: boolean;
  onTipoAvisoChange: (value: TipoAviso) => void;
  onDiasAvisoChange: (value: number) => void;
  onNaoCumpriuChange: (value: boolean) => void;
  className?: string;
}

const opcoesAviso: { value: TipoAviso; label: string }[] = [
  { value: 'indenizado', label: 'Indenizado' },
  { value: 'trabalhado', label: 'Trabalhado' },
  { value: 'sem_aviso', label: 'Sem aviso' },
];

export function AvisoPrevioSection({
  tipoRescisao,
  tipoAviso,
  diasAviso,
  naoCumpriuAviso,
  onTipoAvisoChange,
  onDiasAvisoChange,
  onNaoCumpriuChange,
  className,
}: AvisoPrevioSectionProps) {
  // Justa causa não tem aviso prévio
  if (tipoRescisao === 'justa_causa') {
    return null;
  }

  // Pedido de demissão: opção de não cumprir aviso
  if (tipoRescisao === 'pedido_demissao') {
    return (
      <div className={cn('space-y-4 p-4 rounded-lg bg-muted/50', className)}>
        <Label className="text-sm font-medium text-foreground">Aviso prévio</Label>
        
        <div className="flex items-start gap-3">
          <Checkbox
            id="naoCumpriuAviso"
            checked={naoCumpriuAviso}
            onCheckedChange={(checked) => onNaoCumpriuChange(checked === true)}
          />
          <div className="space-y-1">
            <label 
              htmlFor="naoCumpriuAviso" 
              className="text-sm font-medium cursor-pointer"
            >
              Não cumpriu o aviso prévio
            </label>
            <p className="text-xs text-muted-foreground">
              Será descontado o valor correspondente aos dias de aviso
            </p>
          </div>
        </div>

        {naoCumpriuAviso && (
          <NumberInput
            label="Dias de aviso"
            value={diasAviso}
            onChange={onDiasAvisoChange}
            min={0}
            max={90}
          />
        )}
      </div>
    );
  }

  // Sem justa causa ou Acordo 484-A
  return (
    <div className={cn('space-y-4 p-4 rounded-lg bg-muted/50', className)}>
      <Label className="text-sm font-medium text-foreground">Aviso prévio</Label>
      
      <RadioGroup
        value={tipoAviso}
        onValueChange={(v) => onTipoAvisoChange(v as TipoAviso)}
        className="flex flex-wrap gap-4"
      >
        {opcoesAviso.map((opcao) => (
          <label
            key={opcao.value}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all',
              tipoAviso === opcao.value
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            )}
          >
            <RadioGroupItem value={opcao.value} />
            <span className="text-sm font-medium">{opcao.label}</span>
          </label>
        ))}
      </RadioGroup>

      {tipoAviso === 'indenizado' && (
        <div className="space-y-2">
          <NumberInput
            label="Dias de aviso"
            value={diasAviso}
            onChange={onDiasAvisoChange}
            min={0}
            max={90}
            tooltip="Mínimo 30 dias + 3 dias por ano trabalhado"
          />
          {tipoRescisao === 'acordo_484a' && (
            <p className="text-xs text-muted-foreground bg-warning-muted px-3 py-2 rounded">
              ⚠️ No acordo (484-A), o aviso indenizado é pago pela metade
            </p>
          )}
        </div>
      )}
    </div>
  );
}
