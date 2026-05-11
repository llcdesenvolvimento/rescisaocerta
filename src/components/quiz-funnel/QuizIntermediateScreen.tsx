import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Clock } from "lucide-react";

interface QuizIntermediateScreenProps {
  onContinue: () => void;
}

export function QuizIntermediateScreen({ onContinue }: QuizIntermediateScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-[460px] animate-fade-scale-in">

          <div className="relative bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">

            {/* Glow decorativo */}
            <div className="absolute -top-24 -right-24 w-56 h-56 bg-primary/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-success/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative px-6 sm:px-8 py-7 sm:py-8 text-center space-y-5">

              {/* Badge de confirmação */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/25">
                <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-success uppercase tracking-wider">
                  Suas respostas foram salvas
                </span>
              </div>

              {/* Headline simples */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-foreground leading-[1.15] tracking-tight">
                  Agora, vamos coletar algumas informações que podem{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    aumentar
                  </span>{" "}
                  o valor da sua rescisão.
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  São perguntas sobre o seu dia a dia de trabalho: horas extras, adicionais, desvio de função e outros pontos que costumam ficar de fora da conta da empresa, <strong className="text-foreground">e que costumam aumentar bastante o valor da sua rescisão.</strong>
                </p>
              </div>

              {/* CTA */}
              <Button
                onClick={onContinue}
                className="w-full h-14 rounded-2xl font-extrabold text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
              >
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Microcopy */}
              <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                Menos de 1 minuto · 100% gratuito
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
