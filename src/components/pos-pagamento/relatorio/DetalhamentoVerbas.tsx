import { ResultadoRefinado, RelatorioAI } from '@/types/pos-pagamento';
import { 
  FileText, 
  CheckCircle2
} from 'lucide-react';

interface DetalhamentoVerbasProps {
  resultado: ResultadoRefinado;
  relatorioAI: RelatorioAI | null;
}

export function DetalhamentoVerbas({ resultado, relatorioAI }: DetalhamentoVerbasProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const itensPositivos = resultado.itens.filter(item => item.valor > 0);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Detalhamento Completo das Verbas</h2>
          <p className="text-sm text-muted-foreground">Composição de todas as verbas rescisórias identificadas</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-foreground leading-relaxed mb-6">
          Abaixo está a composição detalhada de todas as verbas rescisórias identificadas. 
          Cada item representa um direito trabalhista que deve ser pago na sua rescisão:
        </p>
        
        <div className="space-y-3">
          {itensPositivos.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-foreground">{item.nome}</span>
              </div>
              <span className="font-bold text-emerald-600">{formatCurrency(item.valor)}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t-2 border-emerald-200 bg-emerald-50 rounded-lg p-4 flex justify-between items-center">
          <span className="font-bold text-lg text-foreground">TOTAL A RECEBER</span>
          <span className="font-black text-2xl text-emerald-600">{formatCurrency(resultado.valor_refinado)}</span>
        </div>

        {relatorioAI?.detalhamentoVerbas && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="font-semibold text-foreground mb-3">Explicação detalhada:</h4>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {relatorioAI.detalhamentoVerbas}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
