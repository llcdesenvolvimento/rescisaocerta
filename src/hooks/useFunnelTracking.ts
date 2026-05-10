import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FunnelTrackingOptions {
  sessionId: string;
  totalQuestions?: number;
}

export function useFunnelTracking({ sessionId, totalQuestions }: FunnelTrackingOptions) {
  const initializedRef = useRef(false);
  const lastQuestionRef = useRef(-1);

  // Detectar tipo de dispositivo
  const getDeviceType = useCallback(() => {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'mobile';
    if (/tablet/i.test(ua)) return 'tablet';
    return 'desktop';
  }, []);

  // Iniciar sessão do funil
  const startSession = useCallback(async () => {
    if (initializedRef.current || !sessionId) return;
    
    try {
      const { error } = await supabase
        .from('funnel_sessions')
        .upsert({
          session_id: sessionId,
          device_type: getDeviceType(),
          user_agent: navigator.userAgent.slice(0, 500),
          total_questions: totalQuestions,
          current_question_index: 0,
          max_question_reached: 0,
        }, {
          onConflict: 'session_id',
        });

      if (error) {
        console.error('Erro ao iniciar sessão do funil:', error);
      } else {
        initializedRef.current = true;
      }
    } catch (err) {
      console.error('Erro ao iniciar sessão do funil:', err);
    }
  }, [sessionId, totalQuestions, getDeviceType]);

  // Atualizar progresso da pergunta
  const trackQuestion = useCallback(async (questionIndex: number, questionCampo: string) => {
    if (!sessionId || questionIndex === lastQuestionRef.current) return;
    
    lastQuestionRef.current = questionIndex;

    try {
      const { error } = await supabase
        .from('funnel_sessions')
        .update({
          current_question_index: questionIndex,
          current_question_campo: questionCampo,
          max_question_reached: questionIndex,
          last_activity_at: new Date().toISOString(),
          total_questions: totalQuestions,
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Erro ao rastrear pergunta:', error);
      }
    } catch (err) {
      console.error('Erro ao rastrear pergunta:', err);
    }
  }, [sessionId, totalQuestions]);

  // Marcar conclusão do quiz
  const trackQuizCompleted = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('funnel_sessions')
        .update({
          completed_quiz: true,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Erro ao marcar quiz como completo:', error);
      }
    } catch (err) {
      console.error('Erro ao marcar quiz como completo:', err);
    }
  }, [sessionId]);

  // Marcar tela de loading
  const trackLoadingScreen = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('funnel_sessions')
        .update({
          reached_loading: true,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Erro ao marcar loading:', error);
      }
    } catch (err) {
      console.error('Erro ao marcar loading:', err);
    }
  }, [sessionId]);

  // Marcar tela de risco
  const trackRiskScreen = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('funnel_sessions')
        .update({
          reached_risk_screen: true,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Erro ao marcar tela de risco:', error);
      }
    } catch (err) {
      console.error('Erro ao marcar tela de risco:', err);
    }
  }, [sessionId]);

  // Marcar página de resultado
  const trackResultado = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('funnel_sessions')
        .update({
          reached_resultado: true,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Erro ao marcar resultado:', error);
      }
    } catch (err) {
      console.error('Erro ao marcar resultado:', err);
    }
  }, [sessionId]);

  // Marcar pagamento
  const trackPayment = useCallback(async (completed: boolean = false) => {
    if (!sessionId) return;

    try {
      const updateData = completed 
        ? { payment_completed: true, reached_payment: true, last_activity_at: new Date().toISOString() }
        : { reached_payment: true, last_activity_at: new Date().toISOString() };

      const { error } = await supabase
        .from('funnel_sessions')
        .update(updateData)
        .eq('session_id', sessionId);

      if (error) {
        console.error('Erro ao marcar pagamento:', error);
      }
    } catch (err) {
      console.error('Erro ao marcar pagamento:', err);
    }
  }, [sessionId]);

  // Vincular ao cálculo
  const linkToCalculo = useCallback(async (calculoId: string) => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('funnel_sessions')
        .update({
          calculo_id: calculoId,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Erro ao vincular cálculo:', error);
      }
    } catch (err) {
      console.error('Erro ao vincular cálculo:', err);
    }
  }, [sessionId]);

  return {
    startSession,
    trackQuestion,
    trackQuizCompleted,
    trackLoadingScreen,
    trackRiskScreen,
    trackResultado,
    trackPayment,
    linkToCalculo,
  };
}
