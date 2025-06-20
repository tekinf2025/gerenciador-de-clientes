
import React from 'react';
import { FileText, Calendar, Server, User } from 'lucide-react';
import { useLogsRecarga } from '@/hooks/useLogsRecarga';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const RelatorioLogs = () => {
  const { logs, loading } = useLogsRecarga();

  if (loading) {
    return (
      <div className="card-dark">
        <div className="flex items-center space-x-2 mb-4">
          <FileText className="text-tek-cyan" size={24} />
          <h3 className="text-lg font-semibold text-white">Relatório de Logs de Recarga</h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Carregando logs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dark">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="text-tek-cyan" size={24} />
        <h3 className="text-lg font-semibold text-white">Relatório de Logs de Recarga</h3>
        <span className="bg-tek-cyan/20 text-tek-cyan px-2 py-1 rounded-full text-sm">
          {logs.length} registros
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-400">
          <div className="text-center">
            <FileText size={48} className="mx-auto mb-2 opacity-50" />
            <p>Nenhum log de recarga encontrado</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-tek-dark-light hover:bg-tek-dark-light/50">
                <TableHead className="text-gray-300">
                  <div className="flex items-center space-x-1">
                    <User size={16} />
                    <span>Cliente</span>
                  </div>
                </TableHead>
                <TableHead className="text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Server size={16} />
                    <span>Servidor</span>
                  </div>
                </TableHead>
                <TableHead className="text-gray-300">Data Antes</TableHead>
                <TableHead className="text-gray-300">Data Depois</TableHead>
                <TableHead className="text-gray-300">Meses Adicionados</TableHead>
                <TableHead className="text-gray-300">
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Data da Recarga</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow 
                  key={log.id} 
                  className="border-tek-dark-light hover:bg-tek-dark-light/30 transition-colors"
                >
                  <TableCell className="text-white font-medium">
                    {log.nome_cliente}
                  </TableCell>
                  <TableCell>
                    <span className="bg-tek-blue/20 text-tek-blue px-2 py-1 rounded text-sm">
                      {log.servidor}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(log.data_vencimento_antes + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(log.data_vencimento_depois + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <span className="bg-tek-green/20 text-tek-green px-2 py-1 rounded text-sm font-semibold">
                      +{log.meses_adicionados} {log.meses_adicionados === 1 ? 'mês' : 'meses'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(log.created_at).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(log.created_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default RelatorioLogs;
