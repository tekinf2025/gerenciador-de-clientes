
import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Edit, Trash2, MessageCircle, Download, Upload, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { useClientes, Cliente } from '@/hooks/useClientes';

const servidorCustos = {
  'P2X': 6.00,
  'P2_SERVER': 10.00,
  'CPLAYER': 8.00,
  'RTV': 8.00,
  'RTV-VODs': 0.00
};

const Clientes = () => {
  const { 
    clientes, 
    loading, 
    createCliente, 
    updateCliente, 
    deleteCliente, 
    importClientesCSV 
  } = useClientes();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterServidor, setFilterServidor] = useState('Todos');
  const [sortField, setSortField] = useState<keyof Cliente>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Cálculo de status baseado na data de vencimento
  const calcularStatus = (dataVencimento: string): string => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento >= hoje ? 'Ativo' : 'Vencido';
  };

  // Cálculo de dias até vencimento
  const calcularDiasVencimento = (dataVencimento: string): number => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diffTime = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Cálculo de dias ativo
  const calcularDiasAtivo = (contaCriada: string): number => {
    const hoje = new Date();
    const criacao = new Date(contaCriada);
    const diffTime = hoje.getTime() - criacao.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtrar e ordenar clientes
  const clientesFiltrados = useMemo(() => {
    let filtered = clientes.filter(cliente => {
      const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cliente.telefone.includes(searchTerm) ||
                           cliente.id_client.toLowerCase().includes(searchTerm.toLowerCase());
      
      const statusAtual = calcularStatus(cliente.data_vencimento);
      const matchesStatus = filterStatus === 'Todos' || statusAtual === filterStatus;
      const matchesServidor = filterServidor === 'Todos' || cliente.servidor === filterServidor;
      
      return matchesSearch && matchesStatus && matchesServidor;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'data_vencimento' || sortField === 'conta_criada') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clientes, searchTerm, filterStatus, filterServidor, sortField, sortDirection]);

  const handleSort = (field: keyof Cliente) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Cliente) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-gray-400" />;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const handleWhatsApp = (cliente: Cliente) => {
    const diasVencimento = calcularDiasVencimento(cliente.data_vencimento);
    const statusMsg = diasVencimento < 0 ? 'venceu' : `vence em ${diasVencimento} dias`;
    
    const mensagem = `Olá ${cliente.nome}! Este é um lembrete sobre seu plano ${cliente.servidor}. Seu serviço ${statusMsg} (${new Date(cliente.data_vencimento).toLocaleDateString('pt-BR')}). Valor: R$ ${cliente.plano_mensal}/mês. Para renovar, entre em contato conosco.`;
    
    const url = `https://wa.me/${cliente.telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    
    toast({
      title: "WhatsApp aberto",
      description: `Mensagem preparada para ${cliente.nome}`,
    });
  };

  const handleBulkWhatsApp = () => {
    if (selectedClientes.length === 0) {
      toast({
        title: "Nenhum cliente selecionado",
        description: "Selecione pelo menos um cliente para enviar mensagens",
        variant: "destructive",
      });
      return;
    }

    selectedClientes.forEach(id => {
      const cliente = clientes.find(c => c.id === id);
      if (cliente) {
        setTimeout(() => handleWhatsApp(cliente), 1000 * selectedClientes.indexOf(id));
      }
    });

    toast({
      title: "Mensagens programadas",
      description: `${selectedClientes.length} mensagens serão enviadas`,
    });
  };

  const exportCSV = () => {
    const headers = ["id_client","nome","telefone","servidor","plano_mensal","plano_trimestral","data_vencimento","status","conta_criada","observacao"];
    const csvContent = [
      headers.join(','),
      ...clientesFiltrados.map(cliente => [
        `"${cliente.id_client}"`,
        `"${cliente.nome}"`,
        `"${cliente.telefone}"`,
        `"${cliente.servidor}"`,
        `"${cliente.plano_mensal}"`,
        `"${cliente.plano_trimestral}"`,
        `"${cliente.data_vencimento}"`,
        `"${calcularStatus(cliente.data_vencimento)}"`,
        `"${cliente.conta_criada}"`,
        `"${cliente.observacao || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'clientes.csv';
    link.click();

    toast({
      title: "CSV exportado",
      description: "Arquivo baixado com sucesso",
    });
  };

  const importCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
      
      const novosClientes: Omit<Cliente, 'id'>[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
        
        // Gerar um novo ID único para o cliente
        const novoIdClient = `CLI-${Date.now()}-${i}`;
        
        const cliente: Omit<Cliente, 'id'> = {
          id_client: values[0] || novoIdClient,
          nome: values[1],
          telefone: values[2],
          servidor: values[3],
          plano_mensal: parseFloat(values[4]) || 0,
          plano_trimestral: parseFloat(values[5]) || 0,
          data_vencimento: values[6],
          status: values[7] || 'Ativo',
          conta_criada: values[8] || new Date().toISOString().split('T')[0],
          observacao: values[9] || ''
        };
        novosClientes.push(cliente);
      }
      
      await importClientesCSV(novosClientes);
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSaveCliente = async (cliente: Omit<Cliente, 'id'> & { id?: string }) => {
    if (editingCliente && cliente.id) {
      const success = await updateCliente(cliente.id, cliente);
      if (success) {
        setEditingCliente(null);
        setShowForm(false);
      }
    } else {
      // Gerar ID único para novo cliente
      const novoIdClient = `CLI-${Date.now()}`;
      const novoCliente = { ...cliente, id_client: novoIdClient };
      delete novoCliente.id; // Remove o id para criação
      
      const success = await createCliente(novoCliente);
      if (success) {
        setEditingCliente(null);
        setShowForm(false);
      }
    }
  };

  const handleDeleteCliente = async (id: string) => {
    await deleteCliente(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header com barra de pesquisa */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Pesquisar por nome, telefone ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-dark pl-10 w-full"
          />
        </div>

        {/* Botões de ação */}
        <div className="flex flex-wrap items-center gap-4">
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button 
                className="btn-primary flex items-center space-x-2"
                onClick={() => setEditingCliente(null)}
              >
                <Plus size={20} />
                <span>Novo Cliente</span>
              </Button>
            </DialogTrigger>
            <FormularioCliente 
              cliente={editingCliente}
              onSave={handleSaveCliente}
              onCancel={() => {
                setShowForm(false);
                setEditingCliente(null);
              }}
            />
          </Dialog>

          <Button 
            onClick={exportCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download size={20} />
            <span>Exportar CSV</span>
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={importCSV}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button className="btn-secondary flex items-center space-x-2">
              <Upload size={20} />
              <span>Importar CSV</span>
            </Button>
          </div>

          {selectedClientes.length > 0 && (
            <Button 
              onClick={handleBulkWhatsApp}
              className="btn-primary flex items-center space-x-2"
            >
              <MessageCircle size={20} />
              <span>WhatsApp ({selectedClientes.length})</span>
            </Button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 input-dark">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-tek-secondary border-gray-600">
              <SelectItem value="Todos">Todos Status</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterServidor} onValueChange={setFilterServidor}>
            <SelectTrigger className="w-40 input-dark">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-tek-secondary border-gray-600">
              <SelectItem value="Todos">Todos Servidores</SelectItem>
              <SelectItem value="P2X">P2X</SelectItem>
              <SelectItem value="P2_SERVER">P2_SERVER</SelectItem>
              <SelectItem value="CPLAYER">CPLAYER</SelectItem>
              <SelectItem value="RTV">RTV</SelectItem>
              <SelectItem value="RTV-VODs">RTV-VODs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela de clientes */}
      <div className="table-dark overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-8">
                <Checkbox
                  checked={selectedClientes.length === clientesFiltrados.length && clientesFiltrados.length > 0}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedClientes(clientesFiltrados.map(c => c.id));
                    } else {
                      setSelectedClientes([]);
                    }
                  }}
                />
              </th>
              <th>
                <button 
                  onClick={() => handleSort('nome')}
                  className="flex items-center space-x-1 hover:text-tek-cyan"
                >
                  <span>Nome</span>
                  {getSortIcon('nome')}
                </button>
              </th>
              <th>Telefone</th>
              <th>Servidor</th>
              <th>Plano Mensal</th>
              <th>
                <button 
                  onClick={() => handleSort('data_vencimento')}
                  className="flex items-center space-x-1 hover:text-tek-cyan"
                >
                  <span>Vencimento</span>
                  {getSortIcon('data_vencimento')}
                </button>
              </th>
              <th>Status</th>
              <th>Dias Ativo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => {
              const status = calcularStatus(cliente.data_vencimento);
              const diasVencimento = calcularDiasVencimento(cliente.data_vencimento);
              const diasAtivo = calcularDiasAtivo(cliente.conta_criada);
              const custoServidor = servidorCustos[cliente.servidor as keyof typeof servidorCustos] || 0;

              return (
                <tr key={cliente.id} className="hover:bg-gray-800/50">
                  <td>
                    <Checkbox
                      checked={selectedClientes.includes(cliente.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedClientes(prev => [...prev, cliente.id]);
                        } else {
                          setSelectedClientes(prev => prev.filter(id => id !== cliente.id));
                        }
                      }}
                    />
                  </td>
                  <td>
                    <div>
                      <p className="font-medium">{cliente.nome}</p>
                      <p className="text-xs text-gray-400">{cliente.id_client}</p>
                    </div>
                  </td>
                  <td>{cliente.telefone}</td>
                  <td>
                    <div>
                      <span className="text-tek-cyan">{cliente.servidor}</span>
                      <p className="text-xs text-gray-400">Custo: R$ {custoServidor.toFixed(2)}</p>
                    </div>
                  </td>
                  <td>R$ {cliente.plano_mensal.toFixed(2)}</td>
                  <td>
                    <div>
                      <p>{new Date(cliente.data_vencimento).toLocaleDateString('pt-BR')}</p>
                      <p className={`text-xs ${diasVencimento < 0 ? 'text-tek-red' : diasVencimento <= 5 ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {diasVencimento < 0 ? `Vencido há ${Math.abs(diasVencimento)} dias` : `${diasVencimento} dias`}
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      status === 'Ativo' ? 'bg-tek-green/20 text-tek-green' : 'bg-tek-red/20 text-tek-red'
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td>{diasAtivo} dias</td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleWhatsApp(cliente)}
                        className="text-tek-green hover:text-green-400 transition-colors"
                        title="Enviar WhatsApp"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingCliente(cliente);
                          setShowForm(true);
                        }}
                        className="text-tek-blue hover:text-blue-400 transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCliente(cliente.id)}
                        className="text-tek-red hover:text-red-400 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhum cliente encontrado</p>
        </div>
      )}
    </div>
  );
};

// Componente do formulário de cliente
const FormularioCliente = ({ 
  cliente, 
  onSave, 
  onCancel 
}: { 
  cliente: Cliente | null; 
  onSave: (cliente: Omit<Cliente, 'id'> & { id?: string }) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState<Partial<Cliente & { id?: string }>>({
    nome: '',
    telefone: '',
    servidor: 'P2X',
    plano_mensal: 0,
    plano_trimestral: 0,
    data_vencimento: '',
    conta_criada: new Date().toISOString().split('T')[0],
    observacao: ''
  });

  React.useEffect(() => {
    if (cliente) {
      setFormData(cliente);
    } else {
      setFormData({
        nome: '',
        telefone: '',
        servidor: 'P2X',
        plano_mensal: 0,
        plano_trimestral: 0,
        data_vencimento: '',
        conta_criada: new Date().toISOString().split('T')[0],
        observacao: ''
      });
    }
  }, [cliente]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.telefone || !formData.data_vencimento) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, telefone e data de vencimento",
        variant: "destructive",
      });
      return;
    }

    onSave({
      id: cliente?.id,
      id_client: formData.id_client || '',
      nome: formData.nome!,
      telefone: formData.telefone!,
      servidor: formData.servidor!,
      plano_mensal: formData.plano_mensal!,
      plano_trimestral: formData.plano_trimestral!,
      data_vencimento: formData.data_vencimento!,
      status: formData.status || 'Ativo',
      conta_criada: formData.conta_criada!,
      observacao: formData.observacao
    });
  };

  return (
    <DialogContent className="bg-tek-secondary border-gray-600 max-w-md">
      <DialogHeader>
        <DialogTitle className="text-white">
          {cliente ? 'Editar Cliente' : 'Novo Cliente'}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nome" className="text-tek-cyan">Nome *</Label>
          <Input
            id="nome"
            value={formData.nome || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
            className="input-dark"
            required
          />
        </div>

        <div>
          <Label htmlFor="telefone" className="text-tek-cyan">Telefone *</Label>
          <Input
            id="telefone"
            value={formData.telefone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
            className="input-dark"
            placeholder="5521999999999"
            required
          />
        </div>

        <div>
          <Label htmlFor="servidor" className="text-tek-cyan">Servidor</Label>
          <Select 
            value={formData.servidor} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, servidor: value }))}
          >
            <SelectTrigger className="input-dark">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-tek-secondary border-gray-600">
              <SelectItem value="P2X">P2X (R$ 6,00)</SelectItem>
              <SelectItem value="P2_SERVER">P2_SERVER (R$ 10,00)</SelectItem>
              <SelectItem value="CPLAYER">CPLAYER (R$ 8,00)</SelectItem>
              <SelectItem value="RTV">RTV (R$ 8,00)</SelectItem>
              <SelectItem value="RTV-VODs">RTV-VODs (R$ 0,00)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="plano_mensal" className="text-tek-cyan">Plano Mensal</Label>
            <Input
              id="plano_mensal"
              type="number"
              step="0.01"
              value={formData.plano_mensal || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, plano_mensal: parseFloat(e.target.value) || 0 }))}
              className="input-dark"
            />
          </div>

          <div>
            <Label htmlFor="plano_trimestral" className="text-tek-cyan">Plano Trimestral</Label>
            <Input
              id="plano_trimestral"
              type="number"
              step="0.01"
              value={formData.plano_trimestral || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, plano_trimestral: parseFloat(e.target.value) || 0 }))}
              className="input-dark"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="data_vencimento" className="text-tek-cyan">Data de Vencimento *</Label>
          <Input
            id="data_vencimento"
            type="date"
            value={formData.data_vencimento || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, data_vencimento: e.target.value }))}
            className="input-dark"
            required
          />
        </div>

        <div>
          <Label htmlFor="observacao" className="text-tek-cyan">Observação</Label>
          <Input
            id="observacao"
            value={formData.observacao || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, observacao: e.target.value }))}
            className="input-dark"
            placeholder="Observações sobre o cliente..."
          />
        </div>

        <div className="flex space-x-4 pt-4">
          <Button type="submit" className="btn-primary flex-1">
            {cliente ? 'Atualizar' : 'Criar'} Cliente
          </Button>
          <Button type="button" onClick={onCancel} className="btn-danger flex-1">
            Cancelar
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default Clientes;
