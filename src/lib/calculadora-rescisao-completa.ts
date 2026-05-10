import { FormData } from '@/types/rescisao';

// ============================================================================
// CONSTANTES CLT 2026 - BASEADAS NO DOCUMENTO OFICIAL
// ============================================================================

const SALARIO_MINIMO_2026 = 1621; // Valor do salário mínimo 2026

// Tabela INSS 2026 (Portaria INSS)
const TABELA_INSS_2026 = [
  { limite: 1621.00, aliquota: 0.075, deducao: 0.00 },
  { limite: 2902.84, aliquota: 0.09, deducao: 24.32 },
  { limite: 4354.27, aliquota: 0.12, deducao: 111.40 },
  { limite: 8475.55, aliquota: 0.14, deducao: 198.49 },
];

const TETO_INSS_2026 = 8475.55;

// Tabela IRRF 2026
const TABELA_IRRF_2026 = [
  { limite: 2428.80, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 182.16 },
  { limite: 3751.05, aliquota: 0.15, deducao: 394.16 },
  { limite: 4664.68, aliquota: 0.225, deducao: 675.49 },
  { limite: Infinity, aliquota: 0.275, deducao: 908.73 },
];

const DEDUCAO_DEPENDENTE_IRRF = 189.59;

// Constantes para DSR (Descanso Semanal Remunerado)
const DIAS_UTEIS_MES = 22;
const DIAS_DESCANSO_MES = 4;

// ============================================================================
// TIPOS DO RESULTADO
// ============================================================================

export interface MotivoOportunidade {
  id: string;
  texto: string;
  icone: 'clock' | 'briefcase' | 'banknote' | 'alert' | 'shield' | 'scale';
}

export interface VerbaRescisoria {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'provento' | 'desconto';
  detalhes?: string;
}

export interface DetalhamentoBase {
  saldoSalario: number;
  diasSaldoSalario: number;
  avisoPrevio: number;
  diasAvisoPrevio: number;
  descontoAvisoPrevio: number;
  decimoTerceiro: number;
  meses13: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  mesesFerias: number;
  tercoConstitucionalVencidas: number;
  tercoConstitucionalProporcionais: number;
  fgtsEstimado: number;
  multaFgts: number;
  percentualMultaFgts: number;
  descontoINSS: number;
  descontoIRRF: number;
}

export interface ModuloOportunidade {
  id: string;
  nome: string;
  valorEstimado: number;
  dsr: number;
  reflexos: number;
  total: number;
  explicacao: string;
}

export interface ResultadoCompleto {
  valorBase: number;
  valorBruto: number;
  totalDescontos: number;
  detalhamento: DetalhamentoBase;
  verbas: VerbaRescisoria[];
  valorPotencial: number;
  modulosOportunidade: ModuloOportunidade[];
  mesesTrabalhados: number;
  anosCompletos: number;
  diasNoMesFinal: number;
  tipoRescisao: string;
  scoreOportunidade: number;
  motivos: MotivoOportunidade[];
  temSinaisOportunidade: boolean;
  minimoAdd: number;
  maximoAdd: number;
  valorPossivelMin: number;
  valorPossivelMax: number;
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

/**
 * Calcula dias trabalhados no mês do desligamento
 */
function calcularDiasNoMes(dataDesligamento: string): number {
  if (!dataDesligamento) return 15;
  const data = new Date(dataDesligamento);
  return data.getDate();
}

/**
 * Calcula meses completos trabalhados entre duas datas
 */
function calcularMesesTrabalhados(dataAdmissao: string, dataDesligamento: string): number {
  if (!dataAdmissao || !dataDesligamento) return 0;
  
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);
  
  const anos = desligamento.getFullYear() - admissao.getFullYear();
  const meses = desligamento.getMonth() - admissao.getMonth();
  const dias = desligamento.getDate() - admissao.getDate();
  
  let totalMeses = anos * 12 + meses;
  if (dias < 0) totalMeses--;
  
  return Math.max(0, totalMeses);
}

/**
 * Calcula anos completos trabalhados (para aviso prévio)
 * REGRA: Conta anos completos entre admissão e comunicação de saída
 */
function calcularAnosCompletos(dataAdmissao: string, dataDesligamento: string): number {
  if (!dataAdmissao || !dataDesligamento) return 0;
  
  const admissao = new Date(dataAdmissao);
  const desligamento = new Date(dataDesligamento);
  
  let anos = desligamento.getFullYear() - admissao.getFullYear();
  
  const mesAdm = admissao.getMonth();
  const diaAdm = admissao.getDate();
  const mesDes = desligamento.getMonth();
  const diaDes = desligamento.getDate();
  
  if (mesDes < mesAdm || (mesDes === mesAdm && diaDes < diaAdm)) {
    anos--;
  }
  
  return Math.max(0, anos);
}

/**
 * Calcula meses trabalhados no ano da rescisão para 13º proporcional
 * REGRA CLT: mês com >= 15 dias trabalhados conta como mês cheio
 */
