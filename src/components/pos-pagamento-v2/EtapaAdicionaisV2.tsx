import { DadosAdicionaisV2, OpcaoSimNaoNaoSei, GrauInsalubridade, DadosFluxoAnterior } from '@/types/pos-pagamento-v2';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ShieldAlert, Moon, Flame } from 'lucide-react';

interface EtapaAdicionaisV2Props {
  dados: DadosAdicionaisV2;
  dadosFluxoAnterior: DadosFluxoAnterior;
  onUpdate: <K extends keyof DadosAdicionaisV2>(field: K, value: DadosAdicionaisV2[K]) => void;
}

export function EtapaAdicionaisV2({ dados, dadosFluxoAnterior, onUpdate }: EtapaAdicionaisV2Props) {
  const temNoturno = dadosFluxoAnterior.adicionaisSelecionados.some(
    a => a.toLowerCase().includes('noturno')
  );
  const temPericulosidade = dadosFluxoAnterior.adicionaisSelecionados.some(
    a => a.toLowerCase().includes('periculosidade')
  );
  const temInsalubridade = dadosFluxoAnterior.adicionaisSelecionados.some(
    a => a.toLowerCase().includes('insalubridade')
  );

  return (
    <div className="space-y-5">
      {/* Header da seção */}
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Adicionais de Trabalho</h3>
          <p className="text-sm text-muted-foreground">Verifique seus adicionais</p>
        </div>
      </div>

      {/* Trabalho Noturno */}
      {temNoturno && (
        <div className="p-4 bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl border border-blue-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Moon className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="font-semibold text-foreground">Trabalho Noturno</h4>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Você recebia adicional noturno corretamente?</Label>
            <Select
              value={dados.recebiaAdicionalNoturnoCorretamente || ''}
              onValueChange={(v) => onUpdate('recebiaAdicionalNoturnoCorretamente', v as OpcaoSimNaoNaoSei)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="nao_sei">Não sei</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dados.recebiaAdicionalNoturnoCorretamente !== 'sim' && (
            <div className="space-y-3">
              <Label htmlFor="horasNoturnas" className="text-sm font-medium">
                Média de horas noturnas por semana (22h às 5h)
              </Label>
              <Input
                id="horasNoturnas"
                type="number"
                min={0}
                max={40}
                value={dados.horasNoturnasSemanaH || ''}
                onChange={(e) => onUpdate('horasNoturnasSemanaH', Number(e.target.value))}
                placeholder="Ex: 20"
                className="bg-background"
              />
            </div>
          )}
        </div>
      )}

      {/* Periculosidade */}
      {temPericulosidade && (
        <div className="p-4 bg-gradient-to-br from-orange-500/5 to-orange-500/10 rounded-xl border border-orange-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-600" />
            </div>
            <h4 className="font-semibold text-foreground">Periculosidade</h4>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Você recebia adicional de periculosidade corretamente?</Label>
            <Select
              value={dados.recebiaPericulosidadeCorretamente || ''}
              onValueChange={(v) => onUpdate('recebiaPericulosidadeCorretamente', v as OpcaoSimNaoNaoSei)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim (30% sobre salário)</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="nao_sei">Não sei</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              📋 Periculosidade = 30% sobre o salário-base (CLT art. 193)
            </p>
          </div>
        </div>
      )}

      {/* Insalubridade */}
      {temInsalubridade && (
        <div className="p-4 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 rounded-xl border border-yellow-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-yellow-600" />
            </div>
            <h4 className="font-semibold text-foreground">Insalubridade</h4>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Qual o grau de insalubridade?</Label>
            <Select
              value={dados.grauInsalubridade || ''}
              onValueChange={(v) => onUpdate('grauInsalubridade', v as GrauInsalubridade)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimo">Mínimo (10%)</SelectItem>
                <SelectItem value="medio">Médio (20%)</SelectItem>
                <SelectItem value="maximo">Máximo (40%)</SelectItem>
                <SelectItem value="nao_sei">Não sei</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Você recebia adicional de insalubridade corretamente?</Label>
            <Select
              value={dados.recebiaInsalubridadeCorretamente || ''}
              onValueChange={(v) => onUpdate('recebiaInsalubridadeCorretamente', v as OpcaoSimNaoNaoSei)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
                <SelectItem value="nao_sei">Não sei</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              📋 Base de cálculo: salário mínimo (CLT art. 192)
            </p>
          </div>
        </div>
      )}

      {!temNoturno && !temPericulosidade && !temInsalubridade && (
        <div className="text-center py-8 px-4">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            Nenhum adicional selecionado no formulário anterior.
          </p>
        </div>
      )}
    </div>
  );
}
