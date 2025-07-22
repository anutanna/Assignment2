'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  quantity: number;
  productId: string;
}

interface CartContextType {
  cartCount: number;
  fetchCartItems: () => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  fetchCartItems: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: CartItem[] = await res.json();
      if (res.ok) {
        const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
      }
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