function calcularMeses13Proporcional(
  dataAdmissao: string, 
  dataDesligamento: string,
  diasAvisoProjetado: number = 0
): number {
  if (!dataAdmissao || !dataDesligamento) return 0;
  
  const admissao = new Date(dataAdmissao);
  let desligamento = new Date(dataDesligamento);
  
  // Projetar contrato se aviso indenizado
  if (diasAvisoProjetado > 0) {
    desligamento = new Date(desligamento.getTime() + diasAvisoProjetado * 24 * 60 * 60 * 1000);
  }
  
  const anoDesligamento = desligamento.getFullYear();
  
  const mesInicio = admissao.getFullYear() === anoDesligamento 
    ? admissao.getMonth() 
    : 0;
  
  const mesFinal = desligamento.getMonth();
  
  let meses = 0;
  
  for (let m = mesInicio; m <= mesFinal; m++) {
    const diasNoMes = new Date(anoDesligamento, m + 1, 0).getDate();
    
    if (m === mesInicio && admissao.getFullYear() === anoDesligamento) {
      const diaAdmissao = admissao.getDate();
      const diasTrabalhados = diasNoMes - diaAdmissao + 1;
      if (diasTrabalhados >= 15) meses++;
    } else if (m === mesFinal) {
      if (desligamento.getDate() >= 15) meses++;
    } else {
      meses++;
    }
  }
  
  return Math.min(12, Math.max(0, meses));
}

/**
 * Calcula meses do período aquisitivo atual de férias
 * REGRA CLT: mês com >= 15 dias trabalhados conta como mês cheio
 */
function calcularMesesFeriasProporcionais(
  dataAdmissao: string,
  dataDesligamento: string,
  diasAvisoProjetado: number = 0
): number {
  if (!dataAdmissao || !dataDesligamento) return 0;
  
  const admissao = new Date(dataAdmissao);
  let desligamento = new Date(dataDesligamento);
  
  if (diasAvisoProjetado > 0) {
    desligamento = new Date(desligamento.getTime() + diasAvisoProjetado * 24 * 60 * 60 * 1000);
  }
  
  let ultimoAniversario = new Date(admissao);
  while (ultimoAniversario <= desligamento) {
    const proximoAniversario = new Date(ultimoAniversario);
    proximoAniversario.setFullYear(proximoAniversario.getFullYear() + 1);
    if (proximoAniversario > desligamento) break;
    ultimoAniversario = proximoAniversario;
  }
  
  let meses = 0;
  let mesAtual = new Date(ultimoAniversario);
  
  while (mesAtual <= desligamento && meses < 12) {
    const proximoMes = new Date(mesAtual);
    proximoMes.setMonth(proximoMes.getMonth() + 1);
    
    if (mesAtual.getTime() === ultimoAniversario.getTime()) {
      const diasNoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
      const diasTrabalhados = diasNoMes - mesAtual.getDate() + 1;
      if (diasTrabalhados >= 15) meses++;
    } else if (proximoMes > desligamento) {
      if (desligamento.getDate() >= 15) meses++;
    } else {
      meses++;
    }
    
    mesAtual = proximoMes;
  }
  
  return Math.min(12, Math.max(0, meses));
}

/**
 * Calcula dias de aviso prévio conforme CLT
 * REGRA: 30 dias + 3 dias por ano completo de serviço, limitado a 90 dias
 */
function calcularDiasAvisoPrevio(anosCompletos: number): number {
  // 30 dias base + 3 dias por ano completo (máximo 60 dias extras = 90 total)
  const diasAdicionais = Math.min(60, anosCompletos * 3);
  return Math.min(90, 30 + diasAdicionais);
}

/**
 * Calcula o desconto do INSS usando tabela progressiva 2026
 * IMPORTANTE: O INSS só incide sobre verbas salariais (salário e 13º)
 * Não incide sobre: férias, 1/3, aviso prévio indenizado, multa FGTS
 */
function calcularINSS(baseSalarial: number): number {
  if (baseSalarial <= 0) return 0;
  
  // Limitar ao teto
  const baseCalculoINSS = Math.min(baseSalarial, TETO_INSS_2026);
  
  // Encontrar a faixa correta
  for (const faixa of TABELA_INSS_2026) {
    if (baseCalculoINSS <= faixa.limite) {
      const desconto = (baseCalculoINSS * faixa.aliquota) - faixa.deducao;
      return arredondar(Math.max(0, desconto));
    }
  }
  
  // Se exceder todas as faixas, usar a última
  const ultimaFaixa = TABELA_INSS_2026[TABELA_INSS_2026.length - 1];
  const desconto = (TETO_INSS_2026 * ultimaFaixa.aliquota) - ultimaFaixa.deducao;
  return arredondar(Math.max(0, desconto));
}

/**
 * Calcula o redutor mensal do IRRF conforme regras 2026
 */
function calcularRedutorIRRF(rendaMensal: number): number {
  if (rendaMensal <= 5000) {
    return 312.89;
  } else if (rendaMensal <= 7350) {
    return 978.62 - (0.133145 * rendaMensal);
  }
  return 0;
}

/**
 * Calcula o IRRF usando tabela progressiva 2026
 * Passos:
 * 1. Somar parcelas tributáveis (salário + 13º + adicionais)
 * 2. Subtrair INSS calculado e R$ 189,59 por dependente
 * 3. Aplicar redutor se enquadrado
 * 4. Enquadrar na tabela e calcular imposto
 */
