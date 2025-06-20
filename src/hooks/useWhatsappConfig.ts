
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type WhatsappConfigDB = Database['public']['Tables']['configuracoes_whatsapp']['Row'];
type WhatsappConfigUpdate = Database['public']['Tables']['configuracoes_whatsapp']['Update'];

export interface WhatsappConfig {
  id: string;
  mensagem_padrao: string;
  assinatura_automatica: boolean;
  assinatura: string | null;
}

export const useWhatsappConfig = () => {
  const [config, setConfig] = useState<WhatsappConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('configuracoes_whatsapp')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao buscar configurações WhatsApp:', error);
        toast({
          title: "Erro ao carregar configurações",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setConfig({
          id: data.id,
          mensagem_padrao: data.mensagem_padrao,
          assinatura_automatica: data.assinatura_automatica,
          assinatura: data.assinatura,
        });
      }
    } catch (error) {
      console.error('Erro ao buscar configurações WhatsApp:', error);
      toast({
        title: "Erro ao carregar configurações",
        description: "Erro inesperado ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (configData: Partial<WhatsappConfig>) => {
    if (!config) return false;

    try {
      const updateData: WhatsappConfigUpdate = {};
      
      if (configData.mensagem_padrao !== undefined) updateData.mensagem_padrao = configData.mensagem_padrao;
      if (configData.assinatura_automatica !== undefined) updateData.assinatura_automatica = configData.assinatura_automatica;
      if (configData.assinatura !== undefined) updateData.assinatura = configData.assinatura || null;

      const { error } = await supabase
        .from('configuracoes_whatsapp')
        .update(updateData)
        .eq('id', config.id);

      if (error) {
        console.error('Erro ao atualizar configurações WhatsApp:', error);
        toast({
          title: "Erro ao salvar configurações",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      await fetchConfig();
      toast({
        title: "Configurações salvas",
        description: "Configurações do WhatsApp foram atualizadas com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações WhatsApp:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Erro inesperado ao salvar configurações",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    updateConfig,
    fetchConfig,
  };
};
