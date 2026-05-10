# Rescisão Certa — Documento de Contexto Completo

> Documento mestre de regras de negócio, variáveis, fluxos, integrações e cálculos.
> Mantido em `docs/CONTEXTO-COMPLETO-DO-PROJETO.md`. Última atualização: 2026-04.

---

## 1. Visão Geral do Produto

**Rescisão Certa** é uma calculadora de rescisão trabalhista que estima quanto o trabalhador deve receber, identifica oportunidades de verbas não pagas (horas extras, desvio de função, "por fora", adicionais) e entrega um relatório completo após pagamento via PIX.

- **Marca:** Rescisão Certa (LLC Desenvolvimento Digital LTDA)
- **Domínio:** rescisaocerta.com.br
- **Modelo:** Funil de quiz → resultado parcial bloqueado → pagamento PIX (R$ 14,90) → relatório completo
- **Tom:** Persuasivo, protetor, sem em-dashes (—). Usar "informações" em vez de "dados". Evitar a palavra "TRCT".

---

## 2. Stack Técnico

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 5 + TypeScript 5 |
| Estilo | Tailwind CSS v3 (semantic tokens em `index.css` e `tailwind.config.ts`) |
| UI | shadcn/ui |
| Estado | React Query, sessionStorage |
| Backend | Lovable Cloud (Supabase) |
| Banco | Postgres + RLS |
| Edge Functions | Deno (Supabase Edge) |
| IA | Lovable AI Gateway — modelo `google/gemini-2.5-flash` (relatórios) e `openai/gpt-5` (algumas funções) |
| Pagamento | Pagar.me (PIX) |
| Analytics | Google Tag Manager (GTM-W73WB8HR), Google Ads |
| Anúncios | Google AdSense (ca-pub-7576448039643558) — apenas no blog, desativado no quiz |

---

## 3. Mapa de Rotas

| Rota | Componente | Descrição |
|---|---|---|
| `/` | `Blog` | **Home é o blog** (estratégia SEO) |
| `/blog` | `Blog` | Lista de artigos |
| `/blog/:slug` | `BlogPost` | Artigo individual |
| `/test` | `Index` | Landing do quiz/calculadora |
| `/quiz/:step` | `Quiz` | Funil de perguntas (etapas 1 a 4) |
| `/resultado` | `Resultado` | Tela de risco + valor parcial bloqueado |
| `/pagamento` | `Resultado` | Mesma tela, foco no checkout PIX |
| `/pos-pagamento` | `PosPagamentoConfirmacao` | Confirmação de pagamento + form V2 |
| `/relatorio` | `Relatorio` | Relatório completo (apenas se `status='pago'`) |
| `/sobre-nos`, `/contato`, `/termos-de-uso`, `/politica-de-privacidade` | Páginas institucionais | |

**Regras de navegação:**
- `ScrollToTop` força scroll instantâneo a cada mudança de rota.
- Clicar no logo em fluxo de quiz mantém o usuário no quiz (sessionStorage guarda passo atual).
- Em `/resultado` (free), confirmar saída antes de sair. Em `/relatorio` (pago), navegação para trás é desabilitada.

---

## 4. Estrutura de Pastas Relevante

