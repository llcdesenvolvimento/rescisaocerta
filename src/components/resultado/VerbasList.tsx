import { memo } from "react";
import {
  AlertTriangle,
  Clock,
  Zap,
  CircleDollarSign,
  Calculator,
  Scale,
  CheckCircle2,
  Lock,
  Briefcase,
  Calendar,
  Umbrella,
  Percent,
  MinusCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface VerbaRescisoria {
  id: string;
  descricao: string;
  valor: number;
  tipo: "provento" | "desconto";
  detalhes?: string;
}

interface Verba {
  nome: string;
  icone: LucideIcon;
  multiplicador: number;
}

const VERBAS_PENDENTES: Verba[] = [
  { nome: "Horas Extras e Reflexos", icone: Clock, multiplicador: 0.12 },
  { nome: "Adicional Noturno", icone: Zap, multiplicador: 0.08 },
  { nome: "FGTS + Multa 40%", icone: CircleDollarSign, multiplicador: 0.15 },
  { nome: "DSR sobre Variáveis", icone: Calculator, multiplicador: 0.05 },
  { nome: "Verbas por Desvio de Função", icone: Scale, multiplicador: 0.1 },
  { nome: "Diferenças Salariais", icone: AlertTriangle, multiplicador: 0.07 },
  { nome: "Multas e Indenizações", icone: Scale, multiplicador: 0.09 },
];

// Mapeamento de ícones por ID da verba
const ICONE_POR_VERBA: Record<string, LucideIcon> = {
  saldoSalario: Briefcase,
  avisoPrevio: Calendar,
  decimoTerceiro: CircleDollarSign,
  feriasVencidas: Umbrella,
  feriasProporcionais: Umbrella,
  tercoFeriasVencidas: Percent,
  tercoFeriasProporcionais: Percent,
  fgts: CircleDollarSign,
  multaFgts: CircleDollarSign,
  descontoINSS: MinusCircle,
  descontoIRRF: MinusCircle,
  descontoAvisoPrevio: MinusCircle,
};

interface VerbasListProps {
  valorBase: number;
  percentualDiferenca: number;
  formatCurrency: (value: number) => string;
  verbasBasicas?: VerbaRescisoria[];
}

export const VerbasList = memo(function VerbasList({
  valorBase,
  percentualDiferenca,
  formatCurrency,
  verbasBasicas,
}: VerbasListProps) {
  const proventos = verbasBasicas?.filter((v) => v.tipo === "provento" && v.valor > 0) || [];
  const descontos = verbasBasicas?.filter((v) => v.tipo === "desconto" && v.valor > 0) || [];

  return (
    <div className="space-y-3">
      {/* SEÇÃO 1: VERBAS BÁSICAS */}
      <section className="bg-muted/30 rounded-xl p-2 sm:p-3 border border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          </div>
          <h4 className="text-sm font-extrabold text-foreground">Suas verbas básicas</h4>
        </div>

        <div className="space-y-1.5">
          {proventos.length > 0 ? (
            <>
              {proventos.map((verba, index) => {
                const Icon = ICONE_POR_VERBA[verba.id] || CheckCircle2;
                return (
                  <div
                    key={verba.id || index}
                    className="flex items-center justify-between bg-card rounded-lg px-2.5 py-2 gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-[11px] sm:text-xs text-foreground font-semibold leading-tight break-words">
                        {verba.descricao}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-foreground flex-shrink-0 whitespace-nowrap">
                      {formatCurrency(verba.valor)}
                    </span>
                  </div>
                );
              })}

              {descontos.map((verba, index) => {
                const Icon = ICONE_POR_VERBA[verba.id] || MinusCircle;
                return (
                  <div
                    key={verba.id || index}
                    className="flex items-center justify-between bg-card rounded-lg px-2.5 py-2 gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon className="h-4 w-4 text-destructive/70 flex-shrink-0" />
                      <span className="text-[11px] sm:text-xs text-foreground font-semibold leading-tight break-words">
                        {verba.descricao}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-destructive flex-shrink-0 whitespace-nowrap">
                      −{formatCurrency(verba.valor)}
                    </span>
                  </div>
                );
              })}

              <div className="flex items-center justify-between bg-success rounded-lg px-2.5 py-3 mt-2 shadow-sm">
                <span className="text-xs font-bold text-white">Total de Verbas Básicas</span>
                <span className="text-base font-black text-white">{formatCurrency(valorBase)}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between bg-card rounded-lg px-3 py-2.5">
              <span className="text-xs text-foreground font-bold">Total das verbas básicas</span>
              <span className="text-sm font-extrabold text-foreground">{formatCurrency(valorBase)}</span>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO 2: VERBAS EXTRAS */}
      <section className="bg-primary/5 rounded-xl p-2 sm:p-3 border border-primary/30">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Lock className="h-3.5 w-3.5 text-primary" />
          </div>
          <h4 className="text-sm font-extrabold text-foreground">Suas verbas extras identificadas</h4>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3 ml-8">
          Valores que ainda podem ser seus. Liberados na análise completa.
        </p>

        <div className="space-y-1.5">
          {VERBAS_PENDENTES.map((verba, index) => {
            const Icon = verba.icone;
            const valorFicticio = valorBase * verba.multiplicador;
            return (
              <div
                key={index}
                className="flex items-center justify-between bg-card rounded-lg px-2.5 py-2 gap-2"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs text-foreground font-semibold leading-tight break-words">{verba.nome}</span>
                </div>
                <div className="relative flex items-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary blur-[4px] select-none whitespace-nowrap">
                    {formatCurrency(valorFicticio)}
                  </span>
                  <Lock className="h-3 w-3 text-primary absolute right-0" />
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-between bg-primary rounded-lg px-2.5 py-3 mt-2">
            <span className="text-xs font-bold text-white">Total extra que você tem direito</span>
            <div className="relative flex items-center flex-shrink-0">
              <span className="text-base font-black text-white blur-[5px] select-none whitespace-nowrap">
                {formatCurrency(VERBAS_PENDENTES.reduce((acc, v) => acc + valorBase * v.multiplicador, 0))}
              </span>
              <Lock className="h-4 w-4 text-white absolute right-0" />
            </div>
          </div>
        </div>
      </section>

      <div className="bg-card border-2 border-primary rounded-xl px-4 py-3.5 text-center overflow-hidden shadow-md">
        <p className="text-sm sm:text-base text-primary font-extrabold whitespace-nowrap flex items-center justify-center gap-2">
          <Lock className="h-4 w-4 flex-shrink-0" />
          Confira o valor total na Análise Completa
        </p>
      </div>
    </div>
  );
});
