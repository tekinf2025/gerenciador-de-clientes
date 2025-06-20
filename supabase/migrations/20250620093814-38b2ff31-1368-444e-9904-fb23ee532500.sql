
-- Criar tabela para configurações do WhatsApp
CREATE TABLE public.configuracoes_whatsapp (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mensagem_padrao TEXT NOT NULL DEFAULT 'Bom dia. Olá! Oi, tudo bem?
Seu plano vence em: {dias_vencimento}
Vamos renovar o seu plano!

Vencimento: {data_vencimento}
Plano mensal: {plano_mensal}
Plano trimestral: {plano_trimestral}

NU PAGAMENTOS
TEKINFORMÁTICA
CHAVE PIX EMAIL',
  assinatura_automatica BOOLEAN NOT NULL DEFAULT false,
  assinatura TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO public.configuracoes_whatsapp (mensagem_padrao, assinatura_automatica, assinatura) 
VALUES (
  'Bom dia. Olá! Oi, tudo bem?
Seu plano vence em: {dias_vencimento}
Vamos renovar o seu plano!

Vencimento: {data_vencimento}
Plano mensal: {plano_mensal}
Plano trimestral: {plano_trimestral}

NU PAGAMENTOS
TEKINFORMÁTICA
CHAVE PIX EMAIL',
  false,
  ''
);

-- Habilitar RLS
ALTER TABLE public.configuracoes_whatsapp ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT para todos (configuração global)
CREATE POLICY "Permitir leitura das configurações WhatsApp" 
  ON public.configuracoes_whatsapp 
  FOR SELECT 
  TO public
  USING (true);

-- Política para permitir UPDATE para todos (configuração global)
CREATE POLICY "Permitir atualização das configurações WhatsApp" 
  ON public.configuracoes_whatsapp 
  FOR UPDATE 
  TO public
  USING (true);
