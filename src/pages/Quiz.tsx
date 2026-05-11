import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { QuizQuestionScreen } from '@/components/quiz-funnel/QuizQuestionScreen';
import { QuizLoading } from '@/components/quiz-funnel/QuizLoading';
import { QuizRiskScreen } from '@/components/quiz-funnel/QuizRiskScreen';
import { QuizIntermediateScreen } from '@/components/quiz-funnel/QuizIntermediateScreen';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getActiveQuestions, getCurrentEtapa, getTotalEtapas } from '@/components/quiz-funnel/questions';
import { FormData } from '@/types/rescisao';
import { useFunnelTracking } from '@/hooks/useFunnelTracking';
import { useQuizSession } from '@/hooks/useQuizSession';
import { supabase } from '@/integrations/supabase/client';

// Estado inicial do formulário
const defaultFormData: Partial<FormData> = {
  situacaoAtual: '',
  objetivo: '',
  tipoDesligamento: '',
  dataAdmissao: '',
  dataDesligamento: '',
  aindaTrabalhando: false,
  salarioFixo: 0,
  mediaVariavel: 0,
  temVariavel: false,
  periodosFeriasVencidas: undefined as unknown as number,
  mesesDesdeUltimaFerias: undefined as unknown as number,
  mesesTrabalhados2026: 0,
  tipoAvisoPrevio: '',
  anosServico: 0,
  saldoFGTS: 0,
  sabeSaldoFGTS: undefined,
  numDependentes: 0,
  faziaHorasExtras: '',
  bancoHoras: '',
  controlePonto: '',
  exerciaFuncoesDiferentes: '',
  funcoesDiferentes: '',
  diferencaSalarialEstimada: 0,
  valorPorFora: '',
  valorPorForaMensal: 0,
  adicionaisTrabalho: [],
  recebiaAdicionalNoturno: '',
  horasNoturnasSemana: '',
  grauInsalubridade: '',
  recebiaInsalubridade: '',
  recebiaPericulosidade: '',
  erroNaRescisao: '',
};

