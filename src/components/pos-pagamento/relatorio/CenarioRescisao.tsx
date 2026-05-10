import { ResultadoRefinado } from '@/types/pos-pagamento';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CenarioRescisaoProps {
  resultado: ResultadoRefinado;
}

export function CenarioRescisao({ resultado }: CenarioRescisaoProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Calcular cenários
  const cenarioMinimo = resultado.valor_base;
  const cenarioAtual = resultado.valor_refinado;
  // O máximo seria com conferência documental completa (estimativa +10-15%)
  const cenarioMaximoPotencial = cenarioAtual * 1.1;

  const percentualDiferenca = ((cenarioAtual - cenarioMinimo) / cenarioMinimo) * 100;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Cenários de Rescisão</h2>
          <p className="text-sm text-muted-foreground">Comparativo de valores possíveis</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-foreground leading-relaxed mb-6">
          A análise identificou diferentes cenários para sua rescisão, dependendo do nível de detalhamento 
          dos cálculos realizados:
        </p>

        <div className="space-y-4">
          {/* Cenário Mínimo */}
          <div className="relative">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cenário Mínimo</p>
                    <p className="text-xs text-muted-foreground/70">Cálculo simplificado sem análise detalhada</p>
                  </div>
                  <p className="text-xl font-bold text-muted-foreground">{formatCurrency(cenarioMinimo)}</p>
                </div>
              </div>
            </div>
            {/* Linha conectora */}
            <div className="absolute left-10 top-full w-0.5 h-4 bg-border"></div>
          </div>

          {/* Cenário Atual - Destaque */}
          <div className="relative">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-300 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-emerald-700">Cenário com Análise Completa</p>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                        ATUAL
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600">Baseado nas informações detalhadas fornecidas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-600">{formatCurrency(cenarioAtual)}</p>
                    <p className="text-xs text-emerald-600">
                      +{percentualDiferenca.toFixed(1)}% em relação ao mínimo
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Linha conectora */}
            <div className="absolute left-10 top-full w-0.5 h-4 bg-border"></div>
          </div>

          {/* Cenário Máximo */}
          <div>
            <div className="flex items-center gap-4 p-4 bg-amber-50/50 rounded-lg border border-amber-200 border-dashed">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-sm text-amber-700">Cenário Máximo Possível</p>
                    <p className="text-xs text-amber-600">Depende da conferência documental completa</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-600">
                      {formatCurrency(cenarioMaximoPotencial)}+
                    </p>
                    <p className="text-xs text-amber-600/70">Potencial estimado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nota explicativa */}
        <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg border border-indigo-200">
          <p className="text-sm text-indigo-800 leading-relaxed">
            <strong>💡 Importante:</strong> O valor de <strong>{formatCurrency(cenarioAtual)}</strong> é 
            um cenário técnico baseado nas informações fornecidas, não uma promessa. O valor final 
            depende da conferência com documentos oficiais (TRCT, holerites, extrato do FGTS).
          </p>
        </div>
      </div>
    </section>
  );
}
