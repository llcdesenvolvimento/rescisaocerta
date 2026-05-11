/**
 * Testes da calculadora de rescisão (CLT 2026).
 *
 * Cobre os 4 bugs críticos corrigidos na auditoria de 2026-05-10:
 *   1. Redutor IRRF aplicado no IMPOSTO (não na base)
 *   2. INSS e IRRF separados entre saldo de salário e 13º
 *   3. Projeção de aviso indenizado cruzando ano civil
 *   4. termino_antecipado_empregador com multa 40% e equiparado a sem justa causa
 *
 * Cada caso usa valores conferidos manualmente contra:
 *   - Portaria MPS/MF 13/2026 (INSS)
 *   - Lei 15.270/2025 (redutor IRRF)
 *   - CLT, Lei 12.506/2011, Súmulas TST aplicáveis
 */

import { describe, it, expect } from 'vitest';
import { calcularRescisaoCompleta } from './calculadora-rescisao-completa';
import type { FormData } from '@/types/rescisao';

// Helper pra montar um FormData válido sem repetir todas as 30 propriedades
function makeFormData(overrides: Partial<FormData>): FormData {
  return {
    // Bloco 1
    situacaoAtual: 'ja_saiu',
    objetivo: 'simular',
    tipoDesligamento: 'demissao_sem_justa_causa',
    dataAdmissao: '2024-01-01',
    dataDesligamento: '2026-05-10',
    aindaTrabalhando: false,
    salarioFixo: 3000,
    mediaVariavel: 0,
    temVariavel: false,
    // Bloco 2
    periodosFeriasVencidas: 0,
    mesesDesdeUltimaFerias: 0,
    mesesTrabalhados2026: 0,
    tipoAvisoPrevio: 'indenizado',
    anosServico: 0,
    saldoFGTS: 0,
    sabeSaldoFGTS: false,
    numDependentes: 0,
    // Bloco 3 — vazios pra não disparar módulos de oportunidade
    faziaHorasExtras: 'nao_fazia',
    bancoHoras: '',
    controlePonto: '',
    exerciaFuncoesDiferentes: '',
    funcoesDiferentes: 'nao_fazia',
    diferencaSalarialEstimada: 0,
    valorPorFora: 'nao',
    valorPorForaMensal: 0,
    adicionaisTrabalho: [],
    recebiaAdicionalNoturno: '',
    horasNoturnasSemana: '',
    grauInsalubridade: '',
    recebiaInsalubridade: '',
    recebiaPericulosidade: '',
    erroNaRescisao: '',
    ...overrides,
  } as FormData;
}

describe('calcularRescisaoCompleta — verbas básicas', () => {
  it('demissão sem justa causa — 2 anos e 4 meses, salário R$ 3.000', () => {
    // Salário R$ 3.000, admissão 01/01/2024, desligamento 10/05/2026.
    // Anos completos: 2 (2024-01-01 → 2026-01-01). Aviso: 30 + 3*2 = 36 dias.
    // Saldo: 3000/30 * 10 = 1000.
    // 13º proporcional 2026 (jan-mai com aviso 36d projetando até 15/jun):
    //   jan, fev, mar, abr, mai e jun (15 dias projetados) = 6 meses → 3000/12*6 = 1500.
    // Férias vencidas: 0 períodos.
    // Férias proporcionais: período aquisitivo desde 01/01/2026 até ~15/jun = 5+ meses.
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2024-01-01',
      dataDesligamento: '2026-05-10',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.saldoSalario).toBe(1000);
    expect(result!.detalhamento.diasAvisoPrevio).toBe(36);
    expect(result!.detalhamento.avisoPrevio).toBe(3600); // 100 * 36
    expect(result!.detalhamento.percentualMultaFgts).toBe(40);
    // 13º com projeção (jan a jun = 6 meses)
    expect(result!.detalhamento.meses13).toBe(6);
    expect(result!.detalhamento.decimoTerceiro).toBe(1500);
  });

  it('pedido de demissão — sem aviso, sem multa FGTS', () => {
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'pedido_demissao',
      dataAdmissao: '2025-01-15',
      dataDesligamento: '2026-03-20',
      salarioFixo: 4000,
      tipoAvisoPrevio: 'trabalhado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.avisoPrevio).toBe(0); // sem aviso pago
    expect(result!.detalhamento.percentualMultaFgts).toBe(0);
    expect(result!.detalhamento.multaFgts).toBe(0);
    // 13º proporcional: mar tem >= 15 dias (20) → conta. Janeiro e fevereiro contam. = 3
    expect(result!.detalhamento.meses13).toBe(3);
  });

  it('justa causa — apenas saldo + férias vencidas + 1/3 (Súmula 171 TST)', () => {
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'justa_causa',
      dataAdmissao: '2023-06-01',
      dataDesligamento: '2026-04-15',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'nao_se_aplica',
      periodosFeriasVencidas: 1,
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.saldoSalario).toBe(1500); // 3000/30 * 15
    expect(result!.detalhamento.decimoTerceiro).toBe(0); // sem 13º proporcional
    expect(result!.detalhamento.feriasProporcionais).toBe(0); // sem férias proporcionais
    expect(result!.detalhamento.feriasVencidas).toBe(3000); // 1 período
    expect(result!.detalhamento.tercoConstitucionalVencidas).toBe(1000); // 3000/3
    expect(result!.detalhamento.multaFgts).toBe(0);
    expect(result!.detalhamento.avisoPrevio).toBe(0);
  });

  it('acordo (484-A) — aviso pela metade, multa 20% FGTS', () => {
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'acordo',
      dataAdmissao: '2024-03-01',
      dataDesligamento: '2026-03-15',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado', // pago pela metade no acordo
      saldoFGTS: 5000,
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.percentualMultaFgts).toBe(20);
    expect(result!.detalhamento.multaFgts).toBe(1000); // 5000 * 20%
    // Aviso pela metade: anos completos = 2, dias = 36, valor = 3000/30 * 36 = 3600, metade = 1800
    expect(result!.detalhamento.diasAvisoPrevio).toBe(36);
    expect(result!.detalhamento.avisoPrevio).toBe(1800);
  });

  it('acordo (484-A) — aviso é devido mesmo se usuário responder "trabalhado" (bug fix)', () => {
    // Antes da correção: se o usuário marcasse `trabalhado` em acordo, o calculador
    // não pagava o aviso (somente disparava em `indenizado`/`metade`). Mas o art.
    // 484-A §1º, II garante o aviso pela metade SEMPRE no acordo — esteja ele
    // sendo cumprido ou indenizado.
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'acordo',
      dataAdmissao: '2024-03-01',
      dataDesligamento: '2026-03-15',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'trabalhado',
      saldoFGTS: 5000,
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.diasAvisoPrevio).toBe(36);
    expect(result!.detalhamento.avisoPrevio).toBe(1800);
  });
});

