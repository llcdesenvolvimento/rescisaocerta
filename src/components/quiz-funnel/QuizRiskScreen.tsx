import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, AlertTriangle, Search } from "lucide-react";

const RISK_STORAGE_KEY = "rescisao-risk-values";
const RISK_HASH_KEY = "rescisao-risk-hash";

function computeFormHash(formData: Record<string, unknown>): string {
  const relevantFields = [
    'salarioFixo', 'dataAdmissao', 'dataDesligamento', 'tipoDesligamento',
    'mediaVariavel', 'temVariavel', 'periodosFeriasVencidas', 'mesesDesdeUltimaFerias',
    'mesesTrabalhados2026', 'tipoAvisoPrevio', 'anosServico', 'saldoFGTS',
    'faziaHorasExtras', 'bancoHoras', 'controlePonto', 'exerciaFuncoesDiferentes',
    'funcoesDiferentes', 'valorPorFora', 'adicionaisTrabalho', 'erroNaRescisao',
  ];
  const subset = relevantFields.map(f => `${f}:${JSON.stringify(formData[f] ?? '')}`).join('|');
  return subset.split("").reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0).toString(36);
}

function generateRiskValues(hash: string) {
  const numHash = Math.abs(hash.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const allowedPercents = [68, 69, 71, 72, 73, 74, 76, 77, 78, 79, 81, 82, 83, 84];
  return {
    riskPercent: allowedPercents[numHash % allowedPercents.length],
    casosAnalisados: 98 + (numHash % 201),
  };
}

interface QuizRiskScreenProps {
  sessionId: string;
  formData?: Record<string, unknown>;
  pontosAtencao?: number;
  onContinue: () => void;
  onBack?: () => void;
}

export function QuizRiskScreen({ sessionId, formData, pontosAtencao = 3, onContinue, onBack }: QuizRiskScreenProps) {
  const [animationProgress, setAnimationProgress] = useState(0);

  const { riskPercent } = useMemo(() => {
    if (formData && Object.keys(formData).length > 0) {
      const currentHash = computeFormHash(formData);
      const savedHash = sessionStorage.getItem(RISK_HASH_KEY);

      if (savedHash === currentHash) {
        const saved = sessionStorage.getItem(RISK_STORAGE_KEY);
        if (saved) {
          try { return JSON.parse(saved); } catch { /* ignore */ }
        }
      }

      const values = generateRiskValues(currentHash);
      sessionStorage.setItem(RISK_HASH_KEY, currentHash);
      sessionStorage.setItem(RISK_STORAGE_KEY, JSON.stringify(values));
      return values;
    }

    const saved = sessionStorage.getItem(RISK_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }

    const values = generateRiskValues(sessionId);
    sessionStorage.setItem(RISK_STORAGE_KEY, JSON.stringify(values));
    return values;
  }, [sessionId, formData]);

  // Animação suave do gauge
  useEffect(() => {
    setAnimationProgress(0);
    const duration = 1400;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimationProgress(eased);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [riskPercent]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const currentPercent = riskPercent * animationProgress;
  const dashOffset = circumference - (currentPercent / 100) * circumference;
  const showCTA = animationProgress >= 0.95;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {onBack && (
        <div className="container mx-auto px-4 pt-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-[480px] animate-fade-in">

          {/* Card principal */}
          <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">

            {/* Faixa superior — alerta */}
            <div className="bg-destructive/10 border-b border-destructive/15 px-5 py-2.5 flex items-center justify-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
              <span className="text-[11px] sm:text-xs font-bold text-destructive uppercase tracking-wider">
                Atenção: pontos críticos identificados
              </span>
            </div>

            <div className="px-5 sm:px-7 pt-7 pb-6 text-center">

              {/* Headline FOMO */}
              <h1 className="text-xl sm:text-[26px] font-extrabold text-foreground leading-[1.15] tracking-tight mb-6">
                Sua rescisão tem{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  alta chance
                </span>{" "}
                de ter valores a mais a receber
              </h1>

              {/* Gauge */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 mx-auto mb-5">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="url(#riskGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                  />
                  <defs>
                    <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.65" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl font-black text-foreground tabular-nums leading-none">
                    {Math.round(currentPercent)}<span className="text-2xl sm:text-3xl text-primary">%</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-1.5 text-center leading-tight">
                    chance de
                    <br />
                    valores extras
                  </span>
                </div>
              </div>

              {/* Box destacado — pontos identificados (FOMO personalizado) */}
              <div className="relative rounded-2xl p-[2px] mb-5 bg-gradient-to-br from-primary via-primary/80 to-primary/40 shadow-lg shadow-primary/20">
                <div className="bg-card rounded-[14px] px-4 py-3.5 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Search className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-0.5">
                        No seu caso
                      </p>
                      <p className="text-sm text-foreground leading-snug">
                        Identificamos <strong className="text-primary font-extrabold">{pontosAtencao} pontos</strong> que podem aumentar o valor da sua rescisão.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Microcredibilidade — bullets compactos */}
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-center gap-2.5">
                  <span className="text-base leading-none flex-shrink-0" aria-hidden="true">💼</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">
                    Cada centavo conferido pelas regras da <strong className="text-foreground">CLT de 2026</strong>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-base leading-none flex-shrink-0" aria-hidden="true">🎯</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">
                    Entenda <strong className="text-foreground">tudo que você tem direito</strong> a receber
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-base leading-none flex-shrink-0" aria-hidden="true">🤝</span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">
                    Pronto pra <strong className="text-foreground">levar pra empresa ou advogado</strong>
                  </span>
                </li>
              </ul>

              {/* CTA */}
              <Button
                onClick={onContinue}
                size="lg"
                className={`group w-full h-14 rounded-2xl text-base font-extrabold shadow-lg shadow-primary/30 transition-all duration-300 active:scale-[0.98] bg-gradient-to-r from-primary to-primary/85 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 ${
                  showCTA ? "opacity-100 translate-y-0" : "opacity-60 translate-y-1"
                }`}
              >
                Ver meu resultado completo
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-[11px] text-muted-foreground mt-3">
                Detalhamento verba por verba na próxima tela
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
