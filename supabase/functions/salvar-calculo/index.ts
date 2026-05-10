import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface FormularioInicial {
  tipoDesligamento: string;
  dataAdmissao: string;
  dataDesligamento: string;
  aindaTrabalhando: boolean;
  salarioFixo: number;
  mediaVariavel: number;
  temVariavel: boolean;
  // Novos campos 2026
  periodosFeriasVencidas: number;
  mesesDesdeUltimaFerias: number;
  mesesTrabalhados2026: number;
  tipoAvisoPrevio: string;
  anosServico: number;
  saldoFGTS: number;
  numDependentes: number;
  // Oportunidades
  faziaHorasExtras: string;
  funcoesDiferentes: string;
  valorPorFora: string;
  adicionaisTrabalho: string[];
  erroNaRescisao: string;
}

interface ResultadoDetalhado {
  saldoSalario: number;
  diasTrabalhadosMes: number;
  avisoPrevio: number;
  diasAvisoPrevio: number;
  feriasVencidas: number;
  tercoFeriasVencidas: number;
  feriasProporcionais: number;
  tercoFeriasProporcionais: number;
  decimoTerceiro: number;
  multaFGTS: number;
  totalBruto: number;
  descontoINSS: number;
  descontoIRRF: number;
  totalLiquido: number;
}

interface SalvarCalculoRequest {
  formulario: FormularioInicial;
  valorBase: number;
  detalhamento?: ResultadoDetalhado;
}

function generateUniqueCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 2) {
    const [month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-01`;
  }
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formulario, valorBase, detalhamento } = await req.json() as SalvarCalculoRequest;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Gerar código único
    let codigoUnico = generateUniqueCode();
    let attempts = 0;
    
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('calculos')
        .select('id')
        .eq('codigo_unico', codigoUnico)
        .maybeSingle();
      
      if (!existing) break;
      codigoUnico = generateUniqueCode();
      attempts++;
    }

    const dataAdmissao = parseDate(formulario?.dataAdmissao);
    const dataDesligamento = parseDate(formulario?.dataDesligamento);

    // Inserir registro de cálculo com todos os campos
    const insertData: Record<string, unknown> = {
      codigo_unico: codigoUnico,
      tipo_desligamento: formulario?.tipoDesligamento || null,
      data_admissao: dataAdmissao,
      data_desligamento: dataDesligamento,
      ainda_trabalhando: formulario?.aindaTrabalhando || false,
      salario_fixo: formulario?.salarioFixo || 0,
      media_variavel: formulario?.mediaVariavel || 0,
      tem_variavel: formulario?.temVariavel || false,
      // Novos campos 2026
      periodos_ferias_vencidas: formulario?.periodosFeriasVencidas || 0,
      meses_desde_ultima_ferias: formulario?.mesesDesdeUltimaFerias || 0,
      meses_trabalhados_2026: formulario?.mesesTrabalhados2026 || 0,
      tipo_aviso_previo: formulario?.tipoAvisoPrevio || null,
      anos_servico: formulario?.anosServico || 0,
      saldo_fgts: formulario?.saldoFGTS || 0,
      num_dependentes: formulario?.numDependentes || 0,
      // Oportunidades
      fazia_horas_extras: formulario?.faziaHorasExtras || null,
      funcoes_diferentes: formulario?.funcoesDiferentes || null,
      valor_por_fora: formulario?.valorPorFora || null,
      adicionais_trabalho: formulario?.adicionaisTrabalho || [],
      erro_na_rescisao: formulario?.erroNaRescisao || null,
      valor_base: valorBase || 0,
      status: 'pendente',
    };

    // Adicionar campos de detalhamento se disponíveis
    if (detalhamento) {
      insertData.calc_saldo_salario = detalhamento.saldoSalario || 0;
      insertData.calc_dias_trabalhados_mes = detalhamento.diasTrabalhadosMes || 0;
      insertData.calc_aviso_previo = detalhamento.avisoPrevio || 0;
      insertData.calc_dias_aviso_previo = detalhamento.diasAvisoPrevio || 0;
      insertData.calc_ferias_vencidas = detalhamento.feriasVencidas || 0;
      insertData.calc_terco_ferias_vencidas = detalhamento.tercoFeriasVencidas || 0;
      insertData.calc_ferias_proporcionais = detalhamento.feriasProporcionais || 0;
      insertData.calc_terco_ferias_proporcionais = detalhamento.tercoFeriasProporcionais || 0;
      insertData.calc_decimo_terceiro = detalhamento.decimoTerceiro || 0;
      insertData.calc_multa_fgts = detalhamento.multaFGTS || 0;
      insertData.calc_total_bruto = detalhamento.totalBruto || 0;
      insertData.calc_desconto_inss = detalhamento.descontoINSS || 0;
      insertData.calc_desconto_irrf = detalhamento.descontoIRRF || 0;
      insertData.calc_total_liquido = detalhamento.totalLiquido || 0;
    }

    const { data: calculo, error: calculoError } = await supabase
      .from('calculos')
      .insert(insertData)
      .select()
      .single();

    if (calculoError) {
      console.error('Error inserting calculo:', calculoError);
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar dados', details: calculoError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        calculoId: calculo.id,
        codigoUnico: codigoUnico
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