describe('calcularRescisaoCompleta — bug 4 (término antecipado pelo empregador)', () => {
  it('término antecipado pelo empregador deve ter multa 40% (art. 479 CLT)', () => {
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'termino_antecipado_empregador',
      dataAdmissao: '2025-10-01',
      dataDesligamento: '2026-04-15',
      salarioFixo: 2000,
      tipoAvisoPrevio: 'nao_se_aplica',
      saldoFGTS: 800,
    }));

    expect(result).not.toBeNull();
    // Antes da correção: 0% de multa (bug). Após correção: 40%.
    expect(result!.detalhamento.percentualMultaFgts).toBe(40);
    expect(result!.detalhamento.multaFgts).toBe(320); // 800 * 40%
  });

  it('término natural de contrato a prazo — sem multa 40%', () => {
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'termino_contrato',
      dataAdmissao: '2025-10-01',
      dataDesligamento: '2026-04-01',
      salarioFixo: 2000,
      tipoAvisoPrevio: 'nao_se_aplica',
      saldoFGTS: 800,
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.percentualMultaFgts).toBe(0);
    expect(result!.detalhamento.multaFgts).toBe(0);
  });
});

describe('calcularRescisaoCompleta — estimativa de FGTS', () => {
  it('estima FGTS contando meses calendário + FGTS sobre 13º (acordo 02/04/2024→31/12/2026, R$ 3000)', () => {
    // Cenário reportado pelo usuário em 2026-05-10.
    // Meses calendário com depósito: abr/2024 a dez/2026 = 33 meses.
    // FGTS sobre salários: 8% × 3000 × 33 = R$ 7.920,00
    // FGTS sobre 13º por ano:
    //   2024 — abr a dez = 9 meses → 13º = 3000/12*9 = 2250 → 8% = 180
    //   2025 — jan a dez = 12 meses → 13º = 3000 → 8% = 240
    //   2026 — jan a dez = 12 meses → 13º = 3000 → 8% = 240
    // Total FGTS estimado: 7920 + 180 + 240 + 240 = R$ 8.580,00
    // Multa 20% (acordo) sobre R$ 8.580 = R$ 1.716,00
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'acordo',
      dataAdmissao: '2024-04-02',
      dataDesligamento: '2026-12-31',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'trabalhado',
      saldoFGTS: 0, // força estimativa
      sabeSaldoFGTS: false,
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.fgtsEstimado).toBeCloseTo(8580, 0);
    expect(result!.detalhamento.multaFgts).toBeCloseTo(1716, 0);
  });

  it('FGTS estimado considera 33 meses calendário (não 32 completos) para contrato 02/04/2024→31/12/2026', () => {
    // Bug original: usava `meses completos entre datas` (32), resultando em base subestimada.
    // Após correção: 33 meses calendário (abr/24 a dez/26 inclusive).
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2024-04-02',
      dataDesligamento: '2026-12-31',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
      saldoFGTS: 0,
      sabeSaldoFGTS: false,
    }));

    expect(result).not.toBeNull();
    // 8% × 3000 × 33 = 7920 (sobre salários, sem 13º)
    // 13º: 180+240+240 = 660
    // Total: 8580
    expect(result!.detalhamento.fgtsEstimado).toBeCloseTo(8580, 0);
  });
});

