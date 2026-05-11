-- =============================================================================
-- SCHEMA INICIAL — Rescisão Certa
-- =============================================================================
-- Cobre o funil completo:
--   1. quiz_sessions   → sessão do quiz iniciada (uma por usuário/dispositivo)
--   2. calculos        → resultado calculado do quiz (1:1 com quiz_sessions)
--   3. pagamentos      → tentativas de pagamento via PIX (N:1 com calculos)
--   4. relatorios      → documentos gerados (relatório completo, carta, checklist)
--   5. eventos         → telemetria do funil (drop-off, conversão)
--
-- Acesso anônimo (sem auth):
--   - INSERT/UPDATE em quiz_sessions, calculos, pagamentos, eventos por anon.
--   - SELECT em calculos/relatorios apenas via codigo_unico (token aleatório).
--   - SELECT em pagamentos apenas via quiz_session_id (UUID dificil de adivinhar).
-- =============================================================================

-- Extensão para UUID v4
create extension if not exists "uuid-ossp";

-- Função utilitária: atualiza updated_at automaticamente em UPDATEs
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- 1. quiz_sessions — uma linha por sessão de quiz iniciada
-- =============================================================================
create table public.quiz_sessions (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  -- Respostas em JSONB (flexível: o quiz pode evoluir sem migration)
  -- Estrutura: { salarioFixo: 3000, dataAdmissao: '2024-01-01', ... }
  respostas       jsonb not null default '{}'::jsonb,
  -- Progresso
  etapa_atual     integer not null default 0,
  bloco           text not null default 'essencial', -- 'essencial' | 'extras'
  completo        boolean not null default false,
  -- Anti-fraude / debug (opcionais)
  user_agent      text,
  ip_hash         text,
  -- Marca temporal de conclusão
  completed_at    timestamptz
);

create trigger quiz_sessions_set_updated_at
  before update on public.quiz_sessions
  for each row execute function set_updated_at();

create index quiz_sessions_created_at_idx on public.quiz_sessions (created_at desc);
create index quiz_sessions_completo_idx on public.quiz_sessions (completo) where completo = true;

