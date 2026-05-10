// ===============================================
// MOTOR DE CÁLCULO DE EXTRAS
// ===============================================

import {
  FormularioPosPagamentoV2,
  DadosFluxoAnterior,
  ResultadoExtras,
  ItemExtra,
  SALARIO_MINIMO_2026,
  SEMANAS_POR_MES,
} from '@/types/pos-pagamento-v2';

export function calcularExtras(
  dadosBase: DadosFluxoAnterior,
  formulario: FormularioPosPagamentoV2
): ResultadoExtras {
  const { jornada, adicionais, valoresExtras } = formulario;
  const salario = dadosBase.salarioBrutoMensal;
  
  // Cálculos base
  const horasMes = jornada.cargaContratadaSemanaH * SEMANAS_POR_MES;
  const valorHora = salario / horasMes;

  const itensAplicaveis: ItemExtra[] = [];
  let totalExtrasMensal = 0;

  // Calcular horas extras automaticamente (carga real - carga contratada)
  const horasExtrasSemana = Math.max(0, jornada.cargaRealSemanaH - jornada.cargaContratadaSemanaH);

  // 3.1 Horas extras (R$)
  let horasExtras: ItemExtra | null = null;
  if (horasExtrasSemana > 0) {
    if (jornada.bancoHoras === 'sim') {
      horasExtras = {
        nome: 'Horas Extras',
        valorMensal: 0,
        condicao: 'Pode depender de compensação/banco de horas',
        isEstimativa: false,
      };
    } else {
      const horasExtrasMes = horasExtrasSemana * SEMANAS_POR_MES;
      const valorHoraExtra = valorHora * 1.5; // 50% adicional
      const valorExtrasHoras = horasExtrasMes * valorHoraExtra;
      
      horasExtras = {
        nome: 'Horas Extras',
        valorMensal: valorExtrasHoras,
        condicao: jornada.bancoHoras === 'nao_sei' 
          ? 'Verificar se há banco de horas' 
          : undefined,
        isEstimativa: jornada.bancoHoras === 'nao_sei',
      };
      
      if (valorExtrasHoras > 0) {
        itensAplicaveis.push(horasExtras);
        totalExtrasMensal += valorExtrasHoras;
      }
    }
  }

  // 3.2 Adicional noturno (R$)
  let adicionalNoturno: ItemExtra | null = null;
  const temTrabalhoNoturno = dadosBase.adicionaisSelecionados.some(
    a => a.toLowerCase().includes('noturno')
  );
  
  if (temTrabalhoNoturno && adicionais.recebiaAdicionalNoturnoCorretamente !== 'sim') {
    const horasNoturnasMes = (adicionais.horasNoturnasSemanaH || 0) * SEMANAS_POR_MES;
    const valorAdicionalNoturno = horasNoturnasMes * (valorHora * 0.2); // 20% adicional
    
    adicionalNoturno = {
      nome: 'Adicional Noturno',
      valorMensal: valorAdicionalNoturno,
      condicao: adicionais.recebiaAdicionalNoturnoCorretamente === 'nao_sei'
        ? 'Verificar holerites para confirmar'
        : undefined,
      isEstimativa: adicionais.recebiaAdicionalNoturnoCorretamente === 'nao_sei',
    };
    
    if (valorAdicionalNoturno > 0) {
      itensAplicaveis.push(adicionalNoturno);
      totalExtrasMensal += valorAdicionalNoturno;
    }
  }

  // 3.3 Periculosidade (R$)
  let periculosidade: ItemExtra | null = null;
  const temPericulosidade = dadosBase.adicionaisSelecionados.some(
    a => a.toLowerCase().includes('periculosidade')
  );
  
  if (temPericulosidade && adicionais.recebiaPericulosidadeCorretamente !== 'sim') {
    const valorPericulosidade = salario * 0.30; // 30% sobre salário-base
    
    periculosidade = {
      nome: 'Periculosidade',
      valorMensal: valorPericulosidade,
      condicao: adicionais.recebiaPericulosidadeCorretamente === 'nao_sei'
        ? 'Verificar se já recebia corretamente'
        : undefined,
      isEstimativa: adicionais.recebiaPericulosidadeCorretamente === 'nao_sei',
    };
    
    itensAplicaveis.push(periculosidade);
    totalExtrasMensal += valorPericulosidade;
  }

  // 3.4 Insalubridade (R$)
  let insalubridade: ItemExtra | null = null;
  const temInsalubridade = dadosBase.adicionaisSelecionados.some(
    a => a.toLowerCase().includes('insalubridade')
  );
  
  if (temInsalubridade && adicionais.recebiaInsalubridadeCorretamente !== 'sim') {
    let percentual = 0.20; // Default: médio
    switch (adicionais.grauInsalubridade) {
      case 'minimo':
        percentual = 0.10;
        break;
      case 'medio':
        percentual = 0.20;
        break;
      case 'maximo':
        percentual = 0.40;
        break;
      case 'nao_sei':
      default:
        percentual = 0.20;
    }
    
    const valorInsalubridade = SALARIO_MINIMO_2026 * percentual;
    
    insalubridade = {
      nome: 'Insalubridade',
      valorMensal: valorInsalubridade,
      condicao: adicionais.grauInsalubridade === 'nao_sei' || adicionais.recebiaInsalubridadeCorretamente === 'nao_sei'
        ? 'Grau estimado como médio (20%)'
        : `Grau ${adicionais.grauInsalubridade} (${percentual * 100}%)`,
      isEstimativa: adicionais.grauInsalubridade === 'nao_sei' || adicionais.recebiaInsalubridadeCorretamente === 'nao_sei',
    };
    
    itensAplicaveis.push(insalubridade);
    totalExtrasMensal += valorInsalubridade;
  }

  // 3.5 Pagamento "por fora" (R$)
  let porFora: ItemExtra | null = null;
  if (dadosBase.pagamentoPorFora?.toLowerCase() === 'sim' && (valoresExtras.valorPorForaMensal || 0) > 0) {
    const valorPorFora = valoresExtras.valorPorForaMensal || 0;
    
    porFora = {
      nome: 'Pagamento "Por Fora"',
      valorMensal: valorPorFora,
      condicao: 'Impacto potencial em FGTS, 13º e férias',
      isEstimativa: false,
    };
    
    itensAplicaveis.push(porFora);
    totalExtrasMensal += valorPorFora;
  }

  // 3.6 Desvio de função (R$)
  let desvioFuncao: ItemExtra | null = null;
  const temDesvioFuncao = dadosBase.desvioFuncaoFreq?.toLowerCase() !== 'nunca' && 
                          dadosBase.desvioFuncaoFreq !== '';
  
  if (temDesvioFuncao && (valoresExtras.diferencaSalarialEstimadaMensal || 0) > 0) {
    const valorDesvio = valoresExtras.diferencaSalarialEstimadaMensal || 0;
    
    desvioFuncao = {
      nome: 'Desvio de Função',
      valorMensal: valorDesvio,
      condicao: 'Diferença salarial estimada para o cargo real',
      isEstimativa: true,
    };
    
    itensAplicaveis.push(desvioFuncao);
    totalExtrasMensal += valorDesvio;
  }

  return {
    horasExtras,
    adicionalNoturno,
    periculosidade,
    insalubridade,
    porFora,
    desvioFuncao,
    totalExtrasMensal,
    itensAplicaveis,
  };
}

// Formatar valor em reais
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}
