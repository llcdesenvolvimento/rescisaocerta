/**
 * Conteúdo editorial exibido abaixo do quiz em cada pergunta.
 * Cada seção é um mini-artigo educativo sobre direitos trabalhistas.
 */

interface EditorialSection {
  titulo: string;
  conteudo: React.ReactNode;
}

function Dica({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 my-5">
      <p className="text-sm font-semibold text-blue-800 mb-1">Dica prática</p>
      <div className="text-sm text-blue-900/80 leading-relaxed">{children}</div>
    </div>
  );
}

function ExemploPratico({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-5">
      <p className="text-sm font-semibold text-gray-700 mb-1">Exemplo prático</p>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}

function LeiRef({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4 my-5">
      <p className="text-sm font-semibold text-amber-800 mb-1">O que diz a lei</p>
      <div className="text-sm text-amber-900/80 leading-relaxed">{children}</div>
    </div>
  );
}

const editorialContent: Record<string, EditorialSection> = {
  objetivo: {
    titulo: "Cálculo da Rescisão Trabalhista: Guia Completo Para o Trabalhador Brasileiro",
    conteudo: (
      <>
        <p>
          A rescisão do contrato de trabalho é um dos momentos mais importantes, e delicados, da vida profissional
          de qualquer trabalhador. Nesse momento, uma série de direitos garantidos pela Consolidação das Leis do
          Trabalho (CLT) precisam ser observados e calculados corretamente pelo empregador. Infelizmente, erros
          e omissões nesse processo são mais comuns do que se imagina.
        </p>
        <p>
          Segundo levantamentos de sindicatos e tribunais regionais do trabalho, uma parcela significativa das
          rescisões apresenta alguma inconsistência nos valores pagos. Os erros mais recorrentes envolvem a base
          de cálculo incorreta, a não inclusão de verbas habituais e a falta de proporcionalidade no aviso prévio.
          Por isso, conferir os valores é um direito, e uma necessidade, de todo trabalhador.
        </p>

        <h3>Quais verbas compõem a rescisão trabalhista?</h3>
        <p>
          A rescisão é composta por diversas parcelas que variam conforme o tipo de desligamento. As principais
          verbas incluem o saldo de salário (dias trabalhados no mês da demissão), férias proporcionais e vencidas
          acrescidas de 1/3 constitucional, 13º salário proporcional, aviso prévio (trabalhado ou indenizado),
          multa de 40% sobre o saldo do FGTS e a liberação do fundo.
        </p>
        <p>
          Cada uma dessas parcelas tem regras específicas de cálculo, prazos e condições. A complexidade do cálculo
          é justamente o que torna comum a ocorrência de erros, sejam eles involuntários ou não. Entender como
          cada verba funciona é o primeiro passo para verificar se os valores estão corretos.
        </p>

        <h3>Por que conferir o cálculo da rescisão?</h3>
        <p>
          Muitos trabalhadores assinam o Termo de Rescisão do Contrato de Trabalho (TRCT) sem conferir os valores,
          seja por desconhecimento ou pela pressa de receber os pagamentos. Porém, assinar o TRCT não impede o
          trabalhador de questionar os valores posteriormente: o prazo para ingressar com ação trabalhista é de
          até 2 anos após o desligamento, podendo reclamar direitos dos últimos 5 anos do contrato.
        </p>
        <p>
          Conferir a rescisão com uma ferramenta independente de cálculo permite identificar diferenças que podem
          representar valores expressivos. Uma base de cálculo incorreta, por exemplo, afeta todas as verbas
          proporcionais, gerando um efeito cascata que amplifica a diferença total.
        </p>

        <ExemploPratico>
          <p>
            Um trabalhador com salário de R$ 3.500, 4 anos de empresa e{" "}
            <a href="/blog/demissao-sem-justa-causa-direitos" className="text-blue-700 underline">demissão sem justa causa</a>{" "}
            tem direito a aproximadamente: saldo de salário (proporcional), férias proporcionais + 1/3, 13º proporcional,
            aviso prévio de 42 dias (30 + 12 dias proporcionais), multa de 40% do FGTS e saque do fundo.
            Se a empresa calcular o aviso prévio com apenas 30 dias (sem a proporcionalidade), a diferença
            pode ultrapassar R$ 2.000, sem contar os reflexos nas demais verbas.
          </p>
        </ExemploPratico>

        <h3>Simular ou conferir: qual a diferença?</h3>
        <p>
          Se você ainda não foi desligado, uma simulação permite projetar quanto você receberia em diferentes
          cenários: pedido de demissão, demissão sem justa causa ou acordo mútuo. Essa informação é valiosa para
          planejar financeiramente a transição de emprego e avaliar a melhor estratégia.
        </p>
        <p>
          Se já foi desligado, a conferência permite comparar os valores pagos com o que a legislação prevê.
          Qualquer diferença identificada pode ser discutida diretamente com a empresa, com o sindicato da
          categoria ou, se necessário, perante a Justiça do Trabalho.
        </p>

        <Dica>
          <p>
            Antes de assinar qualquer documento de rescisão, solicite o detalhamento de cada verba ao departamento
            pessoal. Compare os valores com uma simulação independente. Se houver divergência, anote os itens
            específicos e procure orientação no sindicato da sua categoria.
          </p>
        </Dica>

        <h3>Onde buscar ajuda em caso de irregularidade</h3>
        <p>
          Se você identificar que os valores pagos estão incorretos, existem três caminhos principais: procurar
          o sindicato da categoria para mediação, buscar orientação com um advogado trabalhista, ou registrar
          uma denúncia no Ministério do Trabalho. Nos casos mais simples, um contato direto com o departamento
          pessoal da empresa pode resolver a questão sem necessidade de ação judicial.
        </p>
      </>
    ),
  },

  situacaoAtual: {
    titulo: "Situação do Trabalhador na Rescisão: Como Ela Define Seus Direitos",
    conteudo: (
      <>
        <p>
          A situação em que o trabalhador se encontra no momento da rescisão: se já foi desligado, está cumprindo
          aviso prévio ou ainda avalia suas opções, determina não apenas quais verbas terá direito a receber,
          mas também os prazos legais que a empresa precisa cumprir e as estratégias disponíveis para proteger
          seus interesses financeiros.
        </p>

        <h3>Trabalhador já desligado: prazos e cuidados</h3>
        <p>
          Quando o contrato de trabalho já foi encerrado, o empregador tem obrigação legal de efetuar o pagamento
          de todas as verbas rescisórias em até 10 dias corridos a partir do término do contrato (art. 477, § 6º,
          da CLT). Esse prazo vale independentemente do tipo de desligamento: seja{" "}
          <a href="/blog/demissao-sem-justa-causa-direitos" className="text-blue-700 underline">demissão sem justa causa</a>,{" "}
          pedido de demissão ou acordo mútuo.
        </p>
        <p>
          O descumprimento desse prazo gera multa a favor do trabalhador no valor equivalente ao seu salário
          mensal, conforme previsto no § 8º do mesmo artigo. Além do pagamento das verbas, a empresa deve
          fornecer as guias para saque do FGTS e, quando aplicável, para habilitação no{" "}
          <a href="/blog/seguro-desemprego-como-solicitar" className="text-blue-700 underline">seguro-desemprego</a>.
        </p>

        <LeiRef>
          <p>
            <strong>Art. 477, § 6º, CLT:</strong> "A entrega ao empregado de documentos que comprovem a
            comunicação da extinção contratual aos órgãos competentes bem como o pagamento dos valores
            constantes do instrumento de rescisão [...] deverão ser efetuados até dez dias contados a partir
            do término do contrato."
          </p>
        </LeiRef>

        <h3>Cumprindo aviso prévio: direitos durante o período</h3>
        <p>
          O trabalhador que está cumprindo aviso prévio continua com todos os direitos do contrato de trabalho em
          vigor. O período de aviso integra o tempo de serviço para todos os efeitos legais: acúmulo de FGTS,
          contagem de férias proporcionais e 13º salário. Ou seja, o mês do aviso prévio "conta" integralmente
          no cálculo da rescisão.
        </p>
        <p>
          Se o trabalhador foi demitido sem justa causa e está cumprindo o aviso, tem direito a escolher entre
          duas opções: redução de 2 horas diárias na jornada ou folga de 7 dias corridos ao final do período,
          sem qualquer desconto salarial (art. 488 da CLT). Essa redução visa permitir que o trabalhador
          busque uma nova colocação no mercado.
        </p>

        <h3>Pensando em deixar o emprego: planejamento estratégico</h3>
        <p>
          Para quem ainda está avaliando a possibilidade de sair do emprego, entender as diferenças entre as
          modalidades de desligamento faz toda a diferença. A forma como o contrato é encerrado tem impacto direto no
          valor que o trabalhador receberá. Uma demissão sem justa causa, por exemplo, garante acesso a todas
          as verbas rescisórias, enquanto o pedido de demissão exclui a multa do FGTS e o seguro-desemprego.
        </p>
        <p>
          O acordo mútuo (art. 484-A da CLT), introduzido pela Reforma Trabalhista, é uma alternativa intermediária
          que permite ao trabalhador sacar 80% do FGTS e receber metade da multa (20%), mas sem direito ao
          seguro-desemprego. Simular os valores de cada cenário ajuda na tomada de decisão.
        </p>

        <ExemploPratico>
          <p>
            Maria trabalha há 3 anos com salário de R$ 4.000. Se for demitida sem justa causa, receberia
            aproximadamente R$ 18.500 em verbas rescisórias. Se pedir demissão, esse valor cai para cerca
            de R$ 7.200. Em um acordo mútuo, ficaria em torno de R$ 12.800. A diferença de mais de R$ 11.000
            entre os cenários extremos mostra a importância de planejar cuidadosamente a saída.
          </p>
        </ExemploPratico>

        <Dica>
          <p>
            Se você está pensando em sair, evite tomar decisões precipitadas. Faça uma simulação dos valores
            para cada cenário, verifique se tem direito ao seguro-desemprego, confira o saldo do seu FGTS pelo
            aplicativo da Caixa e, se possível, converse com um advogado trabalhista antes de comunicar
            sua decisão à empresa.
          </p>
        </Dica>
      </>
    ),
  },

  tipoDesligamento: {
    titulo: "Tipos de Desligamento Trabalhista: Diferenças, Direitos e Impactos na Rescisão",
    conteudo: (
      <>
        <p>
          O tipo de desligamento é, sem dúvida, o fator que mais impacta o valor final da rescisão trabalhista.
          Cada modalidade prevista na CLT estabelece regras distintas sobre quais verbas o trabalhador tem direito
          a receber, se pode sacar o FGTS, se tem direito ao seguro-desemprego e como o aviso prévio é tratado.
          Conhecer essas diferenças permite avaliar se os valores pagos estão corretos.
        </p>

        <h3>Demissão sem justa causa</h3>
        <p>
          É a forma de desligamento mais favorável ao trabalhador em termos financeiros. Ocorre quando a empresa
          decide encerrar o contrato sem que o empregado tenha cometido falta grave. Nessa modalidade, o trabalhador
          tem direito a todas as verbas rescisórias: saldo de salário, aviso prévio (trabalhado ou indenizado),
          férias proporcionais e vencidas com 1/3 constitucional, 13º salário proporcional, multa de 40% sobre
          o saldo do FGTS, saque integral do FGTS e seguro-desemprego (se atender aos requisitos).
          Veja o detalhamento completo em{" "}
          <a href="/blog/demissao-sem-justa-causa-direitos" className="text-blue-700 underline">direitos na demissão sem justa causa</a>.
        </p>
        <p>
          O aviso prévio na demissão sem justa causa é proporcional ao tempo de serviço: 30 dias para o primeiro
          ano, acrescidos de 3 dias para cada ano adicional, até o máximo de 90 dias. Quando indenizado, esse
          período projeta a data de desligamento, aumentando o valor de férias, 13º e FGTS proporcionais.
        </p>

        <h3>Pedido de demissão</h3>
        <p>
          Quando o trabalhador decide sair por vontade própria, perde o direito à multa de 40% do FGTS, ao saque
          do fundo e ao seguro-desemprego. Mantém, porém, o direito ao saldo de salário, férias proporcionais e
          vencidas com 1/3, e 13º proporcional. O trabalhador deve cumprir aviso prévio de 30 dias ou, se
          dispensado pela empresa, fica livre da obrigação.
        </p>
        <p>
          Se o trabalhador não cumprir o aviso prévio e a empresa não dispensá-lo, o valor correspondente a 30
          dias de salário pode ser descontado das verbas rescisórias. Esse é um ponto que frequentemente gera
          dúvidas e deve ser verificado com atenção no TRCT.
        </p>

        <h3>Acordo mútuo (art. 484-A da CLT)</h3>
        <p>
          Introduzido pela Reforma Trabalhista de 2017, o acordo mútuo é uma forma consensual de encerrar o
          contrato. O trabalhador recebe metade do aviso prévio indenizado, multa de 20% (ao invés de 40%) sobre
          o FGTS, pode sacar até 80% do saldo do fundo, mas não tem direito ao seguro-desemprego. As demais
          verbas (saldo de salário, férias, 13º) são pagas integralmente.
        </p>

        <h3>Demissão por justa causa</h3>
        <p>
          A justa causa é a forma mais restritiva de desligamento. Ocorre quando o trabalhador comete falta grave
          prevista no art. 482 da CLT, como abandono de emprego, improbidade, incontinência de conduta, entre
          outras. Nesse caso, o trabalhador recebe apenas o saldo de salário e férias vencidas (se houver).
          Perde o direito a aviso prévio, 13º proporcional, multa do FGTS, saque do fundo e seguro-desemprego.
        </p>

        <ExemploPratico>
          <p>
            João trabalhou 5 anos com salário de R$ 3.000. Comparação dos valores aproximados por modalidade:
          </p>
          <ul>
            <li><strong>Demissão sem justa causa:</strong> ~R$ 22.000 (incluindo FGTS e multa)</li>
            <li><strong>Acordo mútuo:</strong> ~R$ 16.000</li>
            <li><strong>Pedido de demissão:</strong> ~R$ 8.500</li>
            <li><strong>Justa causa:</strong> ~R$ 1.500 (apenas saldo de salário)</li>
          </ul>
        </ExemploPratico>

        <h3>Término de contrato temporário</h3>
        <p>
          Contratos por prazo determinado encerram-se na data prevista. O trabalhador recebe saldo de salário,
          férias proporcionais com 1/3, 13º proporcional e pode sacar o FGTS sem multa. Não há aviso prévio
          nem seguro-desemprego, salvo previsão contratual específica.
        </p>

        <Dica>
          <p>
            Se você foi demitido por justa causa e discorda do motivo alegado, saiba que é possível reverter
            a justa causa judicialmente. O empregador precisa comprovar a falta grave, e muitos pedidos são
            revertidos para demissão sem justa causa pela Justiça do Trabalho. Procure orientação jurídica
            dentro do prazo de 2 anos.
          </p>
        </Dica>
      </>
    ),
  },

  periodoContrato: {
    titulo: "Tempo de Empresa: Como o Período Trabalhado Define o Valor da Rescisão",
    conteudo: (
      <>
        <p>
          O tempo de serviço na empresa é um dos pilares do cálculo rescisório. Praticamente todas as verbas
          da rescisão são influenciadas, direta ou indiretamente, pela duração do contrato de trabalho. Desde
          o aviso prévio proporcional até o saldo acumulado do FGTS, cada mês trabalhado agrega valor ao
          montante que o trabalhador tem direito a receber no encerramento do contrato.
        </p>

        <h3>Férias proporcionais e o período aquisitivo</h3>
        <p>
          O direito a férias surge após cada ciclo de 12 meses de trabalho, chamado de período aquisitivo.
          Se o trabalhador é desligado antes de completar esse ciclo, tem direito a{" "}
          <a href="/blog/ferias-proporcionais-vencidas-calculo" className="text-blue-700 underline">férias proporcionais</a>:
          1/12 da remuneração para cada mês trabalhado (ou fração superior a 14 dias), acrescido do terço
          constitucional. Esse direito é garantido em todas as modalidades de desligamento, exceto justa causa
          com menos de 12 meses.
        </p>
        <p>
          O período aquisitivo recomeça a cada vez que o trabalhador goza férias.
          Se as últimas férias foram em março de 2025 e o desligamento ocorreu em janeiro de 2026, há 10 meses
          de férias proporcionais a receber. Informar corretamente a data das últimas férias garante precisão
          no cálculo dessa verba.
        </p>

        <h3>13º salário proporcional</h3>
        <p>
          O 13º salário é calculado proporcionalmente aos meses trabalhados no ano civil da rescisão. A regra
          é simples: cada mês em que o empregado trabalhou pelo menos 15 dias conta como 1/12 do 13º. Um
          trabalhador desligado em setembro, por exemplo, tem direito a 9/12 do 13º salário.
        </p>
        <p>
          Atenção: se o trabalhador já recebeu a primeira parcela do 13º (normalmente paga até novembro), esse
          valor é descontado na rescisão. O cálculo deve considerar a remuneração total habitual, incluindo
          médias de horas extras, comissões e adicionais.
        </p>

        <h3>Aviso prévio proporcional ao tempo de serviço</h3>
        <p>
          Desde a promulgação da Lei 12.506/2011, o aviso prévio deixou de ser fixo em 30 dias e passou a ser
          proporcional ao tempo de trabalho na empresa. O cálculo é: 30 dias base + 3 dias para cada ano
          completo de serviço, até o teto de 90 dias. Assim, um trabalhador com 20 anos ou mais de empresa
          tem direito ao aviso prévio máximo. Saiba mais em{" "}
          <a href="/blog/aviso-previo-proporcional-como-funciona" className="text-blue-700 underline">como funciona o aviso prévio proporcional</a>.
        </p>

        <ExemploPratico>
          <p>
            Cálculo do aviso prévio proporcional conforme tempo de serviço:
          </p>
          <ul>
            <li>1 ano de empresa: 30 + 3 = <strong>33 dias</strong></li>
            <li>3 anos: 30 + 9 = <strong>39 dias</strong></li>
            <li>5 anos: 30 + 15 = <strong>45 dias</strong></li>
            <li>10 anos: 30 + 30 = <strong>60 dias</strong></li>
            <li>20+ anos: <strong>90 dias</strong> (teto legal)</li>
          </ul>
          <p>
            Quando o aviso é indenizado, todos esses dias projetam a data de desligamento,
            gerando reflexos adicionais em férias, 13º e FGTS.
          </p>
        </ExemploPratico>

        <h3>FGTS acumulado ao longo do contrato</h3>
        <p>
          Mensalmente, o empregador deposita 8% do salário bruto do trabalhador na conta vinculada do FGTS.
          Ao longo de anos, esse valor se acumula significativamente. Na demissão sem justa causa, o trabalhador
          saca o saldo integral mais a multa de 40% calculada sobre o total de depósitos realizados durante
          todo o contrato, não apenas sobre o saldo atual da conta.
        </p>
        <p>
          É comum que trabalhadores com mais tempo de empresa tenham saldos expressivos de FGTS, tornando a
          multa rescisória uma das parcelas mais relevantes da rescisão. Por isso, conferir o extrato analítico
          do FGTS é uma etapa importante na verificação dos valores.
        </p>

        <Dica>
          <p>
            Para conferir suas datas de admissão e desligamento, acesse o aplicativo CTPS Digital
            (Carteira de Trabalho Digital), disponível gratuitamente para Android e iOS. Lá você encontra
            o histórico completo dos seus contratos de trabalho com as datas oficiais registradas pelo empregador.
          </p>
        </Dica>
      </>
    ),
  },

  salarioFixo: {
    titulo: "Salário e Remuneração: A Base de Todo o Cálculo Rescisório",
    conteudo: (
      <>
        <p>
          O salário do trabalhador é a base de cálculo para praticamente todas as verbas da rescisão. Porém,
          um erro muito comum, tanto de empregadores quanto dos próprios trabalhadores, é considerar apenas
          o salário fixo registrado em carteira, ignorando outras parcelas que compõem a remuneração total
          e que, por lei, devem integrar a base de cálculo.
        </p>

        <h3>Diferença entre salário e remuneração</h3>
        <p>
          O salário é o valor fixo pago mensalmente ao trabalhador. Já a remuneração total inclui, além do
          salário fixo, todas as parcelas habituais de natureza salarial: comissões, bonificações recorrentes,
          gorjetas, horas extras habituais e adicionais (noturno, insalubridade, periculosidade). A CLT, em
          seus artigos 457 e 458, define quais parcelas têm natureza salarial e integram a base de cálculo.
        </p>
        <p>
          Quando a empresa calcula a rescisão apenas sobre o salário fixo, desconsiderando comissões e horas
          extras habituais, o trabalhador recebe menos do que deveria em todas as verbas proporcionais: férias,
          13º, aviso prévio e FGTS. Esse é um dos erros mais frequentes e que gera maior impacto financeiro.
        </p>

        <h3>Verbas diretamente proporcionais ao salário</h3>
        <p>
          Cada verba rescisória utiliza a remuneração como base de cálculo de forma específica:
        </p>
        <ul>
          <li><strong>Férias + 1/3 constitucional:</strong> calculadas sobre a remuneração total. Se a remuneração é R$ 4.000, cada mês proporcional de férias vale R$ 333,33 (4.000 ÷ 12), mais R$ 111,11 do terço.</li>
          <li><strong>13º salário:</strong> cada mês trabalhado no ano equivale a 1/12 da remuneração total.</li>
          <li><strong>Aviso prévio:</strong> calculado sobre a última remuneração ou média dos últimos 12 meses.</li>
          <li><strong>FGTS + multa:</strong> o depósito mensal de 8% incide sobre a remuneração total, e a multa de 40% é calculada sobre o total histórico dos depósitos.</li>
        </ul>

        <h3>Impacto nos descontos legais</h3>
        <p>
          A remuneração também define as faixas de desconto do INSS (contribuição previdenciária) e do Imposto
          de Renda Retido na Fonte (IRRF). Salários mais altos podem resultar em alíquotas maiores de desconto.
          No entanto, diversas verbas da rescisão são isentas de IR: a multa de 40% do
          FGTS, as férias indenizadas com 1/3 e o aviso prévio indenizado não sofrem tributação.
        </p>

        <ExemploPratico>
          <p>
            Carlos ganha R$ 3.000 fixos mais uma média mensal de R$ 800 em comissões. Sua remuneração total
            para fins de rescisão é R$ 3.800, e não R$ 3.000. A diferença no cálculo de férias proporcionais
            de 8 meses seria:
          </p>
          <ul>
            <li>Base R$ 3.000: (3.000 ÷ 12) × 8 × 1,33 = R$ 2.660</li>
            <li>Base R$ 3.800: (3.800 ÷ 12) × 8 × 1,33 = R$ 3.369</li>
            <li>Diferença apenas nas férias: <strong>R$ 709</strong></li>
          </ul>
          <p>Esse efeito se repete em todas as demais verbas, acumulando uma diferença total significativa.</p>
        </ExemploPratico>

        <h3>Parcelas variáveis: como calcular a média</h3>
        <p>
          Para comissões, horas extras habituais e outras parcelas variáveis, o cálculo correto considera a
          média dos últimos 12 meses de trabalho. Essa média é utilizada como parte da remuneração para fins
          de férias, 13º e aviso prévio. Se o trabalhador atuou por menos de 12 meses, calcula-se a média
          do período efetivamente trabalhado.
        </p>

        <Dica>
          <p>
            Reúna seus últimos 12 contracheques (holerites) e some todas as parcelas de natureza salarial:
            salário fixo, comissões, horas extras, adicionais e gratificações recorrentes. Divida pelo número
            de meses para obter a média. Essa é a remuneração que deve servir como base de cálculo da sua rescisão.
          </p>
        </Dica>
      </>
    ),
  },

  tipoAvisoPrevio: {
    titulo: "Aviso Prévio na Rescisão: Modalidades, Cálculo e Direitos do Trabalhador",
    conteudo: (
      <>
        <p>
          O aviso prévio é a comunicação antecipada de que o contrato de trabalho será encerrado. Previsto nos
          artigos 487 a 491 da CLT, ele pode assumir diferentes formas: trabalhado, indenizado ou não cumprido.
          Cada uma delas tem consequências diretas no valor final da rescisão. Veja o detalhamento em{" "}
          <a href="/blog/aviso-previo-proporcional-como-funciona" className="text-blue-700 underline">como funciona o aviso prévio proporcional</a>.
        </p>

        <h3>Aviso prévio indenizado: o mais vantajoso financeiramente</h3>
        <p>
          Quando o empregador dispensa o trabalhador imediatamente, sem exigir que ele trabalhe durante o período
          de aviso, paga o valor correspondente como indenização. Essa é geralmente a forma mais vantajosa para o
          trabalhador, porque o período de aviso indenizado projeta a data de desligamento para o futuro.
        </p>
        <p>
          Essa projeção tem efeito prático: os dias adicionais de aviso contam para acúmulo de FGTS (8% ao mês),
          férias proporcionais e 13º salário. Assim, um aviso prévio indenizado de 42 dias projeta 42 dias
          além do último dia trabalhado, gerando reflexos em todas as verbas proporcionais.
        </p>

        <h3>Aviso prévio trabalhado: direitos durante o período</h3>
        <p>
          Nessa modalidade, o trabalhador continua exercendo suas atividades normalmente durante o período de
          aviso e recebe o salário correspondente. Não há pagamento adicional na rescisão referente ao aviso.
          O trabalhador demitido sem justa causa tem direito a escolher entre redução de 2 horas diárias ou
          folga de 7 dias corridos, sem desconto (art. 488 da CLT).
        </p>
        <p>
          Se o empregador impedir a redução de jornada ou a folga durante o aviso trabalhado, o aviso pode ser
          considerado nulo pela Justiça do Trabalho, e o trabalhador teria direito ao pagamento do aviso como
          se fosse indenizado, além de indenização por danos morais em alguns casos.
        </p>

        <h3>Aviso prévio não cumprido: quando há desconto</h3>
        <p>
          Se o trabalhador pede demissão e não cumpre o aviso prévio, o empregador pode descontar o valor
          equivalente a 30 dias de salário nas verbas rescisórias (art. 487, § 2º, da CLT). Porém, o empregador
          pode dispensar o cumprimento; nesse caso, não há desconto. Verifique no TRCT se houve
          ou não desconto e se ele foi aplicado corretamente.
        </p>

        <LeiRef>
          <p>
            <strong>Lei 12.506/2011:</strong> "O aviso prévio [...] será concedido na proporção de 30 (trinta)
            dias aos empregados que contem até 1 (um) ano de serviço na mesma empresa. Parágrafo único. Ao
            aviso prévio previsto neste artigo serão acrescidos 3 (três) dias por ano de serviço prestado na
            mesma empresa, até o máximo de 60 (sessenta) dias, perfazendo um total de até 90 (noventa) dias."
          </p>
        </LeiRef>

        <h3>Proporcionalidade: um direito frequentemente ignorado</h3>
        <p>
          Desde 2011, o aviso prévio proporcional é lei, mas muitas empresas ainda calculam apenas os 30 dias
          básicos. Para cada ano completo de serviço, são acrescidos 3 dias, até o máximo de 90 dias. Essa
          proporcionalidade se aplica apenas quando a empresa demite o trabalhador: no pedido de demissão,
          o aviso é sempre de 30 dias.
        </p>

        <ExemploPratico>
          <p>
            Ana trabalhou 8 anos na empresa com salário de R$ 4.500. Seu aviso prévio proporcional é de
            30 + (8 × 3) = 54 dias. Se indenizado, ela recebe: (4.500 ÷ 30) × 54 = R$ 8.100 de aviso prévio.
            Se a empresa calculasse apenas 30 dias, pagaria R$ 4.500, uma diferença de R$ 3.600, sem contar
            os reflexos em FGTS, férias e 13º que a projeção de 54 dias gera.
          </p>
        </ExemploPratico>

        <Dica>
          <p>
            Ao analisar sua rescisão, confira no TRCT a quantidade de dias de aviso prévio informada. Compare
            com o cálculo proporcional (30 + 3 por ano de empresa). Se houver divergência, anote o item e
            questione o departamento pessoal ou procure orientação no sindicato.
          </p>
        </Dica>
      </>
    ),
  },

  numDependentes: {
    titulo: "Dependentes e o Imposto de Renda na Rescisão Trabalhista",
    conteudo: (
      <>
        <p>
          Embora o número de dependentes não altere diretamente as verbas rescisórias brutas, ele tem impacto
          significativo no valor líquido que o trabalhador efetivamente recebe. Isso ocorre porque cada
          dependente gera uma dedução na base de cálculo do Imposto de Renda Retido na Fonte (IRRF),
          reduzindo o imposto e aumentando o valor líquido final.
        </p>

        <h3>Quem pode ser declarado como dependente</h3>
        <p>
          A legislação tributária define quem pode ser considerado dependente para fins de dedução no IR.
          Os casos mais comuns incluem: cônjuge ou companheiro(a) em união estável, filhos e enteados até
          21 anos de idade (ou até 24 anos se estiverem cursando ensino superior ou escola técnica), pais
          e avós que dependam financeiramente do trabalhador, e menores sob guarda judicial.
        </p>
        <p>
          Cada dependente permite a dedução mensal de R$ 189,59 da base de cálculo do IRRF. Para um trabalhador
          com dois filhos e cônjuge dependente, por exemplo, a dedução mensal é de R$ 568,77, o que pode
          representar uma diferença significativa no imposto retido sobre as verbas rescisórias tributáveis.
        </p>

        <h3>Quais verbas rescisórias são tributáveis?</h3>
        <p>
          Nem todas as parcelas da rescisão sofrem incidência de Imposto de Renda. Conhecer
          essa distinção ajuda a entender o impacto real dos dependentes no cálculo:
        </p>
        <ul>
          <li><strong>Tributáveis:</strong> saldo de salário, 13º salário proporcional, aviso prévio trabalhado.</li>
          <li><strong>Isentas de IR:</strong> multa de 40% do FGTS, férias indenizadas (proporcionais e vencidas) com 1/3, aviso prévio indenizado, FGTS sacado.</li>
        </ul>
        <p>
          Essa isenção sobre férias indenizadas e aviso prévio indenizado é particularmente relevante, pois
          essas costumam ser parcelas expressivas da rescisão. A Receita Federal confirma essa isenção na
          Instrução Normativa RFB 1.500/2014.
        </p>

        <ExemploPratico>
          <p>
            Pedro recebe R$ 5.000 e tem 2 dependentes. Na rescisão, as verbas tributáveis somam R$ 9.500
            (saldo de salário + 13º proporcional). Sem dependentes, o IRRF seria de aproximadamente R$ 650.
            Com 2 dependentes, a dedução de R$ 379,18 reduz a base tributável, resultando em IRRF de cerca
            de R$ 555, uma economia de quase R$ 100 apenas nesse item.
          </p>
        </ExemploPratico>

        <h3>Descontos do INSS na rescisão</h3>
        <p>
          O INSS também incide sobre algumas verbas rescisórias, como saldo de salário, 13º proporcional e
          aviso prévio trabalhado. A alíquota segue a tabela progressiva vigente (7,5% a 14%). As férias
          indenizadas e o aviso prévio indenizado são isentos de INSS. Os dependentes não afetam o cálculo
          do INSS, apenas do IR.
        </p>

        <Dica>
          <p>
            Verifique se seus dependentes estão corretamente cadastrados no departamento pessoal da empresa.
            Dependentes não informados resultam em IR maior retido na rescisão. Se você tiver dependentes que
            não foram cadastrados, pode recuperar o valor pago a mais na declaração anual do Imposto de Renda.
          </p>
        </Dica>
      </>
    ),
  },

  saldoFGTS: {
    titulo: "FGTS na Rescisão: Saque, Multa de 40% e Como Verificar Seus Direitos",
    conteudo: (
      <>
        <p>
          O Fundo de Garantia do Tempo de Serviço (FGTS) é uma das parcelas mais significativas da rescisão
          trabalhista, especialmente para trabalhadores com tempo de empresa mais longo. Criado pela Lei
          8.036/1990, o FGTS funciona como uma poupança compulsória: mensalmente, o empregador deposita 8%
          do salário bruto na conta vinculada do trabalhador na Caixa Econômica Federal.
        </p>

        <h3>Quando o trabalhador pode sacar o FGTS</h3>
        <p>
          O saque do FGTS na rescisão depende do tipo de desligamento. Na demissão sem justa causa, o
          trabalhador saca 100% do saldo acumulado. No acordo mútuo (art. 484-A da CLT), pode sacar até 80%.
          No pedido de demissão e na justa causa, o saldo fica retido na conta e só pode ser sacado em
          situações específicas previstas em lei (aposentadoria, compra de imóvel, doença grave, etc.).
        </p>

        <h3>Multa rescisória de 40%: como funciona o cálculo</h3>
        <p>
          A{" "}
          <a href="/blog/calculo-fgts-multa-rescisoria" className="text-blue-700 underline">multa rescisória de 40% do FGTS</a>{" "}
          é um dos pontos que mais geram confusão. Ela é calculada sobre o total de depósitos
          realizados pelo empregador ao longo de todo o contrato de trabalho, e não sobre o saldo atual da conta.
          Isso significa que mesmo que o trabalhador tenha sacado parte do FGTS anteriormente (por exemplo, para
          compra de imóvel), a multa incide sobre o valor total que foi depositado.
        </p>
        <p>
          Na prática, o empregador consulta o extrato analítico do FGTS para somar todos os depósitos realizados
          durante o contrato e aplica a multa de 40% (demissão sem justa causa) ou 20% (acordo mútuo) sobre esse total.
          Por isso, conferir o extrato do FGTS é essencial para verificar se a multa foi calculada corretamente.
        </p>

        <LeiRef>
          <p>
            <strong>Art. 18, § 1º, Lei 8.036/1990:</strong> "Na hipótese de despedida pelo empregador sem justa
            causa, depositará este, na conta vinculada do trabalhador no FGTS, importância igual a quarenta por
            cento do montante de todos os depósitos realizados na conta vinculada durante a vigência do contrato
            de trabalho, atualizados monetariamente e acrescidos dos respectivos juros."
          </p>
        </LeiRef>

        <ExemploPratico>
          <p>
            Fernanda trabalhou 6 anos com salário médio de R$ 3.000. Total aproximado de depósitos de FGTS:
            R$ 3.000 × 8% × 72 meses = R$ 17.280. Multa de 40%: R$ 6.912. Saldo atual na conta (com
            rendimentos): ~R$ 18.500. Valor total a receber do FGTS na rescisão: R$ 18.500 (saque) +
            R$ 6.912 (multa) = R$ 25.412.
          </p>
        </ExemploPratico>

        <h3>Como consultar o saldo do FGTS</h3>
        <p>
          O saldo pode ser consultado de forma gratuita pelo aplicativo FGTS (disponível para Android e iOS),
          pelo site da Caixa Econômica Federal, pelo internet banking da Caixa, ou presencialmente em qualquer
          agência. O extrato mostra todos os depósitos realizados, rendimentos (TR + 3% ao ano) e saques
          anteriores. Recomenda-se verificar mensalmente se os depósitos estão sendo realizados corretamente.
        </p>

        <Dica>
          <p>
            Se ao consultar o extrato do FGTS você identificar meses sem depósito, isso pode indicar
            irregularidade por parte do empregador. Anote os meses faltantes e inclua essa informação ao
            conferir sua rescisão. Depósitos não realizados podem ser cobrados retroativamente, com multa e
            correção monetária, em ação trabalhista.
          </p>
        </Dica>
      </>
    ),
  },

  periodosFeriasVencidas: {
    titulo: "Férias Vencidas na Rescisão: Pagamento em Dobro e Direitos do Trabalhador",
    conteudo: (
      <>
        <p>
          As férias são um direito fundamental do trabalhador, garantido pelo artigo 7º, inciso XVII, da
          Constituição Federal, e regulamentado pelos artigos 129 a 153 da CLT. Na rescisão trabalhista,
          as férias, tanto vencidas quanto proporcionais, representam uma das parcelas mais relevantes do
          cálculo. Quando existem férias vencidas, o valor pode ser significativamente maior do que muitos
          trabalhadores imaginam, devido à obrigação legal de pagamento em dobro.
        </p>

        <h3>O que são férias vencidas e quando elas ocorrem</h3>
        <p>
          O trabalhador adquire direito a 30 dias de férias após completar 12 meses de trabalho (período
          aquisitivo). A partir dessa data, o empregador tem mais 12 meses (período concessivo) para conceder
          as férias. Se o empregador não conceder as férias dentro desse segundo período de 12 meses, elas
          são consideradas vencidas.
        </p>
        <p>
          Por exemplo: se um trabalhador foi admitido em janeiro de 2023, ele adquiriu direito às primeiras
          férias em janeiro de 2024. O empregador deveria tê-las concedido até janeiro de 2025. Se não concedeu,
          as férias estão vencidas desde janeiro de 2025 e devem ser pagas em dobro na rescisão.
        </p>

        <h3>Pagamento em dobro: como funciona</h3>
        <p>
          O art. 137 da CLT determina que, quando o empregador não concede as férias dentro do período
          concessivo, a remuneração das férias deve ser paga em dobro. Isso significa que o trabalhador
          recebe o salário integral mais o terço constitucional, multiplicados por dois. Cada período de
          férias vencidas é pago separadamente. Veja como calcular em{" "}
          <a href="/blog/ferias-proporcionais-vencidas-calculo" className="text-blue-700 underline">férias proporcionais e vencidas: cálculo completo</a>.
        </p>

        <ExemploPratico>
          <p>
            Roberto ganha R$ 3.500 e tem 1 período de férias vencidas. O cálculo do pagamento em dobro:
          </p>
          <ul>
            <li>Férias: R$ 3.500</li>
            <li>1/3 constitucional: R$ 1.166,67</li>
            <li>Subtotal: R$ 4.666,67</li>
            <li>Valor em dobro: <strong>R$ 9.333,34</strong></li>
          </ul>
          <p>
            Se houvesse 2 períodos vencidos, o valor seria R$ 18.666,68. Esse é um dos erros mais comuns:
            empresas pagando o valor simples ao invés do dobro.
          </p>
        </ExemploPratico>

        <h3>Férias proporcionais: o período incompleto</h3>
        <p>
          Além das férias vencidas, o trabalhador tem direito às férias proporcionais, referentes ao período
          aquisitivo incompleto na data da rescisão. Cada mês trabalhado (ou fração superior a 14 dias)
          equivale a 1/12 das férias, sempre acrescidas de 1/3 constitucional. As férias proporcionais são
          devidas em todas as modalidades de desligamento.
        </p>

        <h3>Férias e a isenção de Imposto de Renda</h3>
        <p>
          Um ponto importante: as férias indenizadas na rescisão (tanto vencidas quanto proporcionais, com o
          respectivo 1/3) são isentas de Imposto de Renda e de contribuição ao INSS. Essa isenção é
          reconhecida pela Receita Federal e pelo STJ. Se na sua rescisão houve desconto de IR sobre férias
          indenizadas, pode haver irregularidade.
        </p>

        <Dica>
          <p>
            Ao conferir sua rescisão, verifique separadamente: (1) se todas as férias vencidas foram pagas em
            dobro; (2) se as férias proporcionais foram calculadas sobre a remuneração total; (3) se o 1/3
            constitucional foi aplicado sobre cada uma delas; e (4) se não houve desconto indevido de IR
            sobre essas verbas. Esses são os quatro erros mais comuns relacionados a férias na rescisão.
          </p>
        </Dica>
      </>
    ),
  },

  mesesDesdeUltimaFerias: {
    titulo: "Data das Últimas Férias: Por Que Essa Informação Define o Cálculo",
    conteudo: (
      <>
        <p>
          A data em que o trabalhador gozou férias pela última vez é uma informação crucial para determinar
          quantos meses de férias proporcionais devem ser pagos na rescisão. Esse dado permite calcular com
          precisão o período aquisitivo incompleto e verificar se existem períodos vencidos que devem ser
          pagos em dobro.
        </p>

        <h3>Como as últimas férias definem o cálculo proporcional</h3>
        <p>
          O período aquisitivo de férias recomeça a cada vez que o trabalhador goza férias. Se as últimas
          férias foram em abril de 2025 e o desligamento ocorreu em janeiro de 2026, o trabalhador tem 9 meses
          de férias proporcionais a receber (de maio de 2025 a janeiro de 2026). Cada mês equivale a 1/12
          da remuneração, acrescido de 1/3 constitucional.
        </p>
        <p>
          Se o trabalhador não se lembrar da data exata, pode consultar seus holerites (contracheques) do
          período: as férias geralmente aparecem como rubrica específica. Também é possível verificar pelo aplicativo
          CTPS Digital, que registra os períodos de gozo de férias informados pelo empregador.
        </p>

        <h3>A regra dos 14 dias para contagem proporcional</h3>
        <p>
          Para fins de cálculo de férias proporcionais, a CLT determina que cada fração de mês superior a
          14 dias é arredondada para cima, contando como um mês completo. Assim, se o trabalhador completou
          7 meses e 18 dias desde as últimas férias, o cálculo considera 8 meses proporcionais. Se completou
          7 meses e 12 dias, considera apenas 7 meses.
        </p>

        <ExemploPratico>
          <p>
            Lúcia ganha R$ 4.200 e suas últimas férias foram em junho de 2025. Ela foi desligada em
            fevereiro de 2026. O período proporcional é de 8 meses (julho/2025 a fevereiro/2026):
          </p>
          <ul>
            <li>Férias proporcionais: (R$ 4.200 ÷ 12) × 8 = R$ 2.800</li>
            <li>1/3 constitucional: R$ 933,33</li>
            <li>Total de férias proporcionais: <strong>R$ 3.733,33</strong></li>
          </ul>
        </ExemploPratico>

        <h3>Quando o trabalhador nunca tirou férias</h3>
        <p>
          Se o trabalhador nunca gozou férias durante todo o contrato de trabalho, a situação é mais complexa.
          Nesse caso, podem existir simultaneamente períodos de férias vencidas (que devem ser pagos em dobro)
          e férias proporcionais do período aquisitivo em curso. Cada período deve ser calculado
          separadamente para garantir que o pagamento total esteja correto.
        </p>

        <h3>Férias fracionadas e a Reforma Trabalhista</h3>
        <p>
          Desde a Reforma Trabalhista de 2017, as férias podem ser fracionadas em até 3 períodos, desde que
          um deles tenha no mínimo 14 dias corridos e os demais pelo menos 5 dias corridos cada. Quando as
          férias foram fracionadas, considera-se a data de início do último período de férias para o cálculo
          do novo período aquisitivo.
        </p>

        <Dica>
          <p>
            Guarde sempre os comprovantes de férias (recibo de pagamento das férias e confirmação das datas).
            Em caso de divergência com a empresa, esses documentos são a prova mais direta do período de gozo.
            Se a empresa não fornecer esses documentos, você pode solicitá-los formalmente por e-mail ou
            por meio do sindicato da categoria.
          </p>
        </Dica>
      </>
    ),
  },

  faziaHorasExtras: {
    titulo: "Horas Extras na Rescisão: Direitos, Cálculo e Como Verificar Se Foram Pagas Corretamente",
    conteudo: (
      <>
        <p>
          As{" "}
          <a href="/blog/horas-extras-direitos-trabalhistas" className="text-blue-700 underline">horas extras</a>{" "}
          são um dos temas mais relevantes e controversos do direito trabalhista brasileiro.
          Quando o trabalhador habitualmente realiza trabalho além da jornada contratual, esses valores não
          apenas devem ser pagos mensalmente com adicional, mas também integram a base de cálculo de todas
          as verbas rescisórias. A omissão dessa integração é um dos erros mais frequentes nas rescisões.
        </p>

        <h3>Jornada legal e o que configura hora extra</h3>
        <p>
          A CLT estabelece, em seu art. 58, que a jornada normal de trabalho é de 8 horas diárias e 44 horas
          semanais. Qualquer tempo trabalhado além desse limite é considerado hora extra e deve ser remunerado
          com adicional mínimo de 50% sobre o valor da hora normal (art. 59, § 1º). Em domingos e feriados,
          o adicional é de 100%.
        </p>
        <p>
          Algumas categorias profissionais possuem jornadas diferenciadas (bancários com 6 horas, por exemplo),
          e convenções coletivas podem prever percentuais de adicional superiores ao mínimo legal. Consulte
          a convenção coletiva da sua categoria para verificar o percentual aplicável.
        </p>

        <h3>Como as horas extras afetam a rescisão</h3>
        <p>
          Quando as horas extras são habituais (realizadas com frequência, não esporadicamente), sua média
          mensal integra a remuneração para cálculo de férias + 1/3, 13º salário, aviso prévio, FGTS e
          descanso semanal remunerado (DSR). Isso está consolidado na Súmula 264 do TST e no art. 142, § 5º,
          da CLT.
        </p>
        <p>
          Se a empresa, ao calcular a rescisão, utiliza apenas o salário fixo como base e ignora a média de
          horas extras habituais, o trabalhador recebe menos em todas as verbas proporcionais. A diferença
          pode ser significativa, especialmente para quem fazia muitas horas extras regularmente.
        </p>

        <ExemploPratico>
          <p>
            Marcos ganha R$ 3.200 e fazia em média 25 horas extras por mês (adicional de 50%):
          </p>
          <ul>
            <li>Valor da hora normal: R$ 3.200 ÷ 220 = R$ 14,55</li>
            <li>Valor da hora extra: R$ 14,55 × 1,5 = R$ 21,82</li>
            <li>Média mensal de HE: R$ 21,82 × 25 = R$ 545,45</li>
            <li>Remuneração para fins de rescisão: R$ 3.200 + R$ 545,45 = <strong>R$ 3.745,45</strong></li>
          </ul>
          <p>
            Essa diferença de R$ 545,45 na base de cálculo se reflete em todas as verbas: férias, 13º,
            aviso prévio e FGTS, gerando um impacto total que pode ultrapassar R$ 3.000 na rescisão.
          </p>
        </ExemploPratico>

        <h3>Horas extras não registradas: como proceder</h3>
        <p>
          Um dos problemas mais comuns é o trabalhador realizar horas extras que não são registradas no ponto
          ou pagas na folha. Nesses casos, a Justiça do Trabalho aceita diversas formas de prova: e-mails
          enviados fora do horário, mensagens de WhatsApp com demandas de trabalho, registros de acesso
          (catracas, sistemas), testemunhos de colegas e qualquer documento que comprove a jornada real.
        </p>

        <h3>Banco de horas na rescisão</h3>
        <p>
          Se a empresa utilizava banco de horas e, na data da rescisão, o trabalhador tinha saldo positivo
          (horas trabalhadas sem compensar), essas horas devem ser pagas em dinheiro com o adicional de 50%.
          A empresa não pode simplesmente zerar o banco de horas na demissão sem efetuar o pagamento. Confira
          se o saldo do banco foi incluído nas verbas rescisórias.
        </p>

        <Dica>
          <p>
            Se você fazia horas extras com frequência, calcule a média mensal dos últimos 12 meses e
            verifique se esse valor foi considerado na base de cálculo da rescisão. Para isso, some o total
            de horas extras pagas nos últimos 12 contracheques e divida por 12. Essa média deveria integrar
            a base de cálculo de férias, 13º e aviso prévio.
          </p>
        </Dica>
      </>
    ),
  },

  bancoHoras: {
    titulo: "Banco de Horas: Regras Legais, Compensação e Pagamento na Rescisão",
    conteudo: (
      <>
        <p>
          O banco de horas é um sistema de compensação de jornada que permite ao empregador substituir o
          pagamento de horas extras por folgas compensatórias em outro momento. Previsto no art. 59, § 2º,
          da CLT (com alterações da Reforma Trabalhista), ele deve ser formalizado corretamente para ter
          validade legal; na rescisão, o saldo remanescente tem tratamento específico.
        </p>

        <h3>Modalidades de banco de horas</h3>
        <p>
          A legislação prevê três formas de implementação, com prazos diferentes para compensação:
        </p>
        <ul>
          <li><strong>Acordo individual tácito:</strong> compensação no mesmo mês (art. 59, § 6º, CLT).</li>
          <li><strong>Acordo individual escrito:</strong> compensação em até 6 meses (art. 59, § 5º, CLT).</li>
          <li><strong>Convenção ou acordo coletivo:</strong> compensação em até 12 meses (art. 59, § 2º, CLT).</li>
        </ul>
        <p>
          Se o banco de horas não foi formalizado adequadamente (por exemplo, implementado apenas verbalmente
          sem acordo escrito), a Justiça do Trabalho pode considerá-lo inválido, e todas as horas extras do
          período devem ser pagas com o adicional legal.
        </p>

        <h3>O que acontece com o saldo na rescisão</h3>
        <p>
          Quando o contrato é rescindido e o trabalhador possui saldo positivo no banco de horas (ou seja,
          trabalhou horas extras que não foram compensadas com folgas), essas horas devem ser pagas em dinheiro
          com o adicional de hora extra. A empresa não pode simplesmente cancelar ou zerar o saldo sem
          pagamento.
        </p>
        <p>
          Por outro lado, se o saldo é negativo (o trabalhador folgou mais do que trabalhou extra),
          existe controvérsia jurídica sobre se a empresa pode descontar esse valor na rescisão. A
          jurisprudência majoritária tende a não permitir o desconto quando a rescisão é por iniciativa
          do empregador (demissão sem justa causa).
        </p>

        <LeiRef>
          <p>
            <strong>Art. 59, § 3º, CLT:</strong> "Na hipótese de rescisão do contrato de trabalho sem que
            tenha havido a compensação integral da jornada extraordinária [...], o trabalhador terá direito
            ao pagamento das horas extras não compensadas, calculadas sobre o valor da remuneração na data
            da rescisão."
          </p>
        </LeiRef>

        <Dica>
          <p>
            Solicite à empresa o extrato atualizado do banco de horas antes ou logo após o desligamento.
            Compare o saldo com os registros do ponto e verifique se as horas positivas foram incluídas
            nas verbas rescisórias. Se houver divergência, registre por escrito e procure orientação.
          </p>
        </Dica>
      </>
    ),
  },

  controlePonto: {
    titulo: "Registro de Ponto: Importância Legal e Impacto nos Direitos Trabalhistas",
    conteudo: (
      <>
        <p>
          O registro de ponto é o documento que comprova a jornada efetivamente trabalhada pelo empregado.
          Conforme o art. 74, § 2º, da CLT, empresas com mais de 20 empregados são obrigadas a manter
          sistema de registro de horário de trabalho. Esse registro pode ser manual, mecânico ou eletrônico,
          e serve como prova fundamental em questões envolvendo horas extras, intervalos e jornada.
        </p>

        <h3>Tipos de registro e sua validade</h3>
        <p>
          A Portaria 671 do Ministério do Trabalho regulamenta os sistemas de registro eletrônico de ponto
          (REP). Existem três categorias: REP-C (registrador convencional), REP-A (alternativo, via
          aplicativo) e REP-P (programa, via software). Todos devem garantir inviolabilidade dos registros
          e emissão de comprovante ao trabalhador.
        </p>
        <p>
          Registros manuais (folha de ponto) continuam válidos, mas são mais suscetíveis a questionamentos
          judiciais, especialmente quando apresentam horários uniformes demais ou rasuras. O importante é
          que o registro reflita a jornada real do trabalhador.
        </p>

        <h3>Ponto "britânico" e sua invalidade</h3>
        <p>
          Registros de ponto que mostram horários sempre exatos e invariáveis (por exemplo, entrada às 08:00
          e saída às 17:00 todos os dias, sem qualquer variação) são conhecidos como "ponto britânico". A
          jurisprudência trabalhista, consolidada na Súmula 338 do TST, considera esses registros inválidos
          como prova, pois não refletem a realidade da jornada.
        </p>

        <h3>Ausência de controle de ponto: consequências jurídicas</h3>
        <p>
          Se a empresa era obrigada a manter registro de ponto e não o fazia, em uma ação trabalhista a
          consequência é significativa: a jornada de trabalho alegada pelo empregado é presumida como
          verdadeira, cabendo à empresa o ônus de provar o contrário (Súmula 338, I, do TST). Essa inversão
          do ônus da prova é uma proteção importante ao trabalhador.
        </p>

        <ExemploPratico>
          <p>
            Patrícia trabalhava das 8h às 19h todos os dias, mas a empresa não tinha registro de ponto.
            Na rescisão, as horas extras (2 horas diárias) não foram consideradas. Em ação trabalhista,
            como a empresa não tinha registros para contestar, a jornada declarada por Patrícia foi aceita,
            resultando em condenação ao pagamento de mais de R$ 15.000 em horas extras retroativas com
            reflexos nas verbas rescisórias.
          </p>
        </ExemploPratico>

        <Dica>
          <p>
            Se você fazia horas extras sem registro adequado no ponto, reúna todas as provas possíveis
            antes e logo após o desligamento: e-mails enviados fora do horário, mensagens de trabalho em
            aplicativos, registros de acesso por crachá ou biometria, e o contato de colegas que possam
            testemunhar sua jornada real. Essas provas são essenciais em uma eventual ação trabalhista.
          </p>
        </Dica>
      </>
    ),
  },

  funcoesDiferentes: {
    titulo: "Desvio e Acúmulo de Função: Quando o Trabalhador Exerce Cargo Diferente do Registrado",
    conteudo: (
      <>
        <p>
          O desvio de função é uma situação em que o trabalhador exerce atividades que não correspondem ao
          cargo para o qual foi contratado, sem receber a remuneração compatível com a função efetivamente
          exercida. Já o acúmulo de função ocorre quando o empregado realiza, simultaneamente, as tarefas
          do seu cargo original e de outro cargo, sem compensação adicional. Ambas as situações são comuns
          no mercado de trabalho e podem gerar direito a diferenças salariais significativas.
        </p>

        <h3>Como identificar o desvio de função</h3>
        <p>
          O desvio de função pode ser identificado comparando as atividades efetivamente exercidas no dia a
          dia com a descrição do cargo registrado na carteira de trabalho e no contrato. Se o trabalhador
          foi contratado como "assistente administrativo" mas exerce atividades de "analista financeiro"
          ou "coordenador", há indicação de desvio.
        </p>
        <p>
          Essa análise considera não apenas o título do cargo, mas a complexidade, responsabilidade e
          autonomia das atividades exercidas. Se as atividades reais exigem qualificação superior ou
          envolvem maior responsabilidade do que o cargo registrado, pode haver direito a equiparação
          salarial ou pagamento de diferenças.
        </p>

        <h3>Impacto financeiro na rescisão</h3>
        <p>
          Se o desvio ou acúmulo de função for reconhecido judicialmente, o trabalhador pode receber as
          diferenças salariais retroativas (referentes aos últimos 5 anos do contrato), com reflexos
          integrais em todas as verbas: férias + 1/3, 13º salário, FGTS + multa de 40%, aviso prévio
          e DSR. O impacto financeiro total pode ser expressivo, especialmente quando o desvio se estendeu
          por vários anos.
        </p>

        <ExemploPratico>
          <p>
            Thiago foi contratado como "auxiliar de produção" (salário R$ 2.000) mas exercia funções de
            "supervisor de produção" (salário da categoria: R$ 3.800). A diferença mensal de R$ 1.800,
            ao longo de 3 anos, geraria: R$ 64.800 em diferenças salariais + reflexos em férias (R$ 8.640),
            13º (R$ 5.400), FGTS (R$ 5.184) e multa de 40% (R$ 2.074) = total estimado de <strong>mais
            de R$ 86.000</strong>.
          </p>
        </ExemploPratico>

        <h3>Como comprovar o desvio de função</h3>
        <p>
          As provas mais comuns aceitas pela Justiça do Trabalho incluem: e-mails com atribuições de tarefas
          de cargo superior, organogramas que mostrem o trabalhador em posição diferente do registro,
          testemunhos de colegas de trabalho, sistemas internos com perfis de acesso de nível superior ao
          cargo, e qualquer documentação que demonstre as atividades efetivamente realizadas.
        </p>

        <Dica>
          <p>
            Se você acredita estar exercendo funções diferentes ou superiores ao seu cargo registrado,
            documente suas atividades diárias: guarde e-mails, prints de telas de sistema, comunicados
            internos e qualquer evidência das suas atribuições reais. Essa documentação pode ser valiosa
            tanto para negociar um reenquadramento com a empresa quanto para uma eventual ação judicial.
          </p>
        </Dica>
      </>
    ),
  },

  valorPorFora: {
    titulo: "Pagamento \"Por Fora\" da Carteira: Riscos, Consequências e Direitos do Trabalhador",
    conteudo: (
      <>
        <p>
          O pagamento "por fora" é a prática ilegal em que o empregador paga parte da remuneração do
          trabalhador de forma informal, sem registro em carteira de trabalho ou em folha de pagamento.
          Essa prática é mais comum do que se imagina e causa prejuízos sérios ao trabalhador em diversas
          frentes: reduz o FGTS, diminui a aposentadoria, prejudica o cálculo da rescisão e pode até
          afetar o valor do seguro-desemprego.
        </p>

        <h3>Como o pagamento "por fora" prejudica o trabalhador</h3>
        <p>
          Quando parte do salário é paga informalmente, todas as verbas trabalhistas e previdenciárias são
          calculadas apenas sobre o valor registrado em carteira. O trabalhador sofre prejuízo em:
        </p>
        <ul>
          <li><strong>FGTS:</strong> os 8% mensais incidem sobre o salário registrado, não sobre o real.</li>
          <li><strong>INSS:</strong> a contribuição previdenciária é menor, prejudicando a aposentadoria.</li>
          <li><strong>Férias e 13º:</strong> calculados sobre a base registrada, resultando em valores menores.</li>
          <li><strong>Aviso prévio:</strong> utiliza o salário da carteira como base.</li>
          <li><strong>Multa do FGTS:</strong> é menor porque os depósitos foram menores.</li>
          <li><strong>Seguro-desemprego:</strong> calculado sobre as últimas remunerações registradas.</li>
        </ul>

        <h3>Impacto direto na rescisão</h3>
        <p>
          Na rescisão, se as verbas são calculadas apenas sobre o salário registrado, a diferença pode ser
          substancial. Um trabalhador que ganha R$ 2.000 na carteira mas recebe mais R$ 1.500 "por fora"
          (remuneração real de R$ 3.500) tem prejuízo em todas as verbas. A diferença acumulada ao longo
          de anos de contrato pode representar dezenas de milhares de reais.
        </p>

        <ExemploPratico>
          <p>
            Salário registrado: R$ 2.500. Valor "por fora": R$ 1.200/mês. Remuneração real: R$ 3.700.
          </p>
          <p>Diferença na rescisão de um contrato de 4 anos (demissão sem justa causa):</p>
          <ul>
            <li>FGTS não depositado: R$ 1.200 × 8% × 48 meses = R$ 4.608</li>
            <li>Multa de 40% sobre o não depositado: R$ 1.843</li>
            <li>Diferença no aviso prévio (42 dias): ~R$ 1.680</li>
            <li>Diferença em férias proporcionais: ~R$ 800</li>
            <li>Diferença no 13º proporcional: ~R$ 500</li>
            <li>Total estimado de prejuízo: <strong>~R$ 9.431</strong></li>
          </ul>
        </ExemploPratico>

        <h3>Como comprovar e reivindicar</h3>
        <p>
          A Justiça do Trabalho aceita diversas formas de prova para demonstrar pagamentos "por fora":
          comprovantes de PIX, transferências bancárias, depósitos em conta, recibos assinados (mesmo
          informais), prints de conversas no WhatsApp, e-mails, e testemunhos de colegas que também
          recebiam dessa forma.
        </p>
        <p>
          O prazo para ingressar com ação é de 2 anos após o desligamento, podendo reclamar os últimos
          5 anos do contrato. A ação pode incluir todas as diferenças de FGTS, férias, 13º, aviso prévio,
          INSS e demais verbas que deveriam ter sido calculadas sobre a remuneração real.
        </p>

        <Dica>
          <p>
            Se você recebe ou recebia valores "por fora", guarde todos os comprovantes: PIX, transferências,
            depósitos e mensagens. Esses documentos são provas fundamentais. Evite deletar conversas
            relacionadas a pagamentos informais, mesmo após o desligamento. Quanto mais provas reunir,
            mais forte será sua posição em uma eventual reclamação.
          </p>
        </Dica>
      </>
    ),
  },

  valorPorForaMensal: {
    titulo: "Valor Mensal Recebido \"Por Fora\": Como Calcular o Prejuízo na Rescisão",
    conteudo: (
      <>
        <p>
          Informar o valor médio mensal recebido "por fora" da carteira permite quantificar com mais precisão
          o impacto financeiro dessa prática na rescisão trabalhista. O valor informado é somado ao salário
          registrado para compor a remuneração real, que deveria ser a base de cálculo de todas as verbas.
        </p>

        <h3>A remuneração real como base de cálculo</h3>
        <p>
          Do ponto de vista jurídico, toda parcela paga com habitualidade ao trabalhador como contraprestação
          pelo serviço tem natureza salarial, independentemente de estar registrada em carteira ou não.
          Portanto, o valor "por fora" deveria integrar a base de cálculo de FGTS (8%), INSS, férias, 13º,
          aviso prévio e multa rescisória.
        </p>
        <p>
          Quando a rescisão é calculada apenas sobre o salário registrado, existe uma diferença entre o valor
          pago e o valor devido. Essa diferença pode ser reivindicada administrativa ou judicialmente, com
          correção monetária e juros legais.
        </p>

        <h3>Cálculo detalhado das diferenças</h3>
        <p>
          Para cada verba rescisória, a diferença é calculada separadamente:
        </p>
        <ul>
          <li><strong>FGTS mensal:</strong> valor "por fora" × 8% × número de meses do contrato.</li>
          <li><strong>Multa de 40%:</strong> 40% sobre o FGTS que deveria ter sido depositado sobre o valor "por fora".</li>
          <li><strong>Férias + 1/3:</strong> a diferença na base de cálculo × meses proporcionais ÷ 12 × 1,33.</li>
          <li><strong>13º proporcional:</strong> diferença × meses no ano ÷ 12.</li>
          <li><strong>Aviso prévio:</strong> diferença × dias de aviso ÷ 30.</li>
        </ul>

        <ExemploPratico>
          <p>
            Valor "por fora": R$ 800/mês. Contrato de 5 anos. Cálculo do prejuízo no FGTS:
          </p>
          <ul>
            <li>FGTS não depositado: R$ 800 × 8% × 60 meses = R$ 3.840</li>
            <li>Multa de 40%: R$ 3.840 × 40% = R$ 1.536</li>
            <li>Total do FGTS prejudicado: <strong>R$ 5.376</strong></li>
          </ul>
          <p>
            Somando os reflexos em férias, 13º e aviso prévio, o prejuízo total pode
            ultrapassar R$ 8.000 neste exemplo.
          </p>
        </ExemploPratico>

        <Dica>
          <p>
            Se o valor "por fora" variava mês a mês, faça a média dos últimos 12 meses (ou do período do
            contrato, se mais curto). Inclua qualquer pagamento recorrente: bônus informais, ajuda de custo
            não comprovada, gratificações em dinheiro e valores transferidos via PIX sem rubrica em folha.
          </p>
        </Dica>
      </>
    ),
  },

  adicionaisTrabalho: {
    titulo: "Adicionais Trabalhistas: Noturno, Insalubridade e Periculosidade na Rescisão",
    conteudo: (
      <>
        <p>
          Os adicionais de trabalho são acréscimos salariais garantidos pela CLT ao trabalhador que exerce
          atividades em condições especiais: seja em horário noturno, em ambiente insalubre ou em situações
          de risco à vida. Esses valores não são apenas pagamentos extras no contracheque; quando habituais,
          eles integram a remuneração para todos os fins, incluindo o cálculo completo da rescisão trabalhista.
        </p>

        <h3>Adicional noturno (art. 73, CLT)</h3>
        <p>
          O adicional noturno é devido a todo trabalhador urbano que exerce atividades entre 22h e 5h, com
          percentual mínimo de 20% sobre a hora diurna. Além do adicional, a legislação determina que a hora
          noturna é computada como 52 minutos e 30 segundos (e não 60 minutos), o que significa que o
          trabalhador noturno recebe proporcionalmente mais por hora trabalhada.
        </p>
        <p>
          A prorrogação da jornada noturna, ou seja, o trabalho que continua após as 5h da manhã quando a
          jornada começou no período noturno, também dá direito ao adicional noturno, conforme entendimento
          consolidado do TST (Súmula 60, II).
        </p>

        <h3>Adicional de insalubridade (art. 192, CLT)</h3>
        <p>
          É devido ao trabalhador exposto a agentes nocivos à saúde acima dos limites de tolerância
          estabelecidos pelas normas regulamentadoras. O adicional varia conforme o grau de exposição:
          10% (mínimo), 20% (médio) ou 40% (máximo), calculados sobre o salário mínimo vigente. Algumas
          convenções coletivas determinam o cálculo sobre o salário base.
        </p>

        <h3>Adicional de periculosidade (art. 193, CLT)</h3>
        <p>
          Devido ao trabalhador que exerce atividades com risco à vida, como contato com explosivos,
          inflamáveis, energia elétrica ou atividades de segurança. O percentual é fixo: 30% sobre o
          salário base. Diferente da insalubridade, não há graus: o adicional é integral ou não é devido.
        </p>

        <h3>Reflexo dos adicionais na rescisão</h3>
        <p>
          Quando pagos com habitualidade durante o contrato, todos os adicionais integram a remuneração para
          cálculo de férias + 1/3, 13º salário, FGTS (8% mensal + multa de 40%), aviso prévio e DSR. Na
          rescisão, a empresa deve utilizar como base de cálculo o salário acrescido dos adicionais habituais.
        </p>

        <ExemploPratico>
          <p>
            Salário base: R$ 3.000. Adicional de periculosidade: 30% = R$ 900/mês. A remuneração para
            fins de rescisão é R$ 3.900. A diferença no cálculo de um aviso prévio de 45 dias:
          </p>
          <ul>
            <li>Base R$ 3.000: (3.000 ÷ 30) × 45 = R$ 4.500</li>
            <li>Base R$ 3.900: (3.900 ÷ 30) × 45 = R$ 5.850</li>
            <li>Diferença apenas no aviso: <strong>R$ 1.350</strong></li>
          </ul>
        </ExemploPratico>

        <Dica>
          <p>
            Se você trabalhava em condições de insalubridade ou periculosidade e nunca recebeu o adicional,
            ou se recebia mas a empresa não incluiu esse valor na base de cálculo da rescisão, anote essa
            irregularidade. A comprovação judicial depende de perícia técnica, mas ter registros das condições
            de trabalho (fotos, laudos anteriores, comunicados internos) fortalece sua posição.
          </p>
        </Dica>
      </>
    ),
  },

  recebiaAdicionalNoturno: {
    titulo: "Verificação do Adicional Noturno: Direitos e Irregularidades Comuns",
    conteudo: (
      <>
        <p>
          O adicional noturno é um dos direitos trabalhistas mais frequentemente descumpridos ou pagos
          incorretamente. Segundo dados dos tribunais regionais do trabalho, pedidos envolvendo adicional
          noturno estão entre os mais comuns nas reclamações trabalhistas. Verificar se o adicional foi pago
          corretamente durante o contrato é essencial para avaliar a precisão da rescisão.
        </p>

        <h3>Como verificar se o pagamento estava correto</h3>
        <p>
          Para confirmar se o adicional noturno foi pago corretamente, o trabalhador deve verificar nos
          contracheques (holerites) se existe uma rubrica específica para "adicional noturno" ou "hora
          noturna". O valor deve corresponder a, no mínimo, 20% sobre o valor da hora diurna, multiplicado
          pelo número de horas trabalhadas no período noturno (22h às 5h).
        </p>
        <p>
          A hora noturna reduzida (52min30s = 1 hora) faz com que 7 horas relógio
          no período noturno equivalham a 8 horas de trabalho. Essa redução ficta beneficia o trabalhador
          noturno, que trabalha menos minutos para completar cada hora de trabalho.
        </p>

        <h3>Situações de irregularidade</h3>
        <p>
          As irregularidades mais comuns envolvendo adicional noturno são: não pagamento apesar do trabalho
          em horário noturno, pagamento com percentual inferior a 20%, não aplicação da hora noturna reduzida,
          ausência de pagamento na prorrogação (trabalho após 5h da manhã quando a jornada começou à noite),
          e não integração do adicional na base de cálculo das demais verbas.
        </p>

        <h3>Reflexos do adicional noturno nas verbas rescisórias</h3>
        <p>
          Quando habitual, o adicional noturno integra a remuneração para fins de cálculo de férias + 1/3,
          13º salário, FGTS, aviso prévio e DSR (descanso semanal remunerado). A Súmula 60 do TST confirma
          que o adicional noturno, pago com habitualidade, integra o salário para todos os efeitos. A
          supressão do trabalho noturno não retira automaticamente esses reflexos.
        </p>

        <Dica>
          <p>
            Se você trabalhava em horário noturno e não recebia adicional, ou recebia valor inferior ao
            devido, reúna seus contracheques e registros de ponto. Compare as horas trabalhadas entre 22h
            e 5h com os valores pagos a título de adicional noturno. Qualquer diferença pode ser reclamada
            retroativamente.
          </p>
        </Dica>
      </>
    ),
  },

  horasNoturnasSemana: {
    titulo: "Cálculo do Adicional Noturno: Volume de Horas e Impacto Financeiro",
    conteudo: (
      <>
        <p>
          A quantidade de horas noturnas trabalhadas por semana é determinante para calcular o valor do
          adicional noturno e seus reflexos nas verbas rescisórias. Quanto mais horas noturnas, maior o
          impacto financeiro: tanto no pagamento mensal quanto no cálculo da rescisão.
        </p>

        <h3>Cálculo passo a passo</h3>
        <p>
          O cálculo do adicional noturno segue estas etapas: primeiro, obtém-se o valor da hora diurna
          dividindo o salário mensal por 220 (para jornada de 44h semanais) ou por 180 (para jornada de
          36h). Em seguida, aplica-se o adicional de 20% (ou percentual da convenção coletiva). Por fim,
          multiplica-se pelo número de horas noturnas efetivamente trabalhadas.
        </p>

        <ExemploPratico>
          <p>
            Salário: R$ 2.800 | Jornada: 44h semanais | Horas noturnas: 20h por semana
          </p>
          <ul>
            <li>Hora diurna: R$ 2.800 ÷ 220 = R$ 12,73</li>
            <li>Adicional 20%: R$ 12,73 × 0,20 = R$ 2,55 por hora</li>
            <li>Adicional semanal: R$ 2,55 × 20h = R$ 50,91</li>
            <li>Adicional mensal (~4,3 semanas): <strong>R$ 218,93</strong></li>
          </ul>
          <p>
            Esse valor mensal de R$ 218,93 deve ser somado ao salário para compor a remuneração base
            de cálculo de férias, 13º, FGTS e aviso prévio na rescisão.
          </p>
        </ExemploPratico>

        <h3>Reflexos acumulados na rescisão</h3>
        <p>
          Para uma rescisão com 8 meses de férias proporcionais, a diferença do adicional noturno nas
          férias seria: (R$ 218,93 ÷ 12) × 8 × 1,33 = R$ 193,64. Somando os reflexos em 13º, aviso
          prévio e FGTS, o impacto total do adicional noturno na rescisão pode ultrapassar R$ 1.000,
          valor que frequentemente é ignorado no cálculo feito pelas empresas.
        </p>

        <Dica>
          <p>
            Se a empresa não registrava corretamente as horas noturnas no ponto, colete provas alternativas:
            escalas de trabalho, comunicados internos sobre turnos, e-mails ou mensagens com confirmação
            de horários, e testemunhos de colegas que trabalhavam no mesmo turno.
          </p>
        </Dica>
      </>
    ),
  },

  grauInsalubridade: {
    titulo: "Grau de Insalubridade: Classificação, Percentuais e Impacto nos Direitos Trabalhistas",
    conteudo: (
      <>
        <p>
          O grau de insalubridade determina o percentual do adicional que o trabalhador tem direito a receber
          pela exposição a agentes nocivos à saúde. A classificação é feita por perícia técnica e segue os
          parâmetros da NR-15 (Norma Regulamentadora 15) do Ministério do Trabalho, que lista as atividades
          e os limites de tolerância para cada tipo de agente nocivo.
        </p>

        <h3>Os três graus e seus percentuais</h3>
        <p>
          O art. 192 da CLT estabelece três graus de insalubridade, cada um com percentual específico
          calculado sobre o salário mínimo vigente:
        </p>
        <ul>
          <li><strong>Grau mínimo (10%):</strong> exposição leve a agentes nocivos, como ruído acima dos limites mas abaixo de níveis críticos, ou contato esporádico com produtos químicos.</li>
          <li><strong>Grau médio (20%):</strong> exposição moderada, como trabalho contínuo com produtos químicos, poeira mineral ou temperaturas extremas.</li>
          <li><strong>Grau máximo (40%):</strong> exposição intensa, como contato permanente com agentes biológicos (hospitais, laboratórios) ou radiações ionizantes.</li>
        </ul>

        <h3>Como o grau é determinado</h3>
        <p>
          A classificação do grau de insalubridade é feita por perícia técnica realizada por engenheiro de
          segurança ou médico do trabalho. O perito avalia as condições reais do ambiente de trabalho, os
          agentes presentes, a intensidade e o tempo de exposição, e compara com os limites da NR-15. Não
          é o trabalhador nem o empregador que define o grau: é o laudo técnico.
        </p>

        <h3>Reflexos na rescisão</h3>
        <p>
          O adicional de insalubridade, quando pago habitualmente, integra a remuneração para cálculo de
          férias, 13º, FGTS e aviso prévio. Se a empresa pagava um grau inferior ao correto (por exemplo,
          mínimo quando deveria ser máximo), a diferença pode ser reclamada retroativamente em ação
          trabalhista, com reflexos em todas as verbas dos últimos 5 anos.
        </p>

        <ExemploPratico>
          <p>
            Salário mínimo 2026: R$ 1.518 (estimado). Diferença entre os graus de insalubridade:
          </p>
          <ul>
            <li>Grau mínimo (10%): R$ 151,80/mês</li>
            <li>Grau médio (20%): R$ 303,60/mês</li>
            <li>Grau máximo (40%): R$ 607,20/mês</li>
          </ul>
          <p>
            Se a empresa pagava grau mínimo quando deveria ser máximo, a diferença mensal de R$ 455,40,
            ao longo de 5 anos, representa R$ 27.324 em adicionais não pagos, sem contar os reflexos.
          </p>
        </ExemploPratico>

        <Dica>
          <p>
            Se você acredita que o grau de insalubridade pago pela empresa era inferior ao correto, ou se
            trabalhava em condições insalubres sem receber qualquer adicional, essa questão pode ser
            avaliada por meio de perícia judicial em ação trabalhista. O custo da perícia é geralmente
            arcado pela parte perdedora, e muitos sindicatos oferecem assistência jurídica gratuita.
          </p>
        </Dica>
      </>
    ),
  },

  recebiaInsalubridade: {
    titulo: "Adicional de Insalubridade: Verificação do Pagamento e Direitos na Rescisão",
    conteudo: (
      <>
        <p>
          O pagamento correto do adicional de insalubridade é uma obrigação legal do empregador sempre que o
          trabalhador estiver exposto a agentes nocivos à saúde acima dos limites de tolerância. Verificar se
          esse adicional foi pago corretamente é essencial para conferir a precisão das verbas rescisórias.
        </p>

        <h3>Quando há irregularidade no pagamento</h3>
        <p>
          As situações mais comuns de irregularidade incluem: o trabalhador estar exposto a condições insalubres
          mas não receber nenhum adicional, receber em grau inferior ao correto, ter o adicional suprimido
          indevidamente durante o contrato, ou ter o adicional excluído da base de cálculo de férias, 13º
          e FGTS na rescisão.
        </p>
        <p>
          A comprovação da insalubridade em ação trabalhista depende de perícia técnica realizada por
          profissional habilitado. O perito visita o local de trabalho (ou analisa documentos quando a empresa
          já encerrou atividades), avalia as condições e emite laudo com o grau de insalubridade aplicável.
        </p>

        <h3>Base de cálculo: salário mínimo ou base?</h3>
        <p>
          A CLT determina que o adicional de insalubridade seja calculado sobre o salário mínimo. Porém,
          o STF, na Súmula Vinculante 4, proibiu a utilização do salário mínimo como indexador, sem definir
          uma base alternativa. Na prática, a maioria dos tribunais continua aplicando o salário mínimo como
          base, exceto quando a convenção coletiva da categoria prevê cálculo sobre o salário base, o que
          é mais vantajoso para o trabalhador.
        </p>

        <h3>Cumulação com periculosidade</h3>
        <p>
          A CLT, no art. 193, § 2º, prevê que o trabalhador deve optar entre o adicional de insalubridade
          e o de periculosidade quando ambos forem aplicáveis. A opção pelo mais vantajoso é um direito do
          trabalhador. No entanto, existem decisões recentes em tribunais superiores reconhecendo a
          possibilidade de cumulação, com base na Convenção 155 da OIT. Esse é um tema em evolução na
          jurisprudência.
        </p>

        <Dica>
          <p>
            Consulte a convenção coletiva do seu sindicato para verificar se há previsão de cálculo do
            adicional de insalubridade sobre o salário base (e não sobre o mínimo). Se houver, e a empresa
            calculava sobre o mínimo, você pode ter direito a diferenças retroativas significativas.
          </p>
        </Dica>
      </>
    ),
  },

  recebiaPericulosidade: {
    titulo: "Adicional de Periculosidade: Direitos, Cálculo e Conferência na Rescisão",
    conteudo: (
      <>
        <p>
          O adicional de periculosidade é um direito do trabalhador que exerce atividades com risco à vida
          ou à integridade física, conforme definido no art. 193 da CLT. Com percentual fixo de 30% sobre
          o salário base, esse adicional tem impacto expressivo tanto na remuneração mensal quanto no valor
          total da rescisão trabalhista.
        </p>

        <h3>Atividades consideradas perigosas pela legislação</h3>
        <p>
          A NR-16 do Ministério do Trabalho define as atividades e operações perigosas. As principais categorias são:
        </p>
        <ul>
          <li><strong>Explosivos e inflamáveis:</strong> trabalho com armazenamento, transporte ou manuseio.</li>
          <li><strong>Energia elétrica:</strong> atividades no sistema elétrico de potência e em instalações elétricas.</li>
          <li><strong>Segurança pessoal e patrimonial:</strong> vigilantes e seguranças (Lei 12.740/2012).</li>
          <li><strong>Motocicleta:</strong> uso em vias públicas a serviço do empregador (Lei 12.997/2014).</li>
          <li><strong>Radiações ionizantes e substâncias radioativas:</strong> conforme regulamentação específica.</li>
        </ul>

        <h3>Cálculo e base de incidência</h3>
        <p>
          O adicional de periculosidade é de 30% sobre o salário base do trabalhador, sem incluir
          gratificações, prêmios ou comissões. Por exemplo, se o salário base é R$ 3.500, o adicional é
          de R$ 1.050 por mês, elevando a remuneração para R$ 4.550 para fins de cálculo de férias, 13º,
          FGTS e aviso prévio.
        </p>

        <h3>Impacto significativo na rescisão</h3>
        <p>
          Como o adicional de periculosidade é calculado sobre o salário base (e não sobre o mínimo, como
          a insalubridade), seu impacto na rescisão é proporcionalmente maior. Todos os 30% integram a
          remuneração para cálculo de todas as verbas, gerando um efeito multiplicador expressivo.
        </p>

        <ExemploPratico>
          <p>
            Eletricista com salário base de R$ 4.000, 6 anos de empresa, demitido sem justa causa:
          </p>
          <ul>
            <li>Adicional de periculosidade: R$ 4.000 × 30% = R$ 1.200/mês</li>
            <li>Remuneração para rescisão: R$ 5.200</li>
            <li>Aviso prévio (48 dias): (5.200 ÷ 30) × 48 = R$ 8.320</li>
            <li>Se calculado sem o adicional: (4.000 ÷ 30) × 48 = R$ 6.400</li>
            <li>Diferença apenas no aviso: <strong>R$ 1.920</strong></li>
          </ul>
          <p>Somando os reflexos nas demais verbas, a exclusão indevida do adicional pode gerar diferença superior a R$ 8.000.</p>
        </ExemploPratico>

        <Dica>
          <p>
            Se você exercia atividade perigosa e nunca recebeu o adicional, ou se a empresa excluiu o
            adicional da base de cálculo da rescisão, anote essa informação. Em ação trabalhista, a perícia
            técnica avaliará se as condições de trabalho se enquadram nas hipóteses legais de periculosidade.
            A comprovação é técnica e não depende apenas do testemunho do trabalhador.
          </p>
        </Dica>
      </>
    ),
  },

  erroNaRescisao: {
    titulo: "Erros na Rescisão Trabalhista: Os Equívocos Mais Comuns e Como Identificá-los",
    conteudo: (
      <>
        <p>
          A rescisão trabalhista envolve um cálculo complexo com múltiplas variáveis: tipo de desligamento,
          tempo de serviço, remuneração total, adicionais, férias vencidas, proporcionalidades e descontos
          legais. Essa complexidade faz com que erros sejam surpreendentemente frequentes, mesmo em empresas
          com departamentos de recursos humanos estruturados.
        </p>
        <p>
          Os erros podem ser involuntários (falhas de sistema, interpretação incorreta da legislação, dados
          desatualizados) ou intencionais (omissão de verbas para reduzir custos). Em ambos os casos, o
          resultado é o mesmo: o trabalhador recebe menos do que lhe é devido por lei. Conhecer os erros
          mais comuns é o primeiro passo para se proteger.
        </p>

        <h3>Os 7 erros mais frequentes nas rescisões</h3>
        <ul>
          <li>
            <strong>1. Base de cálculo incorreta:</strong> utilizar apenas o salário fixo, ignorando comissões,
            horas extras habituais e adicionais que deveriam integrar a remuneração.
          </li>
          <li>
            <strong>2. Aviso prévio sem proporcionalidade:</strong> calcular apenas 30 dias ao invés de
            aplicar a proporcionalidade de 3 dias por ano de serviço (Lei 12.506/2011).
          </li>
          <li>
            <strong>3. Férias vencidas pagas no valor simples:</strong> pagar o valor normal das férias quando
            deveriam ser pagas em dobro por terem excedido o período concessivo.
          </li>
          <li>
            <strong>4. Multa de FGTS sobre saldo atual:</strong> calcular a multa de 40% apenas sobre o
            saldo atual da conta FGTS, e não sobre o total de depósitos realizados durante o contrato.
          </li>
          <li>
            <strong>5. Não inclusão de reflexos do aviso indenizado:</strong> pagar o aviso prévio indenizado
            sem projetar a data de desligamento para cálculo dos reflexos em férias, 13º e FGTS.
          </li>
          <li>
            <strong>6. Desconto indevido de IR sobre verbas isentas:</strong> reter Imposto de Renda sobre
            férias indenizadas, multa de FGTS ou aviso prévio indenizado, que são verbas isentas.
          </li>
          <li>
            <strong>7. 13º proporcional com meses incorretos:</strong> contar o número de meses trabalhados
            no ano de forma equivocada, desconsiderando a regra dos 15 dias.
          </li>
        </ul>

        <h3>Como conferir sua rescisão passo a passo</h3>
        <p>
          Para verificar se sua rescisão está correta, siga estes passos:
        </p>
        <ul>
          <li>Confirme o tipo de desligamento e a data de admissão/desligamento no TRCT.</li>
          <li>Verifique se a remuneração utilizada como base inclui todas as parcelas habituais.</li>
          <li>Confira o cálculo do aviso prévio proporcional ao tempo de serviço.</li>
          <li>Verifique se as férias vencidas (se houver) foram pagas em dobro.</li>
          <li>Confira o 13º proporcional (meses trabalhados no ano × salário ÷ 12).</li>
          <li>Compare a multa do FGTS com o extrato analítico da conta vinculada.</li>
          <li>Verifique se os descontos de INSS e IR estão nas faixas corretas.</li>
        </ul>

        <LeiRef>
          <p>
            <strong>Art. 477, § 6º, CLT:</strong> O pagamento das verbas rescisórias deve ser efetuado em até
            10 dias contados do término do contrato. O descumprimento desse prazo gera multa a favor do
            trabalhador no valor de um salário (§ 8º). O TRCT deve discriminar cada verba separadamente,
            permitindo a conferência pelo trabalhador.
          </p>
        </LeiRef>

        <ExemploPratico>
          <p>
            Cenário de erro: empresa calcula a rescisão de Cláudia (8 anos, salário R$ 4.000 + R$ 600
            em HE habituais) usando apenas R$ 4.000 como base e aviso de 30 dias (ao invés de 54):
          </p>
          <ul>
            <li>Diferença no aviso prévio: ~R$ 3.680</li>
            <li>Diferença na base de cálculo (HE): reflexos de ~R$ 2.400</li>
            <li>Prejuízo total estimado: <strong>~R$ 6.080</strong></li>
          </ul>
        </ExemploPratico>

        <h3>O que fazer ao identificar um erro</h3>
        <p>
          Se você identificar divergências, o primeiro passo é solicitar esclarecimentos formais ao
          departamento pessoal da empresa (preferencialmente por e-mail, para ter registro). Se não houver
          acordo, procure o sindicato da sua categoria para mediação. Em último caso, um advogado trabalhista
          pode avaliar a viabilidade de uma ação judicial. O prazo é de 2 anos após o desligamento.
        </p>

        <Dica>
          <p>
            Ao receber o TRCT, não assine sem conferir. Solicite ao RH o detalhamento de cada verba e
            tire uma cópia antes de assinar. Lembre-se: assinar o TRCT não significa concordar com os
            valores; o trabalhador mantém o direito de questioná-los judicialmente pelo prazo de 2 anos.
            Mas ter registrado formalmente a divergência antes de assinar fortalece sua posição.
          </p>
        </Dica>
      </>
    ),
  },
};

interface EditorialContentProps {
  campo: string;
}

export function EditorialContent({ campo }: EditorialContentProps) {
  const section = editorialContent[campo];
  if (!section) return null;

  return (
    <section className="w-full bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Título principal da seção */}
        <div className="mb-6 pb-4 border-b border-gray-100">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-widest mb-1.5">Saiba mais</p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
            {section.titulo}
          </h2>
        </div>

        <div className="text-[13px] sm:text-[14px] text-gray-600 leading-[1.8] space-y-2
          [&_h3]:text-sm [&_h3]:sm:text-[15px] [&_h3]:font-bold [&_h3]:text-gray-900
          [&_h3]:mt-7 [&_h3]:mb-2 [&_h3]:pb-1 [&_h3]:border-b [&_h3]:border-gray-100
          [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:sm:pl-5 [&_ul]:space-y-1.5
          [&_strong]:text-gray-800 [&_p]:text-gray-600 [&_p]:leading-relaxed">
          {section.conteudo}
        </div>
      </div>
    </section>
  );
}
