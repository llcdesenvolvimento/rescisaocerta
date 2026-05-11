import { FileDown, FolderOpen, MessageSquare, Scale, AlertCircle } from 'lucide-react';

const passos = [
  {
    icon: FileDown,
    titulo: 'Peça o TRCT detalhado',
    descricao: 'Solicite ao RH o Termo de Rescisão com todas as verbas discriminadas.',
    prazo: 'Prazo da empresa: 10 dias',
  },
  {
    icon: FolderOpen,
    titulo: 'Junte seus documentos',
    descricao: 'Separe holerites, espelhos de ponto, escalas e mensagens sobre horários ou funções.',
    prazo: 'Faça agora enquanto lembra',
  },
  {
    icon: MessageSquare,
    titulo: 'Converse com o RH',
    descricao: 'Se encontrou diferenças, procure primeiro o RH. Um questionamento formal costuma resolver.',
    prazo: 'Antes de assinar a rescisão',
  },
  {
    icon: Scale,
    titulo: 'Procure um advogado se precisar',
    descricao: 'Se os valores forem altos e a empresa não resolver, um advogado trabalhista pode orientar.',
    prazo: 'Até 2 anos para ação',
  },
];

export function SecaoProximosPassos() {
  return (
    <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
      <header className="px-5 sm:px-7 pt-6 pb-5 border-b border-border">
        <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
          O que fazer agora
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Siga essa ordem para resolver da forma mais rápida possível.
        </p>
      </header>

      <ol className="divide-y divide-border">
        {passos.map((passo, index) => {
          const Icon = passo.icon;
          return (
            <li key={index} className="px-5 sm:px-7 py-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-foreground font-bold text-xs flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" strokeWidth={2.5} />
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {passo.titulo}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {passo.descricao}
                  </p>
                  <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                    {passo.prazo}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="px-5 sm:px-7 py-4 bg-muted/20 border-t border-border">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" strokeWidth={2.5} />
          <div>
            <p className="text-sm font-bold text-foreground">Não assine sem conferir</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Depois de assinar o TRCT, contestar valores fica mais complicado. Em caso de dúvida, peça um prazo.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
