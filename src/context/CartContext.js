// src/context/CartContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

const CART_KEY = "cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(CART_KEY);
        if (saved) setCart(JSON.parse(saved));
      } catch (e) {
        console.log("Load cart error:", e?.message || e);
      }
    })();
  }, []);

  const saveCart = useCallback(async (newCart) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.log("Save cart error:", e?.message || e);
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    saveCart([]);
  }, [saveCart]);

  const addToCart = useCallback(
    (product) => {
      setCart((prev) => {
        const idx = prev.findIndex((x) => String(x.id) === String(product.id));
        let next;
        if (idx > -1) {
          next = prev.map((x) =>
            String(x.id) === String(product.id)
              ? { ...x, quantity: (Number(x.quantity) || 0) + 1 }
              : x,
          );
        } else {
          next = [...prev, { ...product, quantity: 1 }];
        }
        saveCart(next);
        return next;
      });
    },
    [saveCart],
  );

  const increaseQuantity = useCallback(
    (id) => {
      setCart((prev) => {
        const next = prev.map((x) =>
          String(x.id) === String(id)
            ? { ...x, quantity: (Number(x.quantity) || 0) + 1 }
            : x,
        );
        saveCart(next);
        return next;
      });
    },
    [saveCart],
  );

  const decreaseQuantity = useCallback(
    (id) => {
      setCart((prev) => {
        const next = prev
          .map((x) =>
            String(x.id) === String(id)
              ? { ...x, quantity: (Number(x.quantity) || 0) - 1 }
              : x,
          )
          .filter((x) => (Number(x.quantity) || 0) > 0);
        saveCart(next);
        return next;
      });
    },
    [saveCart],
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQuantity, decreaseQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
