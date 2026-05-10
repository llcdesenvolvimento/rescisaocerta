import { DadosValores } from '@/types/pos-pagamento';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Banknote } from 'lucide-react';

interface EtapaValoresProps {
  dados: DadosValores;
  onUpdate: <K extends keyof DadosValores>(field: K, value: DadosValores[K]) => void;
}

export function EtapaValores({ dados, onUpdate }: EtapaValoresProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const parseCurrency = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return parseInt(cleaned) / 100 || 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/10 mb-3">
          <DollarSign className="w-6 h-6 text-success" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Valores Adicionais</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Informe valores extras que impactam seus direitos
        </p>
      </div>

      <div className="space-y-4">
        {/* Valor por fora - Detalhamento */}
        <div className="p-4 rounded-lg border border-border bg-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Banknote className="w-4 h-4 text-muted-foreground" />
              <Label htmlFor="recebiaPorFora" className="text-sm font-medium cursor-pointer">
                Recebia valor "por fora"?
              </Label>
            </div>
            <Switch
              id="recebiaPorFora"
              checked={dados.recebiaPorFora}
              onCheckedChange={(checked) => onUpdate('recebiaPorFora', checked)}
            />
          </div>
          
          {dados.recebiaPorFora && (
            <div className="pt-2">
              <Label htmlFor="mediaMensalPorFora" className="text-xs text-muted-foreground">
                Média mensal recebida por fora
              </Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  R$
                </span>
                <Input
                  id="mediaMensalPorFora"
                  type="text"
                  placeholder="0,00"
                  value={formatCurrency(dados.mediaMensalPorFora)}
                  onChange={(e) => onUpdate('mediaMensalPorFora', parseCurrency(e.target.value))}
                  className="h-10 pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Esse valor impacta diretamente no cálculo das verbas rescisórias
              </p>
            </div>
          )}
        </div>

        {/* Informativo */}
        <div className="bg-muted/50 rounded-lg p-3 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Os demais valores (comissões, adicionais) já foram considerados nas perguntas anteriores
          </p>
        </div>
      </div>
    </div>
  );
}