```
src/
├── App.tsx                 # Rotas principais
├── pages/                  # Páginas (Blog, Quiz, Resultado, Relatorio…)
├── components/
│   ├── layout/             # Header, Footer, Logo, FAQ, ComoFunciona
│   ├── quiz-funnel/        # Fluxo do quiz (QuizFunnel, QuizQuestionScreen, QuizRiskScreen…)
│   ├── rescisao/           # Calculadora antiga (CalculadoraRescisao, ResultadoTable…)
│   ├── resultado/          # Tela /resultado (EmailForm, OfferCard, QRCodeSection, VerbasList)
│   ├── pos-pagamento/      # Form pós-pagamento V1 (legacy)
│   ├── pos-pagamento-v2/   # Form pós-pagamento V2 (atual) + relatório seções
│   └── ui/                 # shadcn primitives
├── lib/
│   ├── calculadora-rescisao-completa.ts  # MOTOR principal (CLT 2026)
│   ├── calculo-extras.ts                 # Motor de extras pós-pagamento V2
│   ├── calculo-refinado.ts               # Motor refinado V1 (legacy)
│   └── rescisao-calculator.ts            # Util genérico
├── types/
│   ├── rescisao.ts                # FormData, Bloco1/2/3, ResultadoCalculo
│   ├── pos-pagamento.ts           # V1 legacy
│   └── pos-pagamento-v2.ts        # V2 atual + extras
├── hooks/                  # useRescisaoForm, usePixPayment, useFunnelTracking, useSaveCalculo…
├── data/blog-posts.ts      # Conteúdo editorial do blog
└── integrations/supabase/  # Cliente + types (auto-gerados — NÃO EDITAR)

supabase/
├── config.toml
└── functions/
    ├── salvar-calculo/             # Persiste cálculo, gera codigo_unico
    ├── create-pix/, create-pix-v2/ # Cria cobrança PIX no Pagar.me
    ├── verificar-pix/              # Polling de status
    ├── webhook-pix/                # Webhook do Pagar.me (HMAC-SHA1)
    ├── gerar-relatorio-rescisao/   # IA — relatório completo
    ├── gerar-carta-rh/             # IA — carta para RH (upsell)
    └── gerar-checklist-rescisao/   # IA — checklist (upsell)
```

---

## 5. Funil do Usuário (Step-by-Step)

### Etapa 1 — Landing
- Usuário entra em `/test` (ou direto em `/quiz/1`).
- CTA "Começar agora — leva menos de 2 minutos".
- Sem conteúdo editorial abaixo da CTA (removido propositalmente para foco em conversão).

### Etapa 2 — Quiz (4 etapas, ~14 perguntas adaptativas)
Perguntas armazenadas em `src/components/quiz-funnel/questions.ts`. Verbo das perguntas adapta-se: passado para "já saiu/aviso", presente para "pensando".

**Etapa 1 — Situação:**
1. `objetivo` — simular ou conferir
2. `situacaoAtual` — já saiu / em aviso / pensando
3. `tipoDesligamento` — sem justa causa / pedido / acordo / justa causa / término. **JUSTA CAUSA é escondida automaticamente** quando o usuário está em aviso prévio.
4. `periodoContrato` — datas de admissão e desligamento (auto-calcula anos de serviço e meses)
5. `salarioFixo` — remuneração mensal total (fixo + média variável)

**Etapa 2 — Contrato:**
6. `tipoAvisoPrevio` — indenizado / trabalhado / não cumprido / não se aplica. Auto-setado para "trabalhado" se `situacaoAtual === 'demitido_aviso'`.
7. `numDependentes` — para IRRF
8. `saldoFGTS` — opcional

**Etapa 3 — Benefícios:**
9. `periodosFeriasVencidas` — 0 / 1 / 2+ / nunca
10. `mesesDesdeUltimaFerias` — condicional (só se férias != "nunca")

**Etapa 4 — Oportunidades (integradas no quiz):**
11. `faziaHorasExtras` — frequência. Se != "não fazia": pergunta `mediaHorasExtrasMes`, `bancoHoras`, `controlePonto`.
12. `funcoesDiferentes` — sim / não / não sei
13. `valorPorFora` — sim / não. Se "sim": pergunta `valorPorForaMensal`.
14. `adicionaisTrabalho` (multi) — noturno, insalubridade, periculosidade. Se selecionado, abre subperguntas de grau e se recebia.
15. `erroNaRescisao` — pergunta final (`progressoFixo: 99`)

### Etapa 3 — Loading (cálculo)
- Tela `QuizLoading` simula análise (~2-3s).
- Hash do `formData` é calculado e salvo em sessionStorage para manter valores constantes durante navegação.

### Etapa 4 — Risk Screen (`QuizRiskScreen`)
- Mostra risco dinâmico **68% a 84%** (gerado a partir do hash dos dados, sem pulse/emojis).
- Copy de urgência, sem alarmismo exagerado.

