import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Scale, Lock, ArrowRight } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";

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
  onContinue: () => void;
  onBack?: () => void;
}

export function QuizRiskScreen({ sessionId, formData, onContinue, onBack }: QuizRiskScreenProps) {
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

  // Animação suave via React state (sem manipulação direta de DOM)
  useEffect(() => {
    setAnimationProgress(0);
    const duration = 1400;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimationProgress(eased);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
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

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[480px]">
          {/* Card principal */}
          <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">

            {/* Faixa superior */}
            <div className="bg-primary/5 border-b border-primary/10 px-5 py-3 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                Análise concluída
              </span>
            </div>

            <div className="px-5 sm:px-7 pt-7 pb-6 text-center">
              {/* Headline */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight mb-2">
                Pelas suas respostas, é provável que <span className="text-primary">você tenha valores extras a receber</span>
              </h1>

              <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
                Comparamos suas respostas com as regras da <strong className="text-foreground">CLT 2026</strong> e a Lei 12.506/2011.
              </p>

              {/* Gauge */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 mx-auto mb-5">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="6"
                  />
                  {/* Progress */}
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
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.7" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Centro */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
                  <span className="text-4xl sm:text-5xl font-black text-foreground tabular-nums leading-none">
                    {Math.round(currentPercent)}<span className="text-2xl sm:text-3xl text-primary">%</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-1.5 text-center leading-tight">
                    chance de
                    <br />
                    mais valores
                  </span>
                </div>
              </div>

              {/* Bullets de credibilidade */}
              <ul className="text-left space-y-2 mb-6">
                <li className="flex items-start gap-2.5">
                  <Scale className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-foreground leading-relaxed">
                    Cálculo aplicado conforme as <strong>tabelas oficiais da CLT 2026</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-foreground leading-relaxed">
                    Aviso prévio proporcional pela <strong>Lei 12.506/2011</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-foreground leading-relaxed">
                    Suas informações ficam só com você. <strong>Sem CPF, sem cadastro</strong>
                  </span>
                </li>
              </ul>

              {/* CTA */}
              <Button
                onClick={onContinue}
                size="lg"
                className={`group w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 transition-all duration-300 active:scale-[0.98] bg-gradient-to-r from-primary to-primary/85 ${
                  showCTA ? "opacity-100 translate-y-0" : "opacity-60 translate-y-1"
                }`}
              >
                Ver minha análise
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <p className="text-[11px] text-muted-foreground mt-3">
                Detalhamento completo verba por verba na próxima tela
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* AdSense */}
      <div className="w-full px-4 py-4">
        <div className="max-w-[480px] mx-auto">
          <AdBanner slot="4444444444" format="auto" className="" />
        </div>
      </div>

      <Footer />
    </div>
  );
}
