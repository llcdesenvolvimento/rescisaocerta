import { useState } from 'react';
import { CheckCircle2, MinusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatarMoeda } from '@/lib/calculo-extras';
import { DadosFluxoAnterior } from '@/types/pos-pagamento-v2';

export interface LinhaBasico {
  descricao: string;
  valor: number;
  explicacao?: string;
  tipo?: 'provento' | 'desconto';
}

interface SecaoBasicoProps {
  linhas: LinhaBasico[];
  totalBasico: number;
  dadosBase: DadosFluxoAnterior;
}

const PREVIEW_COUNT = 3;

export function SecaoBasico({ linhas, totalBasico }: SecaoBasicoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const linhasPreview = linhas.slice(0, PREVIEW_COUNT);
  const totalLinhas = linhas.length;
  const restantes = totalLinhas - PREVIEW_COUNT;

  return (
    <>
      <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <header className="px-5 sm:px-7 pt-6 pb-5 border-b border-border">
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
            Verbas Básicas
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Valores que compõem a sua rescisão pela CLT.
          </p>
        </header>

        <ul className="divide-y divide-border">
          {linhasPreview.map((linha, index) => (
            <LinhaItem key={index} linha={linha} />
          ))}
        </ul>

        {restantes > 0 && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full px-5 sm:px-7 py-3.5 text-sm font-semibold text-success hover:bg-muted/40 border-t border-border transition-colors text-center"
          >
            Ver todas as {totalLinhas} verbas →
          </button>
        )}

        <footer className="px-5 sm:px-7 py-5 bg-muted/20 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">Total verbas básicas</p>
            <p className="text-sm font-bold text-success tabular-nums">
              {formatarMoeda(totalBasico)}
            </p>
          </div>
        </footer>
      </section>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">Verbas Básicas</DialogTitle>
            <p className="text-xs text-muted-foreground">
              Todas as {totalLinhas} verbas detalhadas
            </p>
          </DialogHeader>
          <ul className="divide-y divide-border -mx-6 mt-2">
            {linhas.map((linha, index) => (
              <LinhaItem key={index} linha={linha} />
            ))}
          </ul>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
            <p className="text-sm font-bold text-foreground">Total</p>
            <p className="text-lg font-black text-success tabular-nums">{formatarMoeda(totalBasico)}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function LinhaItem({ linha }: { linha: LinhaBasico }) {
  const isDesconto = linha.tipo === 'desconto';
  return (
    <li className={`px-5 sm:px-7 py-4 hover:bg-muted/30 transition-colors ${isDesconto ? 'bg-destructive/[0.03]' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDesconto ? 'bg-destructive/15' : 'bg-success/15'}`}>
            {isDesconto ? (
              <MinusCircle className="w-3.5 h-3.5 text-destructive" strokeWidth={2.5} />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-success" strokeWidth={2.5} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground leading-snug">{linha.descricao}</p>
            {linha.explicacao && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{linha.explicacao}</p>
            )}
          </div>
        </div>
        <p className={`text-sm sm:text-base font-extrabold tabular-nums whitespace-nowrap ${isDesconto ? 'text-destructive' : 'text-foreground'}`}>
          {isDesconto && '−'}
          {formatarMoeda(linha.valor)}
        </p>
      </div>
    </li>
  );
}
