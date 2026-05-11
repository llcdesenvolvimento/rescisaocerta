import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Smartphone,
  Gift,
  FileText,
  Search,
  BarChart3,
  MapPin,
  Clock,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QRCodeSectionProps {
  qrCode: string;
  qrCodeUrl: string;
  userName: string;
  userEmail: string;
  copied: boolean;
  onCopyCode: () => void;
}

const ENTREGAVEIS = [
  {
    icon: Search,
    title: "Cada verba conferida individualmente",
    desc: "Saldo, aviso, férias, 13º, FGTS e multa: o valor exato de cada uma na sua rescisão",
  },
  {
    icon: BarChart3,
    title: "Valores extras identificados",
    desc: "Horas extras, adicionais, desvio de função e outras verbas que encontramos pra você",
  },
  {
    icon: FileText,
    title: "Tudo com base na CLT 2026",
    desc: "Análise enviada por email com fundamento legal para você consultar quando precisar",
  },
  {
    icon: MapPin,
    title: "O que fazer agora, passo a passo",
    desc: "Como cobrar a diferença, prazos legais e o que falar com a empresa antes de assinar",
  },
];

const BONUS = [
  {
    icon: Clock,
    title: "Bônus 1: Checklist de Documentos",
    desc: "Lista completa dos documentos que a empresa precisa te entregar na rescisão. Saiba exatamente o que cobrar.",
    valor: "R$ 9,90",
  },
  {
    icon: Zap,
    title: "Bônus 2: Guia de Prazos Legais",
    desc: "Todos os prazos que a empresa precisa cumprir após a demissão. Não perca nenhum direito por falta de informação.",
    valor: "R$ 9,90",
  },
];

export const QRCodeSection = forwardRef<HTMLDivElement, QRCodeSectionProps>(
  ({ qrCode, qrCodeUrl, userName, userEmail, copied, onCopyCode }, ref) => {
    const firstName = userName.split(" ")[0];
    return (
      <div className="space-y-4">
        {/* QR Code */}
        <div id="qrcode-section" className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="text-center space-y-3">
            <div>
              <p className="font-bold text-foreground text-lg leading-relaxed">
                Obtenha a <span className="text-primary">Análise Completa</span> da <span className="text-primary">Rescisão</span> de <span className="font-black text-foreground">{firstName}</span> no e-mail <span className="font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">{userEmail}</span> por apenas
              </p>
              <div className="flex flex-col items-center mt-2">
                <span className="text-sm text-muted-foreground line-through">R$ 26,90</span>
                <span className="text-2xl font-black text-success">R$ 16,90</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Acesso liberado em segundos.</p>
            </div>
          </div>

          <div ref={ref} className="flex justify-center">
            <div className="relative bg-primary/5 p-4 rounded-2xl border-2 border-dashed border-primary/30">
              <img src={qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 sm:w-52 sm:h-52" loading="eager" />
            </div>
          </div>

          {/* Código PIX */}
          <div className="space-y-3">
            <div className="bg-muted rounded-xl p-3 border border-border">
              <p className="text-xs text-muted-foreground break-all font-mono line-clamp-2 text-center">{qrCode}</p>
            </div>
            <Button
              onClick={onCopyCode}
              className="w-full h-12 font-bold text-sm bg-primary hover:bg-primary/90 text-white border-0 shadow-md shadow-primary/20"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Código Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 mr-2" />
                  Copiar Código PIX
                </>
              )}
            </Button>
          </div>

          {/* Status do Pagamento */}
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 text-center space-y-1.5">
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <p className="text-sm font-black text-foreground">Aguardando seu pagamento</p>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Assim que confirmar, sua análise é{" "}
              <span className="font-bold text-primary">liberada automaticamente</span>.
            </p>
          </div>
        </div>

        {/* O que está incluso */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">O que você vai receber</p>
            </div>
            <div className="grid gap-2">
              {ENTREGAVEIS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="relative bg-primary/5 rounded-lg p-2.5 border border-primary/20 overflow-hidden">
                    <div className="absolute top-0 right-0 bg-success text-white text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg">
                      INCLUÍDO
                    </div>
                    <div className="flex items-center gap-2.5 pr-8">
                      <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-foreground font-bold leading-tight">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bônus */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Bônus exclusivos inclusos:</p>
            </div>

            {BONUS.map((bonus, i) => {
              const Icon = bonus.icon;
              return (
                <div key={i} className="relative bg-primary/5 rounded-lg p-2.5 border border-primary/20 overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg">
                    GRÁTIS
                  </div>
                  <div className="flex items-center gap-2.5 pr-8">
                    <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-foreground font-bold leading-tight">{bonus.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{bonus.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Valor: <span className="line-through">{bonus.valor}</span>{" "}
                        <span className="font-bold text-primary">incluso</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-dashed border-border" />

          {/* Resumo de valor total */}
          <div className="bg-muted/50 rounded-xl p-3 border border-border space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Análise Completa da Rescisão</span>
              <span className="text-muted-foreground line-through">R$ 26,90</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Bônus: Checklist de Documentos</span>
              <span className="text-muted-foreground line-through">R$ 9,90</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">Bônus: Guia de Prazos Legais</span>
              <span className="text-muted-foreground line-through">R$ 9,90</span>
            </div>
            <div className="border-t border-border my-1" />
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-foreground">Total hoje:</span>
              <div className="text-right">
                <span className="text-sm text-muted-foreground line-through mr-2">R$ 46,70</span>
                <span className="text-lg font-black text-primary">R$ 16,90</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passo a Passo compacto */}
        <div className="bg-muted/50 border border-border rounded-xl p-4">
          <p className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
            <Smartphone className="w-4 h-4 text-primary" />
            Como pagar em 3 passos:
          </p>
          <div className="flex items-start gap-3">
            {[
              { n: "1", t: "Copie o código", d: "Botão acima" },
              { n: "2", t: "Abra o app do banco", d: "PIX, colar código" },
              { n: "3", t: "Confirme", d: "Acesso imediato" },
            ].map((step, i) => (
              <div key={i} className="flex-1 text-center space-y-1">
                <span className="inline-flex w-6 h-6 bg-primary text-primary-foreground rounded-full items-center justify-center text-xs font-bold">
                  {step.n}
                </span>
                <p className="text-[11px] font-bold text-foreground leading-tight">{step.t}</p>
                <p className="text-[9px] text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <p className="text-[10px] text-center text-muted-foreground">
          Você será redirecionado automaticamente após a confirmação
        </p>

      </div>
    );
  },
);

QRCodeSection.displayName = "QRCodeSection";
