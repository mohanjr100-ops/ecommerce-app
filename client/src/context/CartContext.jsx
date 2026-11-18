import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product to cart with quantity check
  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === product._id);
      if (existing) {
        // Enforce product stock limit
        const newQty = Math.min(existing.qty + qty, product.stock);
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, qty: newQty } : item
        );
      }
      return [
        ...prevItems,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock,
          category: product.category,
          qty: Math.min(qty, product.stock),
        },
      ];
    });
  };

  // Remove single item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== productId));
  };

  // Update specific item quantity
  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId) {
          const validatedQty = Math.min(qty, item.stock);
          return { ...item, qty: validatedQty };
        }
        return item;
      })
    );
  };

  // Clear cart completely (e.g. after successful order)
  const clearCart = () => {
    setCartItems([]);
  };

  // Total items count
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Total price sum
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice: Math.round(totalPrice * 100) / 100,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
