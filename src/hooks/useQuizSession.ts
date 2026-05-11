import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Mapa global de quizId → Promise que resolve quando a quiz_session existe no banco.
// Outros hooks (ex.: trackEvent) podem awaitá-la antes de inserir rows que
// referenciam quiz_session_id, evitando FK violations.
const sessionReadyPromises = new Map<string, Promise<void>>();

export function waitForQuizSession(quizId: string): Promise<void> {
  return sessionReadyPromises.get(quizId) ?? Promise.resolve();
}

/**
 * useQuizSession — gerencia a sessão do quiz no Supabase.
 *
 * Responsabilidades:
 *   - Criar a linha em `quiz_sessions` na primeira vez que o quizId aparece.
 *   - Atualizar `respostas`, `etapa_atual` e `bloco` a cada mudança.
 *   - Marcar `completo = true` quando o quiz termina.
 *
 * Resiliente a falhas de rede: se o Supabase estiver indisponível, o quiz
 * continua funcionando localmente (sessionStorage). Os erros são apenas logados.
 *
 * Idempotente: pode ser chamado várias vezes com o mesmo quizId — usa upsert.
 */

export interface UseQuizSessionOptions {
  quizId: string;
  respostas: Record<string, unknown>;
  etapaAtual: number;
  bloco: 'essencial' | 'extras';
  completo: boolean;
}

export function useQuizSession({
  quizId,
  respostas,
  etapaAtual,
  bloco,
  completo,
}: UseQuizSessionOptions) {
  const lastSyncedRef = useRef<string>('');
  const createdRef = useRef(false);

  // Cria a linha no Supabase na primeira vez (insert idempotente via upsert)
  useEffect(() => {
    if (!quizId || createdRef.current) return;
    createdRef.current = true;

    const promise = (async () => {
      try {
        await supabase
          .from('quiz_sessions')
          .upsert(
            {
              id: quizId,
              respostas,
              etapa_atual: etapaAtual,
              bloco,
              completo,
              user_agent: navigator.userAgent || null,
            },
            { onConflict: 'id', ignoreDuplicates: false },
          );
      } catch (err) {
        console.warn('[useQuizSession] erro ao criar/upsertar sessão:', err);
      }
    })();
    sessionReadyPromises.set(quizId, promise);
  }, [quizId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Atualiza a sessão (respostas + progresso). Debounce de 500ms para updates
  // intermediários, mas SEM debounce quando `completo: true` (transição final).
  useEffect(() => {
    if (!quizId) return;

    const snapshot = JSON.stringify({ respostas, etapaAtual, bloco, completo });
    if (snapshot === lastSyncedRef.current) return;
    lastSyncedRef.current = snapshot;

    const payload: Record<string, unknown> = {
      respostas,
      etapa_atual: etapaAtual,
      bloco,
      completo,
    };
    if (completo) {
      payload.completed_at = new Date().toISOString();
    }

    const doUpdate = async () => {
      try {
        await supabase.from('quiz_sessions').upsert(
          { id: quizId, ...payload },
          { onConflict: 'id' },
        );
      } catch (err) {
        console.warn('[useQuizSession] erro ao atualizar sessão:', err);
      }
    };

    // Sem debounce na transição final — garante que /resultado encontre as respostas
    if (completo) {
      void doUpdate();
      return;
    }

    const timeout = setTimeout(() => void doUpdate(), 500);
    return () => clearTimeout(timeout);
  }, [quizId, respostas, etapaAtual, bloco, completo]);
}

/**
 * Função utilitária: registra um evento no funil.
 * Use sem `await` se não precisa do retorno — fire-and-forget.
 *
 * Resiliente: se der erro de FK (quiz_session ainda não criada) ou erro
 * transiente, ignora silenciosamente. Eventos de telemetria não são críticos.
 */
export async function trackEvent(
  quizId: string | null,
  tipo: string,
  metadata: Record<string, unknown> = {},
  calculoId: string | null = null,
) {
  try {
    // Espera a quiz_session existir no banco antes de inserir o evento (evita FK violation)
    if (quizId) {
      await waitForQuizSession(quizId);
    }
    const { error } = await supabase.from('eventos').insert({
      quiz_session_id: quizId,
      calculo_id: calculoId,
      tipo,
      metadata: metadata as never,
    });
    if (error) {
      console.debug('[trackEvent] insert falhou:', error.code, error.message);
    }
  } catch (err) {
    console.debug('[trackEvent] erro:', err);
  }
}
