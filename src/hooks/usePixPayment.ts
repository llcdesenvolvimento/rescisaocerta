import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UsePixPaymentOptions {
  calculoId: string;
  formData: Record<string, unknown> | null;
  valorBase: number | undefined;
}

/**
 * usePixPayment — orquestra a geração do PIX e o polling de confirmação.
 *
 * Persistência: TUDO no banco (sem sessionStorage). Ao montar, busca o último
 * pagamento pendente em `public.pagamentos` filtrando por `calculo_id` — se
 * houver, restaura o QR Code. F5 funciona porque o estado vem do banco.
 */
export function usePixPayment({ calculoId: initialCalculoId, formData, valorBase }: UsePixPaymentOptions) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [qrCode, setQrCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [chargeId, setChargeId] = useState("");
  const [calculoId, setCalculoId] = useState(initialCalculoId);
  const [codigoUnico, setCodigoUnico] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  // Nome/email do pagamento (recuperados do banco em F5)
  const [recoveredName, setRecoveredName] = useState("");
  const [recoveredEmail, setRecoveredEmail] = useState("");

  // Sincroniza com `calculoId` recebido por prop (vem do useSaveCalculo)
  useEffect(() => {
    if (initialCalculoId && initialCalculoId !== calculoId) {
      setCalculoId(initialCalculoId);
    }
  }, [initialCalculoId, calculoId]);

  // Recupera pagamento pendente do banco quando o calculoId estiver disponível.
  // Permite F5 e link em outro navegador continuarem mostrando o QR Code.
  useEffect(() => {
    if (!calculoId || qrCodeUrl) return;

    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from("pagamentos")
          .select("qr_code, qr_code_url, provider_charge_id, status, nome, email")
          .eq("calculo_id", calculoId)
          .in("status", ["pendente", "pago"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (cancelled || error || !data) return;
        if (data.qr_code && data.qr_code_url) {
          setQrCode(data.qr_code);
          setQrCodeUrl(data.qr_code_url);
          if (data.provider_charge_id) setChargeId(data.provider_charge_id);
          if (data.nome) setRecoveredName(data.nome);
          if (data.email) setRecoveredEmail(data.email);
        }
      } catch (err) {
        console.warn("[usePixPayment] erro ao recuperar pagamento pendente:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [calculoId, qrCodeUrl]);

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
          // Vai direto para o relatório; o popup "Pagamento confirmado!" é
          // exibido lá quando a URL traz `?paid=1`.
          const params = new URLSearchParams();
          if (calculoId) params.set('id', calculoId);
          params.set('paid', '1');
          navigate(`/relatorio?${params.toString()}`);
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

  const generatePix = useCallback(async (email: string, userName?: string) => {
    setIsLoading(true);
    setLoadingStep(1);

    const emailTrimmed = email.trim().toLowerCase();
    const BYPASS_EMAIL = "jpabreupontes@gmail.com";
    const amount = emailTrimmed === BYPASS_EMAIL ? 1 : 1690;

    setTimeout(() => setLoadingStep(2), 800);
    setTimeout(() => setLoadingStep(3), 2500);

    try {
      if (!calculoId) {
        console.warn("[usePixPayment] generatePix chamado sem calculoId. initialCalculoId:", initialCalculoId);
        toast({
          title: "Aguarde",
          description: "Estamos salvando seu cálculo. Tente novamente em alguns segundos.",
          variant: "destructive",
        });
        return false;
      }

      console.log("[usePixPayment] gerando PIX com calculoId:", calculoId);

      const quizSessionId = searchParams.get("qid") || searchParams.get("id") || undefined;

      const { data, error } = await supabase.functions.invoke("create-pix", {
        body: {
          calculoId,
          quizSessionId,
          amount,
          email: emailTrimmed,
          nome: userName,
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
        if (data.calculoId) setCalculoId(data.calculoId);
        if (data.codigoUnico) setCodigoUnico(data.codigoUnico);
        return true;
      } else {
        toast({
          title: "Erro ao gerar PIX",
          description: "O QR Code não foi gerado. Tente novamente.",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      console.error("[usePixPayment] erro:", err);
      toast({
        title: "Erro ao processar pagamento",
        description: err instanceof Error ? err.message : "Erro inesperado",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  }, [calculoId, searchParams, toast]);

  const verifyPayment = useCallback(async () => {
    if (!chargeId || isVerifying) return;
    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke("verificar-pix", {
        body: { chargeId, calculoId },
      });

      if (error) throw new Error(error.message);

      if (data.paid) {
        const params = new URLSearchParams();
        if (calculoId) params.set('id', calculoId);
        params.set('paid', '1');
        navigate(`/relatorio?${params.toString()}`);
      } else {
        toast({
          title: "Pagamento ainda não confirmado",
          description: "Aguarde alguns instantes e tente novamente.",
        });
      }
    } catch (err) {
      console.error("[usePixPayment] verifyPayment erro:", err);
    } finally {
      setIsVerifying(false);
    }
  }, [chargeId, calculoId, isVerifying, navigate, toast]);

  const copyCode = useCallback(() => {
    if (!qrCode) return;
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [qrCode]);

  return {
    isLoading,
    loadingStep,
    qrCode,
    qrCodeUrl,
    chargeId,
    calculoId,
    codigoUnico,
    copied,
    isVerifying,
    recoveredName,
    recoveredEmail,
    generatePix,
    verifyPayment,
    copyCode,
    setCalculoId,
    setCodigoUnico,
  };
}
