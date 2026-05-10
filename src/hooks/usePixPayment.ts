import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UsePixPaymentOptions {
  calculoId: string;
  formData: Record<string, unknown> | null;
  valorBase: number | undefined;
}

export function usePixPayment({ calculoId: initialCalculoId, formData, valorBase }: UsePixPaymentOptions) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [chargeId, setChargeId] = useState("");
  const [calculoId, setCalculoId] = useState(initialCalculoId);
  const [codigoUnico, setCodigoUnico] = useState(() => sessionStorage.getItem("rescisao-codigo-unico") || "");
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Polling automático para verificar pagamento
  useEffect(() => {
    if (!qrCodeUrl || !chargeId) return;

    let isCancelled = false;
    let pollingInterval: ReturnType<typeof setInterval>;

    const checkPaymentStatus = async () => {
      if (isCancelled || isVerifying) return;

      try {
        const { data, error } = await supabase.functions.invoke("verificar-pix", {
          body: { chargeId, calculoId },
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
          const transactionId = crypto.randomUUID();
          navigate(`/pos-pagamento?transaction_id=${transactionId}&payment_id=${chargeId}`);
        }
      } catch (error) {
        console.error("Erro no polling de pagamento:", error);
      }
    };

    pollingInterval = setInterval(checkPaymentStatus, 10000);

    return () => {
      isCancelled = true;
      clearInterval(pollingInterval);
    };
  }, [qrCodeUrl, chargeId, calculoId, isVerifying, navigate, toast]);

  const generatePix = useCallback(async (email: string) => {
    setIsLoading(true);
    setLoadingStep(1);

    const emailTrimmed = email.trim().toLowerCase();
    const BYPASS_EMAIL = 'jpabreupontes@gmail.com';
    const amount = emailTrimmed === BYPASS_EMAIL ? 1 : 1690;

    setTimeout(() => setLoadingStep(2), 800);
    setTimeout(() => setLoadingStep(3), 2500);

    try {
      const { data, error } = await supabase.functions.invoke("create-pix-v2", {
        body: {
          amount,
          email: emailTrimmed,
          calculoId: calculoId || undefined,
          formulario: calculoId ? undefined : formData,
          valorBase: calculoId ? undefined : valorBase,
        },
      });

      if (error) {
        throw new Error(error.message || "Erro ao processar pagamento");
      }

      if (data.error) {
        toast({
          title: "Erro ao gerar PIX",
          description: data.details || "Verifique os dados informados e tente novamente.",
          variant: "destructive",
        });
        return false;
      }

      if (data.qrCode && data.qrCodeUrl) {
        setQrCode(data.qrCode);
        setQrCodeUrl(data.qrCodeUrl);
        setChargeId(data.chargeId);
        sessionStorage.setItem("rescisao-pix-code", data.qrCode);

        if (data.calculoId) {
          setCalculoId(data.calculoId);
          sessionStorage.setItem("rescisao-calculo-id", data.calculoId);
        }
        if (data.codigoUnico) {
          setCodigoUnico(data.codigoUnico);
          sessionStorage.setItem("rescisao-codigo-unico", data.codigoUnico);
        }
        if (valorBase) {
          sessionStorage.setItem("rescisao-valor-base-original", String(valorBase));
        }
        sessionStorage.setItem("rescisao-charge-id", data.chargeId);
        sessionStorage.setItem("rescisao-session-active", "true");
        sessionStorage.setItem("rescisao-email", emailTrimmed);
        return true;
      } else {
        toast({
          title: "Erro ao gerar PIX",
          description: "O QR Code não foi gerado. Tente novamente.",
          variant: "destructive",
        });
        return false;
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
      return false;
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  }, [calculoId, formData, valorBase, toast]);

  const verifyPayment = useCallback(async () => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke("verificar-pix", {
        body: { chargeId, calculoId },
      });

      if (error) throw error;

      if (data.paid) {
        toast({
          title: "Pagamento confirmado! ✅",
          description: "Redirecionando para sua análise...",
        });
        const transactionId = crypto.randomUUID();
        navigate(`/pos-pagamento?transaction_id=${transactionId}&payment_id=${chargeId}`);
        return true;
      } else {
        toast({
          title: "Pagamento não identificado",
          description: "Aguarde alguns segundos após o pagamento e tente novamente.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      toast({
        title: "Erro ao verificar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, [chargeId, calculoId, navigate, toast]);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(qrCode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "Cole no app do seu banco para pagar.",
        duration: 2500,
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente.",
        variant: "destructive",
      });
    }
  }, [qrCode, toast]);

  return {
    isLoading,
    loadingStep,
    qrCode,
    qrCodeUrl,
    chargeId,
    calculoId,
    setCalculoId,
    codigoUnico,
    setCodigoUnico,
    isVerifying,
    copied,
    generatePix,
    verifyPayment,
    copyCode,
  };
}