describe('calcularRescisaoCompleta — bug 1 (redutor IRRF aplicado no IMPOSTO)', () => {
  it('salário R$ 3.000 — IRRF deve ficar ISENTO por força do redutor', () => {
    // Saldo de salário de R$ 3.000 está abaixo do teto da isenção (R$ 5.000).
    // INSS sobre R$ 3.000: 3000*12% - 111,40 = 248,60.
    // Base IRRF: 3000 - 248,60 = 2.751,40. Pela tabela: < 2.826,65 → 7,5% - 182,16
    //   = 206,36 - 182,16 = 24,20.
    // Redutor (renda ≤ R$ 5k) = R$ 312,89 → MAX(0, 24,20 - 312,89) = 0.
    // Antes da correção: redutor era aplicado na base, daria valor positivo.
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'pedido_demissao', // só pra simplificar; só queremos o saldo de salário
      dataAdmissao: '2026-05-01',
      dataDesligamento: '2026-05-30', // 30 dias = saldo de R$ 3.000 cheio
      salarioFixo: 3000,
      tipoAvisoPrevio: 'trabalhado',
    }));

    expect(result).not.toBeNull();
    // O IRRF total deve ser 0 ou muito próximo de 0 (isenção pela Lei 15.270/2025)
    expect(result!.detalhamento.descontoIRRF).toBe(0);
  });

  it('salário R$ 10.000 — IRRF deve ser POSITIVO (acima do teto do redutor)', () => {
    // Saldo de R$ 10.000 está acima de R$ 7.350 → redutor = 0 → tabela progressiva pura.
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'pedido_demissao',
      dataAdmissao: '2026-05-01',
      dataDesligamento: '2026-05-30',
      salarioFixo: 10000,
      tipoAvisoPrevio: 'trabalhado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.descontoIRRF).toBeGreaterThan(0);
  });
});

describe('calcularRescisaoCompleta — bug 2 (INSS e IRRF separados saldo vs 13º)', () => {
  it('INSS deve ser a SOMA dos cálculos separados de saldo e 13º', () => {
    // Salário 3000, demissão sem justa causa em 30/06/2026, admissão 01/01/2025.
    // Saldo: 3000/30 * 30 = 3000.
    // 13º: jan-jun + projeção do aviso (33 dias com 1 ano) → jul tem dias projetados.
    // Aviso 33 dias projeta de 01/jul até 02/ago. Para 13º do ano: jul conta (≥15 dias), ago não.
    // Meses 13: jan-jul = 7 → 13º = 3000/12*7 = 1750.
    //
    // INSS separado:
    //   - sobre 3000: 12% * 3000 - 111,40 = 248,60
    //   - sobre 1750: 9% * 1750 - 24,32 = 157,50 - 24,32 = 133,18
    //   - total: 381,78
    // Antes da correção (somava 3000+1750=4750): 12% * 4750 - 111,40 = 458,60 (errado, maior)
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2025-01-01',
      dataDesligamento: '2026-06-30',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.saldoSalario).toBe(3000);
    expect(result!.detalhamento.meses13).toBe(7);
    expect(result!.detalhamento.decimoTerceiro).toBe(1750);
    // INSS = 248,60 (saldo) + 133,18 (13º) = 381,78. Antes da correção: 458,60.
    expect(result!.detalhamento.descontoINSS).toBeCloseTo(381.78, 1);
  });
});

