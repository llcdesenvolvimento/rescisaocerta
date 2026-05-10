import { FormData, ResultadoCalculo, LinhaResultado, ResultadoDetalhado } from '@/types/rescisao';

// ============================================================================
// CONSTANTES INSS E IRRF 2026 (Brasil)
// ============================================================================

// Faixas INSS progressivo
const FAIXAS_INSS = [
  { limite: 1518.00, aliquota: 0.075 },  // até 1 salário mínimo
  { limite: 2793.88, aliquota: 0.09 },   // até ~2 salários mínimos
  { limite: 4190.83, aliquota: 0.12 },   // até ~2.8 salários mínimos
  { limite: 8157.41, aliquota: 0.14 },   // teto INSS
];

// Faixas IRRF progressivo
const FAIXAS_IRRF = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

const DEDUCAO_POR_DEPENDENTE = 189.59;

// ============================================================================
// FUNÇÕES DE CÁLCULO INSS/IRRF
// ============================================================================

/**
 * Calcula INSS progressivo (alíquotas por faixa)
 */
export function calcularINSS(baseCalculo: number): number {
  let inss = 0;
  let valorRestante = baseCalculo;
  let limiteAnterior = 0;
  
  for (const faixa of FAIXAS_INSS) {
    if (valorRestante <= 0) break;
    
    const baseFaixa = Math.min(valorRestante, faixa.limite - limiteAnterior);
    inss += baseFaixa * faixa.aliquota;
    valorRestante -= baseFaixa;
    limiteAnterior = faixa.limite;
  }
  
  return Math.round(inss * 100) / 100;
}

/**
 * Calcula IRRF progressivo com dedução por dependentes
 */
