import React from 'react';
import { Link } from 'wouter';
import { Cake, Heart, Users, Target, MapPin } from 'lucide-react';

export default function Sobre() {
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Nossa História</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra a paixão e dedicação por trás de cada cupcake que sai da nossa cozinha
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Quem Somos</h2>
                <p className="text-gray-700 text-lg mb-4">
                  A Polly's Cupcakes nasceu do sonho de transformar momentos comuns em experiências extraordinárias através da confeitaria.
                </p>
                <p className="text-gray-700 text-lg mb-4">
                  Fundada em 2020 pela Chef Polly, nossa confeitaria rapidamente se tornou referência em cupcakes artesanais, 
                  combinando técnicas tradicionais com toques modernos e criativos.
                </p>
                <p className="text-gray-700 text-lg">
                  Cada receita é desenvolvida com carinho, usando apenas ingredientes de alta qualidade e muito amor.
                </p>
              </div>
              <div className="bg-pink-100 rounded-2xl p-8 text-center">
                <Users className="w-16 h-16 text-pink-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Nossa Equipe</h3>
                <p className="text-gray-700">
                  Contamos com uma equipe apaixonada por confeitaria, sempre em busca da perfeição em cada detalhe.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <Heart className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Missão</h3>
                <p className="text-gray-700">
                  Encantar nossos clientes com produtos de qualidade superior, criando memórias doces e inesquecíveis.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <Target className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visão</h3>
                <p className="text-gray-700">
                  Ser a confeitaria mais amada e recomendada, expandindo nossa doçura para todo o país.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <MapPin className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Valores</h3>
                <p className="text-gray-700">
                  Qualidade, paixão, inovação e compromisso com a satisfação total dos nossos clientes.
                </p>
              </div>
            </div>

            <div className="bg-pink-50 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Junte-se à Nossa Família</h2>
              <p className="text-gray-700 text-lg mb-6">
                Faça parte dessa história deliciosa! Experimente nossos cupcakes e descubra por que somos tão especiais.
              </p>
              <Link 
                href="/menu" 
                className="bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition-colors font-semibold text-lg inline-block"
              >
                Ver Cardápio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}