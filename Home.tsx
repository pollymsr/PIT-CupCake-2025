// Home.tsx
import React from 'react';
import { APP_LOGO, APP_TITLE, getLoginUrl } from "./const"; 
import { ShoppingCart, Star, Truck, Heart, ChevronRight, Cake, LogIn, MessageSquare, Award } from "lucide-react";
import { useTestAuth } from "./context/TestAuthContext";

export default function Home() {
  const { loginAsTestUser } = useTestAuth();

  // --- Dados Aprimorados ---
  const features = [
    {
      icon: <Award className="w-8 h-8 text-pink-600" />,
      title: "Qualidade Premium",
      description: "Ingredientes frescos e selecionados, garantindo o sabor inigualável em cada mordida."
    },
    {
      icon: <Truck className="w-8 h-8 text-purple-600" />,
      title: "Entrega Expressa",
      description: "Seu pedido rastreado e entregue com carinho e rapidez, direto para sua porta."
    },
    {
      icon: <Cake className="w-8 h-8 text-yellow-600" />,
      title: "Receitas Exclusivas",
      description: "Mais de 10 sabores artesanais, criados pela Chef Polly para momentos especiais."
    }
  ];

  const popularFlavors = [
    { name: "Chocolate Belga", price: "R$ 12,90", color: "bg-amber-900", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&h=300&fit=crop&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1" },
    { name: "Morango Fresco", price: "R$ 11,90", color: "bg-pink-500", image: "https://images.unsplash.com/photo-1551026941-874221147774?w=300&h=300&fit=crop&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1" },
    { name: "Baunilha Francesa", price: "R$ 10,90", color: "bg-yellow-100", image: "https://images.unsplash.com/photo-1576618148400-9596041e2475?w=300&h=300&fit=crop&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1" },
    { name: "Red Velvet", price: "R$ 13,90", color: "bg-red-600", image: "https://images.unsplash.com/photo-1588195538326-c2b1e6170f67?w=300&h=300&fit=crop&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1" }
  ];

  const testimonials = [
    { quote: "Os melhores cupcakes que já comi! O Red Velvet é simplesmente divino.", author: "Ana C.", rating: 5 },
    { quote: "Entrega super rápida e vieram perfeitos. Recomendo a todos!", author: "Bruno M.", rating: 5 },
    { quote: "Qualidade impecável e sabores muito criativos. Virei cliente fiel!", author: "Carla S.", rating: 5 },
  ];
  // --- Fim Dados Aprimorados ---

    interface StarRatingProps {
    rating: number;
  }

  const StarRating: React.FC<StarRatingProps> = ({ rating }) => (
    <div className="flex justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Usando um ícone mais elegante como fallback se APP_LOGO não for uma imagem */}
            <Cake className="w-8 h-8 text-pink-600" /> 
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">{APP_TITLE || "Polly's Cupcakes"}</h1>
          </div>
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              Cardápio
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              Sobre Nós
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-600 transition-colors font-medium">
              Contato
            </a>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-pink-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Carrinho (0)</span>
            </button>
            <button 
              onClick={loginAsTestUser}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2 text-sm font-semibold"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Mais Impactante */}
      <section className="relative bg-gradient-to-r from-pink-50 to-purple-100 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Conteúdo de Texto */}
            <div>
              <p className="text-sm font-semibold text-pink-600 uppercase mb-2 tracking-widest">
                Onde a doçura encontra a arte
              </p>
              <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                O Sabor Inesquecível dos <span className="text-pink-600">Cupcakes Artesanais</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Feitos com os melhores ingredientes e paixão em cada detalhe. Peça agora e transforme seu dia!
              </p>
              <div className="flex space-x-4">
                <button className="bg-pink-600 text-white px-8 py-4 rounded-full hover:bg-pink-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 flex items-center space-x-2 font-bold text-lg">
                  <span>Ver Cardápio Completo</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-full hover:bg-pink-600 hover:text-white transition-colors duration-300 font-semibold text-lg">
                  Nossas Histórias
                </button>
              </div>
            </div>
            {/* Imagem Aprimorada */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-pink-200 rounded-full opacity-50 blur-3xl transform scale-150"></div>
              <img 
                src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&h=600&fit=crop&q=80&fm=jpg&crop=entropy&cs=tinysrgb&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1" 
                alt="Cupcakes deliciosos"
                className="rounded-3xl shadow-2xl w-full h-auto object-cover transform rotate-1 scale-105 transition-transform duration-500 hover:rotate-0 hover:scale-100 relative z-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Mais Profissional */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">
            Por que escolher a <span className="text-pink-600">Polly's</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-gray-50 rounded-xl shadow-lg border-t-4 border-pink-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-pink-100 rounded-full inline-block">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Flavors - Mais Comercial e Apetitoso */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">
            Nossos <span className="text-pink-600">Sabores Populares</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularFlavors.map((flavor, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={flavor.image} 
                    alt={`Cupcake de ${flavor.name}`} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-pink-50 transition-colors cursor-pointer">
                    <Heart className="w-5 h-5 text-pink-500" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{flavor.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">Cupcake artesanal</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl text-pink-600 font-extrabold">{flavor.price}</span>
                    <button className="bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors flex items-center space-x-1 text-sm font-semibold shadow-lg">
                      <ShoppingCart className="w-4 h-4" />
                      <span>Comprar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Novo e Comercial */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">
            O que dizem nossos <span className="text-pink-600">Clientes</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 bg-pink-50 rounded-xl shadow-lg border border-pink-100">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-6 h-6 text-pink-600 mr-3" />
                  <StarRating rating={testimonial.rating} />
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <p className="font-semibold text-gray-800">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mais Enfatizado */}
      <section className="bg-pink-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Não Resista à Tentação!
          </h2>
          <p className="text-pink-100 text-xl mb-10 max-w-3xl mx-auto">
            Seja para uma festa, um presente ou um mimo pessoal, a Polly's Cupcakes tem o sabor perfeito para você.
          </p>
          <button className="bg-white text-pink-600 px-10 py-4 rounded-full hover:bg-gray-100 transition-colors font-extrabold text-xl shadow-2xl transform hover:scale-105">
            FAZER MEU PEDIDO AGORA
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Polly's Cupcakes. Todos os direitos reservados. | Feito com <Heart className="w-4 h-4 inline text-red-500" /> e paixão.
          </p>
        </div>
      </footer>
    </div>
  );
}