import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import { 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ClipboardList, 
  Scale,
  Calculator,
  Shield,
  FileSearch,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportLoaderProps {
  open: boolean;
  onComplete: () => void;
}

const ANALYSIS_STEPS = [
  { icon: ClipboardList, label: "Validando dados do contrato" },
  { icon: Calculator, label: "Calculando verbas rescisórias" },
  { icon: FileSearch, label: "Analisando direitos extras" },
  { icon: Scale, label: "Comparando com jurisprudência" },
  { icon: FileText, label: "Gerando relatório personalizado" },
];

const STEP_DURATION = 1200; // 1.2s por step para ~6s total

export function ReportLoader({ open, onComplete }: ReportLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      // Reset state when closed
      setCurrentStep(0);
      setProgress(0);
      hasCompletedRef.current = false;
      return;
    }

    // Prevent double execution
    if (hasCompletedRef.current) return;

    const totalSteps = ANALYSIS_STEPS.length;
    const totalDuration = totalSteps * STEP_DURATION;
    const startTime = Date.now();

    // Progress bar animation - smooth linear progression
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      // Calculate current step based on elapsed time
      const stepIndex = Math.min(
        Math.floor(elapsed / STEP_DURATION),
        totalSteps - 1
      );
      setCurrentStep(stepIndex);

      // Complete when done
      if (elapsed >= totalDuration && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        clearInterval(progressInterval);
        setProgress(100);
        setCurrentStep(totalSteps - 1);
        
        // Small delay before completing
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [open, onComplete]);

  const CurrentIcon = ANALYSIS_STEPS[currentStep]?.icon || FileText;

  return (
    <Dialog open={open}>
      <DialogContent
        className="w-[calc(100vw-32px)] max-w-md p-0 border-0 rounded-2xl shadow-2xl overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Gerando Relatório</DialogTitle>
        </VisuallyHidden>

        {/* Header com gradiente */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 px-6 py-6 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            {/* Ícone animado */}
            <div className="relative inline-flex items-center justify-center mb-4">
              <div className="absolute inset-0 w-20 h-20 rounded-full bg-white/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                <CurrentIcon className="h-10 w-10 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-black text-white mb-1">Analisando seu caso</h2>
            <p className="text-sm text-white/80">
              Etapa {currentStep + 1} de {ANALYSIS_STEPS.length}
            </p>
          </div>
        </div>

        {/* Aviso importante */}
        <div className="px-6 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-300">
              <span className="font-semibold">Importante:</span> O carregamento pode levar até 2 minutos. 
              Por favor, <span className="font-semibold">não saia ou atualize</span> a página.
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="px-6 py-4 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 mb-2">
            <span className="font-medium">Progresso da análise</span>
            <span className="font-bold tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-emerald-200 dark:bg-emerald-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-100 ease-linear relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Lista de steps */}
        <div className="px-6 py-4 space-y-2 bg-card">
          {ANALYSIS_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isPending = index > currentStep;

            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300",
                  isActive && "bg-emerald-500/10 border border-emerald-500/30",
                  isCompleted && "bg-emerald-500/5",
                  isPending && "opacity-40",
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                    isActive && "bg-emerald-500",
                    isCompleted && "bg-emerald-500",
                    isPending && "bg-muted-foreground/20",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  ) : (
                    <StepIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isActive && "text-emerald-700 dark:text-emerald-300",
                    isCompleted && "text-emerald-600 dark:text-emerald-400",
                    isPending && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
                {isCompleted && (
                  <span className="ml-auto text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span>Análise baseada na CLT e jurisprudência atualizada</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
