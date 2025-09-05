import { useCartStore } from '@/store/zustand/cartStore';
import { useCallback } from 'react';

export const useCart = () => {
  const {
    items,
    loading,
    error,
    addToCart,
    addToCartAsync,
    updateCartItem,
    incrementCartItem,
    decrementCartItem,
    removeFromCart,
    clearCart,
    updateBookDetails,
    clearError,
  } = useCartStore();

  const itemsArray = Object.values(items);
  const summary = {
    totalItems: itemsArray.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: itemsArray.reduce((sum, item) => sum + (item.bookDetails.price * item.quantity), 0),
  };

  return {
    // State
    items,
    itemsArray,
    summary,
    loading,
    error,
    
    // Actions
    addItemToCart: addToCart,
    // addItemToCartAsync,
    updateItem: updateCartItem,
    incrementItem: incrementCartItem,
    decrementItem: decrementCartItem,
    removeItem: removeFromCart,
    clearAllItems: clearCart,
    updateItemBookDetails: updateBookDetails,
    clearCartError: clearError,
  };
};

export const useCartSummary = () => {
  const items = useCartStore(useCallback((state) => state.items, []));
  
  const itemsArray = Object.values(items);
  const totalItems = itemsArray.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = itemsArray.reduce((sum, item) => sum + (item.bookDetails.price * item.quantity), 0);
  const itemCount = Object.keys(items).length;
  const isEmpty = itemCount === 0;
  const loading = useCartStore(useCallback((state) => state.loading, []));

  return {
    totalItems,
    subtotal,
    itemCount,
    isEmpty,
    loading,
  };
};

export const useCartItem = (bookId: string) => {
  const cartItem = useCartStore(useCallback((state) => state.items[bookId], [bookId]));
  const quantity = cartItem?.quantity || 0;
  const isInCart = !!cartItem;
  const loading = useCartStore(useCallback((state) => state.loading, []));
  
  const {
    incrementCartItem,
    decrementCartItem,
    removeFromCart,
    updateCartItem,
    updateBookDetails,
  } = useCartStore();

  const increment = useCallback(() => {
    incrementCartItem(bookId);
  }, [bookId, incrementCartItem]);

  const decrement = useCallback(() => {
    decrementCartItem(bookId);
  }, [bookId, decrementCartItem]);

  const remove = useCallback(() => {
    removeFromCart(bookId);
  }, [bookId, removeFromCart]);

  const updateQuantity = useCallback((newQuantity: number) => {
    updateCartItem(bookId, newQuantity);
  }, [bookId, updateCartItem]);

  const updateBookDetailsForItem = useCallback((bookDetails: any) => {
    updateBookDetails(bookId, bookDetails);
  }, [bookId, updateBookDetails]);

  return {
    cartItem,
    quantity,
    isInCart,
    loading,
    increment,
    decrement,
    remove,
    updateQuantity,
    updateBookDetailsForItem,
  };
};

export const useCartActions = () => {
  const {
    addToCart,
    addToCartAsync,
    incrementCartItem,
    decrementCartItem,
    removeFromCart,
    clearCart,
    clearError,
  } = useCartStore();

  return {
    addToCart,
    addItemToCartAsync: addToCartAsync,
    incrementItem: incrementCartItem,
    decrementItem: decrementCartItem,
    removeItem: removeFromCart,
    clearAllItems: clearCart,
    clearError,
  };
};