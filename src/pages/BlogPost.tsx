import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { AdBanner } from "@/components/AdBanner";
import { BLOG_POSTS } from "@/data/blog-posts";
import { Clock, ArrowRight } from "lucide-react";
import authorPhoto from "@/assets/author-eduarda.jpg";

function renderMarkdown(text: string) {
  const lines = text.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-base sm:text-lg font-bold text-gray-900 mt-8 mb-3 leading-snug">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-sm sm:text-base font-semibold text-gray-800 mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(
        <p key={key++} className="text-sm text-gray-700 font-semibold mt-3 mb-1">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i++;
      }
      i--;
      elements.push(
        <ul key={key++} className="list-disc pl-5 space-y-1.5 my-3">
          {items.map((item, j) => {
            const parts = item.split(/\*\*(.*?)\*\*/g);
            return (
              <li key={j} className="text-sm text-gray-600 leading-relaxed">
                {parts.map((part, pi) =>
                  pi % 2 === 1 ? (
                    <strong key={pi} className="text-gray-700">{part}</strong>
                  ) : (
                    part
                  )
                )}
              </li>
            );
          })}
        </ul>
      );
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      i--;
      elements.push(
        <div key={key++} className="overflow-x-auto my-5">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <tbody>
            {tableLines.map((row, ri) => {
              const cells = row.split("|").filter((c) => c.trim() !== "");
              if (row.includes("---")) return null;
              return (
                <tr key={ri} className={ri === 0 ? "bg-gray-100" : "border-t border-gray-200"}>
                  {cells.map((cell, ci) => (
                    ri === 0
                      ? <th key={ci} className="px-3 py-2 text-left font-semibold text-gray-700">{cell.trim()}</th>
                      : <td key={ci} className="px-3 py-2 text-gray-600">{cell.trim()}</td>
                  ))}
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      );
    } else if (line.trim() === "") {
      // skip
    } else {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <p key={key++} className="text-sm text-gray-600 leading-relaxed my-2">
          {parts.map((part, pi) =>
            pi % 2 === 1 ? (
              <strong key={pi} className="text-gray-800 font-semibold">{part}</strong>
            ) : (
              part
            )
          )}
        </p>
      );
    }
  }
  return elements;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16 text-center">
          <div>
            <p className="text-gray-500 mb-4">Artigo não encontrado.</p>
            <Link to="/" className="text-primary text-sm font-semibold hover:underline">
              Ver todos os artigos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const outros = BLOG_POSTS.filter((p) => p.slug !== slug);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead
        title={`${post.titulo} | Rescisão Certa`}
        description={post.resumo}
        canonical={`https://rescisaocerta.com.br/blog/${post.slug}`}
      />
      <Header />

      <main className="flex-1 py-8 px-4">
        <article className="max-w-2xl mx-auto">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
            ← Voltar ao blog
          </Link>

          {/* Author byline */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={authorPhoto}
              alt="Eduarda Leite"
              className="w-10 h-10 rounded-full object-cover"
              width={40}
              height={40}
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">Eduarda Leite</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{post.dataFormatada}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.tempo} de leitura
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-snug">
            {post.titulo}
          </h1>

          <p className="text-sm text-gray-500 leading-relaxed mb-6 border-l-4 border-primary/30 pl-4">
            {post.resumo}
          </p>

          <img
            src={post.imagem}
            alt={post.titulo}
            className="w-full h-48 sm:h-64 object-cover rounded-lg mb-8"
            width={800}
            height={512}
          />

          <AdBanner slot="8080808080" format="auto" className="mb-8" />

          <div className="prose-content">
            {renderMarkdown(post.conteudo)}
          </div>

          <AdBanner slot="8080808081" format="auto" className="mt-8" />

          {/* Author bio box */}
          <div className="mt-10 p-5 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-4">
            <img
              src={authorPhoto}
              alt="Eduarda Leite"
              className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              width={56}
              height={56}
            />
            <div>
              <p className="text-sm font-bold text-gray-900 mb-1">Escrito por Eduarda Leite</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Brasiliense natural de Taguatinga, Eduarda é especialista em Recursos Humanos com foco em legislação trabalhista e gestão de pessoas. Atua como editora-chefe do Portal do Trabalhador, onde transforma a complexidade da CLT em conteúdo acessível e prático para trabalhadores de todo o Brasil.
              </p>
            </div>
          </div>

          {/* Sitelinks — todos os outros artigos */}
          {outros.length > 0 && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-base font-bold text-gray-900 mb-5">Leia também</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {outros.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}`}
                    className="flex gap-3 group border border-gray-100 rounded-lg p-3 hover:border-primary/30 hover:bg-gray-50 transition-all"
                  >
                    <img
                      src={p.imagem}
                      alt={p.titulo}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                      loading="lazy"
                      width={64}
                      height={64}
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">{p.dataFormatada}</p>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {p.titulo}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </article>
      </main>

      <Footer />
    </div>
  );
}
