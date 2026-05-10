import { Logo } from "./Logo";
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

        {/* Logo + Sobre */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="flex justify-center mb-4">
            <Logo variant="light" size="lg" />
          </div>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-md mx-auto">
            Plataforma educativa dedicada a ajudar trabalhadores brasileiros a entenderem seus direitos na rescisão do contrato de trabalho.
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

        {/* Divisor + Aviso Legal */}
        <div className="border-t border-white/10 pt-5 sm:pt-6 space-y-3">
          <p className="text-[10px] sm:text-[11px] text-white/40 leading-relaxed">
            <strong className="text-white/50">⚠ Aviso Legal:</strong> Os cálculos e informações têm caráter exclusivamente informativo e educacional, baseados na CLT, súmulas do TST e leis complementares. Não configuram assessoria jurídica nem substituem a orientação de um advogado habilitado pela OAB. Valores reais podem variar conforme convenção coletiva e situação individual. Ao utilizar esta plataforma, o usuário concorda com os{" "}
            <Link to="/termos-de-uso" className="text-white/55 underline underline-offset-2 hover:text-white/80">Termos de Uso</Link>{" "}
            e a{" "}
            <Link to="/politica-de-privacidade" className="text-white/55 underline underline-offset-2 hover:text-white/80">Política de Privacidade</Link>.
          </p>
          <p className="text-[10px] sm:text-xs text-white/25">
            © {new Date().getFullYear()} Rescisão Certa · LLC Desenvolvimento Digital LTDA · CNPJ 58.455.659/0001-12
          </p>
        </div>

      </div>
    </footer>
  );
}
