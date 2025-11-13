// App.tsx - HOME COMO PRIMEIRA TELA
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

function App() {
  return (
    <TestAuthProvider>
      <CartProvider>
        <Router>
          <Route path="/" component={Home} /> {/* ← HOME COMO PÁGINA INICIAL */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/menu" component={Menu} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/contato" component={Contato} />
        </Router>
      </CartProvider>
    </TestAuthProvider>
  );
}

export default App;