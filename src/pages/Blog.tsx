import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { AdBanner } from "@/components/AdBanner";
import { ArrowRight, Clock, Star } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";

export { BLOG_POSTS };

const FEATURED_SLUGS = [
  "demissao-sem-justa-causa-direitos",
  "calculo-fgts-multa-rescisoria",
  "aviso-previo-proporcional-como-funciona",
];

const CATEGORIES = [
  { label: "Rescisão", slugs: ["demissao-sem-justa-causa-direitos", "pedido-de-demissao-o-que-voce-recebe", "rescisao-por-acordo-mutuo", "demissao-por-justa-causa-motivos", "rescisao-indireta-quando-cabe", "contrato-experiencia-rescisao"] },
  { label: "Verbas e Cálculos", slugs: ["calculo-fgts-multa-rescisoria", "ferias-proporcionais-vencidas-calculo", "decimo-terceiro-salario-calculo", "aviso-previo-proporcional-como-funciona", "verbas-rescisorias-o-que-sao", "calculo-salario-proporcional-dias-trabalhados", "plr-participacao-lucros-resultados"] },
  { label: "Adicionais", slugs: ["adicional-noturno-regras-calculo", "insalubridade-periculosidade-diferencas", "horas-extras-direitos-trabalhistas", "acumulo-desvio-funcao-direitos", "banco-de-horas-regras-2026"] },
  { label: "Proteções e Direitos", slugs: ["estabilidade-provisoria-quem-tem-direito", "licenca-maternidade-estabilidade-gestante", "assedio-moral-trabalho-como-agir", "trabalho-sem-carteira-assinada", "direitos-trabalhador-domestico", "direitos-estagiario-lei-estagio"] },
  { label: "Modalidades de Trabalho", slugs: ["contrato-intermitente-como-funciona", "trabalho-remoto-home-office-direitos", "vale-transporte-regras-desconto"] },
  { label: "Procedimentos", slugs: ["como-ler-trct-passo-a-passo", "prazo-pagamento-rescisao-multa", "homologacao-rescisao-quando-necessaria", "seguro-desemprego-como-solicitar", "como-entrar-acao-trabalhista", "reforma-trabalhista-principais-mudancas", "intervalo-intrajornada-direitos"] },
];

export default function Blog() {
  const featuredPosts = FEATURED_SLUGS.map(s => BLOG_POSTS.find(p => p.slug === s)).filter(Boolean) as typeof BLOG_POSTS;
  const remainingPosts = BLOG_POSTS.filter(p => !FEATURED_SLUGS.includes(p.slug));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead
        title="Blog — Direitos Trabalhistas e Rescisão | Rescisão Certa"
        description="Artigos completos sobre direitos trabalhistas, rescisão, FGTS, férias, aviso prévio e seguro-desemprego. Conteúdo baseado na CLT atualizada."
        canonical="https://rescisaocerta.com.br/"
      />
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Blog — Direitos Trabalhistas</h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Artigos completos sobre rescisão trabalhista, FGTS, férias, aviso prévio e seguro-desemprego.
            Conteúdo baseado na CLT atualizada e nas súmulas do TST.
          </p>

          {/* Intro editorial */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 sm:p-5 mb-8">
            <p className="text-sm text-gray-700 leading-relaxed">
              Todos os artigos abaixo são escritos com base na <strong>legislação trabalhista vigente</strong> e nas decisões mais recentes dos tribunais do trabalho. O objetivo é simples: dar ao trabalhador brasileiro acesso a informação clara, sem juridiquês, para que ele saiba exatamente o que tem direito a receber.
            </p>
          </div>

          {/* Featured posts */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-primary" />
              <h2 className="text-base font-bold text-gray-900">Artigos mais lidos</h2>
            </div>
            <div className="space-y-4">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}`}
                  className="block group bg-white border-2 border-primary/20 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <img
                    src={post.imagem}
                    alt={post.titulo}
                    className="w-full h-44 object-cover"
                    loading="lazy"
                    width={800}
                    height={512}
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                      <span>{post.dataFormatada}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.tempo} de leitura
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                      {post.titulo}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-3">
                      {post.resumo}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      Ler artigo <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <AdBanner slot="7070707070" format="auto" className="mb-8" />

          {/* Categories navigation */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-3">Navegue por tema</h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.label}
                  href={`#cat-${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {cat.label}
                </a>
              ))}
            </div>
          </div>

          {/* Posts by category */}
          {CATEGORIES.map((cat) => {
            const catPosts = cat.slugs.map(s => BLOG_POSTS.find(p => p.slug === s)).filter(Boolean) as typeof BLOG_POSTS;
            if (catPosts.length === 0) return null;
            return (
              <div key={cat.label} id={`cat-${cat.label.toLowerCase().replace(/\s+/g, '-')}`} className="mb-10 scroll-mt-20">
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">{cat.label}</h2>
                <div className="space-y-4">
                  {catPosts.map((post) => (
                    <Link
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      className="block group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex">
                        <img
                          src={post.imagem}
                          alt={post.titulo}
                          className="w-24 sm:w-32 h-auto object-cover flex-shrink-0"
                          loading="lazy"
                          width={128}
                          height={96}
                        />
                        <div className="p-3 sm:p-4 flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1">
                            {post.titulo}
                          </h3>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-1.5">
                            {post.resumo}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                            Ler <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <AdBanner slot="7070707071" format="auto" className="mb-10" />

          {/* Remaining posts that might not be in categories */}
          {remainingPosts.filter(p => !CATEGORIES.some(c => c.slugs.includes(p.slug))).length > 0 && (
            <div className="mb-10">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Mais artigos</h2>
              <div className="space-y-4">
                {remainingPosts.filter(p => !CATEGORIES.some(c => c.slugs.includes(p.slug))).map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="block group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all"
                  >
                    <img
                      src={post.imagem}
                      alt={post.titulo}
                      className="w-full h-40 object-cover"
                      loading="lazy"
                      width={800}
                      height={512}
                    />
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                        <span>{post.dataFormatada}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.tempo} de leitura
                        </span>
                      </div>
                      <h2 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                        {post.titulo}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-3">
                        {post.resumo}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        Ler artigo <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Blog editorial footer */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-2">Sobre nosso conteúdo</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-2">
              Todos os artigos do blog Rescisão Certa são elaborados com base na Consolidação das Leis do Trabalho (CLT), nas súmulas e orientações jurisprudenciais do Tribunal Superior do Trabalho (TST) e nas leis complementares aplicáveis.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              O conteúdo é atualizado regularmente para refletir mudanças legislativas e novas interpretações dos tribunais. Se você identificar alguma informação desatualizada, entre em <Link to="/contato" className="text-primary underline underline-offset-2 hover:text-primary/80">contato conosco</Link>.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
