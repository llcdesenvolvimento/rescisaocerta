import { Star, Quote } from "lucide-react";
interface Testimonial {
  name: string;
  location: string;
  initials: string;
  text: string;
  highlight: string;
  rating: number;
}
const testimonials: Testimonial[] = [{
  name: "Marcos R.",
  location: "Campinas, SP",
  initials: "MR",
  text: "Descobri que a empresa tinha calculado errado o aviso prévio e as férias proporcionais.",
  highlight: "Recebi R$ 2.340 a mais",
  rating: 5
}, {
  name: "Carla S.",
  location: "Contagem, MG",
  initials: "CS",
  text: "Quase assinei sem conferir. A análise mostrou que faltava multa do FGTS e reflexo das comissões.",
  highlight: "Consegui corrigir antes de assinar!",
  rating: 5
}, {
  name: "José A.",
  location: "Niterói, RJ",
  initials: "JA",
  text: "Trabalhei 6 anos na empresa e tinha horas extras não pagas. O relatório detalhou tudo.",
  highlight: "Minha rescisão aumentou R$ 4.850!",
  rating: 5
}, {
  name: "Amanda L.",
  location: "Londrina, PR",
  initials: "AL",
  text: "Fui demitida depois de 3 anos e achei que estava tudo certo. A conferência mostrou erro no cálculo do 13º.",
  highlight: "Recebi mais R$ 1.890!",
  rating: 5
}, {
  name: "Roberto M.",
  location: "Feira de Santana, BA",
  initials: "RM",
  text: "Trabalhava em turno noturno e nunca recebi adicional. A análise identificou tudo certinho.",
  highlight: "Consegui R$ 3.200 que não sabiam que deviam!",
  rating: 5
}, {
  name: "Fernanda C.",
  location: "Canoas, RS",
  initials: "FC",
  text: "Minha empresa pagava parte do salário por fora. Achei que tinha perdido esse valor, mas o relatório mostrou meus direitos.",
  highlight: "Recuperei R$ 5.400!",
  rating: 5
}, {
  name: "Paulo H.",
  location: "Juazeiro do Norte, CE",
  initials: "PH",
  text: "Fazia função diferente do meu registro há 2 anos. A conferência apontou que eu tinha direito a diferença salarial.",
  highlight: "A empresa pagou R$ 6.780 a mais!",
  rating: 5
}, {
  name: "Luciana T.",
  location: "Caruaru, PE",
  initials: "LT",
  text: "Nem sabia que tinha direito a férias vencidas de 2 anos atrás.",
  highlight: "Foram mais R$ 2.950 na minha rescisão!",
  rating: 5
}, {
  name: "Ricardo P.",
  location: "Goiânia, GO",
  initials: "RP",
  text: "Achei o relatório bem detalhado e fácil de entender. Me ajudou a conferir os valores antes de assinar.",
  highlight: "Recomendo para quem quer ter certeza",
  rating: 4
}, {
  name: "Sandra M.",
  location: "Joinville, SC",
  initials: "SM",
  text: "Trabalhava aos sábados sem receber hora extra. A análise detalhou todos os valores.",
  highlight: "Recebi mais R$ 4.120 na rescisão!",
  rating: 5
}, {
  name: "Giovana B.",
  location: "Cuiabá, MT",
  initials: "GB",
  text: "No meu caso não encontrou diferenças, mas foi bom conferir. O processo foi rápido e tranquilo.",
  highlight: "Pelo menos fiquei mais tranquila",
  rating: 4
}, {
  name: "Thiago S.",
  location: "Vitória, ES",
  initials: "TS",
  text: "Gostei do serviço. Achei o valor justo e o relatório me ajudou a entender melhor meus direitos.",
  highlight: "Valeu a pena conferir",
  rating: 4
}, {
  name: "Patrícia L.",
  location: "Campo Grande, MS",
  initials: "PL",
  text: "A empresa tinha errado no cálculo das férias proporcionais. O relatório mostrou exatamente o que faltava.",
  highlight: "Consegui corrigir e recebi R$ 1.560 a mais!",
  rating: 5
}];
const StarRating = ({
  rating
}: {
  rating: number;
}) => <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-2.5 h-2.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />)}
  </div>;
const TestimonialCard = ({
  testimonial
}: {
  testimonial: Testimonial;
}) => <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
    <div className="flex items-start gap-2.5">
      {/* Avatar com iniciais */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] font-bold text-white">{testimonial.initials}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        {/* Header com nome e estrelas */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-800">{testimonial.name}</span>
            <span className="text-[9px] text-slate-400">•</span>
            <span className="text-[9px] text-slate-400">{testimonial.location}</span>
          </div>
          <StarRating rating={testimonial.rating} />
        </div>
        
        {/* Texto do depoimento */}
        <div className="relative">
          <Quote className="absolute -left-0.5 -top-0.5 w-3 h-3 text-slate-200" />
          <p className="text-[10px] text-slate-600 leading-relaxed pl-3">
            {testimonial.text}{" "}
            <span className="font-bold text-primary">{testimonial.highlight}</span>
          </p>
        </div>
      </div>
    </div>
  </div>;
const OverallRating = () => <div className="flex items-center justify-center gap-2 mb-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg py-2 px-3 border border-amber-100">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => <Star key={i} className={`w-4 h-4 ${i <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400 text-amber-400"}`} style={i === 5 ? {
      clipPath: "inset(0 6% 0 0)"
    } : undefined} />)}
    </div>
    <span className="text-sm font-bold text-slate-800">4.94</span>
    <span className="text-xs text-slate-500">/5</span>
    <span className="text-[10px] text-slate-400 ml-1">(847 avaliações)</span>
  </div>;
export function Testimonials() {
  return <div className="space-y-2.5">
      <p className="text-[11px] text-slate-500 font-semibold text-center uppercase tracking-wide my-[10px]">
        O que dizem nossos usuários
      </p>

      <OverallRating />

      <div className="space-y-2">
        {testimonials.map((testimonial, index) => <TestimonialCard key={index} testimonial={testimonial} />)}
      </div>
    </div>;
}