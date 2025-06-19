
import React, { useState } from 'react';
import { Calendar, Home, Settings, Users, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout = ({ children, currentPage, onPageChange }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-tek-dark flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-tek-sidebar transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-tek-cyan rounded-lg flex items-center justify-center">
              <span className="text-tek-dark font-bold text-sm">T</span>
            </div>
            <div>
              <h2 className="text-tek-cyan font-bold text-lg">TEKINFORMÁTICA</h2>
              <p className="text-gray-400 text-xs">CEO: Ricardo Moraes</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={cn(
                  "sidebar-item w-full",
                  currentPage === item.id && "active"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="card-dark p-4">
            <p className="text-sm text-gray-400 mb-2">Sistema Ativo</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-tek-green rounded-full animate-pulse"></div>
              <span className="text-xs text-tek-cyan">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        {/* Header */}
        <header className="bg-tek-secondary border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-white capitalize">
                {currentPage === 'dashboard' ? 'Dashboard' : 
                 currentPage === 'clientes' ? 'Gestão de Clientes' : 'Configurações'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white">Ricardo Moraes</p>
                <p className="text-xs text-gray-400">CEO</p>
              </div>
              <div className="w-10 h-10 bg-tek-cyan rounded-full flex items-center justify-center">
                <span className="text-tek-dark font-bold">R</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
