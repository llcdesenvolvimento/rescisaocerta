# Regras de Cálculo — Rescisão Certa (CLT 2026)

> Documento técnico-legal exaustivo. Contém TODAS as fórmulas, constantes, tabelas e regras condicionais usadas pelo motor `src/lib/calculadora-rescisao-completa.ts` (Parte 1 — Verbas) e `src/lib/calculo-extras.ts` (Parte 2 V2 — Pós-pagamento).

---

## ÍNDICE

1. Constantes legais 2026
2. Funções auxiliares (datas, regra dos 15 dias, aviso CLT)
3. Tabelas progressivas (INSS e IRRF)
4. Verbas rescisórias — fórmulas
5. Regras condicionais por tipo de rescisão
6. Descontos (INSS / IRRF / Aviso não cumprido)
7. Módulos de oportunidade (Parte 2)
8. DSR e Reflexos
9. Score de oportunidade e faixas Min/Max
10. Motor V2 (pós-pagamento) — adicionais finos

---

## 1. CONSTANTES LEGAIS 2026

| Constante | Valor | Fonte / Uso |
|-----------|-------|-------------|
| `SALARIO_MINIMO_2026` | **R$ 1.621,00** | Base para insalubridade |
| `TETO_INSS_2026` | **R$ 8.475,55** | Limite máximo de incidência INSS |
| `DEDUCAO_DEPENDENTE_IRRF` | **R$ 189,59** | Por dependente legal |
| `DIAS_UTEIS_MES` | **22** | Cálculo de DSR |
| `DIAS_DESCANSO_MES` | **4** | Cálculo de DSR |
| Divisor mensal salário→hora | **220** | Hora normal = salário ÷ 220 |
| Divisor mensal salário→dia | **30** | Dia de salário = salário ÷ 30 |
| Hora extra padrão | **+50%** | Mult. 1,5 (dias úteis) |
| Hora dom./feriado | **+100%** | Mult. 2,0 |
| Adicional noturno | **+20%** | Sobre hora normal |
| Hora noturna reduzida | **52min30s** | Divisor 0,875 |

---

## 2. FUNÇÕES AUXILIARES

### 2.1 Saldo de dias no mês final
```
diasNoMes = dia(dataDesligamento)
```
Se ausente, default = 15.

### 2.2 Meses trabalhados (totais, contínuos)
```
totalMeses = (anos × 12) + meses
se diaDesl < diaAdm → totalMeses -= 1
totalMeses = max(0, totalMeses)
```

### 2.3 Anos completos (para aviso prévio)
Conta apenas **aniversários completos** entre admissão e desligamento (CLT art. 487 + Lei 12.506/2011).
```
anos = anoDesl - anoAdm
se (mesDesl < mesAdm) OU (mesDesl == mesAdm E diaDesl < diaAdm)
  → anos -= 1
```

### 2.4 Regra dos 15 dias (13º e Férias proporcionais)
**REGRA CLT/Súmula 10 TST:** mês com **≥ 15 dias trabalhados** conta como mês cheio.

Aplicada a:
- 13º salário proporcional (1/12 por mês)
- Férias proporcionais (1/12 por mês)

Implementação por iteração mensal: para cada mês entre admissão (ou último aniversário) e desligamento (ou desligamento + projeção do aviso indenizado), conta-se o mês se dias trabalhados ≥ 15.

### 2.5 Projeção do contrato pelo aviso indenizado
Quando o aviso é **indenizado** em rescisões com `projetarContrato = true` (sem justa causa, indireta, acordo), o contrato é projetado por `diasAvisoPrevio` dias adiante para cálculo de 13º e férias proporcionais (Súmula 371 TST).

```
desligamentoEfetivo = dataDesligamento + diasAvisoPrevio (em dias)
```

### 2.6 Dias de aviso prévio (Lei 12.506/2011)
```
diasAdicionais = min(60, anosCompletos × 3)
diasAvisoPrevio = min(90, 30 + diasAdicionais)
```
- 0 anos → **30 dias**
- 1 ano → 33 dias
- 5 anos → 45 dias
- 20 anos ou mais → **90 dias** (teto)

---

## 3. TABELAS PROGRESSIVAS 2026

### 3.1 INSS 2026 (com dedução por faixa — método simplificado)

| Faixa (até R$) | Alíquota | Dedução |
|---|---|---|
| 1.621,00 | 7,5% | 0,00 |
| 2.902,84 | 9,0% | 24,32 |
| 4.354,27 | 12,0% | 111,40 |
| 8.475,55 | 14,0% | 198,49 |

Fórmula: `INSS = (base × alíquota) − dedução`, sendo `base = min(baseTributável, TETO_INSS_2026)`.

