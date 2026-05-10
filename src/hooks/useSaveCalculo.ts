import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseSaveCalculoOptions {
  formData: Record<string, unknown> | null;
  valorBase: number | undefined;
  detalhamento?: Record<string, number>;
  onSaved?: (calculoId: string, codigoUnico: string) => void;
}

export function useSaveCalculo({ formData, valorBase, detalhamento, onSaved }: UseSaveCalculoOptions) {
  const [calculoId, setCalculoId] = useState(() => sessionStorage.getItem("rescisao-calculo-id") || "");
  const [codigoUnico, setCodigoUnico] = useState(() => sessionStorage.getItem("rescisao-codigo-unico") || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (calculoId || isSaving || !valorBase || !formData) return;

    let cancelled = false;
    setIsSaving(true);

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("salvar-calculo", {
          body: { formulario: formData, valorBase, detalhamento },
        });

        if (cancelled) return;
        if (error) {
          console.error("Erro ao salvar cálculo:", error);
          return;
        }

        if (data?.calculoId) {
          setCalculoId(data.calculoId);
          setCodigoUnico(data.codigoUnico);
          sessionStorage.setItem("rescisao-codigo-unico", data.codigoUnico);
          sessionStorage.setItem("rescisao-calculo-id", data.calculoId);
          sessionStorage.setItem("rescisao-valor-base-original", String(valorBase));
          onSaved?.(data.calculoId, data.codigoUnico);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Erro ao salvar cálculo:", err);
      } finally {
        if (!cancelled) setIsSaving(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [calculoId, isSaving, valorBase, formData, detalhamento, onSaved]);

  return { calculoId, codigoUnico, isSaving, setCalculoId, setCodigoUnico };
}
