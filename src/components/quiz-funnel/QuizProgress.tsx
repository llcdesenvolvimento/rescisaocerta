import { cn } from '@/lib/utils';

interface QuizProgressProps {
  currentEtapa: number;
  totalEtapas: number;
  progress: number; // 0-100
}

export function QuizProgress({ progress }: QuizProgressProps) {
  return (
    <div className="w-full px-4 py-3">
      {/* Barra de progresso minimalista */}
      <div className="relative">
        {/* Track da barra */}
        <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
          {/* Progresso preenchido */}
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Indicador de porcentagem */}
        <div className="flex justify-end mt-1.5">
          <span className="text-xs font-medium text-primary">
            {Math.round(progress)}% concluído
          </span>
        </div>
      </div>
    </div>
  );
}
