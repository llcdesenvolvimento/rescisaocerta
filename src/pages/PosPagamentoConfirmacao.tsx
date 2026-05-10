import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileText, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function PosPagamentoConfirmacao() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleGerarAnalise = () => {
    const calculoId = sessionStorage.getItem('rescisao-calculo-id');
    const params = new URLSearchParams();
    if (calculoId) params.set('id', calculoId);
    if (transactionId) params.set('transaction_id', transactionId);
    navigate(`/relatorio?${params.toString()}`);
  };

  const items = [
    'Conferência verba por verba da sua rescisão',
    'Identificação de valores faltantes ou incorretos',
    'Cálculo de adicionais e horas extras',
    'Relatório completo enviado por e-mail',
    'Orientações personalizadas para seu caso',
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-7">
          {/* Ícone de sucesso animado */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center animate-fade-in">
                <CheckCircle2 className="w-14 h-14 text-emerald-500" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-fade-in">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          {/* Título */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Pagamento confirmado!
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
              Agora você pode gerar sua{' '}
              <strong className="text-foreground">Análise Completa da Rescisão</strong> com todos os detalhes.
            </p>
          </div>

          {/* Card com o que está incluído */}
          <div className="bg-gradient-to-b from-card to-card/80 border border-border/60 rounded-2xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-foreground text-center flex items-center justify-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              O que você vai receber
            </h3>
            <ul className="space-y-3.5">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botão principal */}
          <Button
            onClick={handleGerarAnalise}
            className="w-full h-14 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            GERAR ANÁLISE COMPLETA
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {/* Selo de segurança */}
          <div className="flex items-center justify-center gap-1.5 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-muted-foreground">Garantia incondicional de 7 dias</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
