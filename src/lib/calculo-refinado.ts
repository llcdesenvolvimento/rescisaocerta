import { FormData } from '@/types/rescisao';
import { FormularioPosPagamento, ResultadoRefinado, NivelOportunidade, ItemVerba } from '@/types/pos-pagamento';

// ===============================================
// CONSTANTES CLT
// ===============================================

const SALARIO_MINIMO = 1518; // 2025

// ===============================================
// FUNÇÕES AUXILIARES
// ===============================================

function parseTempo(horario: string): { inicio: number; fim: number } | null {
  const match = horario.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;
  
  const inicioHoras = parseInt(match[1]);
  const inicioMinutos = parseInt(match[2]);
  const fimHoras = parseInt(match[3]);
  const fimMinutos = parseInt(match[4]);
  
  return {
    inicio: inicioHoras + inicioMinutos / 60,
    fim: fimHoras + fimMinutos / 60,
  };
}

function calcularHorasTrabalhadas(horario: string): number {
  const tempo = parseTempo(horario);
  if (!tempo) return 8; // default 8h
  
  let horas = tempo.fim - tempo.inicio;
  if (horas < 0) horas += 24; // virou a noite
  
  return Math.max(0, horas);
}

function calcularMesesEntreDatas(dataInicio: string, dataFim: string): number {
  if (!dataInicio || !dataFim) return 0;
  
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  const anos = fim.getFullYear() - inicio.getFullYear();
  const meses = fim.getMonth() - inicio.getMonth();
  const dias = fim.getDate() - inicio.getDate();
  
  let totalMeses = anos * 12 + meses;
  if (dias < 0) totalMeses--;
  
  return Math.max(0, totalMeses);
}

function calcularDiasTrabalhadosMes(dataDesligamento: string): number {
  if (!dataDesligamento) return 15;
  const data = new Date(dataDesligamento);
  return data.getDate();
}

