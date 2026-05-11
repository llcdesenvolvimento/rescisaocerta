import { Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Blog" },
  { to: "/test", label: "Calculadora" },
  { to: "/sobre-nos", label: "Sobre Nós" },
  { to: "/contato", label: "Contato" },
];

const LEGAL_LINKS = [
  { to: "/termos-de-uso", label: "Termos de Uso" },
  { to: "/politica-de-privacidade", label: "Política de Privacidade" },
];

export function Footer() {
  return (
    <footer className="pt-10 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6" style={{ backgroundColor: "#080d1a" }}>
      <div className="max-w-5xl mx-auto">

        {/* Nome da marca no topo (alinhado com a coluna Navegação) */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Rescisão Certa
          </p>
        </div>

        {/* Grid 3 colunas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 mb-8 sm:mb-10">

          {/* Navegação */}
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest mb-3">Navegação</p>
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="block text-xs sm:text-sm text-white/70 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest mb-3">Legal</p>
            <div className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="block text-xs sm:text-sm text-white/70 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Suporte */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest mb-3">Suporte</p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-white/70">Todos os dias, 08h – 21h</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                <a href="mailto:suporterescisaocerta@gmail.com" className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors break-all">
                  suporterescisaocerta@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divisor + Copyright */}
        <div className="border-t border-white/10 pt-5 sm:pt-6 space-y-1">
          <p className="text-xs sm:text-sm text-white/80 font-medium">
            © {new Date().getFullYear()} Rescisão Certa · Aileron Tecnologia LTDA
          </p>
          <p className="text-xs sm:text-sm text-white/70">
            CNPJ 62.911.864/0001-12
          </p>
          <p className="text-xs sm:text-sm text-white/70">
            Sitio Shn Quadra 2 Bloco F SN Sala 625 e 626, Asa Norte, Brasília, DF
          </p>
        </div>

      </div>
    </footer>
  );
}
