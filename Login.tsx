// Login.tsx - Versão Client-Side
import React, { useState } from 'react';
import { Link } from 'wouter';
import { Cake, LogIn, Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { useTestAuth } from './context/TestAuthContext';

export default function Login() {
  const { loginAsTestUser } = useTestAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Função client-side para simular autenticação
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (isLogin) {
        // Login simples - em produção isso viria do backend
        const users = JSON.parse(localStorage.getItem('pollyUsers') || '[]');
        const user = users.find((u: any) => u.email === formData.email);
        
        if (user && user.password === formData.password) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          alert('Login realizado com sucesso!');
          window.location.href = '/profile';
        } else {
          alert('Credenciais inválidas!');
        }
      } else {
        // Cadastro
        if (formData.password !== formData.confirmPassword) {
          alert('As senhas não coincidem!');
          setLoading(false);
          return;
        }

        const users = JSON.parse(localStorage.getItem('pollyUsers') || '[]');
        
        if (users.find((u: any) => u.email === formData.email)) {
          alert('Este e-mail já está cadastrado!');
          setLoading(false);
          return;
        }

        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          password: formData.password, // Em produção, isso seria criptografado
          role: 'user',
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('pollyUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        alert('Cadastro realizado com sucesso!');
        window.location.href = '/profile';
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Erro durante a autenticação.');
    } finally {
      setLoading(false);
    }
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
            {isLogin ? (
              <LogIn className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            ) : (
              <UserPlus className="w-12 h-12 text-pink-600 mx-auto mb-4" />
            )}
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Acesse para gerenciar seus pedidos' : 'Junte-se à nossa família de amantes de cupcakes'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Seu nome completo"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder={isLogin ? "Sua senha" : "Crie uma senha segura"}
                  required
                  minLength={6}
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

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Digite a senha novamente"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          <div className="mt-6 space-y-4 text-center">
            <button
              onClick={loginAsTestUser}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Entrar como Usuário Teste
            </button>

            <div className="border-t pt-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-pink-600 hover:text-pink-700 font-semibold"
              >
                {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
              </button>
            </div>

            {isLogin && (
              <p className="text-gray-600 text-sm">
                Esqueceu sua senha?{' '}
                <Link href="/contato" className="text-pink-600 hover:text-pink-700 font-semibold">
                  Entre em contato
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}