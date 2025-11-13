import React from 'react'
import { Link } from 'wouter'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from './hooks/useAuth'

// Componentes locais
const Button = ({ children, variant, size, className, ...props }: any) => (
  <button 
    className={`
      inline-flex items-center justify-center rounded-md font-medium transition-colors
      ${variant === 'ghost' ? 'bg-transparent hover:bg-gray-100' : 'bg-pink-500 text-white hover:bg-pink-600'}
      ${size === 'icon' ? 'p-2' : 'px-4 py-2'}
      ${size === 'sm' ? 'text-sm' : 'text-base'}
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
)

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Informações do Usuário</h2>
          {user ? (
            <div className="space-y-3">
              <p><strong>Nome:</strong> {user.name || 'Não informado'}</p>
              <p><strong>Email:</strong> {user.email || 'Não informado'}</p>
              <p><strong>ID:</strong> {user._id}</p>
            </div>
          ) : (
            <p>Usuário não logado</p>
          )}
        </div>
      </main>
    </div>
  )
}