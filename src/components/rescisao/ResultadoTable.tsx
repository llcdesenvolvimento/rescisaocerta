import { LinhaResultado } from '@/types/rescisao';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ResultadoTableProps {
  linhas: LinhaResultado[];
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function ResultadoTable({ linhas }: ResultadoTableProps) {
  if (linhas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Preencha os dados para ver o demonstrativo</p>
      </div>
    );
  }

  const proventos = linhas.filter(l => l.tipo === 'provento');
  const descontos = linhas.filter(l => l.tipo === 'desconto');

  return (
    <div className="space-y-5">
      {/* Proventos */}
      {proventos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-success uppercase tracking-wider flex items-center gap-2 px-1">
            <TrendingUp className="h-3.5 w-3.5" />
            Proventos
          </h4>
          <div className="space-y-1.5">
            {proventos.map((linha, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex justify-between items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl',
                  'bg-success-muted/50 border border-success/10'
                )}
              >
                <span className="text-xs sm:text-sm text-foreground">{linha.descricao}</span>
                <span className="font-semibold text-sm sm:text-base text-success whitespace-nowrap ml-2">
                  {formatCurrency(linha.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Descontos */}
      {descontos.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-2 px-1">
            <TrendingDown className="h-3.5 w-3.5" />
            Descontos
          </h4>
          <div className="space-y-1.5">
            {descontos.map((linha, idx) => (
              <div
                key={idx}
                className={cn(
                  'flex justify-between items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl',
                  'bg-destructive-muted/50 border border-destructive/10'
                )}
              >
                <span className="text-xs sm:text-sm text-foreground">{linha.descricao}</span>
                <span className="font-semibold text-sm sm:text-base text-destructive whitespace-nowrap ml-2">
                  - {formatCurrency(linha.valor)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