describe('calcularRescisaoCompleta — bug 3 (projeção de aviso cruzando ano civil)', () => {
  it('desligamento em dez/2026 com aviso projetando jan/2027 — 13º não deve perder meses', () => {
    // Salário 3000, admissão 01/01/2026, desligamento 20/12/2026.
    // Aviso 30 dias projeta para 19/01/2027.
    // 13º do ano de 2026: jan a dez (todos cheios + dez tem >=15 dias) = 12 meses → 13º = 3000.
    // Antes da correção: pegava o ano da projeção (2027), começando em mesInicio=0 e
    //   mesFinal=0 (janeiro) → contava só 1 mês ou zero. Bug perdia 11+ meses.
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2026-01-01',
      dataDesligamento: '2026-12-20',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.meses13).toBe(12);
    expect(result!.detalhamento.decimoTerceiro).toBe(3000);
  });

  it('desligamento em meio-ano sem cruzar ano civil — projeção normal', () => {
    // Sanidade: a correção do bug 3 não pode quebrar o caso comum.
    // Desligamento em 10/05/2026 com aviso 30d projeta para 09/06/2026 (mesmo ano).
    // 13º: jan, fev, mar, abr, mai, jun (jun com 9 dias projetados, < 15) = 5 meses.
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2026-01-01',
      dataDesligamento: '2026-05-10',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
    }));

    expect(result).not.toBeNull();
    // Aviso = 30 dias (0 anos completos), projeta de 10/mai + 30 = 09/jun. jun < 15 dias.
    expect(result!.detalhamento.diasAvisoPrevio).toBe(30);
    expect(result!.detalhamento.meses13).toBe(5);
  });
});

describe('calcularRescisaoCompleta — isenções fiscais', () => {
  it('aviso prévio indenizado NÃO entra na base de INSS/IRRF (Súmula 688 STF)', () => {
    // Admissão 01/04/2026, demissão 30/04/2026, salário R$ 2.000.
    // Aviso indenizado de 30 dias projeta até 30/05/2026 → 13º conta abr + mai = 2 meses.
    //
    // Verbas tributáveis para INSS/IRRF:
    //   - Saldo R$ 2.000 (faixa 2, 9%): 2000*0.09 − 24.32 = R$ 155,68
    //   - 13º R$ 333,33 (faixa 1, 7.5%): 333.33*0.075 = R$ 25,00
    //   - Total INSS: R$ 180,68
    //
    // O aviso indenizado de R$ 2.000 e o 1/3 de R$ 111,11 NÃO entram na base
    // (são verbas indenizatórias). Se entrassem, o INSS subiria para faixa 3 ou 4.
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2026-04-01',
      dataDesligamento: '2026-04-30',
      salarioFixo: 2000,
      tipoAvisoPrevio: 'indenizado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.avisoPrevio).toBe(2000);
    expect(result!.detalhamento.descontoINSS).toBeCloseTo(180.68, 1);
  });

  it('férias indenizadas e 1/3 NÃO entram na base de INSS/IRRF (Súm. 386 STJ)', () => {
    // Salário 3000, admissão 01/01/2024, demissão 15/01/2026. Aviso projeta 36 dias (2 anos).
    // 1 período de férias vencidas (= R$ 3.000 + R$ 1.000 de 1/3).
    //
    // 13º 2026 com projeção: jan (15 dias ≥15) + fev (20 dias projetados ≥15) = 2 meses → R$ 500.
    // Saldo de salário (15 dias): R$ 1.500.
    //
    // Verbas tributáveis (saldo + 13º) na base INSS/IRRF:
    //   - INSS saldo R$ 1.500 (faixa 1, 7.5%): R$ 112,50
    //   - INSS 13º R$ 500 (faixa 1, 7.5%): R$ 37,50
    //   - Total: R$ 150,00
    //
    // As férias vencidas (R$ 3.000) e o 1/3 (R$ 1.000) NÃO entram na base.
    // Se entrassem, INSS subiria para R$ 480+ (faixa 12%).
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2024-01-01',
      dataDesligamento: '2026-01-15',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
      periodosFeriasVencidas: 1,
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.feriasVencidas).toBe(3000);
    expect(result!.detalhamento.tercoConstitucionalVencidas).toBe(1000);
    expect(result!.detalhamento.descontoINSS).toBeCloseTo(150.0, 1);
  });
});

describe('calcularRescisaoCompleta — aviso prévio (Lei 12.506/2011)', () => {
  it('menos de 1 ano de contrato → 30 dias de aviso (sem proporcional)', () => {
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2026-01-01',
      dataDesligamento: '2026-06-30',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.diasAvisoPrevio).toBe(30);
  });

  it('5 anos completos → 45 dias de aviso (30 + 5*3)', () => {
    // 5 anos completos = entre 2020-06-01 e 2025-12-31 (5 aniversários completos)
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2020-06-01',
      dataDesligamento: '2025-12-31',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.diasAvisoPrevio).toBe(45);
  });

  it('contrato muito antigo (25 anos) → tetado em 90 dias', () => {
    const result = calcularRescisaoCompleta(makeFormData({
      tipoDesligamento: 'demissao_sem_justa_causa',
      dataAdmissao: '2000-01-01',
      dataDesligamento: '2026-01-15',
      salarioFixo: 3000,
      tipoAvisoPrevio: 'indenizado',
    }));

    expect(result).not.toBeNull();
    expect(result!.detalhamento.diasAvisoPrevio).toBe(90);
  });
});
