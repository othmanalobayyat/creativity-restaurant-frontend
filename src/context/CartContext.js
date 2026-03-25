// src/context/CartContext.js
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

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
      const stock = Number(product.quantity) || 0;
      const name = product.name || "This item";

      if (stock <= 0) {
        Alert.alert("Out of stock", `${name} is currently unavailable.`);
        return prev;
      }

      if (idx > -1) {
        return prev.map((x) => {
          if (String(x.id) !== pid) return x;

          const currentQty = Number(x.quantity) || 0;
          const itemStock = Number(x.stock) || 0;

          if (currentQty >= itemStock) {
            Alert.alert(
              "Stock limit reached",
              `Only ${itemStock} available for ${x.name || name}.`,
            );
            return x;
          }

          return { ...x, quantity: currentQty + 1 };
        });
      }

      return [
        ...prev,
        {
          ...product,
          stock,
          quantity: 1,
        },
      ];
    });
  }, []);

  const increaseQuantity = useCallback((id) => {
    const sid = String(id);
    setCart((prev) =>
      prev.map((x) => {
        if (String(x.id) !== sid) return x;

        const currentQty = Number(x.quantity) || 0;
        const stock = Number(x.stock) || 0;

        if (currentQty >= stock) {
          Alert.alert(
            "Stock limit reached",
            `Only ${stock} available for ${x.name || "this item"}.`,
          );
          return x;
        }

        return { ...x, quantity: currentQty + 1 };
      }),
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
    () => ({
      cart,
      isReady,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [cart, isReady, addToCart, increaseQuantity, decreaseQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
