import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackLink } from "@/components/BackLink";
import { SEOHead } from "@/components/SEOHead";
import { AdBanner } from "@/components/AdBanner";

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead title="Política de Privacidade" description="Política de privacidade da Rescisão Certa. Saiba como protegemos seus dados pessoais conforme a LGPD." canonical="https://rescisaocerta.com.br/politica-de-privacidade" />
      <Header />

      <main className="flex-1 py-8 px-4">
        <article className="max-w-2xl mx-auto">
          <BackLink />

          <h1 className="text-xl font-bold text-gray-900 mb-1">Política de Privacidade</h1>
          <p className="text-xs text-gray-400 mb-8">Última atualização: 05 de março de 2026</p>

          <div className="prose-sm text-gray-600 leading-relaxed space-y-6 text-sm">
            <p>
              A LLC Desenvolvimento Digital LTDA ("Rescisão Certa", "nós"), inscrita no CNPJ sob o nº 58.455.659/0001-12, 
              é a controladora dos dados pessoais tratados por meio desta plataforma. Esta Política de Privacidade descreve 
              como coletamos, utilizamos, armazenamos e protegemos suas informações pessoais, em conformidade com a 
              Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
            </p>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">1. Informações que Coletamos</h2>
              <p>Podemos coletar as seguintes categorias de informações:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Dados de identificação:</strong> nome, e-mail e CPF (quando fornecidos voluntariamente).</li>
                <li><strong>Dados trabalhistas:</strong> salário, datas de admissão e desligamento, tipo de rescisão, benefícios e demais informações inseridas para fins de cálculo.</li>
                <li><strong>Dados de navegação:</strong> endereço IP, tipo de dispositivo, navegador, páginas visitadas, tempo de permanência e cookies.</li>
                <li><strong>Dados de pagamento:</strong> informações necessárias para processar o pagamento via Pix (não armazenamos dados bancários completos).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">2. Finalidade do Tratamento</h2>
              <p>Utilizamos suas informações para:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Realizar os cálculos de verbas rescisórias solicitados;</li>
                <li>Gerar relatórios personalizados com base nas informações fornecidas;</li>
                <li>Processar pagamentos de serviços contratados;</li>
                <li>Enviar comunicações relacionadas ao serviço contratado;</li>
                <li>Melhorar a experiência do usuário e a qualidade dos nossos serviços;</li>
                <li>Cumprir obrigações legais e regulatórias;</li>
                <li>Prevenir fraudes e garantir a segurança da Plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">3. Base Legal para o Tratamento</h2>
              <p>O tratamento dos seus dados pessoais é realizado com base nas seguintes hipóteses legais previstas na LGPD:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Consentimento:</strong> quando você fornece voluntariamente suas informações na Plataforma;</li>
                <li><strong>Execução de contrato:</strong> para a prestação dos serviços contratados;</li>
                <li><strong>Legítimo interesse:</strong> para melhorias na Plataforma e comunicações pertinentes;</li>
                <li><strong>Cumprimento de obrigação legal:</strong> quando exigido pela legislação vigente.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">4. Compartilhamento de Informações</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. 
                Podemos compartilhar informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Com prestadores de serviço essenciais (processadores de pagamento, provedores de hospedagem) que atuam sob nossas instruções e em conformidade com esta Política;</li>
                <li>Quando exigido por ordem judicial ou determinação de autoridade competente;</li>
                <li>Para proteção dos nossos direitos, propriedade ou segurança.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">5. Armazenamento e Segurança</h2>
              <p>
                Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso 
                não autorizado, perda, alteração ou destruição. Seus dados são armazenados em servidores seguros com 
                criptografia e controles de acesso. Os dados são retidos pelo período necessário ao cumprimento 
                das finalidades descritas nesta Política ou conforme exigido pela legislação aplicável.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">6. Cookies e Publicidade</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar a experiência de navegação, analisar o tráfego
                e personalizar conteúdo. Você pode gerenciar as preferências de cookies por meio das configurações do
                seu navegador. O bloqueio de cookies pode afetar a funcionalidade de alguns recursos da Plataforma.
              </p>
              <p className="mt-2">
                Esta plataforma utiliza o <strong>Google AdSense</strong> para exibir anúncios publicitários. O Google
                pode usar cookies para exibir anúncios com base em visitas anteriores dos usuários ao nosso site ou a
                outros sites na internet. O uso de cookies de publicidade pelo Google permite que ele e seus parceiros
                exibam anúncios para os nossos usuários com base na visita a este e/ou a outros sites. Os usuários podem
                desativar os anúncios personalizados acessando as{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Configurações de anúncios do Google
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">7. Seus Direitos (LGPD)</h2>
              <p>Em conformidade com a LGPD, você possui os seguintes direitos:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Confirmação da existência de tratamento;</li>
                <li>Acesso aos dados pessoais;</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
                <li>Portabilidade dos dados;</li>
                <li>Eliminação dos dados tratados com consentimento;</li>
                <li>Informação sobre compartilhamento com terceiros;</li>
                <li>Revogação do consentimento.</li>
              </ul>
              <p className="mt-2">
                Para exercer seus direitos, entre em contato pelo e-mail:{" "}
                <a href="mailto:suporterescisaocerta@gmail.com" className="text-blue-600 hover:underline">suporterescisaocerta@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">8. Menores de Idade</h2>
              <p>
                A Plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente dados pessoais 
                de menores. Caso identifiquemos que dados de um menor foram coletados, procederemos à sua exclusão.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">9. Alterações nesta Política</h2>
              <p>
                Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento. As alterações 
                entram em vigor a partir da publicação da versão revisada na Plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">10. Contato / Encarregado de Dados (DPO)</h2>
              <p>
                Para questões relacionadas à proteção de dados pessoais, entre em contato pelo e-mail:{" "}
                <a href="mailto:suporterescisaocerta@gmail.com" className="text-blue-600 hover:underline">suporterescisaocerta@gmail.com</a>
              </p>
            </section>

            {/* AdSense */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <AdBanner slot="9999999994" format="auto" className="" />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}