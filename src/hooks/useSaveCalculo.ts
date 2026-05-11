import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UseSaveCalculoOptions {
  formData: Record<string, unknown> | null;
  valorBase: number | undefined;
  detalhamento?: Record<string, number>;
  verbas?: unknown[];
  modulosExtras?: unknown[];
  valorBruto?: number;
  totalDescontos?: number;
  valorPotencial?: number;
  tipoRescisao?: string;
  mesesTrabalhados?: number;
  onSaved?: (calculoId: string, codigoUnico: string) => void;
}

/**
 * Gera um código único curto (8 caracteres, sem ambiguidades) para usar como
 * slug público de relatório. Não é criptograficamente seguro — apenas evita
 * URLs feias e dificulta enumeração ingênua.
 */
function generateCodigoUnico(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * useSaveCalculo — insere o resultado do cálculo em `public.calculos`,
 * vinculando à `quiz_session_id` corrente. Idempotente via `sessionStorage`:
 * se já há um `calculoId` salvo, não cria de novo.
 */
export function useSaveCalculo({
  formData,
  valorBase,
  detalhamento,
  verbas,
  modulosExtras,
  valorBruto,
  totalDescontos,
  valorPotencial,
  tipoRescisao,
  mesesTrabalhados,
  onSaved,
}: UseSaveCalculoOptions) {
  const [searchParams] = useSearchParams();
  const [calculoId, setCalculoId] = useState("");
  const [codigoUnico, setCodigoUnico] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  // Ref que garante one-shot — useEffect re-dispara várias vezes (Strict Mode,
  // mudanças de objetos em props), mas só fazemos UMA tentativa de salvar.
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current || calculoId || !valorBase || !formData) return;

    const quizSessionId = searchParams.get("qid") || searchParams.get("id");
    if (!quizSessionId) {
      console.warn("[useSaveCalculo] sem qid na URL; cálculo não será persistido");
      return;
    }

    attemptedRef.current = true;
    setIsSaving(true);
    console.log("[useSaveCalculo] iniciando para quizSessionId:", quizSessionId);

    (async () => {
      try {
        // Verifica se já existe um cálculo para essa quiz_session (evita duplicar)
        const { data: existing, error: selectErr } = await supabase
          .from("calculos")
          .select("id, codigo_unico")
          .eq("quiz_session_id", quizSessionId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (selectErr) {
          console.error("[useSaveCalculo] erro no SELECT:", selectErr);
        }
        if (existing) {
          console.log("[useSaveCalculo] reaproveitando cálculo existente:", existing.id);
          setCalculoId(existing.id);
          setCodigoUnico(existing.codigo_unico);
          onSaved?.(existing.id, existing.codigo_unico);
          return;
        }

        const codigo = generateCodigoUnico();

        const { data, error } = await supabase
          .from("calculos")
          .insert({
            quiz_session_id: quizSessionId,
            codigo_unico: codigo,
            valor_base: valorBase,
            valor_bruto: valorBruto ?? valorBase,
            total_descontos: totalDescontos ?? 0,
            valor_potencial: valorPotencial ?? null,
            verbas: (verbas ?? []) as never,
            modulos_extras: (modulosExtras ?? []) as never,
            detalhamento: (detalhamento ?? null) as never,
            tipo_rescisao: tipoRescisao ?? null,
            meses_trabalhados: mesesTrabalhados ?? null,
          })
          .select("id, codigo_unico")
          .single();

        if (error || !data) {
          console.error("[useSaveCalculo] erro INSERT:", error);
          // Permite retry em caso de falha real
          attemptedRef.current = false;
          return;
        }

        console.log("[useSaveCalculo] criado novo cálculo:", data.id);
        setCalculoId(data.id);
        setCodigoUnico(data.codigo_unico);
        onSaved?.(data.id, data.codigo_unico);
      } catch (err) {
        console.error("[useSaveCalculo] erro inesperado:", err);
        attemptedRef.current = false;
      } finally {
        setIsSaving(false);
      }
    })();
    // Dependências propositalmente reduzidas: só re-dispara quando muda
    // valorBase/formData (que indicam que o cálculo "ficou pronto").
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valorBase, formData]);

  return { calculoId, codigoUnico, isSaving, setCalculoId, setCodigoUnico };
}
