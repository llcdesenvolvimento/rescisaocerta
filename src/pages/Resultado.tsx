import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TrendingUp, CheckCircle2, Shield, AlertTriangle, ShieldAlert, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { calcularRescisaoCompleta } from "@/lib/calculadora-rescisao-completa";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/layout/Logo";
import { usePixPayment } from "@/hooks/usePixPayment";
import { useSaveCalculo } from "@/hooks/useSaveCalculo";
import { QRCodeSection } from "@/components/resultado/QRCodeSection";
import { OfferCard } from "@/components/resultado/OfferCard";
import { EmailForm } from "@/components/resultado/EmailForm";
import { VerbasList } from "@/components/resultado/VerbasList";
import { getActiveQuestions } from "@/components/quiz-funnel/questions";
function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
export default function Resultado() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [userName, setUserName] = useState("");
  const [nameError, setNameError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const offerCardRef = useRef<HTMLDivElement>(null);
  const faltaPoucoRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const emailFormRef = useRef<HTMLDivElement>(null);

  // Recuperar dados do formulário diretamente do Supabase pelo ?qid= da URL.
  // Sem sessionStorage — link funciona em qualquer browser/dispositivo.
  const [formData, setFormData] = useState<Record<string, unknown> | null>(null);
  const [isLoadingFormData, setIsLoadingFormData] = useState(true);
  const [quizSessionMissing, setQuizSessionMissing] = useState(false);

  // Importante: dependência tem que ser o VALOR de qid, não o objeto searchParams,
  // senão qualquer mudança em outro param (ex.: navigate de /resultado pra /pagamento)
  // dispara nova busca + refresh visual.
  const qidFromUrl = searchParams.get("qid") || searchParams.get("id") || "";
  useEffect(() => {
    if (!qidFromUrl) {
      setIsLoadingFormData(false);
      setQuizSessionMissing(true);
      return;
    }

    let cancelled = false;
    setIsLoadingFormData(true);

    (async () => {
      try {
        const { data, error } = await supabase
          .from("quiz_sessions")
          .select("respostas")
          .eq("id", qidFromUrl)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          console.warn("[Resultado] erro Supabase:", error);
          setQuizSessionMissing(true);
          return;
        }

        const respostas = data?.respostas as Record<string, unknown> | undefined;

        // Sessão não existe OU está vazia (sem respostas mínimas para o cálculo)
        const semCalculoMinimo = !respostas ||
          !respostas.salarioFixo ||
          !respostas.dataAdmissao ||
          !respostas.dataDesligamento ||
          !respostas.tipoDesligamento;

        if (semCalculoMinimo) {
          console.warn("[Resultado] quiz_session sem dados suficientes:", qidFromUrl, respostas);
          setQuizSessionMissing(true);
          return;
        }

        setFormData(respostas);
      } catch (err) {
        console.error("[Resultado] erro ao buscar quiz_session:", err);
        setQuizSessionMissing(true);
      } finally {
        if (!cancelled) setIsLoadingFormData(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [qidFromUrl]);

  // Calcular resultado
  const resultado = useMemo(() => {
    if (
      !formData?.salarioFixo ||
      !formData?.dataAdmissao ||
      !formData?.dataDesligamento ||
      !formData?.tipoDesligamento
    ) {
      return null;
    }
    return calcularRescisaoCompleta(formData);
  }, [formData]);

  // Percentual de risco — derivado deterministicamente do qid (sem cache)
  const riskPercent = useMemo(() => {
    const sessionId = searchParams.get("qid") || searchParams.get("id") || "";
    const hash = sessionId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const allowedPercents = [68, 69, 71, 72, 73, 74, 76, 77, 78, 79, 81, 82, 83, 84];
    return allowedPercents[hash % allowedPercents.length];
  }, [searchParams]);

  // Hooks customizados
  const { calculoId, setCalculoId, setCodigoUnico } = useSaveCalculo({
    formData,
    valorBase: resultado?.valorBase,
    valorBruto: resultado?.valorBruto,
    totalDescontos: resultado?.totalDescontos,
    valorPotencial: resultado?.valorPotencial,
    verbas: resultado?.verbas,
    modulosExtras: resultado?.modulosOportunidade,
    tipoRescisao: resultado?.tipoRescisao,
    mesesTrabalhados: resultado?.mesesTrabalhados,
    detalhamento: resultado?.detalhamento as unknown as Record<string, number>,
  });
  const { isLoading, loadingStep, qrCode, qrCodeUrl, copied, isVerifying, generatePix, verifyPayment, copyCode, recoveredName, recoveredEmail } =
    usePixPayment({
      calculoId,
      formData,
      valorBase: resultado?.valorBase,
    });

  // Quando o usuário recarrega a página e há pagamento pendente no banco,
  // popular nome/email com os valores recuperados (pra mostrar no QR section)
  useEffect(() => {
    if (recoveredName && !userName) setUserName(recoveredName);
    if (recoveredEmail && !userEmail) setUserEmail(recoveredEmail);
  }, [recoveredName, recoveredEmail, userName, userEmail]);

  // Migra ?id= legado para ?qid=. Se URL não tem nenhum dos dois, redireciona
  // pra home (sem qid não há como buscar a quiz_session).
  useEffect(() => {
    const qid = searchParams.get("qid");
    const legacyId = searchParams.get("id");

    if (!qid && !legacyId) {
      navigate("/", { replace: true });
      return;
    }
    if (!qid && legacyId) {
      setSearchParams({ qid: legacyId }, { replace: true });
    }
  }, [searchParams, setSearchParams, navigate]);

  // Scroll para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  // Interceptar botão de voltar do navegador (apenas em /resultado, não em /pagamento)
  useEffect(() => {
    // Em /pagamento o usuário já gerou o QR Code, não interceptar
    if (window.location.pathname === "/pagamento") return;

    // Adicionar entrada no histórico para poder interceptar
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // Prevenir navegação e mostrar confirmação
      window.history.pushState(null, '', window.location.href);
      setShowExitConfirm(true);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Hardening: garantir scroll liberado quando o dialog fecha (Radix scroll-lock)
  useEffect(() => {
    if (!showExitConfirm) {
      // Radix Dialog/AlertDialog usa RemoveScroll que pode deixar resíduos
      // Restaura body/html para o estado padrão sempre que o dialog fecha
      const reset = () => {
        document.body.style.overflow = "";
        document.body.style.pointerEvents = "";
        document.body.style.paddingRight = "";
        document.documentElement.style.overflow = "";
      };
      reset();
      // segunda passada após o ciclo de animação do Radix terminar
      const t = setTimeout(reset, 350);
      return () => clearTimeout(t);
    }
  }, [showExitConfirm]);

  // Garantir que ao desmontar a tela (navegação), nada sobre travado
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // Redirecionar para home apenas se confirmou que NÃO há quiz_session no banco
  // (não redireciona enquanto está carregando do Supabase).
  useEffect(() => {
    if (isLoadingFormData) return; // ainda buscando
    if (!resultado && quizSessionMissing) {
      navigate("/");
    }
  }, [resultado, isLoadingFormData, quizSessionMissing, navigate]);

  // Auto-scroll e mudança de URL quando QR Code é gerado.
  // Depende de `qidFromUrl` (string), não de `searchParams` (objeto), pra não
  // re-rodar quando algum outro param mudar.
  useEffect(() => {
    if (!qrCodeUrl) return;
    if (window.location.pathname !== "/pagamento" && qidFromUrl) {
      navigate(`/pagamento?qid=${qidFromUrl}`, { replace: true });
    }

    if (faltaPoucoRef.current) {
      setTimeout(() => {
        const element = faltaPoucoRef.current;
        if (element) {
          const headerHeight = 72;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, [qrCodeUrl, qidFromUrl, navigate]);
  const validateEmail = useCallback((email: string): boolean => {
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
  }, []);
  const handleDesbloquear = useCallback(async () => {
    let hasError = false;
    if (!userName.trim() || userName.trim().length < 2) {
      setNameError("Por favor, informe seu nome");
      hasError = true;
    } else {
      setNameError("");
    }
    if (!userEmail.trim()) {
      setEmailError("Por favor, informe seu email");
      hasError = true;
    } else if (!validateEmail(userEmail.trim())) {
      setEmailError("Por favor, informe um email válido");
      hasError = true;
    } else {
      setEmailError("");
    }
    if (hasError) return;

    // Bypass para teste: liberar acesso direto ao relatório.
    // Registra um pagamento fake `paid` para que os upsells reconheçam o bypass
    // (eles consultam o email do pagamento mais recente em `pagamentos`).
    if (userEmail.trim().toLowerCase() === "liberaragora@gmail.com") {
      if (!calculoId) {
        // Aguarda o useSaveCalculo terminar (raro, mas possível)
        return;
      }
      try {
        await supabase.from("pagamentos").insert({
          calculo_id: calculoId,
          email: "liberaragora@gmail.com",
          nome: userName || "Bypass",
          amount_cents: 0,
          status: "pago",
          provider: "bypass",
          paid_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Erro ao registrar bypass:", err);
      }
      navigate(`/relatorio?id=${calculoId}`);
      return;
    }
    await generatePix(userEmail, userName);
  }, [userName, userEmail, validateEmail, generatePix, navigate, calculoId]);
  const handleNameChange = useCallback(
    (name: string) => {
      setUserName(name);
      if (nameError) setNameError("");
    },
    [nameError],
  );
  const handleEmailChange = useCallback(
    (email: string) => {
      setUserEmail(email);
      if (emailError) setEmailError("");
    },
    [emailError],
  );
  const handleBackClick = useCallback(() => {
    setShowExitConfirm(true);
  }, []);
  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false);
    // Voltar para a tela de pré-resultado.
    // Se o usuário respondeu o bloco extras, volta para a última pergunta das extras;
    // caso contrário, volta para a última pergunta do bloco essencial.
    const quizId = searchParams.get("qid") || searchParams.get("id") || "";
    const qidParam = quizId ? `&qid=${quizId}` : "";

    if (formData) {
      try {
        const respostas = formData;
        const respondeuExtras = !!respostas.faziaHorasExtras;
        const activeQuestions = getActiveQuestions(respostas, {
          mode: respondeuExtras ? 'extras' : 'essencial',
        });
        const extrasFlag = respondeuExtras ? '?extras=1' : '?';
        navigate(`/quiz/${activeQuestions.length}${extrasFlag}${qidParam.replace(/^&/, respondeuExtras ? '&' : '')}`, {
          state: { returnToScreen: 'problem' },
        });
        return;
      } catch {}
    }
    navigate(`/quiz/1${quizId ? `?qid=${quizId}` : ''}`);
  }, [navigate, searchParams, formData]);
  const scrollToOffer = useCallback(() => {
    offerCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);
  const scrollToEmailForm = useCallback(() => {
    if (emailFormRef.current) {
      const headerHeight = 72;
      const elementPosition = emailFormRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: "smooth",
      });
    }
  }, []);
  const scrollToQrCode = useCallback(() => {
    if (qrCodeRef.current) {
      const headerHeight = 72;
      const elementPosition = qrCodeRef.current.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: "smooth",
      });
    }
  }, []);
  // Loading enquanto busca quiz_sessions no banco
  if (isLoadingFormData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 mx-auto border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando seu resultado...</p>
        </div>
      </div>
    );
  }
  if (!resultado) return null;
  return (
    <>
      {/* Exit Confirmation Dialog — montado só quando aberto para evitar scroll-lock residual do Radix */}
      {showExitConfirm && (
      <AlertDialog open={showExitConfirm} onOpenChange={setShowExitConfirm}>
        <AlertDialogContent className="w-[calc(100vw-32px)] max-w-sm mx-auto p-0 gap-0 overflow-hidden border-0 rounded-2xl shadow-2xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-br from-primary via-primary to-primary/90 px-4 py-5 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-3 border-2 border-white/40 mx-auto">
              <ShieldAlert className="h-6 w-6 text-white" />
            </div>
            <AlertDialogHeader className="space-y-1.5">
              <AlertDialogTitle className="text-lg font-black text-white leading-tight text-center">
                Tem certeza que quer sair?
              </AlertDialogTitle>
              <p className="text-xs text-white/90 font-medium text-center">
                Sua análise está pronta. Falta só conferir.
              </p>
            </AlertDialogHeader>
          </div>

          <div className="px-4 py-4 space-y-3 bg-card">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
              <p className="text-[10px] text-primary font-bold mb-1 uppercase tracking-wide">
                Com base no que você informou:
              </p>
              <p className="text-2xl font-black text-primary">{riskPercent}%</p>
              <p className="text-[10px] text-primary/80 font-semibold mt-1">de chance de você ter direito a mais</p>
            </div>

            <AlertDialogDescription className="text-muted-foreground text-xs leading-relaxed text-center font-medium">
              Depois de assinar a rescisão, cobrar diferença fica muito mais difícil.
            </AlertDialogDescription>
          </div>

          <div className="px-4 pb-4 bg-card">
            <div className="flex flex-col gap-2">
              <AlertDialogCancel
                onClick={() => setShowExitConfirm(false)}
                className="mt-0 w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white hover:text-white border-0 h-12 text-sm font-black rounded-xl shadow-lg shadow-primary/30"
              >
                <Shield className="h-4 w-4 mr-2" />
                Quero conferir minha rescisão
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmExit}
                className="w-full bg-transparent hover:bg-muted text-muted-foreground text-[10px] font-medium h-8 border-0 shadow-none"
              >
                Prefiro sair sem conferir
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      )}

      <div className="min-h-screen bg-background">
        {/* Header fixo */}
        <header className="sticky top-0 z-50 bg-primary shadow-lg">
          <div className="container relative mx-auto flex h-16 sm:h-20 items-center px-3 sm:px-4">
            <button
              onClick={handleBackClick}
              className="relative z-10 flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Voltar</span>
            </button>
            <Link
              to="/test"
              aria-label="Rescisão Certa - Início"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Logo variant="light" size="md" />
            </Link>
          </div>
        </header>

        <main ref={contentRef} className="pb-6">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/8 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
            </div>

            <div className="relative z-10 px-4 py-8 space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm text-white/70 font-medium uppercase tracking-wider">Valor mínimo da sua rescisão</p>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none py-1">
                  {formatCurrency(resultado.valorBase)}
                </p>
                <p className="text-[11px] text-white/60 font-medium">Valor base calculado com as informações que você passou</p>
              </div>

              <div className="max-w-md mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-destructive/90 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-destructive/30">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white leading-snug">Esse valor não considera todos os seus direitos</p>
                    <p className="text-[12px] text-white/80 leading-relaxed">
                      Considerando suas respostas, existem valores extras que você tem direito a receber. A análise completa mostra tudo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparação lado a lado */}
          <div className="mx-auto px-3 -mt-4 max-w-lg relative z-10">
            <div className="flex items-stretch gap-2">
              <div className="flex-1 bg-card rounded-xl p-3 border border-border shadow-md">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1 font-semibold">Valor base</p>
                <p className="text-base font-black text-foreground">{formatCurrency(resultado.valorBase)}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">Saldo, férias, 13º, FGTS</p>
              </div>

              <div
                className="flex-1 bg-card rounded-xl p-3 border border-primary/30 shadow-md cursor-pointer hover:border-primary/50 transition-colors"
                onClick={scrollToOffer}
              >
                <p className="text-[9px] text-primary uppercase tracking-wide mb-1 font-semibold">Valores extras</p>
                <p className="text-base font-black text-primary blur-[6px] select-none">
                  {formatCurrency(resultado.valorBase * (1 + riskPercent / 100))}
                </p>
                <p className="text-[9px] text-primary/70 mt-0.5">Análise completa</p>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="mx-auto px-3 py-4 max-w-lg space-y-4">
            {/* Verbas Analisadas */}
            <VerbasList
              valorBase={resultado.valorBase}
              percentualDiferenca={riskPercent}
              formatCurrency={formatCurrency}
              verbasBasicas={resultado.verbas}
            />

            {/* Alerta de Risco - OCULTO TEMPORARIAMENTE PARA TESTE */}
            {false && (
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
            )}

            {!qrCodeUrl ? (
              <>
                {/* Card de Oferta — contém preço, form de captura e bullets */}
                <div ref={emailFormRef}>
                  <OfferCard
                    ref={offerCardRef}
                    userName={userName}
                    userEmail={userEmail}
                    nameError={nameError}
                    emailError={emailError}
                    isLoading={isLoading}
                    loadingStep={loadingStep}
                    onNameChange={handleNameChange}
                    onEmailChange={handleEmailChange}
                    onSubmit={handleDesbloquear}
                  />
                </div>

              </>
            ) : (
              <div ref={faltaPoucoRef}>
                <QRCodeSection
                  ref={qrCodeRef}
                  qrCode={qrCode}
                  qrCodeUrl={qrCodeUrl}
                  userName={userName}
                  userEmail={userEmail}
                  copied={copied}
                  onCopyCode={copyCode}
                />
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
