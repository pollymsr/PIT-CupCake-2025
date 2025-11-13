// App.tsx - VERSÃO CORRIGIDA
import React from 'react';
import { Router, Route } from 'wouter';
import Home from './Home';
import Login from './Login';
import Register from './api/auth/Register';
import Menu from './Menu';
import Checkout from './Checkout';
import Contato from './Contato';

function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/menu" component={Menu} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/contato" component={Contato} />
    </Router>
  );
}

export default App;