
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Cliente {
  id: string;
  id_client: string;
  nome: string;
  telefone: string;
  servidor: string;
  plano_mensal: number;
  plano_trimestral: number;
  data_vencimento: string;
  status: string;
  conta_criada: string;
  observacao?: string;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome', { ascending: true });

      if (error) {
        console.error('Erro ao buscar clientes:', error);
        toast({
          title: "Erro ao carregar clientes",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Erro inesperado ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (clienteData: Omit<Cliente, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cliente:', error);
        toast({
          title: "Erro ao criar cliente",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      await fetchClientes(); // Recarrega a lista
      toast({
        title: "Cliente criado",
        description: `${clienteData.nome} foi adicionado com sucesso`,
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: "Erro ao criar cliente",
        description: "Erro inesperado ao criar cliente",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateCliente = async (id: string, clienteData: Partial<Cliente>) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar cliente:', error);
        toast({
          title: "Erro ao atualizar cliente",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      await fetchClientes(); // Recarrega a lista
      toast({
        title: "Cliente atualizado",
        description: `Cliente foi atualizado com sucesso`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Erro inesperado ao atualizar cliente",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar cliente:', error);
        toast({
          title: "Erro ao deletar cliente",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      await fetchClientes(); // Recarrega a lista
      toast({
        title: "Cliente removido",
        description: "Cliente foi removido com sucesso",
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      toast({
        title: "Erro ao deletar cliente",
        description: "Erro inesperado ao deletar cliente",
        variant: "destructive",
      });
      return false;
    }
  };

  const importClientesCSV = async (novosClientes: Omit<Cliente, 'id'>[]) => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert(novosClientes)
        .select();

      if (error) {
        console.error('Erro ao importar clientes:', error);
        toast({
          title: "Erro ao importar CSV",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      await fetchClientes(); // Recarrega a lista
      toast({
        title: "CSV importado",
        description: `${data.length} clientes adicionados com sucesso`,
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao importar clientes:', error);
      toast({
        title: "Erro ao importar CSV",
        description: "Erro inesperado ao importar dados",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    loading,
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    importClientesCSV,
  };
};
