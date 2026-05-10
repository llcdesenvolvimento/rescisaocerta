import { FormData } from '@/types/rescisao';
import { ResultadoRefinado } from '@/types/pos-pagamento';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  MinusCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapaDireitosProps {
  dadosBase: FormData;
  resultado: ResultadoRefinado;
}

interface DireitoItem {
  nome: string;
  aplicavel: boolean;
  motivo?: string;
}

export function MapaDireitos({ dadosBase, resultado }: MapaDireitosProps) {
  // Determinar quais direitos são aplicáveis baseado no tipo de desligamento e dados
  const getDireitos = (): DireitoItem[] => {
    const tipo = dadosBase.tipoDesligamento;
    const temHorasExtras = (dadosBase.faziaHorasExtras && dadosBase.faziaHorasExtras !== 'nao_fazia') ||
      resultado.dados_informados?.jornada?.horarioContratado !== resultado.dados_informados?.jornada?.horarioRealMedio;
    
    const temAdicionais = resultado.dados_informados?.valores?.insalubridade ||
      resultado.dados_informados?.valores?.periculosidade ||
      resultado.dados_informados?.valores?.adicionalNoturno;

    const direitos: DireitoItem[] = [
      {
        nome: 'Saldo de salário',
        aplicavel: true,
      },
      {
        nome: '13º salário proporcional',
        aplicavel: true,
      },
      {
        nome: 'Férias proporcionais + 1/3',
        aplicavel: tipo !== 'justa_causa',
        motivo: tipo === 'justa_causa' ? 'Não aplicável em demissão por justa causa' : undefined,
      },
      {
        nome: 'Férias vencidas + 1/3',
        aplicavel: dadosBase.periodosFeriasVencidas > 0,
        motivo: dadosBase.periodosFeriasVencidas === 0 ? 'Não há férias vencidas informadas' : undefined,
      },
      {
        nome: 'Aviso prévio',
        aplicavel: tipo === 'demissao_sem_justa_causa' || tipo === 'acordo',
        motivo: tipo === 'pedido_demissao' ? 'No pedido de demissão, o empregado é quem deve o aviso' : 
                tipo === 'justa_causa' ? 'Não aplicável em demissão por justa causa' : undefined,
      },
      {
        nome: 'Horas extras',
        aplicavel: temHorasExtras,
        motivo: !temHorasExtras ? 'Não foram identificadas horas extras' : undefined,
      },
      {
        nome: 'Reflexos de horas extras',
        aplicavel: temHorasExtras,
        motivo: !temHorasExtras ? 'Não há horas extras para gerar reflexos' : undefined,
      },
      {
        nome: 'Descanso semanal remunerado (DSR)',
        aplicavel: temHorasExtras,
        motivo: !temHorasExtras ? 'Não há horas extras para cálculo de DSR' : undefined,
      },
      {
        nome: 'Adicionais (insalubridade/periculosidade/noturno)',
        aplicavel: temAdicionais,
        motivo: !temAdicionais ? 'Nenhum adicional foi identificado' : undefined,
      },
      {
        nome: 'Saque do FGTS',
        aplicavel: tipo === 'demissao_sem_justa_causa' || tipo === 'acordo' || tipo === 'termino_contrato',
        motivo: tipo === 'pedido_demissao' ? 'No pedido de demissão, não há saque imediato do FGTS' :
                tipo === 'justa_causa' ? 'Não aplicável em demissão por justa causa' : undefined,
      },
      {
        nome: 'Multa de 40% sobre FGTS',
        aplicavel: tipo === 'demissao_sem_justa_causa',
        motivo: tipo === 'acordo' ? 'No acordo, a multa é de 20%' :
                tipo === 'pedido_demissao' ? 'Não há multa no pedido de demissão' :
                tipo === 'justa_causa' ? 'Não aplicável em demissão por justa causa' : undefined,
      },
      {
        nome: 'Multa de 20% sobre FGTS (acordo)',
        aplicavel: tipo === 'acordo',
        motivo: tipo !== 'acordo' ? 'Aplicável apenas em rescisão por acordo' : undefined,
      },
      {
        nome: 'Seguro-desemprego',
        aplicavel: tipo === 'demissao_sem_justa_causa',
        motivo: tipo !== 'demissao_sem_justa_causa' ? 'Aplicável apenas em demissão sem justa causa' : undefined,
      },
    ];

    return direitos;
  };

  const direitos = getDireitos();
  const direitosAplicaveis = direitos.filter(d => d.aplicavel);
  const direitosNaoAplicaveis = direitos.filter(d => !d.aplicavel);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Mapa de Direitos Trabalhistas</h2>
          <p className="text-sm text-muted-foreground">Todos os direitos avaliados nesta análise</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-foreground leading-relaxed mb-6">
          O sistema avaliou todos os direitos trabalhistas possíveis para o seu caso. Abaixo você pode ver 
          quais direitos são aplicáveis à sua situação e quais não se aplicam ao seu tipo de desligamento.
        </p>
        
        {/* Direitos Aplicáveis */}
        <div className="mb-6">
          <h4 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Direitos Aplicáveis ao Seu Caso ({direitosAplicaveis.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {direitosAplicaveis.map((direito, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-sm text-foreground">{direito.nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Direitos Não Aplicáveis */}
        {direitosNaoAplicaveis.length > 0 && (
          <div>
            <h4 className="font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <MinusCircle className="w-5 h-5" />
              Não Aplicáveis Neste Desligamento ({direitosNaoAplicaveis.length})
            </h4>
            <div className="space-y-2">
              {direitosNaoAplicaveis.map((direito, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-3 bg-muted/30 border border-border rounded-lg"
                >
                  <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-muted-foreground">{direito.nome}</span>
                    {direito.motivo && (
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{direito.motivo}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nota informativa */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Importante:</strong> Mesmo os direitos marcados como "não aplicáveis" foram 
            considerados na análise. Isso demonstra que o sistema avaliou todas as possibilidades 
            para o seu caso específico.
          </p>
        </div>
      </div>
    </section>
  );
}
