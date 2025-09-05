// store/cartStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BookDetail {
  id: string;
  title: string;
  price: number;
  image: string;
  writer?: string;
  description?: string;
  stock?: number;
}

export interface CartItem {
  bookId: string;
  quantity: number;
  bookDetails: BookDetail;
  addedAt: Date;
  updatedAt: Date;
}

interface CartState {
  items: Record<string, CartItem>;
  loading: boolean;
  error: string | null;
  
  // Actions
  addToCart: (bookId: string, bookDetails: BookDetail, quantity?: number) => void;
  addToCartAsync: (bookId: string, quantity?: number) => Promise<void>;
  updateCartItem: (bookId: string, quantity: number) => void;
  incrementCartItem: (bookId: string) => void;
  decrementCartItem: (bookId: string) => void;
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  updateBookDetails: (bookId: string, bookDetails: BookDetail) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      loading: false,
      error: null,

      addToCart: (bookId, bookDetails, quantity = 1) => {
        const { items } = get();
        const existingItem = items[bookId];

        if (existingItem) {
          get().updateCartItem(bookId, existingItem.quantity + quantity);
        } else {
          const newItem: CartItem = {
            bookId,
            quantity,
            bookDetails,
            addedAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({
            items: { ...state.items, [bookId]: newItem },
          }));
        }
      },

      addToCartAsync: async (bookId, quantity = 1) => {
        get().setLoading(true);
        try {
          // Simulate API call - replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // For async, you might want to fetch book details first
          // const bookDetails = await fetchBookDetails(bookId);
          // get().addToCart(bookId, bookDetails, quantity);
          
          // For now, we'll just use a mock
          const mockBookDetails: BookDetail = {
            id: bookId,
            title: `Book ${bookId}`,
            price: 100,
            image: 'https://example.com/book.jpg',
            writer: 'Unknown Author'
          };
          
          get().addToCart(bookId, mockBookDetails, quantity);
        } catch (error) {
          set({ error: 'Failed to add item to cart' });
        } finally {
          get().setLoading(false);
        }
      },

      updateCartItem: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(bookId);
          return;
        }

        set((state) => ({
          items: {
            ...state.items,
            [bookId]: {
              ...state.items[bookId],
              quantity,
              updatedAt: new Date(),
            },
          },
        }));
      },

      incrementCartItem: (bookId) => {
        const { items } = get();
        const existingItem = items[bookId];
        if (existingItem) {
          get().updateCartItem(bookId, existingItem.quantity + 1);
        }
      },

      decrementCartItem: (bookId) => {
        const { items } = get();
        const existingItem = items[bookId];
        if (existingItem) {
          get().updateCartItem(bookId, existingItem.quantity - 1);
        }
      },

      removeFromCart: (bookId) => {
        set((state) => {
          const newItems = { ...state.items };
          delete newItems[bookId];
          return { items: newItems };
        });
      },

      clearCart: () => {
        set({ items: {} });
      },

      updateBookDetails: (bookId, bookDetails) => {
        set((state) => ({
          items: {
            ...state.items,
            [bookId]: {
              ...state.items[bookId],
              bookDetails: {
                ...state.items[bookId].bookDetails,
                ...bookDetails,
              },
            },
          },
        }));
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading) => {
        set({ loading });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors
export const selectCartItems = (state: CartState) => state.items;
export const selectCartItemsArray = (state: CartState) => 
  Object.values(state.items);
export const selectCartSummary = (state: CartState) => {
  const itemsArray = Object.values(state.items);
  const totalItems = itemsArray.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = itemsArray.reduce((sum, item) => sum + (item.bookDetails.price * item.quantity), 0);
  
  return { totalItems, subtotal };
};
export const selectCartLoading = (state: CartState) => state.loading;
export const selectCartError = (state: CartState) => state.error;
export const selectCartItem = (state: CartState, bookId: string) => state.items[bookId];
export const selectItemQuantity = (state: CartState, bookId: string) => 
  state.items[bookId]?.quantity || 0;
export const selectIsInCart = (state: CartState, bookId: string) => 
  !!state.items[bookId];
export const selectTotalItems = (state: CartState) => 
  Object.values(state.items).reduce((sum, item) => sum + item.quantity, 0);
export const selectSubtotal = (state: CartState) =>
  Object.values(state.items).reduce((sum, item) => sum + (item.bookDetails.price * item.quantity), 0);
export const selectItemCount = (state: CartState) => Object.keys(state.items).length;
export const selectIsCartEmpty = (state: CartState) => Object.keys(state.items).length === 0;