function calcularIRRF(baseTributavel: number, inssDescontado: number, numDependentes: number): number {
  if (baseTributavel <= 0) return 0;
  
  // Deduzir INSS e dependentes
  const dependentesValidos = Math.max(0, numDependentes);
  const deducaoDependentes = dependentesValidos * DEDUCAO_DEPENDENTE_IRRF;
  
  let baseCalculo = baseTributavel - inssDescontado - deducaoDependentes;
  
  // Aplicar redutor
  const redutor = calcularRedutorIRRF(baseTributavel);
  baseCalculo = baseCalculo - redutor;
  
  if (baseCalculo <= 0) return 0;
  
  // Encontrar a faixa correta
  for (const faixa of TABELA_IRRF_2026) {
    if (baseCalculo <= faixa.limite) {
      const imposto = (baseCalculo * faixa.aliquota) - faixa.deducao;
      return arredondar(Math.max(0, imposto));
    }
  }
  
  // Se exceder todas as faixas, usar a última
  const ultimaFaixa = TABELA_IRRF_2026[TABELA_IRRF_2026.length - 1];
  const imposto = (baseCalculo * ultimaFaixa.aliquota) - ultimaFaixa.deducao;
  return arredondar(Math.max(0, imposto));
}

// ============================================================================
// PARTE 1: CÁLCULO DO VALOR-BASE — VERBAS RESCISÓRIAS CLT 2026
// ============================================================================

