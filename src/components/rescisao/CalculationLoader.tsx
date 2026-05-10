import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Calculator, FileSearch, CheckCircle2, Loader2, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculationLoaderProps {
  open: boolean;
}

const steps = [
  { icon: FileSearch, label: "Analisando dados do contrato..." },
  { icon: Calculator, label: "Calculando verbas rescisórias..." },
  { icon: Scale, label: "Comparando com casos similares..." },
  { icon: CheckCircle2, label: "Finalizando cálculo..." },
];

export function CalculationLoader({ open }: CalculationLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      return;
    }

    const timer1 = setTimeout(() => setCurrentStep(1), 600);
    const timer2 = setTimeout(() => setCurrentStep(2), 1200);
    const timer3 = setTimeout(() => setCurrentStep(3), 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent
        className="w-[calc(100vw-32px)] max-w-sm p-0 border-0 rounded-2xl shadow-2xl overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Calculando Rescisão</DialogTitle>
        </VisuallyHidden>

        {/* Header com gradiente */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary/90 px-6 py-5 text-center relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            {/* Ícone animado */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 border-2 border-white/30">
              <Calculator className="h-8 w-8 text-white animate-pulse" />
            </div>

            <h2 className="text-xl font-black text-white mb-1">Calculando sua Rescisão</h2>
            <p className="text-sm text-white/80">Aguarde alguns segundos...</p>
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-5 space-y-3 bg-card">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-500",
                  isActive && "bg-primary/10 border border-primary/30 scale-[1.02]",
                  isCompleted && "bg-success/10 border border-success/30",
                  !isActive && !isCompleted && "bg-muted/50 border border-transparent opacity-50",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    isActive && "bg-primary",
                    isCompleted && "bg-success",
                    !isActive && !isCompleted && "bg-muted-foreground/20",
                  )}
                >
                  {isActive ? (
                    <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-success-foreground" />
                  ) : (
                    <StepIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isActive && "text-primary font-bold",
                    isCompleted && "text-success font-bold",
                    !isActive && !isCompleted && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-5 bg-card">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
