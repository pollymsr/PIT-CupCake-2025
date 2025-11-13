import React from 'react'
import { Route, Switch } from 'wouter'
import { CartProvider } from './context/CartContext'
import Home from './Home'
import Menu from './Menu'
import Checkout from './Checkout'
import Orders from './Orders'
import Profile from './Profile'

function App() {
  return (
    <CartProvider>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/menu" component={Menu} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/orders" component={Orders} />
        <Route path="/profile" component={Profile} />
        {/* Fallback para 404 */}
        <Route>Página não encontrada</Route>
      </Switch>
    </CartProvider>
  )
}

export default App