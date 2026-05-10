import { DadosJornada } from '@/types/pos-pagamento';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Clock, Calendar, Coffee } from 'lucide-react';

interface EtapaJornadaProps {
  dados: DadosJornada;
  onUpdate: <K extends keyof DadosJornada>(field: K, value: DadosJornada[K]) => void;
}

export function EtapaJornada({ dados, onUpdate }: EtapaJornadaProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
          <Clock className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Jornada de Trabalho</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Informe os horários para calcular horas extras
        </p>
      </div>

      <div className="space-y-4">
        {/* Horário Contratado */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Horário contratado (carteira)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="horarioContratadoInicio" className="text-xs text-muted-foreground">
                Entrada
              </Label>
              <Input
                id="horarioContratadoInicio"
                type="time"
                value={dados.horarioContratado.split('-')[0] || ''}
                onChange={(e) => {
                  const fim = dados.horarioContratado.split('-')[1] || '';
                  onUpdate('horarioContratado', `${e.target.value}-${fim}`);
                }}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="horarioContratadoFim" className="text-xs text-muted-foreground">
                Saída
              </Label>
              <Input
                id="horarioContratadoFim"
                type="time"
                value={dados.horarioContratado.split('-')[1] || ''}
                onChange={(e) => {
                  const inicio = dados.horarioContratado.split('-')[0] || '';
                  onUpdate('horarioContratado', `${inicio}-${e.target.value}`);
                }}
                className="h-11"
              />
            </div>
          </div>
        </div>

        {/* Horário Real */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Horário real (média que você trabalhava)
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="horarioRealInicio" className="text-xs text-muted-foreground">
                Entrada
              </Label>
              <Input
                id="horarioRealInicio"
                type="time"
                value={dados.horarioRealMedio.split('-')[0] || ''}
                onChange={(e) => {
                  const fim = dados.horarioRealMedio.split('-')[1] || '';
                  onUpdate('horarioRealMedio', `${e.target.value}-${fim}`);
                }}
                className="h-11"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="horarioRealFim" className="text-xs text-muted-foreground">
                Saída
              </Label>
              <Input
                id="horarioRealFim"
                type="time"
                value={dados.horarioRealMedio.split('-')[1] || ''}
                onChange={(e) => {
                  const inicio = dados.horarioRealMedio.split('-')[0] || '';
                  onUpdate('horarioRealMedio', `${inicio}-${e.target.value}`);
                }}
                className="h-11"
              />
            </div>
          </div>
        </div>

        {/* Dias por semana */}
        <div className="space-y-2">
          <Label htmlFor="diasTrabalhadosPorSemana" className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Dias trabalhados por semana
          </Label>
          <Input
            id="diasTrabalhadosPorSemana"
            type="number"
            min={1}
            max={7}
            value={dados.diasTrabalhadosPorSemana}
            onChange={(e) => onUpdate('diasTrabalhadosPorSemana', parseInt(e.target.value) || 5)}
            className="h-11"
          />
        </div>

        {/* Switches */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="trabalhavaSabados" className="text-sm cursor-pointer">
                Trabalhava aos sábados?
              </Label>
            </div>
            <Switch
              id="trabalhavaSabados"
              checked={dados.trabalhavaSabados}
              onCheckedChange={(checked) => onUpdate('trabalhavaSabados', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Coffee className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="intervaloAlmocoCompleto" className="text-sm cursor-pointer">
                Intervalo de almoço completo (1h)?
              </Label>
            </div>
            <Switch
              id="intervaloAlmocoCompleto"
              checked={dados.intervaloAlmocoCompleto}
              onCheckedChange={(checked) => onUpdate('intervaloAlmocoCompleto', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