export function calcularIRRF(baseCalculo: number, inss: number, numDependentes: number): number {
  const deducaoDependentes = numDependentes * DEDUCAO_POR_DEPENDENTE;
  const baseIRRF = baseCalculo - inss - deducaoDependentes;
  
  if (baseIRRF <= 0) return 0;
  
  for (const faixa of FAIXAS_IRRF) {
    if (baseIRRF <= faixa.limite) {
      const irrf = (baseIRRF * faixa.aliquota) - faixa.deducao;
      return Math.max(0, Math.round(irrf * 100) / 100);
    }
  }
  
  return 0;
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

export function calcularRemuneracao(salarioFixo: number, mediaVariavel: number): number {
  return salarioFixo + mediaVariavel;
}

export function calcularSalarioDia(remuneracao: number): number {
  return remuneracao / 30;
}

function getTipoRescisaoInterno(tipoDesligamento: string): 'sem_justa_causa' | 'pedido_demissao' | 'justa_causa' | 'acordo_484a' | 'termino_contrato' | 'termino_antecipado_empregador' | 'termino_antecipado_empregado' | null {
  switch (tipoDesligamento) {
    case 'demissao_sem_justa_causa':
    case 'rescisao_indireta':
      return 'sem_justa_causa';
    case 'pedido_demissao':
      return 'pedido_demissao';
    case 'justa_causa':
      return 'justa_causa';
    case 'acordo':
      return 'acordo_484a';
    case 'termino_contrato':
      return 'termino_contrato';
    case 'termino_antecipado_empregador':
      return 'termino_antecipado_empregador';
    case 'termino_antecipado_empregado':
      return 'termino_antecipado_empregado';
    default:
      return null;
  }
}

export function calcularDiasTrabalhadosMes(dataDesligamento: string): number {
  if (!dataDesligamento) return 0;
  const data = new Date(dataDesligamento);
  return data.getDate();
}

/**
 * Calcula dias de aviso prévio: 30 + 3 por ano completo (máx 90)
 */
function calcularDiasAvisoPrevio(anosServico: number): number {
  return Math.min(90, 30 + (anosServico * 3));
}

// ============================================================================
// CÁLCULO PRINCIPAL DA RESCISÃO 2026
// ============================================================================

export function calcularRescisao(formData: FormData): ResultadoCalculo {
  const remuneracao = calcularRemuneracao(
    formData.salarioFixo, 
    formData.temVariavel ? formData.mediaVariavel : 0
  );
  const salarioDia = calcularSalarioDia(remuneracao);
  const tipoRescisao = getTipoRescisaoInterno(formData.tipoDesligamento);
  
  const linhas: LinhaResultado[] = [];
  
  // Inicializar detalhamento
  const detalhamento: ResultadoDetalhado = {
    saldoSalario: 0,
    diasTrabalhadosMes: 0,
    avisoPrevio: 0,
    diasAvisoPrevio: 0,
    feriasVencidas: 0,
    tercoFeriasVencidas: 0,
    feriasProporcionais: 0,
    tercoFeriasProporcionais: 0,
    decimoTerceiro: 0,
    multaFGTS: 0,
    totalBruto: 0,
    descontoINSS: 0,
    descontoIRRF: 0,
    totalLiquido: 0,
  };
  
  // ================================================================
  // 1. SALDO DE SALÁRIO
  // Fórmula: (salário ÷ 30) × dias trabalhados no mês da demissão
  // ================================================================
  const diasTrabalhados = formData.dataDesligamento ? calcularDiasTrabalhadosMes(formData.dataDesligamento) : 0;
  detalhamento.diasTrabalhadosMes = diasTrabalhados;
  
  if (diasTrabalhados > 0) {
    const saldoSalario = salarioDia * diasTrabalhados;
    detalhamento.saldoSalario = saldoSalario;
    linhas.push({
      descricao: `Saldo de salário (${diasTrabalhados} dias)`,
      valor: saldoSalario,
      tipo: 'provento',
      exibir: true,
    });
  }
  
  // ================================================================
  // 2. AVISO PRÉVIO
  // Fórmula: 30 dias + 3 dias × anos completos (máx 90)
  // Acordo = metade | Pedido demissão = desconto se não cumprido
  // ================================================================
  const diasAviso = calcularDiasAvisoPrevio(formData.anosServico);
  detalhamento.diasAvisoPrevio = diasAviso;
  
  const temDireitoAvisoPrevio = 
    tipoRescisao === 'sem_justa_causa' || 
    tipoRescisao === 'acordo_484a';
  
  if (temDireitoAvisoPrevio && (formData.tipoAvisoPrevio === 'indenizado' || formData.tipoAvisoPrevio === 'metade')) {
    let valorAviso = salarioDia * diasAviso;
    
    // Acordo ou metade: 50% do aviso
    if (tipoRescisao === 'acordo_484a' || formData.tipoAvisoPrevio === 'metade') {
      valorAviso = valorAviso / 2;
      linhas.push({
        descricao: `Aviso prévio indenizado (50% de ${diasAviso} dias)`,
        valor: valorAviso,
        tipo: 'provento',
        exibir: true,
      });
    } else {
      linhas.push({
        descricao: `Aviso prévio indenizado (${diasAviso} dias)`,
        valor: valorAviso,
        tipo: 'provento',
        exibir: true,
      });
    }
    
    detalhamento.avisoPrevio = valorAviso;
  }
  
  // Desconto para pedido de demissão sem cumprimento
  if (tipoRescisao === 'pedido_demissao' && formData.tipoAvisoPrevio === 'nao_cumprido') {
    const descontoAviso = salarioDia * 30; // 30 dias fixos
    linhas.push({
      descricao: 'Desconto aviso prévio não cumprido (30 dias)',
      valor: descontoAviso,
      tipo: 'desconto',
      exibir: true,
    });
  }
  
  // ================================================================
  // 3. FÉRIAS VENCIDAS + 1/3
  // Fórmula: salário + 1/3 por período (em dobro se > 1 período)
  // ================================================================
  const inclui13 = tipoRescisao !== 'justa_causa';
  const incluiFeriasProporcionais = tipoRescisao !== 'justa_causa';
  
  if (formData.periodosFeriasVencidas > 0) {
    const feriasBase = remuneracao * formData.periodosFeriasVencidas;
    const tercoVencidas = feriasBase / 3;
    
    // Se mais de 1 período, pagar em dobro
    let feriasVencidas = feriasBase;
    if (formData.periodosFeriasVencidas > 1) {
      feriasVencidas = feriasBase * 2; // Dobro
    }
    
    detalhamento.feriasVencidas = feriasVencidas;
    detalhamento.tercoFeriasVencidas = tercoVencidas;
    
    linhas.push({
      descricao: `Férias vencidas (${formData.periodosFeriasVencidas} período${formData.periodosFeriasVencidas > 1 ? 's' : ''})`,
      valor: feriasVencidas,
      tipo: 'provento',
      exibir: true,
    });
    linhas.push({
      descricao: '1/3 constitucional (férias vencidas)',
      valor: tercoVencidas,
      tipo: 'provento',
      exibir: true,
    });
  }
  
  // ================================================================
  // 4. FÉRIAS PROPORCIONAIS + 1/3
  // Fórmula: (salário ÷ 12) × meses trabalhados + 1/3
  // ================================================================
  if (incluiFeriasProporcionais && formData.mesesDesdeUltimaFerias > 0) {
    const feriasProporcionais = (remuneracao / 12) * formData.mesesDesdeUltimaFerias;
    const tercoProporcionais = feriasProporcionais / 3;
    
    detalhamento.feriasProporcionais = feriasProporcionais;
    detalhamento.tercoFeriasProporcionais = tercoProporcionais;
    
    linhas.push({
      descricao: `Férias proporcionais (${formData.mesesDesdeUltimaFerias}/12 avos)`,
      valor: feriasProporcionais,
      tipo: 'provento',
      exibir: true,
    });
    linhas.push({
      descricao: '1/3 constitucional (férias proporcionais)',
      valor: tercoProporcionais,
      tipo: 'provento',
      exibir: true,
    });
  }
  
  // ================================================================
  // 5. 13º PROPORCIONAL
  // Fórmula: (salário ÷ 12) × meses de 2026 com > 15 dias
  // ================================================================
  if (inclui13 && formData.mesesTrabalhados2026 > 0) {
    const decimoTerceiro = (remuneracao / 12) * formData.mesesTrabalhados2026;
    detalhamento.decimoTerceiro = decimoTerceiro;
    
    linhas.push({
      descricao: `13º proporcional (${formData.mesesTrabalhados2026}/12 avos)`,
      valor: decimoTerceiro,
      tipo: 'provento',
      exibir: true,
    });
  }
  
  // ================================================================
  // 6. MULTA FGTS
  // 40% sem justa causa | 20% acordo | 0% demais
  // ================================================================
  if (formData.saldoFGTS > 0) {
    let percentualMulta = 0;
    if (tipoRescisao === 'sem_justa_causa') {
      percentualMulta = 0.40;
    } else if (tipoRescisao === 'acordo_484a') {
      percentualMulta = 0.20;
    }
    
    if (percentualMulta > 0) {
      const multaFGTS = formData.saldoFGTS * percentualMulta;
      detalhamento.multaFGTS = multaFGTS;
      
      linhas.push({
        descricao: `Multa FGTS (${percentualMulta * 100}%)`,
        valor: multaFGTS,
        tipo: 'provento',
        exibir: true,
      });
    }
  }
  
  // ================================================================
  // CALCULAR TOTAIS BRUTOS
  // ================================================================
  const totalProventos = linhas
    .filter(l => l.tipo === 'provento' && l.exibir)
    .reduce((acc, l) => acc + l.valor, 0);
  
  const totalDescontosParciais = linhas
    .filter(l => l.tipo === 'desconto' && l.exibir)
    .reduce((acc, l) => acc + l.valor, 0);
  
  detalhamento.totalBruto = totalProventos;
  
  // ================================================================
  // 7. INSS PROGRESSIVO
  // ================================================================
  const baseINSS = totalProventos - totalDescontosParciais;
  const inss = calcularINSS(baseINSS);
  detalhamento.descontoINSS = inss;
  
  if (inss > 0) {
    linhas.push({
      descricao: 'INSS',
      valor: inss,
      tipo: 'desconto',
      exibir: true,
    });
  }
  
  // ================================================================
  // 8. IRRF PROGRESSIVO
  // ================================================================
  const irrf = calcularIRRF(baseINSS, inss, formData.numDependentes);
  detalhamento.descontoIRRF = irrf;
  
  if (irrf > 0) {
    linhas.push({
      descricao: `IRRF${formData.numDependentes > 0 ? ` (${formData.numDependentes} dep.)` : ''}`,
      valor: irrf,
      tipo: 'desconto',
      exibir: true,
    });
  }
  
  // ================================================================
  // CALCULAR TOTAIS FINAIS
  // ================================================================
  const totalDescontos = linhas
    .filter(l => l.tipo === 'desconto' && l.exibir)
    .reduce((acc, l) => acc + l.valor, 0);
  
  const descontoEfetivo = Math.min(totalDescontos, totalProventos);
  const liquido = Math.max(0, totalProventos - descontoEfetivo);
  
  detalhamento.totalLiquido = liquido;
  
  return {
    linhas: linhas.filter(l => l.exibir),
    totalProventos,
    totalDescontos: descontoEfetivo,
    liquido,
    detalhamento,
  };
}

// Função auxiliar para estimar meses de 13º (mantida para compatibilidade)
export function estimarMeses13(dataAdmissao: string, dataDesligamento: string, diasAviso: number, avisoIndenizado: boolean): number {
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);
  
  let dataFinal = new Date(desligamento);
  if (avisoIndenizado) {
    dataFinal.setDate(dataFinal.getDate() + diasAviso);
  }
  
  const anoFinal = dataFinal.getFullYear();
  
  let mesInicio = 0;
  if (admissao.getFullYear() === anoFinal) {
    mesInicio = admissao.getMonth();
  }
  
  const mesFinal = dataFinal.getMonth();
  
  let meses = 0;
  for (let m = mesInicio; m <= mesFinal; m++) {
    if (m === mesInicio && admissao.getFullYear() === anoFinal) {
      const diaAdmissao = admissao.getDate();
      const diasNoMes = new Date(anoFinal, m + 1, 0).getDate();
      if (diasNoMes - diaAdmissao + 1 >= 15) {
        meses++;
      }
    } else if (m === mesFinal) {
      if (dataFinal.getDate() >= 15) {
        meses++;
      }
    } else {
      meses++;
    }
  }
  
  return Math.min(12, Math.max(0, meses));
}

