import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Etapa {
  label: string;
}

interface UpsellLoadingScreenProps {
  etapas: Etapa[];
  titulo: string;
}

export function UpsellLoadingScreen({ etapas, titulo }: UpsellLoadingScreenProps) {
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [progresso, setProgresso] = useState(0);

  useEffect(() => {
    const totalEtapas = etapas.length;
    const duracaoPorEtapa = 100 / totalEtapas;

    const interval = setInterval(() => {
      setProgresso((prev) => {
        const target = Math.min((etapaAtual + 1) * duracaoPorEtapa, 95);
        if (prev >= target) return prev;
        return prev + 0.8;
      });
    }, 100);

    const etapaInterval = setInterval(() => {
      setEtapaAtual((prev) => {
        if (prev < totalEtapas - 1) return prev + 1;
        return prev;
      });
    }, 3500);

    return () => {
      clearInterval(interval);
      clearInterval(etapaInterval);
    };
  }, [etapaAtual, etapas.length]);

  return (
    <div className="flex flex-col items-center py-6 gap-5">
      <div className="text-center space-y-1">
        <h3 className="text-base font-bold text-foreground">{titulo}</h3>
        <p className="text-xs text-muted-foreground">Isso pode levar alguns segundos</p>
      </div>

      <div className="w-full space-y-2">
        <Progress value={progresso} className="h-2" />
        <p className="text-xs text-muted-foreground text-center">{Math.round(progresso)}%</p>
      </div>

      <div className="w-full space-y-2">
        {etapas.map((etapa, i) => {
          const concluida = i < etapaAtual;
          const ativa = i === etapaAtual;
          return (
            <div
              key={i}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                concluida
                  ? 'text-green-600 dark:text-green-400'
                  : ativa
                  ? 'text-foreground font-medium bg-muted/50'
                  : 'text-muted-foreground/50'
              }`}
            >
              {concluida ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : ativa ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-muted-foreground/30 flex-shrink-0" />
              )}
              <span>{etapa.label}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 w-full">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-snug">
          Não feche nem atualize esta página enquanto o conteúdo é gerado.
        </p>
      </div>
    </div>
  );
}