function calcularValorBase(formData: FormData): { 
  total: number;
  bruto: number;
  descontos: number;
  detalhamento: DetalhamentoBase; 
  verbas: VerbaRescisoria[];
  mesesTrabalhados: number;
  anosCompletos: number;
  diasNoMesFinal: number;
} {
  const salario = formData.salarioFixo + (formData.temVariavel ? formData.mediaVariavel : 0);
  const salarioDia = salario / 30;
  
  const mesesTrabalhados = calcularMesesTrabalhados(formData.dataAdmissao, formData.dataDesligamento);
  const anosCompletos = calcularAnosCompletos(formData.dataAdmissao, formData.dataDesligamento);
  const diasNoMesFinal = calcularDiasNoMes(formData.dataDesligamento);
  
  const tipo = formData.tipoDesligamento;
  const verbas: VerbaRescisoria[] = [];
  
  // ================================================================
  // Determinar regras por tipo de rescisão (conforme documento)
  // ================================================================
  const regras = {
    temSaldoSalario: true,
    temAvisoPrevio: false,
    temDescontoAvisoPrevio: false,
    tem13Proporcional: false,
    temFeriasVencidas: true,
    temFeriasProporcionais: false,
    temMultaFgts: false,
    percentualMultaFgts: 0,
    percentualSaqueFgts: 0,
    projetarContrato: false,
    metadeAviso: false,
    temSeguroDesemprego: false,
  };
  
  switch (tipo) {
    case 'demissao_sem_justa_causa':
    case 'rescisao_indireta':
      // Todos os direitos: saldo, 13º, férias, aviso, 40% FGTS, saque 100%, seguro
      regras.temAvisoPrevio = true;
      regras.tem13Proporcional = true;
      regras.temFeriasProporcionais = true;
      regras.temMultaFgts = true;
      regras.percentualMultaFgts = 40;
      regras.percentualSaqueFgts = 100;
      regras.projetarContrato = true;
      regras.temSeguroDesemprego = true;
      break;
      
    case 'acordo':
      // Acordo 484-A: aviso pela metade, 20% FGTS, saque 80%, sem seguro
      regras.temAvisoPrevio = true;
      regras.metadeAviso = true;
      regras.tem13Proporcional = true;
      regras.temFeriasProporcionais = true;
      regras.temMultaFgts = true;
      regras.percentualMultaFgts = 20;
      regras.percentualSaqueFgts = 80;
      regras.projetarContrato = true;
      regras.temSeguroDesemprego = false;
      break;
      
    case 'pedido_demissao':
      // Saldo, 13º, férias. Sem multa nem saque FGTS
      regras.tem13Proporcional = true;
      regras.temFeriasProporcionais = true;
      // Desconto do aviso se não cumprido
      if (formData.tipoAvisoPrevio === 'nao_cumprido') {
        regras.temDescontoAvisoPrevio = true;
      }
      regras.percentualMultaFgts = 0;
      regras.percentualSaqueFgts = 0;
      break;
      
    case 'justa_causa':
      // Apenas saldo de salário e férias vencidas (com 1/3)
      // SEM 13º proporcional, SEM férias proporcionais, SEM multa/saque FGTS
      regras.temFeriasVencidas = true;
      regras.tem13Proporcional = false;
      regras.temFeriasProporcionais = false;
      regras.percentualMultaFgts = 0;
      regras.percentualSaqueFgts = 0;
      break;
      
    case 'termino_contrato':
    case 'termino_antecipado_empregador':
    case 'termino_antecipado_empregado':
      // Término contrato temporário: saldo, 13º, férias prop
      // Sem aviso, sem multa 40%, mas pode sacar 100%
      regras.tem13Proporcional = true;
      regras.temFeriasProporcionais = true;
      regras.percentualMultaFgts = 0;
      regras.percentualSaqueFgts = 100;
      regras.temSeguroDesemprego = false;
      break;
  }
  
  // ================================================================
  // 1. SALDO DE SALÁRIO
  // Fórmula: (salário mensal ÷ 30) × dias trabalhados no mês
  // ================================================================
  const saldoSalario = arredondar(salarioDia * diasNoMesFinal);
  
  verbas.push({
    id: 'saldoSalario',
    descricao: `Saldo de salário (${diasNoMesFinal} dias)`,
    valor: saldoSalario,
    tipo: 'provento',
    detalhes: `R$ ${salario.toFixed(2)} ÷ 30 × ${diasNoMesFinal} dias`,
  });
  
  // ================================================================
  // 2. AVISO PRÉVIO
  // Fórmula CLT: 30 dias + 3 dias por ano completo (máx 90 dias)
  // Indenizado: (salário ÷ 30) × dias de aviso
  // Acordo: 50% do valor
  // IMPORTANTE: Aviso indenizado é ISENTO de INSS e IRRF
  // ================================================================
  let avisoPrevio = 0;
  let diasAvisoPrevio = 0;
  let descontoAvisoPrevio = 0;
  let diasProjecao = 0;
  
  if (regras.temAvisoPrevio) {
    diasAvisoPrevio = calcularDiasAvisoPrevio(anosCompletos);
    
    if (formData.tipoAvisoPrevio === 'indenizado' || formData.tipoAvisoPrevio === 'metade') {
      let valorAviso = arredondar(salarioDia * diasAvisoPrevio);
      
      if (regras.metadeAviso) {
        valorAviso = arredondar(valorAviso / 2);
        verbas.push({
          id: 'avisoPrevio',
          descricao: `Aviso prévio indenizado (50% de ${diasAvisoPrevio} dias)`,
          valor: valorAviso,
          tipo: 'provento',
          detalhes: `(R$ ${salario.toFixed(2)} ÷ 30 × ${diasAvisoPrevio}) × 50% — Acordo art. 484-A CLT`,
        });
      } else {
        verbas.push({
          id: 'avisoPrevio',
          descricao: `Aviso prévio indenizado (${diasAvisoPrevio} dias)`,
          valor: valorAviso,
          tipo: 'provento',
          detalhes: `R$ ${salario.toFixed(2)} ÷ 30 × ${diasAvisoPrevio} dias — Isento de INSS e IRRF`,
        });
      }
      
      avisoPrevio = valorAviso;
      
      if (regras.projetarContrato) {
        diasProjecao = diasAvisoPrevio;
      }
    }
  }
  
  // ================================================================
  // Desconto de aviso prévio (pedido de demissão sem cumprir)
  // REGRA: Deduz-se 30 dias de salário do trabalhador
  // ================================================================
  if (regras.temDescontoAvisoPrevio) {
    const diasDescontoAviso = 30;
    descontoAvisoPrevio = arredondar(salarioDia * diasDescontoAviso);
    
    verbas.push({
      id: 'descontoAviso',
      descricao: `Desconto aviso prévio não cumprido (${diasDescontoAviso} dias)`,
      valor: descontoAvisoPrevio,
      tipo: 'desconto',
      detalhes: `R$ ${salario.toFixed(2)} ÷ 30 × ${diasDescontoAviso} dias — CLT art. 487 §2º`,
    });
  }
  
  // ================================================================
  // 3. 13º SALÁRIO PROPORCIONAL
  // Fórmula: (salário mensal ÷ 12) × meses trabalhados no ano
  // REGRA: mês com >= 15 dias conta como mês cheio
  // ================================================================
  let decimoTerceiro = 0;
  let meses13 = 0;
  
  if (regras.tem13Proporcional) {
    meses13 = calcularMeses13Proporcional(
      formData.dataAdmissao, 
      formData.dataDesligamento, 
      diasProjecao
    );
    
    decimoTerceiro = arredondar((salario / 12) * meses13);
    
    if (decimoTerceiro > 0) {
      verbas.push({
        id: 'decimoTerceiro',
        descricao: `13º salário proporcional (${meses13}/12 avos)`,
        valor: decimoTerceiro,
        tipo: 'provento',
        detalhes: `R$ ${salario.toFixed(2)} ÷ 12 × ${meses13} meses`,
      });
    }
  }
  
  // ================================================================
  // 4. FÉRIAS VENCIDAS + 1/3 CONSTITUCIONAL
  // Fórmula: salário mensal + (salário mensal ÷ 3)
  // Se houver 2+ períodos sem férias, pode ser pago em dobro
  // ================================================================
  let feriasVencidas = 0;
  let tercoConstitucionalVencidas = 0;
  
  if (regras.temFeriasVencidas && formData.periodosFeriasVencidas > 0) {
    feriasVencidas = salario * formData.periodosFeriasVencidas;
    tercoConstitucionalVencidas = arredondar(feriasVencidas / 3);
    
    verbas.push({
      id: 'feriasVencidas',
      descricao: `Férias vencidas (${formData.periodosFeriasVencidas} período${formData.periodosFeriasVencidas > 1 ? 's' : ''})`,
      valor: feriasVencidas,
      tipo: 'provento',
      detalhes: `R$ ${salario.toFixed(2)} × ${formData.periodosFeriasVencidas}`,
    });
    
    verbas.push({
      id: 'tercoVencidas',
      descricao: '1/3 constitucional (férias vencidas)',
      valor: tercoConstitucionalVencidas,
      tipo: 'provento',
      detalhes: `R$ ${feriasVencidas.toFixed(2)} ÷ 3`,
    });
  }
  
  // ================================================================
  // 5. FÉRIAS PROPORCIONAIS + 1/3 CONSTITUCIONAL
  // Fórmula: (salário ÷ 12 × meses) + 1/3
  // REGRA: mês com >= 15 dias conta como mês cheio
  // ================================================================
  let feriasProporcionais = 0;
  let tercoConstitucionalProporcionais = 0;
  let mesesFerias = 0;
  
  if (regras.temFeriasProporcionais) {
    mesesFerias = calcularMesesFeriasProporcionais(
      formData.dataAdmissao, 
      formData.dataDesligamento, 
      diasProjecao
    );
    
    feriasProporcionais = arredondar((salario / 12) * mesesFerias);
    tercoConstitucionalProporcionais = arredondar(feriasProporcionais / 3);
    
    if (mesesFerias > 0) {
      verbas.push({
        id: 'feriasProporcionais',
        descricao: `Férias proporcionais (${mesesFerias}/12 avos)`,
        valor: feriasProporcionais,
        tipo: 'provento',
        detalhes: `R$ ${salario.toFixed(2)} ÷ 12 × ${mesesFerias} meses`,
      });
      
      verbas.push({
        id: 'tercoProporcionais',
        descricao: '1/3 constitucional (férias proporcionais)',
        valor: tercoConstitucionalProporcionais,
        tipo: 'provento',
        detalhes: `R$ ${feriasProporcionais.toFixed(2)} ÷ 3`,
      });
    }
  }
  
  // ================================================================
  // 6. FGTS ESTIMADO E MULTA
  // Multa: 40% (demissão sem justa causa), 20% (acordo), 0% (demais)
  // ================================================================
  // Usar saldo informado pelo usuário ou estimar
  const fgtsEstimado = formData.saldoFGTS > 0 
    ? formData.saldoFGTS 
    : arredondar(salario * 0.08 * mesesTrabalhados);
  
  let multaFgts = 0;
  
  if (regras.temMultaFgts && regras.percentualMultaFgts > 0) {
    multaFgts = arredondar(fgtsEstimado * (regras.percentualMultaFgts / 100));
    
    const descricaoFgts = formData.saldoFGTS > 0 
      ? `R$ ${fgtsEstimado.toFixed(2)} × ${regras.percentualMultaFgts}%`
      : `R$ ${fgtsEstimado.toFixed(2)} (estimado) × ${regras.percentualMultaFgts}%`;
    
    verbas.push({
      id: 'multaFgts',
      descricao: `Multa FGTS (${regras.percentualMultaFgts}%)`,
      valor: multaFgts,
      tipo: 'provento',
      detalhes: descricaoFgts,
    });
  }
  
  // ================================================================
  // 7. CÁLCULO DOS DESCONTOS (INSS e IRRF)
  // ================================================================
  // Base tributável para INSS: saldo de salário + 13º proporcional
  // IMPORTANTE: Férias, 1/3 e aviso indenizado NÃO sofrem desconto de INSS
  const baseTributavelINSS = saldoSalario + decimoTerceiro;
  const descontoINSS = calcularINSS(baseTributavelINSS);
  
  if (descontoINSS > 0) {
    verbas.push({
      id: 'descontoINSS',
      descricao: 'INSS',
      valor: descontoINSS,
      tipo: 'desconto',
      detalhes: `Base: R$ ${baseTributavelINSS.toFixed(2)} (saldo + 13º)`,
    });
  }
  
  // Base tributável para IRRF: igual ao INSS
  // Deduzir: INSS já calculado + dependentes
  const numDependentes = formData.numDependentes >= 0 ? formData.numDependentes : 0;
  const descontoIRRF = calcularIRRF(baseTributavelINSS, descontoINSS, numDependentes);
  
  if (descontoIRRF > 0) {
    verbas.push({
      id: 'descontoIRRF',
      descricao: 'IRRF',
      valor: descontoIRRF,
      tipo: 'desconto',
      detalhes: `Base: R$ ${baseTributavelINSS.toFixed(2)} - INSS - ${numDependentes} dep.`,
    });
  }
  
  // ================================================================
  // TOTAIS
  // ================================================================
  const totalProventos = verbas
    .filter(v => v.tipo === 'provento')
    .reduce((acc, v) => acc + v.valor, 0);
    
  const totalDescontos = verbas
    .filter(v => v.tipo === 'desconto')
    .reduce((acc, v) => acc + v.valor, 0);
  
  const descontoEfetivo = Math.min(totalDescontos, totalProventos);
  const total = arredondar(Math.max(0, totalProventos - descontoEfetivo));
  
  return {
    total,
    bruto: arredondar(totalProventos),
    descontos: arredondar(descontoEfetivo),
    detalhamento: {
      saldoSalario,
      diasSaldoSalario: diasNoMesFinal,
      avisoPrevio,
      diasAvisoPrevio,
      descontoAvisoPrevio: Math.min(descontoAvisoPrevio, totalProventos),
      decimoTerceiro,
      meses13,
      feriasVencidas,
      feriasProporcionais,
      mesesFerias,
      tercoConstitucionalVencidas,
      tercoConstitucionalProporcionais,
      fgtsEstimado,
      multaFgts,
      percentualMultaFgts: regras.percentualMultaFgts,
      descontoINSS,
      descontoIRRF,
    },
    verbas,
    mesesTrabalhados,
    anosCompletos,
    diasNoMesFinal,
  };
}

