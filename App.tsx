import React from 'react'
import { Route, Switch } from 'wouter'
import { CartProvider } from './context/CartContext'
import Home from './Home'
import Menu from './Menu'
import Checkout from './Checkout'
import Orders from './Orders'
import Profile from './Profile'
import Login from './Login'
import Sobre from './Sobre'
import Contato from './Contato'

function App() {
  return (
    <CartProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/profile" component={Profile} />
        <Route path="/login" component={Login} />
        <Route path="/sobre" component={Sobre} />
        <Route path="/contato" component={Contato} />
        {/* Fallback para 404 */}
        <Route>Página não encontrada</Route>
      </Switch>
    </CartProvider>
  )
}

export default App