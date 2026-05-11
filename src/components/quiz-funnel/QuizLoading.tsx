import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';

interface QuizLoadingProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  {
    emoji: '📋',
    label: 'Organizando suas informações',
    sub: 'Tempo de empresa, tipo de saída e dados do contrato',
  },
  {
    emoji: '⚖️',
    label: 'Aplicando a CLT 2026',
    sub: 'Cada regra atualizada de rescisão trabalhista',
  },
  {
    emoji: '🧮',
    label: 'Calculando suas verbas',
    sub: 'Saldo de salário, férias, 13º e aviso prévio',
  },
  {
    emoji: '💰',
    label: 'Conferindo seu FGTS',
    sub: 'Saldo estimado e multa que a empresa deve pagar',
  },
  {
    emoji: '🔍',
    label: 'Identificando pontos críticos',
    sub: 'Horas extras, adicionais e verbas que costumam ficar de fora',
  },
  {
    emoji: '📊',
    label: 'Comparando com casos parecidos',
    sub: 'Mais de 2 milhões de análises usadas como referência',
  },
  {
    emoji: '🧠',
    label: 'Gerando seu diagnóstico personalizado',
    sub: 'Montando o seu resultado com base em tudo que você respondeu',
  },
];

export function QuizLoading({ onComplete }: QuizLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

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

    const interval = setInterval(() => {
      elapsed += 50;
      stepElapsed += 50;

      const newProgress = Math.min((elapsed / totalTime) * 100, 100);
      setProgress(newProgress);

      if (stepElapsed >= stepTimes[stepIndex] && stepIndex < LOADING_STEPS.length - 1) {
        stepIndex++;
        stepElapsed = 0;
        setCurrentStep(stepIndex);
      }

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, stepTimes, totalTime]);

  const totalSteps = LOADING_STEPS.length;
  const stepNumber = currentStep + 1;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Glows decorativos no fundo */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/8 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full bg-white/6 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header padrão */}
      <Header />

      {/* Conteúdo central */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-[440px] flex flex-col items-center text-center">

          {/* Spinner circular com emoji no centro */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-10">
            {/* Trilha de fundo */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(progress / 100) * 289.03} 289.03`}
                className="transition-[stroke-dasharray] duration-200 ease-out"
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }}
              />
            </svg>

            {/* Emoji no centro (sem card) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                key={currentStep}
                className="text-5xl sm:text-6xl leading-none select-none animate-fade-scale-in"
                aria-hidden="true"
              >
                {LOADING_STEPS[currentStep].emoji}
              </span>
            </div>
          </div>

          {/* Label + legenda da etapa atual */}
          <div key={`label-${currentStep}`} className="mb-10 animate-fade-in min-h-[5rem]">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
              {LOADING_STEPS[currentStep].label}
            </h2>
            <p className="text-sm sm:text-base text-white/75 leading-snug max-w-[360px] mx-auto">
              {LOADING_STEPS[currentStep].sub}
            </p>
          </div>

          {/* Barra de progresso linear */}
          <div className="w-full">
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-200 ease-out relative"
                style={{
                  width: `${progress}%`,
                  boxShadow: '0 0 14px rgba(255,255,255,0.6)',
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs sm:text-sm text-white/75 font-medium">
                Etapa {stepNumber} de {totalSteps}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-white tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
