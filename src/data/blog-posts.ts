import imgDocumentos from "@/assets/blog/documentos-trabalho.jpg";
import imgDinheiro from "@/assets/blog/calculo-dinheiro.jpg";
import imgDemissao from "@/assets/blog/demissao-saida.jpg";
import imgJustica from "@/assets/blog/justica-trabalho.jpg";
import imgRelogio from "@/assets/blog/hora-extra-relogio.jpg";
import imgHorasExtras from "@/assets/blog/horas-extras-overtime.jpg";
import imgMaternidade from "@/assets/blog/maternidade-trabalho.jpg";
import imgLicencaMaternidade from "@/assets/blog/licenca-maternidade.jpg";
import imgAcordo from "@/assets/blog/acordo-trabalho.jpg";
import imgSeguranca from "@/assets/blog/seguranca-trabalho.jpg";
import imgPedidoDemissao from "@/assets/blog/pedido-demissao.jpg";
import imgJustaCausaGavel from "@/assets/blog/justa-causa-gavel.jpg";
import imgAcordoMutuo from "@/assets/blog/acordo-mutuo-handshake.jpg";
import imgDecimoTerceiro from "@/assets/blog/decimo-terceiro-calculo.jpg";
import imgAdicionalNoturno from "@/assets/blog/adicional-noturno.jpg";
import imgInsalubridade from "@/assets/blog/insalubridade-epi.jpg";
import imgIntervaloAlmoco from "@/assets/blog/intervalo-almoco.jpg";
import imgEstabilidadeGestante from "@/assets/blog/estabilidade-gestante.jpg";
import imgAcumuloFuncao from "@/assets/blog/acumulo-funcao.jpg";
import imgSemCarteira from "@/assets/blog/sem-carteira.jpg";
import imgPrazoPagamento from "@/assets/blog/prazo-pagamento.jpg";
import imgHomologacao from "@/assets/blog/homologacao.jpg";
import imgAssedioMoral from "@/assets/blog/assedio-moral.jpg";
import imgBancoHoras from "@/assets/blog/banco-horas.jpg";
import imgContratoExperiencia from "@/assets/blog/contrato-experiencia.jpg";
import imgTrctDocumento from "@/assets/blog/trct-documento.jpg";
import imgTrabalhadorDomestico from "@/assets/blog/trabalhador-domestico.jpg";
import imgRescisaoIndireta from "@/assets/blog/rescisao-indireta.jpg";
import imgReformaTrabalhista from "@/assets/blog/reforma-trabalhista.jpg";
import imgSalarioProporcional from "@/assets/blog/salario-proporcional.jpg";
import imgAcaoTrabalhista from "@/assets/blog/acao-trabalhista.jpg";
import imgConvencaoColetiva from "@/assets/blog/convencao-coletiva.jpg";
import imgVerbasRescisorias from "@/assets/blog/verbas-rescisorias.jpg";
import imgSeguroDesemprego from "@/assets/blog/seguro-desemprego.jpg";
import imgValeTransporte from "@/assets/blog/vale-transporte.jpg";
import imgTrabalhoRemoto from "@/assets/blog/trabalho-remoto.jpg";
import imgPlr from "@/assets/blog/plr-participacao.jpg";
import imgEstagiario from "@/assets/blog/estagiario-direitos.jpg";
import imgContratoIntermitente from "@/assets/blog/contrato-intermitente.jpg";

