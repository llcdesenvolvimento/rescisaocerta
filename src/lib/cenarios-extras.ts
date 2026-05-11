// ===============================================
// CENÁRIOS E DETALHAMENTO DE VERBAS EXTRAS
// ===============================================
// Para cada tipo de verba, monta a fórmula explicada, os passos
// do cálculo, e três cenários (pessimista, realista, otimista)
// ajustados às variáveis reais do caso.

import {
  DadosFluxoAnterior,
  FormularioPosPagamentoV2,
  ItemExtra,
  SALARIO_MINIMO_2026,
  SEMANAS_POR_MES,
} from '@/types/pos-pagamento-v2';
import { formatarMoeda } from '@/lib/calculo-extras';

export interface PassoCalculo {
  rotulo: string;
  valor: string;
}

export interface Cenario {
  titulo: string;
  descricao: string;
  valorMensal: number;
  multiplicador: number; // só para exibição
}

export interface DetalheExtra {
  baseLegal: string;
  formula: string;
  passos: PassoCalculo[];
  cenarios: [Cenario, Cenario, Cenario]; // pessimista, realista, otimista
  observacoes?: string[];
}

function tipoDaVerba(nome: string): string {
  const n = nome.toLowerCase();
  if (n.includes('hora')) return 'horas_extras';
  if (n.includes('noturno')) return 'adicional_noturno';
  if (n.includes('periculosidade')) return 'periculosidade';
  if (n.includes('insalubridade')) return 'insalubridade';
  if (n.includes('fora')) return 'por_fora';
  if (n.includes('desvio')) return 'desvio_funcao';
  return 'desconhecido';
}

