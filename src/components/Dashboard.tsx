import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useClientes } from '@/hooks/useClientes';
import RelatorioLogs from '@/components/RelatorioLogs';

const servidorCustos = {
  'P2X': 6.00,
  'P2_SERVER': 10.00,
  'CPLAYER': 8.00,
  'RTV': 8.00,
  'RTV-VODs': 0.00
};

const Dashboard = () => {
  const { clientes, loading, calcularStatus } = useClientes();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando dados...</div>
      </div>
    );
  }

  // Cálculos das estatísticas baseadas nos dados reais
  const totalClientes = clientes.length;
  const clientesAtivos = clientes.filter(c => calcularStatus(c.data_vencimento) === 'Ativo').length;
  const clientesVencidos = clientes.filter(c => calcularStatus(c.data_vencimento) === 'Vencido').length;
  
  // Cálculo da receita
  const receitaMensal = clientes.reduce((total, cliente) => {
    return total + (calcularStatus(cliente.data_vencimento) === 'Ativo' ? cliente.plano_mensal : 0);
  }, 0);

  const custoServidor = clientes.reduce((total, cliente) => {
    return total + (servidorCustos[cliente.servidor as keyof typeof servidorCustos] || 0);
  }, 0);

  const lucroEstimado = receitaMensal - custoServidor;

  // Dados para gráficos
  const statusData = [
    { name: 'Ativos', value: clientesAtivos, color: '#1BC000' },
    { name: 'Vencidos', value: clientesVencidos, color: '#FF4444' }
  ];

  const servidorData = Object.entries(
    clientes.reduce((acc, cliente) => {
      acc[cliente.servidor] = (acc[cliente.servidor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([servidor, count]) => ({ servidor, count }));

  // Dados de receita simulados para demonstração (últimos 5 meses)
  const receitaData = [
    { mes: 'Jan', receita: receitaMensal * 0.8, custos: custoServidor * 0.8 },
    { mes: 'Fev', receita: receitaMensal * 0.9, custos: custoServidor * 0.9 },
    { mes: 'Mar', receita: receitaMensal * 0.85, custos: custoServidor * 0.85 },
    { mes: 'Abr', receita: receitaMensal * 1.1, custos: custoServidor * 1.1 },
    { mes: 'Mai', receita: receitaMensal, custos: custoServidor },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-dark hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Clientes</p>
              <p className="text-3xl font-bold text-white">{totalClientes}</p>
            </div>
            <div className="w-12 h-12 bg-tek-cyan/20 rounded-lg flex items-center justify-center">
              <Users className="text-tek-cyan" size={24} />
            </div>
          </div>
        </div>

        <div className="card-dark hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Clientes Ativos</p>
              <p className="text-3xl font-bold text-tek-green">{clientesAtivos}</p>
            </div>
            <div className="w-12 h-12 bg-tek-green/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-tek-green" size={24} />
            </div>
          </div>
        </div>

        <div className="card-dark hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Clientes Vencidos</p>
              <p className="text-3xl font-bold text-tek-red">{clientesVencidos}</p>
            </div>
            <div className="w-12 h-12 bg-tek-red/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-tek-red" size={24} />
            </div>
          </div>
        </div>

        <div className="card-dark hover:scale-105 transition-transform">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Receita Mensal</p>
              <p className="text-3xl font-bold text-tek-cyan">R$ {receitaMensal.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-tek-blue/20 rounded-lg flex items-center justify-center">
              <DollarSign className="text-tek-blue" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Status dos Clientes */}
        <div className="card-dark">
          <h3 className="text-lg font-semibold text-white mb-4">Status dos Clientes</h3>
          {statusData.some(item => item.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Nenhum cliente cadastrado
            </div>
          )}
        </div>

        {/* Gráfico de Barras - Servidores */}
        <div className="card-dark">
          <h3 className="text-lg font-semibold text-white mb-4">Clientes por Servidor</h3>
          {servidorData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={servidorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="servidor" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2A2A' }} />
                <Bar dataKey="count" fill="#5DF0FF" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              Nenhum cliente cadastrado
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de Linha - Receita vs Custos */}
      <div className="card-dark">
        <h3 className="text-lg font-semibold text-white mb-4">Receita vs Custos (Últimos 5 meses)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={receitaData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="mes" stroke="#FFFFFF" />
            <YAxis stroke="#FFFFFF" />
            <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2A2A' }} />
            <Line type="monotone" dataKey="receita" stroke="#1BC000" strokeWidth={3} name="Receita" />
            <Line type="monotone" dataKey="custos" stroke="#FF4444" strokeWidth={3} name="Custos" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-dark text-center">
          <h4 className="text-tek-cyan font-semibold mb-2">Receita Mensal</h4>
          <p className="text-2xl font-bold text-tek-green">R$ {receitaMensal.toFixed(2)}</p>
        </div>
        
        <div className="card-dark text-center">
          <h4 className="text-tek-cyan font-semibold mb-2">Custos dos Servidores</h4>
          <p className="text-2xl font-bold text-tek-red">R$ {custoServidor.toFixed(2)}</p>
        </div>
        
        <div className="card-dark text-center">
          <h4 className="text-tek-cyan font-semibold mb-2">Lucro Estimado</h4>
          <p className={`text-2xl font-bold ${lucroEstimado >= 0 ? 'text-tek-green' : 'text-tek-red'}`}>
            R$ {lucroEstimado.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Atalhos Rápidos */}
      <div className="card-dark">
        <h3 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Users size={20} />
            <span>Novo Cliente</span>
          </button>
          
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <Calendar size={20} />
            <span>Ver Vencimentos</span>
          </button>
          
          <button className="btn-danger flex items-center justify-center space-x-2">
            <AlertTriangle size={20} />
            <span>Clientes Vencidos ({clientesVencidos})</span>
          </button>
        </div>
      </div>

      {/* Relatório de Logs */}
      <RelatorioLogs />
    </div>
  );
};

export default Dashboard;