-- =============================================================================
-- 2. calculos — resultado do cálculo da rescisão
-- =============================================================================
create table public.calculos (
  id                uuid primary key default uuid_generate_v4(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  quiz_session_id   uuid not null references public.quiz_sessions(id) on delete cascade,
  -- Token público (slug curto) usado em URLs de relatório acessíveis sem auth
  codigo_unico      text not null unique,
  -- Valores principais
  valor_base        numeric(12,2) not null default 0,
  valor_bruto       numeric(12,2) not null default 0,
  total_descontos   numeric(12,2) not null default 0,
  valor_potencial   numeric(12,2),
  -- Estrutura detalhada do cálculo
  verbas            jsonb not null default '[]'::jsonb,
  modulos_extras    jsonb not null default '[]'::jsonb,
  detalhamento      jsonb,
  -- Metadados úteis
  tipo_rescisao     text,
  meses_trabalhados integer
);

create trigger calculos_set_updated_at
  before update on public.calculos
  for each row execute function set_updated_at();

create index calculos_quiz_session_idx on public.calculos (quiz_session_id);
create index calculos_codigo_unico_idx on public.calculos (codigo_unico);
create index calculos_created_at_idx on public.calculos (created_at desc);

-- =============================================================================
-- 3. pagamentos — tentativas de pagamento via PIX
-- =============================================================================
-- N:1 com calculos: o mesmo cálculo pode ter múltiplas tentativas
-- (PIX expira em ~30 min, usuário pode tentar de novo).
create table public.pagamentos (
  id                  uuid primary key default uuid_generate_v4(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  paid_at             timestamptz,
  expires_at          timestamptz,
  calculo_id          uuid not null references public.calculos(id) on delete cascade,
  quiz_session_id     uuid references public.quiz_sessions(id) on delete set null,
  -- Status: 'pendente' | 'pago' | 'expirado' | 'cancelado' | 'erro'
  status              text not null default 'pendente',
  amount_cents        integer not null,
  -- Provedor de pagamento
  provider            text not null default 'pagarme', -- 'pagarme' | 'mercadopago' | etc
  provider_order_id   text,
  provider_charge_id  text,
  -- Dados do PIX
  qr_code             text,         -- payload "copia e cola"
  qr_code_url         text,         -- URL da imagem
  -- Dados do comprador (não usar como auth, é só metadado)
  email               text,
  nome                text
);

create trigger pagamentos_set_updated_at
  before update on public.pagamentos
  for each row execute function set_updated_at();

create index pagamentos_calculo_idx on public.pagamentos (calculo_id);
create index pagamentos_quiz_session_idx on public.pagamentos (quiz_session_id);
create index pagamentos_status_idx on public.pagamentos (status);
create index pagamentos_provider_order_idx on public.pagamentos (provider_order_id) where provider_order_id is not null;
create index pagamentos_provider_charge_idx on public.pagamentos (provider_charge_id) where provider_charge_id is not null;

-- =============================================================================
-- 4. relatorios — documentos gerados por IA (relatório completo, carta, checklist)
-- =============================================================================
create table public.relatorios (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  calculo_id   uuid not null references public.calculos(id) on delete cascade,
  -- Tipo: 'relatorio_completo' | 'carta_rh' | 'checklist'
  tipo         text not null,
  conteudo     jsonb not null default '{}'::jsonb,
  versao       integer not null default 1
);

create trigger relatorios_set_updated_at
  before update on public.relatorios
  for each row execute function set_updated_at();

create index relatorios_calculo_idx on public.relatorios (calculo_id);
create index relatorios_tipo_idx on public.relatorios (tipo);
create unique index relatorios_calculo_tipo_versao_idx on public.relatorios (calculo_id, tipo, versao);

-- =============================================================================
-- 5. eventos — telemetria do funil
-- =============================================================================
create table public.eventos (
  id              bigint generated always as identity primary key,
  created_at      timestamptz not null default now(),
  quiz_session_id uuid references public.quiz_sessions(id) on delete cascade,
  calculo_id      uuid references public.calculos(id) on delete cascade,
  -- Tipo livre, ex.: 'quiz_started', 'pergunta_respondida', 'extras_iniciado',
  --   'quiz_completed', 'pagamento_iniciado', 'pagamento_confirmado',
  --   'relatorio_gerado', 'pagina_visitada'
  tipo            text not null,
  metadata        jsonb not null default '{}'::jsonb
);

create index eventos_quiz_session_idx on public.eventos (quiz_session_id);
create index eventos_tipo_idx on public.eventos (tipo);
create index eventos_created_at_idx on public.eventos (created_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Estratégia: acesso anônimo (sem auth de usuário) com restrições mínimas.
-- O frontend usa a anon key e identifica registros pelo UUID/codigo_unico.

alter table public.quiz_sessions enable row level security;
alter table public.calculos enable row level security;
alter table public.pagamentos enable row level security;
alter table public.relatorios enable row level security;
alter table public.eventos enable row level security;

-- ----- quiz_sessions -----
-- Anon pode criar e atualizar suas próprias sessões (sabendo o UUID).
create policy "anon can insert quiz_sessions"
  on public.quiz_sessions for insert
  to anon, authenticated
  with check (true);

create policy "anon can update quiz_sessions by id"
  on public.quiz_sessions for update
  to anon, authenticated
  using (true)
  with check (true);

-- Leitura: por UUID exato (não permite listar todas).
create policy "anon can select quiz_sessions by id"
  on public.quiz_sessions for select
  to anon, authenticated
  using (true);

-- ----- calculos -----
create policy "anon can insert calculos"
  on public.calculos for insert
  to anon, authenticated
  with check (true);

create policy "anon can update calculos"
  on public.calculos for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon can select calculos"
  on public.calculos for select
  to anon, authenticated
  using (true);

-- ----- pagamentos -----
create policy "anon can insert pagamentos"
  on public.pagamentos for insert
  to anon, authenticated
  with check (true);

create policy "anon can update pagamentos"
  on public.pagamentos for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon can select pagamentos"
  on public.pagamentos for select
  to anon, authenticated
  using (true);

-- ----- relatorios -----
create policy "anon can insert relatorios"
  on public.relatorios for insert
  to anon, authenticated
  with check (true);

create policy "anon can update relatorios"
  on public.relatorios for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "anon can select relatorios"
  on public.relatorios for select
  to anon, authenticated
  using (true);

-- ----- eventos -----
-- Apenas INSERT (telemetria write-only do frontend).
create policy "anon can insert eventos"
  on public.eventos for insert
  to anon, authenticated
  with check (true);

-- NOTA SOBRE RLS:
-- Estas policies são intencionalmente permissivas porque o app é anônimo
-- e usa UUIDs aleatórios como token de acesso (não dá pra adivinhar).
-- Quando adicionar autenticação no futuro, refinar policies pra:
--   - SELECT em calculos: apenas se o caller souber o codigo_unico
--   - UPDATE em pagamentos: apenas via Edge Function (service_role)
--   - INSERT em relatorios: apenas via Edge Function

-- =============================================================================
-- FIM
-- =============================================================================
