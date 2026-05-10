import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Shuffle, AlertTriangle, Plus, CheckCircle2, Timer } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";

interface QuizIntermediateScreenProps {
  onContinue: () => void;
}

const ITEMS = [
  {
    icon: Clock,
    title: "Horas extras não pagas",
    desc: "Até 30 minutos a mais por dia, somados ao longo do contrato, viram milhares de reais.",
  },
  {
    icon: Shuffle,
    title: "Desvio de função",
    desc: "Quem faz tarefas de cargo superior ao registrado tem direito a diferença salarial.",
  },
  {
    icon: AlertTriangle,
    title: "Banco de horas irregular",
    desc: "Quando a compensação não bate, o saldo vira valor a receber.",
  },
  {
    icon: Plus,
    title: "Adicionais e outros",
    desc: "Noturno, insalubridade, periculosidade e verbas que costumam ficar de fora.",
  },
];

export function QuizIntermediateScreen({ onContinue }: QuizIntermediateScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-[480px] animate-fade-scale-in">
          {/* Card único */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">

            {/* Faixa de progresso no topo */}
            <div className="bg-success/10 border-b border-success/20 px-5 py-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                Verbas básicas calculadas. Falta a parte que pode pesar mais.
              </p>
            </div>

            <div className="p-5 sm:p-6 space-y-5">
              {/* Headline */}
              <div className="space-y-2 text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                  Agora vamos ver o que pode <span className="text-primary">aumentar sua rescisão</span>
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Em <strong className="text-foreground">7 a cada 10 casos</strong> a gente encontra valores ligados à rotina de trabalho que não entraram na conta da empresa.
                </p>
              </div>

              {/* Lista compacta */}
              <ul className="space-y-2">
                {ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border/60"
                    >
                      <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground leading-snug">{item.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* CTA + tempo */}
              <div className="space-y-2.5 pt-1">
                <Button
                  onClick={onContinue}
                  className="w-full h-12 rounded-xl font-semibold bg-primary active:scale-[0.98] text-base"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                  <Timer className="w-3.5 h-3.5 text-primary" />
                  Leva menos de 1 minuto
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* AdSense — abaixo da tela intermediária */}
      <div className="w-full px-4 py-4">
        <div className="max-w-[480px] mx-auto">
          <AdBanner slot="6666666666" format="auto" className="" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
