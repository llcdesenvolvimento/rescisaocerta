import { useEffect, useState } from 'react';
import { FormularioPosPagamento } from '@/components/pos-pagamento';
import { FormData } from '@/types/rescisao';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';

const STORAGE_KEY = 'rescisao-calculator-form';

export default function PosPagamento() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [dadosBase, setDadosBase] = useState<FormData | null>(null);

  // Google Ads conversion tracking
  useEffect(() => {
    const transactionId = searchParams.get('transaction_id') || '';
    if (transactionId && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-16527190384/3YgMCNuUhtYZEPDS48g9',
        'value': 14.9,
        'currency': 'BRL',
        'transaction_id': transactionId
      });
    }
  }, [searchParams]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        setDadosBase(JSON.parse(saved));
      } else {
        navigate('/');
      }
    } catch {
      navigate('/');
    }
  }, [navigate]);

  if (!dadosBase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 py-8 px-4">
        <FormularioPosPagamento 
          dadosBase={dadosBase} 
          onVoltar={() => navigate('/')} 
        />
      </main>
      <Footer />
    </div>
  );
}
