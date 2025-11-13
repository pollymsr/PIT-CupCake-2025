import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "./context/CartContext";

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
);

const Card = ({ children, className, ...props }: any) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

// Mock do trpc
const trpc = {
  cupcakes: {
    list: {
      useQuery: () => ({ 
        data: [
          {
            _id: '1',
            name: 'Cupcake de Baunilha',
            description: 'Macio e leve',
            price: 9.9,
            imageUrl: '/images/vanilla.jpg',
            available: true
          },
          {
            _id: '2', 
            name: 'Cupcake de Chocolate',
            description: 'Intenso e cremoso',
            price: 11.5,
            imageUrl: '/images/chocolate.jpg',
            available: true
          },
          {
            _id: '3',
            name: 'Cupcake Red Velvet',
            description: 'Clássico red velvet',
            price: 12.0,
            imageUrl: '/images/redvelvet.jpg',
            available: true
          },
          {
            _id: '4',
            name: 'Cupcake de Morango',
            description: 'Fresco e frutado',
            price: 10.5,
            imageUrl: '/images/strawberry.jpg',
            available: true
          },
          {
            _id: '5',
            name: 'Cupcake de Limão',
            description: 'Refrescante e cítrico',
            price: 9.5,
            imageUrl: '/images/lemon.jpg',
            available: true
          },
          {
            _id: '6',
            name: 'Cupcake de Café',
            description: 'Energético e aromático',
            price: 11.0,
            imageUrl: '/images/coffee.jpg',
            available: true
          }
        ], 
        isLoading: false 
      })
    }
  }
};

export default function Menu() {
  const { data: cupcakes, isLoading } = (trpc as any).cupcakes.list.useQuery();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddToCart = (cupcake: any) => {
    const cartItem = {
      id: cupcake._id,
      name: cupcake.name,
      price: cupcake.price,
      image: cupcake.imageUrl,
      quantity: 1
    };
    
    addToCart(cartItem);
    
    setAddedItems(prev => new Set(Array.from(prev).concat(cupcake._id)));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(cupcake._id);
        return newSet;
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Cardápio</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost">Perfil</Button>
            </Link>
            <Link href="/checkout">
              <Button className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Carrinho
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Menu Grid */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Nossos Cupcakes</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cupcakes?.map((cupcake: any) => (
              <Card key={cupcake._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-pink-200 to-purple-200 h-48 flex items-center justify-center text-4xl">
                  🧁
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{cupcake.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{cupcake.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">
                      R$ {cupcake.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(cupcake)}
                      className={`${
                        addedItems.has(cupcake._id)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}