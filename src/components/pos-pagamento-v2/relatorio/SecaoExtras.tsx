import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Moon, 
  Flame, 
  ShieldAlert, 
  DollarSign, 
  Briefcase, 
  AlertTriangle,
  Calculator,
  Info
} from 'lucide-react';
import { ResultadoExtras, ItemExtra, SEMANAS_POR_MES } from '@/types/pos-pagamento-v2';
import { formatarMoeda } from '@/lib/calculo-extras';

interface SecaoExtrasProps {
  extras: ResultadoExtras;
  mesesTrabalhados?: number;
}

function getIconForItem(nome: string) {
  if (nome.toLowerCase().includes('hora')) return Clock;
  if (nome.toLowerCase().includes('noturno')) return Moon;
  if (nome.toLowerCase().includes('periculosidade')) return Flame;
  if (nome.toLowerCase().includes('insalubridade')) return ShieldAlert;
  if (nome.toLowerCase().includes('fora')) return DollarSign;
  if (nome.toLowerCase().includes('desvio')) return Briefcase;
  return TrendingUp;
}

function getExplicacaoItem(nome: string): string {
  if (nome.toLowerCase().includes('hora')) {
    return 'CLT Art. 59 - Adicional mínimo de 50% sobre a hora normal para horas extraordinárias.';
  }
  if (nome.toLowerCase().includes('noturno')) {
    return 'CLT Art. 73 - Adicional de 20% sobre a hora normal para trabalho entre 22h e 5h.';
  }
  if (nome.toLowerCase().includes('periculosidade')) {
    return 'CLT Art. 193 - Adicional de 30% sobre o salário-base para atividades perigosas.';
  }
  if (nome.toLowerCase().includes('insalubridade')) {
    return 'CLT Art. 192 - Adicional de 10%, 20% ou 40% sobre o salário mínimo conforme o grau.';
  }
  if (nome.toLowerCase().includes('fora')) {
    return 'Valores recebidos sem registro devem integrar a base de cálculo de FGTS, 13º e férias.';
  }
  if (nome.toLowerCase().includes('desvio')) {
    return 'Quando o trabalhador exerce função diferente da registrada, tem direito à diferença salarial.';
  }
  return '';
}

function ExtraCard({ item }: { item: ItemExtra }) {
  const Icon = getIconForItem(item.nome);
  const explicacao = getExplicacaoItem(item.nome);
  
  return (
    <div className="p-3 sm:p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 flex-shrink-0">
            <Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm sm:text-base">{item.nome}</h4>
              {item.isEstimativa && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  Estimativa
                </Badge>
              )}
            </div>
            {item.condicao && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">
                ⚠️ {item.condicao}
              </p>
            )}
            {explicacao && (
              <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{explicacao}</span>
              </p>
            )}
          </div>
        </div>
        <div className="text-left sm:text-right pl-9 sm:pl-0">
          <p className="font-bold text-base sm:text-lg text-green-600 dark:text-green-400">
            {formatarMoeda(item.valorMensal)}
          </p>
          <p className="text-xs text-muted-foreground">por mês</p>
        </div>
      </div>
    </div>
  );
}

export function SecaoExtras({ extras, mesesTrabalhados = 12 }: SecaoExtrasProps) {
  const temEstimativas = extras.itensAplicaveis.some(item => item.isEstimativa);
  const valorTotalPeriodo = extras.totalExtrasMensal * mesesTrabalhados;

  if (extras.itensAplicaveis.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50 border-b p-3 sm:p-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span>Valores Adicionais Identificados</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Calculator className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Com base nas informações fornecidas, não identificamos valores adicionais pendentes.
            </p>
            <p className="text-xs text-muted-foreground">
              Isso pode indicar que seus direitos básicos estão sendo respeitados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b p-3 sm:p-4 bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <TrendingUp className="w-5 h-5 flex-shrink-0" />
          <span>Valores Adicionais Identificados</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Estes valores podem não ter sido pagos corretamente durante o contrato
        </p>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 space-y-3">
        {extras.itensAplicaveis.map((item, index) => (
          <ExtraCard key={index} item={item} />
        ))}

        {/* Resumo dos extras */}
        <div className="mt-4 p-3 sm:p-4 bg-muted/30 rounded-lg border">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <p className="font-medium text-sm">
                Total de extras por mês:
              </p>
              <p className="text-xl sm:text-2xl font-black text-green-600 dark:text-green-400">
                {formatarMoeda(extras.totalExtrasMensal)}
              </p>
            </div>

            <div className="pt-2 border-t">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="text-xs text-muted-foreground">
                  Projeção para {mesesTrabalhados} meses de contrato:
                </p>
                <p className="text-base font-bold text-green-600 dark:text-green-400">
                  {formatarMoeda(valorTotalPeriodo)}
                </p>
              </div>
            </div>

            {temEstimativas && (
              <p className="text-xs text-amber-600 dark:text-amber-400 flex items-start gap-1 pt-2">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Alguns valores são estimativas e podem variar conforme documentação.</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
