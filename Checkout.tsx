// Checkout.tsx - CORRIGIDO
import React, { useState } from "react"; // ← ADICIONE React AQUI
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useCart } from "./context/CartContext";
import { useAuth } from "./hooks/useAuth";

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
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`} {...props}>
    {children}
  </div>
);

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    zip: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Como o tRPC real precisa de um cliente configurado, vamos criar um mock temporário
  const createOrderMutation = {
    mutateAsync: async (data: any) => {
      console.log('Dados do pedido:', data);
      // Simula uma requisição
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { orderId: Math.random().toString(36).substr(2, 9) };
    },
    isLoading: false
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email válido é obrigatório";
    }
    if (!formData.address.trim()) newErrors.address = "Endereço é obrigatório";
    if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!formData.zip.trim()) newErrors.zip = "CEP é obrigatório";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (cart.length === 0) {
      alert("Adicione itens ao carrinho antes de finalizar o pedido");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createOrderMutation.mutateAsync({
        total: total,
        paymentMethod,
        customerName: formData.name,
        customerEmail: formData.email,
        customerAddress: formData.address,
        customerCity: formData.city,
        customerZip: formData.zip,
        items: cart.map((item: any) => ({
          name: item.name,
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      alert(`Pedido #${result.orderId} criado com sucesso!`);
      clearCart();
      window.location.href = '/orders';
    } catch (error: any) {
      alert(`Erro ao criar pedido: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center">
            <Link href="/menu">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl text-gray-600 mb-6">Seu carrinho está vazio</p>
          <Link href="/menu">
            <Button className="bg-gradient-to-r from-pink-500 to-pink-600">
              Voltar ao Cardápio
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link href="/menu">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Order Summary */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Resumo do Pedido</h2>
          <div className="space-y-3 mb-4">
            {cart.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.quantity}x {item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-pink-600">R$ {total.toFixed(2)}</span>
          </div>
        </Card>

        {/* Delivery Form */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold mb-4">Informações de Entrega</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
                placeholder="Seu nome completo"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
                placeholder="seu@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Endereço *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg ${errors.address ? "border-red-500" : "border-gray-300"}`}
                placeholder="Rua, número, bairro"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cidade *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.city ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Sua cidade"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CEP *</label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${errors.zip ? "border-red-500" : "border-gray-300"}`}
                  placeholder="00000-000"
                />
                {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Método de Pagamento</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit")}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === "credit" 
                      ? "border-pink-500 bg-pink-50 text-pink-700" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  💳 Cartão de Crédito
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === "pix" 
                      ? "border-pink-500 bg-pink-50 text-pink-700" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  📱 PIX
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 text-lg font-bold mt-6"
            >
              {isSubmitting ? "Processando..." : "Finalizar Pedido"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}