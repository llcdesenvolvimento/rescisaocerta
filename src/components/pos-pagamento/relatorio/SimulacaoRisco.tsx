import { 
  AlertTriangle, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export function SimulacaoRisco() {
  const riscosComuns = [
    {
      titulo: 'Cálculo baseado apenas no último salário',
      descricao: 'Médias de comissões e horas extras devem ser consideradas na base de cálculo.',
    },
    {
      titulo: 'Desconsideração de horas extras habituais',
      descricao: 'Horas extras frequentes integram o salário e refletem em todas as verbas.',
    },
    {
      titulo: 'Erros em datas de admissão ou desligamento',
      descricao: 'Pequenos erros nas datas podem impactar aviso prévio, 13º e férias.',
    },
    {
      titulo: 'Pagamento incorreto de férias proporcionais',
      descricao: 'O cálculo de avos e o terço constitucional podem estar incorretos.',
    },
    {
      titulo: 'Base errada para 13º salário',
      descricao: 'Adicionais e médias variáveis devem compor a base do 13º.',
    },
    {
      titulo: 'FGTS sem considerar verbas variáveis',
      descricao: 'O FGTS deve incidir sobre todas as parcelas de natureza salarial.',
    },
    {
      titulo: 'Aviso prévio sem proporcionalidade correta',
      descricao: 'A cada ano trabalhado após o primeiro, são acrescidos 3 dias ao aviso.',
    },
    {
      titulo: 'Reflexos de adicionais não calculados',
      descricao: 'Insalubridade, periculosidade e noturno refletem em 13º, férias e FGTS.',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Simulação de Risco</h2>
          <p className="text-sm text-muted-foreground">O que pode fazer você receber menos do que o devido</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <div className="flex gap-4 mb-6">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-foreground mb-2">⚠️ Atenção: Riscos Identificados</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Muitos TRCTs (Termos de Rescisão de Contrato de Trabalho) são gerados de forma automática 
              pelos sistemas de folha de pagamento, sem considerar particularidades do contrato. 
              Abaixo estão os erros mais comuns que podem reduzir o valor da sua rescisão:
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {riscosComuns.map((risco, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-white/60 rounded-lg border border-red-100"
            >
              <ChevronRight className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm">{risco.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{risco.descricao}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-red-100/50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800 font-medium">
            👉 <strong>Recomendação:</strong> Compare sempre o TRCT recebido com os valores apresentados 
            neste relatório. Divergências significativas podem indicar erros que precisam ser corrigidos.
          </p>
        </div>
      </div>
    </section>
  );
}
