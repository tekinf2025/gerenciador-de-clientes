
-- Criar tabela para logs de recarga
CREATE TABLE public.logs_recarga (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL,
  nome_cliente TEXT NOT NULL,
  servidor TEXT NOT NULL,
  data_vencimento_antes DATE NOT NULL,
  data_vencimento_depois DATE NOT NULL,
  meses_adicionados INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar foreign key para clientes
ALTER TABLE public.logs_recarga 
ADD CONSTRAINT fk_logs_recarga_cliente 
FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;

-- Habilitar RLS
ALTER TABLE public.logs_recarga ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT para todos
CREATE POLICY "Permitir leitura dos logs de recarga" 
  ON public.logs_recarga 
  FOR SELECT 
  TO public
  USING (true);

-- Política para permitir INSERT para todos
CREATE POLICY "Permitir inserção de logs de recarga" 
  ON public.logs_recarga 
  FOR INSERT 
  TO public
  WITH CHECK (true);
