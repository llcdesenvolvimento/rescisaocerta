import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { QuizQuestionScreen } from '@/components/quiz-funnel/QuizQuestionScreen';
import { QuizLoading } from '@/components/quiz-funnel/QuizLoading';
import { QuizRiskScreen } from '@/components/quiz-funnel/QuizRiskScreen';
import { QuizProblemScreen } from '@/components/quiz-funnel/QuizProblemScreen';
import { QuizIntermediateScreen } from '@/components/quiz-funnel/QuizIntermediateScreen';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getActiveQuestions, getCurrentEtapa, getTotalEtapas } from '@/components/quiz-funnel/questions';
import { FormData } from '@/types/rescisao';
import { useFunnelTracking } from '@/hooks/useFunnelTracking';

const STORAGE_KEY = 'rescisao-calculator-form';

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
  numDependentes: undefined as unknown as number,
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
  
  // Determinar o índice atual baseado na URL
  const currentIndex = step ? parseInt(step, 10) - 1 : 0;
  
  const [sessionId] = useState<string>(() => {
    // Recuperar ou gerar sessionId
    const saved = sessionStorage.getItem('quiz-session-id');
    if (saved) return saved;
    const newId = crypto.randomUUID();
    sessionStorage.setItem('quiz-session-id', newId);
    return newId;
  });
  
  // Checar se está voltando da página de resultado para uma tela específica
  const returnToScreen = (location.state as any)?.returnToScreen;
  
  const [showLoading, setShowLoading] = useState(false);
  const [showRisk, setShowRisk] = useState(returnToScreen === 'risk');
  const [showProblem, setShowProblem] = useState(returnToScreen === 'problem');
  const [showIntermediate, setShowIntermediate] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const sessionInitializedRef = useRef(false);
  
  // Limpar estado de cálculo anterior ao iniciar quiz na etapa 1
  // Isso evita que dados de upsells de cálculos anteriores vazem para o novo
  useEffect(() => {
    if (currentIndex === 0 && !returnToScreen) {
      sessionStorage.removeItem('rescisao-calculo-id');
      sessionStorage.removeItem('rescisao-codigo-unico');
      sessionStorage.removeItem('rescisao-charge-id');
      sessionStorage.removeItem('rescisao-email');
      sessionStorage.removeItem('rescisao-session-active');
      sessionStorage.removeItem('rescisao-valor-base-original');
      sessionStorage.removeItem('rescisao-verbas-resultado');
      // Limpar upsells antigos (chaves dinâmicas)
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key && (key.startsWith('carta-rh-') || key.startsWith('checklist-'))) {
          sessionStorage.removeItem(key);
        }
      }
    }
  }, []); // Apenas na montagem

  // Carregar dados do formulário
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return { ...defaultFormData };
  });

  // Perguntas ativas baseadas nas respostas
  const activeQuestions = useMemo(() => getActiveQuestions(formData), [formData]);
  const totalQuestions = activeQuestions.length;

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
    const clamped = Math.min(Math.max(count, 2), 5);
    
    // Persistir: só atualizar se o hash dos dados mudou
    const hashKey = 'rescisao-pontos-hash';
    const pontosKey = 'rescisao-pontos-atencao';
    const relevantFields = ['faziaHorasExtras','bancoHoras','controlePonto','funcoesDiferentes','valorPorFora','adicionaisTrabalho','erroNaRescisao','periodosFeriasVencidas'];
    const currentHash = relevantFields.map(f => `${f}:${JSON.stringify(formData[f] ?? '')}`).join('|');
    const savedHash = sessionStorage.getItem(hashKey);
    
    if (savedHash === currentHash) {
      const saved = sessionStorage.getItem(pontosKey);
      if (saved) return parseInt(saved, 10);
    }
    
    sessionStorage.setItem(hashKey, currentHash);
    sessionStorage.setItem(pontosKey, String(clamped));
    return clamped;
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

  // Validar se o step é válido e se o usuário pode acessar a pergunta pela URL
  useEffect(() => {
    if (showLoading || showRisk) return;

    if (isNaN(currentIndex) || currentIndex < 0) {
      navigate('/quiz/1', { replace: true });
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
      navigate(`/quiz/${maxReachableIndex + 1}`, { replace: true });
    }
  }, [currentIndex, activeQuestions, formData, navigate, showLoading, showRisk, isQuestionAnswered]);

  // Iniciar sessão de tracking
  useEffect(() => {
    if (!sessionInitializedRef.current) {
      startSession();
      sessionInitializedRef.current = true;
    }
  }, [startSession]);

  // Rastrear mudança de pergunta
  useEffect(() => {
    if (!showLoading && !showRisk && activeQuestions[currentIndex]) {
      trackQuestion(currentIndex, activeQuestions[currentIndex].campo);
    }
  }, [currentIndex, activeQuestions, trackQuestion, showLoading, showRisk]);

  // Rastrear tela de loading
  useEffect(() => {
    if (showLoading) {
      trackLoadingScreen();
      trackQuizCompleted();
    }
  }, [showLoading, trackLoadingScreen, trackQuizCompleted]);

  // Rastrear tela de risco
  useEffect(() => {
    if (showRisk) {
      trackRiskScreen();
    }
  }, [showRisk, trackRiskScreen]);

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
    } else {
      const linearProgress = (currentIndex + 1) / totalQuestions;
      raw = Math.pow(linearProgress, 0.7) * 100;
    }
    const clamped = Math.min(raw, 100);
    // Never let progress go backwards
    maxProgressRef.current = Math.max(maxProgressRef.current, clamped);
    return maxProgressRef.current;
  }, [currentQuestion, currentIndex, totalQuestions]);

  // Salvar no sessionStorage
  const saveToStorage = useCallback((data: Record<string, unknown>) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, []);

  // Atualizar resposta
  const handleAnswer = useCallback((value: unknown) => {
    const campo = currentQuestion.campo;
    setFormData(prev => {
      const updated = { ...prev, [campo]: value };
      // Se está cumprindo aviso prévio, já sabemos que é trabalhado
      if (campo === 'situacaoAtual' && value === 'demitido_aviso') {
        updated.tipoAvisoPrevio = 'trabalhado';
      }
      saveToStorage(updated);
      return updated;
    });
  }, [currentQuestion, saveToStorage]);

  // Atualizar campos extras (para date-range)
  const handleExtraChange = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // Próxima pergunta
  const handleNext = useCallback(() => {
    // Recalcular perguntas ativas com o novo formData
    const updatedQuestions = getActiveQuestions(formData);
    
    if (currentIndex < updatedQuestions.length - 1) {
      // Verificar se estamos saindo da etapa 3 para a etapa 4
      const currentEtapaValue = updatedQuestions[currentIndex]?.etapa;
      const nextEtapaValue = updatedQuestions[currentIndex + 1]?.etapa;
      
      if (currentEtapaValue !== undefined && currentEtapaValue <= 3 && nextEtapaValue === 4) {
        setShowIntermediate(true);
        return;
      }
      
      setDirection('forward');
      navigate(`/quiz/${currentIndex + 2}`);
    } else {
      // Última pergunta - ir para loading
      setShowLoading(true);
    }
  }, [currentIndex, formData, navigate]);

  // Pergunta anterior
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setDirection('backward');
      navigate(`/quiz/${currentIndex}`);
    } else {
      // Voltar para landing
      navigate('/');
    }
  }, [currentIndex, navigate]);

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
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    setShowRisk(true);
  }, [formData]);

  // Valor atual da pergunta
  const currentValue = currentQuestion ? formData[currentQuestion.campo] : undefined;

  // Valores extras para date-range
  const extraValues = {
    dataAdmissao: formData.dataAdmissao as string || '',
    dataDesligamento: formData.dataDesligamento as string || '',
  };

  // Se estiver no loading
  if (showLoading && !showRisk) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-[480px]">
            <QuizLoading onComplete={handleLoadingComplete} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Se estiver na tela intermediária
  if (showIntermediate) {
    return (
      <QuizIntermediateScreen
        onContinue={() => {
          setShowIntermediate(false);
          setDirection('forward');
          navigate(`/quiz/${currentIndex + 2}`);
        }}
      />
    );
  }

  // Se estiver na tela de problema (após risco)
  if (showProblem) {
    return <QuizProblemScreen pontosAtencao={pontosAtencao} onContinue={() => navigate(`/resultado?id=${sessionId}`)} onBack={() => setShowProblem(false)} />;
  }

  // Se estiver na tela de risco
  if (showRisk) {
    return <QuizRiskScreen sessionId={sessionId} formData={formData} onContinue={() => setShowProblem(true)} onBack={() => { setShowRisk(false); setShowLoading(false); }} />;
  }

  // Se não há pergunta válida
  if (!currentQuestion) {
    return null;
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
