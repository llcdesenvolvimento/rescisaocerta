import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { TrendingDown, Search, ChevronRight, AlertCircle, ShieldCheck, Clock, ArrowLeft } from "lucide-react";

interface QuizProblemScreenProps {
  pontosAtencao: number;
  onContinue: () => void;
  onBack?: () => void;
}

export function QuizProblemScreen({ pontosAtencao, onContinue, onBack }: QuizProblemScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [showBlock1, setShowBlock1] = useState(false);
  const [showBlock2, setShowBlock2] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 100);
    const t2 = setTimeout(() => setShowBlock1(true), 400);
    const t3 = setTimeout(() => setShowBlock2(true), 700);
    const t4 = setTimeout(() => setShowCTA(true), 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-destructive/5 flex flex-col">
      <Header />

      {onBack && (
        <div className="container mx-auto px-4 pt-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      )}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-[480px]">
          {/* Título principal */}
          <div
            className={`transition-all duration-500 transform-gpu ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold mb-4">
                <AlertCircle className="w-3.5 h-3.5" />
                Dado importante
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                Você sabia que <span className="text-destructive">7 em cada 10 pessoas</span> aceitam valores errados na
                rescisão por não saber calcular seus direitos?
              </h1>
            </div>
          </div>

          {/* Bloco 1 - O que isso significa */}
          <div
            className={`transition-all duration-500 transform-gpu ${showBlock1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="bg-card border border-border rounded-2xl p-5 mb-4 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-[18px] h-[18px] text-destructive" />
                </div>
                <h2 className="text-[15px] font-semibold text-foreground">O que isso significa?</h2>
              </div>
              <div className="space-y-2.5 text-sm text-muted-foreground leading-relaxed pl-[46px]">
                <p>
                  Mesmo sem má-fé, <strong className="text-foreground">erros técnicos são comuns</strong> nos cálculos
                  de rescisão.
                </p>
                <p>
                  Pequenas falhas podem custar{" "}
                  <strong className="text-destructive font-semibold">centenas ou milhares de reais</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Bloco 2 - No seu caso (destacado) */}
          <div
            className={`transition-all duration-500 transform-gpu ${showBlock2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="relative rounded-2xl p-[2px] mb-6 bg-gradient-to-br from-primary via-primary/70 to-primary/40 shadow-lg shadow-primary/15">
              <div className="bg-card rounded-[14px] p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Search className="w-[18px] h-[18px] text-primary" />
                  </div>
                  <h2 className="text-[15px] font-bold text-primary">No seu caso</h2>
                </div>
                <p className="text-sm text-foreground leading-relaxed pl-[46px]">
                  Com base no que você informou e em rescisões similares, identificamos{" "}
                  <strong className="text-primary">{pontosAtencao} pontos</strong> que podem aumentar o valor da sua rescisão.
                </p>
              </div>
            </div>
          </div>

          {/* CTA melhorado */}
          <div
            className={`transition-all duration-300 transform-gpu ${showCTA ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <div className="space-y-3">
              <Button
                onClick={onContinue}
                size="lg"
                className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] bg-gradient-to-r from-primary to-primary/90 gap-2"
              >
                VER MEU RESULTADO COMPLETO
                <ChevronRight className="w-5 h-5" />
              </Button>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary/70" />
                  Resultado imediato
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
