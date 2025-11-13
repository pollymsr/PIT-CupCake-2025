// Profile.tsx - VERSÃO SIMPLES E FUNCIONAL
import React from 'react';
import { Link } from 'wouter';

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-2xl">🧁</span>
              <h1 className="text-xl font-bold text-gray-800">Polly's Cupcakes</h1>
            </Link>
            <nav className="flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-pink-600">Home</Link>
              <Link href="/menu" className="text-gray-600 hover:text-pink-600">Cardápio</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Conteúdo do Perfil */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Foto e Nome */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👩‍🍳</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Pollyana Manuela</h1>
            <p className="text-gray-600">Proprietária & Confeiteira</p>
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">📧 Contato</h2>
              <div className="space-y-2">
                <p><strong>Email:</strong> pollymsr@outlook.com.br</p>
                <p><strong>Telefone:</strong> (11) 99999-9999</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">🏪 Sobre a Loja</h2>
              <div className="space-y-2">
                <p><strong>Nome:</strong> Polly's Cupcakes</p>
                <p><strong>Especialidade:</strong> Cupcakes Artesanais</p>
                <p><strong>Desde:</strong> 2024</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">⭐ Destaques</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">🎂</div>
                  <p className="font-semibold">+100</p>
                  <p className="text-sm text-gray-600">Cupcakes Vendidos</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl mb-2">⭐</div>
                  <p className="font-semibold">4.9</p>
                  <p className="text-sm text-gray-600">Avaliação</p>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">🚀 Ações Rápidas</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/menu" 
                  className="bg-pink-500 text-white text-center py-3 rounded-lg hover:bg-pink-600 font-semibold"
                >
                  Ver Cardápio
                </Link>
                <Link 
                  href="/contato" 
                  className="border border-pink-500 text-pink-500 text-center py-3 rounded-lg hover:bg-pink-50 font-semibold"
                >
                  Editar Perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}