### Etapa 5 — Resultado (`/resultado`)
- Mostra valor base estimado **bloqueado** com blur.
- Captura email (validação rígida — ver §11).
- Email é salvo em `calculos.email`.
- Bypass emails:
  - `liberaragora@gmail.com` → libera grátis (relatório direto)
  - `jpabreupontes@gmail.com` → cobra R$ 0,01 (teste)
- **Decoupling:** o registro `calculos` permanece `status='pendente'` até o email desbloquear o pagamento. Só então cria-se o `pedidos_pix` no Pagar.me.

### Etapa 6 — Pagamento PIX (`/pagamento`)
- Edge function `create-pix-v2` chama Pagar.me com R$ 14,90 (1490 centavos).
- QR Code + copia-e-cola exibidos.
- Polling via `verificar-pix` a cada 3s.
- Webhook `webhook-pix` valida HMAC-SHA1 (`PAGARME_WEBHOOK_SECRET`), faz idempotência e double-check de status. Atualiza `calculos.status='pago'` e `pedidos_pix.status='paid'`.

### Etapa 7 — Pós-pagamento (`/pos-pagamento`)
- Form V2 (`FormularioPosPagamentoV2`) coleta jornada, adicionais e valores extras refinados.
- Após submit, edge function `gerar-relatorio-rescisao` chama Lovable AI e persiste em `relatorios.relatorio_ai` (jsonb).

### Etapa 8 — Relatório Completo (`/relatorio`)
- Acesso restrito por RLS (`status='pago'`).
- Mostra: detalhamento matemático, módulos de oportunidade, próximos passos, upsells (Carta RH e Checklist).
- **Sem botão de download de PDF.** Resiliência de acesso: se relatório não existir, gera on-the-fly.
- Tracking de conversão Google Ads disparado uma única vez (transaction_id único).

---

## 6. Modelo de Dados (Supabase)

### Tabela `calculos`
Persistência principal do cálculo. Insert anônimo permitido. SELECT só funciona se `status='pago'`.

**Campos de input (formulário):**
- `codigo_unico` (text, único, 8 chars A-Z/2-9)
- `tipo_desligamento`, `data_admissao`, `data_desligamento`, `ainda_trabalhando`
- `salario_fixo`, `media_variavel`, `tem_variavel`
- `periodos_ferias_vencidas`, `meses_desde_ultima_ferias`, `meses_trabalhados_2026`
- `tipo_aviso_previo`, `anos_servico`
- `saldo_fgts`, `num_dependentes`
- `fazia_horas_extras`, `funcoes_diferentes`, `valor_por_fora`, `adicionais_trabalho` (array), `erro_na_rescisao`
- `nome`, `email`, `cpf`

**Campos de detalhamento (calculados):**
- `calc_saldo_salario`, `calc_dias_trabalhados_mes`
- `calc_aviso_previo`, `calc_dias_aviso_previo`
- `calc_ferias_vencidas`, `calc_terco_ferias_vencidas`
- `calc_ferias_proporcionais`, `calc_terco_ferias_proporcionais`
- `calc_decimo_terceiro`, `calc_multa_fgts`
- `calc_total_bruto`, `calc_desconto_inss`, `calc_desconto_irrf`, `calc_total_liquido`

**Campos de pós-pagamento (V1 legacy + diagnóstico):**
- `horario_contratado`, `horario_real_medio`, `dias_trabalhados_por_semana`, `trabalhava_sabados`, `intervalo_almoco_completo`
- `recebia_comissao`, `media_mensal_comissao`, `recebia_por_fora`, `media_mensal_por_fora`
- `adicional_noturno`, `insalubridade`, `periculosidade`
- `quando_ultimas_ferias`, `tirou_ferias_corretamente`, `meses_trabalhados_ano_rescisao`
- `aviso_previo_confirmado`
- `valor_base`, `valor_refinado`, `diferenca`, `nivel_oportunidade`, `principais_fatores` (array), `itens_verbas` (jsonb)

**Status:** `'pendente'` (default) → `'pago'` (via webhook) → opcional `'ai_failed'`.

