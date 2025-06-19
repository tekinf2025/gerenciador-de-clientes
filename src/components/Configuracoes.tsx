import React, { useState } from 'react';
import { User, Bell, Shield, DollarSign, MessageCircle, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

const Configuracoes = () => {
  const [perfilData, setPerfilData] = useState({
    nome: 'Ricardo Moraes',
    email: 'ricardo@tekinformatica.com',
    telefone: '5521999999999',
    empresa: 'TEKINFORMÁTICA',
    cargo: 'CEO'
  });

  const [custosServidor, setCustosServidor] = useState({
    P2X: 6.00,
    P2_SERVER: 10.00,
    CPLAYER: 8.00,
    RTV: 8.00,
    'RTV-VODs': 0.00
  });

  const [notificacoes, setNotificacoes] = useState({
    emailVencimento: true,
    whatsappLembrete: true,
    alertaCliente: true,
    relatorioSemanal: false
  });

  const [whatsappConfig, setWhatsappConfig] = useState({
    mensagemPadrao: `Bom dia. Olá! Oi, tudo bem?
Seu aplicativo está vencendo
Vamos renovar o seu plano!

Vencimento: {dias_vencimento}
Plano mensal: {plano_mensal}
Plano trimestral: {plano_trimestral}

NU PAGAMENTOS
TEKINFORMÁTICA
CHAVE PIX EMAIL`,
    assinaturaAutomatica: false,
    assinatura: ''
  });

  const [seguranca, setSeguranca] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: '',
    autenticacao2FA: false
  });

  const handleSalvarPerfil = () => {
    if (!perfilData.nome || !perfilData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Simular salvamento
    console.log('Salvando perfil:', perfilData);
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso",
    });
  };

  const handleSalvarCustos = () => {
    // Validar se todos os valores são números positivos
    const custosValidos = Object.values(custosServidor).every(valor => 
      typeof valor === 'number' && valor >= 0
    );

    if (!custosValidos) {
      toast({
        title: "Erro",
        description: "Todos os custos devem ser números válidos",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando custos:', custosServidor);
    
    toast({
      title: "Custos atualizados",
      description: "Os custos dos servidores foram salvos",
    });
  };

  const handleSalvarNotificacoes = () => {
    console.log('Salvando notificações:', notificacoes);
    
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas",
    });
  };

  const handleSalvarWhatsApp = () => {
    if (!whatsappConfig.mensagemPadrao.trim()) {
      toast({
        title: "Erro",
        description: "A mensagem padrão não pode estar vazia",
        variant: "destructive",
      });
      return;
    }

    // Simular salvamento
    console.log('Salvando WhatsApp config:', whatsappConfig);
    
    toast({
      title: "Configuração do WhatsApp atualizada",
      description: "Sua mensagem padrão foi salva com sucesso",
    });
  };

  const handleSalvarSeguranca = () => {
    if (seguranca.novaSenha && seguranca.novaSenha !== seguranca.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (seguranca.novaSenha && seguranca.novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    console.log('Salvando segurança:', { 
      autenticacao2FA: seguranca.autenticacao2FA,
      senhaAlterada: !!seguranca.novaSenha 
    });
    
    toast({
      title: "Segurança atualizada",
      description: "Suas configurações de segurança foram salvas",
    });

    // Limpar campos de senha
    setSeguranca(prev => ({
      ...prev,
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    }));
  };

  const variaveisDisponiveis = [
    '{nome}', '{servidor}', '{plano_mensal}', '{plano_trimestral}', 
    '{data_vencimento}', '{status_vencimento}', '{dias_vencimento}'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card-dark">
        <h2 className="text-2xl font-bold text-white mb-6">Configurações do Sistema</h2>
        
        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-tek-sidebar">
            <TabsTrigger value="perfil" className="data-[state=active]:bg-tek-secondary data-[state=active]:text-tek-cyan">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="custos" className="data-[state=active]:bg-tek-secondary data-[state=active]:text-tek-cyan">
              <DollarSign className="w-4 h-4 mr-2" />
              Custos
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="data-[state=active]:bg-tek-secondary data-[state=active]:text-tek-cyan">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="data-[state=active]:bg-tek-secondary data-[state=active]:text-tek-cyan">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="seguranca" className="data-[state=active]:bg-tek-secondary data-[state=active]:text-tek-cyan">
              <Shield className="w-4 h-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>

          {/* Aba Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <Card className="bg-tek-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-tek-cyan">Informações Pessoais</CardTitle>
                <CardDescription className="text-gray-400">
                  Atualize suas informações de perfil e da empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome" className="text-white">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={perfilData.nome}
                      onChange={(e) => setPerfilData(prev => ({ ...prev, nome: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargo" className="text-white">Cargo</Label>
                    <Input
                      id="cargo"
                      value={perfilData.cargo}
                      onChange={(e) => setPerfilData(prev => ({ ...prev, cargo: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={perfilData.email}
                      onChange={(e) => setPerfilData(prev => ({ ...prev, email: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone" className="text-white">Telefone</Label>
                    <Input
                      id="telefone"
                      value={perfilData.telefone}
                      onChange={(e) => setPerfilData(prev => ({ ...prev, telefone: e.target.value }))}
                      className="input-dark"
                      placeholder="5521999999999"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="empresa" className="text-white">Empresa</Label>
                  <Input
                    id="empresa"
                    value={perfilData.empresa}
                    onChange={(e) => setPerfilData(prev => ({ ...prev, empresa: e.target.value }))}
                    className="input-dark"
                  />
                </div>

                <Button onClick={handleSalvarPerfil} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Custos */}
          <TabsContent value="custos" className="space-y-6">
            <Card className="bg-tek-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-tek-cyan">Custos dos Servidores</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure os custos de cada tipo de servidor para cálculos de lucro
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(custosServidor).map(([servidor, custo]) => (
                    <div key={servidor}>
                      <Label htmlFor={servidor} className="text-white">{servidor}</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                        <Input
                          id={servidor}
                          type="number"
                          step="0.01"
                          min="0"
                          value={custo}
                          onChange={(e) => setCustosServidor(prev => ({ 
                            ...prev, 
                            [servidor]: parseFloat(e.target.value) || 0 
                          }))}
                          className="input-dark pl-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-tek-sidebar p-4 rounded-lg">
                  <h4 className="text-tek-cyan font-semibold mb-2">Resumo dos Custos</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    {Object.entries(custosServidor).map(([servidor, custo]) => (
                      <div key={servidor} className="text-center">
                        <p className="text-gray-400">{servidor}</p>
                        <p className="text-white font-semibold">R$ {custo.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleSalvarCustos} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Custos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba WhatsApp */}
          <TabsContent value="whatsapp" className="space-y-6">
            <Card className="bg-tek-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-tek-cyan">Configuração do WhatsApp</CardTitle>
                <CardDescription className="text-gray-400">
                  Personalize as mensagens automáticas enviadas aos clientes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mensagem" className="text-white">Mensagem Padrão</Label>
                  <Textarea
                    id="mensagem"
                    value={whatsappConfig.mensagemPadrao}
                    onChange={(e) => setWhatsappConfig(prev => ({ ...prev, mensagemPadrao: e.target.value }))}
                    className="input-dark min-h-[200px]"
                    placeholder="Digite sua mensagem padrão..."
                  />
                </div>

                <div className="bg-tek-sidebar p-4 rounded-lg">
                  <h4 className="text-tek-cyan font-semibold mb-2">Variáveis Disponíveis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {variaveisDisponiveis.map(variavel => (
                      <code 
                        key={variavel}
                        className="bg-tek-dark text-tek-cyan p-1 rounded cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          setWhatsappConfig(prev => ({
                            ...prev,
                            mensagemPadrao: prev.mensagemPadrao + ' ' + variavel
                          }));
                        }}
                        title="Clique para adicionar à mensagem"
                      >
                        {variavel}
                      </code>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Clique nas variáveis para adicioná-las à mensagem
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="assinatura"
                    checked={whatsappConfig.assinaturaAutomatica}
                    onCheckedChange={(checked) => setWhatsappConfig(prev => ({ ...prev, assinaturaAutomatica: checked }))}
                  />
                  <Label htmlFor="assinatura" className="text-white">Adicionar assinatura automaticamente</Label>
                </div>

                {whatsappConfig.assinaturaAutomatica && (
                  <div>
                    <Label htmlFor="assinatura-texto" className="text-white">Assinatura</Label>
                    <Textarea
                      id="assinatura-texto"
                      value={whatsappConfig.assinatura}
                      onChange={(e) => setWhatsappConfig(prev => ({ ...prev, assinatura: e.target.value }))}
                      className="input-dark"
                      placeholder="Sua assinatura..."
                    />
                  </div>
                )}

                <div className="bg-tek-dark p-4 rounded-lg">
                  <h4 className="text-tek-cyan font-semibold mb-2">Preview da Mensagem</h4>
                  <div className="bg-tek-sidebar p-3 rounded text-sm text-gray-300 whitespace-pre-wrap">
                    {whatsappConfig.mensagemPadrao}
                    {whatsappConfig.assinaturaAutomatica && whatsappConfig.assinatura && `\n${whatsappConfig.assinatura}`}
                  </div>
                </div>

                <Button onClick={handleSalvarWhatsApp} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configuração
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Notificações */}
          <TabsContent value="notificacoes" className="space-y-6">
            <Card className="bg-tek-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-tek-cyan">Preferências de Notificação</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure como você deseja receber notificações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-tek-sidebar rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white">Email de Vencimento</h4>
                      <p className="text-sm text-gray-400">Receber emails quando clientes estiverem próximos do vencimento</p>
                    </div>
                    <Switch
                      checked={notificacoes.emailVencimento}
                      onCheckedChange={(checked) => setNotificacoes(prev => ({ ...prev, emailVencimento: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-tek-sidebar rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white">Lembrete WhatsApp</h4>
                      <p className="text-sm text-gray-400">Sugestões automáticas para enviar lembretes via WhatsApp</p>
                    </div>
                    <Switch
                      checked={notificacoes.whatsappLembrete}
                      onCheckedChange={(checked) => setNotificacoes(prev => ({ ...prev, whatsappLembrete: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-tek-sidebar rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white">Alerta de Novos Clientes</h4>
                      <p className="text-sm text-gray-400">Notificação quando novos clientes são adicionados</p>
                    </div>
                    <Switch
                      checked={notificacoes.alertaCliente}
                      onCheckedChange={(checked) => setNotificacoes(prev => ({ ...prev, alertaCliente: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-tek-sidebar rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white">Relatório Semanal</h4>
                      <p className="text-sm text-gray-400">Receber relatório semanal com estatísticas</p>
                    </div>
                    <Switch
                      checked={notificacoes.relatorioSemanal}
                      onCheckedChange={(checked) => setNotificacoes(prev => ({ ...prev, relatorioSemanal: checked }))}
                    />
                  </div>
                </div>

                <Button onClick={handleSalvarNotificacoes} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Segurança */}
          <TabsContent value="seguranca" className="space-y-6">
            <Card className="bg-tek-secondary border-gray-700">
              <CardHeader>
                <CardTitle className="text-tek-cyan">Segurança da Conta</CardTitle>
                <CardDescription className="text-gray-400">
                  Mantenha sua conta protegida com configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="senha-atual" className="text-white">Senha Atual</Label>
                    <Input
                      id="senha-atual"
                      type="password"
                      value={seguranca.senhaAtual}
                      onChange={(e) => setSeguranca(prev => ({ ...prev, senhaAtual: e.target.value }))}
                      className="input-dark"
                      placeholder="Digite sua senha atual"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nova-senha" className="text-white">Nova Senha</Label>
                      <Input
                        id="nova-senha"
                        type="password"
                        value={seguranca.novaSenha}
                        onChange={(e) => setSeguranca(prev => ({ ...prev, novaSenha: e.target.value }))}
                        className="input-dark"
                        placeholder="Digite a nova senha"
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmar-senha" className="text-white">Confirmar Nova Senha</Label>
                      <Input
                        id="confirmar-senha"
                        type="password"
                        value={seguranca.confirmarSenha}
                        onChange={(e) => setSeguranca(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                        className="input-dark"
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-tek-sidebar rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Autenticação de Dois Fatores (2FA)</h4>
                    <p className="text-sm text-gray-400">Adicione uma camada extra de segurança à sua conta</p>
                  </div>
                  <Switch
                    checked={seguranca.autenticacao2FA}
                    onCheckedChange={(checked) => setSeguranca(prev => ({ ...prev, autenticacao2FA: checked }))}
                  />
                </div>

                <div className="bg-yellow-900/20 border border-yellow-700 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Dicas de Segurança</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Use uma senha forte com pelo menos 8 caracteres</li>
                    <li>• Combine letras maiúsculas, minúsculas, números e símbolos</li>
                    <li>• Nunca compartilhe suas credenciais com terceiros</li>
                    <li>• Ative a autenticação de dois fatores para maior segurança</li>
                  </ul>
                </div>

                <Button onClick={handleSalvarSeguranca} className="btn-primary">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Configuracoes;
