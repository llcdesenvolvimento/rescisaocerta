import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RelatorioCompletoV2 } from '@/components/pos-pagamento-v2/relatorio/RelatorioCompletoV2';
import { DadosFluxoAnterior, ResultadoExtras } from '@/types/pos-pagamento-v2';
import { calcularExtras } from '@/lib/calculo-extras';
import { VerbaRescisoria, calcularRescisaoCompleta } from '@/lib/calculadora-rescisao-completa';
import { FormData, TipoAvisoPrevio, TipoDesligamento } from '@/types/rescisao';
import { Footer } from '@/components/layout/Footer';
import { Logo } from '@/components/layout/Logo';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button';
import {
  FormularioPosPagamentoV2 as FormularioPosPagamentoV2Type,
  DadosJornadaV2,
  DadosAdicionaisV2,
  DadosValoresExtrasV2,
} from '@/types/pos-pagamento-v2';

// Mapear frequência para labels amigáveis
function mapFrequencia(valor: string): string {
  const map: Record<string, string> = {
    'sempre': 'Sempre',
    'quase_sempre': 'Quase sempre',
    'vez_em_quando': 'De vez em quando',
    'raramente': 'Raramente',
    'nao_fazia': 'Nunca',
    '': 'Nunca',
  };
  return map[valor] || valor;
}

// Mapear adicionais para labels amigáveis
function mapAdicionais(adicionais: string[]): string[] {
  const map: Record<string, string> = {
    'periculosidade': 'Periculosidade',
    'insalubridade': 'Insalubridade',
    'trabalho_noturno': 'Trabalho noturno',
    'nenhum': 'Nenhum desses',
  };
  return adicionais.map(a => map[a] || a);
}

// Mapear sim/não
function mapSimNao(valor: string): string {
  return valor === 'sim' ? 'Sim' : 'Não';
}

// Mapear frequência de horas extras do quiz para carga real semanal
function mapHorasExtrasParaCargaReal(faziaHorasExtras: string, cargaContratada: number): number {
  const horasExtrasMesMap: Record<string, number> = {
    'vez_em_quando': 8,
    'quase_sempre': 20,
    'sempre': 40,
  };
  const horasExtrasMes = horasExtrasMesMap[faziaHorasExtras] || 0;
  const horasExtrasSemana = horasExtrasMes / 4.3333;
  return cargaContratada + horasExtrasSemana;
}

// Mapear horas noturnas do quiz para horas por semana
function mapHorasNoturnas(horasNoturnasSemana: string): number {
  const map: Record<string, number> = {
    'ate_10': 8,
    '10_a_20': 15,
    '20_a_30': 25,
    'mais_30': 35,
  };
  return map[horasNoturnasSemana] || 0;
}

// Construir FormularioPosPagamentoV2 a partir dos dados do quiz
function buildFormularioFromQuiz(formData: FormData): FormularioPosPagamentoV2Type {
  const cargaContratada = 44; // CLT padrão
  
  const jornada: DadosJornadaV2 = {
    cargaContratadaSemanaH: cargaContratada,
    cargaRealSemanaH: formData.faziaHorasExtras && formData.faziaHorasExtras !== 'nao_fazia'
      ? mapHorasExtrasParaCargaReal(formData.faziaHorasExtras, cargaContratada)
      : cargaContratada,
    bancoHoras: (formData.bancoHoras as 'sim' | 'nao' | 'nao_sei') || 'nao_sei',
    controlePonto: (formData.controlePonto as 'sim' | 'nao' | 'parcial') || 'sim',
  };

  const adicionais: DadosAdicionaisV2 = {
    recebiaAdicionalNoturnoCorretamente: (formData.recebiaAdicionalNoturno as 'sim' | 'nao' | 'nao_sei') || undefined,
    horasNoturnasSemanaH: formData.horasNoturnasSemana ? mapHorasNoturnas(formData.horasNoturnasSemana) : undefined,
    recebiaPericulosidadeCorretamente: (formData.recebiaPericulosidade as 'sim' | 'nao' | 'nao_sei') || undefined,
    grauInsalubridade: (formData.grauInsalubridade as 'minimo' | 'medio' | 'maximo' | 'nao_sei') || undefined,
    recebiaInsalubridadeCorretamente: (formData.recebiaInsalubridade as 'sim' | 'nao' | 'nao_sei') || undefined,
  };

  const valoresExtras: DadosValoresExtrasV2 = {
    valorPorForaMensal: formData.valorPorForaMensal || undefined,
    diferencaSalarialEstimadaMensal: formData.diferencaSalarialEstimada || undefined,
  };

  return { jornada, adicionais, valoresExtras };
}

