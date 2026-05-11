import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackLink } from "@/components/BackLink";
import { SEOHead } from "@/components/SEOHead";
import { AdBanner } from "@/components/AdBanner";

export default function TermosDeUso() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead title="Termos de Uso" description="Termos de uso da Rescisão Certa. Conheça as condições de utilização da calculadora de rescisão trabalhista." canonical="https://rescisaocerta.com.br/termos-de-uso" />
      <Header />

      <main className="flex-1 py-8 px-4">
        <article className="max-w-2xl mx-auto">
          <BackLink />

          <h1 className="text-xl font-bold text-gray-900 mb-1">Termos de Uso</h1>
          <p className="text-xs text-gray-400 mb-8">Última atualização: 05 de março de 2026</p>

          <div className="prose-sm text-gray-600 leading-relaxed space-y-6 text-sm">
            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e utilizar a plataforma Rescisão Certa ("Plataforma"), operada pela Aileron Tecnologia LTDA, 
                inscrita no CNPJ sob o nº 62.911.864/0001-12, com sede no Setor SHN Quadra 2, Bloco F, Salas 625 e 626, Asa Norte, 
                Brasília – DF, você declara estar de acordo com estes Termos de Uso. Caso não concorde com qualquer disposição, 
                recomendamos que não utilize a Plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">2. Descrição do Serviço</h2>
              <p>
                A Rescisão Certa é uma plataforma de tecnologia que oferece ferramentas de cálculo e simulação de verbas rescisórias 
                trabalhistas com base nas informações fornecidas pelo usuário. A Plataforma gera relatórios automatizados que 
                auxiliam o trabalhador a compreender seus direitos na rescisão do contrato de trabalho.
              </p>
              <p className="mt-2">
                <strong>Importante:</strong> Os serviços prestados possuem caráter exclusivamente informativo 
                e educacional. A Plataforma não substitui a orientação de um advogado e não configura prestação de serviço jurídico, 
                assessoria ou consultoria legal.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">3. Cadastro e Responsabilidades do Usuário</h2>
              <p>
                O usuário é responsável pela veracidade e exatidão das informações fornecidas à Plataforma. Dados incorretos ou 
                incompletos podem resultar em cálculos imprecisos. A Rescisão Certa não se responsabiliza por decisões tomadas 
                com base em informações incorretamente inseridas pelo usuário.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">4. Serviços Pagos e Preços</h2>
              <p>
                A Plataforma oferece serviços gratuitos (como o quiz de diagnóstico) e serviços pagos (como o relatório completo 
                de rescisão). Os preços são exibidos de forma clara antes da confirmação do pagamento. Todos os pagamentos são 
                processados de forma segura via Pix.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">5. Política de Reembolso</h2>
              <p>A Rescisão Certa oferece garantia de satisfação. O reembolso pode ser solicitado nas seguintes condições:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Prazo:</strong> Até 7 (sete) dias corridos após a data do pagamento, conforme previsto no Código de Defesa do Consumidor (art. 49).</li>
                <li><strong>Como solicitar:</strong> Por e-mail para suporterescisaocerta@gmail.com, informando nome completo, e-mail utilizado na compra e o motivo.</li>
                <li><strong>Processamento:</strong> Após análise, o reembolso será processado em até 10 (dez) dias úteis, pelo mesmo meio de pagamento original.</li>
                <li><strong>Exceções:</strong> Não serão concedidos reembolsos após o prazo de 7 dias ou quando o serviço já tenha sido integralmente entregue e utilizado.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">6. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da Plataforma, incluindo textos, gráficos, logotipos, ícones, imagens, algoritmos de cálculo e 
                software, é propriedade da Aileron Tecnologia LTDA ou de seus licenciadores, protegido pelas leis 
                brasileiras de propriedade intelectual. É proibida a reprodução, distribuição ou modificação sem autorização prévia.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">7. Limitação de Responsabilidade</h2>
              <p>
                A Rescisão Certa não garante resultados específicos decorrentes do uso da Plataforma. Os cálculos e relatórios 
                são gerados com base nos parâmetros legais vigentes e nas informações fornecidas pelo usuário, podendo haver 
                variações em relação aos valores efetivamente devidos pelo empregador. A Plataforma não se responsabiliza por 
                perdas ou danos decorrentes de decisões tomadas com base exclusivamente nos relatórios gerados.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">8. Disponibilidade do Serviço</h2>
              <p>
                A Rescisão Certa se esforça para manter a Plataforma disponível 24 horas por dia, 7 dias por semana. No entanto, 
                não garantimos disponibilidade ininterrupta, podendo ocorrer manutenções programadas ou interrupções técnicas.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">9. Modificações dos Termos</h2>
              <p>
                A Rescisão Certa reserva-se o direito de modificar estes Termos de Uso a qualquer momento, mediante publicação 
                da versão atualizada na Plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">10. Legislação Aplicável e Foro</h2>
              <p>
                Estes Termos de Uso são regidos pela legislação brasileira. Fica eleito o foro da comarca de Brasília/DF para 
                dirimir quaisquer controvérsias decorrentes deste instrumento, com renúncia a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-800 mb-2">11. Contato</h2>
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail:{" "}
                <a href="mailto:suporterescisaocerta@gmail.com" className="text-blue-600 hover:underline">
                  suporterescisaocerta@gmail.com
                </a>
              </p>
            </section>

            {/* AdSense */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <AdBanner slot="9999999993" format="auto" className="" />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}