function calcularAnosCompletos(mesesTrabalhados: number): number {
  return Math.floor(mesesTrabalhados / 12);
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

/**
 * Calcula reflexos sobre férias, 13º, FGTS e multa
 * CORRIGIDO: Recebe baseTotal (valor acumulado no período) ao invés de valorMensal
 * Fórmula consistente: reflexos = (baseTotal / 12) para cada verba
 */
function calcularReflexos(baseTotal: number, tipo: string): number {
  // Reflexo 13º = base_total ÷ 12
  const ref13 = baseTotal / 12;
  
  // Reflexo Férias = base_total ÷ 12
  const refFerias = baseTotal / 12;
  
  // Reflexo 1/3 Férias = reflexo férias ÷ 3
  const refTerco = refFerias / 3;
  
  // Reflexo FGTS = base_total × 8%
  const fgtsSobreBase = baseTotal * 0.08;
  
  // Multa sobre FGTS adicional (40% ou 20%)
  let multaSobreFgts = 0;
  if (tipo === 'demissao_sem_justa_causa' || tipo === 'rescisao_indireta') {
    multaSobreFgts = fgtsSobreBase * 0.40;
  } else if (tipo === 'acordo') {
    multaSobreFgts = fgtsSobreBase * 0.20;
  }
  
  return arredondar(ref13 + refFerias + refTerco + fgtsSobreBase + multaSobreFgts);
}

// ===============================================
// CÁLCULOS REFINADOS PÓS-PAGAMENTO
// ===============================================

export function calcularRescisaoRefinada(
  formDataBase: FormData,
  formPosPagamento: FormularioPosPagamento,
  valorBaseOriginal?: number // Valor base calculado pelo popup (opcional)
): ResultadoRefinado {
  const { jornada, valores, tempo } = formPosPagamento;
  const tipoRescisao = formDataBase.tipoDesligamento;
  
  // ===============================================
  // SALÁRIO BASE + ADICIONAIS (DADOS REAIS)
  // ===============================================
  
  let salarioBase = formDataBase.salarioFixo;
  
  // Adicionar comissões (dados reais pós-pagamento)
  if (valores.recebiaComissao && valores.mediaMensalComissao > 0) {
    salarioBase += valores.mediaMensalComissao;
  }
  
  // Adicionar valores por fora (integração salarial)
  if (valores.recebiaPorFora && valores.mediaMensalPorFora > 0) {
    salarioBase += valores.mediaMensalPorFora;
  }
  
  // Calcular adicionais mensais
  let valorAdicionaisMensal = 0;
  
  if (valores.insalubridade) {
    // Insalubridade: grau médio (20% do salário mínimo)
    valorAdicionaisMensal += SALARIO_MINIMO * 0.20;
  }
  
  if (valores.periculosidade) {
    // Periculosidade: 30% do salário base
    valorAdicionaisMensal += formDataBase.salarioFixo * 0.30;
  }
  
  if (valores.adicionalNoturno) {
    // Adicional noturno: 20% sobre horas noturnas (estimando 4h/dia)
    const salarioHora = salarioBase / 220;
    valorAdicionaisMensal += salarioHora * 0.20 * 4 * 22;
  }
  
  const salarioTotal = salarioBase + valorAdicionaisMensal;
  const salarioDia = salarioTotal / 30;
  const salarioHora = salarioTotal / 220;
  
  // ===============================================
  // TEMPO DE CONTRATO
  // ===============================================
  
  const mesesTrabalhados = calcularMesesEntreDatas(
    formDataBase.dataAdmissao,
    formDataBase.dataDesligamento
  );
  const anosCompletos = calcularAnosCompletos(mesesTrabalhados);
  const diasTrabalhados = calcularDiasTrabalhadosMes(formDataBase.dataDesligamento);
  
  // ===============================================
  // CÁLCULO DAS VERBAS (COM DADOS REFINADOS)
  // ===============================================
  
  const itens: ItemVerba[] = [];
  const principaisFatores: string[] = [];
  
  // ================================================================
  // 1. SALDO DE SALÁRIO
  // (salário ÷ 30) × dias trabalhados no mês
  // ================================================================
  const saldoSalario = arredondar(salarioDia * diasTrabalhados);
  itens.push({ nome: 'Saldo de salário', valor: saldoSalario });
  
  // ================================================================
  // 2. AVISO PRÉVIO PROPORCIONAL
  // 30 dias + 3 dias por ano (máximo 90 dias)
  // ================================================================
  let avisoPrevio = 0;
  let diasAviso = 0;
  
  if (tipoRescisao === 'demissao_sem_justa_causa' || tipoRescisao === 'acordo') {
    const avisoConfirmado = tempo.avisoPrevioConfirmado || formDataBase.tipoAvisoPrevio;
    
    if (avisoConfirmado === 'indenizado' || avisoConfirmado === 'metade') {
      diasAviso = Math.min(90, 30 + (anosCompletos * 3));
      avisoPrevio = arredondar(salarioDia * diasAviso);
      
      if (tipoRescisao === 'acordo' || avisoConfirmado === 'metade') {
        avisoPrevio = arredondar(avisoPrevio / 2);
      }
    }
  }
  itens.push({ nome: `Aviso prévio (${diasAviso} dias)`, valor: avisoPrevio });
  
  // Projeção para cálculos seguintes
  const projecaoAviso = avisoPrevio > 0 ? diasAviso : 0;
  
  // ================================================================
  // 3. 13º PROPORCIONAL
  // (salário ÷ 12) × meses no ano
  // Considerar projeção se aviso indenizado
  // ================================================================
  let decimoTerceiro = 0;
  let meses13 = 0;
  
  if (tipoRescisao !== 'justa_causa') {
    // Usar dados informados ou calcular
    meses13 = tempo.mesesTrabalhadosAnoRescisao || calcularMeses13(
      formDataBase.dataAdmissao, 
      formDataBase.dataDesligamento,
      projecaoAviso
    );
    decimoTerceiro = arredondar(salarioTotal * (meses13 / 12));
  }
  itens.push({ nome: `13º proporcional (${meses13}/12)`, valor: decimoTerceiro });
  
  // ================================================================
  // 4. FÉRIAS VENCIDAS + 1/3
  // ================================================================
  let feriasVencidasTotal = 0;
  
  if (formDataBase.periodosFeriasVencidas > 0 || tempo.tirouFeriasCorretamente === 'nao') {
    const feriasVencidas = salarioTotal;
    const tercoVencidas = feriasVencidas / 3;
    feriasVencidasTotal = arredondar(feriasVencidas + tercoVencidas);
    principaisFatores.push('Férias vencidas não gozadas identificadas');
  }
  itens.push({ nome: 'Férias vencidas + 1/3', valor: feriasVencidasTotal });
  
  // ================================================================
  // 5. FÉRIAS PROPORCIONAIS + 1/3
  // (salário ÷ 12) × meses do período aquisitivo
  // ================================================================
  let feriasProporcionaisTotal = 0;
  let mesesFerias = 0;
  
  if (tipoRescisao !== 'justa_causa') {
    // Calcular meses desde últimas férias
    if (tempo.quandoUltimasFerias) {
      const ultimasFerias = new Date(tempo.quandoUltimasFerias + '-01');
      const desligamento = new Date(formDataBase.dataDesligamento);
      mesesFerias = Math.max(0, 
        (desligamento.getFullYear() - ultimasFerias.getFullYear()) * 12 +
        (desligamento.getMonth() - ultimasFerias.getMonth())
      );
      mesesFerias = Math.min(12, mesesFerias);
    } else {
      mesesFerias = calcularMesesFerias(
        formDataBase.dataAdmissao,
        formDataBase.dataDesligamento,
        projecaoAviso
      );
    }
    
    const feriasProporcionais = salarioTotal * (mesesFerias / 12);
    const tercoProporcionais = feriasProporcionais / 3;
    feriasProporcionaisTotal = arredondar(feriasProporcionais + tercoProporcionais);
  }
  itens.push({ nome: `Férias proporcionais + 1/3 (${mesesFerias}/12)`, valor: feriasProporcionaisTotal });
  
  // ================================================================
  // 6. FGTS + MULTA
  // 8% × meses + multa 40% (sem justa causa) ou 20% (acordo)
  // ================================================================
  const fgtsEstimado = arredondar(salarioTotal * 0.08 * mesesTrabalhados);
  let fgtsMultaTotal = 0;
  let labelFgts = 'FGTS';
  
  if (tipoRescisao === 'demissao_sem_justa_causa') {
    const multa40 = arredondar(fgtsEstimado * 0.40);
    fgtsMultaTotal = fgtsEstimado + multa40;
    labelFgts = 'FGTS + multa 40%';
  } else if (tipoRescisao === 'acordo') {
    const multa20 = arredondar(fgtsEstimado * 0.20);
    fgtsMultaTotal = arredondar(fgtsEstimado * 0.80) + multa20; // Saque 80% + multa 20%
    labelFgts = 'FGTS (80%) + multa 20%';
  }
  itens.push({ nome: labelFgts, valor: fgtsMultaTotal });
  
  // ================================================================
  // 7. HORAS EXTRAS (CÁLCULO COM DADOS REAIS)
  // ================================================================
  let horasExtrasTotal = 0;
  
  const horasContratadas = calcularHorasTrabalhadas(jornada.horarioContratado);
  const intervaloContratado = 1; // 1h almoço padrão
  const horasLiquidasContratadas = horasContratadas - intervaloContratado;
  
  const horasReais = calcularHorasTrabalhadas(jornada.horarioRealMedio);
  const intervaloReal = jornada.intervaloAlmocoCompleto ? 1 : 0.5;
  const horasLiquidasReais = horasReais - intervaloReal;
  
  const horasExtrasDiarias = Math.max(0, horasLiquidasReais - horasLiquidasContratadas);
  
  if (horasExtrasDiarias > 0) {
    const valorHoraExtra = salarioHora * 1.5; // Adicional 50%
    const diasPorMes = jornada.diasTrabalhadosPorSemana * 4.33;
    const horasExtrasMes = horasExtrasDiarias * diasPorMes;
    
    // Calcular DSR sobre horas extras (aprox. 4 domingos/feriados por 22 dias úteis)
    const diasUteis = 22;
    const diasDescanso = 4;
    const valorMensalHE = horasExtrasMes * valorHoraExtra;
    const dsrHE = valorMensalHE * (diasDescanso / diasUteis);
    const baseRemuneratoriaMes = valorMensalHE + dsrHE;
    
    // Base total = valor mensal com DSR × meses
    let heBaseTotal = baseRemuneratoriaMes * mesesTrabalhados;
    
    // Adicionar sábados trabalhados (100% de adicional)
    if (jornada.trabalhavaSabados && jornada.diasTrabalhadosPorSemana <= 5) {
      const horasSabado = 8 * 4 * mesesTrabalhados; // 8h × 4 sábados × meses
      const valorSabados = horasSabado * salarioHora * 2; // 100% adicional
      heBaseTotal += valorSabados;
      principaisFatores.push('Trabalho aos sábados identificado');
    }
    
    // Reflexos calculados sobre a base total
    const reflexosHE = calcularReflexos(heBaseTotal, tipoRescisao);
    
    horasExtrasTotal = arredondar(heBaseTotal + reflexosHE);
    
    if (horasExtrasTotal > 0) {
      principaisFatores.push(`Aproximadamente ${horasExtrasDiarias.toFixed(1)}h extras por dia não computadas`);
    }
  }
  itens.push({ nome: 'Horas extras + reflexos', valor: horasExtrasTotal });
  
  // ================================================================
  // 8. ADICIONAIS (COM REFLEXOS)
  // ================================================================
  let adicionaisComReflexos = 0;
  
  if (valorAdicionaisMensal > 0) {
    // Base total = valor mensal × meses trabalhados
    const adicionaisBaseTotal = valorAdicionaisMensal * mesesTrabalhados;
    // Reflexos calculados sobre a base total
    const reflexos = calcularReflexos(adicionaisBaseTotal, tipoRescisao);
    adicionaisComReflexos = arredondar(adicionaisBaseTotal + reflexos);
    
    if (valores.insalubridade) {
      principaisFatores.push('Adicional de insalubridade devido');
    }
    if (valores.periculosidade) {
      principaisFatores.push('Adicional de periculosidade devido');
    }
    if (valores.adicionalNoturno) {
      principaisFatores.push('Adicional noturno identificado');
    }
  }
  
  if (valores.recebiaPorFora && valores.mediaMensalPorFora > 0) {
    principaisFatores.push('Valores "por fora" integrados aos cálculos');
  }
  if (valores.recebiaComissao && valores.mediaMensalComissao > 0) {
    principaisFatores.push('Comissões refletidas nas verbas');
  }
  
  itens.push({ nome: 'Adicionais + reflexos', valor: adicionaisComReflexos });
  
  // ===============================================
  // CÁLCULO FINAL
  // ===============================================
  
  // Garantir que todos os itens tenham valores não-negativos
  const itensCorrigidos = itens.map(item => ({
    ...item,
    valor: Math.max(0, arredondar(item.valor)),
  }));
  
  const valorRefinado = Math.max(0, itensCorrigidos.reduce((acc, item) => acc + item.valor, 0));
  
  // Usar valor base original do popup se disponível, senão calcular
  const valorBaseEstimado = valorBaseOriginal ?? calcularValorBaseSimples(formDataBase);
  
  // Garantir diferença não-negativa
  const diferenca = Math.max(0, valorRefinado - valorBaseEstimado);
  
  // Determinar nível de oportunidade
  let nivelOportunidade: NivelOportunidade = 'baixo';
  const percentualDiferenca = valorBaseEstimado > 0 ? (diferenca / valorBaseEstimado) * 100 : 0;
  
  if (percentualDiferenca > 25) {
    nivelOportunidade = 'alto';
  } else if (percentualDiferenca > 12) {
    nivelOportunidade = 'medio';
  }
  
  // Limitar fatores a 3 principais
  const fatoresFinais = principaisFatores.slice(0, 3);
  if (fatoresFinais.length === 0) {
    fatoresFinais.push('Cálculo refinado com base nos dados informados');
  }
  
  return {
    valor_base: arredondar(Math.max(0, valorBaseEstimado)),
    valor_refinado: arredondar(valorRefinado),
    diferenca: arredondar(diferenca),
    nivel_oportunidade: nivelOportunidade,
    principais_fatores: fatoresFinais,
    itens: itensCorrigidos,
    // Incluir dados informados pelo usuário para contexto no relatório
    dados_informados: {
      jornada: formPosPagamento.jornada,
      valores: formPosPagamento.valores,
      tempo: formPosPagamento.tempo,
    },
  };
}

// ===============================================
// FUNÇÕES AUXILIARES DE CÁLCULO
// ===============================================

function calcularMeses13(
  dataAdmissao: string,
  dataDesligamento: string,
  diasProjecao: number = 0
): number {
  if (!dataDesligamento) return 0;
  
  const admissao = new Date(dataAdmissao);
  let desligamento = new Date(dataDesligamento);
  
  if (diasProjecao > 0) {
    desligamento = new Date(desligamento.getTime() + diasProjecao * 24 * 60 * 60 * 1000);
  }
  
  const anoDesligamento = desligamento.getFullYear();
  const mesInicio = admissao.getFullYear() === anoDesligamento ? admissao.getMonth() : 0;
  const mesFinal = desligamento.getMonth();
  
  let meses = 0;
  for (let m = mesInicio; m <= mesFinal; m++) {
    if (m === mesInicio && admissao.getFullYear() === anoDesligamento) {
      const diasNoMes = new Date(anoDesligamento, m + 1, 0).getDate();
      if (diasNoMes - admissao.getDate() + 1 >= 15) meses++;
    } else if (m === mesFinal) {
      if (desligamento.getDate() >= 15) meses++;
    } else {
      meses++;
    }
  }
  
  return Math.min(12, meses);
}

function calcularMesesFerias(
  dataAdmissao: string,
  dataDesligamento: string,
  diasProjecao: number = 0
): number {
  if (!dataAdmissao || !dataDesligamento) return 0;
  
  const admissao = new Date(dataAdmissao);
  let desligamento = new Date(dataDesligamento);
  
  if (diasProjecao > 0) {
    desligamento = new Date(desligamento.getTime() + diasProjecao * 24 * 60 * 60 * 1000);
  }
  
  // Encontrar último aniversário
  let ultimoAniversario = new Date(admissao);
  while (ultimoAniversario <= desligamento) {
    const proximo = new Date(ultimoAniversario);
    proximo.setFullYear(proximo.getFullYear() + 1);
    if (proximo > desligamento) break;
    ultimoAniversario = proximo;
  }
  
  // Calcular meses desde último aniversário
  let meses = 0;
  let mesAtual = new Date(ultimoAniversario);
  
  while (mesAtual <= desligamento && meses < 12) {
    const proximoMes = new Date(mesAtual);
    proximoMes.setMonth(proximoMes.getMonth() + 1);
    
    if (mesAtual.getTime() === ultimoAniversario.getTime()) {
      const diasNoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
      if (diasNoMes - mesAtual.getDate() + 1 >= 15) meses++;
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
 * Cálculo simplificado do valor base (para comparação)
 * Usa apenas dados iniciais, sem refinamentos
 */
function calcularValorBaseSimples(formData: FormData): number {
  const salario = formData.salarioFixo;
  const mesesTrabalhados = calcularMesesEntreDatas(
    formData.dataAdmissao,
    formData.dataDesligamento
  );
  const anosCompletos = calcularAnosCompletos(mesesTrabalhados);
  const diasTrabalhados = calcularDiasTrabalhadosMes(formData.dataDesligamento);
  const salarioDia = salario / 30;
  const tipo = formData.tipoDesligamento;
  
  let total = 0;
  
  // 1. Saldo salário
  total += salarioDia * diasTrabalhados;
  
  // 2. Aviso prévio proporcional
  if (tipo === 'demissao_sem_justa_causa') {
    const diasAviso = Math.min(90, 30 + (anosCompletos * 3));
    if (formData.tipoAvisoPrevio === 'indenizado' || formData.tipoAvisoPrevio === 'metade') {
      total += salarioDia * diasAviso;
    }
  } else if (tipo === 'acordo') {
    if (formData.tipoAvisoPrevio === 'indenizado' || formData.tipoAvisoPrevio === 'metade') {
      total += (salarioDia * 30) / 2;
    }
  }
  
  // 3. 13º proporcional
  if (tipo !== 'justa_causa') {
    const meses13 = calcularMeses13(formData.dataAdmissao, formData.dataDesligamento);
    total += salario * (meses13 / 12);
  }
  
  // 4. Férias vencidas + 1/3
  if (formData.periodosFeriasVencidas > 0) {
    total += (salario + (salario / 3)) * formData.periodosFeriasVencidas;
  }
  
  // 5. Férias proporcionais + 1/3
  if (tipo !== 'justa_causa') {
    const mesesFerias = calcularMesesFerias(formData.dataAdmissao, formData.dataDesligamento);
    const ferias = salario * (mesesFerias / 12);
    total += ferias + (ferias / 3);
  }
  
  // 6. FGTS + multa
  const fgts = salario * 0.08 * mesesTrabalhados;
  if (tipo === 'demissao_sem_justa_causa') {
    total += fgts + (fgts * 0.40);
  } else if (tipo === 'acordo') {
    total += (fgts * 0.80) + (fgts * 0.20);
  }
  
  return arredondar(total);
}
