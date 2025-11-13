import React, { useState } from 'react';
import { Link } from 'wouter';
import { Cake, LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useTestAuth } from './context/TestAuthContext';

export default function Login() {
  const { loginAsTestUser } = useTestAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica real de login
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Cake className="w-8 h-8 text-pink-600" />
            <h1 className="text-2xl font-extrabold text-gray-800">Polly's Cupcakes</h1>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors">
            Voltar para Home
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <LogIn className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">Entre na sua conta</h2>
            <p className="text-gray-600 mt-2">Acesse para gerenciar seus pedidos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold shadow-lg"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={loginAsTestUser}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold mb-4"
            >
              Entrar como Usuário Teste
            </button>
            <p className="text-gray-600">
              Não tem conta?{' '}
              <Link href="/contato" className="text-pink-600 hover:text-pink-700 font-semibold">
                Entre em contato
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}