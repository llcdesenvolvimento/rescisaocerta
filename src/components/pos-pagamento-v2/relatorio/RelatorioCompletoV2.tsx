import React, { useEffect, useRef, useState } from 'react';
import {
  DadosFluxoAnterior,
  ResultadoExtras,
  FormularioPosPagamentoV2,
  defaultDadosJornadaV2,
  defaultDadosAdicionaisV2,
  defaultDadosValoresExtrasV2,
} from '@/types/pos-pagamento-v2';
import { SecaoBasico, LinhaBasico } from './SecaoBasico';
import { SecaoExtras } from './SecaoExtras';
import { SecaoProximosPassos } from './SecaoProximosPassos';
import { SecaoUpsellCarta } from './SecaoUpsellCarta';
import { SecaoUpsellChecklist } from './SecaoUpsellChecklist';
import { FabUpsell } from './FabUpsell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Download, FileText, Loader2, Wallet } from 'lucide-react';
import { formatarMoeda } from '@/lib/calculo-extras';
import { toast } from '@/hooks/use-toast';
import { VerbaRescisoria } from '@/lib/calculadora-rescisao-completa';

interface RelatorioCompletoV2Props {
  dadosBase: DadosFluxoAnterior;
  extras: ResultadoExtras;
  formulario?: FormularioPosPagamentoV2;
  onVoltar: () => void;
  verbasOriginais?: VerbaRescisoria[];
  emailUsuario?: string;
  calculoId?: string;
}