**Não incidem INSS:**
- Férias vencidas + 1/3
- Férias proporcionais + 1/3
- Aviso prévio indenizado
- Multa do FGTS

**Incidem INSS:**
- Saldo de salário
- 13º salário proporcional

### 3.2 IRRF 2026

| Faixa (até R$) | Alíquota | Dedução |
|---|---|---|
| 2.428,80 | 0% | 0,00 |
| 2.826,65 | 7,5% | 182,16 |
| 3.751,05 | 15% | 394,16 |
| 4.664,68 | 22,5% | 675,49 |
| ∞ | 27,5% | 908,73 |

### 3.3 Redutor mensal IRRF 2026
```
se renda ≤ R$ 5.000      → redutor = 312,89
se renda ≤ R$ 7.350      → redutor = 978,62 − (0,133145 × renda)
caso contrário           → redutor = 0
```

### 3.4 Cálculo do IRRF
```
baseTrib = saldoSalario + 13º
deducaoDep = numDependentes × 189,59
baseCalc = baseTrib − INSS − deducaoDep − redutor(baseTrib)
se baseCalc ≤ 0 → IRRF = 0
senão → IRRF = max(0, baseCalc × alíquota − dedução da faixa)
```

---

## 4. VERBAS RESCISÓRIAS — FÓRMULAS

Salário considerado: `S = salarioFixo + (temVariavel ? mediaVariavel : 0)`.
Salário-dia: `Sd = S / 30`. Salário-hora: `Sh = S / 220`.

### 4.1 Saldo de salário
```
saldoSalario = (S / 30) × diasNoMesFinal
```
Sempre devido (qualquer tipo de rescisão).

### 4.2 Aviso prévio indenizado
```
diasAviso = 30 + min(60, anos × 3)
avisoPrevio = (S / 30) × diasAviso
```
- Se tipo `acordo` (484-A CLT): `avisoPrevio × 50%`.
- Apenas quando `tipoAvisoPrevio ∈ {'indenizado', 'metade'}`.
- **Isento de INSS/IRRF.**

### 4.3 Desconto de aviso prévio não cumprido
Aplicável apenas em **pedido de demissão** com `tipoAvisoPrevio = 'nao_cumprido'`:
```
descontoAviso = (S / 30) × 30   (CLT art. 487 §2º)
```

### 4.4 13º salário proporcional
```
meses13 = contagem de meses ≥ 15 dias trabalhados no ano (com projeção do aviso quando aplicável)
13º = (S / 12) × meses13
```

### 4.5 Férias vencidas + 1/3 constitucional
```
feriasVencidas = S × periodosFeriasVencidas
1/3 vencidas    = feriasVencidas / 3
```
Devidas em **todos os tipos** (inclusive justa causa).

### 4.6 Férias proporcionais + 1/3
```
mesesFerias = contagem de meses ≥ 15 dias do período aquisitivo atual (com projeção do aviso)
feriasProp = (S / 12) × mesesFerias
1/3 prop    = feriasProp / 3
```
**NÃO** devidas em justa causa.

### 4.7 FGTS estimado e multa
```
fgtsEstimado = saldoFGTS informado OU (S × 0,08 × mesesTrabalhados)
multaFGTS    = fgtsEstimado × percentualMultaFgts
```

| Tipo de rescisão | Multa | Saque |
|---|---|---|
| Sem justa causa / indireta | **40%** | 100% |
| Acordo (484-A) | **20%** | 80% |
| Pedido de demissão | 0% | 0% |
| Justa causa | 0% | 0% |
| Término de contrato | 0% | 100% |

---

## 5. REGRAS CONDICIONAIS POR TIPO DE RESCISÃO

| Tipo | Saldo | Aviso | 13º Prop. | Férias Venc. | Férias Prop. | Multa FGTS | Saque FGTS | Seguro Des. | Projeta contrato |
|---|---|---|---|---|---|---|---|---|---|
| `demissao_sem_justa_causa` | ✅ | ✅ | ✅ | ✅ | ✅ | 40% | 100% | ✅ | ✅ |
| `rescisao_indireta` | ✅ | ✅ | ✅ | ✅ | ✅ | 40% | 100% | ✅ | ✅ |
| `acordo` (484-A) | ✅ | ✅ 50% | ✅ | ✅ | ✅ | 20% | 80% | ❌ | ✅ |
| `pedido_demissao` | ✅ | ❌* | ✅ | ✅ | ✅ | 0% | 0% | ❌ | ❌ |
| `justa_causa` | ✅ | ❌ | ❌ | ✅ | ❌ | 0% | 0% | ❌ | ❌ |
| `termino_contrato` | ✅ | ❌ | ✅ | ✅ | ✅ | 0% | 100% | ❌ | ❌ |
| `termino_antecipado_empregador` | ✅ | ❌ | ✅ | ✅ | ✅ | 0% | 100% | ❌ | ❌ |
| `termino_antecipado_empregado` | ✅ | ❌ | ✅ | ✅ | ✅ | 0% | 100% | ❌ | ❌ |

