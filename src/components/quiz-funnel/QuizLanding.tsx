import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdBanner } from "@/components/AdBanner";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ArrowRight, CheckCircle, Clock, Sparkles, Scale, Search, UserCheck, Users } from "lucide-react";

interface QuizLandingProps {
  onStart: () => void;
}

const benefits = [
  { text: "Calculado pelas regras da CLT 2026", Icon: Scale },
  { text: "Descubra valores extras que você tem direito", Icon: Search },
  { text: "Tudo explicado de maneira simples", Icon: UserCheck },
] as const;

const faqItems = [
  {
    q: "Fui demitido sem justa causa. O que tenho direito a receber?",
    a: "A demissão sem justa causa é o cenário mais completo em termos de direitos. Você recebe saldo de salário pelos dias trabalhados no mês, aviso prévio proporcional ao tempo de casa, 13º salário proporcional, férias proporcionais acrescidas do terço constitucional, férias vencidas se houver, multa de 40% sobre o saldo total do FGTS, saque integral do fundo e as guias para dar entrada no seguro-desemprego. O ponto que mais pesa financeiramente costuma ser o aviso prévio: quem tem muitos anos de empresa pode ter direito a até 90 dias, não apenas os 30 dias que todo mundo conhece. Confira mais detalhes sobre esse cálculo em nosso artigo sobre <a href='/blog/demissao-sem-justa-causa-direitos' className='text-primary underline underline-offset-2 hover:text-primary/80'>demissão sem justa causa</a>."
  },
  {
    q: "Pedi demissão. Perco todos os meus direitos?",
    a: "Não. Pedido de demissão não zera a rescisão. Você continua recebendo saldo de salário, 13º proporcional e férias proporcionais com o terço constitucional. O que muda é que a multa de 40% do FGTS não existe nessa modalidade, o saque do fundo não é liberado e você perde o direito ao seguro-desemprego. Tem um detalhe importante sobre o aviso prévio: se você não cumprir os 30 dias, a empresa pode descontar o valor correspondente da sua rescisão. Se ela te dispensar do cumprimento, esse desconto não pode ser feito."
  },
  {
    q: "A empresa tem quantos dias para pagar a rescisão?",
    a: "O prazo legal é de <strong>10 dias corridos</strong> contados a partir do último dia do contrato, conforme o <strong>artigo 477, parágrafo 6º, da CLT</strong>. Se a empresa atrasar, ela fica obrigada a pagar uma multa equivalente a um salário completo do trabalhador. Esse prazo vale para qualquer tipo de desligamento, seja demissão sem justa causa, pedido de demissão ou acordo. Guarde esse número: dez dias. Depois disso, a empresa já está em infração."
  },
  {
    q: "O que é aviso prévio proporcional e como funciona?",
    a: "O aviso prévio começa em 30 dias fixos. A partir daí, para cada ano completo trabalhado acima de um ano, a <strong>Lei 12.506/2011</strong> garante mais 3 dias, com limite máximo de 90 dias no total. Se você trabalhou 5 anos, seu aviso prévio é de 42 dias, não 30. Com 10 anos de casa, são 57 dias. Se a empresa opta pelo aviso indenizado, esses dias todos precisam ser pagos. É um dos pontos onde mais se perde dinheiro sem perceber. Tem um artigo aqui no blog que explica esse cálculo passo a passo: <a href='/blog/aviso-previo-proporcional-como-funciona' className='text-primary underline underline-offset-2 hover:text-primary/80'>aviso prévio proporcional</a>."
  },
  {
    q: "Como sei se minha rescisão foi calculada corretamente?",
    a: "A forma mais direta é pegar o TRCT, o Termo de Rescisão do Contrato de Trabalho, e comparar cada verba com um cálculo independente feito a partir do seu salário real, do seu tempo de serviço e do tipo de desligamento. Saldo de salário, 13º, férias, aviso prévio e FGTS precisam bater. O problema é que essa conta não é trivial: envolve proporcionalidades, bases de cálculo e regras que variam conforme o caso. Uma diferença que parece pequena em uma verba se multiplica nas outras, e em contratos longos pode chegar a vários milhares de reais."
  },
  {
    q: "Recebia comissões e horas extras. Isso entra no cálculo da rescisão?",
    a: "Sim, e esse é um dos erros mais frequentes nas rescisões brasileiras. Comissões, horas extras habituais, adicional noturno, insalubridade e periculosidade fazem parte da sua remuneração, não são extras descolados do contrato. Pela CLT, esses valores precisam entrar na base de cálculo do 13º, das férias, do aviso prévio e dos depósitos do FGTS. Quando a empresa calcula tudo pelo salário base e ignora essas parcelas, o trabalhador recebe menos do que a lei garante. Se esse é o seu caso, o valor da diferença pode ser expressivo."
  },
  {
    q: "Posso receber férias em dobro na rescisão?",
    a: "Pode, e em algumas situações é obrigatório. Quando a empresa não concede as férias dentro do chamado período concessivo, que vai até 12 meses após o trabalhador completar o período aquisitivo, a lei determina o pagamento em dobro, acrescido do terço constitucional. Muita gente chega à rescisão com férias vencidas de 2 ou 3 períodos e nem sabe que tem esse direito. Veja como esse cálculo funciona na prática no nosso artigo sobre <a href='/blog/ferias-proporcionais-vencidas-calculo' className='text-primary underline underline-offset-2 hover:text-primary/80'>férias proporcionais e vencidas</a>."
  },
  {
    q: "Fiz um acordo com a empresa para sair. O que recebo?",
    a: "O acordo por mútuo consentimento foi criado pela <strong>Reforma Trabalhista de 2017</strong> e funciona como um meio-termo. Você recebe 13º proporcional, férias proporcionais com o terço, metade do aviso prévio indenizado e uma multa de <strong>20% sobre o saldo do FGTS</strong> em vez dos 40% da demissão sem justa causa. É permitido sacar até 80% do saldo do fundo. O que não existe nessa modalidade é o seguro-desemprego. Para quem já tem outra oportunidade de emprego e quer sair sem abrir mão de tudo, costuma fazer sentido."
  },
  {
    q: "Quanto tempo tenho para entrar com ação trabalhista?",
    a: "Você tem <strong>2 anos</strong> contados a partir da data do desligamento para ajuizar uma reclamação trabalhista. Depois desse prazo, o direito prescreve. Dentro da ação, é possível cobrar diferenças dos <strong>últimos 5 anos</strong> do contrato. Ou seja: se você trabalhou 12 anos e entrou com a ação dentro do prazo de 2 anos, pode reclamar as diferenças dos últimos 5, não dos 12. Não deixe o tempo passar sem pelo menos verificar se os cálculos da sua rescisão estão corretos."
  },
  {
    q: "Recebia parte do salário por fora. Isso afeta o que vou receber?",
    a: "Afeta bastante. Quando a empresa registra um salário menor do que o real, o FGTS é depositado sobre o valor menor, o 13º e as férias são calculados sobre esse valor, e o aviso prévio também. Na rescisão, tudo isso aparece defasado. Provar pagamento por fora é difícil, mas não impossível: transferências bancárias, mensagens, e-mails e testemunhas podem servir de prova numa ação trabalhista. Se houver evidências, compensa buscar orientação jurídica antes de assinar qualquer coisa."
  },
];

