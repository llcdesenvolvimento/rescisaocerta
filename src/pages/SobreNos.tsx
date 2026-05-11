import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackLink } from "@/components/BackLink";
import { SEOHead } from "@/components/SEOHead";
import { AdBanner } from "@/components/AdBanner";

export default function SobreNos() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead
        title="Sobre Nós — Rescisão Certa"
        description="Conheça a Rescisão Certa: quem somos, como surgimos e por que construímos uma calculadora trabalhista gratuita para ajudar trabalhadores brasileiros a conhecer seus direitos."
        canonical="https://rescisaocerta.com.br/sobre-nos"
      />
      <Header />

      <main className="flex-1 py-8 px-4">
        <article className="max-w-2xl mx-auto">
          <BackLink />

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Sobre a Rescisão Certa</h1>
          <p className="text-xs text-gray-400 mb-8">Última atualização: abril de 2026</p>

          <div className="text-gray-600 leading-relaxed space-y-6 text-sm">

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Como tudo começou</h2>
              <p>
                A Rescisão Certa nasceu de uma situação real. Em 2023, um membro da nossa equipe acompanhou de perto
                o processo de desligamento de um familiar que havia trabalhado por 11 anos na mesma empresa. O Termo
                de Rescisão foi entregue com valores já preenchidos, o departamento pessoal explicou tudo de forma
                rápida, e a pressão para assinar era clara. Ninguém tinha certeza se os números estavam certos.
              </p>
              <p className="mt-3">
                Ao buscar uma ferramenta simples para conferir os cálculos, o que encontramos foram planilhas
                complexas, sites desatualizados ou calculadoras que exigiam cadastro para mostrar qualquer resultado.
                Fizemos as contas manualmente, descobrimos uma diferença de R$ 3.200 na multa do FGTS, e a empresa
                corrigiu o valor após questionamento formal.
              </p>
              <p className="mt-3">
                Esse episódio nos fez perguntar: quantos trabalhadores passam por isso sem ter quem os ajude a
                conferir? A resposta, segundo dados do Tribunal Superior do Trabalho, é: milhões. Processos
                envolvendo verbas rescisórias são sistematicamente um dos tipos mais recorrentes na Justiça do
                Trabalho brasileira. A maioria poderia ser evitada com informação.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Quem somos</h2>
              <p>
                A Rescisão Certa é um produto da <strong>Aileron Tecnologia LTDA</strong>, empresa brasileira
                de tecnologia sediada em Brasília – DF, especializada no desenvolvimento de soluções digitais que
                simplificam o acesso à informação. A Aileron acredita que ferramentas bem projetadas podem resolver
                problemas reais — e a desinformação sobre direitos trabalhistas é um dos maiores problemas que
                o trabalhador brasileiro enfrenta.
              </p>
              <p className="mt-3">
                A equipe por trás da Rescisão Certa combina experiência em engenharia de software, design de produto
                e pesquisa em legislação trabalhista. Não somos um escritório de advocacia — somos uma empresa de
                tecnologia que construiu uma ferramenta educativa para democratizar o acesso a informações que antes
                exigiam consulta profissional.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">O que construímos e por quê</h2>
              <p>
                A Rescisão Certa é uma plataforma educativa e informativa que oferece uma calculadora gratuita de
                verbas rescisórias baseada na CLT atualizada. Nossa ferramenta foi desenvolvida para que qualquer
                trabalhador — independentemente de formação, condição financeira ou acesso a advogado — consiga
                entender o que deveria receber ao ser desligado.
              </p>
              <p className="mt-3">
                A calculadora leva em conta todas as variáveis que os sistemas de RH muitas vezes ignoram: o aviso
                prévio proporcional por tempo de serviço, a inclusão de horas extras e comissões habituais na base
                de cálculo das verbas, férias em dobro quando vencidas fora do prazo, e os diferentes cenários de
                desligamento previstos na CLT e na Reforma Trabalhista de 2017.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Nosso blog</h2>
              <p>
                Além da calculadora, mantemos um <strong>blog com dezenas de artigos técnicos</strong> sobre direitos
                trabalhistas — cobrindo temas como demissão sem justa causa, cálculo de FGTS, férias proporcionais e
                vencidas, aviso prévio proporcional, seguro-desemprego, adicional noturno, insalubridade, banco de
                horas, e muito mais.
              </p>
              <p className="mt-3">
                Todo o conteúdo é escrito com base na legislação vigente (CLT, súmulas do TST e leis complementares),
                sem juridiquês, para que o resultado do cálculo faça sentido e o trabalhador saiba o que fazer com
                essa informação. Os artigos são atualizados regularmente para refletir mudanças legislativas e novas
                interpretações dos tribunais.
              </p>
              <p className="mt-3">
                Acesse nosso blog em{" "}
                <a href="/" className="text-blue-600 hover:underline">rescisaocerta.com.br</a>{" "}
                e confira os artigos organizados por tema.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Nossa metodologia de cálculo</h2>
              <p>
                Todos os cálculos da plataforma são baseados diretamente na legislação trabalhista brasileira vigente,
                em especial:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Consolidação das Leis do Trabalho (CLT — Decreto-Lei nº 5.452/1943 e atualizações);</li>
                <li>Lei nº 13.467/2017 (Reforma Trabalhista) — regras do acordo entre partes;</li>
                <li>Lei nº 7.839/1989 e Constituição Federal — aviso prévio proporcional;</li>
                <li>Súmulas e Orientações Jurisprudenciais do Tribunal Superior do Trabalho (TST);</li>
                <li>Tabelas e alíquotas vigentes do INSS e IRRF para o ano-base.</li>
              </ul>
              <p className="mt-3">
                A metodologia é revisada sempre que há alterações legislativas relevantes ou publicação de
                novas súmulas do TST que impactem o cálculo de verbas rescisórias.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Transparência sobre limitações</h2>
              <p>
                Somos transparentes sobre o que nossa calculadora faz e o que ela não faz. Ela fornece uma estimativa
                fundamentada com base nas informações que o trabalhador nos passa. Não temos acesso à folha de
                pagamento da empresa, ao contracheque completo ou a documentos internos — por isso, os valores
                calculados são uma referência para comparação, não um número final definitivo.
              </p>
              <p className="mt-3">
                Casos com variáveis atípicas — como múltiplos contratos, afastamentos prolongados, categorias
                profissionais com convenção coletiva específica ou situações envolvendo rescisão indireta — podem
                ter particularidades que vão além do escopo desta ferramenta. Para esses casos, recomendamos sempre
                a consulta a um advogado trabalhista.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Nossa missão</h2>
              <p>
                Democratizar o acesso à informação sobre direitos trabalhistas no Brasil. Acreditamos que a
                desinformação é o principal motivo pelo qual tantos trabalhadores aceitam valores incorretos
                em suas rescisões. Nossa missão é eliminar essa barreira — oferecendo uma ferramenta gratuita,
                precisa e acessível que coloque o trabalhador em posição de igualdade na hora de conferir o
                que a empresa calculou.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Nossos valores</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Precisão:</strong> cálculos baseados na legislação vigente, revisados periodicamente.</li>
                <li><strong>Transparência:</strong> preços claros, limitações explicadas, sem letras miúdas.</li>
                <li><strong>Acessibilidade:</strong> ferramenta gratuita, sem cadastro obrigatório para o diagnóstico básico.</li>
                <li><strong>Compromisso social:</strong> cada trabalhador informado é um direito garantido.</li>
                <li><strong>Privacidade:</strong> dados tratados com responsabilidade, em conformidade com a LGPD.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Aviso legal</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-900 leading-relaxed space-y-2">
                <p>
                  Os cálculos, simulações e informações disponibilizados pela Rescisão Certa têm caráter{" "}
                  <strong>exclusivamente informativo e educacional</strong>. Não constituem assessoria jurídica,
                  consultoria legal, parecer técnico nem substituem a orientação de um advogado habilitado pela
                  Ordem dos Advogados do Brasil (OAB).
                </p>
                <p>
                  Os resultados são <strong>estimativas</strong> baseadas nas informações fornecidas pelo usuário
                  e na legislação trabalhista vigente (CLT, leis complementares e súmulas do TST). Valores reais
                  podem variar conforme as especificidades de cada contrato de trabalho, convenção ou acordo coletivo
                  da categoria, políticas internas da empresa, benefícios negociados e situação individual do
                  trabalhador.
                </p>
                <p>
                  A Rescisão Certa e a Aileron Tecnologia LTDA <strong>não se responsabilizam</strong>{" "}
                  por decisões tomadas exclusivamente com base nos cálculos e informações apresentados nesta
                  plataforma. Para decisões de natureza jurídica, financeira ou trabalhista, recomendamos a
                  consulta a um profissional qualificado.
                </p>
                <p>
                  O conteúdo editorial do blog e as explicações presentes na plataforma são produzidos com base
                  em fontes oficiais e legislação vigente, mas podem não refletir particularidades regionais,
                  interpretações judiciais específicas ou alterações legislativas posteriores à data de publicação.
                </p>
                <p>
                  Ao utilizar esta plataforma, o usuário declara estar ciente destas limitações e concorda com
                  os{" "}
                  <a href="/termos-de-uso" className="text-amber-700 underline underline-offset-2 hover:text-amber-800 font-medium">
                    Termos de Uso
                  </a>{" "}
                  e a{" "}
                  <a href="/politica-de-privacidade" className="text-amber-700 underline underline-offset-2 hover:text-amber-800 font-medium">
                    Política de Privacidade
                  </a>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">Informações da empresa</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1.5 text-sm text-gray-600">
                <p><strong>Razão Social:</strong> Aileron Tecnologia LTDA</p>
                <p><strong>CNPJ:</strong> 62.911.864/0001-12</p>
                <p><strong>Endereço:</strong> Setor SHN Quadra 2, Bloco F, Salas 625 e 626, Asa Norte, Brasília – DF</p>
                <p><strong>E-mail:</strong>{" "}
                  <a href="mailto:suporterescisaocerta@gmail.com" className="text-blue-600 hover:underline">
                    suporterescisaocerta@gmail.com
                  </a>
                </p>
                <p><strong>Atendimento:</strong> Todos os dias, das 08h às 18h</p>
              </div>
            </section>

            <div className="mt-8">
              <AdBanner slot="9999999991" format="auto" className="" />
            </div>

          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
