// Profile.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Cake, User, Mail, Package, Calendar, LogOut } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar dados do usuário do localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/'; // ← USE window.location.href (mais simples)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Cake className="w-12 h-12 text-pink-600 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="sticky top-0 z-50 bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Cake className="w-8 h-8 text-pink-600" />
              <h1 className="text-2xl font-extrabold text-gray-800">Polly's Cupcakes</h1>
            </Link>
          </div>
        </header>
        
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Usuário não encontrado</h2>
            <p className="text-gray-600 mb-6">Faça login para acessar seu perfil.</p>
            <Link href="/login" className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors">
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Cake className="w-8 h-8 text-pink-600" />
            <h1 className="text-2xl font-extrabold text-gray-800">Polly's Cupcakes</h1>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors">
              Home
            </Link>
            <Link href="/menu" className="text-gray-600 hover:text-pink-600 transition-colors">
              Cardápio
            </Link>
          </nav>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header do Perfil */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-pink-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 flex items-center space-x-2 mt-1">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </p>
                <p className="text-gray-500 text-sm mt-2 flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Opções */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pedidos Recentes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Package className="w-6 h-6 text-pink-600" />
                <h2 className="text-xl font-bold text-gray-900">Meus Pedidos</h2>
              </div>
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum pedido realizado ainda</p>
                <Link 
                  href="/menu" 
                  className="inline-block mt-4 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Fazer Primeiro Pedido
                </Link>
              </div>
            </div>

            {/* Informações da Conta */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="w-6 h-6 text-pink-600" />
                <h2 className="text-xl font-bold text-gray-900">Informações da Conta</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg capitalize">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Cupons e Promoções */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Cake className="w-6 h-6 text-pink-600" />
                <h2 className="text-xl font-bold text-gray-900">Cupons Especiais</h2>
              </div>
              <div className="space-y-3">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h3 className="font-semibold text-pink-800">Bem-vindo(a)!</h3>
                  <p className="text-pink-600 text-sm">10% OFF no primeiro pedido</p>
                  <p className="text-pink-500 text-xs mt-1">Cupom: BEMVINDO10</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800">Fidelidade</h3>
                  <p className="text-purple-600 text-sm">A cada 5 pedidos, ganhe 1 cupcake</p>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <span className="w-6 h-6 text-pink-600">⚡</span>
                <h2 className="text-xl font-bold text-gray-900">Ações Rápidas</h2>
              </div>
              <div className="space-y-3">
                <Link 
                  href="/menu" 
                  className="block w-full text-center bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold"
                >
                  Fazer Novo Pedido
                </Link>
                <Link 
                  href="/contato" 
                  className="block w-full text-center border border-pink-600 text-pink-600 py-3 rounded-lg hover:bg-pink-50 transition-colors font-semibold"
                >
                  Alterar Dados
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Conta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Seção de Pedidos em Destaque */}
          <div className="mt-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Experimente Nossos Sabores Exclusivos!</h2>
            <p className="mb-6 opacity-90">Descubra por que somos a confeitaria mais amada da cidade</p>
            <Link 
              href="/menu" 
              className="bg-white text-pink-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-bold text-lg inline-block"
            >
              Explorar Cardápio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}