### Tabela `pedidos_pix`
- `calculo_id` (FK lógica para `calculos.id`)
- `qr_code`, `qr_code_url`
- `amount` (centavos — R$ 14,90 = 1490)
- `order_id_pagarme`, `charge_id_pagarme`
- `status` (`pending` / `paid`)
- `paid_at`, `expires_at`
- **RLS SELECT:** só se calculo associado tem `status='pago'`.

### Tabela `relatorios`
- `calculo_id` (FK lógica)
- `relatorio_ai` (jsonb — payload completo retornado pela IA)
- `report_url`, `report_hash`
- **RLS SELECT:** só se calculo associado tem `status='pago'`.

### Tabela `funnel_sessions`
Analytics de funil. Insert/select/update públicos (analytics interno).
- `session_id` (text)
- `current_question_index`, `current_question_campo`, `max_question_reached`
- `completed_quiz`, `reached_loading`, `reached_risk_screen`, `reached_resultado`, `reached_payment`, `payment_completed`
- `device_type`, `user_agent`

---

## 7. Motor de Cálculo Principal — `calculadora-rescisao-completa.ts`

### Constantes 2026
```ts
SALARIO_MINIMO_2026 = 1621
TETO_INSS_2026 = 8475.55
DEDUCAO_DEPENDENTE_IRRF = 189.59
DIAS_UTEIS_MES = 22
DIAS_DESCANSO_MES = 4

TABELA_INSS_2026 = [
  { até 1621.00, 7.5%, dedução 0 },
  { até 2902.84, 9%,   dedução 24.32 },
  { até 4354.27, 12%,  dedução 111.40 },
  { até 8475.55, 14%,  dedução 198.49 },
]

TABELA_IRRF_2026 = [
  { até 2428.80,  0%,    dedução 0 },
  { até 2826.65,  7.5%,  dedução 182.16 },
  { até 3751.05,  15%,   dedução 394.16 },
  { até 4664.68,  22.5%, dedução 675.49 },
  { acima,        27.5%, dedução 908.73 },
]

REDUTOR_IRRF_2026:
  - renda <= 5000:  R$ 312.89
  - renda <= 7350:  978.62 - 0.133145 × renda
  - acima:          0
```

### 7.1 Verbas Rescisórias (Parte 1)

**Salário base do cálculo:** `salarioFixo + (temVariavel ? mediaVariavel : 0)`. `salarioDia = salario / 30`.

**Saldo de salário:** `salarioDia × diasNoMesFinal` (sempre devido).

**Aviso prévio (CLT art. 487 + Lei 12.506/2011):**
- Dias = `min(90, 30 + 3 × anosCompletos)`.
- Indenizado: `salarioDia × diasAviso`. **Isento de INSS e IRRF.**
- Acordo (484-A): metade do valor.
- "Não cumprido" (pedido demissão sem trabalhar): **desconto** de 30 dias de salário.

**13º proporcional:** `(salario / 12) × meses13`.
- `meses13` conta meses com ≥15 dias trabalhados.
- Se aviso indenizado, **projeta** o contrato somando `diasAvisoPrevio` à data de desligamento.

**Férias vencidas + 1/3:** `salario × periodosVencidos`, mais 1/3 constitucional.

**Férias proporcionais + 1/3:** `(salario / 12) × mesesFerias`, mais 1/3.
- `mesesFerias` é contado a partir do último aniversário, considerando regra dos 15 dias.
- Também se beneficia da projeção de aviso indenizado.

**FGTS estimado:** `saldoFGTS` informado, ou estimativa `salario × 0.08 × mesesTrabalhados`.

**Multa FGTS:**
- Demissão sem justa causa / rescisão indireta: **40%**, saque 100%, seguro-desemprego.
- Acordo 484-A: **20%**, saque 80%, sem seguro.
- Pedido de demissão / justa causa: **0%**, sem saque.
- Término de contrato: **0%**, mas saque 100%.

**INSS:** incide só sobre salário + 13º. Aplica tabela progressiva 2026.

**IRRF:** base = `(salário + 13º) - INSS - (deps × 189,59) - redutor`. Aplica tabela 2026.

### 7.2 Regras por Tipo de Rescisão