*Pedido de demissão com `tipoAvisoPrevio = 'nao_cumprido'` gera **desconto** de 30 dias.

---

## 6. DESCONTOS — ORDEM DE CÁLCULO

1. Calcula proventos isolados (saldo, aviso, 13º, férias, 1/3, multa).
2. Define `baseTributável = saldoSalario + 13º`.
3. Aplica **INSS** sobre baseTributável (tabela 3.1, com teto).
4. Aplica **IRRF** sobre `(baseTributável − INSS − dependentes − redutor)`.
5. Adiciona desconto de aviso (se houver).
6. `descontoEfetivo = min(totalDescontos, totalProventos)` (nunca negativo).
7. `totalLíquido = max(0, totalProventos − descontoEfetivo)`.

---

## 7. MÓDULOS DE OPORTUNIDADE (PARTE 2)

Cada módulo gera: `valorEstimado × M meses + DSR + reflexos`. Salário base: `S`. Meses: `M = mesesTrabalhados`.

### 7.1 Horas Extras
Hora extra = `(S / 220) × 1,5`. Estimativa por frequência:

| Resposta `faziaHorasExtras` | Horas/mês | Score |
|---|---|---|
| `sempre` (>10h/sem) | 48 | +18 |
| `quase_sempre` (5–10h/sem) | 30 | +14 |
| `vez_em_quando` | 20 | +8 |
| `raramente` | 10 | +4 |

```
he_principal_mes = (S/220) × 1,5 × horasMes
DSR_he           = he_principal_mes × (4/22)
base_mes         = he_principal_mes + DSR_he
total_HE         = (base_mes × M) + reflexos(base_mes × M, tipo)
```

### 7.2 Desvio / Acúmulo de Função

| Resposta `funcoesDiferentes` | % do salário | Score |
|---|---|---|
| `sim` (cargo superior confirmado) | **15%** | +15 |
| `nao_sei` (possível) | **10%** | +8 |
| Legados: `sempre` 20% / `quase_sempre` 15% / `vez_em_quando` 10% / `raramente` 5% | — | — |

```
desvio_mes  = S × pct
total_desvio = (desvio_mes × M) + reflexos(...)
```

### 7.3 Valores "Por Fora"
Se `valorPorFora = 'sim'`: estimativa de **15%** do salário/mês integrando férias, 13º e FGTS.
```
fora_mes  = S × 0,15
total_fora = (fora_mes × M) + reflexos(...)
```
Score: +18.

### 7.4 Insalubridade
**Base = SALÁRIO MÍNIMO** (R$ 1.621), não salário contratual. Padrão: grau médio (20%).

| Grau | % SM |
|---|---|
| Leve | 10% |
| Médio (default) | 20% |
| Grave | 40% |

```
insal_mes = SM × 0,20  // = R$ 324,20
total     = (insal_mes × M) + reflexos(...)
```
Score: +14.

### 7.5 Periculosidade
**Base = SALÁRIO BASE.** Percentual fixo: **30%**.
```
peric_mes = S × 0,30
total     = (peric_mes × M) + reflexos(...)
```
Score: +14.

### 7.6 Adicional Noturno
Hora noturna = hora normal ÷ 0,875 (redução ficta 52min30s). Adicional 20%.
Estimativa: 4h noturnas/dia × 20 dias = 80h/mês.
```
horaNormal     = S / 220
horaNoturna    = horaNormal / 0,875
adicional      = horaNoturna × 0,20
not_mes        = adicional × 80
DSR_not        = not_mes × (4/22)
total          = ((not_mes + DSR_not) × M) + reflexos(...)
```
Score: +12.

### 7.7 Erro/Suspeita na Rescisão
- `sim` → score +15
- `talvez` → score +8

---

## 8. DSR E REFLEXOS

### 8.1 DSR (Descanso Semanal Remunerado)
```
DSR = valorMensal × (4 / 22)  ≈ 18,18%
```
Aplicado sobre verbas remuneratórias com habitualidade (horas extras, adicional noturno).

### 8.2 Reflexos sobre verbas habituais
Fator de atenuação **0,55** (proteção para não inflar a estimativa).
```
ref13     = base / 12
refFerias = base / 12
refTerço  = refFerias / 3
fgts      = base × 0,08
multaFgts = fgts × {0,40 sem justa causa/indireta; 0,20 acordo; 0 demais}

reflexos = (ref13 + refFerias + refTerço + fgts + multaFgts) × 0,55
```

---

