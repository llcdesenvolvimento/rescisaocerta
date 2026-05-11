import { useCallback, useRef } from 'react';
import { trackEvent } from '@/hooks/useQuizSession';

/**
 * useFunnelTracking — wrapper de compatibilidade que dispara eventos
 * na tabela `eventos` do schema novo.
 *
 * Antes registrava tudo numa tabela `funnel_sessions` (schema legado do Lovable).
 * Agora cada chamada gera um INSERT em `public.eventos` com o `quiz_session_id`.
 *
 * Mantém a mesma API pra não quebrar callers existentes.
 */

interface FunnelTrackingOptions {
  sessionId: string;
  totalQuestions?: number;
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet/i.test(ua)) return 'tablet';
  return 'desktop';
}

export function useFunnelTracking({ sessionId, totalQuestions }: FunnelTrackingOptions) {
  const initializedRef = useRef(false);
  const lastQuestionRef = useRef(-1);

  const startSession = useCallback(async () => {
    if (initializedRef.current || !sessionId) return;
    initializedRef.current = true;
    void trackEvent(sessionId, 'quiz_started', {
      device_type: getDeviceType(),
      total_questions: totalQuestions ?? null,
      referrer: document.referrer || null,
    });
  }, [sessionId, totalQuestions]);

  const trackQuestion = useCallback(
    async (questionIndex: number, campo: string) => {
      if (!sessionId) return;
      if (lastQuestionRef.current === questionIndex) return;
      lastQuestionRef.current = questionIndex;
      void trackEvent(sessionId, 'pergunta_visualizada', { question_index: questionIndex, campo });
    },
    [sessionId],
  );

  const trackQuizCompleted = useCallback(async () => {
    if (!sessionId) return;
    void trackEvent(sessionId, 'quiz_completed', {});
  }, [sessionId]);

  const trackLoadingScreen = useCallback(async () => {
    if (!sessionId) return;
    void trackEvent(sessionId, 'tela_processando', {});
  }, [sessionId]);

  const trackRiskScreen = useCallback(async () => {
    if (!sessionId) return;
    void trackEvent(sessionId, 'tela_pre_resultado', {});
  }, [sessionId]);

  return {
    startSession,
    trackQuestion,
    trackQuizCompleted,
    trackLoadingScreen,
    trackRiskScreen,
  };
}
