import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RelatorioCompletoV2 } from '@/components/pos-pagamento-v2/relatorio/RelatorioCompletoV2';
import { DadosFluxoAnterior, ResultadoExtras } from '@/types/pos-pagamento-v2';
import { calcularExtras } from '@/lib/calculo-extras';
import { calcularRescisaoCompleta, VerbaRescisoria } from '@/lib/calculadora-rescisao-completa';
import { FormData } from '@/types/rescisao';
import { Footer } from '@/components/layout/Footer';
import { Logo } from '@/components/layout/Logo';
import { supabase } from '@/integrations/supabase/client';
import {
  FormularioPosPagamentoV2 as FormularioPosPagamentoV2Type,
  DadosJornadaV2,
  DadosAdicionaisV2,
  DadosValoresExtrasV2,
} from '@/types/pos-pagamento-v2';

const STORAGE_KEY = 'rescisao-calculator-form';

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
    const payload = { dadosFluxoAnterior: dados, resultadoExtras: extras, verbasOriginais: verbas };
    
    // Upsert: se já existe para esse calculo_id, atualiza
    const { error } = await supabase
      .from('relatorios')
      .upsert(
        { calculo_id: calculoId, relatorio_ai: payload as any },
        { onConflict: 'calculo_id' }
      );
    
    if (error) {
      console.error('Erro ao persistir relatório:', error);
    }
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
      .select('relatorio_ai')
      .eq('calculo_id', calculoId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error || !data?.relatorio_ai) return null;
    
    const payload = data.relatorio_ai as any;
    if (!payload.dadosFluxoAnterior || !payload.resultadoExtras) return null;
    
    return {
      dados: payload.dadosFluxoAnterior,
      extras: payload.resultadoExtras,
      verbas: payload.verbasOriginais || null,
    };
  } catch {
    return null;
  }
}