export default function Quiz() {
  const navigate = useNavigate();
  const { step } = useParams<{ step: string }>();
  const location = useLocation();

  // Detectar se está no bloco "extras" via query param ?extras=1
  const searchParams = new URLSearchParams(location.search);
  const isExtrasMode = searchParams.get('extras') === '1';

  // quiz_id propagado via query param ?qid=... em todas as URLs do funil
  const qidFromUrl = searchParams.get('qid');

  // Rotas especiais do funil (cada uma tem URL própria)
  const isExtrasIntro = step === 'extras-intro';
  const isProcessandoRoute = step === 'processando';
  const isPreResultadoRoute = step === 'pre-resultado' || step === 'risco'; // 'risco' = legado
  const isSpecialRoute = isExtrasIntro || isProcessandoRoute || isPreResultadoRoute;

  // Determinar o índice atual baseado na URL (só faz sentido em rotas numéricas)
  const currentIndex = step && !isSpecialRoute ? parseInt(step, 10) - 1 : 0;

  // quiz_id (UUID): vem da URL ou é gerado novo. Não usa storage — F5 funciona
  // porque o ?qid= na URL é a fonte da verdade.
  const [sessionId] = useState<string>(() => qidFromUrl || crypto.randomUUID());

  // Helper: monta query string preservando qid + flags do bloco atual
  const buildQuery = (opts: { extras?: boolean } = {}) => {
    const params = new URLSearchParams();
    params.set('qid', sessionId);
    if (opts.extras) params.set('extras', '1');
    return `?${params.toString()}`;
  };

  // Garante que a URL atual SEMPRE tenha o ?qid=... Sem isso, o usuário cai
  // em /quiz/1 sem qid e só passa a aparecer a partir da pergunta 2.
  useEffect(() => {
    if (qidFromUrl || !sessionId) return;
    const newSearch = new URLSearchParams(location.search);
    newSearch.set('qid', sessionId);
    navigate(`${location.pathname}?${newSearch.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, qidFromUrl]);
  
  // Checar se está voltando da página de resultado para uma tela específica
  const returnToScreen = (location.state as any)?.returnToScreen;
  
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Suporte ao state legado `returnToScreen` ('risk' | 'problem') vindo do Resultado:
  // se chegou aqui, redirecionar para a rota equivalente.
  useEffect(() => {
    // Legado: 'risk' e 'problem' agora apontam pra mesma tela (unificada)
    if ((returnToScreen === 'risk' || returnToScreen === 'problem') && !isPreResultadoRoute) {
      navigate(`/quiz/pre-resultado${buildQuery()}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnToScreen]);
  const sessionInitializedRef = useRef(false);
  
  // Limpar estado de cálculo anterior ao iniciar quiz na etapa 1
  // Isso evita que dados de upsells de cálculos anteriores vazem para o novo
  useEffect(() => {
    // (Sem limpeza de storage — não usamos mais sessionStorage para respostas.)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // formData em React state (in-memory, instantâneo entre perguntas).
  // Inicializa com defaultFormData; se houver ?qid= na URL e o user veio
  // de um F5/link compartilhado, busca as respostas do Supabase em background.
  const [formData, setFormData] = useState<Record<string, unknown>>(() => ({ ...defaultFormData }));
  // True enquanto buscamos as respostas do Supabase (quando o usuário entra via
  // link com ?qid= em outro navegador). Bloqueia a validação de step pra não
  // redirecionar pra /quiz/1 antes das respostas chegarem.
  const [isLoadingRespostas, setIsLoadingRespostas] = useState<boolean>(() => {
    // Só começa em loading se a URL tem qid e estamos numa rota numérica
    // (ex.: /quiz/5). Em /quiz/1 ou rotas especiais não precisa esperar.
    const hasQid = new URLSearchParams(window.location.search).has('qid');
    const stepParam = window.location.pathname.match(/\/quiz\/(\d+)/)?.[1];
    return hasQid && stepParam !== undefined && parseInt(stepParam, 10) > 1;
  });

  // Buscar respostas do banco quando ?qid= existe e formData ainda está vazio
  useEffect(() => {
    if (!qidFromUrl) {
      setIsLoadingRespostas(false);
      return;
    }
    // Se o usuário JÁ respondeu pelo menos a primeira pergunta nesta aba,
    // não sobrescreve com dados antigos do banco.
    const jaTemRespostas = Object.values(formData).some(
      (v) => v !== '' && v !== 0 && v !== false && v !== undefined && v !== null &&
        !(Array.isArray(v) && v.length === 0),
    );
    if (jaTemRespostas) {
      setIsLoadingRespostas(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('quiz_sessions')
          .select('respostas')
          .eq('id', qidFromUrl)
          .maybeSingle();

        if (cancelled) return;
        if (error) {
          console.warn('[Quiz] erro Supabase ao buscar respostas:', error);
          setIsLoadingRespostas(false);
          return;
        }
        if (data?.respostas) {
          setFormData({ ...defaultFormData, ...(data.respostas as Record<string, unknown>) });
        }
      } catch (err) {
        console.warn('[Quiz] erro ao recuperar respostas do banco:', err);
      } finally {
        if (!cancelled) setIsLoadingRespostas(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qidFromUrl]);

  // Perguntas ativas: 'essencial' por padrão, 'extras' quando ?extras=1
  const activeQuestions = useMemo(
    () => getActiveQuestions(formData, { mode: isExtrasMode ? 'extras' : 'essencial' }),
    [formData, isExtrasMode],
  );
  const totalQuestions = activeQuestions.length;

  // Persiste sessão do quiz no Supabase (cria + sincroniza respostas)
  useQuizSession({
    quizId: sessionId,
    respostas: formData,
    etapaAtual: currentIndex,
    bloco: isExtrasMode ? 'extras' : 'essencial',
    // Marca completo já em /processando, antes do user clicar pra ver /resultado.
    // Isso garante que quando o /resultado buscar a sessão, ela já tem
    // respostas gravadas e `completo = true`.
    completo: isProcessandoRoute || isPreResultadoRoute,
  });

  // Calcular pontos de atenção baseados nas respostas, com persistência
  const pontosAtencao = useMemo(() => {
    let count = 0;
    if (formData.faziaHorasExtras === 'sim-frequente' || formData.faziaHorasExtras === 'sim-eventual') count++;
    if (formData.bancoHoras === 'sim-saldo') count++;
    if (formData.controlePonto === 'nao' || formData.controlePonto === 'irregular') count++;
    if (formData.funcoesDiferentes === 'sim') count++;
    if (formData.valorPorFora === 'sim') count++;
    if (Array.isArray(formData.adicionaisTrabalho) && formData.adicionaisTrabalho.length > 0) count++;
    if (formData.erroNaRescisao === 'sim' || formData.erroNaRescisao === 'nao-sei') count++;
    if ((formData.periodosFeriasVencidas as number) > 0) count++;
    return Math.min(Math.max(count, 2), 5);
  }, [formData]);
  
  // Hook de tracking do funil
  const {
    startSession,
    trackQuestion,
    trackQuizCompleted,
    trackLoadingScreen,
    trackRiskScreen,
  } = useFunnelTracking({ sessionId, totalQuestions });
  
  const isQuestionAnswered = useCallback((q: any, data: Record<string, unknown>) => {
    if (q.opcional) return true;

    const v = data[q.campo];

    switch (q.tipo) {
      case 'single':
        return v !== undefined && v !== null && v !== '';
      case 'multi':
        return Array.isArray(v) && v.length > 0;
      case 'input-currency':
        return typeof v === 'number' && v > 0;
      case 'input-number':
        return typeof v === 'number' && v >= 0;
      case 'input-month':
        return typeof v === 'string' && v.length === 7;
      case 'input-date-range':
        return (
          typeof data.dataAdmissao === 'string' &&
          data.dataAdmissao.length > 0 &&
          typeof data.dataDesligamento === 'string' &&
          data.dataDesligamento.length > 0
        );
      default:
        return v !== undefined && v !== null && v !== '';
    }
  }, []);

  // Validar se o step é válido e se o usuário pode acessar a pergunta pela URL.
  // Rotas especiais (processando, risco, diagnostico, extras-intro) não passam por essa validação.
  useEffect(() => {
    if (isSpecialRoute) return;
    // Espera o load das respostas do banco terminar antes de validar — senão
    // um link compartilhado pra /quiz/5 redirecionaria pra /quiz/1 antes das
    // respostas chegarem do Supabase.
    if (isLoadingRespostas) return;

    if (isNaN(currentIndex) || currentIndex < 0) {
      navigate(`/quiz/1${buildQuery()}`, { replace: true });
      return;
    }

    // Última pergunta que o usuário pode acessar é: (última respondida + 1)
    let maxAnsweredIndex = -1;
    for (let i = 0; i < activeQuestions.length; i++) {
      if (isQuestionAnswered(activeQuestions[i], formData)) {
        maxAnsweredIndex = i;
      } else {
        break;
      }
    }

    const maxReachableIndex = Math.min(maxAnsweredIndex + 1, Math.max(activeQuestions.length - 1, 0));

    if (currentIndex > maxReachableIndex) {
      navigate(`/quiz/${maxReachableIndex + 1}${buildQuery({ extras: isExtrasMode })}`, { replace: true });
    }
  }, [currentIndex, activeQuestions, formData, navigate, isSpecialRoute, isExtrasMode, isQuestionAnswered, isLoadingRespostas]);

  // Iniciar sessão de tracking
  useEffect(() => {
    if (!sessionInitializedRef.current) {
      startSession();
      sessionInitializedRef.current = true;
    }
  }, [startSession]);

  // Rastrear mudança de pergunta (só nas rotas numéricas)
  useEffect(() => {
    if (!isSpecialRoute && activeQuestions[currentIndex]) {
      trackQuestion(currentIndex, activeQuestions[currentIndex].campo);
    }
  }, [currentIndex, activeQuestions, trackQuestion, isSpecialRoute]);

  // Rastrear tela de loading
  useEffect(() => {
    if (isProcessandoRoute) {
      trackLoadingScreen();
      trackQuizCompleted();
    }
  }, [isProcessandoRoute, trackLoadingScreen, trackQuizCompleted]);

  // Rastrear tela de pré-resultado
  useEffect(() => {
    if (isPreResultadoRoute) {
      trackRiskScreen();
    }
  }, [isPreResultadoRoute, trackRiskScreen]);

  const currentQuestion = activeQuestions[currentIndex];
  
  // Progresso
  const currentEtapa = getCurrentEtapa(currentIndex, activeQuestions);
  const totalEtapas = getTotalEtapas();
  
  // Track max progress to prevent regression
  const maxProgressRef = useRef(0);
  
  const progress = useMemo(() => {
    let raw: number;
    if (currentQuestion?.progressoFixo !== undefined) {
      raw = currentQuestion.progressoFixo;
    } else if (isExtrasMode) {
      // Extras: 75% (primeira pergunta) → 100% (última).
      // Linear no índice: 0 → 0, N-1 → 1.
      const lastIdx = Math.max(totalQuestions - 1, 1);
      const ratio = currentIndex / lastIdx;
      raw = 75 + ratio * 25;
    } else {
      // Essencial: 0 → 75%, com curva côncava pra avançar rápido no início.
      // Primeira pergunta arranca em ~8% pra dar feedback imediato.
      const linear = (currentIndex + 1) / Math.max(totalQuestions, 1);
      const eased = Math.pow(linear, 0.6);
      raw = eased * 75;
    }
    const clamped = Math.min(Math.max(raw, 0), 100);
    // Never let progress go backwards
    maxProgressRef.current = Math.max(maxProgressRef.current, clamped);
    return maxProgressRef.current;
  }, [currentQuestion, currentIndex, totalQuestions, isExtrasMode]);

  // Atualizar resposta (em React state; persistência no Supabase via useQuizSession)
  const handleAnswer = useCallback((value: unknown) => {
    const campo = currentQuestion.campo;
    setFormData(prev => {
      const updated = { ...prev, [campo]: value };
      // Se está cumprindo aviso prévio, já sabemos que é trabalhado
      if (campo === 'situacaoAtual' && value === 'demitido_aviso') {
        updated.tipoAvisoPrevio = 'trabalhado';
      }
      return updated;
    });
  }, [currentQuestion]);

  // Atualizar campos extras (para date-range)
  const handleExtraChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Próxima pergunta
  const handleNext = useCallback(() => {
    // Recalcular perguntas ativas com o novo formData no MESMO modo (essencial vs extras)
    const updatedQuestions = getActiveQuestions(formData, {
      mode: isExtrasMode ? 'extras' : 'essencial',
    });

    if (currentIndex < updatedQuestions.length - 1) {
      // Próxima pergunta dentro do mesmo bloco — preserva ?extras=1 se estiver no bloco extras
      setDirection('forward');
      navigate(`/quiz/${currentIndex + 2}${buildQuery({ extras: isExtrasMode })}`);
    } else if (!isExtrasMode) {
      // Terminou o BLOCO ESSENCIAL — mostra a tela intermediária antes das extras
      navigate(`/quiz/extras-intro${buildQuery()}`);
    } else {
      // Terminou o BLOCO EXTRAS — vai pra tela de processamento
      navigate(`/quiz/processando${buildQuery()}`);
    }
  }, [currentIndex, formData, isExtrasMode, navigate, sessionId]);

  // Pergunta anterior
  const handlePrevious = useCallback(() => {
    setDirection('backward');

    if (isExtrasMode) {
      // Estamos no bloco EXTRAS
      if (currentIndex > 0) {
        // Volta uma pergunta dentro das extras (preserva ?extras=1)
        navigate(`/quiz/${currentIndex}${buildQuery({ extras: true })}`);
      } else {
        // Primeira pergunta das extras → volta pra tela intermediária
        navigate(`/quiz/extras-intro${buildQuery()}`);
      }
      return;
    }

    // Bloco ESSENCIAL
    if (currentIndex > 0) {
      navigate(`/quiz/${currentIndex}${buildQuery()}`);
    } else {
      // Primeira pergunta do essencial → volta pra landing
      navigate('/');
    }
  }, [currentIndex, isExtrasMode, navigate, sessionId]);

  // Após loading - ir para tela de risco
  const handleLoadingComplete = useCallback(() => {
    const updatedData = {
      ...formData,
      numDependentes: typeof formData.numDependentes === 'string'
        ? parseInt(formData.numDependentes as string, 10)
        : formData.numDependentes,
      periodosFeriasVencidas: typeof formData.periodosFeriasVencidas === 'string'
        ? parseInt(formData.periodosFeriasVencidas as string, 10)
        : formData.periodosFeriasVencidas,
      mesesDesdeUltimaFerias: typeof formData.mesesDesdeUltimaFerias === 'string'
        ? parseInt(formData.mesesDesdeUltimaFerias as string, 10)
        : formData.mesesDesdeUltimaFerias,
    };
    setFormData(updatedData);
    navigate(`/quiz/pre-resultado${buildQuery()}`);
  }, [formData, navigate, sessionId]);

  // Valor atual da pergunta
  const currentValue = currentQuestion ? formData[currentQuestion.campo] : undefined;

  // Valores extras para date-range
  const extraValues = {
    dataAdmissao: formData.dataAdmissao as string || '',
    dataDesligamento: formData.dataDesligamento as string || '',
  };

  // ============ ROTAS ESPECIAIS DO FUNIL ============

  // /quiz/extras-intro — tela intermediária antes do bloco extras
  if (isExtrasIntro) {
    return (
      <QuizIntermediateScreen
        onContinue={() => {
          // Recomeça a navegação no índice 1 do bloco extras (?extras=1 ativa o filtro)
          navigate(`/quiz/1${buildQuery({ extras: true })}`);
        }}
      />
    );
  }

  // /quiz/processando — animação de loading (tela cheia, fundo azul)
  if (isProcessandoRoute) {
    return <QuizLoading onComplete={handleLoadingComplete} />;
  }

  // /quiz/pre-resultado — análise unificada (gauge + pontos críticos + CTA)
  if (isPreResultadoRoute) {
    return (
      <QuizRiskScreen
        sessionId={sessionId}
        formData={formData}
        pontosAtencao={pontosAtencao}
        onContinue={() => navigate(`/resultado?qid=${sessionId}`)}
        onBack={() => navigate(`/quiz/processando${buildQuery()}`)}
      />
    );
  }

  // Se não há pergunta válida
  if (!currentQuestion) {
    return null;
  }

  // Enquanto busca respostas do banco (link compartilhado em outro navegador),
  // mostra um loader em vez de piscar a primeira pergunta.
  if (isLoadingRespostas) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando suas respostas...</p>
        </div>
      </div>
    );
  }

  return (
    <QuizQuestionScreen
      question={currentQuestion}
      value={currentValue}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isFirst={currentIndex === 0}
      isLast={currentIndex === totalQuestions - 1}
      direction={direction}
      extraValues={extraValues}
      onExtraChange={handleExtraChange}
      currentEtapa={currentEtapa}
      totalEtapas={totalEtapas}
      progress={progress}
      questionIndex={currentIndex}
      totalQuestions={totalQuestions}
      formData={formData}
    />
  );
}
