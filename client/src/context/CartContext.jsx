import {useState, useEffect, createContext}from 'react';


export const CartContext=createContext()

const CartProvider = ({children}) => {
    const [cartCount, setCartCount] = useState(0)
    const [cartItems, setCartItems] = useState([])

    const addToCart =(product)=>{
      const existItem = cartItems.find((item)=>item._id===product._id && item.chooseSize===product.chooseSize);
      if(existItem){
        setCartItems(cartItems.map((item)=>
          item._id === product._id && item.chooseSize === product.chooseSize ? {...item, quantity: item.quantity+1} : item
        ))
      }
      else{
        setCartItems(
          [...cartItems, product]
        )
        
        console.log(cartItems)
      }
      console.log(product)
      setCartCount(prev=> prev+1)
    }

    useEffect(()=>{
        console.log(cartItems)
    },[])

  return (
    <CartContext.Provider value={{cartCount, setCartCount, cartItems, setCartItems, addToCart}}>{children}</CartContext.Provider>
  )
}

export default CartProvider