| Tipo | Saldo | Aviso | 13º Prop | Férias Venc | Férias Prop | Multa FGTS | Saque FGTS | Seguro |
|---|---|---|---|---|---|---|---|---|
| Sem justa causa | ✅ | ✅ | ✅ | ✅ | ✅ | 40% | 100% | ✅ |
| Rescisão indireta | ✅ | ✅ | ✅ | ✅ | ✅ | 40% | 100% | ✅ |
| Acordo 484-A | ✅ | 50% | ✅ | ✅ | ✅ | 20% | 80% | ❌ |
| Pedido demissão | ✅ | desconta se não cumpriu | ✅ | ✅ | ✅ | 0% | 0% | ❌ |
| Justa causa | ✅ | ❌ | ❌ | ✅ | ❌ | 0% | 0% | ❌ |
| Término contrato | ✅ | ❌ | ✅ | ✅ | ✅ | 0% | 100% | ❌ |

### 7.3 Módulos de Oportunidade (Parte 2)

Estimativas exibidas como "valor potencial" na tela de risco e no relatório completo.

**Horas Extras** (CLT art. 59):
- Hora extra = `(salário / 220) × 1.5` (50% de adicional).
- Frequência → horas/mês:
  - "sempre" (>10h/sem): 48h/mês — score +18
  - "quase_sempre" (5-10h/sem): 30h/mês — score +14
  - "vez_em_quando" (<5h/sem): 20h/mês — score +8
  - "raramente": 10h/mês — score +4
- DSR sobre HE = `valor × (4/22)`.
- Reflexos = `(base/12) [13º] + (base/12) [férias] + (base/36) [1/3] + base × 0.08 [FGTS] + multa correspondente`, multiplicado por **fator de atenuação 0,55**.

**Desvio de Função** (CLT art. 461):
- "sim" → 15% do salário/mês — score +15
- "nao_sei" → 10% do salário/mês — score +8

**Valores "por fora":**
- Estimativa 15% do salário/mês — score +18.
- Aplica-se apenas se `valorPorFora === 'sim'`.

**Insalubridade** (CLT art. 192):
- Sobre o salário **mínimo** (R$ 1.621):
  - Mínimo 10%, médio 20% (padrão), máximo 40%.
- Score +14.

**Periculosidade** (CLT art. 193):
- 30% do salário **base**.
- Score +14.

