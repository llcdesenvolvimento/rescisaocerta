import { useState } from 'react';
import {
  Sparkles,
  Clock,
  Moon,
  Flame,
  ShieldAlert,
  DollarSign,
  Briefcase,
  TrendingUp,
  Scale,
  TrendingDown,
  Minus,
  ChevronRight,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  ResultadoExtras,
  ItemExtra,
  DadosFluxoAnterior,
  FormularioPosPagamentoV2,
} from '@/types/pos-pagamento-v2';
import { formatarMoeda } from '@/lib/calculo-extras';
import { gerarDetalheExtra, type Cenario } from '@/lib/cenarios-extras';

interface SecaoExtrasProps {
  extras: ResultadoExtras;
  mesesTrabalhados?: number;
  dadosBase: DadosFluxoAnterior;
  formulario: FormularioPosPagamentoV2;
}

const PREVIEW_COUNT = 3;

function getIconForItem(nome: string) {
  const n = nome.toLowerCase();
  if (n.includes('hora')) return Clock;
  if (n.includes('noturno')) return Moon;
  if (n.includes('periculosidade')) return Flame;
  if (n.includes('insalubridade')) return ShieldAlert;
  if (n.includes('fora')) return DollarSign;
  if (n.includes('desvio')) return Briefcase;
  return TrendingUp;
}

export function SecaoExtras({
  extras,
  mesesTrabalhados = 12,
  dadosBase,
  formulario,
}: SecaoExtrasProps) {
  const [isListOpen, setIsListOpen] = useState(false);
  const [detalheAberto, setDetalheAberto] = useState<ItemExtra | null>(null);

  if (extras.itensAplicaveis.length === 0) {
    return (
      <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <header className="px-5 sm:px-7 pt-6 pb-5 border-b border-border">
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
            Verbas Extras
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Valores que costumam ficar de fora da rescisão paga pela empresa.
          </p>
        </header>
        <div className="px-5 sm:px-7 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Com base nas suas respostas, não identificamos verbas extras pendentes.
          </p>
        </div>
      </section>
    );
  }

  const itens = extras.itensAplicaveis;
  const preview = itens.slice(0, PREVIEW_COUNT);
  const restantes = itens.length - PREVIEW_COUNT;
  const valorTotalPeriodo = extras.totalExtrasMensal * mesesTrabalhados;

  return (
    <>
      <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
        <header className="px-5 sm:px-7 pt-6 pb-5 border-b border-border">
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
            Verbas Extras
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Valores que costumam ficar de fora da rescisão paga pela empresa.
          </p>
        </header>

        <ul className="divide-y divide-border">
          {preview.map((item, index) => (
            <LinhaExtra
              key={index}
              item={item}
              mesesTrabalhados={mesesTrabalhados}
              onDetalhar={() => setDetalheAberto(item)}
            />
          ))}
        </ul>

        {restantes > 0 && (
          <button
            onClick={() => setIsListOpen(true)}
            className="w-full px-5 sm:px-7 py-3.5 text-sm font-semibold text-primary hover:bg-muted/40 border-t border-border transition-colors text-center"
          >
            Ver todas as {itens.length} verbas extras →
          </button>
        )}

        <footer className="px-5 sm:px-7 py-5 bg-muted/20 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">Total verbas extras</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Projeção em {mesesTrabalhados} meses
              </p>
            </div>
            <p className="text-sm font-bold text-primary tabular-nums">
              {formatarMoeda(valorTotalPeriodo)}
            </p>
          </div>
        </footer>
      </section>

      {/* Lista completa */}
      <Dialog open={isListOpen} onOpenChange={setIsListOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">Verbas Extras</DialogTitle>
            <p className="text-xs text-muted-foreground">
              Todas as {itens.length} verbas extras identificadas
            </p>
          </DialogHeader>
          <ul className="divide-y divide-border -mx-6 mt-2">
            {itens.map((item, index) => (
              <LinhaExtra
                key={index}
                item={item}
                mesesTrabalhados={mesesTrabalhados}
                onDetalhar={() => {
                  setIsListOpen(false);
                  setDetalheAberto(item);
                }}
              />
            ))}
          </ul>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
            <p className="text-sm font-bold text-foreground">Total ({mesesTrabalhados} meses)</p>
            <p className="text-lg font-black text-primary tabular-nums">
              {formatarMoeda(valorTotalPeriodo)}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detalhe + cenários */}
      <PopupDetalheExtra
        item={detalheAberto}
        dadosBase={dadosBase}
        formulario={formulario}
        mesesTrabalhados={mesesTrabalhados}
        onClose={() => setDetalheAberto(null)}
      />
    </>
  );
}