// Persistir dados do relatório no banco para acesso via link externo
async function persistirRelatorio(
  calculoId: string,
  dados: DadosFluxoAnterior,
  extras: ResultadoExtras,
  verbas: VerbaRescisoria[] | null
) {
  try {
    const conteudo = { dadosFluxoAnterior: dados, resultadoExtras: extras, verbasOriginais: verbas };

    // `relatorios` tem unique (calculo_id, tipo, versao). Upsert evita race
    // condition do StrictMode (dois efeitos disparam, dois INSERTs colidem).
    const { error } = await supabase
      .from('relatorios')
      .upsert(
        {
          calculo_id: calculoId,
          tipo: 'relatorio_completo',
          conteudo: conteudo as never,
          versao: 1,
        },
        { onConflict: 'calculo_id,tipo,versao', ignoreDuplicates: false },
      );
    if (error) console.error('Erro ao upsertar relatório:', error);
  } catch (err) {
    console.error('Erro ao persistir relatório:', err);
  }
}

// Buscar dados do relatório do banco
async function buscarRelatorio(calculoId: string): Promise<{
  dados: DadosFluxoAnterior;
  extras: ResultadoExtras;
  verbas: VerbaRescisoria[] | null;
} | null> {
  try {
    const { data, error } = await supabase
      .from('relatorios')
      .select('conteudo')
      .eq('calculo_id', calculoId)
      .eq('tipo', 'relatorio_completo')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data?.conteudo) return null;

    const payload = data.conteudo as unknown as Record<string, unknown>;
    if (!payload.dadosFluxoAnterior || !payload.resultadoExtras) return null;

    return {
      dados: payload.dadosFluxoAnterior as DadosFluxoAnterior,
      extras: payload.resultadoExtras as ResultadoExtras,
      verbas: (payload.verbasOriginais as VerbaRescisoria[] | null) || null,
    };
  } catch {
    return null;
  }
}

