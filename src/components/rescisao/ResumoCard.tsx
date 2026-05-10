import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface ResumoCardProps {
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function ResumoCard({ totalProventos, totalDescontos, liquido }: ResumoCardProps) {
  return (
    <div className="space-y-4">
      {/* Grid de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Proventos */}
        <div className="bg-success-muted rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-success">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Proventos</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-success">
            {formatCurrency(totalProventos)}
          </p>
        </div>

        {/* Total Descontos */}
        <div className="bg-destructive-muted rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Descontos</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-destructive">
            {formatCurrency(totalDescontos)}
          </p>
        </div>

        {/* Líquido */}
        <div className={cn(
          'rounded-xl p-4 space-y-2',
          liquido >= 0 
            ? 'bg-gradient-to-br from-primary to-primary/80' 
            : 'bg-gradient-to-br from-destructive to-destructive/80'
        )}>
          <div className="flex items-center gap-2 text-primary-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Líquido</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-primary-foreground">
            {formatCurrency(liquido)}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-warning-muted border border-warning/20 rounded-xl p-3 sm:p-4">
        <p className="text-xs text-warning-foreground leading-relaxed">
          ⚠️ <strong>Valores estimativos.</strong> Podem variar por convenção coletiva, 
          rubricas específicas e apuração do DP/contador. Consulte um profissional 
          para cálculos definitivos.
        </p>
      </div>
    </div>
  );
}
