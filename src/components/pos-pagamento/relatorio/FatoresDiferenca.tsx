import { ResultadoRefinado } from '@/types/pos-pagamento';
import { 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Zap,
  ChevronRight
} from 'lucide-react';

interface FatoresDiferencaProps {
  resultado: ResultadoRefinado;
}

export function FatoresDiferenca({ resultado }: FatoresDiferencaProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Identificar se há horas extras
  const jornada = resultado.dados_informados?.jornada;
  const temHorasExtras = jornada?.horarioContratado && jornada?.horarioRealMedio && 
    jornada.horarioContratado !== jornada.horarioRealMedio;

  // Identificar adicionais
  const valores = resultado.dados_informados?.valores;
  const temComissao = valores?.recebiaComissao && valores.mediaMensalComissao > 0;
  const temValoresPorFora = valores?.recebiaPorFora && valores.mediaMensalPorFora > 0;
  const temInsalubridade = valores?.insalubridade;
  const temPericulosidade = valores?.periculosidade;
  const temNoturno = valores?.adicionalNoturno;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">De Onde Vem a Diferença?</h2>
          <p className="text-sm text-muted-foreground">Análise detalhada dos fatores que impactam sua rescisão</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        {/* Resumo da diferença */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 mb-6 border border-emerald-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cálculo Simplificado</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(resultado.valor_base)}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-emerald-500 hidden sm:block" />
            <div>
              <p className="text-sm text-emerald-700">Com Análise Completa</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(resultado.valor_refinado)}</p>
            </div>
            <div className="w-full sm:w-auto text-center sm:text-right">
              <p className="text-sm text-amber-700">Diferença Identificada</p>
              <p className="text-xl font-bold text-amber-600">+{formatCurrency(resultado.diferenca)}</p>
            </div>
          </div>
        </div>

        {/* Fatores identificados */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Fatores que Aumentaram sua Rescisão
          </h4>
          
          {/* Horas extras */}
          {temHorasExtras && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-foreground mb-2">⏱ Horas Extras Habituais Não Registradas</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Identificamos diferença entre a jornada contratada ({jornada.horarioContratado}) e a 
                    jornada real praticada ({jornada.horarioRealMedio}). Isso gera impacto não só nas horas 
                    extras em si, mas também em:
                  </p>
                  <ul className="text-sm text-foreground space-y-1 ml-4">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                      <span>13º salário</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                      <span>Férias + 1/3</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                      <span>Descanso semanal remunerado (DSR)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                      <span>Verbas rescisórias</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Comissões */}
          {temComissao && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-foreground mb-2">💰 Comissões Habituais</h5>
                  <p className="text-sm text-muted-foreground">
                    A média mensal de comissões ({formatCurrency(valores?.mediaMensalComissao || 0)}) deve ser 
                    integrada à base de cálculo das verbas rescisórias, incluindo 13º, férias e FGTS.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Valores por fora */}
          {temValoresPorFora && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-foreground mb-2">🚨 Valores Pagos "Por Fora"</h5>
                  <p className="text-sm text-muted-foreground">
                    Pagamentos informais ({formatCurrency(valores?.mediaMensalPorFora || 0)}/mês) devem ser 
                    considerados como parte do salário real para fins trabalhistas. Isso impacta todas as 
                    verbas rescisórias e pode configurar irregularidade trabalhista.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Adicionais */}
          {(temInsalubridade || temPericulosidade || temNoturno) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-foreground mb-2">⚡ Adicionais Identificados</h5>
                  <p className="text-sm text-muted-foreground mb-2">
                    Os seguintes adicionais foram considerados na análise e refletem em todas as verbas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {temInsalubridade && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        Insalubridade
                      </span>
                    )}
                    {temPericulosidade && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        Periculosidade
                      </span>
                    )}
                    {temNoturno && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        Adicional Noturno
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fatores principais do resultado */}
          {resultado.principais_fatores.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h5 className="text-sm font-semibold text-muted-foreground mb-3">Resumo dos fatores:</h5>
              <div className="space-y-2">
                {resultado.principais_fatores.map((fator, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-sm text-foreground">{fator}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Conclusão educativa */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
          <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            📈 Efeito Acumulado ao Longo do Contrato
          </h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Pequenas diferenças diárias, quando acumuladas por meses, podem gerar valores relevantes na rescisão. 
            A diferença encontrada não vem de um único erro pontual, mas de um <strong>efeito acumulado ao longo 
            do tempo</strong> que muitas vezes passa despercebido nos cálculos simplificados.
          </p>
        </div>
      </div>
    </section>
  );
}