// Função auxiliar para estimar meses de férias proporcionais (mantida para compatibilidade)
export function estimarMesesFerias(dataAdmissao: string, dataDesligamento: string, diasAviso: number, avisoIndenizado: boolean): number {
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);
  
  let dataFinal = new Date(desligamento);
  if (avisoIndenizado) {
    dataFinal.setDate(dataFinal.getDate() + diasAviso);
  }
  
  let ultimoAniversario = new Date(admissao);
  while (ultimoAniversario <= dataFinal) {
    const proximoAniversario = new Date(ultimoAniversario);
    proximoAniversario.setFullYear(proximoAniversario.getFullYear() + 1);
    if (proximoAniversario > dataFinal) break;
    ultimoAniversario = proximoAniversario;
  }
  
  let meses = 0;
  let mesAtual = new Date(ultimoAniversario);
  
  while (mesAtual <= dataFinal) {
    const proximoMes = new Date(mesAtual);
    proximoMes.setMonth(proximoMes.getMonth() + 1);
    
    if (mesAtual.getTime() === ultimoAniversario.getTime()) {
      const diasNoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
      const diaInicio = mesAtual.getDate();
      if (diasNoMes - diaInicio + 1 >= 15) {
        meses++;
      }
    } else if (proximoMes > dataFinal) {
      if (dataFinal.getDate() >= 15) {
        meses++;
      }
    } else {
      meses++;
    }
    
    mesAtual = proximoMes;
    if (meses >= 12) break;
  }
  
  return Math.min(12, Math.max(0, meses));
}
