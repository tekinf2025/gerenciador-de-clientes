import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ClienteDB = Database['public']['Tables']['clientes']['Row'];
type ClienteInsert = Database['public']['Tables']['clientes']['Insert'];
type ClienteUpdate = Database['public']['Tables']['clientes']['Update'];

export interface Cliente {
  id: string;
  id_client: string;
  nome: string;
  telefone: string;
  servidor: 'P2X' | 'P2_SERVER' | 'CPLAYER' | 'RTV' | 'RTV-VODs';
  plano_mensal: number;
  plano_trimestral: number;
  data_vencimento: string;
  status: 'Ativo' | 'Vencido';
  conta_criada: string;
  observacao?: string;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para normalizar datas (adiciona T00:00:00 se necessário)
  const normalizeDate = (dateStr: string): string => {
    if (!dateStr) return dateStr;
    // Se a data não tem horário, adiciona T00:00:00
    if (dateStr.length === 10 && !dateStr.includes('T')) {
      return `${dateStr}T00:00:00`;
    }
    return dateStr;
  };

  // Função para zerar horários nas comparações
  const getDateWithoutTime = (dateStr: string): Date => {
    const date = new Date(normalizeDate(dateStr));
    date.setHours(0, 0, 0, 0);
    return date;
  };

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

      // Converter dados do banco para o formato da interface
      const clientesFormatted = (data || []).map((cliente: ClienteDB): Cliente => ({
        id: cliente.id,
        id_client: cliente.id_client,
        nome: cliente.nome,
        telefone: cliente.telefone || '',
        servidor: cliente.servidor as Cliente['servidor'],
        plano_mensal: Number(cliente.plano_mensal),
        plano_trimestral: Number(cliente.plano_trimestral),
        data_vencimento: cliente.data_vencimento,
        status: cliente.status as Cliente['status'],
        conta_criada: cliente.conta_criada,
        observacao: cliente.observacao || undefined,
      }));

      setClientes(clientesFormatted);
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
      const insertData: ClienteInsert = {
        id_client: clienteData.id_client,
        nome: clienteData.nome,
        telefone: clienteData.telefone || null,
        servidor: clienteData.servidor,
        plano_mensal: clienteData.plano_mensal,
        plano_trimestral: clienteData.plano_trimestral,
        data_vencimento: clienteData.data_vencimento,
        conta_criada: clienteData.conta_criada,
        observacao: clienteData.observacao || null,
      };

      const { data, error } = await supabase
        .from('clientes')
        .insert([insertData])
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

      await fetchClientes();
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
      const updateData: ClienteUpdate = {};
      
      if (clienteData.nome !== undefined) updateData.nome = clienteData.nome;
      if (clienteData.telefone !== undefined) updateData.telefone = clienteData.telefone || null;
      if (clienteData.servidor !== undefined) updateData.servidor = clienteData.servidor;
      if (clienteData.plano_mensal !== undefined) updateData.plano_mensal = clienteData.plano_mensal;
      if (clienteData.plano_trimestral !== undefined) updateData.plano_trimestral = clienteData.plano_trimestral;
      if (clienteData.data_vencimento !== undefined) updateData.data_vencimento = clienteData.data_vencimento;
      if (clienteData.conta_criada !== undefined) updateData.conta_criada = clienteData.conta_criada;
      if (clienteData.observacao !== undefined) updateData.observacao = clienteData.observacao || null;

      const { error } = await supabase
        .from('clientes')
        .update(updateData)
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

      await fetchClientes();
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

      await fetchClientes();
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
      const insertData: ClienteInsert[] = novosClientes.map(cliente => ({
        id_client: cliente.id_client,
        nome: cliente.nome,
        telefone: cliente.telefone || null,
        servidor: cliente.servidor,
        plano_mensal: cliente.plano_mensal,
        plano_trimestral: cliente.plano_trimestral,
        data_vencimento: cliente.data_vencimento,
        conta_criada: cliente.conta_criada,
        observacao: cliente.observacao || null,
      }));

      const { data, error } = await supabase
        .from('clientes')
        .insert(insertData)
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

      await fetchClientes();
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

  const adicionarMeses = async (clienteId: string, meses: number) => {
    try {
      const cliente = clientes.find(c => c.id === clienteId);
      if (!cliente) return false;

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const dataVencimentoAtual = getDateWithoutTime(cliente.data_vencimento);
      
      let novaDataVencimento: Date;
      
      // Regra: Se o cliente está vencido, calcular a partir de hoje
      if (dataVencimentoAtual < hoje) {
        novaDataVencimento = new Date(hoje);
        novaDataVencimento.setMonth(novaDataVencimento.getMonth() + meses);
        
        toast({
          title: "Cliente Recarregado",
          description: `Cliente ${cliente.nome} estava vencido e foi recarregado a partir de hoje`,
        });
      } else {
        // Se não está vencido, calcular a partir da data atual de vencimento
        novaDataVencimento = new Date(dataVencimentoAtual);
        novaDataVencimento.setMonth(novaDataVencimento.getMonth() + meses);
      }
      
      const novaData = novaDataVencimento.toISOString().split('T')[0];

      const success = await updateCliente(clienteId, {
        data_vencimento: novaData
      });

      if (success) {
        toast({
          title: "Vencimento atualizado",
          description: `Adicionado ${meses} mês(es) ao cliente ${cliente.nome}`,
        });
      }

      return success;
    } catch (error) {
      console.error('Erro ao adicionar meses:', error);
      toast({
        title: "Erro ao atualizar vencimento",
        description: "Erro inesperado ao adicionar meses",
        variant: "destructive",
      });
      return false;
    }
  };

  // Função para calcular status baseado na data de vencimento
  const calcularStatus = (dataVencimento: string): string => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = getDateWithoutTime(dataVencimento);
    return vencimento >= hoje ? 'Ativo' : 'Vencido';
  };

  // Função para calcular dias até vencimento
  const calcularDiasVencimento = (dataVencimento: string): number => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const vencimento = getDateWithoutTime(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Função para calcular dias ativo
  const calcularDiasAtivo = (contaCriada: string): number => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const criacao = getDateWithoutTime(contaCriada);
    const diffTime = hoje.getTime() - criacao.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
    adicionarMeses,
    calcularStatus,
    calcularDiasVencimento,
    calcularDiasAtivo,
  };
};
