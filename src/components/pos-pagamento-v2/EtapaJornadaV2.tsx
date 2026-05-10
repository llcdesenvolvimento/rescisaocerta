import { DadosJornadaV2, OpcaoBancoHoras, OpcaoControlePonto } from '@/types/pos-pagamento-v2';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock, ClipboardCheck, HelpCircle } from 'lucide-react';

interface EtapaJornadaV2Props {
  dados: DadosJornadaV2;
  onUpdate: <K extends keyof DadosJornadaV2>(field: K, value: DadosJornadaV2[K]) => void;
}

export function EtapaJornadaV2({ dados, onUpdate }: EtapaJornadaV2Props) {
  // Calcular horas extras automaticamente
  const horasExtrasCalculadas = Math.max(0, (dados.cargaRealSemanaH || 0) - (dados.cargaContratadaSemanaH || 0));

  return (
    <div className="space-y-5">
      {/* Header da seção */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Jornada de Trabalho</h3>
          <p className="text-sm text-muted-foreground">Informe seus horários de trabalho</p>
        </div>
      </div>

      {/* Carga horária contratada */}
      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
        <Label htmlFor="cargaContratada" className="text-sm font-medium">
          Carga horária contratada (horas/semana)
        </Label>
        <Input
          id="cargaContratada"
          type="number"
          min={1}
          max={60}
          value={dados.cargaContratadaSemanaH || ''}
          onChange={(e) => onUpdate('cargaContratadaSemanaH', Number(e.target.value))}
          placeholder="Ex: 44"
          className="bg-background"
        />
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <ClipboardCheck className="w-3 h-3" />
          Normalmente 44h para CLT padrão
        </p>
      </div>

      {/* Carga horária real */}
      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
        <Label htmlFor="cargaReal" className="text-sm font-medium">
          Quantas horas você trabalhava por semana na prática?
        </Label>
        <Input
          id="cargaReal"
          type="number"
          min={1}
          max={80}
          value={dados.cargaRealSemanaH || ''}
          onChange={(e) => onUpdate('cargaRealSemanaH', Number(e.target.value))}
          placeholder="Ex: 52"
          className="bg-background"
        />
        {horasExtrasCalculadas > 0 && (
          <div className="flex items-center gap-2 p-2 bg-amber-500/10 rounded-md border border-amber-500/20">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700 font-medium">
              ≈ {horasExtrasCalculadas}h extras por semana identificadas
            </span>
          </div>
        )}
      </div>

      {/* Banco de horas */}
      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
        <Label className="text-sm font-medium">Tinha banco de horas?</Label>
        <Select
          value={dados.bancoHoras}
          onValueChange={(v) => onUpdate('bancoHoras', v as OpcaoBancoHoras)}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sim">Sim</SelectItem>
            <SelectItem value="nao">Não</SelectItem>
            <SelectItem value="nao_sei">Não sei</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <HelpCircle className="w-3 h-3" />
          Banco de horas pode compensar horas extras
        </p>
      </div>

      {/* Controle de ponto */}
      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
        <Label className="text-sm font-medium">A empresa tinha controle de ponto?</Label>
        <Select
          value={dados.controlePonto}
          onValueChange={(v) => onUpdate('controlePonto', v as OpcaoControlePonto)}
        >
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sim">Sim, registrava corretamente</SelectItem>
            <SelectItem value="parcial">Parcial ou manipulado</SelectItem>
            <SelectItem value="nao">Não tinha</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
