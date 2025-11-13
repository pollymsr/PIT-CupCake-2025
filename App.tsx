// App.tsx - VERSÃO COMPLETA CORRIGIDA
import React from 'react';
import { Router, Route } from 'wouter';
import { TestAuthProvider } from './context/TestAuthContext';
import { CartProvider } from './context/CartContext';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Menu from './Menu';
import Checkout from './Checkout';
import Contato from './Contato';
import Profile from './Profile'; // ← ADICIONE ESTA LINHA
import Sobre from './Sobre';    // ← ADICIONE ESTA LINHA

function App() {
  return (
    <TestAuthProvider>
      <CartProvider>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/menu" component={Menu} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/contato" component={Contato} />
          <Route path="/perfil" component={Profile} />   {/* ← ADICIONE ESTA LINHA */}
          <Route path="/sobre" component={Sobre} />      {/* ← ADICIONE ESTA LINHA */}
        </Router>
      </CartProvider>
    </TestAuthProvider>
  );
}

export default App;