import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Info, Briefcase, DollarSign } from 'lucide-react';
import { formatarMoeda } from '@/lib/calculo-extras';
import { DadosFluxoAnterior } from '@/types/pos-pagamento-v2';

export interface LinhaBasico {
  descricao: string;
  valor: number;
  explicacao?: string;
  tipo?: 'provento' | 'desconto';
}

interface SecaoBasicoProps {
  linhas: LinhaBasico[];
  totalBasico: number;
  dadosBase: DadosFluxoAnterior;
}

export function SecaoBasico({ linhas, totalBasico, dadosBase }: SecaoBasicoProps) {
  const calcularTempoServico = () => {
    if (!dadosBase.dataAdmissao || !dadosBase.dataDesligamento) return '';
    try {
      const admissao = new Date(dadosBase.dataAdmissao);
      const desligamento = new Date(dadosBase.dataDesligamento);
      const diffMs = desligamento.getTime() - admissao.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const anos = Math.floor(diffDays / 365);
      const meses = Math.floor((diffDays % 365) / 30);
      const dias = diffDays % 30;
      
      let resultado = '';
      if (anos > 0) resultado += `${anos} ano${anos > 1 ? 's' : ''}, `;
      if (meses > 0) resultado += `${meses} ${meses > 1 ? 'meses' : 'mês'}, `;
      resultado += `${dias} dia${dias !== 1 ? 's' : ''}`;
      return resultado;
    } catch {
      return '';
    }
  };

  const formatarData = (data: string) => {
    if (!data) return '-';
    try {
      return new Date(data).toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  };

  const tempoServico = calcularTempoServico();

  const proventos = linhas.filter(l => l.tipo !== 'desconto');
  const descontos = linhas.filter(l => l.tipo === 'desconto');
  const subtotalProventos = proventos.reduce((acc, l) => acc + l.valor, 0);
  const subtotalDescontos = descontos.reduce((acc, l) => acc + l.valor, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 border-b p-3 sm:p-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
          <span>Verbas Rescisórias Básicas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Dados do Contrato */}
        <div className="p-3 sm:p-4 bg-muted/30 border-b">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            Dados do Contrato
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-muted-foreground">Admissão:</span>
              <span className="font-medium ml-1">{formatarData(dadosBase.dataAdmissao)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Desligamento:</span>
              <span className="font-medium ml-1">{formatarData(dadosBase.dataDesligamento)}</span>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <span className="text-muted-foreground">Tempo de serviço:</span>
              <span className="font-medium ml-1">{tempoServico || '-'}</span>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <span className="text-muted-foreground">Salário base:</span>
              <span className="font-medium ml-1">{formatarMoeda(dadosBase.salarioBrutoMensal)}</span>
            </div>
          </div>
        </div>

        {/* Proventos */}
        {proventos.length > 0 && (
          <div className="divide-y">
            {proventos.map((linha, index) => (
              <div key={index} className="p-3 sm:p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">{linha.descricao}</p>
                    {linha.explicacao && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{linha.explicacao}</span>
                      </p>
                    )}
                  </div>
                  <p className="font-bold text-sm sm:text-base text-primary whitespace-nowrap">
                    {formatarMoeda(linha.valor)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Descontos - em vermelho */}
        {descontos.length > 0 && (
          <div className="divide-y border-t">
            {descontos.map((linha, index) => (
              <div key={index} className="p-3 sm:p-4 bg-destructive/5 hover:bg-destructive/10 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-destructive">{linha.descricao}</p>
                    {linha.explicacao && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span>{linha.explicacao}</span>
                      </p>
                    )}
                  </div>
                  <p className="font-bold text-sm sm:text-base text-destructive whitespace-nowrap">
                    - {formatarMoeda(linha.valor)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subtotal */}
        <div className="p-3 sm:p-4 bg-primary/10 border-t-2 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm sm:text-base">Subtotal Verbas Básicas</span>
            </div>
            <p className="text-lg sm:text-xl font-black text-primary">
              {formatarMoeda(totalBasico)}
            </p>
          </div>
          {descontos.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Proventos: {formatarMoeda(subtotalProventos)} | Descontos: -{formatarMoeda(subtotalDescontos)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
