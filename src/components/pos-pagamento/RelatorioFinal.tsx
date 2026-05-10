import { useState, useRef } from 'react';
import { ResultadoRefinado, RelatorioAI } from '@/types/pos-pagamento';
import { FormData } from '@/types/rescisao';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Componentes refatorados
import {
  DiagnosticoContrato,
  FatoresDiferenca,
  MapaDireitos,
  SimulacaoRisco,
  CenarioRescisao,
  ChecklistDocumentos,
  PlanoAcao,
  DetalhamentoVerbas
} from './relatorio';

interface RelatorioFinalProps {
  resultado: ResultadoRefinado;
  relatorioAI: RelatorioAI | null;
  dadosBase: FormData;
  onVoltar: () => void;
}

export function RelatorioFinal({ resultado, relatorioAI, dadosBase, onVoltar }: RelatorioFinalProps) {
  const [gerando, setGerando] = useState(false);
  const relatorioRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!relatorioRef.current) return;
    
    setGerando(true);
    
    // Criar uma nova janela para impressão
    const printContent = relatorioRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Análise de Rescisão Trabalhista</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              color: #1a1a1a;
              line-height: 1.6;
            }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 18px; margin-bottom: 12px; color: #1a1a1a; }
            h3 { font-size: 16px; margin-bottom: 8px; }
            p { margin-bottom: 8px; color: #666; }
            section { 
              margin-bottom: 24px; 
              padding: 16px; 
              border: 1px solid #e5e5e5; 
              border-radius: 8px;
              page-break-inside: avoid;
            }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .text-muted-foreground { color: #666; }
            .text-foreground { color: #1a1a1a; }
            .bg-primary\\/10 { background: #e8f0fe; }
            .bg-emerald-50 { background: #ecfdf5; }
            .bg-amber-50 { background: #fffbeb; }
            .bg-blue-50 { background: #eff6ff; }
            .text-emerald-700 { color: #047857; }
            .text-amber-600 { color: #d97706; }
            .text-primary { color: #2056df; }
            .border-emerald-200 { border-color: #a7f3d0; }
            .border-amber-200 { border-color: #fde68a; }
            .space-y-4 > * + * { margin-top: 16px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .grid { display: grid; gap: 16px; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
            .flex { display: flex; }
            .gap-4 { gap: 16px; }
            .items-center { align-items: center; }
            .justify-between { justify-content: space-between; }
            .rounded-xl { border-radius: 12px; }
            .p-4 { padding: 16px; }
            .p-6 { padding: 24px; }
            .mb-4 { margin-bottom: 16px; }
            .text-sm { font-size: 14px; }
            .text-xs { font-size: 12px; }
            .text-2xl { font-size: 24px; }
            .text-3xl { font-size: 30px; }
            svg { display: none; }
            @media print {
              body { padding: 0; }
              section { border: 1px solid #ddd; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      
      // Aguardar carregamento e imprimir
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
        setGerando(false);
      };
      
      // Fallback caso onload não dispare
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.print();
          printWindow.close();
        }
        setGerando(false);
      }, 1000);
    } else {
      toast({
        title: "Erro ao abrir janela",
        description: "Por favor, permita pop-ups para este site.",
        variant: "destructive",
      });
      setGerando(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onVoltar}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownloadPDF}
          disabled={gerando}
        >
          {gerando ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Baixar PDF
        </Button>
      </div>

      {/* Conteúdo do Relatório para PDF */}
      <div ref={relatorioRef} className="bg-background">
        {/* Título Principal */}
        <div className="text-center mb-8 pb-6 border-b border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Análise Completa de Rescisão Trabalhista
          </h1>
          <p className="text-muted-foreground">
            Documento gerado em {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Conteúdo do Relatório - Seções Premium */}
        <div className="space-y-8">
          
          {/* 1. Diagnóstico do Contrato (Raio-X) */}
          <DiagnosticoContrato dadosBase={dadosBase} resultado={resultado} />

          {/* 2. Cenários de Rescisão */}
          <CenarioRescisao resultado={resultado} />

          {/* 3. De Onde Vem a Diferença */}
          <FatoresDiferenca resultado={resultado} />

          {/* 4. Mapa de Direitos */}
          <MapaDireitos dadosBase={dadosBase} resultado={resultado} />

          {/* 5. Detalhamento das Verbas */}
          <DetalhamentoVerbas resultado={resultado} relatorioAI={relatorioAI} />

          {/* 6. Simulação de Risco */}
          <SimulacaoRisco />

          {/* 7. Checklist de Documentos */}
          <ChecklistDocumentos />

          {/* 8. Plano de Ação */}
          <PlanoAcao resultado={resultado} />

          {/* DISCLAIMER */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-2">Aviso Importante</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {relatorioAI?.disclaimer || 
                    'Este relatório apresenta estimativas baseadas exclusivamente nas informações fornecidas por você. Os valores finais podem variar conforme a documentação oficial (TRCT, holerites, extrato FGTS, carteira de trabalho). Esta análise tem caráter informativo e educativo, não constituindo parecer jurídico. Para casos de divergência significativa entre os valores calculados e os pagos pela empresa, recomendamos consultar um advogado trabalhista.'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* CTA Download - Fora do ref para não aparecer no PDF */}
      <div className="pt-6">
        <Button
          onClick={handleDownloadPDF}
          disabled={gerando}
          size="lg"
          className="w-full h-14 text-base font-bold bg-emerald-600 hover:bg-emerald-700"
        >
          {gerando ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Baixar Análise Completa em PDF
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Guarde este documento para consulta futura
        </p>
      </div>
    </div>
  );
}
