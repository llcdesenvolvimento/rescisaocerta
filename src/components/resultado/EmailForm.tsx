import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailFormProps {
  userEmail: string;
  emailError: string;
  isLoading: boolean;
  loadingStep: number;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
}

export function EmailForm({ userEmail, emailError, isLoading, loadingStep, onEmailChange, onSubmit }: EmailFormProps) {
  return (
    <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-5 space-y-4 shadow-md">
      <p className="text-sm text-foreground text-center leading-relaxed">
        Insira seu <strong className="font-bold">e-mail</strong> para efetuar o pagamento via{" "}
        <strong className="font-bold">PIX</strong> e liberar o{" "}
        <strong className="font-bold">Análise Completa da sua Rescisão</strong> com todos os valores detalhados
      </p>

      <div className="space-y-2">
        <Label htmlFor="user-email" className="text-sm font-medium text-foreground">
          E-mail
        </Label>
        <Input
          id="user-email"
          type="email"
          placeholder="Seu e-mail"
          value={userEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          className={cn("h-12 text-base", emailError && "border-destructive focus-visible:ring-destructive")}
        />
        {emailError && <p className="text-[11px] text-destructive font-medium">{emailError}</p>}
      </div>

      {/* CTA */}
      <Button
        size="lg"
        onClick={onSubmit}
        disabled={isLoading}
        className={cn(
          "w-full h-14 text-sm font-black rounded-xl",
          "bg-gradient-to-r from-primary to-primary/90",
          "hover:from-primary/90 hover:to-primary",
          "shadow-lg shadow-primary/30",
          "border-0 text-white",
          "disabled:opacity-70 disabled:cursor-wait",
        )}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span className="text-sm">
                {loadingStep === 1 && "Validando dados..."}
                {loadingStep === 2 && "Conectando..."}
                {loadingStep === 3 && "Gerando QR Code..."}
                {loadingStep === 0 && "Processando..."}
              </span>
            </div>
            <div className="w-full max-w-[200px] h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${loadingStep === 1 ? 25 : loadingStep === 2 ? 55 : loadingStep === 3 ? 85 : 10}%`,
                }}
              />
            </div>
          </div>
        ) : (
          "DESBLOQUEAR ANÁLISE COMPLETA"
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground">
        Você receberá o resultado imediatamente no seu email
      </p>
    </div>
  );
}