export function RelatorioCompletoV2({
  dadosBase,
  extras,
  formulario,
  onVoltar,
  verbasOriginais,
  emailUsuario: emailProp,
  calculoId: calculoIdProp,
}: RelatorioCompletoV2Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const safeExtras: ResultadoExtras = {
    ...extras,
    totalExtrasMensal: extras.totalExtrasMensal ?? 0,
    itensAplicaveis: extras.itensAplicaveis ?? [],
  };

  // Parse local (evita off-by-one por UTC). Aceita 'YYYY-MM-DD' e Date.
  const parseLocal = (s: string): Date => {
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return new Date(s);
  };

  const calcularMesesTrabalhados = (): number => {
    if (!dadosBase.dataAdmissao || !dadosBase.dataDesligamento) return 12;
    try {
      const admissao = parseLocal(dadosBase.dataAdmissao);
      const desligamento = parseLocal(dadosBase.dataDesligamento);
      let meses =
        (desligamento.getFullYear() - admissao.getFullYear()) * 12 +
        (desligamento.getMonth() - admissao.getMonth());
      if (desligamento.getDate() >= admissao.getDate()) meses += 1; // mês corrente conta
      return Math.max(1, meses);
    } catch {
      return 12;
    }
  };

  const calcularTempoServicoDetalhado = (): string => {
    if (!dadosBase.dataAdmissao || !dadosBase.dataDesligamento) return '';
    try {
      const admissao = parseLocal(dadosBase.dataAdmissao);
      const desligamento = parseLocal(dadosBase.dataDesligamento);
      let anos = desligamento.getFullYear() - admissao.getFullYear();
      let meses = desligamento.getMonth() - admissao.getMonth();
      let dias = desligamento.getDate() - admissao.getDate();
      if (dias < 0) {
        const ultimoDiaMesAnterior = new Date(
          desligamento.getFullYear(),
          desligamento.getMonth(),
          0,
        ).getDate();
        dias += ultimoDiaMesAnterior;
        meses -= 1;
      }
      if (meses < 0) {
        meses += 12;
        anos -= 1;
      }
      const partes: string[] = [];
      if (anos > 0) partes.push(`${anos} ano${anos > 1 ? 's' : ''}`);
      if (meses > 0) partes.push(`${meses} ${meses > 1 ? 'meses' : 'mês'}`);
      if (dias > 0 || partes.length === 0) partes.push(`${dias} dia${dias !== 1 ? 's' : ''}`);
      return partes.join(', ');
    } catch {
      return '';
    }
  };

  const calcularTempoContrato = (): string => {
    // Versão curta usada pelos upsells (sem dias).
    if (!dadosBase.dataAdmissao || !dadosBase.dataDesligamento) return '';
    try {
      const admissao = parseLocal(dadosBase.dataAdmissao);
      const desligamento = parseLocal(dadosBase.dataDesligamento);
      let anos = desligamento.getFullYear() - admissao.getFullYear();
      let meses = desligamento.getMonth() - admissao.getMonth();
      if (desligamento.getDate() < admissao.getDate()) meses -= 1;
      if (meses < 0) {
        meses += 12;
        anos -= 1;
      }
      let resultado = '';
      if (anos > 0) resultado += `${anos} ano${anos > 1 ? 's' : ''} e `;
      resultado += `${meses} ${meses !== 1 ? 'meses' : 'mês'}`;
      return resultado;
    } catch {
      return '';
    }
  };

  const formatarDataPtBr = (data: string): string => {
    if (!data) return '—';
    try {
      return parseLocal(data).toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  };

  const tempoServicoDetalhado = calcularTempoServicoDetalhado();

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

  const totalGeral = totalBasicoFinal + totalExtrasPeriodo;
  const dataEmissao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const formularioEfetivo: FormularioPosPagamentoV2 = formulario ?? {
    jornada: defaultDadosJornadaV2,
    adicionais: defaultDadosAdicionaisV2,
    valoresExtras: defaultDadosValoresExtrasV2,
  };

  return (
    <div ref={reportRef} className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-5 px-0">

      {/* ============ DADOS DO CONTRATO (card azul, topo) ============ */}
      <section className="bg-primary rounded-3xl shadow-sm overflow-hidden text-primary-foreground">
        <div className="px-5 sm:px-7 py-5">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-primary-foreground/70">
            Dados do contrato
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ContratoMetadata icon={Calendar} label="Admissão" value={formatarDataPtBr(dadosBase.dataAdmissao)} variant="onPrimary" />
            <ContratoMetadata icon={Calendar} label="Desligamento" value={formatarDataPtBr(dadosBase.dataDesligamento)} variant="onPrimary" />
            <ContratoMetadata icon={Clock} label="Tempo de serviço" value={tempoServicoDetalhado || '—'} variant="onPrimary" />
            <ContratoMetadata icon={Wallet} label="Salário base" value={formatarMoeda(dadosBase.salarioBrutoMensal)} variant="onPrimary" />
          </div>
        </div>
      </section>

      {/* ============ CAPA ============ */}
      <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 sm:px-7 pt-6 pb-5">
          {/* Cabeçalho discreto */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-primary" />
              <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.18em]">
                Relatório de Rescisão
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground">{dataEmissao}</span>
          </div>

          {/* Título principal */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            <span className="text-primary">Análise Completa</span> da sua Rescisão Trabalhista
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-2xl">
            Detalhamento de cada verba que você tem direito a receber, com base na CLT 2026.
          </p>
        </div>

        {/* Faixa de totais */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-border">
          <div className="px-5 sm:px-7 py-5 border-b sm:border-b-0 sm:border-r border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Verbas básicas
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-success mt-1 tabular-nums">
              {formatarMoeda(totalBasicoFinal)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {linhasBasico.length} {linhasBasico.length === 1 ? 'item' : 'itens'}
            </p>
          </div>
          <div className="px-5 sm:px-7 py-5 border-b sm:border-b-0 sm:border-r border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Verbas extras
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-primary mt-1 tabular-nums">
              {formatarMoeda(totalExtrasPeriodo)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {safeExtras.itensAplicaveis.length} {safeExtras.itensAplicaveis.length === 1 ? 'item' : 'itens'} · {mesesTrabalhados} meses
            </p>
          </div>
          <div className="px-5 sm:px-7 py-5 bg-muted/30">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Total a receber
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 tabular-nums">
              {formatarMoeda(totalGeral)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Básicas + extras
            </p>
          </div>
        </div>
      </section>

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
        dadosBase={dadosBase}
        formulario={formularioEfetivo}
      />

      {/* Título dos upsells */}
      <div id="upsells" className="px-5 sm:px-7 pt-8 sm:pt-12 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em]">
          Recomendados para você
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight mt-3">
          Torne sua rescisão<br className="sm:hidden" /> <span className="text-primary">ainda mais fácil</span>
        </h2>
        <p className="text-[13px] sm:text-[15px] text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
          Ferramentas prontas pra te ajudar a cobrar a empresa e garantir o que é seu, sem complicação.
        </p>
      </div>

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

      {/* FAB flutuante para upsells */}
      <FabUpsell />

    </div>
  );
}

function ContratoMetadata({
  icon: Icon,
  label,
  value,
  variant = 'default',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  variant?: 'default' | 'onPrimary';
}) {
  const onPrimary = variant === 'onPrimary';
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3 h-3 ${onPrimary ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`} />
        <p className={`text-[10px] uppercase tracking-wider ${onPrimary ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {label}
        </p>
      </div>
      <p className={`text-xs sm:text-sm font-bold tabular-nums break-words ${onPrimary ? 'text-primary-foreground' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}
