import { ResultadoRefinado } from '@/types/pos-pagamento';
import { 
  Compass, 
  FolderOpen,
  FileSearch,
  UserCheck,
  Shield,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlanoAcaoProps {
  resultado: ResultadoRefinado;
}

export function PlanoAcao({ resultado }: PlanoAcaoProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const etapas = [
    {
      numero: 1,
      titulo: 'Organização',
      descricao: 'Reúna todos os documentos listados no checklist acima. Organize-os por tipo e data.',
      icon: FolderOpen,
      cor: 'bg-blue-500',
      detalhes: [
        'Solicite o TRCT e Termo de Quitação ao RH',
        'Baixe o extrato do FGTS pelo app da Caixa',
        'Separe os holerites dos últimos 12 meses',
      ],
    },
    {
      numero: 2,
      titulo: 'Conferência',
      descricao: 'Compare o TRCT recebido com os valores apresentados neste relatório.',
      icon: FileSearch,
      cor: 'bg-amber-500',
      detalhes: [
        `Verifique se o total se aproxima de ${formatCurrency(resultado.valor_refinado)}`,
        'Confira se a base salarial está correta',
        'Valide as datas de admissão e desligamento',
      ],
    },
    {
      numero: 3,
      titulo: 'Validação Técnica',
      descricao: 'Caso identifique diferenças relevantes, procure orientação especializada.',
      icon: UserCheck,
      cor: 'bg-purple-500',
      detalhes: [
        'Diferenças acima de 10% merecem atenção',
        'Um advogado trabalhista pode analisar seu caso',
        'O sindicato da categoria também pode auxiliar',
      ],
    },
    {
      numero: 4,
      titulo: 'Proteção',
      descricao: 'Guarde este relatório e seus documentos por no mínimo 5 anos.',
      icon: Shield,
      cor: 'bg-emerald-500',
      detalhes: [
        'O prazo prescricional trabalhista é de 5 anos',
        'Digitalize todos os documentos importantes',
        'Mantenha backups em local seguro',
      ],
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <Compass className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Plano de Ação Recomendado</h2>
          <p className="text-sm text-muted-foreground">Próximos passos para garantir seus direitos</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
        <p className="text-foreground leading-relaxed mb-6">
          Com base na análise realizada, recomendamos seguir as etapas abaixo para garantir que você 
          receba todos os valores a que tem direito:
        </p>

        <div className="space-y-4">
          {etapas.map((etapa, index) => (
            <div 
              key={etapa.numero}
              className="bg-white/60 rounded-xl border border-border overflow-hidden"
            >
              <div className="flex items-start gap-4 p-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  etapa.cor
                )}>
                  <etapa.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                      Etapa {etapa.numero}
                    </span>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{etapa.titulo}</h4>
                  <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                  
                  <div className="mt-3 space-y-1">
                    {etapa.detalhes.map((detalhe, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{detalhe}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Linha conectora */}
              {index < etapas.length - 1 && (
                <div className="flex justify-center py-2 bg-muted/20">
                  <div className="w-0.5 h-4 bg-border"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA de urgência para casos de alto potencial */}
        {resultado.nivel_oportunidade === 'alto' && (
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-300">
            <p className="text-sm text-amber-900 font-medium leading-relaxed">
              🔔 <strong>Atenção:</strong> Nossa análise identificou que seu caso tem 
              <strong> alto potencial de valores não considerados</strong>. Recomendamos uma 
              conferência técnica detalhada com os documentos originais para garantir que você 
              receba tudo o que tem direito.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