// ============ Linha de item extra ============
function LinhaExtra({
  item,
  mesesTrabalhados,
  onDetalhar,
}: {
  item: ItemExtra;
  mesesTrabalhados: number;
  onDetalhar: () => void;
}) {
  const Icon = getIconForItem(item.nome);
  const valorPeriodo = item.valorMensal * mesesTrabalhados;

  return (
    <li>
      <button
        type="button"
        onClick={onDetalhar}
        className="w-full text-left px-5 sm:px-7 py-4 hover:bg-muted/40 transition-colors focus:outline-none focus:bg-muted/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground leading-snug">{item.nome}</p>
                {item.isEstimativa && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-medium">
                    Estimativa
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                <Icon className="inline w-3 h-3 mr-1 -mt-0.5" />
                {formatarMoeda(item.valorMensal)} por mês
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <p className="text-sm sm:text-base font-extrabold text-primary tabular-nums whitespace-nowrap">
              {formatarMoeda(valorPeriodo)}
            </p>
            <ChevronRight className="w-4 h-4 text-muted-foreground/60" strokeWidth={2.5} />
          </div>
        </div>
      </button>
    </li>
  );
}

// ============ Popup de detalhe com cenários ============
function PopupDetalheExtra({
  item,
  dadosBase,
  formulario,
  mesesTrabalhados,
  onClose,
}: {
  item: ItemExtra | null;
  dadosBase: DadosFluxoAnterior;
  formulario: FormularioPosPagamentoV2;
  mesesTrabalhados: number;
  onClose: () => void;
}) {
  if (!item) return null;
  const detalhe = gerarDetalheExtra(item, dadosBase, formulario);

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-lg font-extrabold">{item.nome}</DialogTitle>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Scale className="w-3 h-3" />
            {detalhe.baseLegal}
          </p>
        </DialogHeader>

        {/* Fórmula */}
        <div className="mt-3 px-4 py-3 rounded-xl bg-muted/40 border border-border">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
            Fórmula aplicada
          </p>
          <p className="text-sm font-semibold text-foreground">{detalhe.formula}</p>
        </div>

        {/* Passos do cálculo */}
        <div className="mt-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
            Como chegamos no valor
          </p>
          <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            {detalhe.passos.map((passo, i) => (
              <li key={i} className="px-3.5 py-2.5 flex items-start justify-between gap-3">
                <p className="text-xs text-muted-foreground flex-1">{passo.rotulo}</p>
                <p className="text-xs font-bold text-foreground tabular-nums text-right">
                  {passo.valor}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Cenários */}
        <div className="mt-4">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
            Cenários possíveis (projeção em {mesesTrabalhados} meses)
          </p>
          <div className="space-y-2">
            <CartaoCenario cenario={detalhe.cenarios[0]} variante="pessimista" meses={mesesTrabalhados} />
            <CartaoCenario cenario={detalhe.cenarios[1]} variante="realista" meses={mesesTrabalhados} />
            <CartaoCenario cenario={detalhe.cenarios[2]} variante="otimista" meses={mesesTrabalhados} />
          </div>
        </div>

        {/* Observações */}
        {detalhe.observacoes && detalhe.observacoes.length > 0 && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-primary/[0.04] border border-primary/15">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5">
              Observações importantes
            </p>
            <ul className="space-y-1">
              {detalhe.observacoes.map((obs, i) => (
                <li key={i} className="text-xs text-foreground/80 leading-relaxed">
                  • {obs}
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CartaoCenario({
  cenario,
  variante,
  meses,
}: {
  cenario: Cenario;
  variante: 'pessimista' | 'realista' | 'otimista';
  meses: number;
}) {
  const cfg = {
    pessimista: {
      Icon: TrendingDown,
      bg: 'bg-destructive/[0.04]',
      border: 'border-destructive/20',
      iconBg: 'bg-destructive/15',
      iconColor: 'text-destructive',
      valueColor: 'text-destructive',
    },
    realista: {
      Icon: Minus,
      bg: 'bg-muted/40',
      border: 'border-border',
      iconBg: 'bg-foreground/10',
      iconColor: 'text-foreground',
      valueColor: 'text-foreground',
    },
    otimista: {
      Icon: TrendingUp,
      bg: 'bg-success/[0.05]',
      border: 'border-success/25',
      iconBg: 'bg-success/15',
      iconColor: 'text-success',
      valueColor: 'text-success',
    },
  }[variante];

  const Icon = cfg.Icon;
  const valorPeriodo = cenario.valorMensal * meses;

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} px-3.5 py-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className={`w-6 h-6 rounded-full ${cfg.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            <Icon className={`w-3.5 h-3.5 ${cfg.iconColor}`} strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">{cenario.titulo}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              {cenario.descricao}
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`text-sm font-extrabold tabular-nums ${cfg.valueColor}`}>
            {formatarMoeda(valorPeriodo)}
          </p>
          <p className="text-[10px] text-muted-foreground tabular-nums">
            {formatarMoeda(cenario.valorMensal)}/mês
          </p>
        </div>
      </div>
    </div>
  );
}
