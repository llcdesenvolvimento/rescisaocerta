import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosPagamentoFormV2, EtapaFormularioV2 } from '@/hooks/usePosPagamentoFormV2';
import { DadosFluxoAnterior } from '@/types/pos-pagamento-v2';
import { EtapaJornadaV2 } from './EtapaJornadaV2';
import { EtapaAdicionaisV2 } from './EtapaAdicionaisV2';
import { EtapaValoresExtrasV2 } from './EtapaValoresExtrasV2';
import { ReportLoader } from './ReportLoader';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';

const POS_PAGAMENTO_STORAGE_KEY = 'rescisao-pos-pagamento-v2';

interface FormularioPosPagamentoV2Props {
  dadosFluxoAnterior: DadosFluxoAnterior;
  onVoltar?: () => void;
}

export function FormularioPosPagamentoV2({ dadosFluxoAnterior, onVoltar }: FormularioPosPagamentoV2Props) {
  const navigate = useNavigate();
  const {
    formData,
    etapaAtual,
    etapasNecessarias,
    updateJornada,
    updateAdicionais,
    updateValoresExtras,
    proximaEtapa,
    etapaAnterior,
    isEtapaValida,
    irParaEtapa,
  } = usePosPagamentoFormV2(dadosFluxoAnterior);

  const formRef = useRef<HTMLDivElement>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Scroll para o topo do formulário quando mudar de etapa
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [etapaAtual]);

  const etapas = etapasNecessarias();
  const etapaIndex = etapas.indexOf(etapaAtual);
  const totalEtapasFormulario = etapas.filter(e => e !== 'relatorio').length;
  const progresso = etapaAtual === 'relatorio' 
    ? 100 
    : ((etapaIndex + 1) / totalEtapasFormulario) * 100;

  const etapaLabels: Record<EtapaFormularioV2, string> = {
    jornada: 'Jornada',
    adicionais: 'Adicionais',
    valores: 'Valores',
    relatorio: 'Relatório',
  };

  const handleGerarRelatorio = useCallback(() => {
    setIsLoadingReport(true);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    // Salvar dados do formulário pós-pagamento no sessionStorage
    sessionStorage.setItem(POS_PAGAMENTO_STORAGE_KEY, JSON.stringify(formData));
    
    // Navegar para página do relatório com calculo_id real
    const calculoId = sessionStorage.getItem('rescisao-calculo-id') || crypto.randomUUID();
    navigate(`/relatorio?id=${calculoId}`);
  }, [formData, navigate]);

  const isUltimaEtapaFormulario = etapaIndex === totalEtapasFormulario - 1;

  return (
    <>
      {/* Loader de geração do relatório */}
      <ReportLoader open={isLoadingReport} onComplete={handleLoaderComplete} />

      <div ref={formRef} className="w-full max-w-lg mx-auto">
      {/* Introdução explicativa */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground mb-1">
              Últimas perguntas para seu cálculo exato
            </h2>
            <p className="text-sm text-muted-foreground">
              Responda {totalEtapasFormulario} {totalEtapasFormulario === 1 ? 'pergunta rápida' : 'perguntas rápidas'} para calcularmos o valor preciso da sua rescisão, incluindo possíveis direitos não pagos.
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Etapa {etapaIndex + 1} de {totalEtapasFormulario}
          </span>
          <span className="text-sm text-primary font-medium">
            {Math.round(progresso)}% concluído
          </span>
        </div>
        <Progress value={progresso} className="h-2.5" />
        <div className="flex justify-between mt-3">
          {etapas.filter(e => e !== 'relatorio').map((etapa, index) => (
            <div
              key={etapa}
              className={`flex items-center gap-1.5 ${
                index <= etapaIndex ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${
                index < etapaIndex ? 'bg-primary' : 
                index === etapaIndex ? 'bg-primary animate-pulse' : 
                'bg-muted-foreground/30'
              }`} />
              <span className="text-xs font-medium">
                {etapaLabels[etapa]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        {etapaAtual === 'jornada' && (
          <EtapaJornadaV2 dados={formData.jornada} onUpdate={updateJornada} />
        )}
        {etapaAtual === 'adicionais' && (
          <EtapaAdicionaisV2 
            dados={formData.adicionais} 
            dadosFluxoAnterior={dadosFluxoAnterior}
            onUpdate={updateAdicionais} 
          />
        )}
        {etapaAtual === 'valores' && (
          <EtapaValoresExtrasV2 
            dados={formData.valoresExtras} 
            dadosFluxoAnterior={dadosFluxoAnterior}
            onUpdate={updateValoresExtras} 
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {etapaIndex > 0 && (
          <Button
            variant="outline"
            onClick={etapaAnterior}
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
        )}

        {!isUltimaEtapaFormulario ? (
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
            onClick={handleGerarRelatorio}
            disabled={!isEtapaValida(etapaAtual)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-xs sm:text-sm min-w-0"
          >
            <FileText className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">Gerar Relatório</span>
          </Button>
        )}
      </div>
    </div>
    </>
  );
}