## 9. SCORE DE OPORTUNIDADE & FAIXAS MIN/MAX

```
score = soma dos scores dos módulos disparados (cap em 100)
```

### Faixa min/max para o cartão "Você pode ter direito a R$ X – Y"
```
totalOportunidades = soma dos totais dos módulos
maximoAdd = min(totalOportunidades, valorBase × 0,30)   // teto: 30% do valor base
minimoAdd = totalOportunidades × 0,60

Se nenhum módulo mas score ≥ 10:
  minimoAdd = S × (score/100) × 0,10
  maximoAdd = S × (score/100) × 0,18

Se score < 10 ou nenhum módulo:
  minimoAdd = valorBase × (10–12%)   (random)
  maximoAdd = valorBase × (15–18%)   (random)

Sempre: maximoAdd ≤ valorBase × 0,30
        minimoAdd ≤ maximoAdd × 0,85
```

Resultados finais:
```
valorPossivelMin = valorBase + minimoAdd
valorPossivelMax = valorBase + maximoAdd
valorPotencial   = valorBase + totalOportunidades
```

---

## 10. MOTOR V2 (PÓS-PAGAMENTO) — `calculo-extras.ts`

Após o pagamento, o usuário responde 3 etapas (Jornada, Adicionais, Valores extras) que **refinam** a Parte 2 com dados precisos.

### 10.1 Jornada real
- Horas extras semanais reais (entrada numérica) → substitui a estimativa por frequência.
- Carga horária semanal contratual (40h, 44h, 36h, 30h, etc.).
- Trabalho aos domingos/feriados (mult. 2,0).
- Dias de banco de horas não compensados.

### 10.2 Adicionais (refinados)
- Insalubridade: usuário escolhe grau real (10/20/40%).
- Periculosidade: confirma exposição.
- Noturno: horas reais entre 22h–5h.
- Sobreaviso: 1/3 da hora normal (CLT art. 244 §2º).

### 10.3 Valores extras
- Comissões/PLR não computadas.
- Gorjetas habituais.
- Diárias > 50% do salário (integração).
- Vale-refeição/transporte como salário utilidade.

### 10.4 Cálculo final V2
```
valorRefinado = valorBase (Parte 1) + somatório dos módulos refinados (Parte 2)
```
Os reflexos (DSR, 13º, férias, FGTS+multa) são recalculados sobre os valores reais com o mesmo fator 0,55.

---

## 11. EXEMPLO COMPLETO (NUMÉRICO)

**Cenário:** Demissão sem justa causa. Salário R$ 3.000. Admissão 01/03/2023, desligamento 20/06/2026. 1 dependente. Sem férias vencidas. Saldo FGTS estimado.

| Variável | Valor |
|---|---|
| Anos completos | 3 |
| Meses trabalhados | 39 |
| Dias no mês final | 20 |
| Dias aviso prévio | 30 + 9 = **39** |

**Verbas:**
- Saldo salário: 3.000/30 × 20 = **R$ 2.000,00**
- Aviso indenizado: 3.000/30 × 39 = **R$ 3.900,00**
- 13º (com projeção): meses ≥15 dias = **6** → 3.000/12 × 6 = **R$ 1.500,00**
- Férias prop. (com projeção): meses = **3** → 3.000/12 × 3 = **R$ 750,00**
- 1/3 férias: 750/3 = **R$ 250,00**
- FGTS estimado: 3.000 × 0,08 × 39 = **R$ 9.360,00**
- Multa 40%: **R$ 3.744,00**

**Descontos:**
- Base trib. INSS: 2.000 + 1.500 = **3.500**
- INSS (faixa 12%): 3.500 × 0,12 − 111,40 = **R$ 308,60**
- IRRF: base 3.500 − 308,60 − 189,59 − redutor(3.500) [≈ 312,89] = 2.688,92 → faixa 0% = **R$ 0,00**

**Totais:**
- Bruto: 2.000 + 3.900 + 1.500 + 750 + 250 + 3.744 = **R$ 12.144,00**
- Descontos: **R$ 308,60**
- Líquido: **R$ 11.835,40**

---

## 12. ARQUIVOS DE REFERÊNCIA NO CÓDIGO

| Responsabilidade | Arquivo |
|---|---|
| Motor principal (Parte 1 + 2) | `src/lib/calculadora-rescisao-completa.ts` |
| Motor V2 refinado | `src/lib/calculo-extras.ts` |
| Validações e helpers | `src/lib/calculo-refinado.ts`, `src/lib/rescisao-calculator.ts` |
| Tipos e contratos | `src/types/rescisao.ts`, `src/types/pos-pagamento-v2.ts` |
| Edge function persistência | `supabase/functions/salvar-calculo/index.ts` |

---

**Fim do documento.**
