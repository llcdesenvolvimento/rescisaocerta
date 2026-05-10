import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  FileSearch, 
  Receipt, 
  Clock, 
  Building2, 
  Wallet, 
  CheckSquare
} from 'lucide-react';

interface SecaoErrosProps {
  temSuspeitaErro: boolean;
  temExtras: boolean;
}

const itensConferencia = [
  {
    icon: FileSearch,
    titulo: 'TRCT (Termo de Rescisão)',
    descricao: 'Compare cada linha do TRCT com os valores que calculamos aqui. Se algum número estiver diferente, anote.',
    dica: 'A empresa tem 10 dias corridos pra te entregar esse documento.',
  },
  {
    icon: Receipt,
    titulo: 'Seus holerites',
    descricao: 'Pegue os últimos 12 meses de contracheque. Veja se adicionais, horas extras e comissões estão batendo.',
    dica: 'Se não tiver os holerites, peça ao RH. Eles são obrigados a fornecer.',
  },
  {
    icon: Clock,
    titulo: 'Espelho de ponto',
    descricao: 'Se você fazia hora extra ou entrava mais cedo, o ponto é a prova. Compare com o que você lembra.',
    dica: 'Empresas com mais de 20 funcionários precisam ter registro de ponto.',
  },
  {
    icon: Building2,
    titulo: 'Banco de horas',
    descricao: 'Peça o extrato do banco de horas. Se ficou saldo sem compensar, essas horas devem ser pagas como extras.',
    dica: 'Isso é mais comum do que parece. Muita gente esquece de cobrar.',
  },
  {
    icon: Wallet,
    titulo: 'Extrato do FGTS',
    descricao: 'Baixe o extrato pelo app do FGTS ou da Caixa. Confira se todo mês tem o depósito de 8% do seu salário.',
    dica: 'Se algum mês ficou sem depósito, a empresa deve acertar isso na rescisão.',
  },
  {
    icon: CheckSquare,
    titulo: 'Adicionais e benefícios',
    descricao: 'Insalubridade, periculosidade, adicional noturno, vale-transporte, vale-refeição: confira no contrato o que foi combinado.',
    dica: 'Se você recebia na prática mas não consta no TRCT, pode haver diferença.',
  },
];

export function SecaoErros({ temSuspeitaErro, temExtras }: SecaoErrosProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b p-3 sm:p-4 bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Como Conferir sua Rescisão</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          {temSuspeitaErro 
            ? 'Você disse que desconfia de erro na rescisão. Veja abaixo o que conferir primeiro:'
            : 'Encontramos valores que podem estar faltando. Use este checklist pra verificar:'}
        </p>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          {itensConferencia.map((item, index) => (
            <div 
              key={index}
              className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="p-1.5 sm:p-2 rounded-full bg-muted flex-shrink-0">
                <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-xs sm:text-sm">{item.titulo}</h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{item.descricao}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  💡 {item.dica}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-dashed lg:col-span-2">
          <p className="text-xs text-muted-foreground text-center">
            Guarde tudo por pelo menos 5 anos. Se precisar entrar com ação trabalhista, esses documentos são suas principais provas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
