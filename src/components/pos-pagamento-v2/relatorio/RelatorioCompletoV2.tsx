import React, { useEffect, useRef, useState } from 'react';
import { DadosFluxoAnterior, ResultadoExtras } from '@/types/pos-pagamento-v2';
import { SecaoBasico, LinhaBasico } from './SecaoBasico';
import { SecaoExtras } from './SecaoExtras';
import { SecaoErros } from './SecaoErros';
import { SecaoProximosPassos } from './SecaoProximosPassos';
import { SecaoUpsellCarta } from './SecaoUpsellCarta';
import { SecaoUpsellChecklist } from './SecaoUpsellChecklist';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Loader2 } from 'lucide-react';
import { formatarMoeda } from '@/lib/calculo-extras';
import { toast } from '@/hooks/use-toast';
import { VerbaRescisoria } from '@/lib/calculadora-rescisao-completa';

interface RelatorioCompletoV2Props {
  dadosBase: DadosFluxoAnterior;
  extras: ResultadoExtras;
  onVoltar: () => void;
  verbasOriginais?: VerbaRescisoria[];
  emailUsuario?: string;
  calculoId?: string;
}

export function RelatorioCompletoV2({ dadosBase, extras, onVoltar, verbasOriginais, emailUsuario: emailProp, calculoId: calculoIdProp }: RelatorioCompletoV2Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const temSuspeitaErro = dadosBase.suspeitaErroEmpregador?.toLowerCase() === 'sim';
  const safeExtras: ResultadoExtras = {
    ...extras,
    totalExtrasMensal: extras.totalExtrasMensal ?? 0,
    itensAplicaveis: extras.itensAplicaveis ?? [],
  };
  const temExtras = safeExtras.totalExtrasMensal > 0;

  const calcularMesesTrabalhados = (): number => {
    if (!dadosBase.dataAdmissao || !dadosBase.dataDesligamento) return 12;
    try {
      const admissao = new Date(dadosBase.dataAdmissao);
      const desligamento = new Date(dadosBase.dataDesligamento);
      const diffMs = desligamento.getTime() - admissao.getTime();
      const meses = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));
      return Math.max(1, meses);
    } catch {
      return 12;
    }
  };

  const calcularTempoContrato = (): string => {
    if (!dadosBase.dataAdmissao || !dadosBase.dataDesligamento) return '';
    try {
      const admissao = new Date(dadosBase.dataAdmissao);
      const desligamento = new Date(dadosBase.dataDesligamento);
      const diffMs = desligamento.getTime() - admissao.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const anos = Math.floor(diffDays / 365);
      const meses = Math.floor((diffDays % 365) / 30);
      let resultado = '';
      if (anos > 0) resultado += `${anos} ano${anos > 1 ? 's' : ''} e `;
      resultado += `${meses} ${meses > 1 ? 'meses' : 'mês'}`;
      return resultado;
    } catch {
      return '';
    }
  };

  const mesesTrabalhados = calcularMesesTrabalhados();

  // Usar verbas originais do cálculo parcial
  const linhasBasico: LinhaBasico[] = [];
  
  if (verbasOriginais && verbasOriginais.length > 0) {
    for (const verba of verbasOriginais) {
      linhasBasico.push({
        descricao: verba.descricao,
        valor: verba.valor,
        explicacao: verba.detalhes,
        tipo: verba.tipo,
      });
    }
  } else {
    // Fallback
    const salario = dadosBase.salarioBrutoMensal;
    if (salario > 0) {
      const saldoSalario = (salario / 30) * 15;
      if (saldoSalario > 0) {
        linhasBasico.push({ descricao: 'Saldo de Salário', valor: saldoSalario, explicacao: 'Dias trabalhados no mês da rescisão', tipo: 'provento' });
      }
      const diasAvisoPrevio = 30 + (Math.floor(mesesTrabalhados / 12) * 3);
      const avisoPrevio = (salario / 30) * Math.min(diasAvisoPrevio, 90);
      if (avisoPrevio > 0 && dadosBase.motivoRescisao !== 'justa_causa') {
        linhasBasico.push({ descricao: 'Aviso Prévio Indenizado', valor: avisoPrevio, explicacao: `${Math.min(diasAvisoPrevio, 90)} dias`, tipo: 'provento' });
      }
      const mesesFerias = mesesTrabalhados % 12 || 12;
      const feriasProporcionais = (salario / 12) * mesesFerias;
      const tercoFerias = feriasProporcionais / 3;
      if (feriasProporcionais > 0) {
        linhasBasico.push({ descricao: 'Férias Proporcionais + 1/3', valor: feriasProporcionais + tercoFerias, explicacao: `${mesesFerias} meses`, tipo: 'provento' });
      }
      let meses13 = 12;
      try { meses13 = new Date(dadosBase.dataDesligamento).getMonth() + 1; } catch {}
      const decimoTerceiro = (salario / 12) * meses13;
      if (decimoTerceiro > 0) {
        linhasBasico.push({ descricao: '13º Salário Proporcional', valor: decimoTerceiro, explicacao: `${meses13}/12 avos`, tipo: 'provento' });
      }
      if (dadosBase.motivoRescisao !== 'justa_causa') {
        const saldoFGTS = dadosBase.saldoFGTS || (salario * 0.08 * mesesTrabalhados);
        const multaFGTS = saldoFGTS * 0.40;
        if (multaFGTS > 0) {
          linhasBasico.push({ descricao: 'Multa de 40% do FGTS', valor: multaFGTS, explicacao: 'Multa rescisória sobre o saldo do FGTS', tipo: 'provento' });
        }
      }
    }
  }

  const totalVerbas = linhasBasico.reduce((acc, linha) => {
    return linha.tipo === 'desconto' ? acc - linha.valor : acc + linha.valor;
  }, 0);
  
  const totalBasicoFinal = verbasOriginais 
    ? (dadosBase.totalBasico > 0 ? dadosBase.totalBasico : totalVerbas)
    : (dadosBase.totalBasico > 0 ? dadosBase.totalBasico : totalVerbas);

  const totalExtrasPeriodo = safeExtras.totalExtrasMensal * mesesTrabalhados;

  // Dados para os upsells — usar props (que vêm do banco) com fallback para sessionStorage
  const emailUsuario = emailProp || sessionStorage.getItem('rescisao-email') || '';
  const calculoId = calculoIdProp || sessionStorage.getItem('rescisao-calculo-id') || '';

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);
      const canvas = await html2canvas(reportRef.current, {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pdfHeight - 20);
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 20);
      }
      pdf.save(`relatorio-rescisao-${new Date().toISOString().split('T')[0]}.pdf`);
      toast({ title: "PDF baixado!", description: "O relatório foi salvo no seu dispositivo." });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({ title: "Erro ao baixar PDF", description: "Tente novamente.", variant: "destructive" });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={reportRef} className="w-full max-w-2xl lg:max-w-4xl mx-auto space-y-4 sm:space-y-6">

      {/* Seção 1: Resumo */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-start gap-3">
            <div className="p-2 sm:p-3 rounded-full bg-primary/10 flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                Relatório de Rescisão
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Análise detalhada dos seus direitos trabalhistas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="p-3 lg:p-5 rounded-lg bg-background border text-center">
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground uppercase tracking-wide">
                Verbas Básicas Totais
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-primary mt-1">
                {formatarMoeda(totalBasicoFinal)}
              </p>
            </div>
             <div className="p-3 lg:p-5 rounded-lg bg-background border text-center">
              <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground uppercase tracking-wide">
                Verbas Extras Totais
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-green-600 dark:text-green-400 mt-1">
                {formatarMoeda(totalExtrasPeriodo)}
              </p>
              <p className="text-[10px] lg:text-xs text-muted-foreground mt-0.5">
                {safeExtras.itensAplicaveis.length} {safeExtras.itensAplicaveis.length === 1 ? 'item' : 'itens'} • {mesesTrabalhados} meses
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Verbas Básicas */}
      <SecaoBasico 
        linhas={linhasBasico} 
        totalBasico={totalBasicoFinal}
        dadosBase={dadosBase}
      />

      {/* Seção 3: Verbas Extras */}
      <SecaoExtras 
        extras={safeExtras} 
        mesesTrabalhados={mesesTrabalhados}
      />

      {/* Seção 4: Upsell - Carta ao RH */}
      <SecaoUpsellCarta
        dadosCarta={{
          dataAdmissao: dadosBase.dataAdmissao,
          dataDesligamento: dadosBase.dataDesligamento,
          tipoDesligamento: dadosBase.motivoRescisao,
          salario: dadosBase.salarioBrutoMensal,
          tempoContrato: calcularTempoContrato(),
          totalBasicas: totalBasicoFinal,
          totalExtras: totalExtrasPeriodo,
          freqHorasExtras: dadosBase.freqHorasExtras,
          desvioFuncaoFreq: dadosBase.desvioFuncaoFreq,
          pagamentoPorFora: dadosBase.pagamentoPorFora,
          adicionaisSelecionados: dadosBase.adicionaisSelecionados,
          suspeitaErroEmpregador: dadosBase.suspeitaErroEmpregador,
          dependentes: dadosBase.dependentes,
          saldoFGTS: dadosBase.saldoFGTS,
        }}
        emailUsuario={emailUsuario}
        calculoId={calculoId}
      />

      {/* Seção 5: Como conferir sua rescisão */}
      <SecaoErros temSuspeitaErro={temSuspeitaErro} temExtras={temExtras} />

      {/* Seção 5.5: Upsell - Checklist de Erros */}
      <SecaoUpsellChecklist
        dadosChecklist={{
          tipoDesligamento: dadosBase.motivoRescisao,
          tempoContrato: calcularTempoContrato(),
          salario: dadosBase.salarioBrutoMensal,
          horasExtras: dadosBase.freqHorasExtras || 'Não informado',
          adicionais: dadosBase.adicionaisSelecionados?.join(', ') || 'Nenhum',
          variaveis: dadosBase.pagamentoPorFora === 'Sim' ? 'Sim' : 'Não',
          totalBasicas: totalBasicoFinal,
          totalExtras: totalExtrasPeriodo,
        }}
        emailUsuario={emailUsuario}
        calculoId={calculoId}
      />

      {/* Seção 6: Próximos passos */}
      <SecaoProximosPassos />

    </div>
  );
}
