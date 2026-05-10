import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog-posts";

interface RelatedPostsProps {
  slugs: string[];
  title?: string;
}

export function RelatedPosts({ slugs, title = "Leia também" }: RelatedPostsProps) {
  const posts = slugs
    .map((slug) => BLOG_POSTS.find((p) => p.slug === slug))
    .filter(Boolean) as typeof BLOG_POSTS;

  if (posts.length === 0) return null;

  return (
    <div className="my-8 rounded-xl border border-primary/15 bg-primary/5 p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">{title}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group flex items-start gap-3 rounded-lg bg-white border border-gray-200 p-3 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <img
              src={post.imagem}
              alt={post.titulo}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              loading="lazy"
              width={64}
              height={64}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {post.titulo}
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mt-1.5">
                Ler artigo <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