// Gerar relatório a partir dos dados em `calculos` + respostas em `quiz_sessions`.
// Schema novo: respostas do quiz vivem em quiz_sessions.respostas (JSONB),
// e o cálculo em si vive em calculos (com `verbas`, `modulos_extras`, etc.).
async function gerarRelatorioDoCalculo(calculoId: string): Promise<{
  dados: DadosFluxoAnterior;
  extras: ResultadoExtras;
  verbas: VerbaRescisoria[] | null;
  formulario: FormularioPosPagamentoV2Type;
} | null> {
  try {
    const { data: calculo, error } = await supabase
      .from('calculos')
      .select('*')
      .eq('id', calculoId)
      .maybeSingle();

    if (error || !calculo) return null;

    // Busca as respostas do quiz vinculadas
    const { data: quizSession } = await supabase
      .from('quiz_sessions')
      .select('respostas')
      .eq('id', calculo.quiz_session_id)
      .maybeSingle();

    const respostas = (quizSession?.respostas as Record<string, unknown>) || {};

    const salarioFixo = Number(respostas.salarioFixo) || 0;
    const mediaVariavel = respostas.temVariavel ? (Number(respostas.mediaVariavel) || 0) : 0;
    const salarioBruto = salarioFixo + mediaVariavel;

    const adicionaisRaw = Array.isArray(respostas.adicionaisTrabalho)
      ? (respostas.adicionaisTrabalho as string[])
      : [];

    // Recalcular verbas básicas com a versão atual do calculador.
    // Não usamos `calculo.verbas` do banco — esse cache pode ser de uma versão
    // anterior do código (ex.: bug do FGTS pré-correção em 2026-05-10).
    const formData: FormData = {
      situacaoAtual: 'ja_saiu',
      objetivo: 'simular',
      tipoDesligamento: (String(respostas.tipoDesligamento || 'demissao_sem_justa_causa') as TipoDesligamento),
      dataAdmissao: String(respostas.dataAdmissao || ''),
      dataDesligamento: String(respostas.dataDesligamento || ''),
      aindaTrabalhando: false,
      salarioFixo,
      mediaVariavel,
      temVariavel: Boolean(respostas.temVariavel),
      periodosFeriasVencidas: Number(respostas.periodosFeriasVencidas) || 0,
      mesesDesdeUltimaFerias: Number(respostas.mesesDesdeUltimaFerias) || 0,
      mesesTrabalhados2026: Number(respostas.mesesTrabalhados2026) || 0,
      tipoAvisoPrevio: (String(respostas.tipoAvisoPrevio || 'indenizado') as TipoAvisoPrevio),
      anosServico: Number(respostas.anosServico) || 0,
      saldoFGTS: Number(respostas.saldoFGTS) || 0,
      sabeSaldoFGTS: Boolean(respostas.sabeSaldoFGTS),
      numDependentes: Number(respostas.numDependentes) || 0,
      faziaHorasExtras: (String(respostas.faziaHorasExtras || 'nao_fazia') as FormData['faziaHorasExtras']),
      bancoHoras: String(respostas.bancoHoras || ''),
      controlePonto: String(respostas.controlePonto || ''),
      exerciaFuncoesDiferentes: (String(respostas.exerciaFuncoesDiferentes || '') as FormData['exerciaFuncoesDiferentes']),
      funcoesDiferentes: (String(respostas.funcoesDiferentes || 'nao_fazia') as FormData['funcoesDiferentes']),
      diferencaSalarialEstimada: Number(respostas.diferencaSalarialEstimada) || 0,
      valorPorFora: (String(respostas.valorPorFora || 'nao') as FormData['valorPorFora']),
      valorPorForaMensal: Number(respostas.valorPorForaMensal) || 0,
      adicionaisTrabalho: adicionaisRaw as FormData['adicionaisTrabalho'],
      recebiaAdicionalNoturno: String(respostas.recebiaAdicionalNoturno || ''),
      horasNoturnasSemana: String(respostas.horasNoturnasSemana || ''),
      grauInsalubridade: String(respostas.grauInsalubridade || ''),
      recebiaInsalubridade: String(respostas.recebiaInsalubridade || ''),
      recebiaPericulosidade: String(respostas.recebiaPericulosidade || ''),
      erroNaRescisao: (String(respostas.erroNaRescisao || '') as FormData['erroNaRescisao']),
    };

    const resultadoFresco = calcularRescisaoCompleta(formData);

    // Fallback para verbas em cache (ex.: dados de admissão/desligamento ausentes
    // impedem o recálculo). Caso contrário, sempre usar o cálculo fresco.
    let verbas: VerbaRescisoria[] | null = null;
    if (resultadoFresco) {
      verbas = resultadoFresco.verbas;
    } else if (calculo.verbas) {
      try { verbas = calculo.verbas as unknown as VerbaRescisoria[]; } catch {}
    }
    const valorBase = resultadoFresco?.valorBase ?? Number(calculo.valor_base) ?? 0;

    const dados: DadosFluxoAnterior = {
      salarioBrutoMensal: salarioBruto,
      dataAdmissao: String(respostas.dataAdmissao || ''),
      dataDesligamento: String(respostas.dataDesligamento || ''),
      motivoRescisao: String(respostas.tipoDesligamento || 'demissao_sem_justa_causa'),
      dependentes: Number(respostas.numDependentes) || 0,
      saldoFGTS: Number(respostas.saldoFGTS) || 0,
      freqHorasExtras: mapFrequencia(String(respostas.faziaHorasExtras || '')),
      desvioFuncaoFreq: mapFrequencia(String(respostas.funcoesDiferentes || '')),
      pagamentoPorFora: mapSimNao(String(respostas.valorPorFora || 'nao')),
      adicionaisSelecionados: mapAdicionais(adicionaisRaw),
      suspeitaErroEmpregador:
        respostas.erroNaRescisao === 'sim' || respostas.erroNaRescisao === 'talvez' ? 'Sim' : 'Não',
      totalBasico: valorBase,
    };

    // Para calcular extras: estimar carga real semanal e adicionais
    const cargaContratada = 44;
    const cargaReal = respostas.faziaHorasExtras && respostas.faziaHorasExtras !== 'nao_fazia'
      ? mapHorasExtrasParaCargaReal(String(respostas.faziaHorasExtras), cargaContratada)
      : cargaContratada;

    const formPosPagamento: FormularioPosPagamentoV2Type = {
      jornada: {
        cargaContratadaSemanaH: cargaContratada,
        cargaRealSemanaH: cargaReal,
        bancoHoras: (respostas.bancoHoras as 'sim' | 'nao' | 'nao_sei') || 'nao_sei',
        controlePonto: (respostas.controlePonto as 'sim' | 'nao' | 'parcial') || 'sim',
      },
      adicionais: {
        recebiaAdicionalNoturnoCorretamente: (respostas.recebiaAdicionalNoturno as 'sim' | 'nao' | 'nao_sei') || undefined,
        horasNoturnasSemanaH: respostas.horasNoturnasSemana
          ? mapHorasNoturnas(String(respostas.horasNoturnasSemana))
          : undefined,
        recebiaPericulosidadeCorretamente: (respostas.recebiaPericulosidade as 'sim' | 'nao' | 'nao_sei') || undefined,
        grauInsalubridade: (respostas.grauInsalubridade as 'minimo' | 'medio' | 'maximo' | 'nao_sei') || undefined,
        recebiaInsalubridadeCorretamente: (respostas.recebiaInsalubridade as 'sim' | 'nao' | 'nao_sei') || undefined,
      },
      valoresExtras: {
        valorPorForaMensal: Number(respostas.valorPorForaMensal) || undefined,
      },
    };

    const extras = calcularExtras(dados, formPosPagamento);

    persistirRelatorio(calculoId, dados, extras, verbas);

    return { dados, extras, verbas, formulario: formPosPagamento };
  } catch (err) {
    console.error('Erro ao gerar relatório do cálculo:', err);
    return null;
  }
}

