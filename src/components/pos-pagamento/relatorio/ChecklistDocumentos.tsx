import { useState } from 'react';
import { 
  ClipboardList, 
  Square,
  CheckSquare,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentoItem {
  id: string;
  nome: string;
  descricao: string;
  importante: boolean;
}

export function ChecklistDocumentos() {
  const documentos: DocumentoItem[] = [
    {
      id: 'trct',
      nome: 'TRCT (Termo de Rescisão)',
      descricao: 'Documento oficial com todos os valores da rescisão',
      importante: true,
    },
    {
      id: 'termo_quitacao',
      nome: 'Termo de Quitação',
      descricao: 'Comprovante de pagamento das verbas rescisórias',
      importante: true,
    },
    {
      id: 'holerites',
      nome: 'Holerites (últimos 12 meses)',
      descricao: 'Para conferência de médias e adicionais recebidos',
      importante: true,
    },
    {
      id: 'cartao_ponto',
      nome: 'Cartão de Ponto / Espelho de Jornada',
      descricao: 'Registro oficial das horas trabalhadas',
      importante: true,
    },
    {
      id: 'extrato_fgts',
      nome: 'Extrato Analítico do FGTS',
      descricao: 'Para conferência dos depósitos mensais',
      importante: true,
    },
    {
      id: 'ctps',
      nome: 'Carteira de Trabalho (CTPS)',
      descricao: 'Registro do vínculo com datas de admissão e desligamento',
      importante: true,
    },
    {
      id: 'contrato',
      nome: 'Contrato de Trabalho',
      descricao: 'Documento original com cláusulas do vínculo',
      importante: false,
    },
    {
      id: 'acordos',
      nome: 'Acordos ou Aditivos Contratuais',
      descricao: 'Alterações no contrato original',
      importante: false,
    },
    {
      id: 'convencao',
      nome: 'Convenção Coletiva da Categoria',
      descricao: 'Pode prever pisos e benefícios adicionais',
      importante: false,
    },
  ];

  const [checados, setChecados] = useState<Set<string>>(new Set());

  const toggleDocumento = (id: string) => {
    setChecados(prev => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  };

  const documentosImportantes = documentos.filter(d => d.importante);
  const documentosComplementares = documentos.filter(d => !d.importante);
  const totalChecados = checados.size;
  const totalDocumentos = documentos.length;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Checklist de Documentos Essenciais</h2>
          <p className="text-sm text-muted-foreground">Documentos necessários para conferência completa</p>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl p-6">
        {/* Barra de progresso */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Documentos reunidos</span>
            <span className="text-sm font-medium text-foreground">{totalChecados} de {totalDocumentos}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(totalChecados / totalDocumentos) * 100}%` }}
            />
          </div>
        </div>

        {/* Documentos Essenciais */}
        <div className="mb-6">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-500" />
            Documentos Essenciais
          </h4>
          <div className="space-y-2">
            {documentosImportantes.map((doc) => (
              <button
                key={doc.id}
                onClick={() => toggleDocumento(doc.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
                  checados.has(doc.id) 
                    ? "bg-emerald-50 border-emerald-200" 
                    : "bg-muted/30 border-border hover:border-primary/30"
                )}
              >
                {checados.has(doc.id) ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    checados.has(doc.id) ? "text-emerald-700 line-through" : "text-foreground"
                  )}>
                    {doc.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.descricao}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Documentos Complementares */}
        <div>
          <h4 className="font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documentos Complementares
          </h4>
          <div className="space-y-2">
            {documentosComplementares.map((doc) => (
              <button
                key={doc.id}
                onClick={() => toggleDocumento(doc.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left",
                  checados.has(doc.id) 
                    ? "bg-emerald-50 border-emerald-200" 
                    : "bg-muted/30 border-border hover:border-primary/30"
                )}
              >
                {checados.has(doc.id) ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    checados.has(doc.id) ? "text-emerald-700 line-through" : "text-foreground"
                  )}>
                    {doc.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">{doc.descricao}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Aviso importante */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>👉 Importante:</strong> Sem esses documentos, nenhuma rescisão pode ser considerada 
            100% conferida. Guarde-os por no mínimo 5 anos após o desligamento.
          </p>
        </div>
      </div>
    </section>
  );
}
