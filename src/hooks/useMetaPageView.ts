import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/meta-pixel";

/**
 * Dispara `fbq('track', 'PageView')` a cada mudança de rota (SPAs precisam
 * desse trigger explícito, já que o snippet base só roda no boot).
 * Pula a primeira renderização — o snippet em index.html já dispara o
 * PageView inicial automaticamente.
 */
export function useMetaPageView(): void {
  const location = useLocation();

  useEffect(() => {
    // Pula a primeira "renderização" do mount inicial — o snippet base em
    // index.html já enviou o PageView. Aqui pegamos APENAS as navegações
    // subsequentes do React Router.
    const isFirstMount = (useMetaPageView as unknown as { __firstMount?: boolean }).__firstMount !== true;
    if (isFirstMount) {
      (useMetaPageView as unknown as { __firstMount: boolean }).__firstMount = true;
      return;
    }
    trackPageView();
  }, [location.pathname, location.search]);
}
