import {useState, createContext}from 'react';

export const CartContext=createContext()

const cartProvider = ({children}) => {
    const [cartCount, setCartCount] = useState(0)
  return (
    <CartContext.Provider value={{cartCount, setCartCount}}>{children}</CartContext.Provider>
  )
}

export default cartProvider