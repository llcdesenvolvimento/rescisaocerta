interface QuizProgressProps {
  currentEtapa: number;
  totalEtapas: number;
  progress: number; // 0-100
}

export function QuizProgress({ progress }: QuizProgressProps) {
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full px-4 py-3">
      <div className="relative">
        {/* Track */}
        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
          {/* Preenchimento com gradiente + shimmer */}
          <div
            className="relative h-full rounded-full overflow-hidden transition-[width] duration-700 ease-out"
            style={{
              width: `${clamped}%`,
              background:
                'linear-gradient(90deg, hsl(var(--primary) / 0.85) 0%, hsl(var(--primary)) 50%, hsl(var(--primary) / 0.9) 100%)',
              boxShadow: '0 0 12px hsl(var(--primary) / 0.45)',
            }}
          >
            {/* Brilho deslizante */}
            <div
              className="absolute inset-y-0 -left-1/3 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent"
            />
          </div>
        </div>

        {/* Bolinha indicadora — só aparece quando há progresso visível */}
        {clamped > 1 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-[left] duration-700 ease-out"
            style={{ left: `${clamped}%` }}
          >
            <div className="relative w-3.5 h-3.5">
              <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
              <span className="relative block w-3.5 h-3.5 rounded-full bg-white border-2 border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.18)]" />
            </div>
          </div>
        )}

        {/* Porcentagem */}
        <div className="flex justify-end mt-2">
          <span className="text-xs font-medium text-primary tabular-nums">
            <span className="font-bold">{Math.round(clamped)}%</span>
            <span className="text-primary/60"> concluído</span>
          </span>
        </div>
      </div>
    </div>
  );
}