// ============================================================================
// PARTE 2: CÁLCULO DO VALOR POTENCIAL — MÓDULOS DE OPORTUNIDADE
// Baseado no documento: horas extras, desvio de função, "por fora", adicionais
// ============================================================================

function calcularDSR(valorMensal: number): number {
  return arredondar(valorMensal * (DIAS_DESCANSO_MES / DIAS_UTEIS_MES));
}

function calcularReflexos(baseTotal: number, tipo: string): number {
  const fatorAtenuacao = 0.55;
  
  const ref13 = baseTotal / 12;
  const refFerias = baseTotal / 12;
  const refTerco = refFerias / 3;
  const fgtsSobreBase = baseTotal * 0.08;
  
  let multaSobreFgts = 0;
  if (tipo === 'demissao_sem_justa_causa' || tipo === 'rescisao_indireta') {
    multaSobreFgts = fgtsSobreBase * 0.40;
  } else if (tipo === 'acordo') {
    multaSobreFgts = fgtsSobreBase * 0.20;
  }
  
  return arredondar((ref13 + refFerias + refTerco + fgtsSobreBase + multaSobreFgts) * fatorAtenuacao);
}

function calcularModulosOportunidade(
  formData: FormData,
  mesesTrabalhados: number
): { modulos: ModuloOportunidade[]; motivos: MotivoOportunidade[]; score: number } {
  const S = formData.salarioFixo + (formData.temVariavel ? formData.mediaVariavel : 0);
  const M = mesesTrabalhados;
  const tipo = formData.tipoDesligamento;
  
  const modulos: ModuloOportunidade[] = [];
  const motivos: MotivoOportunidade[] = [];
  let score = 0;
  
  // ================================================================
  // MÓDULO 1: HORAS EXTRAS (conforme documento)
  // Fórmula: hora extra = (salário ÷ 220) × 1.5 (ou 2.0 em dom/feriado)
  // Frequências do documento:
  // - Frequentemente (>10h/sem): 12h/semana × 4 = 48h/mês
  // - Às vezes (5-10h/sem): 7.5h/semana × 4 = 30h/mês
  // - Raramente (<5h/sem): 2.5h/semana × 4 = 10h/mês
  // ================================================================
  if (formData.faziaHorasExtras && formData.faziaHorasExtras !== 'nao_fazia') {
    const frequenciaConfig = {
      'sempre': { horasMes: 48, scoreAdd: 18 },
      'quase_sempre': { horasMes: 30, scoreAdd: 14 },
      'vez_em_quando': { horasMes: 20, scoreAdd: 8 },
      'raramente': { horasMes: 10, scoreAdd: 4 },
    }[formData.faziaHorasExtras] || { horasMes: 15, scoreAdd: 6 };
    
    const horaNormal = S / 220;
    const valorHoraExtra = horaNormal * 1.5;
    const he_principal_mes = valorHoraExtra * frequenciaConfig.horasMes;
    
    const dsr_he_mes = calcularDSR(he_principal_mes);
    const base_remuneratoria_mes = he_principal_mes + dsr_he_mes;
    
    const he_base_total = base_remuneratoria_mes * M;
    const he_reflexos = calcularReflexos(he_base_total, tipo);
    const he_total = he_base_total + he_reflexos;
    
    modulos.push({
      id: 'horasExtras',
      nome: 'Horas Extras',
      valorEstimado: arredondar(he_principal_mes * M),
      dsr: arredondar(dsr_he_mes * M),
      reflexos: he_reflexos,
      total: arredondar(he_total),
      explicacao: `Estimativa de ${frequenciaConfig.horasMes}h extras/mês × ${M} meses. Hora extra = R$ ${valorHoraExtra.toFixed(2)} (150% da hora normal).`,
    });
    
    motivos.push({
      id: 'horasExtras',
      texto: 'Horas extras frequentes podem não ter sido pagas corretamente com o adicional de 50%.',
      icone: 'clock',
    });
    
    score += frequenciaConfig.scoreAdd;
  }
  
  // ================================================================
  // MÓDULO 2: DESVIO / ACÚMULO DE FUNÇÃO (conforme documento)
  // Percentuais do documento:
  // - Constantemente: 20% do salário
  // - Com frequência: 15% do salário
  // - Às vezes: 10% do salário
  // ================================================================
  if (formData.funcoesDiferentes && formData.funcoesDiferentes !== 'nao' && formData.funcoesDiferentes !== 'nao_fazia' && formData.funcoesDiferentes !== 'raramente') {
    // "sim" = 15% do salário (cargo superior confirmado)
    // "nao_sei" = 10% do salário (possível desvio, estimativa conservadora)
    const desvioConfig = {
      'sim': { pctBase: 0.15, scoreAdd: 15 },
      'nao_sei': { pctBase: 0.10, scoreAdd: 8 },
      // Legacy values for backwards compatibility
      'sempre': { pctBase: 0.20, scoreAdd: 15 },
      'quase_sempre': { pctBase: 0.15, scoreAdd: 10 },
      'vez_em_quando': { pctBase: 0.10, scoreAdd: 6 },
      'raramente': { pctBase: 0.05, scoreAdd: 3 },
    }[formData.funcoesDiferentes] || { pctBase: 0.10, scoreAdd: 5 };
    
    const desvio_principal_mes = S * desvioConfig.pctBase;
    const desvio_base_total = desvio_principal_mes * M;
    const desvio_reflexos = calcularReflexos(desvio_base_total, tipo);
    const desvio_total = desvio_base_total + desvio_reflexos;
    
    const explicacaoMap: Record<string, string> = {
      'sim': 'Estimativa de 15% do salário por mês — cargo superior confirmado. Apenas a Justiça do Trabalho pode fixar o percentual exato.',
      'nao_sei': 'Estimativa conservadora de 10% do salário por mês — possível desvio de função. Recomendamos consultar um advogado.',
    };
    
    modulos.push({
      id: 'desvioFuncao',
      nome: 'Desvio/Acúmulo de Função',
      valorEstimado: arredondar(desvio_base_total),
      dsr: 0,
      reflexos: desvio_reflexos,
      total: arredondar(desvio_total),
      explicacao: explicacaoMap[formData.funcoesDiferentes] || `Estimativa de ${(desvioConfig.pctBase * 100).toFixed(0)}% do salário por mês trabalhado.`,
    });
    
    motivos.push({
      id: 'desvioFuncao',
      texto: 'Exercer função diferente da registrada pode gerar diferenças salariais.',
      icone: 'briefcase',
    });
    
    score += desvioConfig.scoreAdd;
  }
  
  // ================================================================
  // MÓDULO 3: PAGAMENTO "POR FORA" (conforme documento)
  // Valores não registrados devem integrar o salário para
  // cálculo de férias, 13º, FGTS e verbas rescisórias
  // ================================================================
  if (formData.valorPorFora === 'sim') {
    // Estimar 15% do salário como valor "por fora"
    const fora_pct = 0.15;
    
    const fora_principal_mes = S * fora_pct;
    const fora_base_total = fora_principal_mes * M;
    const fora_reflexos = calcularReflexos(fora_base_total, tipo);
    const fora_total = fora_base_total + fora_reflexos;
    
    modulos.push({
      id: 'porFora',
      nome: 'Valores "Por Fora"',
      valorEstimado: arredondar(fora_base_total),
      dsr: 0,
      reflexos: fora_reflexos,
      total: arredondar(fora_total),
      explicacao: `Valores pagos "por fora" devem integrar o salário para cálculo de todas as verbas.`,
    });
    
    motivos.push({
      id: 'porFora',
      texto: 'Valores pagos "por fora" deveriam integrar seu salário oficial e base de cálculo.',
      icone: 'banknote',
    });
    
    score += 18;
  }
  
  // ================================================================
  // MÓDULO 4: INSALUBRIDADE (conforme documento)
  // Percentual sobre o SALÁRIO MÍNIMO (não sobre o salário contratual):
  // - Grau leve: 10%
  // - Grau médio: 20% (padrão se não souber)
  // - Grau grave: 40%
  // ================================================================
  const adicionais = formData.adicionaisTrabalho || [];
  
  if (adicionais.includes('insalubridade')) {
    const SM = SALARIO_MINIMO_2026;
    const insal_grau_pct = 0.20; // Grau médio como padrão
    
    const insal_principal_mes = SM * insal_grau_pct;
    const insal_base_total = insal_principal_mes * M;
    const insal_reflexos = calcularReflexos(insal_base_total, tipo);
    const insal_total = insal_base_total + insal_reflexos;
    
    modulos.push({
      id: 'insalubridade',
      nome: 'Adicional de Insalubridade',
      valorEstimado: arredondar(insal_base_total),
      dsr: 0,
      reflexos: insal_reflexos,
      total: arredondar(insal_total),
      explicacao: `Grau médio (20% do salário mínimo = R$ ${(SM * insal_grau_pct).toFixed(2)}/mês). Integra férias, 13º e FGTS.`,
    });
    
    score += 14;
  }
  
  // ================================================================
  // MÓDULO 5: PERICULOSIDADE (conforme documento)
  // Percentual: 30% sobre o salário BASE
  // ================================================================
  if (adicionais.includes('periculosidade')) {
    const peric_pct = 0.30;
    
    const peric_principal_mes = S * peric_pct;
    const peric_base_total = peric_principal_mes * M;
    const peric_reflexos = calcularReflexos(peric_base_total, tipo);
    const peric_total = peric_base_total + peric_reflexos;
    
    modulos.push({
      id: 'periculosidade',
      nome: 'Adicional de Periculosidade',
      valorEstimado: arredondar(peric_base_total),
      dsr: 0,
      reflexos: peric_reflexos,
      total: arredondar(peric_total),
      explicacao: `30% sobre o salário base (R$ ${(S * peric_pct).toFixed(2)}/mês). Integra férias, 13º e FGTS.`,
    });
    
    score += 14;
  }
  
  // ================================================================
  // MÓDULO 6: ADICIONAL NOTURNO (conforme documento)
  // Hora noturna: 20% a mais que hora diurna
  // Hora noturna reduzida: 52min30seg = considera-se 60min
  // Fórmula: ((salário ÷ 220) ÷ 0.875) × 20% × horas noturnas
  // ================================================================
  if (adicionais.includes('trabalho_noturno')) {
    // Estimar 4h noturnas por dia, 20 dias/mês
    const not_horas_noite_dia = 4;
    const not_dias_mes = 20;
    
    const not_horas_mes = not_horas_noite_dia * not_dias_mes;
    const horaNormal = S / 220;
    const horaNoturna = horaNormal / 0.875; // Hora noturna reduzida
    const adicionalNoturno = horaNoturna * 0.20;
    
    const not_principal_mes = adicionalNoturno * not_horas_mes;
    const dsr_not_mes = calcularDSR(not_principal_mes);
    const base_remuneratoria_mes = not_principal_mes + dsr_not_mes;
    
    const not_base_total = base_remuneratoria_mes * M;
    const not_reflexos = calcularReflexos(not_base_total, tipo);
    const not_total = not_base_total + not_reflexos;
    
    modulos.push({
      id: 'noturno',
      nome: 'Adicional Noturno',
      valorEstimado: arredondar(not_principal_mes * M),
      dsr: arredondar(dsr_not_mes * M),
      reflexos: not_reflexos,
      total: arredondar(not_total),
      explicacao: `20% sobre hora noturna (${not_horas_mes}h/mês). Integra férias, 13º e FGTS.`,
    });
    
    score += 12;
  }
  
  // ================================================================
  // MÓDULO: Erro/Suspeita na Rescisão
  // ================================================================
  if (formData.erroNaRescisao === 'sim') {
    motivos.push({
      id: 'erroSuspeita',
      texto: 'Você identificou possíveis erros que precisam ser verificados.',
      icone: 'alert',
    });
    score += 15;
  } else if (formData.erroNaRescisao === 'talvez') {
    motivos.push({
      id: 'erroTalvez',
      texto: 'É importante verificar todos os valores da sua rescisão.',
      icone: 'alert',
    });
    score += 8;
  }
  
  // Motivo genérico de adicionais
  if (adicionais.length > 0 && !adicionais.includes('nenhum')) {
    const tiposTexto = adicionais
      .filter(a => a !== 'nenhum')
      .map(a => {
        if (a === 'periculosidade') return 'periculosidade';
        if (a === 'insalubridade') return 'insalubridade';
        if (a === 'trabalho_noturno') return 'adicional noturno';
        return a;
      })
      .join(', ');
    
    if (!motivos.some(m => ['insalubridade', 'periculosidade', 'noturno'].includes(m.id))) {
      motivos.push({
        id: 'adicional',
        texto: `Adicional de ${tiposTexto} pode não ter sido calculado corretamente.`,
        icone: 'shield',
      });
    }
  }
  
  return {
    modulos,
    motivos,
    score: Math.min(100, score),
  };
}

