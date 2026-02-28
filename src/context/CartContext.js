// src/context/CartContext.js
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext();

const CART_KEY = "cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // load once
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.log("Load cart error:", e?.message || e);
        setCart([]);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  // save whenever cart changes (after ready)
  useEffect(() => {
    if (!isReady) return;
    (async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      } catch (e) {
        console.log("Save cart error:", e?.message || e);
      }
    })();
  }, [cart, isReady]);

  const clearCart = useCallback(() => setCart([]), []);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const pid = String(product.id);
      const idx = prev.findIndex((x) => String(x.id) === pid);

      if (idx > -1) {
        return prev.map((x) =>
          String(x.id) === pid
            ? { ...x, quantity: (Number(x.quantity) || 0) + 1 }
            : x,
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const increaseQuantity = useCallback((id) => {
    const sid = String(id);
    setCart((prev) =>
      prev.map((x) =>
        String(x.id) === sid
          ? { ...x, quantity: (Number(x.quantity) || 0) + 1 }
          : x,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((id) => {
    const sid = String(id);
    setCart((prev) =>
      prev
        .map((x) =>
          String(x.id) === sid
            ? { ...x, quantity: (Number(x.quantity) || 0) - 1 }
            : x,
        )
        .filter((x) => (Number(x.quantity) || 0) > 0),
    );
  }, []);

  const value = useMemo(
    () => ({ cart, addToCart, increaseQuantity, decreaseQuantity, clearCart }),
    [cart, addToCart, increaseQuantity, decreaseQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
