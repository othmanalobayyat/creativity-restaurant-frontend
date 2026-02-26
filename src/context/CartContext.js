import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context for the cart
export const CartContext = createContext();

// Provider component to manage the cart state and provide it to the rest of the app
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load the cart from AsyncStorage when the component mounts
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Failed to load the cart from storage', error);
      }
    };

    loadCart();
  }, []);

  // Save the cart to AsyncStorage
  const saveCart = async (newCart) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Failed to save the cart to storage', error);
    }
  };

  // Add a product to the cart
  const addToCart = (product) => {
    const itemIndex = cart.findIndex((cartItem) => cartItem.id === product.id);
    if (itemIndex > -1) increaseQuantity(itemIndex);
    else {
      const newCart = [...cart, { ...product, quantity: 1 }];
      setCart(newCart);
      saveCart(newCart); // Save the updated cart to AsyncStorage
    }
  };

  // Increase the quantity of a product in the cart
  const increaseQuantity = (index) => {
    const newCart = [...cart];
    newCart[index].quantity += 1;
    setCart(newCart);
    saveCart(newCart); // Save the updated cart to AsyncStorage
  };

  // Decrease the quantity of a product in the cart, or remove it if quantity is 1
  const decreaseQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    } else {
      newCart.splice(index, 1);
    }
    setCart(newCart);
    saveCart(newCart); // Save the updated cart to AsyncStorage
  };

  // Value object to be provided to the context
  const value = {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  };

  // Provide the cart context to the children components
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
