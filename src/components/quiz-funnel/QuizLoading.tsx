import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Scale, FileSearch, Calculator, CheckCircle, Shield, Briefcase } from 'lucide-react';

interface QuizLoadingProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  { icon: FileSearch, label: 'Aplicando a CLT 2026', detail: 'Conferindo seu período de empresa' },
  { icon: Calculator, label: 'Calculando suas verbas', detail: 'Saldo, férias, 13º e aviso prévio' },
  { icon: Briefcase, label: 'Conferindo seu FGTS', detail: 'Saldo estimado e multa devida' },
  { icon: Scale, label: 'Comparando com casos parecidos', detail: 'Onde costuma faltar dinheiro' },
  { icon: Shield, label: 'Buscando o que pode estar faltando', detail: 'Horas extras, adicionais e outros' },
];

export function QuizLoading({ onComplete }: QuizLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Tempos randomizados para cada step
  const stepTimes = useMemo(() => {
    const base = 700;
    return LOADING_STEPS.map(() => base + Math.random() * 400);
  }, []);

  const totalTime = useMemo(() => stepTimes.reduce((a, b) => a + b, 0), [stepTimes]);

  useEffect(() => {
    let elapsed = 0;
    let stepIndex = 0;
    let stepElapsed = 0;
    const completedSet = new Set<number>();

    const interval = setInterval(() => {
      elapsed += 50;
      stepElapsed += 50;

      // Atualizar progresso geral
      const newProgress = Math.min((elapsed / totalTime) * 100, 100);
      setProgress(newProgress);

      // Verificar se completou o step atual
      if (stepElapsed >= stepTimes[stepIndex] && stepIndex < LOADING_STEPS.length) {
        completedSet.add(stepIndex);
        setCompletedSteps(Array.from(completedSet));
        stepIndex++;
        stepElapsed = 0;
        if (stepIndex < LOADING_STEPS.length) {
          setCurrentStep(stepIndex);
        }
      }

      // Finalizar
      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, stepTimes, totalTime]);

  return (
    <div className="animate-fade-in">
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Header limpo */}
        <div className="px-6 pt-7 pb-5 text-center border-b border-border">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Calculando sua rescisão
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Aplicando as regras da CLT 2026 nas suas informações
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-5 sm:p-6">
          {/* Lista de steps */}
          <ul className="space-y-2 mb-6">
            {LOADING_STEPS.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isCurrent = currentStep === index && !isCompleted;
              const Icon = step.icon;

              return (
                <li
                  key={index}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                    isCurrent && "bg-primary/5 border border-primary/15",
                    !isCurrent && "border border-transparent",
                    !isCompleted && !isCurrent && "opacity-50"
                  )}
                >
                  {/* Ícone */}
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                      isCompleted && "bg-success/15 text-success",
                      isCurrent && "bg-primary text-primary-foreground",
                      !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Icon className={cn("w-4 h-4", isCurrent && "animate-pulse")} />
                    )}
                  </div>

                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-[13px] sm:text-sm font-semibold leading-snug",
                      "text-foreground"
                    )}>
                      {step.label}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug mt-0.5">
                      {step.detail}
                    </p>
                  </div>

                  {/* Status */}
                  {isCurrent && (
                    <div className="flex gap-0.5 flex-shrink-0 px-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Barra de progresso */}
          <div className="relative">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-100 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
              </div>
            </div>

            <div className="flex justify-between items-center mt-2.5">
              <span className="text-xs text-muted-foreground">
                Quase lá...
              </span>
              <span className="text-xs font-semibold text-primary tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
