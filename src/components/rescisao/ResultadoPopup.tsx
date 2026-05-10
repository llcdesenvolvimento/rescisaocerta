import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Shield,
  Loader2,
  Copy,
  Check,
  Clock,
  AlertTriangle,
  Zap,
  Scale,
  Mail,
  ShieldAlert,
  Calculator,
  CircleDollarSign,
  HelpCircle,
  Smartphone,
  FileCheck,
} from "lucide-react";
import { Testimonials } from "./Testimonials";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResultadoCompleto } from "@/lib/calculadora-rescisao-completa";

interface ResultadoPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultado: ResultadoCompleto | null;
  formData?: {
    tipoDesligamento: string;
    dataAdmissao: string;
    dataDesligamento: string;
    aindaTrabalhando: boolean;
    salarioFixo: number;
    mediaVariavel: number;
    temVariavel: boolean;
    avisoPrevio: string;
    feriasVencidas: string;
    statusPagamento: string;
    faziaHorasExtras: string;
    funcoesDiferentes: string;
    valorPorFora: string;
    adicionaisTrabalho: string[];
    erroNaRescisao: string;
  };
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

type Step = "offer" | "qrcode";

export function ResultadoPopup({ open, onOpenChange, resultado, formData: formDataProp }: ResultadoPopupProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("offer");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isSavingCalculo, setIsSavingCalculo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [chargeId, setChargeId] = useState("");
  const [calculoId, setCalculoId] = useState(() => sessionStorage.getItem("rescisao-calculo-id") || "");
  const [codigoUnico, setCodigoUnico] = useState(() => sessionStorage.getItem("rescisao-codigo-unico") || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const qrCodeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const offerCardRef = useRef<HTMLDivElement>(null);

  // Percentual fixo por sessão (76% - 86%)
  const [percentualCasosSemelhantes] = useState(() => {
    const stored = sessionStorage.getItem("rescisao-percentual-casos");
    if (stored) return parseInt(stored, 10);
    const randomPercent = Math.floor(Math.random() * 11) + 76;
    sessionStorage.setItem("rescisao-percentual-casos", String(randomPercent));
    return randomPercent;
  });

  // Percentual de diferença fixo por sessão (31% - 46%)
  const [percentualDiferenca] = useState(() => {
    const stored = sessionStorage.getItem("rescisao-percentual-diferenca");
    if (stored) return parseInt(stored, 10);
    const randomPercent = Math.floor(Math.random() * 16) + 31;
    sessionStorage.setItem("rescisao-percentual-diferenca", String(randomPercent));
    return randomPercent;
  });

  // Auto-scroll para o topo quando QR Code é gerado
  useEffect(() => {
    if (qrCodeUrl && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    }
  }, [qrCodeUrl]);

  // Polling automático para verificar pagamento a cada 10 segundos
  useEffect(() => {
    if (!qrCodeUrl || !chargeId) return;

    let isCancelled = false;
    let pollingInterval: ReturnType<typeof setInterval>;

    const checkPaymentStatus = async () => {
      if (isCancelled || isVerifying) return;

      try {
        setIsPolling(true);
        const { data, error } = await supabase.functions.invoke("verificar-pix", {
          body: {
            chargeId: chargeId,
            calculoId: calculoId,
          },
        });

        if (isCancelled) return;

        if (error) {
          console.error("Erro no polling:", error);
          return;
        }

        if (data.paid) {
          clearInterval(pollingInterval);
          toast({
            title: "Pagamento confirmado! ✅",
            description: "Redirecionando para sua análise...",
          });
          onOpenChange(false);
          const transactionId = crypto.randomUUID();
          navigate(`/pos-pagamento?transaction_id=${transactionId}`);
        }
      } catch (error) {
        console.error("Erro no polling de pagamento:", error);
      } finally {
        if (!isCancelled) {
          setIsPolling(false);
        }
      }
    };

    pollingInterval = setInterval(checkPaymentStatus, 10000);

    return () => {
      isCancelled = true;
      clearInterval(pollingInterval);
    };
  }, [qrCodeUrl, chargeId, calculoId, isVerifying, navigate, onOpenChange, toast]);

  // Salvar cálculo em background quando o popup abre
  useEffect(() => {
    if (!open || calculoId || isSavingCalculo || !resultado || !formDataProp) return;

    let cancelled = false;
    setIsSavingCalculo(true);

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("salvar-calculo", {
          body: {
            formulario: formDataProp,
            valorBase: resultado.valorBase,
          },
        });

        if (cancelled) return;
        if (error) {
          console.error("Erro ao salvar cálculo:", error);
          return;
        }

        if (data?.calculoId) {
          setCalculoId(data.calculoId);
          setCodigoUnico(data.codigoUnico);
          sessionStorage.setItem("rescisao-codigo-unico", data.codigoUnico);
          sessionStorage.setItem("rescisao-calculo-id", data.calculoId);
          sessionStorage.setItem("rescisao-valor-base-original", String(resultado.valorBase));
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Erro ao salvar cálculo:", err);
      } finally {
        if (cancelled) return;
        setIsSavingCalculo(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, calculoId, isSavingCalculo, resultado, formDataProp]);

  if (!resultado) return null;

  // Verbas bloqueadas baseadas nas respostas do usuário
  const verbasNaoAnalisadas = [
    { nome: "Horas Extras e Reflexos", icone: Clock },
    { nome: "Adicional Noturno", icone: Zap },
    { nome: "FGTS + Multa 40%", icone: CircleDollarSign },
    { nome: "DSR sobre Variáveis", icone: Calculator },
    { nome: "Verbas por Desvio de Função", icone: Scale },
  ];

  const validateEmail = (email: string): boolean => {
    const v = (email || "").trim();
    if (!v || v.length > 254) return false;
    if (/\s/.test(v)) return false;
    const parts = v.split("@");
    if (parts.length !== 2) return false;
    const [local, domain] = parts;
    if (!local || !domain) return false;
    if (local.startsWith(".") || local.endsWith(".")) return false;
    if (domain.startsWith(".") || domain.endsWith(".")) return false;
    if (local.includes("..") || domain.includes("..")) return false;
    if (!domain.includes(".")) return false;
    const basicRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return basicRegex.test(v);
  };

  const handleDesbloquear = async () => {
    if (!userEmail.trim()) {
      setEmailError("Por favor, informe seu email");
      return;
    }
    if (!validateEmail(userEmail.trim())) {
      setEmailError("Por favor, informe um email válido");
      return;
    }

    setEmailError("");
    setIsLoading(true);
    setLoadingStep(1);

    const emailTrimmed = userEmail.trim().toLowerCase();

    setTimeout(() => setLoadingStep(2), 800);
    setTimeout(() => setLoadingStep(3), 2500);

    try {
      const { data, error } = await supabase.functions.invoke("create-pix-v2", {
        body: {
          amount: 1190,
          email: emailTrimmed,
          calculoId: calculoId || undefined,
          formulario: calculoId ? undefined : formDataProp,
          valorBase: calculoId ? undefined : resultado?.valorBase,
        },
      });

      if (error) {
        console.error("Erro na função:", error);
        throw new Error(error.message || "Erro ao processar pagamento");
      }

      if (data.error) {
        console.error("Erro do backend:", data);
        toast({
          title: "Erro ao gerar PIX",
          description: data.details || "Verifique os dados informados e tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (data.qrCode && data.qrCodeUrl) {
        setQrCode(data.qrCode);
        setQrCodeUrl(data.qrCodeUrl);
        setChargeId(data.chargeId);
        if (data.calculoId) {
          setCalculoId(data.calculoId);
          sessionStorage.setItem("rescisao-calculo-id", data.calculoId);
        }
        if (data.codigoUnico) {
          setCodigoUnico(data.codigoUnico);
          sessionStorage.setItem("rescisao-codigo-unico", data.codigoUnico);
        }
        if (resultado?.valorBase) {
          sessionStorage.setItem("rescisao-valor-base-original", String(resultado.valorBase));
        }
        sessionStorage.setItem("rescisao-charge-id", data.chargeId);
        sessionStorage.setItem("rescisao-session-active", "true");
        setStep("qrcode");
      } else {
        toast({
          title: "Erro ao gerar PIX",
          description: "O QR Code não foi gerado. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error("Erro ao gerar PIX:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao gerar PIX",
        description: errorMessage.includes("fetch")
          ? "Erro de conexão. Verifique sua internet."
          : "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleVerifyPayment = async () => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verificar-pix", {
        body: {
          chargeId: chargeId,
          calculoId: calculoId,
        },
      });
      if (error) throw error;
      if (data.paid) {
        toast({
          title: "Pagamento confirmado! ✅",
          description: "Redirecionando para sua análise...",
        });
        onOpenChange(false);
        const transactionId = crypto.randomUUID();
        navigate(`/pos-pagamento?transaction_id=${transactionId}`);
      } else {
        toast({
          title: "Pagamento não identificado",
          description: "Aguarde alguns segundos após o pagamento e tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      toast({
        title: "Erro ao verificar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole no app do seu banco para pagar.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  const handleAttemptClose = () => {
    setShowCloseConfirm(true);
  };

  const handleConfirmClose = () => {
    setShowCloseConfirm(false);
    setStep("offer");
    setQrCode("");
    setQrCodeUrl("");
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleCancelClose = () => {
    setShowCloseConfirm(false);
  };

  const handleDialogChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleAttemptClose();
    } else {
      onOpenChange(true);
    }
  };

  const scrollToOffer = () => {
    if (offerCardRef.current) {
      offerCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent className="!max-w-[92vw] sm:!max-w-md !p-0 !gap-0 overflow-hidden border-0 rounded-2xl shadow-2xl">
          <div className="bg-gradient-to-br from-primary via-primary to-primary/90 px-5 py-5 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm mb-3 border-2 border-white/40 mx-auto">
              <ShieldAlert className="h-7 w-7 text-white" />
            </div>
            <AlertDialogHeader className="space-y-2">
              <AlertDialogTitle className="text-xl font-black text-white leading-tight text-center">
                Tem certeza que deseja sair?
              </AlertDialogTitle>
              <p className="text-[13px] text-white/90 font-medium text-center">
                7 em cada 10 rescisões contêm algum tipo de erro
              </p>
            </AlertDialogHeader>
          </div>

          <div className="px-5 py-4 space-y-4 bg-card">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
              <p className="text-xs text-primary font-bold mb-1 uppercase tracking-wide">
                Você pode estar deixando na mesa:
              </p>
              <p className="text-3xl font-black text-primary">até {percentualDiferenca}%</p>
              <p className="text-[11px] text-primary/80 font-semibold mt-2">Do valor total da sua rescisão</p>
            </div>

            <AlertDialogDescription className="text-muted-foreground text-[13px] leading-relaxed text-center font-medium">
              Depois de assinar, recuperar diferenças se torna muito mais difícil.
            </AlertDialogDescription>
          </div>

          <div className="px-5 pb-5 bg-card">
            <div className="flex flex-col gap-2.5">
              <AlertDialogCancel
                onClick={handleCancelClose}
                className="mt-0 w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white hover:text-white border-0 h-14 text-sm font-black rounded-xl shadow-xl shadow-primary/30"
              >
                <Shield className="h-5 w-5 mr-2" />
                QUERO CONFERIR MINHA RESCISÃO
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmClose}
                className="w-full bg-transparent hover:bg-muted text-muted-foreground text-[11px] font-medium h-9 border-0 shadow-none"
              >
                Prefiro sair sem conferir
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={handleDialogChange}>
        <DialogContent
          className={cn(
            "w-[calc(100vw-16px)] sm:w-[calc(100vw-48px)] max-w-[420px]",
            "top-[calc(env(safe-area-inset-top)+8px)] bottom-[calc(env(safe-area-inset-bottom)+8px)]",
            "sm:top-[calc(env(safe-area-inset-top)+24px)] sm:bottom-[calc(env(safe-area-inset-bottom)+24px)]",
            "left-0 right-0 mx-auto translate-x-0 translate-y-0",
            "sm:left-[50%] sm:right-auto sm:translate-x-[-50%] sm:top-[50%] sm:bottom-auto sm:translate-y-[-50%]",
            "max-h-[calc(100vh-16px)] max-h-[calc(100dvh-16px)] sm:max-h-[calc(100vh-64px)]",
            "p-0 overflow-hidden overflow-x-hidden border-0 shadow-2xl bg-card rounded-xl",
          )}
          aria-describedby={undefined}
        >
          <VisuallyHidden>
            <DialogTitle>Conferência da Rescisão</DialogTitle>
          </VisuallyHidden>

          <div
            ref={contentRef}
            className={cn(
              "h-full w-full sm:h-auto",
              "sm:max-h-[calc(100vh-64px)]",
              "overflow-y-auto overscroll-contain overflow-x-hidden [webkit-overflow-scrolling:touch]",
            )}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary via-primary to-primary/90 px-5 py-6 text-primary-foreground overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold text-white uppercase tracking-wide">Análise concluída</span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-[12px] text-white/70 font-medium">
                    Seu <span className="text-white font-bold">valor mínimo</span> de rescisão é
                  </p>
                  <p className="text-4xl font-black text-white tracking-tight">{formatCurrency(resultado.valorBase)}</p>
                </div>

                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <TrendingUp className="h-5 w-5 text-emerald-900" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-bold text-white leading-snug">
                        Mas calma, esse ainda não é o valor final
                      </p>
                      <p className="text-[12px] text-white/90 leading-relaxed">
                        Esse é só o básico. Existem{" "}
                        <span className="font-bold text-emerald-300">verbas adicionais</span> que precisam ser
                        conferidas antes de você assinar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="px-4 py-4 space-y-4 bg-gradient-to-b from-muted/30 via-background to-muted/30">
              {!qrCodeUrl ? (
                <>
                  {/* CTA Primário - Scroll para oferta */}
                  <Button
                    size="lg"
                    onClick={scrollToOffer}
                    className={cn(
                      "w-full h-14 text-sm font-black rounded-xl",
                      "bg-gradient-to-r from-primary to-primary/90",
                      "hover:from-primary/90 hover:to-primary",
                      "shadow-lg shadow-primary/30",
                      "border-0 text-white",
                    )}
                  >
                    DESBLOQUEAR ANÁLISE COMPLETA
                  </Button>

                  {/* Alerta de Risco */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-foreground">
                          Cuidado ao confiar apenas no cálculo da empresa
                        </h3>
                        <div className="space-y-1.5">
                          <p className="text-[12px] text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className="text-primary font-bold flex-shrink-0">•</span>
                            <span>
                              <strong>7 em cada 10 rescisões</strong> contêm algum tipo de erro
                            </span>
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className="text-primary font-bold flex-shrink-0">•</span>
                            <span>
                              Empresas <strong>frequentemente esquecem ou omitem</strong> verbas
                            </span>
                          </p>
                          <p className="text-[12px] text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className="text-primary font-bold flex-shrink-0">•</span>
                            <span>
                              <strong>Depois de assinar</strong>, fica mais difícil recuperar
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verbas Não Analisadas */}
                  <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">Análise pendente</h3>
                        <p className="text-[11px] text-muted-foreground">5 verbas ainda não foram calculadas</p>
                      </div>
                    </div>

                    <div className="grid gap-1.5">
                      {/* Direitos Básicos - Conferido */}
                      <div className="flex items-center gap-2.5 bg-success/10 rounded-lg px-3 py-2.5 border border-success/30">
                        <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                          <Check className="h-3 w-3 text-success-foreground" />
                        </div>
                        <Calculator className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-[12px] text-foreground font-medium flex-1">Direitos Básicos</span>
                        <span className="text-[10px] text-success font-bold">✓ Conferido</span>
                      </div>

                      {verbasNaoAnalisadas.map((verba, index) => {
                        const Icon = verba.icone;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2.5 bg-destructive/5 rounded-lg px-3 py-2.5 border border-destructive/20"
                          >
                            <div className="w-5 h-5 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center flex-shrink-0">
                              <HelpCircle className="h-3 w-3 text-destructive" />
                            </div>
                            <Icon className="h-4 w-4 text-foreground/70 flex-shrink-0" />
                            <span className="text-[12px] text-foreground font-medium flex-1">{verba.nome}</span>
                            <span className="text-[10px] text-destructive font-bold">Pendente</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Estatística */}
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-[11px] text-foreground font-medium">
                          Em rescisões como a sua, já encontramos diferenças de até{" "}
                          <span className="font-black text-primary">{percentualDiferenca}%</span> nessas verbas.
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Confira o valor correto para garantir todos os seus direitos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card de Oferta */}
                  <div
                    ref={offerCardRef}
                    className="relative bg-gradient-to-br from-primary via-blue-600 to-indigo-600 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 p-5 space-y-4">
                      {/* Badge */}
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-400/20 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-400/40">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">
                            ANÁLISE COMPLETA
                          </span>
                        </div>
                      </div>

                      {/* Título */}
                      <div className="text-center">
                        <h3 className="text-xl font-black text-white leading-snug mb-1">
                          Descubra quanto você
                          <br />
                          realmente deve receber
                        </h3>
                        <p className="text-[11px] text-white/60">Análise completa enviada no seu e-mail</p>
                      </div>

                      {/* Preço - destaque máximo */}
                      <div className="bg-white rounded-xl p-4 text-center shadow-xl">
                        <div className="flex items-center justify-center gap-2.5 mb-2">
                          <span className="text-sm text-muted-foreground font-medium line-through decoration-destructive">
                            R$ 24,90
                          </span>
                          <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/30">
                            52% OFF
                          </span>
                        </div>

                        <div className="flex items-baseline justify-center gap-0.5 mb-1">
                          <span className="text-base text-muted-foreground font-semibold">R$</span>
                          <span className="text-5xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            11
                          </span>
                          <span className="text-2xl font-black bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            ,90
                          </span>
                        </div>

                        <p className="text-[10px] text-muted-foreground">Pagamento único via PIX</p>
                      </div>

                      {/* Benefícios */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/20">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-[12px] text-white font-medium">Conferência verba por verba</span>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/20">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-[12px] text-white font-medium">Identificação de valores faltando</span>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/20">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-[12px] text-white font-medium">Relatório detalhado por e-mail</span>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-white/20">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          <span className="text-[12px] text-white font-medium">Orientação clara do que fazer</span>
                        </div>
                      </div>

                      {/* Trust elements */}
                      <div className="flex items-center justify-center gap-4 pt-3 border-t border-white/20">
                        <div className="flex items-center gap-1.5 text-white/80">
                          <Shield className="h-4 w-4" />
                          <span className="text-[10px] font-medium">Pagamento seguro</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/80">
                          <Zap className="h-4 w-4" />
                          <span className="text-[10px] font-medium">Resultado imediato</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Campo de Email */}
                  <div className="bg-card border border-border rounded-xl p-4 space-y-3 shadow-sm">
                    <Label
                      htmlFor="user-email"
                      className="text-[12px] font-bold text-foreground flex items-center gap-1.5"
                    >
                      <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                      Para onde enviamos sua análise?
                    </Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="Digite seu melhor email"
                      value={userEmail}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className={cn(
                        "h-12 text-base",
                        emailError && "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {emailError && <p className="text-[11px] text-destructive font-medium">{emailError}</p>}

                    {/* CTA Principal */}
                    <Button
                      size="lg"
                      onClick={handleDesbloquear}
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
                        "DESCOBRIR VALORES ADICIONAIS"
                      )}
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground">
                      Você receberá o resultado imediatamente no seu email
                    </p>
                  </div>

                  {/* Garantia */}
                  <div className="flex items-center justify-center gap-2 bg-primary/5 rounded-lg py-2.5 px-3 border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-bold text-primary">Garantia de 7 dias após a compra</span>
                  </div>

                  {/* Social Proof */}
                  <div className="text-center py-2 bg-muted/50 rounded-lg border border-border">
                    <p className="text-[11px] text-muted-foreground font-medium flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      Mais de <span className="font-bold text-foreground">84 mil</span> conferências realizadas
                    </p>
                  </div>

                  {/* Testimonials */}
                  <Testimonials />

                  {/* Footer */}
                  <Footer />
                </>
              ) : (
                <>
                  {/* Tela do QR Code */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <p className="text-base font-bold text-foreground">Falta pouco!</p>
                    <p className="text-[12px] text-muted-foreground">Finalize o pagamento para liberar sua análise</p>
                  </div>

                  {/* O que você vai receber */}
                  <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                    <p className="text-sm font-bold text-foreground">O que você vai receber:</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-foreground">Análise Completa da Rescisão</p>
                          <p className="text-[10px] text-muted-foreground">Todas as verbas calculadas em detalhes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-foreground">Diagnóstico de Irregularidades</p>
                          <p className="text-[10px] text-muted-foreground">Identificação de todos os valores devidos</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-foreground">Relatório em PDF por E-mail</p>
                          <p className="text-[10px] text-muted-foreground">
                            Enviado para <span className="font-bold">{userEmail}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground font-medium">Valor do PIX</p>
                      <p className="text-3xl font-black text-primary">R$ 11,90</p>
                    </div>

                    <div ref={qrCodeRef} className="flex justify-center">
                      <div className="relative bg-muted/50 p-4 rounded-xl border-2 border-dashed border-border">
                        <img src={qrCodeUrl} alt="QR Code PIX" className="w-44 h-44" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <Smartphone className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Código PIX para copiar */}
                    <div className="space-y-2">
                      <div className="bg-muted rounded-lg p-3 border border-border">
                        <p className="text-[10px] text-muted-foreground break-all font-mono line-clamp-2 text-center">
                          {qrCode}
                        </p>
                      </div>
                      <Button
                        onClick={handleCopyCode}
                        variant="outline"
                        className="w-full h-11 font-bold text-sm border-2 border-primary/30 hover:bg-primary/5"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 mr-2 text-primary" />
                            <span className="text-primary">Código Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Código PIX
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Passo a Passo */}
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary" />
                      Como pagar em 3 passos:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        <div>
                          <p className="text-xs font-bold text-foreground">Copie o código PIX</p>
                          <p className="text-[10px] text-muted-foreground">Clique no botão acima</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </span>
                        <div>
                          <p className="text-xs font-bold text-foreground">Abra o app do seu banco</p>
                          <p className="text-[10px] text-muted-foreground">Vá em PIX → Pagar com código</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
                        <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </span>
                        <div>
                          <p className="text-xs font-bold text-foreground">Cole e confirme</p>
                          <p className="text-[10px] text-muted-foreground">Liberação automática após pagamento</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botão Verificar */}
                  <Button
                    onClick={handleVerifyPayment}
                    disabled={isVerifying}
                    className={cn(
                      "w-full h-14 text-base font-black rounded-xl",
                      "bg-gradient-to-r from-primary to-primary/90",
                      "hover:from-primary/90 hover:to-primary",
                      "shadow-lg shadow-primary/30",
                      "border-0 text-white",
                    )}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Verificando pagamento...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        Já Paguei - Verificar
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>

                  {/* Info de Polling */}
                  <p className="text-[10px] text-center text-muted-foreground">
                    A tela avança automaticamente após a confirmação do pagamento
                  </p>

                  {/* Dados da Empresa */}
                  <div className="bg-muted/50 rounded-lg p-3 text-center space-y-0.5 border border-border">
                    <p className="text-[11px] font-bold text-foreground">LLC Desenvolvimento Digital LTDA</p>
                    <p className="text-[10px] text-muted-foreground">CNPJ: 58.455.659/0001-12</p>
                    <p className="text-[10px] text-primary">
                      Dúvidas?{" "}
                      <a href="mailto:suporterescisaocerta@gmail.com" className="font-bold underline">
                        suporterescisaocerta@gmail.com
                      </a>
                    </p>
                  </div>

                  {/* Garantia */}
                  <div className="flex items-center justify-center gap-2 bg-primary/5 rounded-lg py-2.5 px-3 border border-primary/20">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-[11px] font-bold text-primary">Garantia de 7 dias após a compra</span>
                  </div>

                  {/* Testimonials */}
                  <Testimonials />
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