// Gerar relatório a partir dos dados da tabela calculos (fallback quando não há relatorio nem sessionStorage)
async function gerarRelatorioDoCalculo(calculoId: string): Promise<{
  dados: DadosFluxoAnterior;
  extras: ResultadoExtras;
  verbas: VerbaRescisoria[] | null;
} | null> {
  try {
    const { data, error } = await supabase
      .from('calculos')
      .select('*')
      .eq('id', calculoId)
      .maybeSingle();

    if (error || !data) return null;

    const salario = Number(data.salario_fixo) || 0;
    const mediaVariavel = data.tem_variavel ? (Number(data.media_variavel) || 0) : 0;
    const valorBase = Number(data.valor_base) || Number(data.calc_total_liquido) || 0;

    const dados: DadosFluxoAnterior = {
      salarioBrutoMensal: salario + mediaVariavel,
      dataAdmissao: data.data_admissao || '',
      dataDesligamento: data.data_desligamento || '',
      motivoRescisao: data.tipo_desligamento || 'demissao_sem_justa_causa',
      dependentes: data.num_dependentes || 0,
      saldoFGTS: Number(data.saldo_fgts) || 0,
      freqHorasExtras: mapFrequencia(data.fazia_horas_extras || ''),
      desvioFuncaoFreq: mapFrequencia(data.funcoes_diferentes || ''),
      pagamentoPorFora: mapSimNao(data.valor_por_fora || 'nao'),
      adicionaisSelecionados: mapAdicionais(data.adicionais_trabalho || []),
      suspeitaErroEmpregador: data.erro_na_rescisao === 'sim' || data.erro_na_rescisao === 'talvez' ? 'Sim' : 'Não',
      totalBasico: valorBase,
    };

    // Reconstruir verbas se os campos calculados existirem
    let verbas: VerbaRescisoria[] | null = null;
    if (data.itens_verbas) {
      try { verbas = data.itens_verbas as unknown as VerbaRescisoria[]; } catch {}
    }

    // Gerar extras com defaults razoáveis
    const cargaContratada = 44;
    const cargaReal = data.fazia_horas_extras && data.fazia_horas_extras !== 'nao_fazia'
      ? cargaContratada + 8 // estimativa conservadora
      : cargaContratada;

    const formPosPagamento: FormularioPosPagamentoV2Type = {
      jornada: {
        cargaContratadaSemanaH: cargaContratada,
        cargaRealSemanaH: cargaReal,
        bancoHoras: 'nao_sei',
        controlePonto: 'sim',
      },
      adicionais: {},
      valoresExtras: {},
    };

    const extras = calcularExtras(dados, formPosPagamento);

    // Persistir para próximos acessos
    persistirRelatorio(calculoId, dados, extras, verbas);

    return { dados, extras, verbas };
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
  const [emailUsuario, setEmailUsuario] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Adicionar calculo_id real na URL se não existir
  useEffect(() => {
    if (!searchParams.get('id')) {
      // Priorizar o calculo_id real do sessionStorage (vinculado ao registro no banco)
      const calculoId = sessionStorage.getItem('rescisao-calculo-id');
      if (calculoId) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set('id', calculoId);
          return next;
        }, { replace: true });
      } else {
        // Sem calculo_id = sem dados → redirecionar
        navigate('/');
      }
    }
  }, [searchParams, setSearchParams, navigate]);

  useEffect(() => {
    const carregarDados = async () => {
      const calculoId = searchParams.get('id');
      
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        const valorBaseStr = sessionStorage.getItem('rescisao-valor-base-original');
        const verbasStr = sessionStorage.getItem('rescisao-verbas-resultado');
        
        if (saved) {
          // ---- Caminho 1: dados no sessionStorage (fluxo normal) ----
          const formData: FormData = JSON.parse(saved);
          
          let verbas: VerbaRescisoria[] | null = null;
          let valorBase = valorBaseStr ? parseFloat(valorBaseStr) : 0;
          
          if (verbasStr) {
            try { verbas = JSON.parse(verbasStr); } catch {}
          }
          
          if (!verbas && formData.salarioFixo && formData.dataAdmissao && formData.dataDesligamento && formData.tipoDesligamento) {
            const resultado = calcularRescisaoCompleta(formData);
            verbas = resultado.verbas;
            valorBase = resultado.valorBase;
          }
          
          setVerbasOriginais(verbas);
          
          const dados: DadosFluxoAnterior = {
            salarioBrutoMensal: formData.salarioFixo + (formData.temVariavel ? formData.mediaVariavel : 0),
            dataAdmissao: formData.dataAdmissao,
            dataDesligamento: formData.dataDesligamento,
            motivoRescisao: formData.tipoDesligamento,
            dependentes: formData.numDependentes >= 0 ? formData.numDependentes : 0,
            saldoFGTS: formData.saldoFGTS || 0,
            freqHorasExtras: mapFrequencia(formData.faziaHorasExtras),
            desvioFuncaoFreq: mapFrequencia(formData.funcoesDiferentes),
            pagamentoPorFora: mapSimNao(formData.valorPorFora),
            adicionaisSelecionados: mapAdicionais(formData.adicionaisTrabalho || []),
            suspeitaErroEmpregador: formData.erroNaRescisao === 'sim' || formData.erroNaRescisao === 'talvez' ? 'Sim' : 'Não',
            totalBasico: valorBase,
          };
          
          setDadosFluxoAnterior(dados);
          setEmailUsuario(sessionStorage.getItem('rescisao-email') || '');

          const formPosPagamento = buildFormularioFromQuiz(formData);
          const extras = calcularExtras(dados, formPosPagamento);
          setResultadoExtras(extras);
          
          // Persistir no banco para acesso via link externo
          if (calculoId) {
            persistirRelatorio(calculoId, dados, extras, verbas);
          }
        } else if (calculoId) {
          // ---- Caminho 2: sem sessionStorage, buscar do banco (link externo) ----
          let resultado = await buscarRelatorio(calculoId);
          
          // ---- Caminho 3: sem relatório no banco, gerar a partir dos dados do cálculo ----
          if (!resultado) {
            resultado = await gerarRelatorioDoCalculo(calculoId);
          }
          
          if (resultado) {
            setDadosFluxoAnterior(resultado.dados);
            setResultadoExtras(resultado.extras);
            setVerbasOriginais(resultado.verbas);
            // Buscar email do banco para uso nos upsells
            try {
              const { data: calcData } = await supabase
                .from('calculos')
                .select('email')
                .eq('id', calculoId)
                .maybeSingle();
              if (calcData?.email) {
                setEmailUsuario(calcData.email);
              }
            } catch {}
          } else {
            navigate('/');
            return;
          }
        } else {
          navigate('/');
          return;
        }
      } catch {
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
        <p className="text-muted-foreground">Carregando relatório...</p>
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
      <main className="flex-1 py-8 px-4 lg:py-12 lg:px-8">
        <RelatorioCompletoV2 
          dadosBase={dadosFluxoAnterior} 
          extras={resultadoExtras}
          onVoltar={handleVoltar}
          verbasOriginais={verbasOriginais || undefined}
          emailUsuario={emailUsuario}
          calculoId={searchParams.get('id') || ''}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