**Adicional Noturno** (CLT art. 73):
- Hora noturna reduzida (52'30") → divide por 0,875.
- Adicional 20% sobre a hora noturna.
- Estimativa 4h noturnas × 20 dias/mês.
- DSR aplicável.

### 7.4 Score de Oportunidade
Soma dos scores dos módulos ativos. Determina:
- **Risco mostrado:** 68%–84% (estabilizado por hash do formData).
- **Nível de oportunidade:** alto (>25% diferença), médio (>12%), baixo.

---

## 8. Motor V2 (Pós-Pagamento) — `calculo-extras.ts`

Recalcula extras com dados refinados (jornada real, valor por fora confirmado, grau de insalubridade exato).

```ts
horasMes = cargaContratadaSemana × 4.3333
valorHora = salarioMensal / horasMes
horasExtrasSemana = max(0, cargaReal - cargaContratada)
horasExtrasMes = horasExtrasSemana × 4.3333
valorHoraExtra = valorHora × 1.5
```

Banco de horas:
- "sim" → zera HE (compensadas).
- "não" → paga integral.
- "não sei" → marca como estimativa.

Adicional noturno V2: `horasNoturnasSemana × 4.3333 × valorHora × 0.20` — só se não recebia corretamente.

Periculosidade V2: 30% do salário (idem).

Insalubridade V2: 10% / 20% / 40% do salário mínimo conforme grau.

---

## 9. Edge Functions

### `salvar-calculo`
Insert anônimo em `calculos`. Gera `codigo_unico` (8 chars, retry 5x). Aceita objeto `formulario` + `valorBase` + `detalhamento` opcional.

### `create-pix` / `create-pix-v2`
- Chama Pagar.me API com `PAGARME_API_KEY`.
- Cria order com `amount: 1490` (R$ 14,90) ou `1` (bypass jpabreupontes).
- Retorna `qr_code` + `qr_code_url` + `expires_at`.
- Persiste em `pedidos_pix`.
- Metadata enviado: `source`, `url`, `calculo_id`, `email`.

### `verificar-pix`
Polling. Consulta Pagar.me `GET /orders/{id}` e atualiza status local.

### `webhook-pix`
- Valida HMAC-SHA1 com `PAGARME_WEBHOOK_SECRET`.
- Idempotência: ignora eventos já processados (mesmo `charge_id` + `paid`).
- Double-check: confirma status na API antes de marcar como pago.
- Atualiza `calculos.status='pago'` e `pedidos_pix.status='paid'`.

### `gerar-relatorio-rescisao`
- Modelo: `google/gemini-2.5-flash` via Lovable AI Gateway.
- `max_completion_tokens: 3000`, sem `temperature`.
- Persiste em `relatorios.relatorio_ai` (jsonb).
- Fallback: se IA falhar, marca `calculos.status` e `/relatorio` gera diagnóstico on-the-fly.

### `gerar-carta-rh` / `gerar-checklist-rescisao`
Upsells. Geram artefatos via IA. Cada upsell tem `transaction_id` único para tracking Google Ads independente.

---

## 10. Pagamento e Pricing

| Item | Valor |
|---|---|
| Análise Completa | **R$ 14,90** (anchor R$ 24,90 — 42% OFF) |
| Garantia | 30 dias |
| Bypass grátis | `liberaragora@gmail.com` |
| Bypass teste | `jpabreupontes@gmail.com` (R$ 0,01) |

- Pagamento exclusivo via PIX (Pagar.me).
- Conversão Google Ads disparada uma vez por compra com `transaction_id` único.
- Upsells (Carta RH, Checklist) também disparam conversões independentes.

---

## 11. Validação de Email

Implementada em `EmailForm`. Rejeita:
- Espaços em branco
- Pontos consecutivos (`..`)
- Email começando ou terminando com ponto
- Domínios sem TLD válido

Email é normalizado: `trim()` + `toLowerCase()`.

---

## 12. UI/UX e Estilo

- **Design tokens:** semantic em `index.css` + `tailwind.config.ts`. Nunca usar cores hardcoded.
- **Responsividade:** mobile-first (`viewport` 390px é referência).
- **Toasts:** duração global fixa em **2500ms**.
- **Scroll:** instantâneo no topo a cada mudança de rota ou step.
- **Datas no quiz:** auto-advance ao preencher; comparação por ISO string; validação `exit > admission`.
- **Risk values:** 68-84% gerados a partir de hash do formData (mesma sessão = mesmo número).
- **Terminologia:** "Análise Completa" (não "Relatório"). "Informações" (não "dados"). Nunca "TRCT".
- **Sem em-dashes** (—) em copy.

---

## 13. Conteúdo Editorial / SEO

- Home (`/`) é o blog (estratégia de SEO + sitelinks).
- Posts em `src/data/blog-posts.ts`, com imagens únicas por post (não repetir).
- Lazy loading de imagens, alt text, JSON-LD em `BlogPost.tsx`.
- `sitemap.xml` e `robots.txt` em `public/`.
- AdSense só no blog (`ca-pub-7576448039643558`), desativado no quiz para não poluir conversão.
- GTM em head e body (`GTM-W73WB8HR`).

---

## 14. Compliance

- **Cookies:** `CookieConsent` com chave `rescisao-cookie-consent` em localStorage.
- **Páginas legais:** Termos, Privacidade, Sobre, Contato.
- **Sem promessa de resultado:** copy informativa, não jurídica.

---

## 15. Tracking de Funil

Hook `useFunnelTracking` registra em `funnel_sessions`:
- `loading_reached`
- `risk_screen_reached`
- `resultado_reached`
- `payment_reached`
- `payment_completed`

Permite construir funis de drop-off no Supabase.

---

## 16. Segurança

- **RLS ativa em todas as tabelas com dados sensíveis.**
- `calculos` SELECT apenas se `status='pago'`.
- `relatorios` e `pedidos_pix` SELECT apenas se calculo pago.
- Insert anônimo permitido (necessário para fluxo sem login).
- **Sem login de usuário** — tracking via `codigo_unico` no link.
- Webhook valida HMAC.
- Secrets gerenciadas via Lovable Cloud: `PAGARME_API_KEY`, `PAGARME_WEBHOOK_SECRET`, `LOVABLE_API_KEY`.

---

## 17. Variáveis Centrais (Glossário Rápido)

| Variável | Onde | O que é |
|---|---|---|
| `salarioFixo` | `FormData` | Salário fixo mensal (R$) |
| `mediaVariavel` | `FormData` | Média mensal de comissões/bônus |
| `temVariavel` | `FormData` | Se inclui variável no cálculo |
| `tipoDesligamento` | `FormData` | Tipo de rescisão (ver §7.2) |
| `tipoAvisoPrevio` | `FormData` | indenizado / trabalhado / nao_cumprido / nao_se_aplica / metade |
| `dataAdmissao`, `dataDesligamento` | `FormData` | DD/MM/AAAA |
| `aindaTrabalhando` | `FormData` | Bool — se ainda está empregado |
| `periodosFeriasVencidas` | `FormData` | 0, 1, 2+ |
| `mesesDesdeUltimaFerias` | `FormData` | 0-12 |
| `mesesTrabalhados2026` | `FormData` | Para 13º proporcional |
| `anosServico` | `FormData` | Anos completos (auto-calc) |
| `saldoFGTS` | `FormData` | Saldo informado (opcional) |
| `numDependentes` | `FormData` | Para IRRF |
| `faziaHorasExtras` | `FormData` | sempre / quase_sempre / vez_em_quando / raramente / nao_fazia |
| `funcoesDiferentes` | `FormData` | sim / nao / nao_sei |
| `valorPorFora` | `FormData` | sim / nao |
| `valorPorForaMensal` | `FormData` | R$ (condicional) |
| `adicionaisTrabalho` | `FormData` | array: trabalho_noturno, insalubridade, periculosidade, nenhum |
| `grauInsalubridade` | `FormData` | minimo / medio / maximo / nao_sei |
| `erroNaRescisao` | `FormData` | sim / talvez / nao / nao_sei_avaliar |
| `codigo_unico` | `calculos` | Código de 8 chars para acesso ao relatório |
| `valor_base` | `calculos` | Valor estimado da rescisão |
| `valor_refinado` | `calculos` | Após dados pós-pagamento |
| `diferenca` | `calculos` | Potencial adicional identificado |
| `nivel_oportunidade` | `calculos` | alto / medio / baixo |

---

## 18. Boas Práticas para Desenvolvimento

1. **Sempre usar tokens semânticos** do design system. Nunca hardcoded color.
2. **Não editar** `src/integrations/supabase/client.ts` nem `types.ts`.
3. **Migrations** via tooling Supabase (nunca `ALTER DATABASE`).
4. **Edge functions** auto-deploy.
5. **Toasts** sempre 2500ms.
6. **Copy** segue tom da marca (sem em-dashes, persuasiva, protetora).
7. **Mobile-first** com viewport 390px como referência.
8. **Testes manuais críticos:**
   - Fluxo completo (quiz → pagamento → relatório)
   - Bypass emails
   - Webhook de pagamento
   - Cálculo para cada tipo de rescisão

---

## 19. Memórias do Projeto (Resumo)

Memórias longas em `mem://`. Referências principais:
- Cálculo legal 2026: `mem://features/rescisao-calculator/legal-calculation-engine-2026`
- Pagar.me PIX: `mem://integrations/pagar-me-pix-v3`
- Webhook: `mem://integrations/pagarme-webhook-config-v2`
- Pricing: `mem://features/rescisao-calculator/pricing-strategy-v4`
- Branding: `mem://style/branding-rescisao-certa-v7`
- Tracking Google Ads: `mem://integrations/google-ads-tracking-v3`
- Validação email: `mem://technical/email-validation-rules`

---

**FIM DO DOCUMENTO** — Mantenha atualizado conforme evolução do produto.