export function gerarDetalheExtra(
  item: ItemExtra,
  dadosBase: DadosFluxoAnterior,
  formulario: FormularioPosPagamentoV2,
): DetalheExtra {
  const tipo = tipoDaVerba(item.nome);
  const salario = dadosBase.salarioBrutoMensal;
  const { jornada, adicionais } = formulario;
  const horasMes = jornada.cargaContratadaSemanaH * SEMANAS_POR_MES;
  const valorHora = salario / horasMes;

  switch (tipo) {
    case 'horas_extras': {
      const horasExtrasSemana = Math.max(
        0,
        jornada.cargaRealSemanaH - jornada.cargaContratadaSemanaH,
      );
      const horasExtrasMes = horasExtrasSemana * SEMANAS_POR_MES;
      const valorHoraExtra50 = valorHora * 1.5;
      const valorHoraExtra100 = valorHora * 2;
      const valorRealista = item.valorMensal;
      const valorPessimista = valorRealista * 0.5; // banco de horas absorve metade
      const valorOtimista = horasExtrasMes * valorHoraExtra100; // todas como 100% (domingo/feriado)

      return {
        baseLegal: 'CLT art. 7º, XVI · CF/88',
        formula: '(Salário ÷ horas no mês) × 1,5 × horas extras no mês',
        passos: [
          {
            rotulo: 'Valor da hora normal',
            valor: `${formatarMoeda(salario)} ÷ ${horasMes.toFixed(1)}h = ${formatarMoeda(valorHora)}`,
          },
          {
            rotulo: 'Valor da hora extra (50%)',
            valor: `${formatarMoeda(valorHora)} × 1,5 = ${formatarMoeda(valorHoraExtra50)}`,
          },
          {
            rotulo: 'Horas extras por mês',
            valor: `${horasExtrasSemana}h/semana × 4,33 = ${horasExtrasMes.toFixed(1)}h`,
          },
          {
            rotulo: 'Total mensal',
            valor: `${horasExtrasMes.toFixed(1)}h × ${formatarMoeda(valorHoraExtra50)} = ${formatarMoeda(valorRealista)}`,
          },
        ],
        cenarios: [
          {
            titulo: 'Pessimista',
            descricao: 'Empresa comprova banco de horas e compensação de parte das horas.',
            valorMensal: valorPessimista,
            multiplicador: 0.5,
          },
          {
            titulo: 'Realista',
            descricao: 'Todas as horas pagas com adicional de 50% (segunda a sábado).',
            valorMensal: valorRealista,
            multiplicador: 1,
          },
          {
            titulo: 'Otimista',
            descricao: 'Horas em domingo/feriado pagas com adicional de 100%.',
            valorMensal: valorOtimista,
            multiplicador: 2 / 1.5,
          },
        ],
        observacoes: [
          'Habituais geram reflexos em 13º, férias + 1/3, FGTS e aviso prévio (Súmula 376 TST).',
          jornada.controlePonto === 'sim'
            ? 'Empresa possui controle de ponto — facilita a prova.'
            : 'Sem controle de ponto formal, prova pode depender de testemunhas.',
        ],
      };
    }

    case 'adicional_noturno': {
      const horasNoturnasSemana = adicionais.horasNoturnasSemanaH || 0;
      const horasNoturnasMes = horasNoturnasSemana * SEMANAS_POR_MES;
      const valorRealista = item.valorMensal;
      const valorPessimista = valorRealista * 0.7; // sem hora ficta noturna reconhecida
      const valorOtimista = valorRealista * 1.14; // com hora ficta 52,5min

      return {
        baseLegal: 'CLT art. 73 · adicional de 20%',
        formula: 'Horas noturnas × valor-hora × 20%',
        passos: [
          {
            rotulo: 'Valor da hora normal',
            valor: `${formatarMoeda(valorHora)}`,
          },
          {
            rotulo: 'Adicional (20%)',
            valor: `${formatarMoeda(valorHora)} × 0,20 = ${formatarMoeda(valorHora * 0.2)}`,
          },
          {
            rotulo: 'Horas noturnas no mês',
            valor: `${horasNoturnasSemana}h/semana × 4,33 = ${horasNoturnasMes.toFixed(1)}h`,
          },
          {
            rotulo: 'Total mensal',
            valor: `${horasNoturnasMes.toFixed(1)}h × ${formatarMoeda(valorHora * 0.2)} = ${formatarMoeda(valorRealista)}`,
          },
        ],
        cenarios: [
          {
            titulo: 'Pessimista',
            descricao: 'Parte das horas reconhecidas como já pagas ou em horário misto.',
            valorMensal: valorPessimista,
            multiplicador: 0.7,
          },
          {
            titulo: 'Realista',
            descricao: 'Adicional de 20% sobre todas as horas trabalhadas entre 22h e 5h.',
            valorMensal: valorRealista,
            multiplicador: 1,
          },
          {
            titulo: 'Otimista',
            descricao: 'Aplicação da hora ficta noturna (52min30s = 1h), aumentando a base.',
            valorMensal: valorOtimista,
            multiplicador: 60 / 52.5,
          },
        ],
        observacoes: [
          'Considera-se noturno o trabalho entre 22h e 5h em zona urbana.',
          'Adicional habitual reflete em 13º, férias + 1/3, FGTS e aviso prévio.',
        ],
      };
    }

    case 'periculosidade': {
      const valorRealista = item.valorMensal; // 30% do salário base
      const valorPessimista = valorRealista * 0.5; // proporcional ao tempo de exposição
      const valorOtimista = valorRealista * 1.1; // base com reflexos médios já incorporados

      return {
        baseLegal: 'CLT art. 193 · adicional de 30%',
        formula: 'Salário-base × 30%',
        passos: [
          {
            rotulo: 'Salário-base',
            valor: `${formatarMoeda(salario)}`,
          },
          {
            rotulo: 'Percentual fixo',
            valor: '30%',
          },
          {
            rotulo: 'Total mensal',
            valor: `${formatarMoeda(salario)} × 0,30 = ${formatarMoeda(valorRealista)}`,
          },
        ],
        cenarios: [
          {
            titulo: 'Pessimista',
            descricao: 'Empresa comprova exposição intermitente — pagamento proporcional ao tempo de risco.',
            valorMensal: valorPessimista,
            multiplicador: 0.5,
          },
          {
            titulo: 'Realista',
            descricao: 'Adicional integral de 30% por exposição habitual a inflamáveis/eletricidade/segurança.',
            valorMensal: valorRealista,
            multiplicador: 1,
          },
          {
            titulo: 'Otimista',
            descricao: 'Adicional integral + reflexos em 13º, férias, FGTS e DSR.',
            valorMensal: valorOtimista,
            multiplicador: 1.1,
          },
        ],
        observacoes: [
          'Exige laudo técnico (LTCAT/PPRA) para comprovação.',
          'Súmula 191 TST: incide sobre salário-base, não sobre remuneração total.',
        ],
      };
    }

    case 'insalubridade': {
      const grau = adicionais.grauInsalubridade;
      let percentualUsado = 0.2;
      if (grau === 'minimo') percentualUsado = 0.1;
      else if (grau === 'maximo') percentualUsado = 0.4;
      const valorMin = SALARIO_MINIMO_2026 * 0.1;
      const valorMed = SALARIO_MINIMO_2026 * 0.2;
      const valorMax = SALARIO_MINIMO_2026 * 0.4;
      const valorRealista = item.valorMensal;

      return {
        baseLegal: 'CLT art. 192 · Súmula Vinculante 4 STF',
        formula: 'Salário mínimo × percentual do grau (10% / 20% / 40%)',
        passos: [
          {
            rotulo: 'Salário mínimo 2026',
            valor: `${formatarMoeda(SALARIO_MINIMO_2026)}`,
          },
          {
            rotulo: 'Grau aplicado',
            valor:
              grau === 'minimo'
                ? 'Mínimo (10%)'
                : grau === 'maximo'
                ? 'Máximo (40%)'
                : 'Médio (20%)',
          },
          {
            rotulo: 'Total mensal',
            valor: `${formatarMoeda(SALARIO_MINIMO_2026)} × ${(percentualUsado * 100).toFixed(0)}% = ${formatarMoeda(valorRealista)}`,
          },
        ],
        cenarios: [
          {
            titulo: 'Pessimista',
            descricao: 'Perícia classifica como grau mínimo (10% do salário mínimo).',
            valorMensal: valorMin,
            multiplicador: 0.1 / percentualUsado,
          },
          {
            titulo: 'Realista',
            descricao: `Grau ${grau === 'maximo' ? 'máximo' : grau === 'minimo' ? 'mínimo' : 'médio'} confirmado em perícia.`,
            valorMensal: valorRealista,
            multiplicador: 1,
          },
          {
            titulo: 'Otimista',
            descricao: 'Perícia eleva para grau máximo (40% do salário mínimo).',
            valorMensal: valorMax,
            multiplicador: 0.4 / percentualUsado,
          },
        ],
        observacoes: [
          'Não acumula com periculosidade — o trabalhador escolhe o mais vantajoso.',
          `Exemplo: mínimo ${formatarMoeda(valorMin)} · médio ${formatarMoeda(valorMed)} · máximo ${formatarMoeda(valorMax)}.`,
        ],
      };
    }

    case 'por_fora': {
      const valorRealista = item.valorMensal;
      const valorPessimista = valorRealista * 0.6; // só parte conseguida em prova
      // reflexos: FGTS 8% + 13º (1/12) + férias+1/3 (1/12 × 1.33) + DSR
      const valorComReflexos =
        valorRealista * (1 + 0.08 + 1 / 12 + (1 / 12) * 1.333);

      return {
        baseLegal: 'CLT art. 457, §1º · Súmula 354 TST',
        formula: 'Valor pago "por fora" + reflexos em FGTS, 13º, férias e aviso',
        passos: [
          {
            rotulo: 'Valor pago por fora declarado',
            valor: `${formatarMoeda(valorRealista)}/mês`,
          },
          {
            rotulo: 'Reflexo FGTS (8%)',
            valor: `+ ${formatarMoeda(valorRealista * 0.08)}/mês`,
          },
          {
            rotulo: 'Reflexo 13º (1/12)',
            valor: `+ ${formatarMoeda(valorRealista / 12)}/mês`,
          },
          {
            rotulo: 'Reflexo férias + 1/3 (1/12 × 1,33)',
            valor: `+ ${formatarMoeda((valorRealista / 12) * 1.333)}/mês`,
          },
        ],
        cenarios: [
          {
            titulo: 'Pessimista',
            descricao: 'Parte do "por fora" não é comprovada (sem prova testemunhal/documental).',
            valorMensal: valorPessimista,
            multiplicador: 0.6,
          },
          {
            titulo: 'Realista',
            descricao: 'Valor declarado integralmente reconhecido como salário, sem reflexos.',
            valorMensal: valorRealista,
            multiplicador: 1,
          },
          {
            titulo: 'Otimista',
            descricao: 'Reconhecimento como salário + reflexos em FGTS, 13º e férias.',
            valorMensal: valorComReflexos,
            multiplicador: valorComReflexos / valorRealista,
          },
        ],
        observacoes: [
          'Pagamento "por fora" caracteriza salário — gera FGTS, 13º, férias, INSS.',
          'Prova exige extratos, prints, testemunhas ou padrão de depósito.',
        ],
      };
    }

    case 'desvio_funcao': {
      const valorRealista = item.valorMensal;
      const valorPessimista = valorRealista * 0.5; // só parte das diferenças
      const valorOtimista = valorRealista * 1.3; // diferenças + reflexos

      return {
        baseLegal: 'CLT art. 460 · Súmula 6 TST',
        formula: 'Diferença salarial entre função real e função registrada',
        passos: [
          {
            rotulo: 'Diferença mensal estimada',
            valor: `${formatarMoeda(valorRealista)}`,
          },
          {
            rotulo: 'Reflexos potenciais',
            valor: '13º, férias + 1/3, FGTS, aviso prévio',
          },
        ],
        cenarios: [
          {
            titulo: 'Pessimista',
            descricao: 'Justiça reconhece desvio parcial ou por período limitado.',
            valorMensal: valorPessimista,
            multiplicador: 0.5,
          },
          {
            titulo: 'Realista',
            descricao: 'Diferença salarial integral pelo período do contrato.',
            valorMensal: valorRealista,
            multiplicador: 1,
          },
          {
            titulo: 'Otimista',
            descricao: 'Diferenças + reflexos em 13º, férias, FGTS e aviso prévio.',
            valorMensal: valorOtimista,
            multiplicador: 1.3,
          },
        ],
        observacoes: [
          'Equiparação salarial exige mesma função, mesma produtividade e até 4 anos de diferença.',
          'Prova depende de testemunhas e descrição real das atividades.',
        ],
      };
    }

    default: {
      const valorRealista = item.valorMensal;
      return {
        baseLegal: 'CLT',
        formula: 'Estimativa baseada nas respostas informadas',
        passos: [
          { rotulo: 'Valor mensal estimado', valor: formatarMoeda(valorRealista) },
        ],
        cenarios: [
          {
            titulo: 'Pessimista',
            descricao: 'Reconhecimento parcial em ação trabalhista.',
            valorMensal: valorRealista * 0.6,
            multiplicador: 0.6,
          },
          {
            titulo: 'Realista',
            descricao: 'Valor estimado integralmente.',
            valorMensal: valorRealista,
            multiplicador: 1,
          },
          {
            titulo: 'Otimista',
            descricao: 'Valor estimado + reflexos em verbas correlatas.',
            valorMensal: valorRealista * 1.3,
            multiplicador: 1.3,
          },
        ],
      };
    }
  }
}
