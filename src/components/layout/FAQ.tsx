import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Shield, Clock, FileCheck, Scale, Users, TrendingUp, Award } from "lucide-react";

const faqItems = [
  {
    icon: Shield,
    question: "O cálculo feito aqui é confiável?",
    answer:
      "Sim! Nossos cálculos seguem rigorosamente a CLT e as orientações do TST. Utilizamos as mesmas fórmulas aplicadas por advogados trabalhistas e peritos judiciais em processos reais. Mais de 80.000 trabalhadores já confiaram em nossa ferramenta.",
  },
  {
    icon: Clock,
    question: "Quanto tempo leva para ter o resultado?",
    answer:
      "O cálculo é instantâneo! Em menos de 2 minutos você terá uma visão completa de todos os seus direitos rescisórios, incluindo saldo de salário, férias proporcionais, 13º salário, FGTS e multa rescisória.",
  },
  {
    icon: TrendingUp,
    question: "Quanto posso descobrir que tenho a receber?",
    answer:
      "A maioria dos trabalhadores descobre diferenças entre R$ 500 e R$ 15.000 a seu favor. Valores não pagos de horas extras, adicionais e verbas rescisórias incorretas são os principais responsáveis por essas diferenças.",
  },
  {
    icon: FileCheck,
    question: "Quais verbas rescisórias são calculadas?",
    answer:
      "Calculamos todas as verbas previstas em lei: saldo de salário, aviso prévio (trabalhado ou indenizado), férias vencidas e proporcionais + 1/3, 13º salário proporcional, FGTS + multa de 40%, além de adicionais como insalubridade, periculosidade e horas extras quando aplicável.",
  },
  {
    icon: Award,
    question: "O que vou receber no relatório completo?",
    answer:
      "Você receberá: diagnóstico detalhado do seu contrato, cálculo de cada verba separadamente, identificação de irregularidades, comparativo do que deveria receber vs. o que recebeu, e um plano de ação claro com os próximos passos.",
  },
  {
    icon: Scale,
    question: "O que faço se descobrir que recebi menos do que deveria?",
    answer:
      "Se identificarmos diferença nos valores, você terá um diagnóstico claro do que está faltando. Recomendamos: 1) Reunir seus documentos (TRCT, holerites, carteira de trabalho); 2) Conferir os valores com a empresa; 3) Se necessário, procurar orientação jurídica especializada com os dados que fornecemos.",
  },
  {
    icon: Users,
    question: "Por que devo usar o Rescisão Certa?",
    answer:
      "Porque conhecimento é poder. Muitos trabalhadores deixam de receber valores que têm direito por desconhecimento. Nossa missão é democratizar o acesso à informação trabalhista, ajudando você a entender exatamente o que deve receber e identificar possíveis irregularidades.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mb-5">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Dúvidas Frequentes</h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Entenda como o Rescisão Certa pode te ajudar a garantir seus direitos trabalhistas
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <AccordionTrigger className="text-left font-semibold text-slate-800 hover:text-blue-600 py-4 px-4 sm:px-5 gap-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm sm:text-base leading-snug">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-4 px-4 sm:px-5 pl-[3.75rem] leading-relaxed text-sm sm:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <p className="text-center text-xs text-slate-500 mt-8">
          Entenda exatamente quais são seus direitos trabalhistas e esteja preparado para receber tudo o que é seu por
          direito.
        </p>
      </div>
    </section>
  );
}
