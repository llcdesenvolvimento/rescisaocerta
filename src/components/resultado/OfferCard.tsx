import { forwardRef } from "react";
import { CheckCircle2, Loader2, Mail, FileText, Search, BarChart3, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
interface OfferCardProps {
  userName: string;
  userEmail: string;
  nameError: string;
  emailError: string;
  isLoading: boolean;
  loadingStep: number;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
}
const ENTREGAVEIS = [{
  icon: Search,
  title: "Conheça todos os seus direitos",
  desc: "Mostramos cada valor que entra na sua rescisão: salário, férias, 13º, FGTS e multa"
}, {
  icon: BarChart3,
  title: "Descubra o dinheiro que está faltando",
  desc: "Mostramos horas extras, adicionais e outros valores que costumam ficar de fora da conta"
}, {
  icon: FileText,
  title: "Receba tudo no seu email",
  desc: "Um relatório fácil de entender, com a lei na mão, pra você guardar e usar quando precisar"
}, {
  icon: MapPin,
  title: "Saiba o que fazer pra receber",
  desc: "Te mostramos como cobrar a empresa, os prazos e o que falar antes de assinar qualquer coisa"
}];
export const OfferCard = forwardRef<HTMLDivElement, OfferCardProps>(({
  userName,
  userEmail,
  nameError,
  emailError,
  isLoading,
  loadingStep,
  onNameChange,
  onEmailChange,
  onSubmit
}, ref) => {
  return <div ref={ref} className="bg-card rounded-2xl overflow-hidden shadow-xl border border-border max-w-md mx-auto w-full">
        {/* Header */}
        <div className="px-5 pt-6 pb-4 text-center">
          <p className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight mb-5 tracking-tight">
            Acesse a <span className="text-primary">Análise Completa</span> da sua <span className="text-primary">Rescisão</span> por apenas
          </p>

          <div className="bg-muted/50 rounded-[10px] py-6 px-4">
            <p className="text-base text-muted-foreground font-medium line-through">R$ 24,90</p>

            <p className="text-5xl font-black text-success tracking-tight mt-2">R$ 16,90</p>

            <p className="text-xs text-muted-foreground mt-3">Pagamento único via PIX</p>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5 space-y-5">
          {/* Entregáveis */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">O que você vai descobrir:</p>

            <div className="grid gap-2">
              {ENTREGAVEIS.map((item, i) => {
            const Icon = item.icon;
            return <div key={i} className="flex items-start gap-3 bg-muted/40 rounded-xl p-3 border border-border/60">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-[18px] w-[18px] text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-foreground font-bold leading-tight">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  </div>;
          })}
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-dashed border-border" />

          {/* Nome + Email + CTA */}
          <div className="space-y-3">
            <p className="text-muted-foreground text-center font-medium text-sm">
              Preencha pra liberar sua <strong className="font-bold text-foreground">Análise Completa</strong> por <strong className="font-bold text-foreground">PIX</strong>. Mandamos por email também.
            </p>
            <div>
              <Input type="text" placeholder="Seu nome" autoComplete="name" value={userName} onChange={e => onNameChange(e.target.value)} className={cn("h-12 text-base", nameError && "border-destructive focus-visible:ring-destructive")} />
              {nameError && <p className="text-[11px] text-destructive font-medium mt-1">{nameError}</p>}
            </div>
            <div>
              <Input type="email" inputMode="email" autoComplete="email" placeholder="seu@email.com" value={userEmail} onChange={e => onEmailChange(e.target.value)} className={cn("h-12 text-base", emailError && "border-destructive focus-visible:ring-destructive")} />
            </div>
            {emailError && <p className="text-[11px] text-destructive font-medium -mt-1">{emailError}</p>}

            <Button size="lg" onClick={onSubmit} disabled={isLoading} className={cn("w-full h-14 text-sm font-black rounded-xl", "bg-gradient-to-r from-primary to-primary/90", "hover:from-primary/90 hover:to-primary", "shadow-lg shadow-primary/25", "border-0 text-white", "disabled:opacity-70 disabled:cursor-wait")}>
              {isLoading ? <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span className="text-sm">
                      {loadingStep === 1 && "Validando informações..."}
                      {loadingStep === 2 && "Conectando..."}
                      {loadingStep === 3 && "Gerando QR Code..."}
                      {loadingStep === 0 && "Processando..."}
                    </span>
                  </div>
                  <div className="w-full max-w-[200px] h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-700 ease-out" style={{
                width: `${loadingStep === 1 ? 25 : loadingStep === 2 ? 55 : loadingStep === 3 ? 85 : 10}%`
              }} />
                  </div>
                </div> : "Concluir Pagamento"}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Liberação dos resultados imediatamente após o pagamento
            </p>
          </div>

        </div>
      </div>;
});
OfferCard.displayName = "OfferCard";