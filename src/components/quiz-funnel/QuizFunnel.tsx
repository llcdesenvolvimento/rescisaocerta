import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizLanding } from './QuizLanding';

const STORAGE_KEY = 'rescisao-calculator-form';

// Estado inicial do formulário - TUDO vazio/undefined para não ter seleção padrão
const defaultFormData = {
  tipoDesligamento: '',
  dataAdmissao: '',
  dataDesligamento: '',
  aindaTrabalhando: false,
  salarioFixo: 0,
  mediaVariavel: 0,
  temVariavel: false,
  periodosFeriasVencidas: undefined,
  mesesDesdeUltimaFerias: undefined,
  mesesTrabalhados2026: 0,
  tipoAvisoPrevio: '',
  anosServico: 0,
  saldoFGTS: 0,
  sabeSaldoFGTS: undefined,
  numDependentes: 0,
  faziaHorasExtras: '',
  bancoHoras: '',
  controlePonto: '',
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

export function QuizFunnel() {
  const navigate = useNavigate();

  // Iniciar quiz
  const handleStartQuiz = useCallback(() => {
    // Limpar dados anteriores ao iniciar
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('quiz-session-id');
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(defaultFormData));
    
    // Gerar novo sessionId
    const newSessionId = crypto.randomUUID();
    sessionStorage.setItem('quiz-session-id', newSessionId);
    
    // Navegar para primeira pergunta
    navigate('/quiz/1');
  }, [navigate]);

  return <QuizLanding onStart={handleStartQuiz} />;
}
