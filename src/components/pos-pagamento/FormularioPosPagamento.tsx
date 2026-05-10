import { useState, useEffect } from 'react';
import { usePosPagamentoForm, EtapaFormulario } from '@/hooks/usePosPagamentoForm';
import { FormData } from '@/types/rescisao';
import { ResultadoRefinado, RelatorioAI, EtapaRelatorio } from '@/types/pos-pagamento';
import { calcularRescisaoRefinada } from '@/lib/calculo-refinado';
import { EtapaJornada } from './EtapaJornada';
import { EtapaValores } from './EtapaValores';
import { EtapaTempo } from './EtapaTempo';
import { RelatorioFinal } from './RelatorioFinal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Loader2, FileText, ShieldCheck, Calculator, Brain, FileCheck, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FormularioPosPagamentoProps {
  dadosBase: FormData;
  onVoltar?: () => void;
}

export function FormularioPosPagamento({ dadosBase, onVoltar }: FormularioPosPagamentoProps) {
  const {
    formData,
    etapaAtual,
    updateJornada,
    updateValores,
    updateTempo,
    proximaEtapa,
    etapaAnterior,
    isEtapaValida,
  } = usePosPagamentoForm();

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [resultado, setResultado] = useState<ResultadoRefinado | null>(null);
  const [relatorioAI, setRelatorioAI] = useState<RelatorioAI | null>(null);
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);

  // Etapas do loading com mensagens dinâmicas
  const loadingSteps = [
    { icon: ShieldCheck, label: 'Validando seus dados...', sublabel: 'Verificando informações do contrato' },
    { icon: Calculator, label: 'Calculando verbas...', sublabel: 'Processando todos os valores devidos' },
    { icon: Brain, label: 'Gerando análise com IA...', sublabel: 'Identificando oportunidades e riscos' },
    { icon: FileCheck, label: 'Montando seu relatório...', sublabel: 'Finalizando documento personalizado' },
  ];

  // Efeito para animar o progresso durante loading
  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      setLoadingProgress(0);
      return;
    }

    // Progresso suave de 0 a 95% ao longo de ~2.5 minutos
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) return prev;
        // Progresso mais lento após 60%
        const increment = prev < 60 ? 0.8 : 0.3;
        return Math.min(prev + increment, 95);
      });
    }, 1000);

    // Mudança de etapas
    const stepTimings = [0, 8000, 25000, 60000]; // Início de cada etapa
    const stepTimeouts = stepTimings.map((time, index) => 
      setTimeout(() => setLoadingStep(index), time)
    );

    return () => {
      clearInterval(progressInterval);
      stepTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [loading]);

  const etapas: { key: EtapaFormulario; label: string }[] = [
    { key: 'jornada', label: 'Jornada' },
    { key: 'valores', label: 'Valores' },
    { key: 'tempo', label: 'Tempo' },
  ];

  const etapaIndex = etapas.findIndex((e) => e.key === etapaAtual);
  const progresso = ((etapaIndex + 1) / etapas.length) * 100;

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Recuperar código único e ID do cálculo
      const codigoUnico = sessionStorage.getItem('rescisao-codigo-unico');
      const calculoId = sessionStorage.getItem('rescisao-calculo-id');
      
      // Recuperar valor base original do popup (se disponível)
      const valorBaseOriginalStr = sessionStorage.getItem('rescisao-valor-base-original');
      const valorBaseOriginal = valorBaseOriginalStr ? parseFloat(valorBaseOriginalStr) : undefined;
      
      // Calcular resultado refinado usando o valor base original
      const resultadoCalculado = calcularRescisaoRefinada(dadosBase, formData, valorBaseOriginal);
      setResultado(resultadoCalculado);

      // Atualizar registro no banco com dados pós-pagamento
      if (calculoId) {
        const { error: updateError } = await supabase
          .from('calculos')
          .update({
            // Dados pós-pagamento - Jornada
            horario_contratado: formData.jornada.horarioContratado,
            horario_real_medio: formData.jornada.horarioRealMedio,
            dias_trabalhados_por_semana: formData.jornada.diasTrabalhadosPorSemana,
            trabalhava_sabados: formData.jornada.trabalhavaSabados,
            intervalo_almoco_completo: formData.jornada.intervaloAlmocoCompleto,
            // Dados pós-pagamento - Valores
            recebia_comissao: formData.valores.recebiaComissao,
            media_mensal_comissao: formData.valores.mediaMensalComissao,
            adicional_noturno: formData.valores.adicionalNoturno,
            insalubridade: formData.valores.insalubridade,
            periculosidade: formData.valores.periculosidade,
            recebia_por_fora: formData.valores.recebiaPorFora,
            media_mensal_por_fora: formData.valores.mediaMensalPorFora,
            // Dados pós-pagamento - Tempo
            quando_ultimas_ferias: formData.tempo.quandoUltimasFerias,
            tirou_ferias_corretamente: formData.tempo.tirouFeriasCorretamente,
            meses_trabalhados_ano_rescisao: formData.tempo.mesesTrabalhadosAnoRescisao,
            aviso_previo_confirmado: formData.tempo.avisoPrevioConfirmado,
            // Resultados
            valor_refinado: resultadoCalculado.valor_refinado,
            diferenca: resultadoCalculado.diferenca,
            nivel_oportunidade: resultadoCalculado.nivel_oportunidade,
            principais_fatores: resultadoCalculado.principais_fatores,
            itens_verbas: JSON.parse(JSON.stringify(resultadoCalculado.itens)),
          })
          .eq('id', calculoId);

        if (updateError) {
          console.error('Erro ao atualizar cálculo:', updateError);
        }
      }

      // Chamar edge function para gerar relatório AI
      const { data, error } = await supabase.functions.invoke('gerar-relatorio-rescisao', {
        body: { 
          resultado: resultadoCalculado,
          calculoId: calculoId,
          baseUrl: window.location.origin
        },
      });

      if (error) {
        console.error('Erro ao gerar relatório:', error);
        toast.error('Erro ao gerar relatório. Por favor, tente novamente.');
        // Mesmo com erro, mostra o resultado calculado
        setRelatorioAI({
          resumo: '',
          deOndeVemDiferenca: '',
          detalhamentoVerbas: '',
          checklistPratico: '',
          proximosPassos: '',
          disclaimer: '',
          error: 'Não foi possível gerar a análise detalhada.',
        });
      } else {
        setRelatorioAI(data);
      }

      setMostrarRelatorio(true);
    } catch (err) {
      console.error('Erro:', err);
      toast.error('Ocorreu um erro. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (mostrarRelatorio && resultado) {
    return (
      <RelatorioFinal
        resultado={resultado}
        relatorioAI={relatorioAI}
        dadosBase={dadosBase}
        onVoltar={() => setMostrarRelatorio(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Loading Dialog - Dinâmico com etapas */}
      <Dialog open={loading} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <div className="flex flex-col items-center justify-center py-6 space-y-5">
            {/* Ícone animado da etapa atual */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                {(() => {
                  const CurrentIcon = loadingSteps[loadingStep]?.icon || Loader2;
                  return <CurrentIcon className="w-10 h-10 text-primary animate-pulse" />;
                })()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
              </div>
            </div>

            {/* Título e subtítulo da etapa */}
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                {loadingSteps[loadingStep]?.label || 'Processando...'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {loadingSteps[loadingStep]?.sublabel || ''}
              </p>
            </div>

            {/* Indicadores de etapas */}
            <div className="flex items-center justify-center gap-2">
              {loadingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    index === loadingStep
                      ? 'bg-primary scale-125'
                      : index < loadingStep
                      ? 'bg-primary/60'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            {/* Barra de progresso */}
            <div className="w-full max-w-xs space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${loadingProgress}%` }} 
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(loadingProgress)}% concluído
              </p>
            </div>

            {/* Aviso importante */}
            <div className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Não saia ou atualize esta página
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    A geração do relatório pode levar até 3 minutos. Aguarde a conclusão para não perder seus dados.
                  </p>
                </div>
              </div>
            </div>

            {/* Tempo estimado */}
            <p className="text-xs text-muted-foreground text-center">
              ⏱️ Tempo estimado: até 3 minutos
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Análise Detalhada</h2>
          <span className="text-sm text-muted-foreground">
            Etapa {etapaIndex + 1} de {etapas.length}
          </span>
        </div>
        <Progress value={progresso} className="h-2" />
        <div className="flex justify-between mt-2">
          {etapas.map((etapa, index) => (
            <span
              key={etapa.key}
              className={`text-xs ${
                index <= etapaIndex ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}
            >
              {etapa.label}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {etapaAtual === 'jornada' && (
          <EtapaJornada dados={formData.jornada} onUpdate={updateJornada} />
        )}
        {etapaAtual === 'valores' && (
          <EtapaValores dados={formData.valores} onUpdate={updateValores} />
        )}
        {etapaAtual === 'tempo' && (
          <EtapaTempo dados={formData.tempo} onUpdate={updateTempo} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {etapaIndex > 0 ? (
          <Button
            variant="outline"
            onClick={etapaAnterior}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
        ) : onVoltar ? (
          <Button
            variant="outline"
            onClick={onVoltar}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        ) : null}

        {etapaIndex < etapas.length - 1 ? (
          <Button
            onClick={proximaEtapa}
            disabled={!isEtapaValida(etapaAtual)}
            className="flex-1"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading || !isEtapaValida(etapaAtual)}
            className="flex-1 bg-success hover:bg-success/90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando relatório...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