export interface BlogPost {
  slug: string;
  titulo: string;
  resumo: string;
  tempo: string;
  data: string;
  dataFormatada: string;
  imagem: string;
  conteudo: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "demissao-sem-justa-causa-direitos",
    titulo: "Demissão Sem Justa Causa: Todos os Direitos do Trabalhador em 2026",
    resumo: "Entenda o que você tem direito a receber quando a empresa encerra seu contrato sem motivo grave: FGTS, aviso prévio proporcional, seguro-desemprego e muito mais.",
    tempo: "8 min",
    data: "2026-02-10",
    dataFormatada: "10 de fevereiro de 2026",
    imagem: imgDemissao,
    conteudo: `
A demissão sem justa causa é a saída mais comum do mercado de trabalho formal no Brasil. Também é a que mais gera verbas para o trabalhador, e a que mais esconde erros nos cálculos.

Dados das reclamações trabalhistas no TST mostram que uma fatia considerável dos trabalhadores demitidos assina o TRCT sem perceber que está recebendo menos do que deveria. O problema raramente é má-fé declarada: na maioria dos casos, é sistema de RH desatualizado, procedimento padrão que ignora particularidades do contrato, ou simplesmente desconhecimento.

## O que caracteriza a demissão sem justa causa?

Quando a empresa decide encerrar o contrato sem que o empregado tenha cometido nenhuma falta grave, o desligamento é sem justa causa. Está previsto no **art. 477 da CLT** e é uma decisão exclusivamente do empregador. Nenhuma justificativa precisa ser apresentada ao trabalhador.

Esse tipo de desligamento é mais favorável ao trabalhador do que o pedido de demissão (que parte do próprio empregado) e do que a demissão por justa causa (que exige infração grave comprovada e corta várias verbas).

## Quais verbas você tem direito?

### 1. Saldo de Salário

Os dias trabalhados no mês do desligamento que ainda não foram pagos. Se você foi demitido no dia 18, a conta é simples: 18 ÷ 30 × o seu salário mensal.

**Fórmula:** Salário mensal ÷ 30 × dias trabalhados no mês

Parece trivial, mas erros acontecem quando o salário inclui variáveis (comissões, adicionais, horas extras habituais) que são convenientemente ignoradas nesse cálculo.

### 2. Aviso Prévio

O aviso prévio pode ser trabalhado (você fica na empresa pelos dias do aviso, com jornada reduzida em 2 horas diárias ou 7 dias corridos de folga no final, à sua escolha) ou indenizado (a empresa paga sem você precisar cumprir o período).

O ponto que mais gera erro: o aviso prévio **não é fixo em 30 dias**. Pela **Lei nº 12.506/2011**, acrescentam-se **3 dias por ano completo de serviço**, com teto de 90 dias.

**Exemplos:**
- 1 ano de empresa: 30 dias
- 5 anos de empresa: 30 + 12 = 42 dias
- 10 anos de empresa: 30 + 27 = 57 dias
- 20 anos de empresa: 30 + 57 = 87 dias

Quem tem 8 anos de empresa, por exemplo, tem direito a 54 dias de aviso, quase 2 salários. Muitas empresas pagam 30 dias fixos para todo mundo, independentemente do tempo de serviço. Essa diferença pode ser de milhares de reais.

### 3. 13º Salário Proporcional

Um doze avos do salário por mês trabalhado no ano. Conta como mês completo qualquer mês em que você tenha trabalhado 15 dias ou mais.

Trabalhadores que recebem comissões, horas extras habituais ou adicional noturno com regularidade precisam ter a média dessas verbas somada à base de cálculo. A maioria das empresas usa só o salário fixo.

**Fórmula:** (Salário + médias de variáveis) ÷ 12 × meses trabalhados no ano

### 4. Férias Proporcionais + 1/3

Para cada mês trabalhado no período aquisitivo em curso (o ciclo de 12 meses que ainda não se completou), o trabalhador tem direito a 1/12 das férias, mais o terço constitucional obrigatório.

Se houver também **férias vencidas** (períodos aquisitivos completos cujas férias nunca foram concedidas), a empresa deve pagá-las em dobro, acrescidas do terço. Esse direito está no **art. 137 da CLT** e é ignorado com frequência surpreendente.

### 5. Multa de 40% sobre o FGTS

Na demissão sem justa causa, a empresa deposita diretamente na conta vinculada do trabalhador uma multa de **40%** sobre o saldo total acumulado do FGTS durante todo o contrato. O trabalhador pode sacar tudo.

Aqui está um detalhe que muita gente não sabe: **a base de cálculo é o total histórico de depósitos, não o saldo disponível hoje**. Se você já sacou FGTS durante o contrato para compra de imóvel, por exemplo, a multa ainda incide sobre o montante total que foi depositado, não apenas o que restou.

Além da multa de 40% para o trabalhador, o governo cobra da empresa mais **10%** sobre o mesmo saldo. Esse valor não vai para você: fica no fundo como compensação de planos econômicos históricos.

### 6. Saque integral do FGTS

Após a demissão sem justa causa, você pode sacar todo o saldo da conta do FGTS. O prazo é de até **90 dias** após o desligamento. Para solicitar, você precisa do TRCT e de um documento de identidade. O processo pode ser feito pelo app FGTS ou em qualquer agência da Caixa Econômica Federal.

### 7. Seguro-Desemprego

O seguro-desemprego é pago pelo governo federal, não pela empresa. Para ter direito na primeira solicitação, você precisa ter trabalhado pelo menos 12 meses com carteira assinada nos últimos 18 meses, sem renda própria e sem benefício previdenciário ativo.

O número de parcelas vai de 3 a 5, conforme o tempo de serviço. O valor é calculado sobre a média salarial dos últimos 3 meses. A solicitação pode ser feita pelo app Carteira de Trabalho Digital, pelo portal gov.br ou em uma agência do SINE.

## Prazos que você não pode perder

- **Pagamento da rescisão:** a empresa tem até **10 dias corridos** após o último dia de trabalho. Se atrasar, deve pagar multa equivalente a 1 salário do empregado (art. 477, §8º da CLT).
- **Homologação:** contratos com mais de 1 ano precisam ser homologados pelo sindicato da categoria ou pelo MTE.
- **Ação trabalhista:** o prazo é de **2 anos** após o desligamento. Você pode cobrar até os últimos 5 anos do contrato.

## Onde costumam estar os erros

Com base em jurisprudência do TST e nos padrões mais comuns de cálculo, estes são os problemas mais frequentes:

1. **Aviso prévio fixo em 30 dias** para quem tem mais de 1 ano de empresa
2. **Horas extras e comissões excluídas** da base de 13º, férias e aviso prévio
3. **Férias vencidas pagas no valor simples** quando deveriam ser em dobro
4. **FGTS calculado apenas sobre o salário fixo**, sem incluir remuneração variável habitual
5. **Desconto indevido de aviso** quando a empresa dispensou o cumprimento

## Como conferir se o valor está correto

Use a calculadora do site para gerar os valores com base nas suas informações. Com os resultados em mãos, compare verba por verba com o TRCT que a empresa entregou.

Se encontrar diferença, comece questionando diretamente o departamento pessoal. A maioria dos erros é corrigida nessa etapa. Se a empresa não regularizar, procure o sindicato da categoria. A Justiça do Trabalho é gratuita para o trabalhador, e o prazo de 2 anos dá tempo para agir com cuidado.
    `,
  },
  {
    slug: "calculo-fgts-multa-rescisoria",
    titulo: "Como Calcular o FGTS e a Multa Rescisória de 40%",
    resumo: "Entenda como funciona o FGTS, como a multa de 40% é calculada e por que muitos trabalhadores recebem menos do que deveriam ao ser demitidos.",
    tempo: "7 min",
    data: "2026-02-18",
    dataFormatada: "18 de fevereiro de 2026",
    imagem: imgDinheiro,
    conteudo: `
Poucas verbas trabalhistas geram tanto dinheiro em disputa na Justiça do Trabalho quanto o FGTS. O fundo parece simples (8% do salário por mês), mas a prática revela uma série de detalhes que, quando ignorados, custam caro ao trabalhador.

## O que é o FGTS e como ele funciona?

O Fundo de Garantia do Tempo de Serviço foi criado pela **Lei nº 5.107/1966** como uma poupança compulsória em nome do trabalhador. Todo mês, a empresa deposita **8%** da remuneração bruta do empregado em uma conta vinculada na Caixa Econômica Federal. O dinheiro é do trabalhador, mas ele só pode movimentá-lo em situações definidas por lei.

Esse percentual de 8% incide sobre a **remuneração total**, não apenas o salário fixo. Comissões habituais, horas extras pagas com regularidade, adicional noturno, insalubridade, periculosidade e gorjetas todas integram a base de cálculo. O que a empresa deposita só sobre o salário base, quando o trabalhador recebe variáveis fixos, está errado.

## Como a multa de 40% é calculada?

Na demissão sem justa causa, a empresa é obrigada a pagar ao trabalhador uma multa de **40% sobre o saldo total do FGTS**. A previsão está no **art. 10, inciso I do ADCT da Constituição Federal de 1988**, regulamentada pela **Lei nº 8.036/1990**.

A base de cálculo é o saldo total acumulado durante todo o contrato, não apenas o que está disponível hoje.

Esse ponto é crítico e pouco conhecido: se você sacou o FGTS durante o contrato (por compra de imóvel, por exemplo), o saldo da conta cai, mas a multa de 40% continua sendo calculada sobre o total histórico de depósitos mais rendimentos. A empresa não pode usar o saldo atual como base se ele foi reduzido por saques autorizados.

### Exemplo prático

Trabalhador com salário de R$ 3.000 durante 5 anos:

- Depósito mensal: R$ 3.000 × 8% = **R$ 240/mês**
- Total de depósitos em 5 anos: R$ 240 × 60 meses = **R$ 14.400**
- Rendimentos estimados (TR + 3% a.a.): aprox. **R$ 1.200**
- Saldo total acumulado: **≈ R$ 15.600**
- Multa de 40%: R$ 15.600 × 40% = **R$ 6.240**

Além da multa de 40% para o trabalhador, a empresa também paga **10%** ao governo sobre o mesmo saldo. Essa parcela não vai para você: financia o próprio fundo e compensações de planos econômicos antigos como o Plano Verão e o Plano Collor.

## Por que tantos trabalhadores recebem menos?

### FGTS calculado só sobre o salário fixo

O erro mais frequente: a empresa deposita 8% apenas sobre o salário base, excluindo horas extras habituais, comissões, gorjetas e adicionais. Com o tempo, isso cria um saldo menor do que o correto, e reduz a multa de 40% proporcionalmente.

O **art. 15 da Lei nº 8.036/1990** é claro: o FGTS incide sobre a remuneração total. Se você recebia variáveis com regularidade e o depósito foi feito apenas sobre o fixo, há uma dívida de FGTS que pode ser cobrada.

### Atrasos nos depósitos mensais

Empresas com problemas de fluxo de caixa costumam atrasar o repasse do FGTS. O extrato da conta pode estar desatualizado. Atrasos geram correção e multa, mas o trabalhador precisa verificar ativamente: o saldo no app pode não refletir o que já deveria estar lá.

### Rescisão por acordo — multa de apenas 20%

Desde a Reforma Trabalhista de 2017, o **art. 484-A da CLT** permite um desligamento consensual em que a multa cai para **20%** e o trabalhador só pode sacar **80%** do FGTS. Se você assinou um acordo de demissão consensual, confirme se o percentual aplicado está correto para o seu tipo de desligamento.

### Saldo desatualizado no TRCT

O Termo de Rescisão deve refletir o saldo do FGTS atualizado na data do desligamento. Às vezes o documento é emitido com saldo defasado, o que reduz artificialmente a base da multa. Compare o saldo indicado no TRCT com o extrato oficial da Caixa na mesma data de referência.

## Como verificar se o FGTS foi depositado corretamente?

1. Acesse o **app FGTS** e visualize o extrato completo de depósitos mês a mês
2. Compare cada depósito com o contracheque do mesmo mês — o valor deve ser exatamente 8% da remuneração bruta
3. Se você recebia variáveis com regularidade, verifique se o depósito era maior do que 8% do salário fixo
4. Confira se o saldo no TRCT corresponde ao saldo real na Caixa na data do desligamento

Diferenças encontradas podem ser comunicadas ao Ministério do Trabalho pelo canal de denúncias, cobradas via sindicato ou reclamadas na Justiça do Trabalho. O prazo para ação é de **2 anos após o desligamento**, com possibilidade de cobrar os últimos 5 anos do contrato.

## Prazo para sacar o FGTS

Você tem **90 dias** a partir do desligamento para solicitar o saque. Depois desse prazo, o saldo permanece disponível, mas a liberação precisa ser feita manualmente na Caixa. Apresente o TRCT e um documento de identidade em qualquer agência ou faça pelo aplicativo.
    `,
  },
  {
    slug: "ferias-proporcionais-vencidas-calculo",
    titulo: "Férias Proporcionais e Vencidas: Como Calcular e Quando a Empresa Deve Pagar em Dobro",
    resumo: "Férias na rescisão têm regras específicas. Entenda a diferença entre férias proporcionais e vencidas, como o terço constitucional é calculado e quando a empresa deve pagar em dobro.",
    tempo: "6 min",
    data: "2026-03-03",
    dataFormatada: "3 de março de 2026",
    imagem: imgDocumentos,
    conteudo: `
Das verbas rescisórias, as férias são as que mais escondem armadilhas. A confusão entre férias proporcionais e vencidas, o terço calculado sobre base errada e a omissão do pagamento em dobro quando o prazo foi extrapolado são erros que passam pela rescisão sem que o trabalhador perceba.

## Como funciona o ciclo de férias?

O direito às férias é contado em **períodos aquisitivos** de 12 meses, calculados a partir da data de admissão. Após cada período completo, o trabalhador adquire 30 dias de férias.

A empresa tem mais 12 meses para conceder essas férias. Esse intervalo é o **período concessivo**. Se as férias não forem concedidas dentro desse prazo, tornam-se **férias vencidas** e a empresa fica obrigada a pagar o valor em dobro.

Isso significa que, se você completou 1 ano de empresa em março de 2024 e as férias nunca foram concedidas até março de 2025, elas já estão vencidas. Na rescisão, devem ser pagas em dobro.

## Férias Proporcionais

São as férias referentes ao período aquisitivo em curso que ainda não se completou quando o contrato encerra. Correspondem a **1/12 das férias por mês trabalhado** nesse período incompleto. Um mês conta como completo quando o trabalhador trabalhou pelo menos 15 dias.

**Fórmula:**
Salário bruto ÷ 12 × meses trabalhados no período em curso × (1 + 1/3)

O "(1 + 1/3)" é o terço constitucional, que incide sobre toda remuneração de férias sem exceção.

### Exemplo prático

Salário de R$ 4.000, demitido após 8 meses do início do período aquisitivo atual:

- Férias proporcionais: R$ 4.000 ÷ 12 × 8 = R$ 2.666,67
- Terço constitucional: R$ 2.666,67 × 1/3 = R$ 888,89
- **Total: R$ 3.555,56**

## Férias Vencidas

São as férias cujo período aquisitivo se completou, mas que a empresa ainda não concedeu. Na rescisão, o trabalhador recebe o valor integral dessas férias, acrescido do terço.

### Quando a empresa paga em dobro?

Quando as férias foram concedidas após o prazo de 12 meses do período concessivo — ou, na rescisão, quando estavam vencidas sem ter sido concedidas — a empresa deve pagar o valor em **dobro**, mais o terço constitucional. Essa obrigação está no **art. 137 da CLT**.

Muita gente assina a rescisão sem saber que tinha férias vencidas fora do prazo. O TRCT não diz explicitamente "férias em dobro": cabe ao trabalhador fazer a conta e questionar.

**Fórmula para férias em dobro:**
Salário bruto × 2 × (1 + 1/3)

### Exemplo com férias em dobro

Salário de R$ 3.000, com 1 período de férias vencidas e fora do prazo:

- Base (dobro do salário): R$ 3.000 × 2 = R$ 6.000
- Terço constitucional: R$ 6.000 × 1/3 = R$ 2.000
- **Total pelas férias vencidas em dobro: R$ 8.000**

Comparado ao pagamento simples (R$ 4.000), a diferença é de R$ 4.000 numa só verba.

## Como identificar se as suas férias vencidas deveriam ser em dobro?

Pegue a sua data de admissão e some 24 meses. Se as férias não foram concedidas até essa data, o prazo legal foi ultrapassado.

A verificação pode ser feita pelos recibos de férias ou pela anotação na CTPS. Se não houver registro de concessão dentro do prazo, o direito ao dobro existe, e pode ser cobrado mesmo após a assinatura da rescisão, desde que dentro do prazo de 2 anos para ação trabalhista.

## O terço constitucional: onde mais os erros aparecem

O terço constitucional é garantido pelo **art. 7º, inciso XVII da Constituição Federal** e deve ser calculado sobre a remuneração completa, não apenas o salário base.

A base de cálculo inclui salário fixo, médias de comissões habituais, médias de horas extras, adicional noturno recebido com regularidade e outros valores de natureza salarial. Empresas que calculam o terço só sobre o salário fixo quando o trabalhador recebia variáveis estão pagando a menos.

## Checklist para conferir suas férias na rescisão

- A empresa identificou todos os períodos aquisitivos completos?
- Férias vencidas fora do prazo foram pagas em dobro?
- O terço constitucional foi calculado sobre a remuneração total (incluindo variáveis)?
- O período proporcional do ciclo em curso foi incluído no TRCT?
- Os meses trabalhados no período proporcional foram contados corretamente (15 dias = mês completo)?

Se algum desses pontos não estiver claro no TRCT, questione o departamento pessoal antes de assinar. Depois da assinatura, o caminho fica mais longo.
    `,
  },
  {
    slug: "aviso-previo-proporcional-como-funciona",
    titulo: "Aviso Prévio Proporcional: Como Funciona e Por Que Muitas Empresas Calculam Errado",
    resumo: "O aviso prévio não é fixo em 30 dias. Entenda a regra da proporcionalidade por tempo de serviço e como calcular corretamente o valor que você tem direito.",
    tempo: "5 min",
    data: "2026-03-12",
    dataFormatada: "12 de março de 2026",
    imagem: imgRelogio,
    conteudo: `
Quem trabalha há mais de 1 ano na mesma empresa e foi demitido sem justa causa tem direito a um aviso prévio maior do que 30 dias. Esse direito existe desde 2011, mas até hoje é um dos mais descumpridos nas rescisões. Às vezes por desconhecimento, às vezes porque o sistema de folha nunca foi atualizado.

## O que é o aviso prévio?

O aviso prévio é uma comunicação antecipada de encerramento do contrato. Serve tanto para dar tempo ao trabalhador de procurar novo emprego quanto para que a empresa organize a transição.

Pode ser de dois tipos:

- **Trabalhado:** o trabalhador permanece na empresa durante o período do aviso, com direito a redução de 2 horas diárias na jornada ou 7 dias corridos de folga no final, a critério do empregado.
- **Indenizado:** a empresa dispensa o trabalhador de imediato e paga o valor correspondente ao aviso como indenização.

## A regra da proporcionalidade

A **Lei nº 12.506/2011** estabeleceu que o aviso prévio é proporcional ao tempo de serviço. A fórmula é:

**30 dias fixos + 3 dias por ano completo de serviço (máximo de 90 dias)**

Frações de ano não entram na conta, apenas os anos completos. Um trabalhador com 4 anos e 11 meses de empresa tem o mesmo aviso que um com exatos 4 anos.

### Tabela de referência

| Tempo de serviço | Aviso prévio |
|---|---|
| Menos de 1 ano | 30 dias |
| 1 ano completo | 33 dias |
| 2 anos completos | 36 dias |
| 5 anos completos | 45 dias |
| 10 anos completos | 60 dias |
| 15 anos completos | 75 dias |
| 20 anos completos | 90 dias |

## O impacto financeiro real

O aviso prévio proporcional afeta a rescisão de duas formas distintas.

A primeira é direta: o valor do aviso indenizado é calculado sobre os dias. Um trabalhador com salário de **R$ 4.000** e 8 anos de empresa tem direito a 54 dias de aviso. Isso representa R$ 7.200, não R$ 4.000. A diferença de R$ 3.200 é perdida quando a empresa paga apenas 30 dias.

A segunda forma é indireta, e poucos percebem: o aviso prévio indenizado **estende o tempo de serviço para fins de cálculo das demais verbas**. O período do aviso é somado ao tempo de contrato para calcular o 13º proporcional, férias proporcionais e o FGTS. Cada dia a mais no aviso significa mais verbas em todas as outras rubricas.

## Por que as empresas erram?

Três razões dominam:

1. **Sistemas de folha desatualizados.** Muitos softwares de RH não foram ajustados após a Lei 12.506/2011 e continuam aplicando 30 dias fixos para todo contrato.
2. **Procedimento padrão sem personalização.** O RH aplica o mesmo cálculo para todos os desligamentos sem verificar o tempo de serviço individual.
3. **Desconhecimento genuíno.** Em empresas menores, quem processa a rescisão muitas vezes não conhece a regra da proporcionalidade.

## O que fazer se o aviso foi calculado errado?

**Antes de assinar:** leve os cálculos em mãos para o departamento pessoal. Cite a **Lei nº 12.506/2011** e o número correto de dias. A grande maioria dos erros honestos é corrigida nessa conversa.

**Após assinar:** ainda é possível entrar com ação trabalhista para cobrar a diferença, desde que dentro do prazo de 2 anos após o desligamento.

**Via sindicato:** muitos sindicatos oferecem assessoria gratuita para casos de diferenças rescisórias e fazem a mediação com o empregador.

## Uma particularidade importante

No pedido de demissão, quando é o trabalhador que decide sair, o aviso prévio é de **30 dias fixos**, sem proporcionalidade. A regra dos 3 dias por ano só se aplica quando é a empresa que demite sem justa causa.

Se o empregado não cumprir esses 30 dias de aviso, a empresa pode descontar o valor da rescisão. Se a empresa dispensar o cumprimento, nenhum desconto pode ser feito.
    `,
  },
  {
    slug: "seguro-desemprego-como-solicitar",
    titulo: "Seguro-Desemprego em 2026: Quem Tem Direito, Quantas Parcelas e Como Solicitar",
    resumo: "Guia completo sobre o seguro-desemprego: requisitos, número de parcelas por tempo de emprego, valor calculado e passo a passo para dar entrada no benefício.",
    tempo: "7 min",
    data: "2026-03-20",
    dataFormatada: "20 de março de 2026",
    imagem: imgSeguroDesemprego,
    conteudo: `
O seguro-desemprego não cai automaticamente na conta depois que você é demitido. Precisa ser solicitado, dentro de um prazo específico, com documentos que a empresa deve fornecer no momento do desligamento. Quem deixa o prazo passar perde o direito para aquela demissão, sem possibilidade de recuperação.

Esse é o erro mais comum. O segundo é não saber quantas parcelas você realmente tem direito.

## Quem tem direito ao seguro-desemprego?

O benefício é pago pelo governo federal, pelo Ministério do Trabalho e Emprego, e se destina ao trabalhador demitido **sem justa causa**. Pedido de demissão, encerramento de contrato por prazo determinado e justa causa não dão direito ao benefício.

Além do tipo de desligamento, você precisa cumprir todos os requisitos abaixo:

1. Não ter renda própria suficiente para o sustento próprio e da família
2. Não estar recebendo benefício previdenciário, com exceção de auxílio-acidente e pensão por morte
3. Ter trabalhado com carteira assinada pelo tempo mínimo, que varia conforme o histórico de solicitações:

| Número da solicitação | Meses trabalhados exigidos |
|---|---|
| 1ª solicitação | 12 meses nos últimos 18 meses |
| 2ª solicitação | 9 meses nos últimos 12 meses |
| 3ª solicitação ou mais | 6 meses anteriores |

## Quantas parcelas você recebe?

O número de parcelas é definido pelo tempo de serviço no **último vínculo de trabalho**, não pelo tempo total de carreira:

| Tempo de emprego | Número de parcelas |
|---|---|
| 6 a 11 meses | 3 parcelas |
| 12 a 23 meses | 4 parcelas |
| 24 meses ou mais | 5 parcelas |

Trabalhadores domésticos seguem a mesma tabela. Pescadores artesanais têm regras próprias, com até 5 parcelas durante o período do defeso.

## Qual o valor das parcelas?

O cálculo usa a **média salarial dos últimos 3 meses** antes da demissão, aplicada a uma tabela progressiva atualizada anualmente pelo governo.

Para 2026, as faixas de referência são aproximadamente:

- Salários até **R$ 2.041,39**: 80% do salário médio
- Salários de **R$ 2.041,40 a R$ 3.402,28**: 50% da parcela que excede o limite inferior, mais uma parcela fixa
- Salários acima de **R$ 3.402,28**: valor máximo fixo de aproximadamente **R$ 2.041,38**

O valor mínimo é sempre 1 salário mínimo vigente.

Um detalhe que passa em branco: se você recebia horas extras ou comissões com regularidade nos últimos 3 meses, esses valores integram a média salarial usada no cálculo. A média de variáveis habituais eleva o valor das parcelas.

## Prazo para solicitar

Esse é o ponto que mais derruba trabalhadores:

- **Trabalhador CLT:** entre **7 e 120 dias** após a data do desligamento
- **Trabalhador doméstico:** entre **7 e 90 dias**

Antes dos 7 dias não é possível solicitar. Depois dos 120 dias (ou 90, para domésticos), o direito é perdido definitivamente para aquela demissão.

## Como solicitar — passo a passo

### 1. Reúna os documentos

- Requerimento do Seguro-Desemprego (preenchido pela empresa no ato do desligamento)
- Documento de identificação com foto (RG, CNH ou passaporte)
- CPF
- Carteira de Trabalho e Previdência Social (CTPS)
- Número do PIS/PASEP
- Termo de Rescisão do Contrato de Trabalho (TRCT)
- Contracheques dos últimos 3 meses

### 2. Escolha o canal

- **App Carteira de Trabalho Digital** (o mais rápido, sem necessidade de agendamento)
- **Portal gov.br** (acesso pelo computador)
- **Agência do SINE ou MTE** (atendimento presencial com agendamento)

### 3. Aguarde a análise

O sistema verifica automaticamente se os requisitos são cumpridos. O pagamento da primeira parcela ocorre em até 30 dias após o requerimento.

## Perguntas frequentes

**Posso trabalhar enquanto recebo o seguro-desemprego?**
Se você conseguir emprego formal com carteira assinada, o benefício é cancelado automaticamente. Qualquer renda própria tecnicamente compromete o benefício: o trabalhador tem obrigação legal de comunicar ao MTE.

**O seguro-desemprego pode ser solicitado novamente em uma futura demissão?**
Sim. A cada nova demissão sem justa causa, você pode solicitar novamente, respeitando os prazos mínimos de cada solicitação conforme a tabela acima.

**Trabalhei menos de 6 meses. Tenho direito?**
Na 3ª solicitação ou mais, o mínimo é 6 meses. Para 1ª e 2ª solicitações, o requisito é maior. Se o tempo mínimo não for atingido, não há direito ao benefício para aquela demissão.

**E se a empresa não entregou o Requerimento do Seguro-Desemprego?**
A empresa é obrigada a fornecer o documento no ato do desligamento. Se não entregou, você pode solicitar formalmente por escrito. Caso a empresa se recuse, registre ocorrência no Ministério do Trabalho.
    `,
  },
  {
    slug: "horas-extras-direitos-trabalhistas",
    titulo: "Horas Extras na Rescisão: Como Calcular e Cobrar o Que Você Tem Direito",
    resumo: "Horas extras habituais integram a base de cálculo das verbas rescisórias. Entenda como isso funciona, quanto você pode ter deixado de receber e como cobrar.",
    tempo: "6 min",
    data: "2026-03-25",
    dataFormatada: "25 de março de 2026",
    imagem: imgHorasExtras,
    conteudo: `
Trabalhar mais do que o contrato prevê já deveria ser remunerado adequadamente no mês em que acontece. Mas quando as horas extras são habituais, repetidas toda semana e todo mês durante anos, o impacto vai muito além do pagamento individual de cada hora. Elas passam a integrar a remuneração para fins de cálculo de 13º, férias, aviso prévio e FGTS.

Muita gente faz horas extras por anos, recebe o adicional mês a mês e descobre na rescisão que todas as outras verbas foram calculadas apenas sobre o salário fixo. Essa diferença pode ser expressiva.

## O que a lei diz

A CLT estabelece jornada máxima de **8 horas diárias e 44 horas semanais**. Qualquer hora além disso é hora extra e deve ser paga com adicional mínimo de **50%** sobre o valor da hora normal (art. 59 da CLT).

Trabalho em domingos ou feriados: o adicional sobe para **100%**.

Acordos e convenções coletivas podem estabelecer percentuais maiores. O mínimo legal é 50%, e o teto depende da negociação de cada categoria.

## Horas extras habituais x eventuais

Essa distinção define o que entra na base de cálculo da rescisão.

**Horas extras eventuais** são realizadas de forma esporádica, sem regularidade. Devem ser pagas quando ocorrem, mas não afetam o cálculo das verbas rescisórias.

**Horas extras habituais** são as realizadas com regularidade. Não precisam ser diárias, mas precisam ser frequentes. De acordo com o **art. 457, §1º da CLT** e as **Súmulas 45 e 115 do TST**, horas extras pagas com habitualidade integram a remuneração e, por isso, a base de cálculo de:

- 13º salário
- Férias e terço constitucional
- Aviso prévio
- FGTS e multa de 40%

## O impacto acumulado em números

Trabalhador com salário fixo de **R$ 3.000** e horas extras habituais de **R$ 600/mês**, com 5 anos de empresa:

| Verba | Sem horas extras | Com horas extras | Diferença |
|---|---|---|---|
| 13º proporcional | R$ 3.000 | R$ 3.600 | R$ 600 |
| Férias + 1/3 | R$ 4.000 | R$ 4.800 | R$ 800 |
| Aviso prévio (45 dias) | R$ 4.500 | R$ 5.400 | R$ 900 |
| FGTS total acumulado | R$ 14.400 | R$ 17.280 | R$ 2.880 |
| Multa de 40% sobre FGTS | R$ 5.760 | R$ 6.912 | R$ 1.152 |
| **Total** | | | **R$ 6.332** |

Isso sem contar o valor das próprias horas extras que possam ter ficado por pagar.

## Banco de horas: quando vira dívida na rescisão

O banco de horas é um sistema que substitui o pagamento das horas extras por folgas compensatórias. Quando o contrato termina com saldo positivo no banco (horas que nunca foram compensadas), esse saldo precisa ser pago em dinheiro na rescisão, com o adicional de 50%.

Banco de horas sem acordo coletivo escrito é ilegal. Se o seu banco de horas foi instituído por acordo verbal ou por comunicado interno sem respaldo em convenção coletiva, você pode questionar a legalidade e cobrar todas as horas como horas extras comuns.

## Como provar que fazia horas extras?

Registros de ponto são a prova mais direta, sejam eletrônicos, impressos ou em sistemas alternativos. A Justiça do Trabalho aceita outras formas de comprovação:

- **E-mails e mensagens** enviados ou recebidos fora do horário contratado
- **Mensagens de WhatsApp** com a empresa fora do expediente
- **Relatórios e entregas** com carimbo de data e hora posterior ao horário normal
- **Testemunhas**: colegas que estavam presentes e podem confirmar o horário real

Empresas com mais de 20 empregados são obrigadas por lei a manter controle de ponto. Se a empresa não mantinha esse controle ou o fazia de forma irregular, a **Súmula 338 do TST** inverte a situação: a presunção é favorável ao trabalhador. Cabe à empresa provar o horário, não ao trabalhador.

## O que fazer ao identificar horas extras não pagas na rescisão

1. **Reúna os registros** do seu horário real de trabalho
2. **Calcule a diferença** entre o que a rescisão indica e o que deveria constar
3. **Questione o RH** com os números em mãos, pois erros de cálculo costumam ser corrigidos nessa etapa
4. **Procure o sindicato** para mediação gratuita com o empregador
5. **Consulte um advogado trabalhista** se a empresa não reconhecer. O prazo para ação é de 2 anos após o desligamento, e os últimos 5 anos do contrato podem ser cobrados retroativamente
    `,
  },
  // ========== NEW ARTICLES START HERE ==========
  {
    slug: "pedido-de-demissao-o-que-voce-recebe",
    titulo: "Pedido de Demissão: O Que Você Recebe e O Que Perde ao Pedir Para Sair",
    resumo: "Quando o trabalhador decide sair da empresa, algumas verbas são garantidas e outras não. Veja exatamente o que entra e o que fica de fora na rescisão por iniciativa do empregado.",
    tempo: "6 min",
    data: "2026-01-08",
    dataFormatada: "8 de janeiro de 2026",
    imagem: imgPedidoDemissao,
    conteudo: `
Pedir demissão é uma decisão pessoal, mas tem consequências financeiras que muita gente só descobre depois de assinar o papel. O trabalhador que pede para sair recebe menos verbas do que quem é demitido sem justa causa, e precisa estar ciente do que ganha e do que perde antes de tomar essa decisão.

## O que você recebe no pedido de demissão

### Saldo de salário

Os dias trabalhados no mês do desligamento continuam sendo devidos normalmente. Se você pediu demissão no dia 15, recebe 15/30 do salário.

### 13º salário proporcional

Calculado da mesma forma que na demissão sem justa causa: um doze avos por mês trabalhado no ano em que houve o desligamento. Meses com pelo menos 15 dias trabalhados contam como completos.

### Férias proporcionais + 1/3

Mesmo no pedido de demissão, o trabalhador tem direito às férias proporcionais do período aquisitivo em andamento, mais o terço constitucional. Esse direito foi confirmado pela **Súmula 261 do TST** e reforçado pela **Convenção 132 da OIT**, ratificada pelo Brasil.

### Férias vencidas + 1/3

Se havia períodos de férias que deveriam ter sido concedidos e não foram, esses valores continuam devidos na rescisão. Se passaram do prazo concessivo, devem ser pagos em dobro, independentemente de quem tomou a iniciativa do desligamento.

## O que você NÃO recebe

### Multa de 40% do FGTS

A multa rescisória só é devida quando a iniciativa do desligamento é da empresa. No pedido de demissão, não há multa.

### Saque do FGTS

O trabalhador que pede demissão não tem direito ao saque do FGTS. O saldo permanece na conta vinculada e só poderá ser movimentado nas situações previstas em lei (compra de imóvel, aposentadoria, saque-aniversário, etc.).

### Seguro-desemprego

O benefício é exclusivo para demissão sem justa causa. Quem pede para sair não tem direito ao seguro-desemprego, independentemente do tempo de serviço.

## A questão do aviso prévio

Quando o empregado pede demissão, ele deve cumprir **30 dias de aviso prévio** (sem proporcionalidade por tempo de serviço, que só se aplica quando a empresa demite).

Se o empregado não quiser cumprir o aviso, a empresa pode descontar o valor correspondente a 30 dias de salário da rescisão. Se a empresa dispensar o cumprimento, nenhum desconto é feito.

## Quando vale a pena pedir demissão?

A decisão depende da situação individual, mas é importante colocar na ponta do lápis o que se perde. Quem tem muitos anos de empresa abre mão de uma multa de FGTS que pode chegar a dezenas de milhares de reais, além de perder o acesso ao seguro-desemprego.

Em alguns casos, a alternativa é buscar uma rescisão por acordo mútuo, prevista no **art. 484-A da CLT**, que garante metade do aviso prévio, 20% de multa do FGTS e saque de 80% do fundo.

## Prazo de pagamento

A empresa tem **10 dias corridos** após o término do contrato para pagar todas as verbas devidas. Se atrasar, a multa do art. 477 se aplica normalmente, mesmo que a iniciativa do desligamento tenha sido do empregado.
    `,
  },
  {
    slug: "demissao-por-justa-causa-motivos",
    titulo: "Demissão por Justa Causa: Os 14 Motivos Previstos na CLT e Como se Defender",
    resumo: "A justa causa é a penalidade mais grave no contrato de trabalho. Conheça todos os motivos legais, o que a empresa precisa provar e quais verbas o trabalhador ainda recebe.",
    tempo: "8 min",
    data: "2026-01-15",
    dataFormatada: "15 de janeiro de 2026",
    imagem: imgJustaCausaGavel,
    conteudo: `
A demissão por justa causa é a forma de desligamento mais prejudicial para o trabalhador. Ela elimina a maioria das verbas rescisórias e exige que a empresa comprove a falta grave cometida. Na prática, muitas empresas aplicam justa causa de forma equivocada, sem respeitar os requisitos legais, e o trabalhador acaba aceitando por desconhecimento.

## O que é a justa causa?

É o encerramento do contrato de trabalho motivado por uma falta grave cometida pelo empregado. Os motivos estão listados no **art. 482 da CLT**, e a empresa precisa demonstrar que a conduta se enquadra em uma dessas hipóteses.

## Os 14 motivos previstos na CLT

1. **Ato de improbidade** — desonestidade, roubo, fraude, falsificação de documentos
2. **Incontinência de conduta ou mau procedimento** — comportamento inadequado no ambiente de trabalho
3. **Negociação habitual** — concorrência desleal com o empregador sem autorização
4. **Condenação criminal** — trânsito em julgado de sentença criminal sem sursis
5. **Desídia** — negligência repetida, preguiça habitual, faltas injustificadas recorrentes
6. **Embriaguez habitual ou em serviço** — uso de álcool ou substâncias durante o expediente
7. **Violação de segredo da empresa** — divulgação de informações confidenciais
8. **Indisciplina** — descumprimento de normas gerais internas da empresa
9. **Insubordinação** — desobediência direta a ordens legítimas do superior
10. **Abandono de emprego** — ausência injustificada por mais de 30 dias consecutivos
11. **Ato lesivo da honra** — ofensas graves contra colegas ou superiores durante o serviço
12. **Ato lesivo da honra fora do serviço** — ofensas contra o empregador ou superiores fora do trabalho
13. **Prática constante de jogos de azar** — jogos que comprometem o desempenho profissional
14. **Perda da habilitação profissional** — quando decorre de conduta dolosa do empregado

## O que a empresa precisa provar

Para que a justa causa seja válida, não basta alegar o motivo. A empresa precisa demonstrar:

- **Gravidade** da conduta — a falta precisa ser séria o suficiente para justificar a rescisão
- **Imediaticidade** — a punição deve ocorrer logo após a ciência do fato, sem demora excessiva
- **Proporcionalidade** — a penalidade deve ser compatível com a falta cometida
- **Nexo causal** — a demissão deve ter relação direta com a conduta apontada
- **Ausência de punição prévia pelo mesmo fato** — a empresa não pode punir duas vezes pela mesma falta

## O que o trabalhador recebe na justa causa

As verbas se limitam ao mínimo:

- Saldo de salário (dias trabalhados no mês)
- Férias vencidas + 1/3 (se houver períodos completos não concedidos)

O trabalhador **não recebe**: aviso prévio, 13º proporcional, férias proporcionais, multa de 40% do FGTS, e não pode sacar o FGTS nem solicitar seguro-desemprego.

## Quando a justa causa é inválida?

A Justiça do Trabalho reverte a justa causa com frequência quando:

- A empresa não consegue comprovar a falta grave
- A punição foi desproporcional (falta leve gerando demissão)
- Houve demora entre o conhecimento do fato e a aplicação da penalidade
- O empregado já havia sido punido pelo mesmo fato (com advertência, por exemplo)
- A empresa usou a justa causa como retaliação

Quando revertida, a empresa é condenada a pagar todas as verbas de uma demissão sem justa causa, mais eventuais indenizações por danos morais se a aplicação indevida causou constrangimento.

## Como se defender

Se você acredita que a justa causa foi aplicada de forma injusta, reúna provas que demonstrem sua versão. Conversas por mensagem, e-mails, testemunhas e registros de ponto podem ajudar. O prazo para contestar na Justiça do Trabalho é de **2 anos** após o desligamento.
    `,
  },
  {
    slug: "rescisao-por-acordo-mutuo",
    titulo: "Rescisão por Acordo Mútuo: O Que Mudou com a Reforma Trabalhista",
    resumo: "A demissão consensual foi regulamentada em 2017 e permite um meio-termo entre pedir demissão e ser demitido. Veja as regras, verbas e cuidados necessários.",
    tempo: "5 min",
    data: "2026-01-22",
    dataFormatada: "22 de janeiro de 2026",
    imagem: imgAcordoMutuo,
    conteudo: `
Antes da Reforma Trabalhista de 2017, não existia um caminho formal para trabalhador e empresa encerrarem o contrato de comum acordo com divisão equilibrada das verbas. Ou o trabalhador pedia demissão (perdendo FGTS e seguro-desemprego), ou a empresa demitia sem justa causa (pagando todas as verbas). Na prática, muitos faziam "acordos por fora", que eram ilegais.

A **Lei nº 13.467/2017** criou o **art. 484-A da CLT**, que regulamentou a rescisão por acordo mútuo e trouxe regras claras.

## Como funciona

Na rescisão por acordo mútuo, ambas as partes concordam em encerrar o contrato. As verbas são divididas da seguinte forma:

- **Aviso prévio indenizado:** o trabalhador recebe **metade** do valor (50%)
- **Multa do FGTS:** reduzida de 40% para **20%** sobre o saldo do fundo
- **Saque do FGTS:** limitado a **80%** do saldo acumulado
- **Demais verbas:** saldo de salário, 13º proporcional, férias proporcionais + 1/3 e férias vencidas são pagos integralmente
- **Seguro-desemprego:** o trabalhador **não tem direito**

## Quando faz sentido optar pelo acordo

O acordo mútuo é vantajoso quando o trabalhador quer sair, mas não quer perder tudo que perderia num pedido de demissão convencional. Com o acordo, ele leva 20% de multa do FGTS e saca 80% do fundo, o que é bem melhor do que zero.

Para a empresa, o benefício é pagar multa de 20% em vez de 40%, o que reduz o custo da rescisão pela metade nessa verba.

## Cuidados importantes

### O acordo precisa ser genuíno

A rescisão consensual exige que as duas partes realmente concordem. A empresa não pode forçar o trabalhador a assinar um acordo para pagar menos. Da mesma forma, o trabalhador não pode pressionar a empresa a demiti-lo "de acordo" para ter acesso parcial ao FGTS.

### Não existe "acordo para sacar FGTS"

O esquema antigo de "empresa demite e o trabalhador devolve a multa" continua sendo ilegal e pode configurar fraude. A rescisão por acordo do art. 484-A é o único caminho legal para esse tipo de saída negociada.

### Confira se as verbas estão corretas

O erro mais comum é a empresa calcular o aviso prévio proporcional pela metade, mas esquecendo que a proporcionalidade por tempo de serviço continua valendo. Se o trabalhador tem direito a 54 dias de aviso, o acordo paga 27 dias, não 15.

## Comparativo rápido

| Verba | Pedido de demissão | Acordo mútuo | Demissão sem justa causa |
|---|---|---|---|
| Aviso prévio | Deve cumprir 30 dias | 50% indenizado | 100% indenizado |
| Multa FGTS | Não recebe | 20% | 40% |
| Saque FGTS | Não pode sacar | 80% do saldo | 100% do saldo |
| Seguro-desemprego | Não tem direito | Não tem direito | Tem direito |
| 13º proporcional | Recebe | Recebe | Recebe |
| Férias + 1/3 | Recebe | Recebe | Recebe |
    `,
  },
  {
    slug: "decimo-terceiro-salario-calculo",
    titulo: "13º Salário: Como Calcular o Proporcional na Rescisão e Evitar Erros",
    resumo: "O 13º salário proporcional na rescisão é calculado sobre a remuneração completa, não só o salário fixo. Entenda as regras e veja exemplos práticos de cálculo.",
    tempo: "5 min",
    data: "2026-01-29",
    dataFormatada: "29 de janeiro de 2026",
    imagem: imgDecimoTerceiro,
    conteudo: `
O 13º salário foi instituído pela **Lei nº 4.090/1962** e é devido a todo trabalhador com carteira assinada. Na rescisão, o valor é calculado proporcionalmente aos meses trabalhados no ano do desligamento.

## Como calcular

A fórmula é direta:

**Remuneração ÷ 12 × meses trabalhados no ano**

Cada mês em que o trabalhador atuou por pelo menos **15 dias** conta como mês completo. Se trabalhou menos de 15 dias no mês, aquele mês não entra na conta.

### Exemplo

Salário de R$ 3.600, demitido em agosto (8 meses trabalhados no ano):

- R$ 3.600 ÷ 12 × 8 = **R$ 2.400**

## O erro que mais custa dinheiro

A base de cálculo do 13º não é apenas o salário fixo. De acordo com o **art. 457 da CLT** e a **Súmula 45 do TST**, integram a base:

- Horas extras habituais (média dos últimos 12 meses)
- Comissões recebidas com regularidade
- Adicional noturno habitual
- Adicional de insalubridade ou periculosidade
- Gorjetas habituais
- Gratificações incorporadas ao salário

Um trabalhador com salário de R$ 3.000 e média de R$ 800 em horas extras deveria ter seu 13º calculado sobre R$ 3.800, não sobre R$ 3.000. Em 8 meses, a diferença é de R$ 533.

## O aviso prévio conta para o 13º

O período do aviso prévio, mesmo quando indenizado, é considerado tempo de serviço para fins de cálculo do 13º proporcional. Se o aviso prévio indenizado "empurra" o tempo de serviço para o mês seguinte e o trabalhador ultrapassa 15 dias naquele mês, ele ganha mais um doze avos.

## Na justa causa, não tem 13º proporcional

O trabalhador demitido por justa causa perde o direito ao 13º proporcional. Só recebe o saldo de salário e férias vencidas.

## Desconto do adiantamento

Se a empresa pagou a primeira parcela do 13º (geralmente em novembro), o valor adiantado é descontado na rescisão. Se o desconto for maior do que o proporcional devido, a empresa não pode cobrar a diferença do trabalhador.
    `,
  },
  {
    slug: "adicional-noturno-regras-calculo",
    titulo: "Adicional Noturno: Quem Tem Direito, Percentual e Reflexos na Rescisão",
    resumo: "O trabalho noturno tem regras próprias na CLT: hora reduzida, adicional de 20% e reflexos em todas as verbas. Veja como funciona e quando integra a rescisão.",
    tempo: "5 min",
    data: "2026-02-05",
    dataFormatada: "5 de fevereiro de 2026",
    imagem: imgAdicionalNoturno,
    conteudo: `
Trabalhar à noite no Brasil não é apenas receber um percentual a mais no salário. A CLT prevê regras específicas que muitos trabalhadores desconhecem, incluindo a hora noturna reduzida e os reflexos do adicional em todas as demais verbas trabalhistas.

## O que é considerado trabalho noturno?

Para trabalhadores urbanos, o período noturno vai das **22h às 5h** do dia seguinte. Para trabalhadores rurais na lavoura, é das 21h às 5h. Na pecuária, das 20h às 4h.

## O adicional de 20%

O **art. 73 da CLT** determina que a hora de trabalho noturno deve ser remunerada com um adicional de no mínimo **20%** sobre a hora diurna.

Se o salário-hora diurno é de R$ 15,00, a hora noturna vale pelo menos R$ 18,00.

Convenções coletivas podem prever percentuais maiores. Algumas categorias têm adicionais de 30%, 40% ou até 50%.

## A hora noturna reduzida

A hora noturna não tem 60 minutos. Ela é computada como **52 minutos e 30 segundos**. Isso significa que, entre 22h e 5h, o trabalhador cumpre **8 horas noturnas** em apenas 7 horas reais de relógio.

Quando a empresa registra 7 horas de trabalho noturno no espelho de ponto, na verdade o trabalhador cumpriu 8 horas para fins de remuneração. Se ele trabalhou das 22h às 6h (8 horas de relógio), na verdade cumpriu mais de 8 horas noturnas, e o excedente é hora extra noturna.

## Reflexos na rescisão

Quando o adicional noturno é recebido com **habitualidade**, ele integra a remuneração e passa a compor a base de cálculo de:

- 13º salário proporcional
- Férias proporcionais e vencidas + 1/3 constitucional
- Aviso prévio
- FGTS (depósito mensal de 8%) e multa rescisória

Se a empresa calcula essas verbas apenas sobre o salário base, sem incluir o adicional noturno habitual, está pagando a menos.

## Transferência para o horário diurno

Se o trabalhador é transferido do período noturno para o diurno, a empresa pode suprimir o adicional noturno. Porém, se o adicional foi pago por muitos anos, existe jurisprudência no TST que reconhece o direito à incorporação do valor ao salário.

## Como verificar

Compare seus contracheques: o adicional noturno aparece como uma verba separada. Some a média dos últimos 12 meses e verifique se esse valor foi incluído na base de cálculo das verbas rescisórias. Se não foi, há diferença a receber.
    `,
  },
  {
    slug: "insalubridade-periculosidade-diferencas",
    titulo: "Insalubridade e Periculosidade: Diferenças, Percentuais e Direitos na Rescisão",
    resumo: "Adicional de insalubridade e de periculosidade têm regras distintas. Veja os percentuais, como são calculados e o impacto que têm sobre as verbas rescisórias.",
    tempo: "6 min",
    data: "2026-02-12",
    dataFormatada: "12 de fevereiro de 2026",
    imagem: imgInsalubridade,
    conteudo: `
Trabalhar em condições que prejudicam a saúde ou que envolvem risco de vida gera direito a um adicional no salário. Embora muita gente use os termos como sinônimos, insalubridade e periculosidade são categorias diferentes na CLT, com bases de cálculo e percentuais distintos.

## Adicional de insalubridade

O adicional é devido quando o trabalhador fica exposto a agentes que prejudicam a saúde acima dos limites de tolerância definidos pelo Ministério do Trabalho. As atividades insalubres estão listadas na **NR-15**.

Os percentuais variam conforme o grau de insalubridade:

| Grau | Percentual |
|---|---|
| Mínimo | 10% do salário mínimo |
| Médio | 20% do salário mínimo |
| Máximo | 40% do salário mínimo |

A base de cálculo é o **salário mínimo nacional**, não o salário do trabalhador. Esse detalhe faz diferença: quem ganha R$ 5.000 e tem insalubridade grau máximo recebe 40% do salário mínimo, não 40% de R$ 5.000.

Convenções coletivas podem estabelecer bases de cálculo mais favoráveis, usando o piso da categoria ou o salário contratual.

## Adicional de periculosidade

É devido quando o trabalhador exerce atividades ou operações perigosas que envolvem risco acentuado em virtude de exposição permanente a:

- Inflamáveis e explosivos
- Energia elétrica
- Radiações ionizantes ou substâncias radioativas
- Segurança pessoal ou patrimonial (vigilantes)
- Atividades com motocicleta

O percentual é fixo: **30% sobre o salário base** do trabalhador (não sobre o salário mínimo). Para quem ganha R$ 4.000, são R$ 1.200 a mais por mês.

## Diferenças que importam

| Aspecto | Insalubridade | Periculosidade |
|---|---|---|
| Base de cálculo | Salário mínimo | Salário base do trabalhador |
| Percentuais | 10%, 20% ou 40% | 30% fixo |
| Pode acumular? | Não com periculosidade | Não com insalubridade |
| Comprovação | Laudo técnico (PPRA/LTCAT) | Laudo técnico |

O trabalhador que se enquadra nos dois adicionais precisa escolher o mais vantajoso. A CLT não permite acúmulo.

## Reflexos na rescisão

Tanto o adicional de insalubridade quanto o de periculosidade, quando recebidos com habitualidade, integram a remuneração e compõem a base de cálculo de todas as verbas rescisórias: 13º, férias, aviso prévio, FGTS e multa de 40%.

O cálculo deve considerar a média dos valores recebidos nos últimos 12 meses, especialmente quando o grau de exposição variou ao longo do contrato.

## Quando o adicional é eliminado

Se a empresa elimina ou neutraliza o agente insalubre/perigoso (fornecimento de EPIs adequados, por exemplo), o adicional pode ser suprimido. Porém, o período em que o trabalhador recebeu o adicional continua gerando reflexos nas verbas proporcionais da rescisão.
    `,
  },
  {
    slug: "intervalo-intrajornada-direitos",
    titulo: "Intervalo para Almoço: Regras da CLT e O Que Fazer Quando a Empresa Não Respeita",
    resumo: "O intervalo intrajornada tem regras claras na CLT. Quando a empresa reduz ou suprime o horário de almoço, o trabalhador tem direito a receber hora extra.",
    tempo: "5 min",
    data: "2026-02-19",
    dataFormatada: "19 de fevereiro de 2026",
    imagem: imgIntervaloAlmoco,
    conteudo: `
O intervalo para refeição e descanso durante a jornada de trabalho está previsto no **art. 71 da CLT** e é um direito irrenunciável. Quando a empresa reduz ou suprime esse intervalo, o trabalhador faz jus ao pagamento do período suprimido com acréscimo de 50%, como hora extra.

## Qual é o intervalo obrigatório?

A regra depende da duração da jornada:

- **Jornada acima de 6 horas:** intervalo de no mínimo **1 hora** e no máximo 2 horas
- **Jornada entre 4 e 6 horas:** intervalo de **15 minutos**
- **Jornada até 4 horas:** sem obrigatoriedade de intervalo

O intervalo de 1 hora pode ser reduzido para **30 minutos** mediante acordo ou convenção coletiva, conforme a Reforma Trabalhista de 2017.

## O que acontece quando o intervalo não é cumprido?

Antes da Reforma Trabalhista, a supressão do intervalo gerava o pagamento integral do período como hora extra, independentemente do tempo que foi reduzido. A empresa que dava 40 minutos em vez de 60 pagava a hora cheia.

Após a Reforma (Lei nº 13.467/2017), o **§4º do art. 71** passou a determinar que o pagamento é apenas do **período suprimido**, com acréscimo de 50%. Se a empresa dava 40 minutos, paga os 20 minutos faltantes com adicional de hora extra.

## Reflexos nas verbas rescisórias

O pagamento do intervalo suprimido tem natureza indenizatória após a Reforma Trabalhista e, portanto, **não integra** a remuneração para fins de cálculo de 13º, férias e FGTS.

Porém, para períodos anteriores a novembro de 2017, o entendimento do TST é que o pagamento tinha natureza salarial e integrava todas as verbas. Se o seu contrato começou antes da Reforma, essa distinção pode representar valores significativos.

## Como provar que o intervalo não era respeitado?

Os registros de ponto são a prova principal. Se o ponto registra entrada às 12h e retorno às 12h30, está documentado que o intervalo foi de apenas 30 minutos.

Na ausência de registros formais, mensagens de colegas, e-mails enviados durante o horário de almoço e testemunhas servem como prova. A **Súmula 338 do TST** aplica-se aqui: empresas com mais de 20 funcionários que não mantêm controle de ponto assumem a versão do trabalhador como verdadeira.

## O intervalo pode ser suprimido por acordo?

A Reforma Trabalhista permitiu a redução para 30 minutos via acordo ou convenção coletiva. Porém, a supressão total do intervalo continua sendo ilegal, mesmo com acordo. O mínimo de 30 minutos é o piso negociável.
    `,
  },
  {
    slug: "estabilidade-provisoria-quem-tem-direito",
    titulo: "Estabilidade Provisória: 7 Situações em Que a Empresa Não Pode Demitir",
    resumo: "Existem situações em que o trabalhador tem proteção contra demissão. Conheça os 7 tipos de estabilidade provisória previstos na legislação trabalhista.",
    tempo: "6 min",
    data: "2026-02-26",
    dataFormatada: "26 de fevereiro de 2026",
    imagem: imgEstabilidadeGestante,
    conteudo: `
A estabilidade provisória é uma proteção temporária que impede a empresa de demitir o trabalhador sem justa causa durante determinados períodos. Quando a empresa demite alguém que tem estabilidade, a demissão pode ser anulada judicialmente, e o trabalhador pode ser reintegrado ou indenizado pelo período restante.

## 1. Gestante

A empregada gestante tem estabilidade desde a **confirmação da gravidez** até **5 meses após o parto** (art. 10, II, "b" do ADCT). Esse direito existe mesmo que a trabalhadora não soubesse que estava grávida no momento da demissão e mesmo no contrato de experiência.

Se a empresa demitiu e a trabalhadora descobriu a gravidez depois, a demissão pode ser revertida.

## 2. Acidente de trabalho

O trabalhador que sofre acidente de trabalho ou desenvolve doença ocupacional tem estabilidade de **12 meses** após o término do auxílio-doença acidentário (art. 118 da Lei nº 8.213/1991).

Dois requisitos: ter ficado afastado por mais de 15 dias e ter recebido o auxílio-doença acidentário (B91) pelo INSS.

## 3. Membro da CIPA

O empregado eleito para a Comissão Interna de Prevenção de Acidentes tem estabilidade desde o **registro da candidatura** até **1 ano após o término do mandato** (art. 10, II, "a" do ADCT). O suplente tem o mesmo direito.

## 4. Dirigente sindical

O empregado eleito para cargo de direção ou representação sindical tem estabilidade desde o **registro da candidatura** até **1 ano após o final do mandato** (art. 8º, VIII, da Constituição).

## 5. Representante dos empregados

Empresas com mais de 200 empregados devem ter representantes eleitos pelos trabalhadores. Esses representantes têm estabilidade durante o mandato e até **1 ano após** (art. 510-D da CLT).

## 6. Pré-aposentadoria

Muitas convenções coletivas preveem estabilidade pré-aposentadoria para trabalhadores que estão a 12 ou 24 meses de completar os requisitos para aposentadoria. Esse direito não está na CLT, mas nas normas coletivas da categoria.

## 7. Membro da comissão de conciliação prévia

Representantes dos empregados na comissão de conciliação prévia têm estabilidade durante o mandato e até **1 ano após** (art. 625-B, §1º da CLT).

## O que acontece se a empresa demitir mesmo assim?

O trabalhador pode entrar com ação trabalhista pedindo a **reintegração** ao emprego ou a **indenização** correspondente ao período de estabilidade. A escolha depende do caso: se o retorno ao ambiente de trabalho é viável, a reintegração é preferível. Se a relação está insustentável, a indenização substitutiva é a saída.

## A justa causa quebra a estabilidade?

Sim. A estabilidade provisória protege contra demissão sem justa causa. Se o trabalhador comete falta grave comprovada, a empresa pode demitir por justa causa mesmo durante o período de estabilidade. Porém, no caso de dirigente sindical e membro da CIPA, a justa causa precisa ser apurada em **inquérito judicial** para apuração de falta grave (art. 494 da CLT).
    `,
  },
  {
    slug: "acumulo-desvio-funcao-direitos",
    titulo: "Acúmulo e Desvio de Função: Quando Você Faz Mais do Que Foi Contratado Para Fazer",
    resumo: "Exercer funções diferentes ou acumuladas sem ajuste salarial é uma das irregularidades mais comuns. Saiba quando há direito a diferenças salariais e como reivindicar.",
    tempo: "5 min",
    data: "2026-03-05",
    dataFormatada: "5 de março de 2026",
    imagem: imgAcumuloFuncao,
    conteudo: `
É comum o trabalhador ser contratado para uma função e, ao longo do tempo, passar a exercer atividades de outro cargo, muitas vezes mais complexo e com maior responsabilidade, sem qualquer ajuste no salário. Essa prática gera dois problemas distintos no direito trabalhista: o desvio de função e o acúmulo de função.

## Desvio de função

Ocorre quando o trabalhador deixa de exercer a função para a qual foi contratado e passa a desempenhar, de forma permanente, atividades de outro cargo com maior complexidade ou responsabilidade.

Exemplo: um auxiliar administrativo que passa a exercer todas as atividades de um analista financeiro, assumindo responsabilidades de outro nível, mas continuando registrado e remunerado como auxiliar.

O trabalhador tem direito às **diferenças salariais** entre o cargo que exerce de fato e o que está registrado em carteira, incluindo reflexos em todas as verbas (13º, férias, FGTS, etc.).

## Acúmulo de função

Ocorre quando o trabalhador continua exercendo a função original, mas passa a acumular atividades de outro cargo simultaneamente, sem receber remuneração adicional.

Exemplo: uma recepcionista que, além de atender clientes, também faz o controle financeiro e o RH da empresa.

Na CLT não existe um artigo específico que regulamente o acúmulo de função. A jurisprudência trabalhista, porém, reconhece o direito a um acréscimo salarial quando o acúmulo é comprovado e representa carga de trabalho significativamente maior.

## Como provar

A prova pode ser feita por:

- **Descrição de cargo** na CTPS ou contrato de trabalho, comparada com as atividades reais
- **E-mails e mensagens** que demonstrem a execução de atividades fora da função
- **Testemunhas** que presenciaram o exercício das atividades acumuladas
- **Documentos** com a assinatura do trabalhador em atividades de outro cargo

## Reflexos na rescisão

Se reconhecido judicialmente, o desvio ou acúmulo de função gera diferenças salariais retroativas que refletem em todas as verbas rescisórias. O cálculo é refeito com base no salário que o trabalhador deveria ter recebido, e todas as verbas proporcionais são recalculadas sobre essa base corrigida.

O prazo para cobrar é de **2 anos** após o desligamento, abrangendo os últimos **5 anos** do contrato.
    `,
  },
  {
    slug: "trabalho-sem-carteira-assinada",
    titulo: "Trabalho Sem Carteira Assinada: Direitos, Riscos e Como Regularizar",
    resumo: "Trabalhar sem registro em carteira não elimina os direitos trabalhistas. Veja o que a lei garante, como comprovar o vínculo e os riscos para o empregador.",
    tempo: "6 min",
    data: "2026-03-10",
    dataFormatada: "10 de março de 2026",
    imagem: imgSemCarteira,
    conteudo: `
A informalidade no mercado de trabalho brasileiro atinge milhões de pessoas. Muitos trabalhadores exercem funções típicas de emprego — com subordinação, horário fixo, pessoalidade e onerosidade — mas não têm carteira assinada. O que poucos sabem é que a ausência do registro não elimina os direitos trabalhistas. O vínculo empregatício existe na prática, independentemente da formalização.

## Quando existe vínculo de emprego?

O **art. 3º da CLT** define empregado como toda pessoa física que presta serviços de natureza não eventual ao empregador, sob sua dependência e mediante salário. Os quatro requisitos são:

1. **Pessoalidade** — o serviço é prestado pela pessoa contratada, não pode mandar outra em seu lugar
2. **Habitualidade** — o trabalho é contínuo, não eventual
3. **Subordinação** — o trabalhador segue ordens e horários definidos pelo empregador
4. **Onerosidade** — o trabalho é remunerado

Se esses quatro elementos estão presentes, existe vínculo empregatício, mesmo sem contrato escrito e sem registro na CTPS.

## Quais direitos são garantidos?

Todos os mesmos de um empregado registrado:

- Salário mínimo ou piso da categoria
- 13º salário
- Férias + 1/3
- FGTS (que deveria ter sido depositado mensalmente)
- Horas extras, adicional noturno e demais adicionais aplicáveis
- Seguro-desemprego (se reconhecido o vínculo e comprovada a demissão sem justa causa)
- Aviso prévio
- Multa de 40% do FGTS

## Como comprovar o vínculo

Na Justiça do Trabalho, o trabalhador pode utilizar:

- **Mensagens de WhatsApp** com o empregador sobre horários, tarefas e pagamentos
- **Comprovantes de transferência** (PIX, depósitos bancários) que demonstrem pagamentos regulares
- **Fotos e vídeos** no local de trabalho
- **Testemunhas** — colegas que também trabalhavam no mesmo local
- **E-mails e registros digitais** com comunicações de trabalho

A **Súmula 212 do TST** estabelece que, reconhecido o vínculo, presume-se que o encerramento foi por iniciativa do empregador, cabendo à empresa provar o contrário.

## Riscos para o empregador

A empresa que mantém trabalhadores sem registro está sujeita a:

- Multa administrativa por funcionário não registrado (art. 47 da CLT), que pode chegar a R$ 3.000 por empregado
- Pagamento retroativo de todos os direitos trabalhistas, incluindo FGTS com multa e correção
- Indenização por danos morais ao trabalhador
- Autuação pela fiscalização do trabalho

## O que fazer se você trabalha sem registro

1. Tente primeiro solicitar a regularização por escrito ao empregador
2. Registre provas do vínculo: horários, pagamentos, conversas, fotos
3. Se a empresa se recusar, procure o sindicato da categoria ou faça uma denúncia ao Ministério do Trabalho
4. O prazo para ação trabalhista é de **2 anos** após o encerramento do vínculo
    `,
  },
  {
    slug: "prazo-pagamento-rescisao-multa",
    titulo: "Prazo de Pagamento da Rescisão: O Que Acontece Quando a Empresa Atrasa",
    resumo: "A empresa tem 10 dias para pagar a rescisão. Se atrasar, deve pagar multa equivalente a 1 salário. Entenda as regras, exceções e como cobrar.",
    tempo: "4 min",
    data: "2026-03-15",
    dataFormatada: "15 de março de 2026",
    imagem: imgPrazoPagamento,
    conteudo: `
O prazo para pagamento das verbas rescisórias é uma das regras mais claras da CLT e, ao mesmo tempo, uma das mais descumpridas. Quando a empresa não paga dentro do prazo, a penalidade é pesada: uma multa equivalente ao salário do trabalhador.

## Qual é o prazo?

Desde a Reforma Trabalhista de 2017, o prazo é único para todos os tipos de desligamento: **10 dias corridos** a partir do término do contrato.

Esse prazo vale para:

- Demissão sem justa causa (com ou sem aviso prévio)
- Pedido de demissão
- Demissão por justa causa
- Rescisão por acordo mútuo
- Término de contrato por prazo determinado

Se o 10º dia cai em sábado, domingo ou feriado, o pagamento deve ser antecipado para o último dia útil anterior.

## O que deve ser pago dentro desse prazo?

Tudo. O prazo abrange o pagamento integral de todas as verbas devidas: saldo de salário, 13º proporcional, férias + 1/3, aviso prévio indenizado e a entrega dos documentos necessários para saque do FGTS e habilitação ao seguro-desemprego.

A entrega do TRCT (Termo de Rescisão) e das guias de saque do FGTS e do seguro-desemprego também precisa ocorrer dentro desses 10 dias.

## Multa por atraso

O **art. 477, §8º da CLT** determina que a empresa que não respeitar o prazo de pagamento fica obrigada a pagar ao empregado uma **multa no valor equivalente ao seu salário**.

A multa é devida em favor do trabalhador, não do governo. Ela se soma às verbas rescisórias e deve ser paga junto com os valores em atraso.

## Como cobrar

Se a empresa atrasou o pagamento:

1. **Documente o atraso** — guarde o TRCT com a data de pagamento e compare com a data do desligamento
2. **Notifique a empresa por escrito** — um e-mail ou carta formal pedindo a regularização e a multa
3. **Procure o sindicato** — muitos sindicatos fazem a mediação gratuitamente
4. **Ação trabalhista** — o pedido da multa do art. 477 pode ser incluído em qualquer reclamação trabalhista

## Exceções

Existem pouquíssimas exceções reconhecidas pela jurisprudência. Dificuldades financeiras da empresa ou "erro no sistema" não são justificativas aceitas. A única exceção relevante é quando o próprio trabalhador cria obstáculo ao pagamento (recusa em comparecer para receber, por exemplo), situação que precisa ser documentada pela empresa.
    `,
  },
  {
    slug: "homologacao-rescisao-quando-necessaria",
    titulo: "Homologação da Rescisão: Quando é Obrigatória e Por Que Protege o Trabalhador",
    resumo: "A homologação no sindicato era obrigatória para contratos com mais de 1 ano. Com a Reforma Trabalhista, as regras mudaram. Veja o que vale em 2026.",
    tempo: "4 min",
    data: "2026-03-18",
    dataFormatada: "18 de março de 2026",
    imagem: imgHomologacao,
    conteudo: `
Antes da Reforma Trabalhista de 2017, todo trabalhador com mais de 1 ano de empresa precisava ter sua rescisão homologada pelo sindicato da categoria ou pelo Ministério do Trabalho. Essa exigência era uma camada de proteção: um profissional independente conferia os valores antes de o trabalhador assinar.

## O que mudou com a Reforma

A **Lei nº 13.467/2017** revogou o **§1º do art. 477 da CLT**, eliminando a obrigatoriedade da homologação sindical. Desde então, a rescisão pode ser feita diretamente entre empresa e empregado, sem intermediário, independentemente do tempo de contrato.

Na prática, isso transferiu para o trabalhador a responsabilidade de conferir os valores. Sem o sindicato como fiscal, os erros nos cálculos ficam mais difíceis de detectar no momento da assinatura.

## A homologação ainda existe?

Sim. Embora não seja obrigatória por lei, muitos sindicatos continuam oferecendo o serviço de conferência da rescisão, geralmente gratuito para o trabalhador. Convenções coletivas de algumas categorias também mantêm a exigência de homologação como cláusula negociada.

Se a convenção coletiva da sua categoria exige homologação, a empresa é obrigada a cumprir, mesmo após a Reforma.

## Por que vale a pena fazer mesmo sem obrigação legal

Um profissional do sindicato tem experiência em conferir rescisões e pode identificar rapidamente:

- Aviso prévio proporcional não aplicado
- Férias vencidas não pagas em dobro
- Base de cálculo que deveria incluir variáveis
- Erros na contagem de dias trabalhados
- Descontos indevidos

A conferência leva poucos minutos e pode representar milhares de reais recuperados.

## Como solicitar

1. Entre em contato com o sindicato da sua categoria profissional
2. Leve todos os documentos: TRCT, contracheques dos últimos meses, carteira de trabalho
3. O sindicato confere os valores e, se encontrar divergências, orienta sobre como corrigir

O serviço é gratuito na maioria dos sindicatos. Mesmo que a empresa já tenha entregue a rescisão, é possível solicitar a conferência depois e, se houver diferenças, exigir a complementação.
    `,
  },
  {
    slug: "licenca-maternidade-estabilidade-gestante",
    titulo: "Licença-Maternidade e Estabilidade da Gestante: Tudo o Que a Lei Garante",
    resumo: "A gestante tem estabilidade no emprego e direito a 120 dias de licença. Veja as regras completas, o que fazer em caso de demissão e como funciona para adoção.",
    tempo: "6 min",
    data: "2026-03-22",
    dataFormatada: "22 de março de 2026",
    imagem: imgLicencaMaternidade,
    conteudo: `
A proteção à maternidade no trabalho é um dos direitos mais consolidados na legislação brasileira. A Constituição Federal e a CLT garantem estabilidade no emprego e licença remunerada, com regras específicas que se aplicam desde a confirmação da gravidez até meses após o nascimento.

## Duração da licença-maternidade

O período padrão da licença-maternidade é de **120 dias** (4 meses), pagos integralmente pela Previdência Social. A empresa adianta o salário e depois compensa o valor nos recolhimentos ao INSS.

Empresas participantes do **Programa Empresa Cidadã** podem estender a licença para **180 dias** (6 meses). A extensão precisa ser solicitada pela empregada até o final do primeiro mês após o parto.

## Quando a licença começa?

A licença pode ser iniciada até **28 dias antes do parto** ou a partir da data do nascimento. A escolha é da trabalhadora, mediante atestado médico.

Em caso de internação da mãe ou do bebê por período superior a 30 dias, a licença pode ser prorrogada pelo tempo da internação, conforme decisão do STF.

## Estabilidade no emprego

A gestante tem estabilidade desde a **confirmação da gravidez** até **5 meses após o parto** (art. 10, II, "b" do ADCT). Essa proteção vale:

- Mesmo que a gravidez tenha sido descoberta após a demissão
- No contrato de experiência
- No aviso prévio (se a gravidez for confirmada durante o cumprimento do aviso)
- Para trabalhadoras temporárias e aprendizes

## E se a empresa demitir?

Se a empresa demitir uma gestante sem justa causa durante o período de estabilidade, a trabalhadora pode:

1. **Ser reintegrada** ao emprego por ordem judicial
2. **Receber indenização** correspondente a todos os salários e benefícios do período de estabilidade que faltava, caso a reintegração não seja viável

O prazo para entrar com ação é de **2 anos** após o desligamento.

## Adoção e guarda

A licença-maternidade de 120 dias também se aplica para quem adota ou obtém guarda judicial de criança, independentemente da idade do adotado. A regra foi equiparada pela **Lei nº 12.873/2013**.

## Amamentação

Até o bebê completar **6 meses**, a trabalhadora tem direito a dois intervalos diários de **30 minutos** para amamentação durante a jornada de trabalho (art. 396 da CLT). Esse período pode ser estendido por recomendação médica.

## Parto antecipado ou natimorto

Em caso de parto antecipado, a licença de 120 dias é assegurada integralmente. No caso de natimorto, a licença-maternidade também é devida. Em aborto não criminoso comprovado por atestado médico, a trabalhadora tem direito a **2 semanas** de repouso remunerado (art. 395 da CLT).
    `,
  },
  {
    slug: "assedio-moral-trabalho-como-agir",
    titulo: "Assédio Moral no Trabalho: Como Identificar, Documentar e Agir",
    resumo: "O assédio moral no ambiente de trabalho pode gerar rescisão indireta e indenização. Entenda o que configura assédio, como reunir provas e quais são seus direitos.",
    tempo: "6 min",
    data: "2026-03-24",
    dataFormatada: "24 de março de 2026",
    imagem: imgAssedioMoral,
    conteudo: `
O assédio moral no trabalho é uma conduta repetitiva que expõe o trabalhador a situações humilhantes, constrangedoras ou degradantes. Não é apenas uma questão de convivência difícil com o chefe: é uma violação dos direitos fundamentais da pessoa e gera consequências jurídicas sérias para o empregador.

## O que configura assédio moral?

A jurisprudência trabalhista reconhece como assédio moral condutas como:

- Humilhações públicas ou privadas, repetidas ao longo do tempo
- Isolamento intencional do trabalhador, excluindo-o de reuniões e comunicações
- Metas abusivas e inalcançáveis, acompanhadas de ameaças
- Críticas constantes e desproporcionais ao trabalho do empregado
- Vigilância excessiva e perseguição
- Ameaças veladas de demissão para gerar medo
- Retirada de funções sem justificativa, deixando o trabalhador "sem fazer nada"
- Xingamentos, gritos ou tratamento ofensivo

O assédio precisa ser **repetitivo e prolongado**. Um conflito isolado, por mais desagradável que seja, normalmente não configura assédio moral. A recorrência é o que diferencia o assédio de um desentendimento pontual.

## Assédio vertical e horizontal

- **Vertical descendente:** praticado pelo superior hierárquico contra o subordinado (o mais comum)
- **Vertical ascendente:** praticado pelo subordinado contra o chefe (mais raro)
- **Horizontal:** praticado entre colegas de mesmo nível hierárquico

## Como documentar

A prova é essencial e deve ser reunida com cuidado:

- **Mensagens de texto e e-mails** com conteúdo ofensivo ou humilhante
- **Gravações de áudio** — o STF decidiu que é lícito gravar conversa da qual você participa, mesmo sem avisar a outra parte
- **Anotações com datas** descrevendo os episódios, horários e testemunhas presentes
- **Atestados médicos** que documentem o impacto na saúde (ansiedade, depressão, insônia)
- **Testemunhas** que presenciaram os episódios

## Rescisão indireta

O assédio moral continuado pode justificar a **rescisão indireta** do contrato de trabalho, prevista no **art. 483 da CLT**. A rescisão indireta é uma "justa causa ao contrário": o trabalhador encerra o contrato por culpa do empregador e recebe todas as verbas de uma demissão sem justa causa.

Além das verbas rescisórias, o trabalhador pode pleitear **indenização por danos morais**, cujo valor é arbitrado pelo juiz conforme a gravidade da conduta.

## O que fazer

1. **Documente tudo** antes de tomar qualquer ação
2. **Procure o RH ou a ouvidoria** da empresa por escrito, criando registro formal
3. **Registre ocorrência** no sindicato da categoria
4. **Consulte um advogado trabalhista** para avaliar se o caso justifica rescisão indireta
5. **Procure atendimento médico** se a situação está afetando sua saúde

O prazo para ação trabalhista é de **2 anos** após o encerramento do contrato.
    `,
  },
  {
    slug: "banco-de-horas-regras-2026",
    titulo: "Banco de Horas: Regras Atualizadas, Prazos de Compensação e Pagamento na Rescisão",
    resumo: "O banco de horas tem regras específicas sobre prazo de compensação e pagamento. Se o saldo não for zerado, as horas viram hora extra na rescisão.",
    tempo: "5 min",
    data: "2026-03-26",
    dataFormatada: "26 de março de 2026",
    imagem: imgBancoHoras,
    conteudo: `
O banco de horas é um sistema de compensação que permite trocar horas extras por folgas, em vez de pagar o adicional de 50% em dinheiro. A Reforma Trabalhista de 2017 flexibilizou as regras, mas existem limites que precisam ser respeitados. Quando o contrato acaba com saldo positivo no banco, esse saldo vira dinheiro na rescisão.

## Como funciona?

O trabalhador acumula horas extras no banco em vez de recebê-las em dinheiro. Depois, compensa essas horas com folgas ou jornadas reduzidas. O objetivo é dar flexibilidade tanto para a empresa quanto para o empregado.

## Modalidades após a Reforma Trabalhista

A Lei nº 13.467/2017 criou três formas de banco de horas:

### 1. Acordo individual escrito

Prazo de compensação: **6 meses**. Não precisa de sindicato. O acordo pode ser firmado diretamente entre empregado e empregador.

### 2. Acordo ou convenção coletiva

Prazo de compensação: **até 1 ano**. Precisa de negociação com o sindicato.

### 3. Compensação no mesmo mês

Pode ser por acordo individual tácito (verbal). As horas extras de uma semana são compensadas com folga na mesma semana ou mês.

## O que acontece na rescisão?

Se o contrato termina e o trabalhador tem **saldo positivo** no banco de horas (horas que ele trabalhou a mais e nunca foram compensadas com folga), esse saldo deve ser pago em dinheiro, com o **adicional de 50%** (ou o percentual previsto na convenção coletiva).

Se o saldo é **negativo** (o trabalhador tirou mais folgas do que horas extras acumulou), a empresa pode descontar as horas devidas da rescisão, mas isso gera controvérsia e muitos juízes não aceitam o desconto, especialmente quando o saldo negativo foi provocado pela gestão da empresa.

## Banco de horas ilegal

O banco de horas precisa de acordo escrito (individual ou coletivo). Se foi instituído apenas por comunicado verbal ou por política interna sem assinatura do empregado, pode ser considerado inválido. Nesse caso, todas as horas acumuladas devem ser pagas como horas extras comuns, com o adicional de 50%.

## Como conferir

Solicite ao RH o extrato completo do seu banco de horas. Compare com seus registros de ponto. Se houver divergência, documente e questione antes de assinar a rescisão.
    `,
  },
  {
    slug: "contrato-experiencia-rescisao",
    titulo: "Contrato de Experiência: Regras de Rescisão, Prazos e Direitos",
    resumo: "O contrato de experiência tem regras próprias para rescisão antecipada. Veja os prazos, multas e diferenças em relação ao contrato por prazo indeterminado.",
    tempo: "5 min",
    data: "2026-03-27",
    dataFormatada: "27 de março de 2026",
    imagem: imgContratoExperiencia,
    conteudo: `
O contrato de experiência é a modalidade mais usada para o início de uma relação de trabalho. Tem prazo máximo de 90 dias e permite que tanto a empresa quanto o trabalhador avaliem se a parceria funciona. Mas as regras de rescisão durante e ao final desse período são diferentes do contrato por prazo indeterminado, e muitos trabalhadores não conhecem seus direitos.

## Prazo e renovação

O contrato de experiência pode durar no máximo **90 dias**. Pode ser renovado uma única vez, desde que o total não ultrapasse 90 dias. Exemplos válidos:

- 45 + 45 dias
- 30 + 60 dias
- 60 + 30 dias

Se o contrato ultrapassar 90 dias ou for renovado mais de uma vez, converte-se automaticamente em contrato por prazo indeterminado, com todos os direitos correspondentes.

## Rescisão ao final do contrato (término natural)

Quando o contrato de experiência encerra no prazo combinado e a empresa decide não efetivar, o trabalhador recebe:

- Saldo de salário
- 13º salário proporcional
- Férias proporcionais + 1/3
- Saque do FGTS (sem multa de 40%)

O trabalhador **não recebe** aviso prévio, multa de 40% do FGTS nem seguro-desemprego.

## Rescisão antecipada pela empresa (sem justa causa)

Se a empresa decide encerrar o contrato antes do prazo final, o trabalhador recebe tudo que receberia no término natural, mais:

- **Multa de 50%** sobre os dias restantes do contrato (art. 479 da CLT)
- **Multa de 40%** sobre o FGTS
- Saque do FGTS

A multa do art. 479 é calculada assim: salário ÷ 30 × dias restantes × 50%.

## Rescisão antecipada pelo trabalhador

Se o trabalhador decide sair antes do prazo, a empresa pode descontar uma indenização de até **50% dos dias restantes** (art. 480 da CLT). Na prática, muitas empresas não aplicam esse desconto.

## Cláusula assecuratória de rescisão recíproca

Se o contrato de experiência contém uma **cláusula assecuratória** (art. 481 da CLT), as regras de rescisão antecipada seguem as mesmas de um contrato por prazo indeterminado. Isso significa aviso prévio de 30 dias, multa de 40% do FGTS e demais verbas da demissão sem justa causa.

## Gestante no contrato de experiência

A estabilidade da gestante se aplica ao contrato de experiência. Se a trabalhadora engravidar durante o período de experiência, a empresa não pode rescindir o contrato, mesmo que o prazo se encerre. A estabilidade se estende até 5 meses após o parto.
    `,
  },
  {
    slug: "verbas-rescisorias-o-que-sao",
    titulo: "Verbas Rescisórias: O Que São, Quais Existem e Como Calcular Cada Uma",
    resumo: "Um guia completo sobre todas as verbas que compõem a rescisão trabalhista: o que são, como são calculadas e em quais tipos de desligamento cada uma é devida.",
    tempo: "7 min",
    data: "2026-03-28",
    dataFormatada: "28 de março de 2026",
    imagem: imgVerbasRescisorias,
    conteudo: `
As verbas rescisórias são todos os valores que a empresa deve pagar ao trabalhador quando o contrato de trabalho é encerrado. Cada tipo de desligamento gera um conjunto diferente de verbas, e entender o que cada uma representa é o primeiro passo para conferir se a rescisão está correta.

## Mapa completo das verbas

### Saldo de salário

Os dias trabalhados no mês do desligamento. É a verba mais simples: salário ÷ 30 × dias trabalhados. Devida em todos os tipos de rescisão, sem exceção.

### Aviso prévio

O período de transição entre a comunicação e a efetivação do desligamento. Pode ser trabalhado ou indenizado. Na demissão sem justa causa, é proporcional ao tempo de serviço (30 dias + 3 por ano completo, até 90). No pedido de demissão, é fixo em 30 dias.

### 13º salário proporcional

Calculado sobre os meses trabalhados no ano do desligamento. Meses com 15 dias ou mais contam como completos. Não é devido na demissão por justa causa.

### Férias proporcionais + 1/3

Referentes ao período aquisitivo em andamento. Devidas em todos os tipos de rescisão, incluindo pedido de demissão e justa causa (neste último caso, após mudança jurisprudencial recente).

### Férias vencidas + 1/3

Períodos aquisitivos completos cujas férias não foram concedidas. Se o prazo concessivo foi ultrapassado, o pagamento deve ser em dobro (art. 137 da CLT). Devidas em todos os tipos de rescisão.

### Multa de 40% do FGTS

Incide sobre o saldo total histórico do FGTS. Devida apenas na demissão sem justa causa. No acordo mútuo, é de 20%.

### FGTS (saque)

O trabalhador pode sacar todo o saldo na demissão sem justa causa, 80% no acordo mútuo, e não pode sacar no pedido de demissão ou na justa causa.

### Seguro-desemprego

Benefício pago pelo governo, não pela empresa. Exclusivo para demissão sem justa causa, sujeito a requisitos de tempo de serviço e número de solicitações anteriores.

## Quadro resumo por tipo de desligamento

| Verba | Sem justa causa | Pedido de demissão | Justa causa | Acordo mútuo |
|---|---|---|---|---|
| Saldo de salário | Sim | Sim | Sim | Sim |
| Aviso prévio | Proporcional | 30 dias (cumpre) | Não | 50% |
| 13º proporcional | Sim | Sim | Não | Sim |
| Férias prop. + 1/3 | Sim | Sim | Controverso | Sim |
| Férias vencidas | Sim | Sim | Sim | Sim |
| Multa FGTS | 40% | Não | Não | 20% |
| Saque FGTS | 100% | Não | Não | 80% |
| Seguro-desemprego | Sim | Não | Não | Não |

## Como conferir

Use a calculadora do nosso site para simular os valores com base nas suas informações. Compare o resultado com o TRCT entregue pela empresa, verba por verba. Se encontrar diferença, questione antes de assinar.
    `,
  },
  {
    slug: "como-ler-trct-passo-a-passo",
    titulo: "Como Ler o TRCT: Entenda Cada Campo do Termo de Rescisão Passo a Passo",
    resumo: "O TRCT é o documento que detalha todos os valores da sua rescisão. Aprenda a interpretar cada campo para identificar possíveis erros antes de assinar.",
    tempo: "6 min",
    data: "2026-03-29",
    dataFormatada: "29 de março de 2026",
    imagem: imgTrctDocumento,
    conteudo: `
O Termo de Rescisão do Contrato de Trabalho é o documento oficial que lista todas as verbas da rescisão. É nele que aparecem os valores que a empresa calculou para cada verba, os descontos aplicados e o total líquido a receber. Assinar o TRCT sem entendê-lo é arriscar perder dinheiro.

## Estrutura do documento

O TRCT segue um modelo padronizado pelo Ministério do Trabalho e contém as seguintes seções:

### Identificação do empregador

Nome da empresa, CNPJ, endereço. Confira se os dados estão corretos e correspondem à empresa onde você efetivamente trabalhava.

### Identificação do trabalhador

Seu nome, CPF, data de nascimento, número da CTPS e PIS/PASEP. Erros nesses campos podem atrasar o saque do FGTS e o seguro-desemprego.

### Dados do contrato

Data de admissão, data de desligamento, causa do afastamento (código numérico que indica o tipo de rescisão), último salário e cargo. Esses campos determinam a base de todos os cálculos.

O código de afastamento é fundamental:
- **SJ** ou código referente a "Sem Justa Causa" — demissão pela empresa
- **PD** ou código de "Pedido de Demissão" — iniciativa do empregado
- **JC** — justa causa
- Existem outros códigos para acordo mútuo, término de contrato, etc.

### Verbas rescisórias (pagamentos)

Essa é a parte mais importante. Cada verba aparece em uma linha com:

- Código da rubrica
- Descrição (ex: "Aviso prévio indenizado", "13º salário proporcional")
- Valor

Confira cada linha individualmente. As rubricas mais comuns são:

- Saldo de salário
- Aviso prévio (trabalhado ou indenizado)
- 13º salário proporcional
- Férias proporcionais
- Férias vencidas
- 1/3 constitucional de férias
- Multa rescisória do FGTS (se aplicável)

### Descontos

Os descontos legais incluem:

- INSS sobre as verbas tributáveis
- Imposto de Renda Retido na Fonte (IRRF)
- Adiantamento de 13º (se já foi pago)
- Vale-transporte ou vale-refeição proporcionais
- Aviso prévio não cumprido (no pedido de demissão)

Descontos que não estejam previstos na CLT ou que não foram autorizados por escrito pelo trabalhador podem ser questionados.

### Total líquido

É o valor final que você recebe. Resultado dos pagamentos menos os descontos.

## Checklist antes de assinar

- A data de admissão está correta?
- A data de desligamento corresponde ao seu último dia efetivo?
- O tipo de rescisão (código de afastamento) está correto?
- O aviso prévio foi calculado com proporcionalidade (se cabível)?
- As férias proporcionais cobrem todos os meses devidos?
- Há férias vencidas que deveriam ser pagas em dobro?
- O 13º proporcional corresponde aos meses trabalhados no ano?
- O saldo do FGTS indicado confere com o extrato da Caixa?
- Os descontos são todos legítimos e proporcionais?

Se algum item não bater, anote e questione o RH antes de assinar. Depois da assinatura, a via judicial se torna o único caminho para corrigir diferenças.
    `,
  },
  {
    slug: "direitos-trabalhador-domestico",
    titulo: "Direitos do Trabalhador Doméstico: O Que Mudou e O Que Vale em 2026",
    resumo: "A PEC das Domésticas igualou direitos do trabalhador doméstico aos demais empregados. Veja todas as garantias: FGTS, férias, 13º, horas extras e rescisão.",
    tempo: "6 min",
    data: "2026-03-30",
    dataFormatada: "30 de março de 2026",
    imagem: imgTrabalhadorDomestico,
    conteudo: `
O empregado doméstico tinha historicamente menos proteções que os demais trabalhadores. Isso mudou com a **Emenda Constitucional nº 72/2013** (conhecida como PEC das Domésticas) e a **Lei Complementar nº 150/2015**, que regulamentou os novos direitos. Em 2026, o trabalhador doméstico registrado tem praticamente os mesmos direitos de qualquer outro empregado CLT.

## Quem é considerado empregado doméstico?

É a pessoa física que presta serviços de natureza contínua, subordinada, onerosa e pessoal e de finalidade não lucrativa à pessoa ou à família, no âmbito residencial, por mais de **2 dias na semana**.

Quem trabalha até 2 dias por semana é considerado **diarista** e não tem vínculo empregatício.

## Principais direitos garantidos

### Carteira assinada

O empregador é obrigado a registrar o empregado doméstico na CTPS. A falta de registro configura infração e gera multa.

### Salário mínimo

O empregado doméstico tem direito ao salário mínimo nacional ou ao piso regional, quando existir. O salário deve ser pago até o 5º dia útil do mês seguinte.

### FGTS

Obrigatório desde 2015. O empregador deposita **8%** do salário na conta vinculada do empregado, mensalmente, pelo eSocial.

### 13º salário

Calculado da mesma forma que para os demais trabalhadores: 1/12 por mês trabalhado no ano.

### Férias + 1/3

30 dias de férias remuneradas com o acréscimo de 1/3 constitucional. As férias podem ser fracionadas em até 2 períodos, sendo que um deles não pode ser inferior a 14 dias.

### Horas extras

Jornada máxima de **8 horas diárias e 44 horas semanais**. Horas extras devem ser pagas com adicional de no mínimo 50%.

### Adicional noturno

Trabalho entre 22h e 5h gera adicional de 20% sobre a hora diurna.

### Aviso prévio proporcional

Mesma regra dos demais trabalhadores: 30 dias + 3 dias por ano completo de serviço, até 90 dias.

### Seguro-desemprego

O empregado doméstico demitido sem justa causa tem direito a **3 parcelas** de seguro-desemprego, no valor de 1 salário mínimo cada.

## Rescisão do empregado doméstico

As verbas rescisórias seguem as mesmas regras dos demais trabalhadores CLT:

- Demissão sem justa causa: todas as verbas, incluindo multa de 40% do FGTS
- Pedido de demissão: sem multa do FGTS e sem saque do fundo
- Acordo mútuo: multa de 20% e saque de 80% do FGTS

O prazo para pagamento é de **10 dias corridos** após o desligamento.

## O eSocial doméstico

Todos os recolhimentos do empregado doméstico (FGTS, INSS, seguro contra acidentes) são feitos pelo **eSocial Doméstico**, uma plataforma unificada do governo. O empregador gera a guia DAE mensalmente e faz o pagamento em documento único.

O eSocial também é onde o empregador registra o desligamento e gera o TRCT do empregado doméstico.
    `,
  },
  {
    slug: "rescisao-indireta-quando-cabe",
    titulo: "Rescisão Indireta: Quando o Trabalhador Pode 'Demitir' a Empresa",
    resumo: "A rescisão indireta é a justa causa ao contrário: o trabalhador encerra o contrato por culpa do empregador e recebe todas as verbas. Entenda quando se aplica.",
    tempo: "5 min",
    data: "2026-01-05",
    dataFormatada: "5 de janeiro de 2026",
    imagem: imgRescisaoIndireta,
    conteudo: `
Quando a empresa descumpre suas obrigações de forma grave e reiterada, o trabalhador pode encerrar o contrato de trabalho por iniciativa própria e ainda receber todas as verbas de uma demissão sem justa causa. Esse mecanismo se chama rescisão indireta e está previsto no **art. 483 da CLT**.

## O que justifica a rescisão indireta?

O art. 483 lista as situações em que o empregado pode considerar rescindido o contrato:

- **Exigência de serviços superiores às suas forças ou proibidos por lei** — como tarefas que extrapolam sua capacidade física ou atribuições ilegais
- **Tratamento com rigor excessivo** — punições desproporcionais e perseguição
- **Não cumprimento das obrigações do contrato** — atraso de salários, não recolhimento de FGTS, não pagamento de benefícios
- **Ato lesivo da honra** — ofensas, xingamentos, humilhações pelo empregador
- **Redução do trabalho que afete a remuneração** — diminuir as atividades de quem ganha por produção ou comissão
- **Perigo manifesto de mal considerável** — exposição a riscos sem equipamentos de proteção

Na prática, as situações mais comuns que levam à rescisão indireta são:

- Atraso reiterado de salários (3 meses ou mais de atraso costuma ser aceito pelos tribunais)
- Não recolhimento do FGTS por período prolongado
- Assédio moral comprovado
- Desvio de função sem o ajuste salarial correspondente
- Não pagamento de horas extras habitualmente devidas

## Como funciona o procedimento?

Diferente do pedido de demissão (em que o trabalhador simplesmente comunica a empresa), a rescisão indireta precisa ser formalizada pela via judicial. O trabalhador entra com uma reclamação trabalhista pedindo o reconhecimento da rescisão indireta e o pagamento de todas as verbas.

O trabalhador pode:

1. Continuar trabalhando enquanto aguarda a decisão judicial (mais seguro)
2. Parar de trabalhar imediatamente, comunicando à empresa por escrito os motivos

A segunda opção é mais arriscada: se o juiz não reconhecer a rescisão indireta, o trabalhador pode ter o período de ausência considerado como abandono de emprego.

## O que o trabalhador recebe?

Se reconhecida judicialmente, a rescisão indireta gera o pagamento de todas as verbas de uma demissão sem justa causa:

- Aviso prévio proporcional
- 13º salário proporcional
- Férias proporcionais e vencidas + 1/3
- Multa de 40% do FGTS
- Saque integral do FGTS
- Direito ao seguro-desemprego
- Possível indenização por danos morais, dependendo do caso

## Dicas para quem está nessa situação

Antes de tomar qualquer iniciativa, consulte um advogado trabalhista. A rescisão indireta exige provas robustas e o procedimento incorreto pode reverter a situação contra o trabalhador. Documente tudo: recibos de pagamento atrasados, extratos de FGTS sem depósitos, mensagens com conteúdo ofensivo.
    `,
  },
  {
    slug: "reforma-trabalhista-principais-mudancas",
    titulo: "Reforma Trabalhista: As Principais Mudanças Que Ainda Afetam a Sua Rescisão",
    resumo: "A Reforma de 2017 alterou regras de aviso prévio, homologação, banco de horas e criou o acordo mútuo. Veja o que mudou e como isso impacta o seu desligamento.",
    tempo: "6 min",
    data: "2026-01-12",
    dataFormatada: "12 de janeiro de 2026",
    imagem: imgReformaTrabalhista,
    conteudo: `
A Reforma Trabalhista de 2017 (**Lei nº 13.467**) foi a maior alteração na CLT desde sua criação em 1943. Embora já tenha quase 9 anos de vigência, muitos trabalhadores ainda desconhecem as mudanças que afetam diretamente o momento da rescisão. Algumas foram favoráveis ao trabalhador, outras reduziram proteções que existiam antes.

## Fim da obrigatoriedade de homologação no sindicato

Antes da Reforma, contratos com mais de 1 ano de duração precisavam ter a rescisão homologada pelo sindicato ou pelo Ministério do Trabalho. O sindicato conferia os valores e podia bloquear o pagamento se identificasse irregularidades.

A Reforma eliminou essa exigência. Agora, a rescisão pode ser feita diretamente entre empresa e empregado, sem intermediário. Isso significa que o trabalhador precisa conferir os valores por conta própria antes de assinar.

## Rescisão por acordo mútuo (art. 484-A)

Uma novidade da Reforma. Antes, não existia caminho legal para empresa e trabalhador encerrarem o contrato de comum acordo. A Reforma criou o desligamento consensual, com regras específicas:

- Aviso prévio: metade (50%)
- Multa do FGTS: 20% (em vez de 40%)
- Saque do FGTS: 80% do saldo
- Seguro-desemprego: não tem direito
- Demais verbas: pagas integralmente

## Intervalo intrajornada

Antes da Reforma, a supressão do intervalo de almoço gerava pagamento integral da hora como hora extra. A Reforma mudou: agora, paga-se apenas o **tempo efetivamente suprimido**, com adicional de 50%. Além disso, o pagamento passou a ter natureza indenizatória, sem reflexos em outras verbas.

## Banco de horas por acordo individual

Antes, o banco de horas só podia ser instituído por acordo ou convenção coletiva. A Reforma permitiu o acordo individual escrito, com prazo de compensação de 6 meses.

## Danos morais tabelados

A Reforma criou uma tabela para limitação dos valores de indenização por danos morais, vinculada ao salário do trabalhador:

- Ofensa leve: até 3x o salário
- Ofensa média: até 5x o salário
- Ofensa grave: até 20x o salário
- Ofensa gravíssima: até 50x o salário

O STF declarou essa tabela inconstitucional em 2023, devolvendo ao juiz a liberdade de fixar o valor conforme a gravidade do caso.

## Prazo de pagamento unificado

Antes da Reforma, o prazo variava conforme o tipo de aviso prévio (1 dia útil para aviso trabalhado, 10 dias para indenizado). A Reforma unificou em **10 dias corridos** para todos os casos.

## Contribuição sindical

A Reforma tornou a contribuição sindical **facultativa**, eliminando o desconto obrigatório de 1 dia de salário por ano. Isso reduziu drasticamente a receita dos sindicatos, mas não alterou os direitos do trabalhador na rescisão.

## O que a Reforma NÃO mudou

Algumas proteções permaneceram intactas:

- Aviso prévio proporcional por tempo de serviço
- Multa de 40% do FGTS na demissão sem justa causa
- Férias em dobro quando vencidas fora do prazo
- Estabilidade da gestante e do acidentado
- Seguro-desemprego
- Prazo de 2 anos para ação trabalhista
    `,
  },
  {
    slug: "calculo-salario-proporcional-dias-trabalhados",
    titulo: "Saldo de Salário: Como Calcular os Dias Trabalhados no Mês da Rescisão",
    resumo: "O saldo de salário parece simples, mas esconde detalhes como variáveis, adicionais e a forma correta de contar os dias. Veja como calcular sem erros.",
    tempo: "4 min",
    data: "2026-01-18",
    dataFormatada: "18 de janeiro de 2026",
    imagem: imgSalarioProporcional,
    conteudo: `
O saldo de salário é a primeira verba listada no TRCT e, em tese, a mais simples. Corresponde aos dias trabalhados no mês do desligamento que ainda não foram pagos no último contracheque. Mas mesmo nessa conta aparentemente trivial existem detalhes que geram diferenças.

## Fórmula básica

**Salário mensal ÷ 30 × dias trabalhados no mês**

A CLT adota o mês comercial de 30 dias para fins de cálculo, independentemente do mês ter 28, 29 ou 31 dias. Isso significa que, em fevereiro, cada dia "vale" 1/30 do salário, o mesmo que em julho.

## A contagem dos dias

O dia do desligamento conta como dia trabalhado. Se o último dia de trabalho foi dia 15, o saldo cobre os dias 1 a 15 (15 dias).

Se houve aviso prévio trabalhado, o último dia de trabalho é o último dia do aviso. Se o aviso foi indenizado, o último dia de trabalho é a data em que o empregado foi efetivamente dispensado.

## Variáveis que entram no saldo

O saldo de salário não é apenas o salário fixo proporcional. Se o trabalhador recebia outras verbas no mês, elas também entram no proporcional:

- Horas extras realizadas no mês do desligamento
- Comissões sobre vendas feitas no período
- Adicional noturno dos dias trabalhados
- Adicional de insalubridade ou periculosidade do mês
- DSR (Descanso Semanal Remunerado) proporcional

## Descontos no saldo

Os descontos legais que incidem sobre o saldo de salário são:

- **INSS** — calculado sobre o valor proporcional
- **IRRF** — se o valor tributável ultrapassar a faixa de isenção
- **Vale-transporte** — proporcional aos dias trabalhados (máximo de 6% do salário)
- **Faltas injustificadas** — se houve no período

## Quando o saldo está errado

Os erros mais comuns são:

1. Não incluir horas extras do mês no cálculo proporcional
2. Descontar vale-transporte sobre o mês inteiro quando o trabalhador só atuou parte do mês
3. Ignorar comissões pendentes de pagamento
4. Calcular sobre 31 dias em meses que têm 31, reduzindo o valor de cada dia

Se o seu saldo de salário no TRCT não reflete a remuneração real que você receberia pelo mês inteiro, proporcionalmente, há diferença a questionar.
    `,
  },
  {
    slug: "como-entrar-acao-trabalhista",
    titulo: "Ação Trabalhista: Como Funciona, Quanto Custa e Quando Vale a Pena",
    resumo: "Entenda o passo a passo de uma reclamação trabalhista: prazos, custos, documentos necessários e o que esperar do processo na Justiça do Trabalho.",
    tempo: "7 min",
    data: "2026-01-25",
    dataFormatada: "25 de janeiro de 2026",
    imagem: imgAcaoTrabalhista,
    conteudo: `
A reclamação trabalhista é o instrumento pelo qual o trabalhador leva à Justiça do Trabalho as irregularidades cometidas pelo empregador durante o contrato. Pode envolver desde diferenças salariais e verbas rescisórias não pagas até reconhecimento de vínculo empregatício e indenização por danos morais.

## Prazo para entrar com ação

O trabalhador tem **2 anos** a partir da data do desligamento para ingressar com a ação. Dentro desse prazo, pode cobrar irregularidades dos últimos **5 anos** do contrato de trabalho.

Depois de 2 anos, o direito de ação prescreve. Não existe recurso para recuperar esse prazo.

## Quanto custa?

A Justiça do Trabalho é **gratuita** para quem não tem condições de arcar com os custos. A gratuidade (justiça gratuita) é concedida para trabalhadores que recebem salário igual ou inferior a 40% do teto do RGPS, ou que declarem insuficiência de recursos.

Quem não tem direito à gratuidade paga custas processuais (em torno de 2% sobre o valor da causa) e pode ser responsabilizado por honorários do advogado da outra parte em caso de derrota parcial.

## Documentos necessários

Para ingressar com a ação, organize:

- CTPS (Carteira de Trabalho) ou registros no app gov.br
- TRCT (Termo de Rescisão)
- Contracheques (quanto mais meses, melhor)
- Extrato do FGTS (pelo app FGTS)
- Registros de ponto (se disponíveis)
- E-mails, mensagens e qualquer prova documental relevante
- Contrato de trabalho

## Como funciona o processo

### 1. Petição inicial

O advogado redige a petição detalhando os pedidos (diferenças salariais, verbas rescisórias, indenizações) e protocoliza na Vara do Trabalho.

### 2. Audiência de conciliação

A primeira audiência busca um acordo entre as partes. Muitos casos são resolvidos nessa etapa, pois tanto empregado quanto empregador podem preferir evitar o processo longo.

### 3. Audiência de instrução

Se não houver acordo, são ouvidas testemunhas e apresentadas provas. O juiz avalia tudo para formar sua convicção.

### 4. Sentença

O juiz profere a sentença, condenando ou absolvendo o empregador nos pedidos feitos. Cabe recurso ao TRT (Tribunal Regional do Trabalho).

### 5. Execução

Se o empregador for condenado e não pagar espontaneamente, o trabalhador pode pedir a execução forçada: bloqueio de contas, penhora de bens, etc.

## Quando vale a pena?

A ação trabalhista vale a pena quando:

- As diferenças identificadas representam valores significativos
- Existem provas suficientes para sustentar os pedidos
- A empresa tem patrimônio para honrar eventual condenação
- O prazo de 2 anos ainda não expirou

## O papel do advogado

Embora seja possível ingressar com ação sem advogado (jus postulandi), é altamente recomendável ter representação profissional. O advogado trabalhista conhece os prazos, as provas necessárias e as estratégias para cada tipo de pedido. Muitos advogados trabalham com honorários condicionados ao resultado (só cobram se ganhar).
    `,
  },
  {
    slug: "convencao-coletiva-como-consultar",
    titulo: "Convenção Coletiva: O Que É, Como Consultar e Por Que Afeta Sua Rescisão",
    resumo: "A convenção coletiva pode garantir direitos superiores à CLT: pisos salariais, adicionais maiores e estabilidades extras. Veja como encontrar a da sua categoria.",
    tempo: "5 min",
    data: "2026-02-01",
    dataFormatada: "1 de fevereiro de 2026",
    imagem: imgConvencaoColetiva,
    conteudo: `
Muitos trabalhadores conhecem a CLT, mas desconhecem a convenção coletiva da sua categoria profissional. E é justamente na convenção que podem estar os direitos mais valiosos: pisos salariais acima do mínimo, adicionais com percentuais maiores, estabilidade pré-aposentadoria e benefícios que a CLT não prevê.

## O que é uma convenção coletiva?

É um acordo negociado entre o sindicato dos trabalhadores e o sindicato patronal (dos empregadores) que estabelece regras específicas para uma categoria profissional em determinada região. A convenção tem força de lei e se aplica a todos os trabalhadores da categoria, sindicalizados ou não.

## Diferença entre convenção e acordo coletivo

- **Convenção coletiva (CCT):** negociada entre sindicatos patronal e dos trabalhadores, vale para toda a categoria na base territorial
- **Acordo coletivo (ACT):** negociado entre o sindicato dos trabalhadores e uma empresa específica, vale apenas para os empregados daquela empresa

O acordo coletivo pode prever condições diferentes da convenção, e após a Reforma Trabalhista, o ACT prevalece sobre a CCT quando houver conflito.

## O que a convenção pode prever a mais

### Piso salarial

A convenção pode estabelecer um salário mínimo da categoria superior ao salário mínimo nacional. Se o seu piso é de R$ 2.800 e você recebia R$ 1.600, há diferença a cobrar.

### Adicionais maiores

Insalubridade, periculosidade, adicional noturno e hora extra podem ter percentuais maiores do que os mínimos da CLT. Uma convenção que prevê hora extra a 70% dá mais direitos do que os 50% da CLT.

### Estabilidade pré-aposentadoria

Muitas convenções garantem que o trabalhador que está a 12 ou 24 meses de se aposentar não pode ser demitido sem justa causa.

### Benefícios

Auxílio-alimentação, auxílio-creche, seguro de vida, plano de saúde e cestas básicas frequentemente constam nas convenções coletivas.

### Homologação obrigatória

Mesmo após a Reforma Trabalhista ter eliminado a obrigatoriedade legal, muitas convenções mantêm a exigência de homologação no sindicato.

## Como consultar

1. Identifique qual é o sindicato da sua categoria profissional (está na CTPS ou você pode consultar pelo site do MTE)
2. Acesse o site do sindicato e procure a seção "Convenção Coletiva" ou "CCT"
3. Use o sistema **Mediador** do Ministério do Trabalho: acesse mediador.mte.gov.br e pesquise por CNPJ da empresa, sindicato ou atividade econômica

## Por que isso importa na rescisão

Se a convenção coletiva da sua categoria prevê piso salarial de R$ 3.200 e a empresa pagava R$ 2.500, todas as verbas rescisórias foram calculadas sobre base menor do que deveriam. A diferença se multiplica em cada verba: 13º, férias, aviso prévio, FGTS.

Antes de assinar a rescisão, consulte a convenção coletiva vigente e verifique se os seus direitos estão sendo respeitados.
    `,
  },
  {
    slug: "vale-transporte-regras-desconto",
    titulo: "Vale-Transporte: Regras, Desconto de 6% e Direitos do Trabalhador",
    resumo: "Entenda como funciona o vale-transporte, qual o desconto máximo permitido por lei, quando a empresa pode negar e o que acontece na rescisão.",
    tempo: "6 min",
    data: "2026-03-20",
    dataFormatada: "20 de março de 2026",
    imagem: imgValeTransporte,
    conteudo: `
O vale-transporte é um dos benefícios mais antigos e mais mal compreendidos da legislação trabalhista brasileira. Criado pela **Lei nº 7.418/1985**, ele garante ao trabalhador o direito de receber antecipadamente o valor necessário para o deslocamento residência-trabalho e trabalho-residência.

## Como funciona o desconto de 6%?

O empregador pode descontar até **6% do salário base** do trabalhador a título de vale-transporte. Se o custo real do transporte for menor que 6%, desconta-se apenas o valor efetivo. Se for maior, a diferença é bancada integralmente pela empresa.

**Exemplo:** Trabalhador com salário de R$ 2.000. Custo mensal de transporte: R$ 320. Desconto máximo: R$ 2.000 × 6% = R$ 120. A empresa arca com os R$ 200 restantes.

O desconto incide apenas sobre o **salário base**, não sobre a remuneração total. Comissões, horas extras e adicionais não entram nessa conta.

## Quem tem direito?

Todo trabalhador com carteira assinada que utiliza transporte público coletivo para ir e voltar do trabalho. A empresa não pode substituir o vale-transporte por dinheiro em espécie, salvo se houver previsão em convenção coletiva.

O benefício não tem natureza salarial — ou seja, **não integra a base de cálculo** de 13º, férias, FGTS ou qualquer outra verba trabalhista.

## A empresa pode negar o vale-transporte?

Não, desde que o trabalhador solicite formalmente. O empregado deve declarar por escrito que utiliza transporte público e informar os meios de transporte e o endereço residencial. A recusa da empresa é irregular.

Se o trabalhador reside próximo o suficiente para ir a pé, ele pode optar por não solicitar o benefício. Mas a decisão é do empregado, não da empresa.

## Vale-transporte e home office

Com a regulamentação do teletrabalho, trabalhadores em regime de home office integral não têm direito ao vale-transporte nos dias em que não se deslocam. No regime híbrido, o benefício é devido proporcionalmente aos dias presenciais.

## E na rescisão?

Na rescisão, o vale-transporte já fornecido para o mês em curso não precisa ser devolvido. A empresa também não pode descontar o vale-transporte não utilizado das verbas rescisórias, salvo se houver saldo de adiantamento explicitamente previsto em contrato.

Se a empresa não forneceu o vale-transporte durante o contrato, o trabalhador pode cobrar a diferença na Justiça do Trabalho. O prazo é o mesmo: 2 anos após o desligamento.
    `,
  },
  {
    slug: "trabalho-remoto-home-office-direitos",
    titulo: "Trabalho Remoto e Home Office: Direitos, Regras e o Que Diz a CLT",
    resumo: "Saiba quais são os direitos do trabalhador em home office, o que a empresa deve fornecer, como fica o controle de jornada e o que mudou com a legislação recente.",
    tempo: "7 min",
    data: "2026-03-22",
    dataFormatada: "22 de março de 2026",
    imagem: imgTrabalhoRemoto,
    conteudo: `
O teletrabalho ganhou força durante a pandemia e se consolidou como modalidade permanente em milhões de contratos. A **Lei nº 14.442/2022** atualizou as regras da CLT sobre o tema, trazendo mais clareza sobre direitos e obrigações.

## O que a CLT diz sobre teletrabalho?

O **art. 75-B da CLT** define teletrabalho como a prestação de serviços fora das dependências do empregador, de forma preponderante ou não, com a utilização de tecnologias de informação e comunicação.

O comparecimento eventual ao escritório não descaracteriza o regime de teletrabalho.

## Controle de jornada

Um dos pontos mais debatidos. A CLT prevê que o teletrabalhador por **produção ou tarefa** não está sujeito ao controle de jornada e, portanto, não tem direito a horas extras. Já o teletrabalhador por **jornada** tem os mesmos direitos de quem trabalha presencialmente: hora extra, intervalo, adicional noturno se aplicável.

A distinção deve estar expressa no contrato de trabalho. Se não estiver, presume-se o controle por jornada.

## O que a empresa deve fornecer?

A responsabilidade por equipamentos e infraestrutura deve ser definida em contrato escrito. Na prática, a maioria das empresas fornece notebook, cadeira ergonômica e auxílio para internet e energia elétrica.

Os custos de infraestrutura pagos pela empresa **não têm natureza salarial** — não integram férias, 13º, FGTS nem qualquer outra verba.

## Direitos mantidos

O trabalhador remoto tem os mesmos direitos trabalhistas de quem trabalha presencialmente:

- 13º salário
- Férias com terço constitucional
- FGTS
- INSS
- Seguro-desemprego (se demitido sem justa causa)
- Aviso prévio proporcional

A única diferença significativa é o vale-transporte, que não é devido nos dias em que não há deslocamento.

## Acidente de trabalho em home office

Acidentes ocorridos durante o expediente em home office podem ser enquadrados como **acidente de trabalho**, desde que haja nexo causal entre a atividade e o evento. A empresa deve orientar o trabalhador sobre ergonomia e prevenção de doenças ocupacionais.

## Rescisão no teletrabalho

A rescisão segue exatamente as mesmas regras da CLT: aviso prévio proporcional, multa do FGTS, férias, 13º. Não há diferença no cálculo das verbas rescisórias. A única atenção especial é com a devolução de equipamentos fornecidos pela empresa, que deve ser tratada no ato da rescisão.
    `,
  },
  {
    slug: "plr-participacao-lucros-resultados",
    titulo: "PLR: O Que É a Participação nos Lucros e Resultados e Quais São Seus Direitos",
    resumo: "Entenda como funciona a PLR, quando ela é obrigatória, como é calculada, se incide FGTS e o que acontece quando o trabalhador é demitido antes do pagamento.",
    tempo: "6 min",
    data: "2026-03-25",
    dataFormatada: "25 de março de 2026",
    imagem: imgPlr,
    conteudo: `
A Participação nos Lucros ou Resultados (PLR) é um dos benefícios que mais geram dúvidas entre trabalhadores. Regulamentada pela **Lei nº 10.101/2000**, ela permite que empresas dividam parte dos lucros com os empregados, sem que o valor tenha natureza salarial.

## A PLR é obrigatória?

Não existe obrigação legal genérica de pagar PLR. Ela se torna obrigatória apenas quando prevista em **convenção coletiva, acordo coletivo ou acordo entre empresa e comissão de empregados**. Se a convenção coletiva da sua categoria prevê PLR, a empresa deve pagar.

## Como é calculada?

Os critérios de cálculo são definidos no acordo que instituiu a PLR. Podem ser metas individuais, metas coletivas, percentual do lucro líquido ou uma combinação desses fatores. Não existe fórmula padrão na lei.

O pagamento pode ser feito em até **duas parcelas** por ano, com intervalo mínimo de um trimestre civil entre elas.

## PLR tem desconto de FGTS e INSS?

**Não.** A PLR não tem natureza salarial, portanto não integra a base de cálculo do FGTS, INSS, férias, 13º ou qualquer verba rescisória. Incide apenas **Imposto de Renda Retido na Fonte (IRRF)**, com tabela progressiva específica para PLR.

| Valor da PLR | Alíquota |
|---|---|
| Até R$ 7.640,80 | Isento |
| De R$ 7.640,81 a R$ 9.922,28 | 7,5% |
| De R$ 9.922,29 a R$ 13.167,00 | 15% |
| De R$ 13.167,01 a R$ 16.380,38 | 22,5% |
| Acima de R$ 16.380,38 | 27,5% |

## Fui demitido antes do pagamento. Tenho direito?

Se o acordo coletivo prevê PLR proporcional para trabalhadores desligados antes da data de pagamento, sim. Muitas convenções coletivas garantem o **pagamento proporcional** aos meses trabalhados no período de apuração.

Se o acordo for omisso sobre esse ponto, a jurisprudência do TST tende a reconhecer o direito proporcional, especialmente em demissões sem justa causa. Verifique a convenção coletiva da sua categoria.

## PLR e rescisão

A PLR não entra no cálculo das verbas rescisórias. Mas se o valor estava pendente na data do desligamento e o acordo prevê o pagamento proporcional, ele deve ser quitado junto com a rescisão ou na data estipulada pelo acordo.
    `,
  },
  {
    slug: "direitos-estagiario-lei-estagio",
    titulo: "Direitos do Estagiário: O Que a Lei do Estágio Garante em 2026",
    resumo: "Conheça os direitos do estagiário previstos na Lei 11.788/2008: bolsa-auxílio, férias, carga horária, seguro obrigatório e o que fazer em caso de irregularidades.",
    tempo: "6 min",
    data: "2026-03-28",
    dataFormatada: "28 de março de 2026",
    imagem: imgEstagiario,
    conteudo: `
O estágio não é emprego, mas também não é terra de ninguém. A **Lei nº 11.788/2008** (Lei do Estágio) define regras claras sobre carga horária, remuneração, férias e supervisão. Quando essas regras são descumpridas, o vínculo pode ser reconhecido como empregatício, com todos os direitos da CLT.

## Quais são os direitos do estagiário?

### Carga horária limitada

- Ensino superior e ensino médio: no máximo **6 horas por dia** e **30 horas por semana**
- Ensino fundamental e educação especial: no máximo **4 horas por dia** e **20 horas por semana**

Não existe hora extra para estagiário. Se a empresa exige jornada além do limite, está descumprindo a lei.

### Bolsa-auxílio

No estágio **não obrigatório**, a empresa deve pagar bolsa-auxílio (não existe valor mínimo legal, mas a convenção coletiva pode prever um piso). No estágio **obrigatório** (curricular), o pagamento é facultativo.

### Auxílio-transporte

O auxílio-transporte é obrigatório no estágio não obrigatório. No obrigatório, é opcional.

### Férias remuneradas

O estagiário tem direito a **30 dias de recesso remunerado** a cada 12 meses de estágio, preferencialmente durante as férias escolares. Se o estágio durar menos de 12 meses, o recesso é proporcional.

### Seguro contra acidentes pessoais

O seguro é **obrigatório** e deve ser contratado pela empresa ou pela instituição de ensino, conforme o termo de compromisso. Estágio sem seguro é irregular.

## Prazo máximo do estágio

O estágio na mesma empresa pode durar no máximo **2 anos**, exceto para estagiários com deficiência, que não têm esse limite.

## Quando o estágio vira emprego?

Se a empresa descumprir as regras da Lei do Estágio, o vínculo pode ser reconhecido como **emprego com carteira assinada**. Os casos mais comuns:

- Carga horária acima do permitido
- Atividades incompatíveis com o curso
- Ausência de supervisor
- Ausência de termo de compromisso com a instituição de ensino
- Estágio que se prolonga além de 2 anos

Se o vínculo for reconhecido, o estagiário passa a ter direito a todas as verbas trabalhistas do período: 13º, férias, FGTS, INSS e, se for demitido, rescisão completa.

## E se o estágio for encerrado?

O encerramento do estágio não segue as regras da CLT. Não há aviso prévio, multa de FGTS nem seguro-desemprego. O estagiário recebe o recesso proporcional (se houver saldo) e a bolsa até o último dia. O seguro contra acidentes cobre o período do estágio.
    `,
  },
  {
    slug: "contrato-intermitente-como-funciona",
    titulo: "Contrato Intermitente: Como Funciona, Direitos e Cálculo da Rescisão",
    resumo: "Entenda o que é o trabalho intermitente criado pela Reforma Trabalhista, como funciona a convocação, quais são os direitos e como calcular a rescisão nessa modalidade.",
    tempo: "7 min",
    data: "2026-04-01",
    dataFormatada: "1 de abril de 2026",
    imagem: imgContratoIntermitente,
    conteudo: `
O contrato de trabalho intermitente foi criado pela **Reforma Trabalhista de 2017** (Lei nº 13.467/2017) e regulamentado pelo **art. 443, §3º e art. 452-A da CLT**. É uma modalidade em que o trabalhador é convocado para prestar serviços de forma não contínua, com alternância entre períodos de trabalho e inatividade.

## Como funciona na prática?

O empregador convoca o trabalhador com pelo menos **3 dias corridos de antecedência**. O trabalhador tem **1 dia útil** para aceitar ou recusar a convocação. A recusa não caracteriza insubordinação.

O trabalhador pode ter vínculo com múltiplas empresas simultaneamente e pode recusar convocações sem consequências.

## Quais são os direitos?

Ao final de cada período de prestação de serviço, o trabalhador intermitente recebe, de forma proporcional:

- **Remuneração** (nunca inferior ao salário mínimo hora ou ao piso da categoria)
- **Férias proporcionais + 1/3**
- **13º salário proporcional**
- **FGTS** (depositado mensalmente)
- **Contribuição previdenciária (INSS)**

Todos esses valores são pagos **ao final de cada período de convocação**, não mensalmente como no contrato tradicional.

### Férias

A cada 12 meses, o trabalhador intermitente adquire direito a **1 mês de férias**, durante o qual não pode ser convocado. As férias, no entanto, já foram pagas proporcionalmente ao longo do ano.

### FGTS

O FGTS é depositado mensalmente sobre cada pagamento. Na rescisão, a multa de 40% incide sobre o saldo total acumulado, como em qualquer contrato CLT.

## Como funciona a rescisão?

A rescisão do contrato intermitente segue regras próprias. Na demissão sem justa causa:

- **Multa de 40% sobre o FGTS:** devida normalmente
- **Aviso prévio:** metade do valor (indenizado)
- **13º e férias:** já foram pagos proporcionalmente a cada convocação — não há saldo a pagar, salvo diferenças
- **Seguro-desemprego:** atualmente em debate jurídico. O STF analisou a constitucionalidade do trabalho intermitente, e a questão do seguro-desemprego ainda gera controvérsias

### Período de inatividade

Durante os períodos de inatividade, o trabalhador não recebe remuneração e não está à disposição da empresa. Esse período não conta como tempo de serviço para fins de aviso prévio proporcional.

## Cuidados importantes

- O contrato intermitente deve ser **escrito** e registrado na CTPS
- A remuneração hora não pode ser inferior ao salário mínimo hora ou ao valor pago aos demais empregados na mesma função
- Se a empresa convoca e depois cancela, deve pagar **50% da remuneração** que seria devida

## Vale a pena?

O contrato intermitente é vantajoso para quem busca flexibilidade ou complemento de renda. Mas como os direitos são pagos proporcionalmente a cada convocação, o valor acumulado tende a ser menor do que num contrato tradicional de mesma remuneração mensal. Faça as contas antes de aceitar.
    `,
  },
];
