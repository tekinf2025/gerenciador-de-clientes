
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type LogRecargaDB = Database['public']['Tables']['logs_recarga']['Row'];
type LogRecargaInsert = Database['public']['Tables']['logs_recarga']['Insert'];

export interface LogRecarga {
  id: string;
  cliente_id: string;
  nome_cliente: string;
  servidor: string;
  data_vencimento_antes: string;
  data_vencimento_depois: string;
  meses_adicionados: number;
  created_at: string;
}

export const useLogsRecarga = () => {
  const [logs, setLogs] = useState<LogRecarga[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('logs_recarga')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar logs:', error);
        toast({
          title: "Erro ao carregar logs",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const logsFormatted = (data || []).map((log: LogRecargaDB): LogRecarga => ({
        id: log.id,
        cliente_id: log.cliente_id,
        nome_cliente: log.nome_cliente,
        servidor: log.servidor,
        data_vencimento_antes: log.data_vencimento_antes,
        data_vencimento_depois: log.data_vencimento_depois,
        meses_adicionados: log.meses_adicionados,
        created_at: log.created_at,
      }));

      setLogs(logsFormatted);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast({
        title: "Erro ao carregar logs",
        description: "Erro inesperado ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createLog = async (logData: Omit<LogRecarga, 'id' | 'created_at'>) => {
    try {
      const insertData: LogRecargaInsert = {
        cliente_id: logData.cliente_id,
        nome_cliente: logData.nome_cliente,
        servidor: logData.servidor,
        data_vencimento_antes: logData.data_vencimento_antes,
        data_vencimento_depois: logData.data_vencimento_depois,
        meses_adicionados: logData.meses_adicionados,
      };

      const { error } = await supabase
        .from('logs_recarga')
        .insert([insertData]);

      if (error) {
        console.error('Erro ao criar log:', error);
        toast({
          title: "Erro ao criar log",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      await fetchLogs();
      return true;
    } catch (error) {
      console.error('Erro ao criar log:', error);
      toast({
        title: "Erro ao criar log",
        description: "Erro inesperado ao criar log",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return {
    logs,
    loading,
    fetchLogs,
    createLog,
  };
};
