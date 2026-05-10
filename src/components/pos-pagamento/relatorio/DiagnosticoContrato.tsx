import { FormData } from '@/types/rescisao';
import { ResultadoRefinado } from '@/types/pos-pagamento';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  Banknote, 
  AlertTriangle,
  TrendingUp,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiagnosticoContratoProps {
  dadosBase: FormData;
  resultado: ResultadoRefinado;
}

export function DiagnosticoContrato({ dadosBase, resultado }: DiagnosticoContratoProps) {
  // Calcular tempo de serviço
  const calcularTempoServico = () => {
    if (!dadosBase.dataAdmissao || !dadosBase.dataDesligamento) return 'Não informado';
    const admissao = new Date(dadosBase.dataAdmissao);
    const desligamento = new Date(dadosBase.dataDesligamento);
    const diffTime = Math.abs(desligamento.getTime() - admissao.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const anos = Math.floor(diffDays / 365);
    const meses = Math.floor((diffDays % 365) / 30);
    if (anos > 0) {
      return `${anos} ano${anos > 1 ? 's' : ''} e ${meses} mes${meses !== 1 ? 'es' : ''}`;
    }
    return `${meses} mes${meses !== 1 ? 'es' : ''}`;
  };

  const getTipoDesligamentoLabel = () => {
    const tipos: Record<string, string> = {
      'demissao_sem_justa_causa': 'Demissão sem justa causa',
      'pedido_demissao': 'Pedido de demissão',
      'acordo': 'Acordo (art. 484-A CLT)',
      'termino_contrato': 'Término de contrato',
      'justa_causa': 'Demissão por justa causa',
    };
    return tipos[dadosBase.tipoDesligamento || ''] || 'Não informado';
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Calcular classificação de risco
  const calcularRiscoTrabalhista = () => {
    let pontos = 0;
    
    // Horas extras habituais
    if (dadosBase.faziaHorasExtras && dadosBase.faziaHorasExtras !== 'nao_fazia') pontos += 2;
    
    // Desvio de função
    if (dadosBase.funcoesDiferentes && dadosBase.funcoesDiferentes !== 'nao_fazia') pontos += 2;
    
    // Valores por fora
    if (dadosBase.valorPorFora === 'sim') pontos += 3;
    
    // Adicionais não pagos
    if (dadosBase.adicionaisTrabalho && dadosBase.adicionaisTrabalho.length > 0) pontos += 2;
    
    // Férias vencidas não gozadas
    if (dadosBase.periodosFeriasVencidas > 0) pontos += 2;
    
    if (pontos >= 5) return 'alto';
    if (pontos >= 2) return 'medio';
    return 'baixo';
  };

  const calcularPotencialNaoPago = () => {
    const diferenca = resultado.diferenca;
    const valorBase = resultado.valor_base;
    const percentual = (diferenca / valorBase) * 100;
    
    if (percentual >= 30) return 'alto';
    if (percentual >= 10) return 'medio';
    return 'baixo';
  };

  const riscoTrabalhista = calcularRiscoTrabalhista();
  const potencialNaoPago = calcularPotencialNaoPago();

  const getJornadaInfo = () => {
    const jornada = resultado.dados_informados?.jornada;
    if (jornada?.horarioContratado && jornada?.horarioRealMedio) {
      return `Contratada: ${jornada.horarioContratado} | Real: ${jornada.horarioRealMedio}`;
    }
    return 'Conforme contrato';
  };

  const temHorasExtras = () => {
    const jornada = resultado.dados_informados?.jornada;
    if (jornada?.horarioContratado && jornada?.horarioRealMedio) {
      return jornada.horarioContratado !== jornada.horarioRealMedio;
    }
    return dadosBase.faziaHorasExtras && dadosBase.faziaHorasExtras !== 'nao_fazia';
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Diagnóstico do Contrato de Trabalho</h2>
          <p className="text-sm text-muted-foreground">Raio-X completo do seu vínculo empregatício</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Grid de informações do contrato */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
          <div className="bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Regime</span>
            </div>
            <p className="font-semibold text-foreground">CLT</p>
          </div>
          
          <div className="bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Tipo de Desligamento</span>
            </div>
            <p className="font-semibold text-foreground">{getTipoDesligamentoLabel()}</p>
          </div>
          
          <div className="bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Tempo de Vínculo</span>
            </div>
            <p className="font-semibold text-foreground">{calcularTempoServico()}</p>
          </div>
          
          <div className="bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Banknote className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Base Salarial</span>
            </div>
            <p className="font-semibold text-foreground">{formatCurrency(dadosBase.salarioFixo || 0)}</p>
          </div>
          
          <div className="bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Jornada</span>
            </div>
            <p className="font-semibold text-foreground text-sm">{getJornadaInfo()}</p>
          </div>
          
          <div className="bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wide">Horas Extras Habituais</span>
            </div>
            <p className="font-semibold text-foreground">
              {temHorasExtras() ? 'Sim - Identificadas' : 'Não identificadas'}
            </p>
          </div>
        </div>

        {/* Classificação do cenário */}
        <div className="p-4 bg-gradient-to-br from-muted/30 to-muted/50 border-t border-border">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-lg">📊</span>
            Classificação do Cenário
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className={cn(
              "rounded-lg p-3 border",
              riscoTrabalhista === 'alto' && "bg-red-50 border-red-200",
              riscoTrabalhista === 'medio' && "bg-amber-50 border-amber-200",
              riscoTrabalhista === 'baixo' && "bg-emerald-50 border-emerald-200"
            )}>
              <p className="text-xs text-muted-foreground mb-1">Risco Trabalhista</p>
              <p className={cn(
                "font-bold uppercase text-sm",
                riscoTrabalhista === 'alto' && "text-red-600",
                riscoTrabalhista === 'medio' && "text-amber-600",
                riscoTrabalhista === 'baixo' && "text-emerald-600"
              )}>
                {riscoTrabalhista === 'alto' && '🔴 Alto'}
                {riscoTrabalhista === 'medio' && '🟡 Médio'}
                {riscoTrabalhista === 'baixo' && '🟢 Baixo'}
              </p>
            </div>
            
            <div className={cn(
              "rounded-lg p-3 border",
              potencialNaoPago === 'alto' && "bg-red-50 border-red-200",
              potencialNaoPago === 'medio' && "bg-amber-50 border-amber-200",
              potencialNaoPago === 'baixo' && "bg-emerald-50 border-emerald-200"
            )}>
              <p className="text-xs text-muted-foreground mb-1">Potencial de Valores Não Pagos</p>
              <p className={cn(
                "font-bold uppercase text-sm",
                potencialNaoPago === 'alto' && "text-red-600",
                potencialNaoPago === 'medio' && "text-amber-600",
                potencialNaoPago === 'baixo' && "text-emerald-600"
              )}>
                {potencialNaoPago === 'alto' && '🔴 Alto'}
                {potencialNaoPago === 'medio' && '🟡 Médio'}
                {potencialNaoPago === 'baixo' && '🟢 Baixo'}
              </p>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 italic">
            Esta classificação é baseada nas informações fornecidas e nos fatores de risco identificados durante a análise.
          </p>
        </div>
      </div>
    </section>
  );
}
