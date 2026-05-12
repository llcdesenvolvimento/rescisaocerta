import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Resultado from "./pages/Resultado";
import PosPagamentoConfirmacao from "./pages/PosPagamentoConfirmacao";
import Relatorio from "./pages/Relatorio";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import SobreNos from "./pages/SobreNos";
import Contato from "./pages/Contato";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";
import { CookieConsent } from "./components/CookieConsent";
import { useMetaPageView } from "@/hooks/useMetaPageView";

const queryClient = new QueryClient();

// Componente filho do BrowserRouter pra ter acesso ao useLocation.
// Dispara fbq('track', 'PageView') a cada mudança de rota do React Router.
function MetaPixelPageViewTracker() {
  useMetaPageView();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <MetaPixelPageViewTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test" element={<Index />} />
          <Route path="/quiz/:step" element={<Quiz />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route path="/pagamento" element={<Resultado />} />
          <Route path="/pos-pagamento" element={<PosPagamentoConfirmacao />} />
          <Route path="/relatorio" element={<Relatorio />} />
          <Route path="/termos-de-uso" element={<TermosDeUso />} />
          <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
