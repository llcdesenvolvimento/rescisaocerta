import { DadosValoresExtrasV2, DadosFluxoAnterior } from '@/types/pos-pagamento-v2';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DollarSign, Briefcase } from 'lucide-react';

interface EtapaValoresExtrasV2Props {
  dados: DadosValoresExtrasV2;
  dadosFluxoAnterior: DadosFluxoAnterior;
  onUpdate: <K extends keyof DadosValoresExtrasV2>(field: K, value: DadosValoresExtrasV2[K]) => void;
}

export function EtapaValoresExtrasV2({ dados, dadosFluxoAnterior, onUpdate }: EtapaValoresExtrasV2Props) {
  const temPorFora = dadosFluxoAnterior.pagamentoPorFora?.toLowerCase() === 'sim';
  const temDesvio = dadosFluxoAnterior.desvioFuncaoFreq?.toLowerCase() !== 'nunca' && 
                    dadosFluxoAnterior.desvioFuncaoFreq !== '';

  return (
    <div className="space-y-5">
      {/* Header da seção */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Valores Adicionais</h3>
          <p className="text-sm text-muted-foreground">Informe valores não declarados</p>
        </div>
      </div>

      {/* Pagamento por fora */}
      {temPorFora && (
        <div className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl border border-green-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <h4 className="font-semibold text-foreground">Pagamento "Por Fora"</h4>
          </div>

          <div className="space-y-3">
            <Label htmlFor="valorPorFora" className="text-sm font-medium">
              Qual era o valor médio mensal recebido "por fora"?
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                R$
              </span>
              <Input
                id="valorPorFora"
                type="number"
                min={0}
                step={100}
                className="pl-10 bg-background"
                value={dados.valorPorForaMensal || ''}
                onChange={(e) => onUpdate('valorPorForaMensal', Number(e.target.value))}
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              💡 Esse valor deveria integrar a base de cálculo de FGTS, 13º e férias
            </p>
          </div>
        </div>
      )}

      {/* Desvio de função */}
      {temDesvio && (
        <div className="p-4 bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl border border-purple-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="font-semibold text-foreground">Desvio de Função</h4>
          </div>

          <div className="space-y-3">
            <Label htmlFor="diferencaSalarial" className="text-sm font-medium">
              Qual a diferença salarial estimada para o cargo que realmente exercia?
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                R$
              </span>
              <Input
                id="diferencaSalarial"
                type="number"
                min={0}
                step={100}
                className="pl-10 bg-background"
                value={dados.diferencaSalarialEstimadaMensal || ''}
                onChange={(e) => onUpdate('diferencaSalarialEstimadaMensal', Number(e.target.value))}
                placeholder="0,00"
              />
            </div>
            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              💡 Quanto você acredita que deveria ganhar a mais mensalmente
            </p>
          </div>
        </div>
      )}

      {!temPorFora && !temDesvio && (
        <div className="text-center py-8 px-4">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Nenhum valor adicional identificado no formulário anterior.
          </p>
        </div>
      )}
    </div>
  );
}
