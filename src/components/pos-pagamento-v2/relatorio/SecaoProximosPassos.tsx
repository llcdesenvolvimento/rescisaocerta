import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  FileDown, 
  FolderOpen, 
  MessageSquare, 
  Scale,
  Clock,
  CheckCircle2
} from 'lucide-react';

const passos = [
  {
    icon: FileDown,
    titulo: 'Peça o TRCT detalhado',
    descricao: 'Solicite ao RH o Termo de Rescisão com todas as verbas discriminadas. Sem esse documento, fica difícil saber exatamente o que foi pago.',
    prazo: 'Prazo da empresa: 10 dias',
    urgencia: 'alta',
  },
  {
    icon: FolderOpen,
    titulo: 'Junte seus documentos',
    descricao: 'Separe holerites, espelhos de ponto, escalas e qualquer mensagem sobre horários ou funções. Quanto mais organizado, melhor.',
    prazo: 'Faça agora enquanto lembra',
    urgencia: 'alta',
  },
  {
    icon: MessageSquare,
    titulo: 'Converse com o RH',
    descricao: 'Se encontrou diferenças, procure primeiro o RH da empresa. Muitas vezes um simples questionamento formal já resolve, principalmente se você tiver uma carta bem escrita.',
    prazo: 'Antes de assinar a rescisão',
    urgencia: 'media',
  },
  {
    icon: Scale,
    titulo: 'Procure um advogado se precisar',
    descricao: 'Se os valores forem altos e a empresa não quiser resolver, um advogado trabalhista ou o sindicato da sua categoria podem te orientar sobre os próximos passos.',
    prazo: 'Prazo: até 2 anos para ação',
    urgencia: 'baixa',
  },
];

const urgenciaColors = {
  alta: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400',
  media: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400',
  baixa: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
};

export function SecaoProximosPassos() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b p-3 sm:p-4 bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <ArrowRight className="w-5 h-5 flex-shrink-0" />
          <span>O Que Fazer Agora</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">
          Siga essa ordem pra resolver da forma mais rápida possível
        </p>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
          {passos.map((passo, index) => (
            <div key={index} className="flex items-start gap-2 sm:gap-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground font-bold text-xs sm:text-sm flex-shrink-0">
                  {index + 1}
                </div>
                {index < passos.length - 1 && (
                  <div className="w-0.5 h-full min-h-[40px] bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 pb-3 sm:pb-4">
                <div className="flex items-start gap-2 flex-wrap">
                  <passo.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <h4 className="font-semibold text-sm sm:text-base flex-1">{passo.titulo}</h4>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 ml-6">
                  {passo.descricao}
                </p>
                <div className="mt-2 ml-6 flex items-center gap-2">
                  <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${urgenciaColors[passo.urgencia as keyof typeof urgenciaColors]}`}>
                    <Clock className="w-2.5 h-2.5 inline mr-1" />
                    {passo.prazo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-medium">
                Não assine sem conferir!
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                Depois que você assina o TRCT, contestar valores fica bem mais complicado. Se tiver dúvida, peça um prazo antes de assinar.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