export default function Relatorio() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dadosFluxoAnterior, setDadosFluxoAnterior] = useState<DadosFluxoAnterior | null>(null);
  const [resultadoExtras, setResultadoExtras] = useState<ResultadoExtras | null>(null);
  const [verbasOriginais, setVerbasOriginais] = useState<VerbaRescisoria[] | null>(null);
  const [formulario, setFormulario] = useState<FormularioPosPagamentoV2Type | null>(null);
  const [emailUsuario, setEmailUsuario] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [showPaidPopup, setShowPaidPopup] = useState(false);

  // Sem id na URL = sem dados → redirecionar pra home
  useEffect(() => {
    if (!searchParams.get('id')) {
      navigate('/');
    }
  }, [searchParams, navigate]);

  // Popup "Pagamento confirmado!" quando o usuário acabou de pagar.
  // Remove `paid=1` da URL para não disparar de novo em F5.
  useEffect(() => {
    if (searchParams.get('paid') === '1') {
      setShowPaidPopup(true);
      const next = new URLSearchParams(searchParams);
      next.delete('paid');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const carregarDados = async () => {
      const calculoId = searchParams.get('id');
      if (!calculoId) {
        navigate('/');
        return;
      }

      try {
        // SEMPRE gera do cálculo + quiz_session (fonte da verdade).
        // O relatório persistido em `public.relatorios` serve apenas como cache,
        // mas dados zerados de bugs anteriores ainda podem estar lá — então
        // sempre regeramos pra garantir consistência.
        const resultado = await gerarRelatorioDoCalculo(calculoId);

        if (!resultado) {
          // Fallback: tenta ler relatório persistido (último recurso)
          const cached = await buscarRelatorio(calculoId);
          if (cached) {
            setDadosFluxoAnterior(cached.dados);
            setResultadoExtras(cached.extras);
            setVerbasOriginais(cached.verbas);
          } else {
            navigate('/');
            return;
          }
        } else {
          setDadosFluxoAnterior(resultado.dados);
          setResultadoExtras(resultado.extras);
          setVerbasOriginais(resultado.verbas);
          setFormulario(resultado.formulario);
        }

        // Email do comprador (vem da tabela `pagamentos`, não `calculos`)
        try {
          const { data: pagto } = await supabase
            .from('pagamentos')
            .select('email')
            .eq('calculo_id', calculoId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (pagto?.email) setEmailUsuario(pagto.email);
        } catch {}
      } catch (err) {
        console.error('[Relatorio] erro:', err);
        navigate('/');
        return;
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [navigate, searchParams]);

  const handleVoltar = () => {
    navigate('/resultado');
  };

  if (carregando || !dadosFluxoAnterior || !resultadoExtras) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" strokeWidth={2.5} />
          <p className="text-sm font-medium text-muted-foreground">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header fixo */}
      <header className="sticky top-0 z-50 bg-primary shadow-lg">
        <div className="container mx-auto px-4 h-16 sm:h-18 flex items-center justify-center">
          <Logo variant="light" size="md" />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 py-6 px-2 sm:px-4 lg:py-10 lg:px-6">
        <RelatorioCompletoV2
          dadosBase={dadosFluxoAnterior}
          extras={resultadoExtras}
          formulario={formulario || undefined}
          onVoltar={handleVoltar}
          verbasOriginais={verbasOriginais || undefined}
          emailUsuario={emailUsuario}
          calculoId={searchParams.get('id') || ''}
        />
      </main>

      {/* Popup de Pagamento Confirmado */}
      <Dialog open={showPaidPopup} onOpenChange={setShowPaidPopup}>
        <DialogContent className="max-w-sm">
          <VisuallyHidden>
            <DialogTitle>Pagamento confirmado</DialogTitle>
            <DialogDescription>
              Sua análise completa da rescisão foi liberada e enviada para o seu e-mail.
            </DialogDescription>
          </VisuallyHidden>
          <div className="flex flex-col items-center text-center pt-2 pb-1">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-9 h-9 text-green-600" strokeWidth={2.5} />
            </div>
            <p className="text-xl font-extrabold text-foreground">
              Pagamento confirmado!
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Tudo certo! Sua análise completa da rescisão já está liberada abaixo e também foi enviada para o seu e-mail.
            </p>
            <Button
              className="w-full mt-5"
              onClick={() => setShowPaidPopup(false)}
            >
              Ver minha análise
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}
