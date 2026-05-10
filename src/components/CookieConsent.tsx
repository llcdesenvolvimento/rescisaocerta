import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const CONSENT_KEY = "rescisao-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  function handleReject() {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 sm:p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, 
              analisar o tráfego do site e personalizar conteúdo. Ao continuar navegando, 
              você concorda com nossa{" "}
              <Link
                to="/politica-de-privacidade"
                className="text-primary underline underline-offset-2 hover:text-primary/80 font-medium"
              >
                Política de Privacidade
              </Link>.
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAccept}
                size="sm"
                className="text-xs px-4"
              >
                Aceitar
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                size="sm"
                className="text-xs px-4"
              >
                Rejeitar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
