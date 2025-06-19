
import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Dados mock para demonstração
const clientesData = [
  { id: 'CLI-100002', nome: 'Marcelino Gomes', telefone: '5521982271401', servidor: 'P2_SERVER', plano_mensal: 35, plano_trimestral: 90, data_vencimento: '2025-05-10', status: 'Vencido', conta_criada: '2023-03-18' },
  { id: 'CLI-100003', nome: 'Angelo Lisboa', telefone: '5521993451684', servidor: 'P2X', plano_mensal: 30, plano_trimestral: 75, data_vencimento: '2025-05-28', status: 'Vencido', conta_criada: '2021-01-04' },
  { id: 'CLI-100004', nome: 'Maria Silva', telefone: '5521987654321', servidor: 'CPLAYER', plano_mensal: 25, plano_trimestral: 60, data_vencimento: '2025-06-25', status: 'Ativo', conta_criada: '2022-01-15' },
  { id: 'CLI-100005', nome: 'João Santos', telefone: '5521876543210', servidor: 'RTV', plano_mensal: 40, plano_trimestral: 100, data_vencimento: '2025-07-01', status: 'Ativo', conta_criada: '2023-06-10' },
];

const servidorCustos = {
  'P2X': 6.00,
  'P2_SERVER': 10.00,
  'CPLAYER': 8.00,
  'RTV': 8.00,
  'RTV-VODs': 0.00
};

const Dashboard = () => {
  // Cálculos das estatísticas
  const totalClientes = clientesData.length;
  const clientesAtivos = clientesData.filter(c => c.status === 'Ativo').length;
  const clientesVencidos = clientesData.filter(c => c.status === 'Vencido').length;
  
  // Cálculo da receita
  const receitaMensal = clientesData.reduce((total, cliente) => {
    return total + (cliente.status === 'Ativo' ? cliente.plano_mensal : 0);
  }, 0);

  const custoServidor = clientesData.reduce((total, cliente) => {
    return total + (servidorCustos[cliente.servidor as keyof typeof servidorCustos] || 0);
  }, 0);

  const lucroEstimado = receitaMensal - custoServidor;

  // Dados para gráficos
  const statusData = [
    { name: 'Ativos', value: clientesAtivos, color: '#1BC000' },
    { name: 'Vencidos', value: clientesVencidos, color: '#FF4444' }
  ];

  const servidorData = Object.entries(
    clientesData.reduce((acc, cliente) => {
      acc[cliente.servidor] = (acc[cliente.servidor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([servidor, count]) => ({ servidor, count }));

  const receitaData = [
    { mes: 'Jan', receita: 1200, custos: 240 },
    { mes: 'Fev', receita: 1400, custos: 280 },
    { mes: 'Mar', receita: 1100, custos: 220 },
    { mes: 'Abr', receita: 1600, custos: 320 },
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
        </div>

        {/* Gráfico de Barras - Servidores */}
        <div className="card-dark">
          <h3 className="text-lg font-semibold text-white mb-4">Clientes por Servidor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={servidorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="servidor" stroke="#FFFFFF" />
              <YAxis stroke="#FFFFFF" />
              <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2A2A' }} />
              <Bar dataKey="count" fill="#5DF0FF" />
            </BarChart>
          </ResponsiveContainer>
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
            <span>Clientes Vencidos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
