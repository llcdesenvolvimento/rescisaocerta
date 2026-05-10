import { FileText, Calculator, Mail } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Preencha seus dados",
    description: "Informe os dados do seu contrato de trabalho em menos de 1 minuto",
  },
  {
    icon: Calculator,
    title: "Receba o cálculo",
    description: "Nossa calculadora processa suas informações e calcula todas as verbas",
  },
  {
    icon: Mail,
    title: "Receba por email",
    description: "O relatório completo com medidas para aumentar sua rescisão é enviado diretamente no seu email",
  },
];

export function ComoFunciona() {
  return (
    <section className="py-10 sm:py-16 px-4 bg-background">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Veja como é simples</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Em poucos passos você descobre o valor correto da sua rescisão
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Step number and icon */}
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-7 h-7 sm:w-9 sm:h-9 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-bold">
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>

              {/* Connector line (hidden on mobile, visible on larger screens) */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 left-[calc(50%+60px)] w-[calc(100%-120px)] h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}