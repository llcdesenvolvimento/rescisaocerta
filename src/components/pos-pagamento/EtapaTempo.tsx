import { DadosTempo } from '@/types/pos-pagamento';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarDays, FileCheck } from 'lucide-react';

interface EtapaTempoProps {
  dados: DadosTempo;
  onUpdate: <K extends keyof DadosTempo>(field: K, value: DadosTempo[K]) => void;
}

export function EtapaTempo({ dados, onUpdate }: EtapaTempoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <CalendarDays className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Férias e Descanso</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Últimos detalhes para o cálculo preciso
        </p>
      </div>

      <div className="space-y-5">
        {/* Últimas férias */}
        <div className="space-y-2">
          <Label htmlFor="quandoUltimasFerias" className="text-sm font-medium">
            Quando foram suas últimas férias?
          </Label>
          <Input
            id="quandoUltimasFerias"
            type="month"
            value={dados.quandoUltimasFerias}
            onChange={(e) => onUpdate('quandoUltimasFerias', e.target.value)}
            className="h-11"
          />
        </div>

        {/* Férias corretas */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Tirou férias corretamente (30 dias)?
          </Label>
          <RadioGroup
            value={dados.tirouFeriasCorretamente}
            onValueChange={(value) => onUpdate('tirouFeriasCorretamente', value as DadosTempo['tirouFeriasCorretamente'])}
            className="space-y-2"
          >
            {[
              { value: 'sim', label: 'Sim, tirei 30 dias' },
              { value: 'nao', label: 'Não, tirei menos ou não tirei' },
              { value: 'nao_sei', label: 'Não sei / não lembro' },
            ].map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={option.value} id={`ferias-${option.value}`} />
                <Label htmlFor={`ferias-${option.value}`} className="text-sm cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Informativo */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Os dados de aviso prévio e período do contrato já foram considerados nas perguntas anteriores
          </p>
        </div>
      </div>
    </div>
  );
}