// ============================================================================
// FUNÇÃO PRINCIPAL — CÁLCULO COMPLETO
// ============================================================================

export function calcularRescisaoCompleta(formData: FormData): ResultadoCompleto | null {
  // Validação mínima
  if (!formData.tipoDesligamento || !formData.dataAdmissao || !formData.dataDesligamento || !formData.salarioFixo) {
    return null;
  }
  
  // PARTE 1: Valor Base
  const base = calcularValorBase(formData);
  
  // PARTE 2: Valor Potencial (módulos de oportunidade)
  const { modulos, motivos, score } = calcularModulosOportunidade(
    formData, 
    base.mesesTrabalhados
  );
  
  const totalOportunidades = modulos.reduce((acc, m) => acc + m.total, 0);
  const valorPotencial = arredondar(base.total + totalOportunidades);
  
  // Faixas de valores para UI
  const salario = formData.salarioFixo + (formData.temVariavel ? formData.mediaVariavel : 0);
  
  let minimoAdd = 0;
  let maximoAdd = totalOportunidades;
  
  // Limitar o total de oportunidades a no máximo 30% do valor base
  const limiteMaximo = base.total * 0.30;
  if (maximoAdd > limiteMaximo) {
    maximoAdd = arredondar(limiteMaximo);
  }
  
  if (totalOportunidades > 0) {
    minimoAdd = arredondar(totalOportunidades * 0.60);
  }
  
  if (modulos.length === 0 && score >= 10) {
    minimoAdd = arredondar(salario * (score / 100) * 0.10);
    maximoAdd = arredondar(salario * (score / 100) * 0.18);
  }
  
  // Garantir mínimo quando score é baixo
  if (score < 10 || modulos.length === 0) {
    const porcentagemMinima = 0.10 + (Math.random() * 0.02);
    const porcentagemMaxima = 0.15 + (Math.random() * 0.03);
    
    const addMinimo = arredondar(base.total * porcentagemMinima);
    const addMaximo = arredondar(base.total * porcentagemMaxima);
    
    if (minimoAdd < addMinimo) minimoAdd = addMinimo;
    if (maximoAdd < addMaximo) maximoAdd = addMaximo;
  }
  
  // Limitar máximo a 30% do valor base
  const limiteAbsoluto = base.total * 0.30;
  if (maximoAdd > limiteAbsoluto) {
    maximoAdd = arredondar(limiteAbsoluto);
  }
  if (minimoAdd > maximoAdd * 0.85) {
    minimoAdd = arredondar(maximoAdd * 0.70);
  }
  
  // Motivo padrão se não houver específicos
  const motivosFinais: MotivoOportunidade[] = motivos.length > 0 ? motivos : [{
    id: 'direitosEssenciais',
    texto: 'Na maioria dos casos, alguns direitos essenciais não são considerados no cálculo da rescisão.',
    icone: 'scale' as const,
  }];
  
  // Nome legível do tipo de rescisão
  const tiposRescisao: Record<string, string> = {
    'demissao_sem_justa_causa': 'Demissão sem justa causa',
    'pedido_demissao': 'Pedido de demissão',
    'justa_causa': 'Demissão por justa causa',
    'acordo': 'Rescisão por acordo (art. 484-A CLT)',
    'termino_contrato': 'Término de contrato temporário',
    'termino_antecipado_empregador': 'Término antecipado pelo empregador',
    'termino_antecipado_empregado': 'Término antecipado pelo empregado',
    'rescisao_indireta': 'Rescisão indireta',
  };
  
  return {
    valorBase: base.total,
    valorBruto: base.bruto,
    totalDescontos: base.descontos,
    detalhamento: base.detalhamento,
    verbas: base.verbas,
    
    valorPotencial,
    modulosOportunidade: modulos,
    
    mesesTrabalhados: base.mesesTrabalhados,
    anosCompletos: base.anosCompletos,
    diasNoMesFinal: base.diasNoMesFinal,
    tipoRescisao: tiposRescisao[formData.tipoDesligamento] || formData.tipoDesligamento,
    
    scoreOportunidade: score,
    motivos: motivosFinais,
    temSinaisOportunidade: true,
    
    minimoAdd,
    maximoAdd,
    valorPossivelMin: arredondar(base.total + minimoAdd),
    valorPossivelMax: arredondar(base.total + maximoAdd),
  };
}