function EditorialHome() {
  return (
    <section className="w-full bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 leading-tight">
          Rescisão Trabalhista no Brasil: O Guia Completo para Não Perder Dinheiro
        </h2>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Se você foi mandado embora, pediu demissão ou chegou a um acordo com a empresa, tem uma grande chance de não saber se recebeu tudo o que a lei manda. E isso não é exagero. O cálculo da rescisão trabalhista envolve pelo menos oito verbas distintas, cada uma com suas próprias regras de proporcionalidade, base de cálculo e prazos. Até departamentos de RH experientes erram com frequência.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Os dados do <strong>Tribunal Superior do Trabalho</strong> confirmam: processos sobre verbas rescisórias lideram o volume de reclamações na Justiça do Trabalho brasileira há anos. Na maioria dos casos, o problema não é mal-intenção do empregador. São falhas de sistema, desconhecimento sobre o <a href="/blog/aviso-previo-proporcional-como-funciona" className="text-primary underline underline-offset-2 hover:text-primary/80">aviso prévio proporcional</a> e a exclusão de parcelas variáveis do cálculo. O trabalhador recebe menos do que deveria e, na maioria das vezes, nem percebe.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Este guia foi escrito para mudar isso. A ideia é que você termine a leitura sabendo o que é cada verba, como ela é calculada e onde costumam aparecer os erros. Sem juridiquês, sem rodeios.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
          Se preferir ir direto aos números, a calculadora no topo desta página faz o cálculo completo em menos de dois minutos, verba por verba, com base na <strong>CLT atualizada</strong>.
        </p>

        {/* AdSense — topo do artigo editorial */}
        <AdBanner slot="7777777777" format="auto" className="mb-6 sm:mb-10" />

        {/* O que é a rescisão */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3">
          Afinal, o que é a rescisão trabalhista?
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Rescisão trabalhista é o acerto financeiro entre empresa e empregado quando o contrato de trabalho encerra, independentemente do motivo. Pense como fechar uma conta corrente: tudo que ficou pendente ao longo dos meses ou anos de vínculo precisa ser liquidado de uma vez.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Na prática, isso significa somar os dias trabalhados no último mês que ainda não foram pagos, as férias acumuladas que não foram tiradas, a fração do 13º salário, o aviso prévio quando for o caso e, dependendo do tipo de desligamento, a multa sobre o <a href="/blog/calculo-fgts-multa-rescisoria" className="text-primary underline underline-offset-2 hover:text-primary/80">FGTS e o saque do fundo</a>. Cada parcela tem regras específicas na CLT, e é exatamente onde mora o problema.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Tudo isso fica registrado no <strong>TRCT, o Termo de Rescisão do Contrato de Trabalho</strong>, o documento que você assina no departamento pessoal. O que pouca gente sabe: assinar esse documento não significa que você concorda com os valores. A lei permite questionar diferenças por até dois anos após o desligamento, com direito a reclamar os últimos cinco anos do contrato.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8">
          A regra prática é: <strong className="text-gray-900">confie na empresa, mas confira os números</strong>. Sistemas de folha de pagamento ficam desatualizados. O RH trabalha sob pressão de prazo. Erros acontecem, e você é quem paga a conta quando eles passam despercebidos.
        </p>

        {/* Tipos de rescisão */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3">
          Os 4 tipos de desligamento e o que muda em cada um
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5">
          O tipo de desligamento é o principal fator que define o valor da sua rescisão. Cada modalidade segue regras próprias, e conhecê-las é o primeiro passo para saber se você recebeu corretamente.
        </p>

        <div className="space-y-5 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">1. Demissão sem justa causa</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              É quando a empresa te manda embora sem um motivo grave que justifique a dispensa. É o cenário mais completo em termos de direitos: você recebe saldo de salário, aviso prévio proporcional, 13º proporcional, férias com o terço constitucional, multa de <strong>40% sobre o saldo total do FGTS</strong>, saque integral do fundo e as guias do seguro-desemprego.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Um ponto que muita gente ignora: o aviso prévio não é fixo em 30 dias. Com mais de 1 ano de casa, você ganha 3 dias extras por cada ano completo. Quem trabalhou 8 anos tem direito a 54 dias de aviso prévio. Essa diferença, sozinha, pode mudar bastante o valor da rescisão. Veja como funciona no nosso artigo sobre <a href="/blog/demissao-sem-justa-causa-direitos" className="text-primary underline underline-offset-2 hover:text-primary/80">demissão sem justa causa</a>.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">2. Pedido de demissão</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Quando você decide sair por conta própria. Aqui você perde a multa do FGTS, o saque do fundo e o seguro-desemprego. Mas continua com direito ao saldo de salário, 13º proporcional e férias com o terço.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Atenção ao aviso prévio: se você não cumprir os 30 dias, a empresa pode descontar o valor correspondente da sua rescisão. Se ela te dispensar do cumprimento, esse desconto não pode ser feito. É o tipo de detalhe que resolve ou complica o valor final.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">3. Justa causa</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Ocorre quando o trabalhador comete uma falta grave reconhecida pela CLT: abandono de emprego, insubordinação reiterada, embriaguez habitual, entre outras. Nesse caso, você fica basicamente com o saldo de salário e as férias vencidas, se houver. É o cenário com menos direitos.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              O ponto crítico: a justa causa precisa ser comprovada e proporcional à falta cometida. Empresas que aplicam justa causa de forma irregular para economizar na rescisão acabam perdendo na Justiça. Se você acha que a demissão foi indevida, vale procurar orientação jurídica.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">4. Acordo trabalhista</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Criado pela <strong>Reforma Trabalhista de 2017</strong>, funciona como um meio-termo entre a demissão e o pedido de saída. Você recebe metade do aviso prévio indenizado, <strong>20% de multa sobre o FGTS</strong> em vez de 40%, pode sacar até 80% do saldo do fundo, e mantém o 13º e as férias proporcionais. Seguro-desemprego não está incluído.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Quem já tem outra oportunidade de emprego engatilhada costuma usar essa modalidade para sair sem abrir mão de tudo. É uma opção legítima, prevista em lei.
            </p>
          </div>
        </div>

        <RelatedPosts
          slugs={[
            "demissao-sem-justa-causa-direitos",
            "pedido-de-demissao-o-que-voce-recebe",
            "rescisao-por-acordo-mutuo",
            "demissao-por-justa-causa-motivos",
          ]}
          title="Artigos relacionados"
        />

        {/* Verbas */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3">
          Entendendo cada verba da rescisão (sem juridiquês)
        </h3>

        <div className="space-y-5 mb-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Saldo de salário</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              São os dias trabalhados no mês do desligamento que ainda não foram pagos. Se você ganha R$ 3.000 por mês e foi demitido no dia 20, recebe R$ 2.000 de saldo (20/30 do salário). Parece simples, mas descontos indevidos costumam aparecer aqui.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Aviso prévio</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Pode ser trabalhado, quando você cumpre o período de 30 dias com redução de duas horas diárias ou sete dias corridos ao final, ou indenizado, quando a empresa te libera e paga o período. O cálculo proporcional: <strong>30 dias fixos mais 3 dias por cada ano completo trabalhado</strong>, com teto de 90 dias pela <strong>Lei 12.506/2011</strong>. Um trabalhador com 15 anos de casa tem direito a 75 dias de aviso prévio, o equivalente a quase dois salários e meio.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">13º salário proporcional</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Você recebe 1/12 do salário por cada mês trabalhado no ano corrente. Quem trabalhou de janeiro a setembro recebe 9/12 do salário. A regra do arredondamento: trabalhou pelo menos 15 dias num mês, esse mês conta como completo. Comissões e horas extras habituais devem entrar na base desse cálculo, e frequentemente não entram.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Férias proporcionais e vencidas</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Férias proporcionais cobrem o período incompleto desde as últimas férias até o desligamento. Férias vencidas são aquelas que você já tinha o direito adquirido de tirar mas a empresa não concedeu no prazo legal. Quando isso acontece, a lei obriga o pagamento em dobro. Todas as férias, sem exceção, levam o <strong>terço constitucional</strong> por cima. É a verba com mais erros de cálculo que encontramos. Confira como funciona no artigo sobre <a href="/blog/ferias-proporcionais-vencidas-calculo" className="text-primary underline underline-offset-2 hover:text-primary/80">férias proporcionais e vencidas</a>.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">FGTS e multa rescisória</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Todo mês a empresa deposita <strong>8% do salário bruto</strong> na sua conta do FGTS. Na demissão sem justa causa, além de sacar o saldo acumulado, você recebe uma multa de <strong>40% sobre tudo que foi depositado</strong> durante o contrato. Se você acumulou R$ 30.000 no fundo, a multa é de R$ 12.000. Antes de dar entrada no saque, verifique se todos os depósitos mensais foram feitos. Inconsistências são mais comuns do que parecem. Veja como calcular em detalhes no nosso artigo sobre <a href="/blog/calculo-fgts-multa-rescisoria" className="text-primary underline underline-offset-2 hover:text-primary/80">FGTS e multa rescisória</a>.
            </p>
          </div>
        </div>

        <RelatedPosts
          slugs={[
            "calculo-fgts-multa-rescisoria",
            "ferias-proporcionais-vencidas-calculo",
            "decimo-terceiro-salario-calculo",
            "aviso-previo-proporcional-como-funciona",
          ]}
          title="Entenda cada verba em detalhes"
        />

        {/* AdSense — meio do artigo editorial */}
        <AdBanner slot="8888888888" format="auto" className="my-8" />

        {/* Erros comuns */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3">
          Os erros que fazem você perder dinheiro (e são mais comuns do que parece)
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Alguns erros aparecem com tanta frequência nas rescisões brasileiras que já dá para considerá-los padrão. Conhecer cada um deles é o que separa quem confere a rescisão de quem simplesmente assina.
        </p>
        <div className="space-y-3 mb-8">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Aviso prévio travado em 30 dias.</strong> É o erro mais caro. Um trabalhador com 10 anos de empresa tem direito a 60 dias de aviso prévio proporcional. Quando a empresa paga só 30, ele perde o equivalente a um salário inteiro sem perceber.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Férias vencidas pagas de forma simples em vez de em dobro.</strong> Se a empresa não concedeu as férias no prazo legal, a CLT determina o dobro. Pagar o valor simples é descumprir a lei, mas acontece com regularidade.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Horas extras e comissões fora da base de cálculo.</strong> Esses valores precisam compor o 13º, as férias, o aviso prévio e o FGTS. Quando a empresa usa só o salário fixo, todas as verbas saem menores do que deveriam.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">FGTS calculado sobre salário base.</strong> O depósito de 8% deve incidir sobre a remuneração total, incluindo parcelas variáveis. Calcular só pelo fixo gera déficit no fundo e reduz a multa rescisória na proporção.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Tempo de serviço contado errado.</strong> Meses em que o trabalhador ficou pelo menos 15 dias ativos devem ser contados como completos. Cortar esses meses reduz o 13º, as férias proporcionais e o próprio aviso prévio.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">Desconto de aviso prévio indevido.</strong> Se a empresa dispensou você do cumprimento, ela não pode descontar esses dias da rescisão. Ainda assim, o desconto aparece no TRCT de muitos trabalhadores.
          </p>
        </div>

        <RelatedPosts
          slugs={[
            "horas-extras-direitos-trabalhistas",
            "como-ler-trct-passo-a-passo",
            "trabalho-sem-carteira-assinada",
            "prazo-pagamento-rescisao-multa",
          ]}
          title="Aprofunde seu conhecimento"
        />

        {/* Como se proteger */}
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 mb-8">
          <p className="text-sm font-semibold text-primary mb-2">
            Como se proteger na prática
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            Antes de assinar a rescisão, pegue seu último holerite, anote a data exata de admissão e de demissão, e calcule cada verba de forma independente. Depois compare com o TRCT que a empresa apresentou. Se qualquer número não fechar, não assine sem questionar e pedir explicação por escrito.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Mesmo que você já tenha assinado e recebido, ainda tem até <strong>2 anos</strong> para buscar a diferença na Justiça do Trabalho. O tempo passa rápido, então não deixe para depois.
          </p>
        </div>

        {/* Prazos */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3">
          Prazos que todo trabalhador precisa conhecer
        </h3>
        <div className="space-y-4 mb-8">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">10 dias corridos</strong> é o prazo que a empresa tem para pagar a rescisão depois do último dia de trabalho, conforme o <strong>artigo 477 da CLT</strong>. Se atrasar um dia que seja, já deve multa equivalente a um salário completo do empregado.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">2 anos</strong> é o prazo para ajuizar uma reclamação trabalhista após o desligamento. Depois disso, o direito prescreve. Não tem prorrogação, não tem exceção. Guarde a data da demissão e marque no calendário.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            <strong className="text-gray-900">5 anos</strong> é o limite retroativo dentro da ação trabalhista. Se você trabalhou 12 anos e entrou com a ação dentro do prazo de 2 anos, pode cobrar diferenças dos últimos 5 anos de contrato, não dos 12.
          </p>
        </div>

        {/* Situações especiais */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3">
          Situações especiais que mudam o cálculo
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5">
          Nem toda rescisão segue o roteiro padrão. Existem cenários em que o trabalhador tem proteções extras ou direitos adicionais que mudam completamente o valor final.
        </p>
        <div className="space-y-5 mb-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Gestante e estabilidade provisória</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              A trabalhadora gestante tem estabilidade no emprego desde a confirmação da gravidez até 5 meses após o parto. Se for demitida nesse período, tem direito à reintegração ou ao pagamento de todos os salários e benefícios do período de estabilidade. É uma das proteções mais fortes da CLT.
              Saiba mais no artigo sobre <a href="/blog/licenca-maternidade-estabilidade-gestante" className="text-primary underline underline-offset-2 hover:text-primary/80">estabilidade da gestante</a>.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Adicional noturno e insalubridade</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Quem trabalha entre 22h e 5h tem direito ao adicional noturno de no mínimo 20% sobre a hora diurna. Já quem trabalha exposto a agentes nocivos pode ter direito a adicional de insalubridade (10%, 20% ou 40%) ou periculosidade (30%). Esses adicionais integram a base de cálculo de todas as verbas rescisórias.
            </p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5">
            <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Rescisão indireta</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Quando é a empresa que descumpre o contrato de forma grave (não paga salário, altera função sem consentimento, pratica assédio), o trabalhador pode pedir a chamada <a href="/blog/rescisao-indireta-quando-cabe" className="text-primary underline underline-offset-2 hover:text-primary/80">rescisão indireta</a>. É como se fosse uma "justa causa ao contrário": o trabalhador recebe todas as verbas como se tivesse sido demitido sem justa causa.
            </p>
          </div>
        </div>

        <RelatedPosts
          slugs={[
            "estabilidade-provisoria-quem-tem-direito",
            "adicional-noturno-regras-calculo",
            "insalubridade-periculosidade-diferencas",
            "rescisao-indireta-quando-cabe",
          ]}
          title="Situações especiais"
        />

        {/* Seção extra: O que fazer se os valores estiverem errados */}
        <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-3">
          O que fazer se os valores estiverem errados
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Se você conferiu o TRCT e identificou uma diferença, não precisa ir direto para a Justiça. Existem caminhos mais simples para resolver primeiro.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          O ponto de partida é o próprio departamento pessoal da empresa. Apresente os números que você calculou, aponte verba por verba onde está a divergência e peça uma resposta por escrito. Em muitos casos o erro é de sistema, e a empresa corrige sem resistência quando fica evidente.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Se a conversa não avançar, o sindicato da sua categoria é o próximo recurso. Boa parte oferece assessoria jurídica gratuita e pode intermediar uma negociação direta. O custo para você é zero, e o peso de um sindicato numa mesa de negociação é considerável.
        </p>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          Em último caso, a reclamação trabalhista na <strong>Justiça do Trabalho</strong> é a via mais formal. Para causas de até 20 salários mínimos, você pode entrar sem advogado, embora ter um aumente bastante as chances de êxito. E um detalhe que quase ninguém sabe: a Justiça do Trabalho é gratuita para quem comprova não ter condições de pagar as custas processuais. O acesso à justiça não depende do tamanho do seu salário.
        </p>

        <RelatedPosts
          slugs={[
            "como-entrar-acao-trabalhista",
            "como-ler-trct-passo-a-passo",
            "assedio-moral-trabalho-como-agir",
            "homologacao-rescisao-quando-necessaria",
          ]}
          title="Busque seus direitos"
        />

        <AdBanner slot="9999999999" format="auto" className="my-8" />

        {/* Conclusão */}
        <div className="border-t border-gray-200 pt-8 mb-12">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            A rescisão trabalhista é um direito, não um favor. Cada verba tem respaldo na CLT, cada prazo está em artigo específico, e cada valor pode ser calculado com exatidão. O problema nunca foi a lei. O problema é que a maioria dos trabalhadores não sabe o que a lei garante.
          </p>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
            Em contratos de 5 ou 10 anos, um erro no aviso prévio proporcional ou a exclusão de horas extras habituais da base de cálculo pode representar diferenças de vários milhares de reais. Dinheiro que faz falta no aluguel, na escola dos filhos, nas contas do mês.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
            A calculadora aqui no topo da página existe para isso: para que você saiba, em menos de 2 minutos, o que a lei te garante. Sem cadastro, sem custo, com base na legislação vigente. Use, compare com o que você recebeu, e decida com informação na mão.
          </p>
        </div>

        {/* FAQ */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
          Perguntas Frequentes sobre Rescisão Trabalhista
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          As dúvidas que chegam com mais frequência dos trabalhadores brasileiros, respondidas de forma direta.
        </p>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <details key={i} className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-start gap-2.5 px-4 py-3.5 cursor-pointer list-none select-none">
                <span className="text-primary font-bold text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-900 flex-1 leading-snug">{item.q}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 mt-0.5 text-base leading-none">▾</span>
              </summary>
              <div className="px-4 pb-3.5 pt-0 pl-9">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>

      </div>
    </section>
  );
}

export function QuizLanding({ onStart }: QuizLandingProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-14 overflow-hidden">
        {/* Glows decorativos no fundo */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

        <div className="relative w-full max-w-[520px] text-center">

          {/* Badge de atualização */}
          <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-wide">
              Atualizado para CLT 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-4">
            Calcule o{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Valor Exato
            </span>{" "}
            da sua Rescisão
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-lg text-muted-foreground mb-7 max-w-md mx-auto leading-relaxed">
            Calculamos quanto você tem direito a receber na sua <strong className="text-foreground">rescisão trabalhista</strong>, esteja você saindo, pensando em sair ou já fora da empresa.
          </p>

          {/* Benefits — design premium */}
          <div className="space-y-2.5 mb-7">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 text-left bg-card border border-border/40 rounded-2xl px-4 py-3.5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0">
                  <benefit.Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground flex-1 leading-snug">{benefit.text}</span>
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              </div>
            ))}
          </div>

          {/* CTA — destaque máximo */}
          <Button
            onClick={onStart}
            size="lg"
            className="group relative w-full h-14 sm:h-16 rounded-2xl text-base sm:text-lg font-extrabold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-primary via-primary to-primary/85"
          >
            <span>Calcular minha rescisão agora</span>
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>

          {/* Microcopy abaixo do CTA */}
          <div className="flex flex-col items-center gap-1.5 mt-4">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Resultado em <strong className="text-foreground">menos de 3 minutos</strong></span>
            </div>
            <p className="text-[10px] text-muted-foreground/70">
              Usado por + de 2.574.600 trabalhadores
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
